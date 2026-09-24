import React, { useState, useRef, useEffect } from "react";

const assetPathPrefix = `${import.meta.env.BASE_URL}assets`;

// Icons
const imgArrowRight = `${assetPathPrefix}/ee956.svg`;
const imgHome = `${assetPathPrefix}/e8666.svg`;
const imgClipboard = `${assetPathPrefix}/769a2.svg`;
const imgGraph = `${assetPathPrefix}/91e0c.svg`;
const imgUsers = `${assetPathPrefix}/c4beb.svg`;
const imgApps = `${assetPathPrefix}/5fa18.svg`;
const imgWallet = `${assetPathPrefix}/e29e2.svg`;
const imgCog = `${assetPathPrefix}/87ae5.svg`;
const imgHelp = `${assetPathPrefix}/c8458.svg`;
const imgProfile = `${assetPathPrefix}/6c93b.svg`;
const imgRefresh = `${assetPathPrefix}/86177.svg`;
const imgChat = `${assetPathPrefix}/c3b6d.svg`;
const imgAnnouncement = `${assetPathPrefix}/4d025.svg`;
const imgFilter = `${assetPathPrefix}/946c4.svg`;
const imgMore = `${assetPathPrefix}/7f410.svg`;
const imgInfo = `${assetPathPrefix}/753ad.svg`;
const imgLine = `${assetPathPrefix}/96b81.svg`;
const imgPrevShape = `${assetPathPrefix}/1b21c.svg`;
const imgPrevLine = `${assetPathPrefix}/a452e.svg`;
const imgSparkShape = `${assetPathPrefix}/66d26.svg`;
const imgSparkLine = `${assetPathPrefix}/1fda1.svg`;
const imgRowLine = `${assetPathPrefix}/7183d.svg`;
const imgClose = `${assetPathPrefix}/e618d.svg`;
const imgSearch = `${assetPathPrefix}/a4aea.svg`;
const imgCheck = `${assetPathPrefix}/7279d.svg`;
const imgChecked = `${assetPathPrefix}/3d476.svg`;
const imgDivider = `${assetPathPrefix}/973a3.svg`;

// ─── Types ──────────────────────────────────────────────────────────────────

type AppliedFilter = {
  id: string;
  label: string;
  value: string;
};

// ─── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <div className="flex flex-col gap-[12px] h-screen items-start p-[8px] shrink-0 w-[200px] bg-[#f9f8f4] sticky top-0">
      {/* Back Office header */}
      <div className="flex gap-[4px] items-center p-[8px] rounded-[8px] w-full">
        <span className="font-['Inter:Semibold'] text-[#22201f] text-[16px] leading-[24px] whitespace-nowrap">Back Office</span>
        <img alt="" className="block size-[16px]" src={imgArrowRight} />
      </div>

      {/* Nav items */}
      <div className="flex flex-1 flex-col gap-[4px] items-start w-full min-h-0 overflow-y-auto">
        <NavItem icon={imgHome} label="Home" />
        <NavItem icon={imgClipboard} label="Products" hasArrow />

        {/* Reports with children */}
        <div className="flex flex-col gap-[8px] items-start w-full shrink-0">
          <NavItem icon={imgGraph} label="Reports" hasArrow />
          <div className="flex flex-col gap-[4px] items-start w-full pl-[24px]">
            <div className="flex items-center justify-start px-[8px] w-full rounded-[8px]">
              <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">My reports</span>
            </div>
            <div className="flex items-center justify-center px-[8px] py-[6px] w-full rounded-[8px]">
              <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1">Morning check in</span>
            </div>
          </div>
          <div className="flex flex-col gap-[4px] items-start w-full pl-[24px]">
            <div className="flex items-center justify-start px-[8px] w-full rounded-[8px]">
              <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">All reports</span>
            </div>
            {/* Active item */}
            <div className="bg-[#edeae4] flex h-[32px] items-center justify-center p-[8px] rounded-[8px] w-full">
              <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1">Sales overview</span>
            </div>
            <NavChild label="Sales feed" />
            <NavChild label="Sales by site" />
            <NavChild label="Sales by product" />
            <NavChild label="Sales by time" />
          </div>
        </div>

        <NavItem icon={imgUsers} label="People" hasArrow />
        <NavItem icon={imgApps} label="Discover" hasArrow />
        <NavItem icon={imgWallet} label="Financial services" />
        <NavItem icon={imgCog} label="Settings" />
      </div>

      {/* Bottom nav utilities */}
      <div className="flex flex-col gap-[4px] items-center w-full shrink-0">
        <div className="flex gap-[8px] items-center justify-center px-[8px] py-[6px] rounded-[8px] w-full">
          <img alt="" className="block shrink-0 size-[16px]" src={imgHelp} />
          <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate">Help &amp; support</span>
        </div>
        <div className="flex gap-[8px] items-start justify-center p-[8px] rounded-[8px] w-full">
          <div className="flex items-center py-[2px] shrink-0">
            <img alt="" className="block size-[16px]" src={imgProfile} />
          </div>
          <div className="flex flex-col gap-[2px] items-start flex-1 min-w-0">
            <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] w-full truncate">Poppy Belle</span>
            <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">My Coffee Company</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, hasArrow }: { icon: string; label: string; hasArrow?: boolean }) {
  return (
    <div className="flex gap-[8px] items-center justify-center px-[8px] py-[6px] rounded-[8px] w-full cursor-pointer hover:bg-[#edeae4] transition-colors">
      <img alt="" className="block shrink-0 size-[16px]" src={icon} />
      <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate">{label}</span>
      {hasArrow && <img alt="" className="block shrink-0 size-[16px]" src={imgArrowRight} />}
    </div>
  );
}

function NavChild({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center px-[8px] py-[6px] rounded-[8px] w-full cursor-pointer hover:bg-[#edeae4] transition-colors">
      <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate">{label}</span>
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[6px] z-50 pointer-events-none">
          <div className="bg-[#22201f] text-white font-['Inter:Regular'] text-[12px] leading-[16px] px-[8px] py-[6px] rounded-[6px] whitespace-nowrap shadow-lg">
            {text}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#22201f]" />
        </div>
      )}
    </div>
  );
}

// ─── Filter Chip ─────────────────────────────────────────────────────────────

function DefaultFilterChip({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex h-[32px] items-start rounded-[4px] overflow-hidden cursor-pointer"
    >
      <div className="bg-[#edeae4] group-hover:bg-[#e0ddd7] h-full flex flex-col items-start justify-center px-[8px] py-[6px] transition-colors">
        <span className="font-['Inter:Regular'] text-black text-[12px] leading-[16px] whitespace-nowrap">{label}</span>
      </div>
      <div className="bg-[#edf6ff] group-hover:bg-[#dbeeff] h-full flex gap-[6px] items-center px-[8px] py-[6px] transition-colors">
        <span className="font-['Inter:Medium'] text-black text-[12px] leading-[16px] whitespace-nowrap">{value}</span>
      </div>
    </button>
  );
}

function RemovableFilterChip({
  label,
  value,
  onRemove,
  onClick,
}: {
  label: string;
  value: string;
  onRemove: () => void;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex h-[32px] items-start rounded-[4px] overflow-hidden cursor-pointer"
    >
      <div className="bg-[#edeae4] group-hover:bg-[#e0ddd7] h-full flex flex-col items-start justify-center px-[8px] py-[6px] transition-colors">
        <span className="font-['Inter:Regular'] text-black text-[12px] leading-[16px] whitespace-nowrap">{label}</span>
      </div>
      <div className="bg-[#edf6ff] group-hover:bg-[#dbeeff] h-full flex gap-[6px] items-center px-[8px] py-[6px] transition-colors">
        <span className="font-['Inter:Medium'] text-black text-[12px] leading-[16px] whitespace-nowrap">{value}</span>
        <span
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="flex items-center justify-center size-[14px] rounded-full hover:bg-[#c5c1ba] transition-colors text-[#22201f]"
          aria-label="Remove filter"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
    </button>
  );
}

