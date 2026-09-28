export function fmtCurrency(n) {
  return 'Rs ' + Number(n || 0).toLocaleString('en-US');
}

export function fmtDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

export function receivable(project) {
  return (Number(project.value) || 0) - (Number(project.totalReceived) || 0);
}
