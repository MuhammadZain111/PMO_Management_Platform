import { STATUS_FLAG_META, PMO_PAYMENT_PLAN_TYPES, PMO_PAYMENT_PLAN_META, PMO_SERVICE_CATEGORIES } from '../data/constants';
import StatusBadge from '../components/StatusBadge';

function Toggle({ label, hint, defaultChecked }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-variant last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-on-surface-variant">{hint}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-10 h-6 bg-surface-container-highest rounded-full peer peer-checked:bg-primary-container transition-colors" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
      </label>
    </div>
  );
}

export default function Settings() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface mb-1">PMO Settings</h2>
        <p className="text-base text-on-surface-variant">Status taxonomy, milestone templates, and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Status Taxonomy</h4>
          <div className="flex flex-col gap-2">
            {Object.keys(STATUS_FLAG_META).map((k) => (
              <div key={k} className="flex items-center justify-between py-1 border-b border-surface-variant last:border-b-0">
                <StatusBadge flag={k} />
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Notification Preferences</h4>
          <Toggle label="Email me on status changes" hint="Sent when any project or service status flag changes." defaultChecked />
          <Toggle label="Weekly delivery digest" hint="A Monday morning summary of at-risk and delayed projects." defaultChecked />
          <Toggle label="Milestone due-date reminders" hint="3 days before a payment milestone is due." defaultChecked />
          <Toggle label="Invoice attachment reminders" hint="Nudge when a Paid milestone has no invoice attached." />
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Payment Plan Types</h4>
          <div className="flex flex-col gap-2">
            {PMO_PAYMENT_PLAN_TYPES.map((t) => (
              <div key={t} className="flex items-center gap-2 py-1 border-b border-surface-variant last:border-b-0">
                <span className="material-symbols-outlined text-[18px] text-primary-container">{PMO_PAYMENT_PLAN_META[t].icon}</span>
                <div>
                  <p className="text-sm font-medium">{t}</p>
                  <p className="text-xs text-on-surface-variant">{PMO_PAYMENT_PLAN_META[t].hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Service Categories</h4>
          <div className="flex flex-wrap gap-1">
            {PMO_SERVICE_CATEGORIES.map((c) => (
              <span key={c} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border border-surface-variant">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