// ─── Site Dropdown ───────────────────────────────────────────────────────────

type SiteOption = { id: string; name: string };

const SITE_OPTIONS: SiteOption[] = [
  { id: "all", name: "All sites" },
  { id: "amberley", name: "Amberley – My Coffee Company" },
  { id: "brambleton", name: "Brambleton – My Coffee Company" },
  { id: "oakridge", name: "Oakridge – My Coffee Company" },
  { id: "pinehollow", name: "Pinehollow – My Coffee Company" },
  { id: "riverbend", name: "Riverbend – My Coffee Company" },
  { id: "willowmere", name: "Willowmere – My Coffee Company" },
];

function SiteDropdown({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (id: string, name: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[360px] overflow-hidden"
    >
      {/* All sites row */}
      <div className="p-[4px]">
        <button
          onClick={() => { onSelect("all", "All sites"); onClose(); }}
          className="flex gap-[12px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
        >
          <div className="bg-[#edeae4] rounded-[8px] shrink-0 size-[32px]" />
          <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate text-left">All sites</span>
          {selected === "all" && <img alt="" className="block shrink-0 size-[16px]" src={imgCheck} />}
        </button>
      </div>
      {/* Divider */}
      <div className="relative h-px w-full my-0">
        <img alt="" className="block w-full" src={imgDivider} />
      </div>
      {/* Individual sites */}
      <div className="p-[4px]">
        {SITE_OPTIONS.slice(1).map((site) => (
          <button
            key={site.id}
            onClick={() => { onSelect(site.id, site.name); onClose(); }}
            className="flex gap-[12px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
          >
            <div className="bg-[#edeae4] rounded-[8px] shrink-0 size-[32px]" />
            <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate text-left">{site.name}</span>
            {selected === site.id && <img alt="" className="block shrink-0 size-[16px]" src={imgCheck} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Date Dropdown ───────────────────────────────────────────────────────────

const DATE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "past-week", label: "Past week" },
  { id: "month-to-date", label: "Month to date" },
  { id: "past-4-weeks", label: "Past 4 weeks" },
  { id: "past-12-weeks", label: "Past 12 weeks" },
  { id: "year-to-date", label: "Year to date" },
  { id: "past-6-months", label: "Past 6 months" },
  { id: "past-12-months", label: "Past 12 months" },
  { id: "custom", label: "Custom", isCustom: true },
];

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
    </svg>
  );
}

function useDropdownClose(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onClose]);
}

function DateDropdown({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (id: string, label: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[240px] overflow-hidden"
    >
      <div className="p-[4px]">
        {DATE_OPTIONS.filter(o => !o.isCustom).map((opt) => {
          const dateStr = selected === opt.id ? getDateRangeLabel(opt.id) : "";
          return (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id, opt.label); onClose(); }}
              className="flex gap-[10px] items-start px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
            >
              <div className="flex flex-col flex-1 text-left">
                <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">{opt.label}</span>
                {dateStr && <span className="font-['Inter:Regular'] text-[#bbbab6] text-[12px] leading-[16px] mt-[1px]">{dateStr}</span>}
              </div>
              {selected === opt.id && <img alt="" className="block shrink-0 size-[16px] mt-[2px]" src={imgCheck} />}
            </button>
          );
        })}
      </div>
      <div className="relative h-px w-full">
        <img alt="" className="block w-full" src={imgDivider} />
      </div>
      <div className="p-[4px]">
        <button
          onClick={() => { onSelect("custom", "Custom"); onClose(); }}
          className="flex gap-[10px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
        >
          <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] flex-1 text-left">Custom</span>
          {selected === "custom" && <img alt="" className="block shrink-0 size-[16px]" src={imgCheck} />}
        </button>
      </div>
    </div>
  );
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TODAY_NAME = DAYS[new Date().getDay()];
const YESTERDAY_NAME = DAYS[(new Date().getDay() + 6) % 7];

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function startOfWeek(d: Date) {
  const r = new Date(d); r.setDate(r.getDate() - ((r.getDay() + 6) % 7)); return r;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const _today = new Date();
_today.setHours(0,0,0,0);

function getDateRangeLabel(id: string, _dateId?: string): string {
  const t = _today;
  const yesterday = addDays(t, -1);

  switch (id) {
    case "today":              return fmtDate(t);
    case "yesterday":          return fmtDate(yesterday);
    case "past-week": {
      const s = addDays(t, -6);
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    case "month-to-date": {
      const s = startOfMonth(t);
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    case "past-4-weeks": {
      const s = addDays(t, -27);
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    case "past-12-weeks": {
      const s = addDays(t, -83);
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    case "year-to-date": {
      const s = new Date(t.getFullYear(), 0, 1);
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    case "past-6-months": {
      const s = new Date(t.getFullYear(), t.getMonth() - 6, t.getDate());
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    case "past-12-months": {
      const s = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate() + 1);
      return `${fmtShort(s)} – ${fmtShort(t)}`;
    }
    // Compare-to options
    case "last-same-day": {
      return fmtDate(addDays(t, -7));
    }
    case "day-before": {
      return fmtDate(addDays(t, -2));
    }
    case "last-week-same-day": {
      return fmtDate(addDays(_dateId === "yesterday" ? yesterday : t, -7));
    }
    case "last-year-same-day": {
      const base = _dateId === "yesterday" ? yesterday : t;
      return fmtDate(new Date(base.getFullYear() - 1, base.getMonth(), base.getDate()));
    }
    case "prev-week": {
      const sw = startOfWeek(t);
      const s = addDays(sw, -7);
      return `${fmtShort(s)} – ${fmtShort(addDays(s, 6))}`;
    }
    case "same-week-last-year": {
      const sw = startOfWeek(t);
      const s = new Date(sw.getFullYear() - 1, sw.getMonth(), sw.getDate());
      return `${fmtShort(s)} – ${fmtShort(addDays(s, 6))}`;
    }
    case "prev-month": {
      const s = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      const e = new Date(t.getFullYear(), t.getMonth(), 0);
      return `${fmtShort(s)} – ${fmtShort(e)}`;
    }
    case "prev-4-weeks": {
      const s = addDays(t, -55);
      return `${fmtShort(s)} – ${fmtShort(addDays(t, -28))}`;
    }
    case "prev-12-weeks": {
      const s = addDays(t, -167);
      return `${fmtShort(s)} – ${fmtShort(addDays(t, -84))}`;
    }
    case "prev-6-months": {
      const s = new Date(t.getFullYear(), t.getMonth() - 12, t.getDate());
      const e = new Date(t.getFullYear(), t.getMonth() - 6, t.getDate() - 1);
      return `${fmtShort(s)} – ${fmtShort(e)}`;
    }
    case "prev-12-months": {
      const s = new Date(t.getFullYear() - 2, t.getMonth(), t.getDate() + 1);
      const e = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate());
      return `${fmtShort(s)} – ${fmtShort(e)}`;
    }
    case "prev-year-to-date": {
      const s = new Date(t.getFullYear() - 1, 0, 1);
      const e = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate());
      return `${fmtShort(s)} – ${fmtShort(e)}`;
    }
    case "last-year": {
      return `${t.getFullYear() - 1}`;
    }
    case "same-period-last-year":
    case "prev-period":
      return "";
    default: return "";
  }
}

// ─── Compare To Dropdown ──────────────────────────────────────────────────────

const COMPARE_TO_OPTIONS: Record<string, Array<{ id: string; label: string }>> = {
  "today":          [{ id: "last-same-day", label: `last ${TODAY_NAME}` }, { id: "yesterday", label: "Yesterday" }, { id: "last-week-same-day", label: "Last week (same day)" }, { id: "last-year-same-day", label: "Last year (same day)" }],
  "yesterday":      [{ id: "day-before", label: "Day before yesterday" }, { id: "last-week-same-day", label: `Last ${YESTERDAY_NAME}` }, { id: "last-year-same-day", label: "Last year (same day)" }],
  "past-week":      [{ id: "prev-week", label: "Previous week" }, { id: "same-week-last-year", label: "Same week last year" }],
  "month-to-date":  [{ id: "prev-month", label: "Previous month to date" }, { id: "same-period-last-year", label: "Same period last year" }],
  "past-4-weeks":   [{ id: "prev-4-weeks", label: "Previous 4 weeks" }, { id: "same-period-last-year", label: "Same period last year" }],
  "past-12-weeks":  [{ id: "prev-12-weeks", label: "Previous 12 weeks" }, { id: "same-period-last-year", label: "Same period last year" }],
  "year-to-date":   [{ id: "prev-year-to-date", label: "Previous year to date" }, { id: "last-year", label: "Last year" }],
  "past-6-months":  [{ id: "prev-6-months", label: "Previous 6 months" }, { id: "same-period-last-year", label: "Same period last year" }],
  "past-12-months": [{ id: "prev-12-months", label: "Previous 12 months" }, { id: "same-period-last-year", label: "Same period last year" }],
  "custom":         [{ id: "prev-period", label: "Previous period" }, { id: "same-period-last-year", label: "Same period last year" }],
};

function CompareToDropdown({
  dateId,
  selected,
  onSelect,
  onClose,
}: {
  dateId: string;
  selected: string;
  onSelect: (id: string, label: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  const options = COMPARE_TO_OPTIONS[dateId] ?? COMPARE_TO_OPTIONS["today"];

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[260px] overflow-hidden"
    >
      <div className="p-[4px]">
        {options.map((opt) => {
          const dateStr = selected === opt.id ? getDateRangeLabel(opt.id, dateId) : "";
          return (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id, opt.label); onClose(); }}
              className="flex gap-[10px] items-start px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
            >
              <div className="flex flex-col flex-1 text-left">
                <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">{opt.label}</span>
                {dateStr && <span className="font-['Inter:Regular'] text-[#bbbab6] text-[12px] leading-[16px] mt-[1px]">{dateStr}</span>}
              </div>
              {selected === opt.id && <img alt="" className="block shrink-0 size-[16px] mt-[2px]" src={imgCheck} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Filter Drawer ───────────────────────────────────────────────────────────

type CheckboxState = {
  registerA: boolean; registerB: boolean; registerC: boolean;
  registerD: boolean; registerE: boolean; registerF: boolean;
  food: boolean; drinks: boolean; other: boolean;
  alcohol: boolean; coffee: boolean; pastries: boolean;
  otherDrinks: boolean; toasties: boolean; sweets: boolean;
};

const DEFAULT_CHECKBOXES: CheckboxState = {
  registerA: false, registerB: false, registerC: false,
  registerD: false, registerE: false, registerF: false,
  food: false, drinks: false, other: false,
  alcohol: false, coffee: false, pastries: false,
  otherDrinks: false, toasties: false, sweets: false,
};

function FilterDrawer({
  open,
  onClose,
  initialState,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  initialState: CheckboxState;
  onApply: (state: CheckboxState) => void;
}) {
  const [checks, setChecks] = useState<CheckboxState>(initialState);

  useEffect(() => {
    setChecks(initialState);
  }, [initialState, open]);

  function toggle(key: keyof CheckboxState) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function CheckboxRow({ label, field }: { label: string; field: keyof CheckboxState }) {
    return (
      <button
        onClick={() => toggle(field)}
        className="flex gap-[12px] items-start w-full text-left"
      >
        <div className={`relative shrink-0 size-[20px] mt-[1px] rounded-[4px] ${checks[field] ? "" : "bg-white border border-[#bbbab6] overflow-clip"}`}>
          {checks[field] && <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChecked} />}
        </div>
        <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">{label}</span>
      </button>
    );
  }

  const registersSelected = [
    checks.registerA, checks.registerB, checks.registerC,
    checks.registerD, checks.registerE, checks.registerF,
  ].filter(Boolean).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-[-4px_0px_24px_0px_rgba(0,0,0,0.08)] flex flex-col transition-transform duration-300 ease-in-out w-[400px]`}
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#e3e2dd] shrink-0">
          <span className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[28px]">Filters</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-[32px] rounded-full hover:bg-[#f2f0ea] transition-colors"
          >
            <img alt="" className="block size-[16px]" src={imgClose} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-[16px] py-[16px] flex flex-col gap-[24px] min-h-0">
          {/* Registers */}
          <div className="flex flex-col gap-[12px]">
            <span className="font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">Registers</span>
            <div className="flex flex-col gap-[10px]">
              <CheckboxRow label="Register A" field="registerA" />
              <CheckboxRow label="Register B" field="registerB" />
              <CheckboxRow label="Register C" field="registerC" />
              <CheckboxRow label="Register D" field="registerD" />
              <CheckboxRow label="Register E" field="registerE" />
              <CheckboxRow label="Register F" field="registerF" />
            </div>
            <button className="font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[20px] text-left">Show all</button>
          </div>

          {/* Reporting groups */}
          <div className="flex flex-col gap-[12px]">
            <span className="font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">Reporting groups</span>
            <div className="flex flex-col gap-[10px]">
              <CheckboxRow label="Food" field="food" />
              <CheckboxRow label="Drinks" field="drinks" />
              <CheckboxRow label="Other" field="other" />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-[12px]">
            <span className="font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">Category</span>
            <div className="flex flex-col gap-[10px]">
              <CheckboxRow label="Alcohol" field="alcohol" />
              <CheckboxRow label="Coffee" field="coffee" />
              <CheckboxRow label="Pastries" field="pastries" />
              <CheckboxRow label="Other drinks" field="otherDrinks" />
              <CheckboxRow label="Toasties" field="toasties" />
              <CheckboxRow label="Sweets" field="sweets" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-[8px] items-center px-[16px] py-[16px] border-t border-[#e3e2dd] shrink-0">
          <button
            onClick={() => { onApply(checks); onClose(); }}
            className="flex-1 bg-[#1e72c4] text-white font-['Inter:Semibold'] text-[14px] leading-[20px] h-[40px] rounded-[8px] hover:bg-[#1a64ae] transition-colors"
          >
            {registersSelected > 0 ? `Apply filters` : "Apply filters"}
          </button>
          <button
            onClick={() => setChecks(DEFAULT_CHECKBOXES)}
            className="flex-1 bg-white border border-[#e3e2dd] text-[#22201f] font-['Inter:Semibold'] text-[14px] leading-[20px] h-[40px] rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] hover:bg-[#f9f8f4] transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <Tooltip text={tooltip}>
      <img alt="" className="block shrink-0 size-[16px] cursor-default" src={imgInfo} />
    </Tooltip>
  );
}

// ─── Hourly Sales Chart ───────────────────────────────────────────────────────

const HALF_HOURS = [
  "7:00","7:30","8:00","8:30","9:00","9:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","1:00","1:30","2:00","2:30",
];

const CURRENT_DATA = [120,185,310,420,510,580,640,690,720,760,810,770,680,590,480,320];
const PREV_DATA    = [100,155,270,360,430,490,530,570,600,630,670,640,580,510,420,280];

function HourlySalesChart({ compareLabel, isRefreshing }: { compareLabel: string; isRefreshing?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 600, H = 140;
  const PAD_T = 8, PAD_B = 4, PAD_L = 0, PAD_R = 0;
  const Y_LABEL_W = 36;
  const maxVal = Math.max(...CURRENT_DATA, ...PREV_DATA);
  const Y_TICKS = [0.25, 0.5, 0.75, 1];

  function xv(i: number) {
    return PAD_L + (i / (CURRENT_DATA.length - 1)) * (W - PAD_L - PAD_R);
  }
  function yv(v: number) {
    return PAD_T + (1 - v / (maxVal * 1.05)) * (H - PAD_T - PAD_B);
  }
  function xPct(i: number) {
    return (xv(i) / W) * 100;
  }

  function makeLine(data: number[]) {
    return data.map((v, i) => `${xv(i)},${yv(v)}`).join(" ");
  }
  function makeArea(data: number[]) {
    const pts = data.map((v, i) => `${xv(i)},${yv(v)}`).join(" ");
    return `${xv(0)},${H} ${pts} ${xv(data.length - 1)},${H}`;
  }

  const tooltipX = hovered !== null ? xPct(hovered) : 0;
  const curY = hovered !== null ? (yv(CURRENT_DATA[hovered]) / H) * 100 : 0;
  const prevY = hovered !== null ? (yv(PREV_DATA[hovered]) / H) * 100 : 0;

  // label every whole hour
  const X_LABELS = ["7am","8am","9am","10am","11am","12pm","1pm","2pm"];

  return (
    <div className="w-full flex flex-col gap-[8px]">
      <div className="flex gap-[0px] w-full">
        {/* Y-axis labels */}
        <div className="relative shrink-0 font-['Inter:Regular'] text-[#bbbab6] text-[10px] leading-none" style={{ width: Y_LABEL_W, height: H }}>
          {Y_TICKS.map((f) => {
            const val = Math.round(maxVal * 1.05 * f);
            const top = PAD_T + (1 - f) * (H - PAD_T - PAD_B);
            return (
              <span
                key={f}
                className="absolute right-[6px] -translate-y-1/2"
                style={{ top }}
              >
                ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </span>
            );
          })}
        </div>

        {/* Chart area */}
        <div className="relative flex-1 min-w-0" style={{ height: H }}>
        {isRefreshing && <div className="absolute inset-0 z-10 flex flex-col justify-between py-[8px] gap-[8px]">
          {[1,2,3].map(i => <Sk key={i} w="w-full" h="h-[20px]" />)}
        </div>}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="curGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e72c4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e72c4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bbbab6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#bbbab6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Y_TICKS.map((f) => {
            const y = PAD_T + (1 - f) * (H - PAD_T - PAD_B);
            return <line key={f} x1={0} y1={y} x2={W} y2={y} stroke="#e3e2dd" strokeWidth="0.6" />;
          })}

          {/* Previous period area + line */}
          <polygon points={makeArea(PREV_DATA)} fill="url(#prevGrad)" />
          <polyline points={makeLine(PREV_DATA)} fill="none" stroke="#bbbab6" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Current period area + line */}
          <polygon points={makeArea(CURRENT_DATA)} fill="url(#curGrad)" />
          <polyline points={makeLine(CURRENT_DATA)} fill="none" stroke="#1e72c4" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* Hover vertical line */}
          {hovered !== null && (
            <line
              x1={xv(hovered)} y1={0} x2={xv(hovered)} y2={H}
              stroke="#22201f" strokeWidth="0.8" strokeDasharray="3,3"
            />
          )}

          {/* Invisible hover targets */}
          {CURRENT_DATA.map((_, i) => {
            const slotW = W / CURRENT_DATA.length;
            return (
              <rect
                key={i}
                x={xv(i) - slotW / 2} y={0} width={slotW} height={H}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
              />
            );
          })}
        </svg>

        {hovered !== null && (
          <>
            <span
              className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#bbbab6] bg-white"
              style={{ left: `${tooltipX}%`, top: `${prevY}%` }}
            />
            <span
              className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#1e72c4] bg-white"
              style={{ left: `${tooltipX}%`, top: `${curY}%` }}
            />
          </>
        )}

        {/* Tooltip card */}
        {hovered !== null && (() => {
          const pct = xPct(hovered) / 100;
          const side = pct > 0.65 ? "right" : "left";
          return (
            <div
              className="pointer-events-none absolute z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_8px_0px_rgba(18,18,18,0.1)] px-[12px] py-[10px] flex flex-col gap-[6px] min-w-[160px]"
              style={{
                top: 8,
                ...(side === "left"
                  ? { left: `calc(${xPct(hovered)}% + 10px)` }
                  : { right: `calc(${100 - xPct(hovered)}% + 10px)` }),
              }}
            >
              <span className="font-['Inter:Medium'] text-[#22201f] text-[12px] leading-[16px]">{HALF_HOURS[hovered]}</span>
              <div className="flex items-center gap-[8px]">
                <span className="inline-block size-[8px] rounded-full bg-[#1e72c4] shrink-0" />
                <span className="font-['Inter:Regular'] text-[#22201f] text-[13px] leading-[18px]">Today</span>
                <span className="font-['Inter:Medium'] text-[#22201f] text-[13px] leading-[18px] ml-auto pl-[12px]">${CURRENT_DATA[hovered]}</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="inline-block size-[8px] rounded-full bg-[#bbbab6] shrink-0" />
                <span className="font-['Inter:Regular'] text-[#62615d] text-[13px] leading-[18px] flex-1 min-w-0 truncate">{compareLabel}</span>
                <span className="font-['Inter:Medium'] text-[#62615d] text-[13px] leading-[18px] ml-auto pl-[12px]">${PREV_DATA[hovered]}</span>
              </div>
            </div>
          );
        })()}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex gap-[0px] w-full">
        <div style={{ width: Y_LABEL_W }} className="shrink-0" />
        <div className="relative flex-1 min-w-0 font-['Inter:Regular'] text-[#62615d] text-[11px]" style={{ height: 16 }}>
        {X_LABELS.map((label, idx) => {
          const dataIdx = idx * 2;
          return (
            <span
              key={label}
              className="absolute -translate-x-1/2"
              style={{ left: `${xPct(dataIdx)}%` }}
            >
              {label}
            </span>
          );
        })}
        </div>
      </div>
    </div>
  );
}

function Sk({ w, h = "h-[16px]" }: { w: string; h?: string }) {
  return <span className={`skeleton ${w} ${h} align-middle`} />;
}

function KpiCard({ label, value, change, changeColor, compareLabel, isRefreshing }: { label: string; value: string; change?: string; changeColor?: string; compareLabel?: string; isRefreshing?: boolean }) {
  return (
    <WidgetCard className="flex-1 min-w-0">
    <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
      <div className="flex gap-[8px] items-center w-full">
        <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px] flex-1 min-w-0">{label}</span>
        <AskButton label="Ask" />
        <InfoIcon tooltip={`${label} for the selected period`} />
      </div>
      <div className="flex flex-col gap-[8px] items-start w-full">
        {isRefreshing
          ? <Sk w="w-[100px]" h="h-[32px]" />
          : <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px] block w-full">{value}</span>
        }
        {change && (
          isRefreshing
            ? <Sk w="w-[160px]" h="h-[16px]" />
            : <p className="text-[0px] leading-[0] w-full">
                <span className={`font-['Inter:Semi_Bold'] font-semibold text-[14px] leading-[24px] ${changeColor}`}>{change} </span>
                <span className="text-[#62615d] text-[14px] leading-[20px]">vs {compareLabel ?? "previous period"}</span>
              </p>
        )}
      </div>
    </div>
    </WidgetCard>
  );
}

function ProductRow({ rank, name, count, change, positive, isRefreshing }: { rank: number; name: string; count: number; change: string; positive: boolean; isRefreshing?: boolean }) {
  return (
    <>
      <div className="flex gap-[8px] items-center px-[4px] w-full">
        <div className="flex gap-[8px] items-center flex-1 min-w-0">
          <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px] w-[10px] shrink-0">{rank}</span>
          <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] flex-1 min-w-0 truncate">{name}</span>
        </div>
        {isRefreshing ? <Sk w="w-[28px]" /> : <span className="font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[24px] whitespace-nowrap">{count}</span>}
        {isRefreshing ? <Sk w="w-[44px]" /> : <span className={`font-['Inter:Semibold'] text-[14px] leading-[24px] text-right w-[60px] ${positive ? "text-[#008e13]" : "text-[#8e1311]"}`}>{change}</span>}
      </div>
      <div className="relative h-0 w-full shrink-0">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgRowLine} />
        </div>
      </div>
    </>
  );
}

function TopListCard({ title, items, compareLabel, isRefreshing }: { title: string; compareLabel: string; isRefreshing?: boolean; items: Array<{ rank: number; name: string; count: number; change: string; positive: boolean }> }) {
  const top = items[0];
  return (
    <WidgetCard className="flex-1 min-w-0 self-stretch">
    <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
      <div className="flex gap-[8px] items-center w-full shrink-0">
        <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px] flex-1 min-w-0">{title}</span>
        <AskButton label="Ask" />
        <InfoIcon tooltip={title} />
      </div>
      {/* Highlight — #1 item */}
      <div className="flex flex-col gap-[4px] items-start shrink-0 w-full">
        {isRefreshing
          ? <Sk w="w-[80px]" h="h-[32px]" />
          : <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px] truncate w-full">{top.name}</span>
        }
        {isRefreshing
          ? <Sk w="w-[180px]" h="h-[16px]" />
          : <p className="text-[0px] leading-[0] w-full">
              <span className="font-['Inter:Semi_Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px]">{top.count} units sold • </span>
              <span className={`font-['Inter:Semi_Bold'] font-semibold text-[14px] leading-[20px] ${top.positive ? "text-[#008e13]" : "text-[#8e1311]"}`}>{top.change} </span>
              <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">vs {compareLabel}</span>
            </p>
        }
      </div>
      <div className="flex flex-col gap-[12px] items-start w-full flex-1">
        {items.map((item) => (
          <ProductRow key={item.rank} {...item} isRefreshing={isRefreshing} />
        ))}
      </div>
      <span className="font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] cursor-pointer hover:underline">See more</span>
    </div>
    </WidgetCard>
  );
}

function SiteTableRow({ rank, name, today, last, diff, positive, isRefreshing }: { rank: number; name: string; today: string; last: string; diff: string; positive: boolean; isRefreshing?: boolean }) {
  return (
    <div className="border-b border-[#e3e2dd] flex gap-[16px] items-center pl-[4px] pr-[12px] py-[12px] w-full">
      <span className="font-['Inter:Regular'] text-[#62615d] text-[13px] leading-[24px] w-[20px] shrink-0 text-right">{rank}</span>
      <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] flex-1 min-w-0">{name}</span>
      {isRefreshing ? <Sk w="w-[72px]" h="h-[16px]" /> : <span className="font-['Inter:Regular'] text-black text-[14px] leading-[24px] text-right w-[120px] shrink-0">{today}</span>}
      {isRefreshing ? <Sk w="w-[72px]" h="h-[16px]" /> : <span className="font-['Inter:Regular'] text-black text-[14px] leading-[24px] text-right w-[120px] shrink-0">{last}</span>}
      {isRefreshing ? <Sk w="w-[48px]" h="h-[16px]" /> : <span className={`font-['Inter:Semibold'] text-[14px] leading-[24px] text-right w-[120px] shrink-0 ${positive ? "text-[#008e13]" : "text-[#8e1311]"}`}>{diff}</span>}
    </div>
  );
}

// ─── More Menu ───────────────────────────────────────────────────────────────

const imgMenuViews  = `${assetPathPrefix}/c4128.svg`;
const imgMenuDivider = `${assetPathPrefix}/0f2e1.svg`;
const imgMenuBin = `${assetPathPrefix}/b8944.svg`;
const imgMenuExport = `${assetPathPrefix}/663bf.svg`;
const imgMenuEmail = `${assetPathPrefix}/58f6c.svg`;
const imgMenuArrow = `${assetPathPrefix}/ee956.svg`;
const imgMenuDivider2 = `${assetPathPrefix}/86600.svg`;
const imgModalClose = `${assetPathPrefix}/a578b.svg`;

// ─── Save View Modal ──────────────────────────────────────────────────────────

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[200] flex items-center gap-[10px] bg-[#22201f] text-white rounded-[10px] px-[16px] py-[12px] shadow-[0px_4px_16px_0px_rgba(18,18,18,0.2)] font-['Inter:Regular'] text-[14px] leading-[20px] whitespace-nowrap pointer-events-none">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <circle cx="8" cy="8" r="7" stroke="#4ade80" strokeWidth="1.5"/>
        <path d="M5 8l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {message}
    </div>
  );
}

// ─── Save Filters Modal ───────────────────────────────────────────────────────

function SaveViewModal({
  onClose,
  onSave,
  onUpdate,
  existingFilters,
  hasExisting,
}: {
  onClose: () => void;
  onSave: (name: string) => void;
  onUpdate: (name: string) => void;
  existingFilters: string[];
  hasExisting: boolean;
}) {
  const [mode, setMode] = useState<"existing" | "new">(hasExisting ? "existing" : "new");
  const [selectedExisting, setSelectedExisting] = useState(existingFilters[0] ?? "");
  const [newName, setNewName] = useState("");

  const canSave = mode === "existing" ? !!selectedExisting : !!newName.trim();

  function handleSave() {
    if (!canSave) return;
    if (mode === "existing") {
      onUpdate(selectedExisting);
    } else {
      onSave(newName.trim());
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(70,74,81,0.6)]" onClick={onClose}>
      <div
        className="bg-white rounded-[12px] shadow-[0px_8px_8px_0px_rgba(18,18,18,0.04),0px_4px_4px_0px_rgba(18,18,18,0.08),0px_1px_1px_0px_rgba(18,18,18,0.12)] p-[24px] flex flex-col gap-[24px] w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heading */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex gap-[16px] items-start">
            <p className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[32px] flex-1 min-w-0">Save filters</p>
            <button onClick={onClose} className="shrink-0 size-[16px] mt-[8px] hover:opacity-70 transition-opacity">
              <img alt="Close" className="block size-full" src={imgModalClose} />
            </button>
          </div>
          <p className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px]">
            Keep your filters and comparisons so you can jump back in with one click.
          </p>
        </div>

        {/* Mode selection — only when saved filters exist */}
        {hasExisting && (
          <div className="flex flex-col gap-[12px]">
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${mode === "existing" ? "border-[#1e72c4]" : "border-[#bbbab6]"}`}
                onClick={() => setMode("existing")}
              >
                {mode === "existing" && <div className="size-[8px] rounded-full bg-[#1e72c4]" />}
              </div>
              <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]" onClick={() => setMode("existing")}>Save to existing filter</span>
            </label>
            {mode === "existing" && (
              <select
                className="bg-white border border-[#bbbab6] rounded-[8px] h-[40px] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4] ml-[26px]"
                style={{ width: "calc(100% - 26px)" }}
                value={selectedExisting}
                onChange={(e) => setSelectedExisting(e.target.value)}
              >
                {existingFilters.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            )}
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${mode === "new" ? "border-[#1e72c4]" : "border-[#bbbab6]"}`}
                onClick={() => setMode("new")}
              >
                {mode === "new" && <div className="size-[8px] rounded-full bg-[#1e72c4]" />}
              </div>
              <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]" onClick={() => setMode("new")}>Save new filter</span>
            </label>
            {mode === "new" && (
              <div className="flex flex-col gap-[4px] ml-[26px]" style={{ width: "calc(100% - 26px)" }}>
                <input
                  className="bg-white border border-[#bbbab6] rounded-[8px] h-[40px] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
                  placeholder="Filter name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* Simple name input — when no saved filters exist */}
        {!hasExisting && (
          <div className="flex flex-col gap-[4px]">
            <label className="font-['Inter:Semi Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px] tracking-[0.014px]">Name</label>
            <input
              className="bg-white border border-[#bbbab6] rounded-[8px] h-[40px] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="bg-[#1e72c4] text-white font-['Inter:Semi Bold'] font-semibold text-[14px] leading-[20px] tracking-[0.014px] rounded-[8px] h-[40px] w-full shadow-[0px_1px_0px_0px_rgba(0,0,0,0.1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[#1660a8]"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─── More Menu ────────────────────────────────────────────────────────────────

function MoreMenu({
  savedFilters,
  onClose,
  onApplyFilter,
  onDeleteFilter,
}: {
  savedFilters: Array<{ name: string }>;
  onClose: () => void;
  onApplyFilter: (name: string) => void;
  onDeleteFilter: (name: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [viewsHovered, setViewsHovered] = useState(false);
  useDropdownClose(ref, onClose);

  return (
    <div
      ref={ref}
      className="absolute top-[40px] right-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[200px] overflow-visible p-[4px]"
    >
      {/* Saved filters row with submenu */}
      <div
        className="relative flex gap-[8px] h-[36px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors cursor-default"
        onMouseEnter={() => setViewsHovered(true)}
        onMouseLeave={() => setViewsHovered(false)}
      >
        <img alt="" className="shrink-0 size-[16px]" src={imgMenuViews} />
        <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] flex-1">Saved filters</span>
        <img alt="" className="shrink-0 size-[16px]" src={imgMenuArrow} />

        {viewsHovered && (
          <div className="absolute top-[-4px] left-[-212px] z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[208px] p-[4px]">
            {savedFilters.length === 0 ? (
              <div className="px-[12px] py-[10px] flex flex-col gap-[2px]">
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">No saved filters</span>
                <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">Save a filter set to access it here.</span>
              </div>
            ) : (
              savedFilters.map((f) => (
                <div
                  key={f.name}
                  className="group flex gap-[8px] h-[36px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
                >
                  <button
                    className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate text-left"
                    onClick={() => { onApplyFilter(f.name); onClose(); }}
                  >
                    {f.name}
                  </button>
                  <button
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onDeleteFilter(f.name); }}
                    title="Delete"
                  >
                    <img alt="Delete" className="block size-[16px]" src={imgMenuBin} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Export */}
      <button
        onClick={onClose}
        className="flex gap-[8px] h-[36px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
      >
        <img alt="" className="shrink-0 size-[16px]" src={imgMenuExport} />
        <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] flex-1 text-left">Export</span>
      </button>

      {/* Schedule send */}
      <button
        onClick={onClose}
        className="flex gap-[8px] h-[36px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
      >
        <img alt="" className="shrink-0 size-[16px]" src={imgMenuEmail} />
        <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] flex-1 text-left">Schedule send</span>
      </button>
    </div>
  );
}

// ─── Widget Card ─────────────────────────────────────────────────────────────

function AskButton({ label = "Ask" }: { label?: string }) {
  return (
    <button className="flex items-center gap-[4px] opacity-0 group-hover:opacity-100 transition-opacity text-[#1e72c4] hover:text-[#1458a0]">
      <img alt="" className="block shrink-0" style={{ width: 13.33, height: 13.33 }} src={`${assetPathPrefix}/d5311.svg`} />
      <span className="font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] text-current">{label}</span>
    </button>
  );
}

function WidgetCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {children}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [siteSelected, setSiteSelected] = useState<{ id: string; name: string }>({ id: "all", name: "All sites" });
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [dateSelected, setDateSelected] = useState<{ id: string; label: string }>({ id: "today", label: "Today" });
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [compareSelected, setCompareSelected] = useState<{ id: string; label: string }>({ id: "last-same-day", label: `last ${TODAY_NAME}` });
  const [showCompareDropdown, setShowCompareDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [drawerState, setDrawerState] = useState<CheckboxState>(DEFAULT_CHECKBOXES);
  const [hasUnapplied, setHasUnapplied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [now, setNow] = useState<Date>(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  function refreshData() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      setNow(new Date());
    }, 800);
  }

  function formatLastUpdated(last: Date, current: Date): string {
    const diffMs = current.getTime() - last.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Updated just now";
    if (mins === 1) return "Updated 1 minute ago";
    return `Updated ${mins} minutes ago`;
  }

  type SavedFilter = {
    name: string;
    site: { id: string; name: string };
    date: { id: string; label: string };
    compare: { id: string; label: string };
    applied: AppliedFilter[];
    drawer: CheckboxState;
  };
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const moreRef = useRef<HTMLDivElement>(null);
  const siteChipRef = useRef<HTMLDivElement>(null);

  const isFilteredFromDefault =
    siteSelected.id !== "all" ||
    dateSelected.id !== "today" ||
    compareSelected.id !== "last-same-day" ||
    appliedFilters.length > 0;

  const isSaved = savedFilters.some(
    (f) =>
      f.site.id === siteSelected.id &&
      f.date.id === dateSelected.id &&
      f.compare.id === compareSelected.id &&
      JSON.stringify(f.applied) === JSON.stringify(appliedFilters)
  );

  function applyFilter(f: SavedFilter) {
    setSiteSelected(f.site);
    setDateSelected(f.date);
    setCompareSelected(f.compare);
    setAppliedFilters(f.applied);
    setDrawerState(f.drawer);
    setHasUnapplied(false);
  }

  function saveCurrentFilters(name: string) {
    setSavedFilters((prev) => [
      ...prev,
      {
        name,
        site: siteSelected,
        date: dateSelected,
        compare: compareSelected,
        applied: appliedFilters,
        drawer: drawerState,
      },
    ]);
    setToast(`"${name}" saved`);
  }

  function deleteFilter(name: string) {
    setSavedFilters((prev) => prev.filter((f) => f.name !== name));
  }

  function updateFilter(name: string) {
    setSavedFilters((prev) =>
      prev.map((f) =>
        f.name === name
          ? { ...f, site: siteSelected, date: dateSelected, compare: compareSelected, applied: appliedFilters, drawer: drawerState }
          : f
      )
    );
    setToast(`"${name}" updated`);
  }

  function openDrawer() {
    setDrawerOpen(true);
  }

  function handleApply(state: CheckboxState) {
    setDrawerState(state);
    const newFilters: AppliedFilter[] = [];

    const selectedRegisters = [
      state.registerA && "Register A",
      state.registerB && "Register B",
      state.registerC && "Register C",
      state.registerD && "Register D",
      state.registerE && "Register E",
      state.registerF && "Register F",
    ].filter(Boolean) as string[];

    if (selectedRegisters.length > 0) {
      newFilters.push({
        id: "registers",
        label: "Registers",
        value: `${selectedRegisters.length} register${selectedRegisters.length > 1 ? "s" : ""}`,
      });
    }

    const selectedGroups = [
      state.food && "Food",
      state.drinks && "Drinks",
      state.other && "Other",
    ].filter(Boolean) as string[];

    if (selectedGroups.length > 0) {
      newFilters.push({
        id: "groups",
        label: "Reporting groups",
        value: `${selectedGroups.length} selected`,
      });
    }

    const selectedCategories = [
      state.alcohol && "Alcohol",
      state.coffee && "Coffee",
      state.pastries && "Pastries",
      state.otherDrinks && "Other drinks",
      state.toasties && "Toasties",
      state.sweets && "Sweets",
    ].filter(Boolean) as string[];

    if (selectedCategories.length > 0) {
      newFilters.push({
        id: "categories",
        label: "Category",
        value: `${selectedCategories.length} selected`,
      });
    }

    setAppliedFilters(newFilters);
    setHasUnapplied(newFilters.length > 0);
  }

  function removeFilter(id: string) {
    const updated = appliedFilters.filter((f) => f.id !== id);
    setAppliedFilters(updated);
    if (updated.length === 0) setHasUnapplied(false);
    // Reset relevant checkboxes
    if (id === "registers") {
      setDrawerState((prev) => ({
        ...prev,
        registerA: false, registerB: false, registerC: false,
        registerD: false, registerE: false, registerF: false,
      }));
    } else if (id === "groups") {
      setDrawerState((prev) => ({ ...prev, food: false, drinks: false, other: false }));
    } else if (id === "categories") {
      setDrawerState((prev) => ({
        ...prev,
        alcohol: false, coffee: false, pastries: false,
        otherDrinks: false, toasties: false, sweets: false,
      }));
    }
  }

  function reset() {
    setAppliedFilters([]);
    setHasUnapplied(false);
    setDrawerState(DEFAULT_CHECKBOXES);
    setSiteSelected({ id: "all", name: "All sites" });
    setDateSelected({ id: "today", label: "Today" });
    setCompareSelected({ id: "last-same-day", label: `last ${TODAY_NAME}` });
  }

  return (
    <div className="bg-[#f9f8f4] flex h-screen w-full">
      <Sidebar />

      {/* Page area — white card fixed to viewport, only inner content scrolls */}
      <div className="flex-1 min-w-0 h-screen p-[8px] pl-0 flex flex-col">
        <div className="bg-white border border-[#e3e2dd] rounded-[16px] flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Title header — stays fixed */}
          <div className="border-b border-[#e3e2dd] flex gap-[16px] items-center px-[24px] py-[12px] w-full shrink-0">
            <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px] min-w-0 truncate">Sales overview</span>
            <div className="flex items-center gap-[2px] flex-1 min-w-0">
              <button
                onClick={refreshData}
                className="flex items-center justify-center rounded-full size-[32px] hover:bg-[#f4f3ef] transition-colors shrink-0"
                title="Refresh"
              >
                <img alt="Refresh" src={imgRefresh} className={`block${isRefreshing ? " spin-once" : ""}`} style={{ width: 16, height: 16 }} />
              </button>
              <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px] whitespace-nowrap">
                {formatLastUpdated(lastUpdated, now)}
              </span>
            </div>
            <img alt="" className="block shrink-0 size-[24px] cursor-pointer" src={imgChat} />
            <img alt="" className="block shrink-0 size-[24px] cursor-pointer" src={imgAnnouncement} />
            <button className="bg-white border border-[#e3e2dd] flex h-[32px] items-center justify-center overflow-hidden px-[12px] py-[4px] rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)]">
              <span className="font-['Inter:Semi_Bold'] text-[#22201f] text-[14px] leading-[20px] tracking-[0.014px] whitespace-nowrap">POS</span>
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="flex flex-col gap-[24px] items-start p-[24px] w-full overflow-y-auto flex-1">
            {/* Filter bar */}
            <div className="flex gap-[16px] items-start w-full">
              <div className="flex flex-1 gap-[8px] items-start min-w-0 flex-wrap">
                {/* Default: Site chip */}
                <div ref={siteChipRef} className="relative">
                  <DefaultFilterChip
                    label="Site"
                    value={siteSelected.name}
                    onClick={() => { setShowSiteDropdown((v) => !v); setShowDateDropdown(false); setShowCompareDropdown(false); }}
                  />
                  {showSiteDropdown && (
                    <SiteDropdown
                      selected={siteSelected.id}
                      onSelect={(id, name) => setSiteSelected({ id, name })}
                      onClose={() => setShowSiteDropdown(false)}
                    />
                  )}
                </div>

                {/* Default: Date chip */}
                <div className="relative">
                  <DefaultFilterChip
                    label="Date"
                    value={dateSelected.label}
                    onClick={() => { setShowDateDropdown((v) => !v); setShowCompareDropdown(false); setShowSiteDropdown(false); }}
                  />
                  {showDateDropdown && (
                    <DateDropdown
                      selected={dateSelected.id}
                      onSelect={(id, label) => {
                        setDateSelected({ id, label });
                        // reset compare-to to first available option for the new date
                        const opts = COMPARE_TO_OPTIONS[id] ?? COMPARE_TO_OPTIONS["today"];
                        setCompareSelected({ id: opts[0].id, label: opts[0].label });
                      }}
                      onClose={() => setShowDateDropdown(false)}
                    />
                  )}
                </div>

                {/* Default: Compare to chip */}
                <div className="relative">
                  <DefaultFilterChip
                    label="Compare to"
                    value={compareSelected.label}
                    onClick={() => { setShowCompareDropdown((v) => !v); setShowDateDropdown(false); setShowSiteDropdown(false); }}
                  />
                  {showCompareDropdown && (
                    <CompareToDropdown
                      dateId={dateSelected.id}
                      selected={compareSelected.id}
                      onSelect={(id, label) => setCompareSelected({ id, label })}
                      onClose={() => setShowCompareDropdown(false)}
                    />
                  )}
                </div>

                {/* Applied (removable) filters */}
                {appliedFilters.map((f) => (
                  <RemovableFilterChip
                    key={f.id}
                    label={f.label}
                    value={f.value}
                    onRemove={() => removeFilter(f.id)}
                    onClick={openDrawer}
                  />
                ))}

                {/* Filter icon button */}
                <button
                  onClick={openDrawer}
                  className="flex items-center justify-center rounded-full size-[32px] hover:bg-[#edeae4] transition-colors"
                >
                  <img alt="" className="block size-[16px]" src={imgFilter} />
                </button>
              </div>

              {/* Right actions */}
              <div className="flex items-start gap-[8px] shrink-0">
                {isFilteredFromDefault && (
                  <>
                    <button
                      onClick={reset}
                      className="flex h-[32px] items-center justify-center px-[4px] hover:opacity-70 transition-opacity"
                    >
                      <span className="font-['Inter:Semi Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px] tracking-[0.014px] whitespace-nowrap">Reset</span>
                    </button>
                    {!isSaved && (
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="bg-white border border-[#e3e2dd] flex h-[32px] items-center justify-center px-[12px] py-[4px] rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] hover:bg-[#f9f8f4] transition-colors"
                      >
                        <span className="font-['Inter:Semi Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px] tracking-[0.014px] whitespace-nowrap">Save</span>
                      </button>
                    )}
                  </>
                )}
                <div ref={moreRef} className="relative">
                  <button
                    onClick={() => setShowMoreMenu((v) => !v)}
                    className="flex items-center justify-center rounded-full size-[32px] hover:bg-[#edeae4] transition-colors"
                  >
                    <img alt="" className="block size-[16px]" src={imgMore} />
                  </button>
                  {showMoreMenu && (
                    <MoreMenu
                      savedFilters={savedFilters}
                      onClose={() => setShowMoreMenu(false)}
                      onApplyFilter={(name) => {
                        const f = savedFilters.find((s) => s.name === name);
                        if (f) applyFilter(f);
                      }}
                      onDeleteFilter={deleteFilter}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div className="flex gap-[16px] items-start w-full">
              <KpiCard label="Total sales" value="$4,182.60" change="+9.7%" changeColor="text-[#008e13]" compareLabel={compareSelected.label} isRefreshing={isRefreshing} />
              <KpiCard label="Orders" value="241" change="−4.6%" changeColor="text-[#8e1311]" compareLabel={compareSelected.label} isRefreshing={isRefreshing} />
              <KpiCard label="Average order" value="$17.35" change="+13.2%" changeColor="text-[#008e13]" compareLabel={compareSelected.label} isRefreshing={isRefreshing} />
              <WidgetCard className="flex-1 min-w-0 h-full">
              <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
                <div className="flex gap-[8px] items-center w-full">
                  <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px] flex-1 min-w-0">Top selling product</span>
                  <AskButton label="Ask" />
                  <InfoIcon tooltip="Best-selling product by order volume" />
                </div>
                {isRefreshing ? <Sk w="w-[60px]" h="h-[32px]" /> : <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px]">Latte</span>}
              </div>
              </WidgetCard>
            </div>

            {/* Hourly sales chart */}
            <WidgetCard className="w-full">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
              <div className="flex gap-[8px] items-center w-full">
                <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px] flex-1">Hourly sales</span>
                <AskButton label="Ask about this" />
                <InfoIcon tooltip="Total sales revenue broken down by hour" />
              </div>
              <HourlySalesChart compareLabel={compareSelected.label} isRefreshing={isRefreshing} />
            </div>
            </WidgetCard>

            {/* Top lists row */}
            <div className="flex gap-[16px] items-start w-full">
              <TopListCard title="Top selling products" compareLabel={compareSelected.label} isRefreshing={isRefreshing} items={[
                { rank: 1, name: "Latte", count: 82, change: "+7.4%", positive: true },
                { rank: 2, name: "Flat White", count: 67, change: "−2.9%", positive: false },
                { rank: 3, name: "Plain Croissant", count: 32, change: "+15.6%", positive: true },
                { rank: 4, name: "Cappuccino", count: 31, change: "+4.8%", positive: true },
                { rank: 5, name: "Banana Bread", count: 16, change: "−8.3%", positive: false },
              ]} />
              <TopListCard title="Top selling categories" compareLabel={compareSelected.label} isRefreshing={isRefreshing} items={[
                { rank: 1, name: "Coffee", count: 187, change: "+12.1%", positive: true },
                { rank: 2, name: "Pastries", count: 76, change: "+6.5%", positive: true },
                { rank: 3, name: "Sweets", count: 65, change: "−5.7%", positive: false },
                { rank: 4, name: "Toasties", count: 47, change: "+10.9%", positive: true },
                { rank: 5, name: "Other drinks", count: 30, change: "+3.6%", positive: true },
              ]} />
              <TopListCard title="Top selling reporting groups" compareLabel={compareSelected.label} isRefreshing={isRefreshing} items={[
                { rank: 1, name: "Drinks", count: 384, change: "−11.4%", positive: false },
                { rank: 2, name: "Food", count: 265, change: "+14.7%", positive: true },
                { rank: 3, name: "Other", count: 157, change: "−6.2%", positive: false },
              ]} />
            </div>

            {/* Sales by site table */}
            <WidgetCard className="w-full">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
              <div className="flex gap-[8px] items-center w-full">
                <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px] flex-1">Sales by site</span>
                <AskButton label="Ask about this" />
                <InfoIcon tooltip="Revenue comparison by location for the selected period" />
              </div>
              <div className="flex flex-col items-start w-full overflow-hidden">
                {/* Table header */}
                <div className="bg-[#f9f8f4] border-y border-[#e3e2dd] flex gap-[16px] h-[40px] items-center font-['Inter:Medium'] text-[#22201f] text-[12px] leading-[16px] pl-[8px] pr-[12px] py-[8px] w-full">
                  <span className="w-[20px] shrink-0" />
                  <span className="flex-1 min-w-0">Site</span>
                  <span className="text-right w-[120px] shrink-0">Sales {dateSelected.label.toLowerCase()}</span>
                  <span className="text-right w-[120px] shrink-0">{compareSelected.label.charAt(0).toUpperCase() + compareSelected.label.slice(1)}</span>
                  <span className="text-right w-[120px] shrink-0">Difference</span>
                </div>
                <SiteTableRow rank={1} name="Amberley – The Coffee Company" today="$4,356.39" last="$3,960.11" diff="+8.8%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={2} name="Brambleton – The Coffee Company" today="$2,764.40" last="$2,940.24" diff="−3.4%" positive={false} isRefreshing={isRefreshing} />
                <SiteTableRow rank={3} name="Copperfield – The Coffee Company" today="$2,661.29" last="$2,464.88" diff="+11.6%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={4} name="Foxglove – The Coffee Company" today="$2,045.94" last="$2,130.15" diff="−9.1%" positive={false} isRefreshing={isRefreshing} />
                <SiteTableRow rank={5} name="Mossgate – The Coffee Company" today="$1,613.69" last="$1,440.01" diff="+5.3%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={6} name="Pinehollow – The Coffee Company" today="$1,032.56" last="$1,110.82" diff="+2.2%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={7} name="Riverbend – The Coffee Company" today="$914.10" last="$870.67" diff="−13.7%" positive={false} isRefreshing={isRefreshing} />
              </div>
              <span className="font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] cursor-pointer hover:underline">See more</span>
            </div>
            </WidgetCard>

            {/* Sales by staff table */}
            <WidgetCard className="w-full">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
              <div className="flex gap-[8px] items-center w-full">
                <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px] flex-1">Sales by staff</span>
                <AskButton label="Ask about this" />
                <InfoIcon tooltip="Revenue broken down by staff member for the selected period" />
              </div>
              <div className="flex flex-col items-start w-full overflow-hidden">
                <div className="bg-[#f9f8f4] border-y border-[#e3e2dd] flex gap-[16px] h-[40px] items-center font-['Inter:Medium'] text-[#22201f] text-[12px] leading-[16px] pl-[8px] pr-[12px] py-[8px] w-full">
                  <span className="w-[20px] shrink-0" />
                  <span className="flex-1 min-w-0">Staff member</span>
                  <span className="text-right w-[120px] shrink-0">Sales {dateSelected.label.toLowerCase()}</span>
                  <span className="text-right w-[120px] shrink-0">{compareSelected.label.charAt(0).toUpperCase() + compareSelected.label.slice(1)}</span>
                  <span className="text-right w-[120px] shrink-0">Difference</span>
                </div>
                <SiteTableRow rank={1} name="Olivia Hartwell" today="$3,241.80" last="$2,988.50" diff="+8.5%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={2} name="Marcus Delgado" today="$2,876.40" last="$2,910.20" diff="−1.2%" positive={false} isRefreshing={isRefreshing} />
                <SiteTableRow rank={3} name="Priya Nair" today="$2,534.60" last="$2,310.75" diff="+9.7%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={4} name="Tom Ashworth" today="$2,190.30" last="$2,050.00" diff="+6.8%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={5} name="Sophie Brennan" today="$1,847.90" last="$1,920.40" diff="−3.8%" positive={false} isRefreshing={isRefreshing} />
                <SiteTableRow rank={6} name="James Okafor" today="$1,612.50" last="$1,480.30" diff="+8.9%" positive isRefreshing={isRefreshing} />
                <SiteTableRow rank={7} name="Yuki Tanaka" today="$1,205.70" last="$1,340.60" diff="−10.1%" positive={false} isRefreshing={isRefreshing} />
                <SiteTableRow rank={8} name="Chloe Fairbanks" today="$986.40" last="$870.90" diff="+13.3%" positive isRefreshing={isRefreshing} />
              </div>
              <span className="font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] cursor-pointer hover:underline">See more</span>
            </div>
            </WidgetCard>
          </div>
        </div>
      </div>

      {/* Save View Modal */}
      {showSaveModal && (
        <SaveViewModal
          onClose={() => setShowSaveModal(false)}
          onSave={saveCurrentFilters}
          onUpdate={updateFilter}
          existingFilters={savedFilters.map((f) => f.name)}
          hasExisting={savedFilters.length > 0}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialState={drawerState}
        onApply={handleApply}
      />
    </div>
  );
}
