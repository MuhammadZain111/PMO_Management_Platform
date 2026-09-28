import { STATUS_FLAG_META } from '../data/constants';

export default function StatusBadge({ flag }) {
  const meta = STATUS_FLAG_META[flag] || STATUS_FLAG_META['not-started'];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${meta.classes}`}>
      <span className="inline-block w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: meta.dotColor }} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
