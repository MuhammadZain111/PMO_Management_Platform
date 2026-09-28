import prisma from '../config/prisma.js';

// Fire-and-forget-ish audit write. Failures here are logged but never allowed
// to fail the primary request — an audit log outage shouldn't take down the API.
export async function audit(actorId, action, target, metadata = undefined) {
  try {
    await prisma.auditLog.create({
      data: { actorId: actorId ?? null, action, target: target ?? null, metadata: metadata ?? undefined }
    });
  } catch (err) {
    console.error('[audit] failed to write audit log', action, target, err);
  }
}
