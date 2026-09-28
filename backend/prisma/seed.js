// Seeds the full RBAC taxonomy (from src/config/rbac.js — the single source of
// truth) plus the first PMO_ADMIN user. Idempotent: safe to re-run — every
// write is an upsert, so re-running after adding a new permission to rbac.js
// picks it up without duplicating existing rows.
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PERMISSIONS, ROLES } from '../src/config/rbac.js';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

async function main() {
  console.log('Seeding permissions...');
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm
    });
  }
  const allPermissions = await prisma.permission.findMany();
  const permissionIdByName = Object.fromEntries(allPermissions.map((p) => [p.name, p.id]));
  console.log(`  ${allPermissions.length} permissions in place.`);

  console.log('Seeding roles...');
  for (const roleDef of ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { description: roleDef.description, isSystem: roleDef.isSystem },
      create: { name: roleDef.name, description: roleDef.description, isSystem: roleDef.isSystem }
    });

    // PMO_ADMIN gets every permission that exists, always — including any
    // permission added to rbac.js after this role was first created.
    const permNames = roleDef.permissions === 'ALL' ? allPermissions.map((p) => p.name) : roleDef.permissions;

    for (const permName of permNames) {
      const permissionId = permissionIdByName[permName];
      if (!permissionId) {
        console.warn(`  ! Permission "${permName}" referenced by role "${roleDef.name}" does not exist — skipped`);
        continue;
      }
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: {},
        create: { roleId: role.id, permissionId }
      });
    }
    console.log(`  ${roleDef.name}: ${permNames.length === allPermissions.length ? 'ALL' : permNames.length} permission(s)`);
  }

  console.log('Seeding first PMO administrator...');
  const email = process.env.PMO_ADMIN_EMAIL;
  const password = process.env.PMO_ADMIN_PASSWORD;
  const name = process.env.PMO_ADMIN_NAME || 'PMO Administrator';

  if (!email || !password) {
    throw new Error('PMO_ADMIN_EMAIL and PMO_ADMIN_PASSWORD must be set (see .env.example) to seed the first admin.');
  }
  if (password.length < 8) {
    throw new Error('PMO_ADMIN_PASSWORD must be at least 8 characters.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const adminUser = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {}, // never overwrite an existing admin's password/name on re-seed
    create: { name, email: email.toLowerCase(), passwordHash, status: 'ACTIVE' }
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'PMO_ADMIN' } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id }
  });

  console.log(`  PMO_ADMIN ready: ${adminUser.email}`);
  console.log('\nSeed complete.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
