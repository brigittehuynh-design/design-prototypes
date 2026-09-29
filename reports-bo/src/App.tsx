import React, { useState, useRef, useEffect } from "react";
import VersionOnePrototype from "./VersionOne";

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
const imgInfo = `${assetPathPrefix}/753ad.svg`;
const imgLine = `${assetPathPrefix}/96b81.svg`;
const imgPrevShape = `${assetPathPrefix}/1b21c.svg`;
const imgPrevLine = `${assetPathPrefix}/a452e.svg`;
const imgSparkShape = `${assetPathPrefix}/66d26.svg`;
const imgSparkLine = `${assetPathPrefix}/1fda1.svg`;
const imgRowLine = `${assetPathPrefix}/7183d.svg`;
const imgSearch = `${assetPathPrefix}/a4aea.svg`;
const imgCheck = `${assetPathPrefix}/7279d.svg`;
const imgChecked = `${assetPathPrefix}/3d476.svg`;
const imgDivider = `${assetPathPrefix}/973a3.svg`;

// ─── Types ──────────────────────────────────────────────────────────────────

// ─── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({ activeReport, onSelectReport }: { activeReport: "Sales overview" | "Product sales"; onSelectReport: (report: "Sales overview" | "Product sales") => void }) {
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
            {(["Sales overview", "Product sales"] as const).map((report) => (
              <button
                key={report}
                type="button"
                aria-current={activeReport === report ? "page" : undefined}
                onClick={() => onSelectReport(report)}
                className={`flex h-[32px] w-full items-center justify-center rounded-[8px] p-[8px] text-left transition-colors ${activeReport === report ? "bg-[#edeae4]" : "hover:bg-[#edeae4]"}`}
              >
                <span className={`flex-1 truncate text-[14px] leading-[20px] ${activeReport === report ? "font-['Inter:Semibold'] text-[#22201f]" : "font-['Inter:Medium'] text-[#22201f]"}`}>
                  {report}
                </span>
              </button>
            ))}
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

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [tooltip, setTooltip] = useState<{ alignRight: boolean; maxWidth: number } | null>(null);

  function showTooltip(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const leftSpace = bounds.right - 16;
    const rightSpace = window.innerWidth - bounds.left - 16;
    const alignRight = leftSpace > rightSpace;
    setTooltip({ alignRight, maxWidth: Math.max(0, alignRight ? leftSpace : rightSpace) });
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={() => setTooltip(null)}
    >
      {children}
      {tooltip && (
        <div
          className={`absolute bottom-full mb-[6px] z-50 pointer-events-none w-max ${tooltip.alignRight ? "right-0" : "left-0"}`}
          style={{ maxWidth: tooltip.maxWidth }}
        >
          <div className="bg-[#22201f] text-white font-['Inter:Regular'] text-[12px] leading-[16px] px-[8px] py-[6px] rounded-[6px] whitespace-normal break-words shadow-lg">
            {text}
          </div>
          <div className={`absolute top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#22201f] ${tooltip.alignRight ? "right-[8px]" : "left-[8px]"}`} />
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
  disabled = false,
  valueClassName = "",
  chipClassName = "",
}: {
  label: string;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
  valueClassName?: string;
  chipClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[32px] max-w-full items-center gap-[6px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:bg-[#f9f8f4]"} ${chipClassName}`}
    >
      <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">{label}</span>
      <span className={`min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px] ${valueClassName}`}>{value}</span>
    </button>
  );
}

// ─── Site Dropdown ───────────────────────────────────────────────────────────

type SiteOption = { id: string; name: string };

type ProductSalesView = {
  name: string;
  salesBy: string;
  sites: string[];
  registers: string[];
  date: { id: string; label: string };
  compare: { id: string; label: string };
  products: string[];
  categories: string[];
  reportingGroups: string[];
  tax: string;
  visibleFilters: string[];
};

type SalesOverviewView = {
  name: string;
  sites: string[];
  registers: string[];
  date: { id: string; label: string };
  compare: { id: string; label: string };
  tax: string;
};

type ProductSalesStorage = {
  savedViews: ProductSalesView[];
  defaultView: string | null;
};

type SalesOverviewStorage = {
  savedFilters: SalesOverviewView[];
  defaultView: string | null;
};

const PRODUCT_SALES_STORAGE_KEY = "reports-bo:version-2:product-sales";
const SALES_OVERVIEW_STORAGE_KEY = "reports-bo:version-2:sales-overview";

function loadStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

function getStoredSalesDefault() {
  const stored = loadStoredValue<SalesOverviewStorage>(SALES_OVERVIEW_STORAGE_KEY, { savedFilters: [], defaultView: "__system__" });
  return stored.savedFilters.find((view) => view.name === stored.defaultView);
}

function getStoredProductSalesDefault() {
  const stored = loadStoredValue<ProductSalesStorage>(PRODUCT_SALES_STORAGE_KEY, { savedViews: [], defaultView: "__system__" });
  return stored.savedViews.find((view) => view.name === stored.defaultView);
}

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
  selectedIds,
  onToggle,
  onClose,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
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
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[min(360px,calc(100vw-32px))] overflow-hidden"
    >
      <div className="p-[4px]">
        <CheckboxMenuRow
          label="All sites"
          checked={selectedIds.length === 0}
          onClick={() => onToggle("all")}
        />
      </div>
      <div className="h-px w-full bg-[#e3e2dd]" />
      <div className="max-h-[320px] overflow-y-auto p-[4px]">
        {SITE_OPTIONS.slice(1).map((site) => (
          <CheckboxMenuRow
            key={site.id}
            label={site.name}
            checked={selectedIds.includes(site.id)}
            onClick={() => onToggle(site.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CheckboxMenuRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
    >
      <span className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${checked ? "" : "border border-[#bbbab6] bg-white"}`}>
        {checked && <img alt="" className="size-full" src={imgChecked} />}
      </span>
      <span className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{label}</span>
    </button>
  );
}

const REGISTERS_BY_SITE: Record<string, string[]> = {
  amberley: ["POS A", "Front POS", "Back POS"],
  brambleton: ["POS A", "Front POS", "Back POS"],
  oakridge: ["POS A", "Front POS", "Back POS"],
  pinehollow: ["POS A", "Front POS", "Back POS"],
  riverbend: ["POS A", "Front POS", "Back POS"],
  willowmere: ["POS A", "Front POS", "Back POS"],
};

function RegisterDropdown({
  selectedSites,
  selectedRegisters,
  onToggle,
  onClose,
  searchable = false,
}: {
  selectedSites: SiteOption[];
  selectedRegisters: string[];
  onToggle: (key: string) => void;
  onClose: () => void;
  searchable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  const [query, setQuery] = useState("");
  const options = selectedSites.flatMap((site) =>
    (REGISTERS_BY_SITE[site.id] ?? []).map((name) => ({ key: `${site.id}:${name}`, site: site.name, name }))
  );
  const filteredOptions = options.filter((option) => `${option.site} ${option.name}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} className="absolute top-[40px] left-0 z-50 w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
      {searchable && <input aria-label="Search registers" autoFocus placeholder="Search registers" value={query} onChange={(event) => setQuery(event.target.value)} className="mx-[4px] mt-[4px] h-[36px] w-[calc(100%-8px)] rounded-[6px] border-b border-[#e3e2dd] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] outline-none placeholder:text-[#85837e]" />}
      <div className="max-h-[360px] overflow-y-auto p-[4px]">
        {options.length === 0 ? (
          <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">No registers available for this site.</p>
        ) : selectedSites.length > 1 ? (
          selectedSites.map((site) => {
            const siteOptions = options.filter((option) => option.site === site.name);
            return (
              <div key={site.id} className="mb-[4px] last:mb-0">
                <p className="px-[12px] py-[8px] font-['Inter:Medium'] text-[#62615d] text-[14px] leading-[20px]">{site.name}</p>
                {siteOptions.map((option) => (
                  <CheckboxMenuRow key={option.key} label={option.name} checked={selectedRegisters.includes(option.key)} onClick={() => onToggle(option.key)} />
                ))}
              </div>
            );
          })
        ) : filteredOptions.map((option) => (
          <CheckboxMenuRow key={option.key} label={option.name} checked={selectedRegisters.includes(option.key)} onClick={() => onToggle(option.key)} />
        ))}
        {searchable && filteredOptions.length === 0 && <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">No matching registers</p>}
      </div>
    </div>
  );
}

function TaxDropdown({ selected, onSelect, onClose }: { selected: string; onSelect: (value: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  return (
    <div ref={ref} className="absolute top-[40px] left-0 z-50 w-[190px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
      {["Inclusive", "Exclusive"].map((option) => (
        <button key={option} type="button" onClick={() => { onSelect(option); onClose(); }} className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]">
          <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option}</span>
          {selected === option && <img alt="Selected" className="size-[16px] shrink-0" src={imgCheck} />}
        </button>
      ))}
    </div>
  );
}

function OptionsDropdown({
  options,
  selected,
  onSelect,
  onClose,
  searchable = false,
  width = 280,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  searchable?: boolean;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} style={{ width }} className="absolute top-[40px] left-0 z-50 max-h-[360px] overflow-y-auto rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
      {searchable && <input aria-label="Search options" autoFocus placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} className="mb-[4px] h-[36px] w-full rounded-[6px] border-b border-[#e3e2dd] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] outline-none placeholder:text-[#85837e]" />}
      {filteredOptions.map((option) => (
        <button key={option} type="button" onClick={() => { onSelect(option); onClose(); }} className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]">
          <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option}</span>
          {selected === option && <img alt="Selected" className="size-[16px] shrink-0" src={imgCheck} />}
        </button>
      ))}
      {searchable && filteredOptions.length === 0 && <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">No matching options</p>}
    </div>
  );
}

function MultiSelectDropdown({
  title,
  options,
  selected,
  onApply,
  onClose,
  searchable = false,
}: {
  title: string;
  options: string[];
  selected: string[];
  onApply: (values: string[]) => void;
  onClose: () => void;
  searchable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  const [draft, setDraft] = useState(selected);
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  const allSelected = draft.length === 0;

  function toggleOption(option: string) {
    setDraft((current) => current.includes(option) ? current.filter((value) => value !== option) : [...current, option]);
  }

  return (
    <div ref={ref} className="absolute left-0 top-[40px] z-50 w-[220px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
      <div className="flex h-[40px] items-center border-b border-[#e3e2dd] px-[12px]">
        <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Select {title.toLowerCase()}</span>
      </div>
      {searchable && (
        <div className="px-[8px] pb-[4px] pt-[8px]">
          <label className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#bbbab6] px-[12px]">
            <svg aria-hidden="true" className="size-[16px] shrink-0 text-[#22201f]" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input aria-label={`Search ${title}`} autoFocus placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] outline-none placeholder:text-[#aaaba6]" />
          </label>
        </div>
      )}
      <div className="max-h-[260px] overflow-y-auto p-[4px]">
        <CheckboxMenuRow label="All" checked={allSelected} onClick={() => setDraft([])} />
        {filteredOptions.filter((option) => option !== "All").map((option) => (
          <CheckboxMenuRow key={option} label={option} checked={draft.includes(option)} onClick={() => toggleOption(option)} />
        ))}
        {searchable && filteredOptions.filter((option) => option !== "All").length === 0 && <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">No matching options</p>}
      </div>
      <div className="border-t border-[#e3e2dd] p-[8px]">
        <button type="button" onClick={() => { onApply(draft); onClose(); }} className="h-[36px] w-full rounded-[8px] bg-[#1e72c4] font-['Inter:Semi_Bold'] text-white text-[14px] leading-[20px] hover:bg-[#1a64ae]">Apply</button>
      </div>
    </div>
  );
}

function AddFilterDropdown({
  filters,
  filterOptions,
  selectedValues,
  onApply,
  onClose,
}: {
  filters: string[];
  filterOptions: Record<string, string[]>;
  selectedValues: Record<string, string[]>;
  onApply: (filter: string, values: string[]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<string[]>([]);
  const options = activeFilter ? filterOptions[activeFilter] ?? [] : [];
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  const searchableFilters = ["Product", "Category", "Reporting group", "Register"];
  const multiSelectFilters = ["Product", "Category", "Reporting group", "Register"];

  return (
    <div ref={ref} className={`absolute left-0 top-[40px] z-50 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-0 shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] ${activeFilter ? "w-[220px]" : "w-[180px]"}`}>
      {activeFilter ? (
        <>
          <button type="button" onClick={() => { setActiveFilter(null); setQuery(""); }} className="flex h-[40px] w-full items-center gap-[8px] border-b border-[#e3e2dd] px-[8px] text-left">
            <svg aria-hidden="true" className="size-[16px] shrink-0" viewBox="0 0 16 16" fill="none"><path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Select {activeFilter.toLowerCase()}</span>
          </button>
          {searchableFilters.includes(activeFilter) && (
            <div className="px-[8px] pb-[4px] pt-[8px]">
              <label className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#bbbab6] px-[12px]">
                <svg aria-hidden="true" className="size-[16px] shrink-0 text-[#22201f]" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input aria-label={`Search ${activeFilter}`} autoFocus placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] outline-none placeholder:text-[#aaaba6]" />
              </label>
            </div>
          )}
          <div className="max-h-[280px] overflow-y-auto p-[4px]">
            {multiSelectFilters.includes(activeFilter) ? (
              <>
                <CheckboxMenuRow label="All" checked={draft.length === 0} onClick={() => setDraft([])} />
                {filteredOptions.filter((option) => option !== "All").map((option) => (
                  <CheckboxMenuRow key={option} label={option} checked={draft.includes(option)} onClick={() => setDraft((current) => current.includes(option) ? current.filter((value) => value !== option) : [...current, option])} />
                ))}
                {filteredOptions.filter((option) => option !== "All").length === 0 && <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">No matching options</p>}
              </>
            ) : filteredOptions.map((option) => (
              <button key={option} type="button" onClick={() => { onApply(activeFilter, [option]); onClose(); }} className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]">
                <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-[#e3e2dd] p-[8px]">
            <button type="button" onClick={() => { onApply(activeFilter, draft); onClose(); }} className="h-[36px] w-full rounded-[8px] bg-[#1e72c4] font-['Inter:Semi_Bold'] text-white text-[14px] leading-[20px] hover:bg-[#1a64ae]">Apply</button>
          </div>
        </>
      ) : (
        <>
          <p className="border-b border-[#e3e2dd] px-[12px] py-[8px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Add filter</p>
          {filters.map((filter) => (
            <button key={filter} type="button" onClick={() => { setActiveFilter(filter); setDraft(selectedValues[filter] ?? []); setQuery(""); }} className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]">
              <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{filter}</span>
              <svg aria-hidden="true" className="size-[16px] text-[#85837e]" viewBox="0 0 16 16" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ))}
          {filters.length === 0 && <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">All filters are shown</p>}
        </>
      )}
    </div>
  );
}

function DateComparisonDropdown({
  dateId,
  compareId,
  onSelectDate,
  onSelectCompare,
  onClose,
}: {
  dateId: string;
  compareId: string;
  onSelectDate: (id: string, label: string) => void;
  onSelectCompare: (id: string, label: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);
  const compareOptions = COMPARE_TO_OPTIONS[dateId] ?? COMPARE_TO_OPTIONS.today;

  return (
    <div ref={ref} className="absolute left-0 top-[40px] z-50 grid w-[min(400px,calc(100vw-32px))] grid-cols-2 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
      <section className="min-w-0 border-r border-[#e3e2dd]">
      <p className="border-b border-[#e3e2dd] px-[16px] pb-[8px] pt-[12px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Date range</p>
      <div className="max-h-[360px] overflow-y-auto p-[4px]">
        {DATE_OPTIONS.map((option) => (
          <button key={option.id} type="button" onClick={() => onSelectDate(option.id, option.label)} className="flex w-full items-start gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]">
            <span className="flex flex-1 flex-col">
              <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option.label}</span>
              {dateId === option.id && <span className="mt-[1px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">{getDateRangeLabel(option.id)}</span>}
            </span>
            {dateId === option.id && <img alt="Selected" className="mt-[2px] size-[16px] shrink-0" src={imgCheck} />}
          </button>
        ))}
      </div>
      </section>
      <section className="min-w-0">
      <p className="border-b border-[#e3e2dd] px-[16px] pb-[8px] pt-[12px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Compare to</p>
      <div className="max-h-[360px] overflow-y-auto p-[4px]">
        {compareOptions.map((option) => (
          <button key={option.id} type="button" onClick={() => onSelectCompare(option.id, option.label)} className="flex w-full items-start gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]">
            <span className="flex flex-1 flex-col">
              <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option.label}</span>
              {compareId === option.id && <span className="mt-[1px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">{getDateRangeLabel(option.id, dateId)}</span>}
            </span>
            {compareId === option.id && <img alt="Selected" className="mt-[2px] size-[16px] shrink-0" src={imgCheck} />}
          </button>
        ))}
        <button type="button" onClick={() => onSelectCompare("none", "None")} className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]">
          <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">None</span>
          {compareId === "none" && <img alt="Selected" className="size-[16px] shrink-0" src={imgCheck} />}
        </button>
      </div>
      </section>
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
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{opt.label}</span>
                {dateStr && <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px] mt-[1px]">{dateStr}</span>}
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
function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
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
  "today":          [{ id: "last-same-day", label: "Last Tuesday" }, { id: "yesterday", label: "Yesterday" }, { id: "last-week-same-day", label: "Last week (same day)" }, { id: "last-year-same-day", label: "Last year (same day)" }],
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
  const options = [{ id: "none", label: "None" }, ...(COMPARE_TO_OPTIONS[dateId] ?? COMPARE_TO_OPTIONS["today"])];

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
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{opt.label}</span>
                {dateStr && <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px] mt-[1px]">{dateStr}</span>}
              </div>
              {selected === opt.id && <img alt="" className="block shrink-0 size-[16px] mt-[2px]" src={imgCheck} />}
            </button>
          );
        })}
      </div>
    </div>
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
  "7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
];

const CURRENT_DATA = [120,185,310,420,510,580,640,690,720,760,810,770,680,590,480,320];
const PREV_DATA    = [100,155,270,360,430,490,530,570,600,630,670,640,580,510,420,280];

function HourlySalesChart({ compareLabel, showComparison, isRefreshing }: { compareLabel: string; showComparison: boolean; isRefreshing?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 600, H = 161;
  const PAD_T = 8, PAD_B = 4, PAD_L = 0, PAD_R = 0;
  const Y_LABEL_W = 36;
  const maxVal = Math.max(...(showComparison ? [...CURRENT_DATA, ...PREV_DATA] : CURRENT_DATA));
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
        {!isRefreshing && <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Grid lines */}
          {Y_TICKS.map((f) => {
            const y = PAD_T + (1 - f) * (H - PAD_T - PAD_B);
            return <line key={f} x1={0} y1={y} x2={W} y2={y} stroke="#e3e2dd" strokeWidth="0.6" />;
          })}

          {/* Previous period line */}
          {showComparison && <polyline points={makeLine(PREV_DATA)} fill="none" stroke="#f5a03b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}

          {/* Current period line */}
          <polyline points={makeLine(CURRENT_DATA)} fill="none" stroke="#58aaf5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Hover vertical line */}
          {hovered !== null && (
            <line
              x1={xv(hovered)} y1={0} x2={xv(hovered)} y2={H}
              stroke="#d6d5d1" strokeWidth="0.8"
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
        </svg>}

        {!isRefreshing && showComparison && hovered !== null && (
          <>
            <span
              className="pointer-events-none absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5a03b]"
              style={{ left: `${tooltipX}%`, top: `${prevY}%` }}
            />
            <span
              className="pointer-events-none absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#58aaf5]"
              style={{ left: `${tooltipX}%`, top: `${curY}%` }}
            />
          </>
        )}

        {/* Tooltip card */}
        {!isRefreshing && hovered !== null && (() => {
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
                <span className="inline-block size-[8px] rounded-full bg-[#58aaf5] shrink-0" />
                <span className="font-['Inter:Regular'] text-[#22201f] text-[13px] leading-[18px]">Today</span>
                <span className="font-['Inter:Medium'] text-[#22201f] text-[13px] leading-[18px] ml-auto pl-[12px]">${CURRENT_DATA[hovered]}</span>
              </div>
              {showComparison && <div className="flex items-center gap-[8px]">
                <span className="inline-block size-[8px] rounded-full bg-[#f5a03b] shrink-0" />
                <span className="font-['Inter:Regular'] text-[#22201f] text-[13px] leading-[18px] flex-1 min-w-0 truncate">{compareLabel.charAt(0).toUpperCase() + compareLabel.slice(1)}</span>
                <span className="font-['Inter:Medium'] text-[#22201f] text-[13px] leading-[18px] ml-auto pl-[12px]">${PREV_DATA[hovered]}</span>
              </div>}
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

function KpiCard({ label, value, change, changeColor, compareLabel, showComparison, isRefreshing }: { label: string; value: string; change?: string; changeColor?: string; compareLabel?: string; showComparison: boolean; isRefreshing?: boolean }) {
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
        {showComparison && change && (
          isRefreshing
            ? <Sk w="w-[160px]" h="h-[16px]" />
            : <p className="text-[0px] leading-[0] w-full">
                <span className={`font-['Inter:Semi_Bold'] font-semibold text-[14px] leading-[24px] ${changeColor}`}>{change} </span>
                <span className="text-[#62615d] text-[14px] leading-[20px]">vs {compareLabel ? lowercaseFirstLetter(compareLabel) : "previous period"}</span>
              </p>
        )}
      </div>
    </div>
    </WidgetCard>
  );
}

function ProductRow({ rank, name, count, change, positive, showComparison, isRefreshing }: { rank: number; name: string; count: number; change: string; positive: boolean; showComparison: boolean; isRefreshing?: boolean }) {
  return (
    <>
      <div className="flex gap-[8px] items-center px-[4px] w-full">
        <div className="flex gap-[8px] items-center flex-1 min-w-0">
          <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px] w-[10px] shrink-0">{rank}</span>
          <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] flex-1 min-w-0 truncate">{name}</span>
        </div>
        {isRefreshing ? <Sk w="w-[28px]" /> : <span className="font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[24px] whitespace-nowrap">{count}</span>}
        {showComparison && (isRefreshing ? <Sk w="w-[44px]" /> : <span className={`font-['Inter:Semibold'] text-[14px] leading-[24px] text-right w-[60px] ${positive ? "text-[#008e13]" : "text-[#8e1311]"}`}>{change}</span>)}
      </div>
      <div className="relative h-0 w-full shrink-0">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgRowLine} />
        </div>
      </div>
    </>
  );
}

function TopListCard({ title, items, compareLabel, showComparison, isRefreshing }: { title: string; compareLabel: string; showComparison: boolean; isRefreshing?: boolean; items: Array<{ rank: number; name: string; count: number; change: string; positive: boolean }> }) {
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
        {showComparison && isRefreshing
          ? <Sk w="w-[180px]" h="h-[16px]" />
          : showComparison && <p className="text-[0px] leading-[0] w-full">
              <span className="font-['Inter:Semi_Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px]">{top.count} units sold • </span>
              <span className={`font-['Inter:Semi_Bold'] font-semibold text-[14px] leading-[20px] ${top.positive ? "text-[#008e13]" : "text-[#8e1311]"}`}>{top.change} </span>
              <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">vs {lowercaseFirstLetter(compareLabel)}</span>
            </p>
        }
      </div>
      <div className="h-px w-full shrink-0 bg-[#e3e2dd]" />
      <div className="flex flex-col gap-[12px] items-start w-full flex-1">
        {items.map((item) => (
          <ProductRow key={item.rank} {...item} showComparison={showComparison} isRefreshing={isRefreshing} />
        ))}
      </div>
      <span className="font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] cursor-pointer hover:underline">See more</span>
    </div>
    </WidgetCard>
  );
}

function SiteTableRow({ rank, name, today, last, diff, positive, showComparison, isRefreshing }: { rank: number; name: string; today: string; last: string; diff: string; positive: boolean; showComparison: boolean; isRefreshing?: boolean }) {
  return (
    <div className="h-[48px] border-b border-[#e3e2dd] flex gap-[16px] items-center pl-[4px] pr-[12px] w-full">
      <span className="font-['Inter:Regular'] text-[#62615d] text-[13px] leading-[24px] w-[20px] shrink-0 text-right">{rank}</span>
      <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] flex-1 min-w-0">{name}</span>
      {isRefreshing ? <Sk w="w-[72px]" h="h-[16px]" /> : <span className="font-['Inter:Regular'] text-black text-[14px] leading-[24px] text-right w-[120px] shrink-0">{today}</span>}
      {showComparison && (isRefreshing ? <Sk w="w-[72px]" h="h-[16px]" /> : <span className="font-['Inter:Regular'] text-black text-[14px] leading-[24px] text-right w-[120px] shrink-0">{last}</span>)}
      {showComparison && (isRefreshing ? <Sk w="w-[48px]" h="h-[16px]" /> : <span className={`font-['Inter:Semibold'] text-[14px] leading-[24px] text-right w-[120px] shrink-0 ${positive ? "text-[#008e13]" : "text-[#8e1311]"}`}>{diff}</span>)}
    </div>
  );
}

const EXPORT_OPTIONS = [
  {
    id: "spreadsheet",
    label: "CSV/Excel (.xlsx)",
    description: "Export report data for spreadsheets and further analysis.",
    badge: "XLSX",
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Download a print-ready copy of this report.",
    badge: "PDF",
  },
  {
    id: "png",
    label: "Image (PNG) of a chart",
    description: "Save a chart as an image for presentations or sharing.",
    badge: "PNG",
  },
] as const;

type ExportOption = (typeof EXPORT_OPTIONS)[number];

function ExportModal({
  onClose,
  onExport,
  options = EXPORT_OPTIONS,
}: {
  onClose: () => void;
  onExport: (label: string) => void;
  options?: readonly ExportOption[];
}) {
  const [selected, setSelected] = useState<ExportOption["id"] | null>(() => options.length === 1 ? options[0].id : null);
  const selectedOption = options.find((option) => option.id === selected);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(70,74,81,0.6)] p-[16px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="bg-white rounded-[12px] shadow-[0px_8px_8px_0px_rgba(18,18,18,0.04),0px_4px_4px_0px_rgba(18,18,18,0.08),0px_1px_1px_0px_rgba(18,18,18,0.12)] p-[24px] flex flex-col gap-[20px] w-full max-w-[480px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-[16px]">
          <div className="flex-1">
            <h2 id="export-modal-title" className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[28px]">Export report</h2>
            <p className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px] mt-[4px]">Choose a format for your report.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export options"
            className="shrink-0 size-[24px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <img alt="" className="block size-[16px]" src={imgModalClose} />
          </button>
        </div>

        <div className="flex flex-col gap-[8px]" role="radiogroup" aria-label="Export format">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(option.id)}
                className={`flex items-center gap-[12px] rounded-[8px] border p-[12px] text-left transition-colors ${isSelected ? "border-[#1e72c4] bg-[#f4f9ff]" : "border-[#e3e2dd] hover:bg-[#f9f8f4]"}`}
              >
                <span className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-[#1e72c4]" : "border-[#bbbab6]"}`}>
                  {isSelected && <span className="size-[10px] rounded-full bg-[#1e72c4]" />}
                </span>
                <span className="flex size-[36px] items-center justify-center rounded-[6px] bg-[#f2f0ea] font-['Inter:Semibold'] text-[#62615d] text-[10px] shrink-0">
                  {option.badge}
                </span>
                <span className="flex flex-col gap-[2px] min-w-0">
                  <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option.label}</span>
                  <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="w-full">
          <button
            type="button"
            disabled={!selectedOption}
            onClick={() => selectedOption && onExport(selectedOption.label)}
            className="bg-[#1e72c4] text-white font-['Inter:Semibold'] text-[14px] leading-[20px] h-[40px] w-full rounded-[8px] hover:bg-[#1a64ae] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── More Menu ───────────────────────────────────────────────────────────────

const imgMenuBin = `${assetPathPrefix}/b8944.svg`;
const imgModalClose = `${assetPathPrefix}/a578b.svg`;

// ─── Save View Modal ──────────────────────────────────────────────────────────

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[200] flex items-center gap-[10px] bg-[#22201f] text-white rounded-[10px] px-[16px] py-[12px] shadow-[0px_4px_16px_0px_rgba(18,18,18,0.2)] font-['Inter:Regular'] text-[14px] leading-[20px] text-center max-w-[calc(100vw-32px)] pointer-events-none">
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
  suggestedName,
}: {
  onClose: () => void;
  onSave: (name: string) => void;
  onUpdate: (name: string) => void;
  existingFilters: string[];
  hasExisting: boolean;
  suggestedName: string;
}) {
  const [mode, setMode] = useState<"existing" | "new">(hasExisting ? "existing" : "new");
  const [selectedExisting, setSelectedExisting] = useState(existingFilters[0] ?? "");
  const [newName, setNewName] = useState(suggestedName);

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
            <p className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[32px] flex-1 min-w-0">Save view</p>
            <button onClick={onClose} className="shrink-0 size-[16px] mt-[8px] hover:opacity-70 transition-opacity">
              <img alt="Close" className="block size-full" src={imgModalClose} />
            </button>
          </div>
          <p className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px]">
            Keep these filters and its comparisons and open it again with fresh data.
          </p>
        </div>

        {/* Mode selection — only when saved views exist */}
        {hasExisting && (
          <div className="flex flex-col gap-[12px]">
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${mode === "existing" ? "border-[#1e72c4]" : "border-[#bbbab6]"}`}
                onClick={() => setMode("existing")}
              >
                {mode === "existing" && <div className="size-[8px] rounded-full bg-[#1e72c4]" />}
              </div>
              <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]" onClick={() => setMode("existing")}>Save to existing view</span>
            </label>
            {mode === "existing" && (
              <div className="relative ml-[26px] w-[calc(100%-26px)]">
                <select
                  className="block appearance-none bg-white border border-[#bbbab6] rounded-[8px] h-[40px] pl-[12px] pr-[36px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4]"
                  value={selectedExisting}
                  onChange={(e) => setSelectedExisting(e.target.value)}
                >
                  {existingFilters.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <svg aria-hidden="true" className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="m4 6 4 4 4-4" stroke="#22201f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${mode === "new" ? "border-[#1e72c4]" : "border-[#bbbab6]"}`}
                onClick={() => setMode("new")}
              >
                {mode === "new" && <div className="size-[8px] rounded-full bg-[#1e72c4]" />}
              </div>
              <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]" onClick={() => setMode("new")}>Save new view</span>
            </label>
            {mode === "new" && (
              <div className="flex flex-col gap-[4px] ml-[26px]" style={{ width: "calc(100% - 26px)" }}>
                <input
                  className="bg-white border border-[#bbbab6] rounded-[8px] h-[40px] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
                  placeholder="View name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* Simple name input — when no saved views exist */}
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

// ─── Saved Filters Menu ───────────────────────────────────────────────────────

function SavedFiltersMenu({
  savedFilters,
  defaultView,
  onClose,
  onApplyDefault,
  onApplyFilter,
  onSetDefault,
  onDeleteFilter,
}: {
  savedFilters: Array<{ name: string }>;
  defaultView: string | null;
  onClose: () => void;
  onApplyDefault: () => void;
  onApplyFilter: (name: string) => void;
  onSetDefault: (name: string) => void;
  onDeleteFilter: (name: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[240px] overflow-hidden p-[4px]"
    >
      <div className="group flex items-center gap-[2px] rounded-[6px] px-[12px] py-[8px] hover:bg-[#f9f8f4]">
        <button
          type="button"
          className="min-w-0 flex-1 truncate text-left font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]"
          onClick={() => { onApplyDefault(); onClose(); }}
        >
          Default
        </button>
        <span className="group/star relative shrink-0">
          <button
            type="button"
            aria-label="Set system filters as default view"
            aria-pressed={defaultView === "__system__"}
            disabled={defaultView === "__system__"}
            className={`rounded-[4px] p-[4px] transition-opacity hover:bg-[#edeae4] ${defaultView === "__system__" ? "text-[#22201f]" : "text-[#62615d] opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}
            onClick={() => onSetDefault("__system__")}
          >
            <svg aria-hidden="true" className="size-[16px]" viewBox="0 0 16 16" fill="none">
              <path d="m8 1.5 1.9 3.85 4.25.62-3.08 3 .73 4.23L8 11.2l-3.8 2 .73-4.23-3.08-3 4.25-.62L8 1.5Z" fill={defaultView === "__system__" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </button>
          <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-[6px] hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#22201f] px-[8px] py-[6px] font-['Inter:Regular'] text-[12px] leading-[16px] text-white group-hover/star:block">
            {defaultView === "__system__" ? "System filters are the default view" : "Set system filters as default"}
          </span>
        </span>
      </div>
      <div className="my-[4px] h-px w-full bg-[#e3e2dd]" />
      <div className="px-[12px] py-[8px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">My saved views</div>
      {savedFilters.length === 0 ? (
        <div className="mx-[4px] mb-[4px] rounded-[8px] bg-[#f9f8f4] px-[12px] py-[16px] text-center">
          <p className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">No saved views yet</p>
          <p className="mt-[4px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">Save your filter selection to quickly access it later.</p>
        </div>
      ) : savedFilters.map((filter) => (
        <div key={filter.name} className="group flex items-center gap-[2px] rounded-[6px] px-[12px] py-[8px] hover:bg-[#f9f8f4]">
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-left font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]"
            onClick={() => { onApplyFilter(filter.name); onClose(); }}
          >
            {filter.name}
          </button>
          <span className="group/star relative shrink-0">
            <button
              type="button"
              aria-label={`Set ${filter.name} as default view`}
              aria-pressed={defaultView === filter.name}
              disabled={defaultView === filter.name}
              className={`rounded-[4px] p-[4px] transition-opacity hover:bg-[#edeae4] ${defaultView === filter.name ? "text-[#22201f]" : "text-[#62615d] opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}
              onClick={() => onSetDefault(filter.name)}
            >
              <svg aria-hidden="true" className="size-[16px]" viewBox="0 0 16 16" fill="none">
                <path d="m8 1.5 1.9 3.85 4.25.62-3.08 3 .73 4.23L8 11.2l-3.8 2 .73-4.23-3.08-3 4.25-.62L8 1.5Z" fill={defaultView === filter.name ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
            <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-[6px] hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#22201f] px-[8px] py-[6px] font-['Inter:Regular'] text-[12px] leading-[16px] text-white group-hover/star:block">
              {defaultView === filter.name ? "Default view" : "Set as default"}
            </span>
          </span>
          <button
            type="button"
            aria-label={`Delete ${filter.name}`}
            className="shrink-0 rounded-[4px] p-[4px] text-[#8e1311] opacity-60 hover:bg-[#edeae4] hover:opacity-100"
            onClick={() => onDeleteFilter(filter.name)}
          >
            <img alt="" className="block size-[16px]" src={imgMenuBin} />
          </button>
        </div>
      ))}
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

const prototypeVersions = [
  {
    version: "Version 1",
    updated: "24 September 2026",
    description: "Saved filters, and filtering pattern based on the new prod management system.",
    href: `${import.meta.env.BASE_URL}version-1`,
  },
  {
    version: "Version 2",
    updated: "29 September 2026",
    description: "Saved filters as \"views\" and apply inline with filters.",
    href: `${import.meta.env.BASE_URL}version-2`,
    status: "[WIP]",
  },
];

function PrototypeHome() {
  return (
    <main className="min-h-screen bg-[#f9f8f4] px-[24px] py-[48px] sm:px-[40px] sm:py-[72px]">
      <div className="mx-auto flex w-full max-w-[960px] flex-col">
        <header className="mb-[36px] max-w-[620px]">
          <h1 className="font-['Inter:Semibold'] text-[#22201f] text-[36px] leading-[44px] tracking-[-0.04em] sm:text-[44px] sm:leading-[52px]">
            Back Office Reports
          </h1>
          <p className="mt-[14px] max-w-[560px] font-['Inter:Regular'] text-[#62615d] text-[16px] leading-[26px]">
            Browse and compare the latest explorations for Back Office reporting.
          </p>
        </header>

        <section aria-labelledby="versions-heading">
          <div className="mb-[14px] flex items-center justify-between">
            <h2 id="versions-heading" className="font-['Inter:Semibold'] text-[#22201f] text-[16px] leading-[24px]">
              Available versions
            </h2>
            <span className="font-['Inter:Regular'] text-[#85837e] text-[12px] leading-[16px]">
              {prototypeVersions.length} prototype
            </span>
          </div>

          <div className="grid grid-cols-1 gap-[12px]">
            {prototypeVersions.map((prototype) => (
              <article
                key={prototype.version}
                className="flex flex-col gap-[24px] rounded-[12px] border border-[#e3e2dd] bg-white p-[20px] shadow-[0px_2px_8px_0px_rgba(34,32,31,0.03)] sm:flex-row sm:items-center sm:justify-between sm:p-[24px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-[12px] flex flex-wrap items-center gap-[10px]">
                    <span className="font-['Inter:Regular'] text-[#85837e] text-[12px] leading-[16px]">
                      Updated {prototype.updated}
                    </span>
                    {"status" in prototype && prototype.status && (
                      <span className="rounded-full bg-[#fff4db] px-[8px] py-[3px] font-['Inter:Medium'] text-[#8a5a00] text-[11px] leading-[14px]">
                        {prototype.status}
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[26px]">
                    {prototype.version}
                  </h3>
                  <p className="mt-[5px] max-w-[620px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[22px]">
                    {prototype.description}
                  </p>
                </div>
                <a
                  href={prototype.href}
                  className="inline-flex h-[40px] shrink-0 items-center justify-center gap-[8px] rounded-[8px] bg-[#1e72c4] px-[16px] font-['Inter:Semibold'] text-white text-[14px] leading-[20px] transition-colors hover:bg-[#1a64ae] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e72c4]"
                >
                  View prototype
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-[48px] border-t border-[#e3e2dd] pt-[16px] font-['Inter:Regular'] text-[#85837e] text-[12px] leading-[18px]">
          Prototype explorations are for review and may not reflect final product behavior.
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  const versionOnePath = `${import.meta.env.BASE_URL}version-1`.replace(/\/+$/, "");
  const versionTwoPath = `${import.meta.env.BASE_URL}version-2`.replace(/\/+$/, "");
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  if (currentPath === versionOnePath) return <VersionOnePrototype />;
  if (currentPath === versionTwoPath) return <VersionTwoA />;
  return <PrototypeHome />;
}

function VersionTwoA() {
  return <ReportsPrototype />;
}

function ReportsPrototype() {
  const initialSalesStorage = loadStoredValue<SalesOverviewStorage>(SALES_OVERVIEW_STORAGE_KEY, { savedFilters: [], defaultView: "__system__" });
  const initialSalesDefault = initialSalesStorage.savedFilters.find((view) => view.name === initialSalesStorage.defaultView);
  const [activeReport, setActiveReport] = useState<"Sales overview" | "Product sales">("Sales overview");
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(initialSalesDefault?.sites ?? []);
  const [selectedRegisters, setSelectedRegisters] = useState<string[]>(initialSalesDefault?.registers ?? []);
  const [taxSelected, setTaxSelected] = useState(initialSalesDefault?.tax ?? "Inclusive");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [dateSelected, setDateSelected] = useState<{ id: string; label: string }>(initialSalesDefault?.date ?? { id: "today", label: "Today" });
  const [compareSelected, setCompareSelected] = useState<{ id: string; label: string }>(initialSalesDefault?.compare ?? { id: "last-same-day", label: "Last Tuesday" });
  const showComparison = compareSelected.id !== "none";
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [activeViewName, setActiveViewName] = useState<string | null>(initialSalesDefault ? "Default" : null);
  const [defaultView, setDefaultView] = useState<string | null>(initialSalesStorage.defaultView);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
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

  const [savedFilters, setSavedFilters] = useState<SalesOverviewView[]>(initialSalesStorage.savedFilters);
  const savedFiltersRef = useRef<HTMLDivElement>(null);
  const selectedSites = SITE_OPTIONS.slice(1).filter((site) => selectedSiteIds.includes(site.id));
  const siteLabel = selectedSites.length === 0
    ? "All sites"
    : selectedSites.length > 1
      ? `${selectedSites.length} sites`
      : selectedSites[0].name;
  const registerLabel = selectedRegisters.length > 0 ? `${selectedRegisters.length} selected` : "All";
  const suggestedViewName = [
    selectedSites.length === 1
      ? selectedSites[0].name.split(" – ")[0]
      : selectedSites.length > 1
        ? `${selectedSites.length} sites`
        : "",
    dateSelected.id === "today"
      ? ""
      : dateSelected.id === "past-week"
        ? "Last week"
        : dateSelected.label,
  ].filter(Boolean).join(" - ") || "Sales overview";

  const isFilteredFromDefault =
    selectedSiteIds.length > 0 ||
    selectedRegisters.length > 0 ||
    dateSelected.id !== "today" ||
    compareSelected.id !== "last-same-day" ||
    taxSelected !== "Inclusive";

  const isSaved = savedFilters.some(
    (f) =>
      JSON.stringify(f.sites) === JSON.stringify(selectedSiteIds) &&
      JSON.stringify(f.registers) === JSON.stringify(selectedRegisters) &&
      f.date.id === dateSelected.id &&
      f.compare.id === compareSelected.id &&
      f.tax === taxSelected
  );

  useEffect(() => {
    window.localStorage.setItem(SALES_OVERVIEW_STORAGE_KEY, JSON.stringify({ savedFilters, defaultView } satisfies SalesOverviewStorage));
  }, [savedFilters, defaultView]);

  function applyFilter(f: SalesOverviewView) {
    setSelectedSiteIds(f.sites);
    setSelectedRegisters(f.registers);
    setDateSelected(f.date);
    setCompareSelected(f.compare);
    setTaxSelected(f.tax);
    setActiveViewName(f.name);
  }

  function applyDefaultView() {
    const savedDefault = savedFilters.find((filter) => filter.name === defaultView);
    if (!savedDefault) {
      reset();
      return;
    }
    applyFilter(savedDefault);
    setActiveViewName("Default");
  }

  function selectReport(report: "Sales overview" | "Product sales") {
    setActiveReport(report);
    if (report === "Sales overview") {
      const savedDefault = savedFilters.find((filter) => filter.name === defaultView);
      if (savedDefault) applyFilter(savedDefault);
      else reset();
    }
  }

  function saveCurrentFilters(name: string) {
    setSavedFilters((prev) => [
      ...prev,
      {
        name,
        sites: selectedSiteIds,
        registers: selectedRegisters,
        date: dateSelected,
        compare: compareSelected,
        tax: taxSelected,
      },
    ]);
    setActiveViewName(name);
    setToast(`"${name}" saved`);
  }

  function deleteFilter(name: string) {
    const remainingFilters = savedFilters.filter((filter) => filter.name !== name);
    setSavedFilters(remainingFilters);
    if (defaultView === name) setDefaultView(remainingFilters.length === 0 ? "__system__" : null);
  }

  function updateFilter(name: string) {
    setSavedFilters((prev) =>
      prev.map((f) =>
        f.name === name
          ? { ...f, sites: selectedSiteIds, registers: selectedRegisters, date: dateSelected, compare: compareSelected, tax: taxSelected }
          : f
      )
    );
    setActiveViewName(name);
    setToast(`"${name}" updated`);
  }

  function reset() {
    setSelectedSiteIds([]);
    setSelectedRegisters([]);
    setDateSelected({ id: "today", label: "Today" });
    setCompareSelected({ id: "last-same-day", label: "Last Tuesday" });
    setTaxSelected("Inclusive");
    setActiveViewName(null);
    setOpenFilter(null);
  }

  function toggleSite(id: string) {
    setActiveViewName(null);
    if (id === "all") {
      setSelectedSiteIds([]);
      setSelectedRegisters([]);
      return;
    }

    const nextIds = selectedSiteIds.includes(id)
      ? selectedSiteIds.filter((selectedId) => selectedId !== id)
      : [...selectedSiteIds, id];
    setSelectedSiteIds(nextIds);
    setSelectedRegisters((current) => current.filter((key) => nextIds.some((siteId) => key.startsWith(`${siteId}:`))));
  }

  function toggleRegister(key: string) {
    setActiveViewName(null);
    setSelectedRegisters((current) => current.includes(key)
      ? current.filter((register) => register !== key)
      : [...current, key]);
  }

  function toggleMenu(id: string) {
    setOpenFilter((current) => current === id ? null : id);
  }

  function chooseDate(id: string, label: string) {
    setActiveViewName(null);
    setDateSelected({ id, label });
    const options = COMPARE_TO_OPTIONS[id] ?? COMPARE_TO_OPTIONS["today"];
    setCompareSelected({ id: options[0].id, label: options[0].label });
  }

  return (
    <div className="bg-[#f9f8f4] flex h-screen w-full">
      <Sidebar activeReport={activeReport} onSelectReport={selectReport} />

      {/* Page area — white card fixed to viewport, only inner content scrolls */}
      <div className="flex-1 min-w-0 h-screen p-[8px] pl-0 flex flex-col">
        <div className="bg-white border border-[#e3e2dd] rounded-[16px] flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Title header — stays fixed */}
          <div className="border-b border-[#e3e2dd] flex gap-[16px] items-center px-[24px] py-[12px] w-full shrink-0">
            <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px] min-w-0 truncate">{activeReport}</span>
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

          {activeReport === "Product sales" ? (
            <div className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              <ProductSalesPage
                selectedSiteIds={selectedSiteIds}
                selectedSites={selectedSites}
                siteLabel={siteLabel}
                selectedRegisters={selectedRegisters}
                dateSelected={dateSelected}
                compareSelected={compareSelected}
                taxSelected={taxSelected}
                isRefreshing={isRefreshing}
                onToggleSite={toggleSite}
                onApplyRegisters={(names) => {
                  const sites = selectedSites.length > 0 ? selectedSites : SITE_OPTIONS.slice(1);
                  const keys = sites.flatMap((site) =>
                    names.filter((name) => (REGISTERS_BY_SITE[site.id] ?? []).includes(name)).map((name) => `${site.id}:${name}`)
                  );
                  setSelectedRegisters(keys);
                }}
                onApplyLocationSnapshot={(sites, registers) => {
                  setSelectedSiteIds(sites);
                  setSelectedRegisters(registers);
                }}
                onSelectDate={(id, label) => {
                  setDateSelected({ id, label });
                  const options = COMPARE_TO_OPTIONS[id] ?? COMPARE_TO_OPTIONS.today;
                  if (!options.some((option) => option.id === compareSelected.id)) {
                    setCompareSelected(options[0]);
                  }
                }}
                onSelectCompare={(id, label) => setCompareSelected({ id, label })}
                onSelectTax={setTaxSelected}
              />
            </div>
          ) : (
          /* Scrollable content area */
          <div className="flex flex-col gap-[24px] items-start p-[24px] w-full overflow-y-auto flex-1">
            {/* Filter bar */}
            <div className="flex w-full flex-wrap items-start gap-[8px]">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
              {savedFilters.length > 0 && (
                <>
              <div ref={savedFiltersRef} className="relative">
                <DefaultFilterChip
                  label="View"
                  value={activeViewName ?? "Default"}
                  valueClassName={activeViewName ? "max-w-[120px]" : ""}
                  onClick={() => setShowSavedViews((visible) => !visible)}
                />
                {showSavedViews && (
                  <SavedFiltersMenu
                    savedFilters={savedFilters}
                    defaultView={defaultView}
                    onClose={() => setShowSavedViews(false)}
                    onApplyDefault={applyDefaultView}
                    onApplyFilter={(name) => {
                      const filter = savedFilters.find((savedFilter) => savedFilter.name === name);
                      if (filter) applyFilter(filter);
                    }}
                    onSetDefault={setDefaultView}
                    onDeleteFilter={(name) => {
                      deleteFilter(name);
                      if (activeViewName === name) setActiveViewName(null);
                    }}
                  />
                )}
              </div>
              <div aria-hidden="true" className="mx-[4px] h-[24px] w-px shrink-0 bg-[#e3e2dd]" />
                </>
              )}
              <div className="relative">
                  <DefaultFilterChip
                    label="Site"
                    value={siteLabel}
                    valueClassName={selectedSites.length === 1 ? "max-w-[145px]" : ""}
                    onClick={() => toggleMenu("site")}
                  />
                  {openFilter === "site" && (
                    <SiteDropdown
                      selectedIds={selectedSiteIds}
                      onToggle={toggleSite}
                      onClose={() => setOpenFilter(null)}
                    />
                  )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu("date")}
                  className="flex h-[32px] max-w-full items-center gap-[8px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                >
                  <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">Date</span>
                  <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">{dateSelected.label}</span>
                  <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">vs</span>
                  <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">{compareSelected.label}</span>
                </button>
                {openFilter === "date" && (
                  <DateComparisonDropdown
                    dateId={dateSelected.id}
                    compareId={compareSelected.id}
                    onSelectDate={(id, label) => {
                      setActiveViewName(null);
                      chooseDate(id, label);
                    }}
                    onSelectCompare={(id, label) => {
                      setActiveViewName(null);
                      setCompareSelected({ id, label });
                    }}
                    onClose={() => setOpenFilter(null)}
                  />
                )}
              </div>

              {selectedSites.length > 0 && (
                <div className="relative">
                  <DefaultFilterChip
                    label="Register"
                    value={registerLabel}
                    onClick={() => toggleMenu("register")}
                  />
                  {openFilter === "register" && (
                    <RegisterDropdown
                      selectedSites={selectedSites}
                      selectedRegisters={selectedRegisters}
                      onToggle={toggleRegister}
                      onClose={() => setOpenFilter(null)}
                    />
                  )}
                </div>
              )}

              <div className="relative">
                <DefaultFilterChip label="Tax" value={taxSelected} onClick={() => toggleMenu("tax")} />
                {openFilter === "tax" && (
                  <TaxDropdown
                    selected={taxSelected}
                    onSelect={(value) => {
                      setActiveViewName(null);
                      setTaxSelected(value);
                    }}
                    onClose={() => setOpenFilter(null)}
                  />
                )}
              </div>
              </div>

              {/* Right actions */}
              <div className="ml-auto flex shrink-0 items-center gap-[8px]">
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
                        className="flex h-[32px] items-center justify-center rounded-[8px] bg-[#1e72c4] px-[12px] py-[4px] text-white transition-colors hover:bg-[#1a64ae]"
                      >
                        <span className="font-['Inter:Semi Bold'] font-semibold text-white text-[14px] leading-[20px] tracking-[0.014px] whitespace-nowrap">Save view</span>
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  aria-label="Export"
                  title="Export"
                  onClick={() => setShowExportModal(true)}
                  className="flex size-[32px] items-center justify-center rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 32 32" fill="none">
                    <path d="M8.3 21.1a6.1 6.1 0 0 1 .75-12.15A8.1 8.1 0 0 1 24.7 11.1a5.4 5.4 0 0 1-.4 10.77" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 15v12m0 0 4.5-4.5M16 27l-4.5-4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* KPI row */}
            <div className="flex gap-[16px] items-start w-full">
              <KpiCard label="Total sales" value="$4,182.60" change="+9.7%" changeColor="text-[#008e13]" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
              <KpiCard label="Orders" value="241" change="−4.6%" changeColor="text-[#8e1311]" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
              <KpiCard label="Average order" value="$17.35" change="+13.2%" changeColor="text-[#008e13]" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
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
              <HourlySalesChart compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
            </div>
            </WidgetCard>

            {/* Top lists row */}
            <div className="flex gap-[16px] items-stretch w-full">
              <TopListCard title="Top selling products" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} items={[
                { rank: 1, name: "Latte", count: 82, change: "+7.4%", positive: true },
                { rank: 2, name: "Flat White", count: 67, change: "−2.9%", positive: false },
                { rank: 3, name: "Plain Croissant", count: 32, change: "+15.6%", positive: true },
                { rank: 4, name: "Cappuccino", count: 31, change: "+4.8%", positive: true },
                { rank: 5, name: "Banana Bread", count: 16, change: "−8.3%", positive: false },
              ]} />
              <TopListCard title="Top selling categories" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} items={[
                { rank: 1, name: "Coffee", count: 187, change: "+12.1%", positive: true },
                { rank: 2, name: "Pastries", count: 76, change: "+6.5%", positive: true },
                { rank: 3, name: "Sweets", count: 65, change: "−5.7%", positive: false },
                { rank: 4, name: "Toasties", count: 47, change: "+10.9%", positive: true },
                { rank: 5, name: "Other drinks", count: 30, change: "+3.6%", positive: true },
              ]} />
              <TopListCard title="Top selling reporting groups" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} items={[
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
                  {showComparison && <>
                    <span className="text-right w-[120px] shrink-0">{compareSelected.label.charAt(0).toUpperCase() + compareSelected.label.slice(1)}</span>
                    <span className="text-right w-[120px] shrink-0">Difference</span>
                  </>}
                </div>
                <SiteTableRow rank={1} name="Amberley – The Coffee Company" today="$4,356.39" last="$3,960.11" diff="+8.8%" positive showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={2} name="Brambleton – The Coffee Company" today="$2,764.40" last="$2,940.24" diff="−3.4%" positive={false} showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={3} name="Copperfield – The Coffee Company" today="$2,661.29" last="$2,464.88" diff="+11.6%" positive showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={4} name="Foxglove – The Coffee Company" today="$2,045.94" last="$2,130.15" diff="−9.1%" positive={false} showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={5} name="Mossgate – The Coffee Company" today="$1,613.69" last="$1,440.01" diff="+5.3%" positive showComparison={showComparison} isRefreshing={isRefreshing} />
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
                  {showComparison && <>
                    <span className="text-right w-[120px] shrink-0">{compareSelected.label.charAt(0).toUpperCase() + compareSelected.label.slice(1)}</span>
                    <span className="text-right w-[120px] shrink-0">Difference</span>
                  </>}
                </div>
                <SiteTableRow rank={1} name="Olivia Hartwell" today="$3,241.80" last="$2,988.50" diff="+8.5%" positive showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={2} name="Marcus Delgado" today="$2,876.40" last="$2,910.20" diff="−1.2%" positive={false} showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={3} name="Priya Nair" today="$2,534.60" last="$2,310.75" diff="+9.7%" positive showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={4} name="Tom Ashworth" today="$2,190.30" last="$2,050.00" diff="+6.8%" positive showComparison={showComparison} isRefreshing={isRefreshing} />
                <SiteTableRow rank={5} name="Sophie Brennan" today="$1,847.90" last="$1,920.40" diff="−3.8%" positive={false} showComparison={showComparison} isRefreshing={isRefreshing} />
              </div>
              <span className="font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] cursor-pointer hover:underline">See more</span>
            </div>
            </WidgetCard>
          </div>
          )}
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
          suggestedName={suggestedViewName}
        />
      )}

      {showExportModal && (
        <ExportModal
          options={[EXPORT_OPTIONS[1]]}
          onClose={() => setShowExportModal(false)}
          onExport={(format) => {
            setShowExportModal(false);
            setToast(`${format} selected`);
          }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

    </div>
  );
}

const PRODUCT_SALES_ROWS = [
  { name: "Salmon Fillet", quantity: "10", sales: "$300.00", tax: "$27.30", cost: "$0.00", quantityShare: "12%", salesShare: "37%", profitShare: "0%" },
  { name: "Well Done", quantity: "10", sales: "$0.00", tax: "$0.00", cost: "$0.00", quantityShare: "12%", salesShare: "0%", profitShare: "0%" },
  { name: "Salt & Pepper Squid", quantity: "6", sales: "$72.00", tax: "$6.54", cost: "$0.00", quantityShare: "7%", salesShare: "9%", profitShare: "0%" },
  { name: "Mushrooms", quantity: "4", sales: "$4.00", tax: "$0.36", cost: "$0.00", quantityShare: "5%", salesShare: "0%", profitShare: "0%" },
  { name: "Bacon", quantity: "3", sales: "$6.00", tax: "$0.54", cost: "$0.00", quantityShare: "4%", salesShare: "1%", profitShare: "0%" },
  { name: "Hashbrown", quantity: "3", sales: "$6.00", tax: "$0.54", cost: "$0.00", quantityShare: "4%", salesShare: "1%", profitShare: "0%" },
  { name: "Chef special pizza", quantity: "3", sales: "$75.00", tax: "$6.81", cost: "$0.00", quantityShare: "4%", salesShare: "9%", profitShare: "0%" },
  { name: "Onions", quantity: "2", sales: "$1.00", tax: "$0.09", cost: "$0.00", quantityShare: "2%", salesShare: "0%", profitShare: "0%" },
  { name: "No Pineapple", quantity: "2", sales: "$0.00", tax: "$0.00", cost: "$0.00", quantityShare: "2%", salesShare: "0%", profitShare: "0%" },
  { name: "Quinoa and Farro Salad", quantity: "1", sales: "$7.00", tax: "$0.64", cost: "$0.00", quantityShare: "1%", salesShare: "1%", profitShare: "0%" },
  { name: "Extra Eggs", quantity: "1", sales: "$0.50", tax: "$0.05", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Mushroom Sauce", quantity: "1", sales: "$0.00", tax: "$0.00", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Long Black", quantity: "1", sales: "$3.00", tax: "$0.27", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Margherita Pizza - 12in", quantity: "1", sales: "$20.00", tax: "$1.82", cost: "$0.00", quantityShare: "1%", salesShare: "2%", profitShare: "0%" },
  { name: "Scrambled", quantity: "1", sales: "$0.00", tax: "$0.00", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Extra Cheese", quantity: "1", sales: "$0.50", tax: "$0.05", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Eggs Bene - Bacon", quantity: "1", sales: "$18.00", tax: "$1.64", cost: "$0.00", quantityShare: "1%", salesShare: "2%", profitShare: "0%" },
  { name: "Pork Sausage", quantity: "1", sales: "$0.00", tax: "$0.00", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Add Fries", quantity: "1", sales: "$4.00", tax: "$0.00", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Add Drink", quantity: "1", sales: "$3.00", tax: "$0.00", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Matcha Latte - Regular", quantity: "1", sales: "$3.75", tax: "$0.34", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Smoked Salmon", quantity: "1", sales: "$3.00", tax: "$0.27", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
  { name: "Edamame", quantity: "1", sales: "$3.00", tax: "$0.27", cost: "$0.00", quantityShare: "1%", salesShare: "0%", profitShare: "0%" },
];

function ProductSalesPage({
  selectedSiteIds,
  selectedSites,
  siteLabel,
  selectedRegisters,
  dateSelected,
  compareSelected,
  taxSelected,
  isRefreshing,
  onToggleSite,
  onApplyRegisters,
  onApplyLocationSnapshot,
  onSelectDate,
  onSelectCompare,
  onSelectTax,
}: {
  selectedSiteIds: string[];
  selectedSites: SiteOption[];
  siteLabel: string;
  selectedRegisters: string[];
  dateSelected: { id: string; label: string };
  compareSelected: { id: string; label: string };
  taxSelected: string;
  isRefreshing: boolean;
  onToggleSite: (id: string) => void;
  onApplyRegisters: (names: string[]) => void;
  onApplyLocationSnapshot: (sites: string[], registers: string[]) => void;
  onSelectDate: (id: string, label: string) => void;
  onSelectCompare: (id: string, label: string) => void;
  onSelectTax: (value: string) => void;
}) {
  const initialProductStorage = loadStoredValue<ProductSalesStorage>(PRODUCT_SALES_STORAGE_KEY, { savedViews: [], defaultView: "__system__" });
  const initialProductDefault = initialProductStorage.savedViews.find((view) => view.name === initialProductStorage.defaultView);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [salesBy, setSalesBy] = useState(initialProductDefault?.salesBy ?? "Product");
  const [product, setProduct] = useState<string[]>(initialProductDefault?.products ?? []);
  const [category, setCategory] = useState<string[]>(initialProductDefault?.categories ?? []);
  const [reportingGroup, setReportingGroup] = useState<string[]>(initialProductDefault?.reportingGroups ?? []);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(initialProductDefault?.visibleFilters ?? []);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [savedViews, setSavedViews] = useState<ProductSalesView[]>(initialProductStorage.savedViews);
  const [activeViewName, setActiveViewName] = useState<string | null>(initialProductDefault ? "Default" : null);
  const [defaultView, setDefaultView] = useState<string | null>(initialProductStorage.defaultView);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  type SortKey = keyof (typeof PRODUCT_SALES_ROWS)[number];
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  useEffect(() => {
    window.localStorage.setItem(PRODUCT_SALES_STORAGE_KEY, JSON.stringify({ savedViews, defaultView } satisfies ProductSalesStorage));
  }, [savedViews, defaultView]);

  useEffect(() => {
    if (!initialProductDefault) return;
    onApplyLocationSnapshot(initialProductDefault.sites, initialProductDefault.registers);
    onSelectDate(initialProductDefault.date.id, initialProductDefault.date.label);
    onSelectCompare(initialProductDefault.compare.id, initialProductDefault.compare.label);
    onSelectTax(initialProductDefault.tax);
  }, []);
  const metrics = [
    { label: "Top selling product", value: "Latte", change: "+9.7%", changeClass: "text-[#008e13]" },
    { label: "Bottom selling product", value: "$4,182.60", change: "+9.7%", changeClass: "text-[#008e13]" },
    { label: "Something", value: "241", change: "−4.6%", changeClass: "text-[#8e1311]" },
    { label: "Something", value: "$17.35", change: "+13.2%", changeClass: "text-[#008e13]" },
  ];
  const columns: Array<{ key: SortKey; label: string; className: string }> = [
    { key: "name", label: "Product Name", className: "w-[20%]" },
    { key: "quantity", label: "Product Quantity", className: "w-[12%]" },
    { key: "sales", label: "$ Sales", className: "w-[10%] text-right" },
    { key: "tax", label: "Total Tax", className: "w-[10%] text-right" },
    { key: "cost", label: "Cost", className: "w-[9%] text-right" },
    { key: "quantityShare", label: "% of Quantity", className: "w-[12%]" },
    { key: "salesShare", label: "% of Sale Amount", className: "w-[17%]" },
    { key: "profitShare", label: "Gross Profit %", className: "w-[10%]" },
  ];
  const sortedRows = [...PRODUCT_SALES_ROWS].sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const comparison = sort.key === "name"
      ? String(left).localeCompare(String(right))
      : Number(String(left).replace(/[^\d.-]/g, "")) - Number(String(right).replace(/[^\d.-]/g, ""));
    return sort.direction === "asc" ? comparison : -comparison;
  });

  function toggleFilter(id: string) {
    setOpenFilter((current) => current === id ? null : id);
  }

  const optionalFilters = ["Product", "Category", "Reporting group", "Register", "Tax"];
  const availableFilters = optionalFilters.filter((filter) => !visibleFilters.includes(filter));
  const isFilteredFromDefault =
    selectedSiteIds.length > 0 ||
    selectedRegisters.length > 0 ||
    dateSelected.id !== "today" ||
    compareSelected.id !== "last-same-day" ||
    salesBy !== "Product" ||
    product.length > 0 ||
    category.length > 0 ||
    reportingGroup.length > 0 ||
    taxSelected !== "Inclusive" ||
    visibleFilters.length > 0;
  const isSaved = savedViews.some((view) =>
    view.salesBy === salesBy &&
    JSON.stringify(view.sites) === JSON.stringify(selectedSiteIds) &&
    JSON.stringify(view.registers) === JSON.stringify(selectedRegisters) &&
    view.date.id === dateSelected.id &&
    view.compare.id === compareSelected.id &&
    JSON.stringify(view.products) === JSON.stringify(product) &&
    JSON.stringify(view.categories) === JSON.stringify(category) &&
    JSON.stringify(view.reportingGroups) === JSON.stringify(reportingGroup) &&
    view.tax === taxSelected &&
    JSON.stringify(view.visibleFilters) === JSON.stringify(visibleFilters)
  );

  function resetProductSalesFilters() {
    setSalesBy("Product");
    setProduct([]);
    setCategory([]);
    setReportingGroup([]);
    setVisibleFilters([]);
    setOpenFilter(null);
    setActiveViewName(null);
    onToggleSite("all");
    onApplyRegisters([]);
    onSelectDate("today", "Today");
    onSelectCompare("last-same-day", "Last Tuesday");
    onSelectTax("Inclusive");
  }

  function applyView(view: ProductSalesView) {
    setSalesBy(view.salesBy);
    setProduct(view.products);
    setCategory(view.categories);
    setReportingGroup(view.reportingGroups);
    setVisibleFilters(view.visibleFilters);
    setActiveViewName(view.name);
    onApplyLocationSnapshot(view.sites, view.registers);
    onSelectDate(view.date.id, view.date.label);
    onSelectCompare(view.compare.id, view.compare.label);
    onSelectTax(view.tax);
  }

  function applyDefaultView() {
    const view = savedViews.find((savedView) => savedView.name === defaultView);
    if (!view) {
      resetProductSalesFilters();
      setActiveViewName("Default");
      return;
    }
    applyView(view);
    setActiveViewName("Default");
  }

  function applySavedView(name: string) {
    const view = savedViews.find((savedView) => savedView.name === name);
    if (view) applyView(view);
  }

  function captureView(name: string): ProductSalesView {
    return {
      name,
      salesBy,
      sites: selectedSiteIds,
      registers: selectedRegisters,
      date: dateSelected,
      compare: compareSelected,
      products: product,
      categories: category,
      reportingGroups: reportingGroup,
      tax: taxSelected,
      visibleFilters,
    };
  }

  function saveView(name: string) {
    const view = captureView(name);
    setSavedViews((current) => [...current, view]);
    setActiveViewName(name);
  }

  function updateSavedView(name: string) {
    const updatedView = captureView(name);
    setSavedViews((current) => current.map((view) => view.name === name ? updatedView : view));
    setActiveViewName(name);
  }

  function deleteSavedView(name: string) {
    setSavedViews((current) => current.filter((view) => view.name !== name));
    if (defaultView === name) setDefaultView("__system__");
    if (activeViewName === name) setActiveViewName(null);
  }

  function showFilter(filter: string) {
    setVisibleFilters((current) => [...current, filter]);
    setActiveViewName(null);
  }

  function hideFilter(filter: string) {
    setVisibleFilters((current) => current.filter((item) => item !== filter));
    setActiveViewName(null);
    setOpenFilter(null);
  }

  function selectedFilterLabel(values: string[], pluralLabel: string) {
    if (values.length === 0) return "All";
    return values.length === 1 ? values[0] : `${values.length} ${pluralLabel}`;
  }

  function renderOptionalFilter(filter: string) {
    const value = filter === "Product" ? selectedFilterLabel(product, "products")
      : filter === "Category" ? selectedFilterLabel(category, "categories")
        : filter === "Reporting group" ? selectedFilterLabel(reportingGroup, "reporting groups")
          : filter === "Register" ? selectedFilterLabel([...new Set(selectedRegisters.map((register) => register.split(":").slice(1).join(":")))], "registers")
            : taxSelected;
    const filterId = filter.toLowerCase().replace(/ /g, "-");

    return (
      <div key={filter} className="relative flex items-center">
        <DefaultFilterChip label={filter} value={value} chipClassName="pr-[36px]" onClick={() => toggleFilter(filterId)} />
        <button type="button" aria-label={`Remove ${filter} filter`} onClick={() => hideFilter(filter)} className="absolute right-[8px] flex size-[20px] shrink-0 items-center justify-center rounded-full text-[#85837e] hover:bg-[#f2f0ea] hover:text-[#22201f]">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 3 6 6m0-6L3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        </button>
        {openFilter === filterId && (filter === "Product" ? (
          <MultiSelectDropdown title="Product" options={PRODUCT_SALES_ROWS.map((row) => row.name)} selected={product} onApply={(values) => { setProduct(values); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} searchable />
        ) : filter === "Category" ? (
          <MultiSelectDropdown title="Category" options={["Coffee", "Food", "Bakery", "Drinks"]} selected={category} onApply={(values) => { setCategory(values); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} searchable />
        ) : filter === "Reporting group" ? (
          <MultiSelectDropdown title="Reporting group" options={["Beverages", "Brunch", "Bakery"]} selected={reportingGroup} onApply={(values) => { setReportingGroup(values); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} searchable />
        ) : filter === "Register" ? (
          <MultiSelectDropdown title="Register" options={[...new Set(Object.values(REGISTERS_BY_SITE).flat())]} selected={[...new Set(selectedRegisters.map((register) => register.split(":").slice(1).join(":")))]} onApply={(values) => { onApplyRegisters(values); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} searchable />
        ) : (
          <TaxDropdown selected={taxSelected} onSelect={(value) => { onSelectTax(value); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px] p-[24px]">
      <div className="flex w-full flex-wrap items-start gap-[8px]">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
          {savedViews.length > 0 && <>
            <div className="relative">
              <DefaultFilterChip label="View" value={activeViewName ?? "Default"} valueClassName={activeViewName ? "max-w-[120px]" : ""} onClick={() => setShowSavedViews((visible) => !visible)} />
              {showSavedViews && <SavedFiltersMenu
                savedFilters={savedViews}
                defaultView={defaultView}
                onClose={() => setShowSavedViews(false)}
                onApplyDefault={applyDefaultView}
                onApplyFilter={applySavedView}
                onSetDefault={setDefaultView}
                onDeleteFilter={deleteSavedView}
              />}
            </div>
            <div aria-hidden="true" className="mx-[4px] h-[24px] w-px shrink-0 bg-[#e3e2dd]" />
          </>}
          <div className="relative">
            <DefaultFilterChip label="Sales by" value={salesBy} onClick={() => toggleFilter("sales-by")} />
            {openFilter === "sales-by" && <OptionsDropdown options={["Product", "Category", "Reporting group", "User"]} selected={salesBy} onSelect={(value) => { setSalesBy(value); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} width={180} />}
          </div>
          <div className="relative">
            <DefaultFilterChip label="Site" value={siteLabel} valueClassName={selectedSites.length === 1 ? "max-w-[145px]" : ""} onClick={() => toggleFilter("site")} />
            {openFilter === "site" && <SiteDropdown selectedIds={selectedSiteIds} onToggle={(id) => { setActiveViewName(null); onToggleSite(id); }} onClose={() => setOpenFilter(null)} />}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleFilter("date")}
              className="flex h-[32px] max-w-full items-center gap-[8px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
            >
              <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">Date</span>
              <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">{dateSelected.label}</span>
              <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">vs</span>
              <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">{compareSelected.label}</span>
            </button>
            {openFilter === "date" && <DateComparisonDropdown dateId={dateSelected.id} compareId={compareSelected.id} onSelectDate={(id, label) => { setActiveViewName(null); onSelectDate(id, label); }} onSelectCompare={(id, label) => { setActiveViewName(null); onSelectCompare(id, label); }} onClose={() => setOpenFilter(null)} />}
          </div>
          {visibleFilters.map(renderOptionalFilter)}
          <div className="relative">
            <button type="button" aria-label="Add filter" title="Add filter" onClick={() => toggleFilter("add-filter")} className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#e3e2dd] bg-white text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            {openFilter === "add-filter" && <AddFilterDropdown
              filters={availableFilters}
              filterOptions={{
                Product: ["All", ...PRODUCT_SALES_ROWS.map((row) => row.name)],
                Category: ["All", "Coffee", "Food", "Bakery", "Drinks"],
                "Reporting group": ["All", "Beverages", "Brunch", "Bakery"],
                Register: ["POS A", "Front POS", "Back POS"],
                Tax: ["Inclusive", "Exclusive"],
              }}
              selectedValues={{
                Product: product,
                Category: category,
                "Reporting group": reportingGroup,
                Register: [...new Set(selectedRegisters.map((register) => register.split(":").slice(1).join(":")))],
              }}
              onApply={(filter, values) => {
                setActiveViewName(null);
                if (filter === "Product") setProduct(values);
                if (filter === "Category") setCategory(values);
                if (filter === "Reporting group") setReportingGroup(values);
                if (filter === "Register") onApplyRegisters(values);
                if (filter === "Tax") onSelectTax(values[0] ?? "Inclusive");
                setVisibleFilters((current) => current.includes(filter) ? current : [...current, filter]);
              }}
              onClose={() => setOpenFilter(null)}
            />}
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-[8px]">
          {isFilteredFromDefault && <>
            <button
              type="button"
              onClick={resetProductSalesFilters}
              className="flex h-[32px] items-center justify-center px-[4px] transition-opacity hover:opacity-70"
            >
              <span className="whitespace-nowrap font-['Inter:Semi_Bold'] text-[#22201f] text-[14px] leading-[20px]">Reset</span>
            </button>
            {!isSaved && <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="flex h-[32px] items-center justify-center rounded-[8px] bg-[#1e72c4] px-[12px] text-white transition-colors hover:bg-[#1a64ae]"
            >
              <span className="whitespace-nowrap font-['Inter:Semi_Bold'] text-[14px] leading-[20px]">Save view</span>
            </button>}
          </>}
          <button
            type="button"
            aria-label="Export"
            title="Export"
            onClick={() => setShowExportModal(true)}
            className="flex size-[32px] items-center justify-center rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M8.3 21.1a6.1 6.1 0 0 1 .75-12.15A8.1 8.1 0 0 1 24.7 11.1a5.4 5.4 0 0 1-.4 10.77" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 15v12m0 0 4.5-4.5M16 27l-4.5-4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex min-h-[92px] min-w-0 flex-col gap-[8px] rounded-[8px] border border-[#e3e2dd] p-[12px] sm:p-[16px]">
            <div className="flex items-center gap-[16px]">
              <span className="flex-1 font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">{metric.label}</span>
              <InfoIcon tooltip={metric.label} />
            </div>
            {isRefreshing ? <Sk w="w-[112px]" h="h-[28px]" /> : <span className="truncate font-['Inter:Semibold'] text-[#22201f] text-[20px] leading-[28px]">{metric.value}</span>}
            {metric.change && (metric.label !== "Top selling product" || compareSelected.id !== "none") && (isRefreshing ? <Sk w="w-[156px]" /> : (
              <p className="text-[0px] leading-[0]">
                <span className={`font-['Inter:Semibold'] text-[12px] leading-[20px] ${metric.changeClass}`}>{metric.change} </span>
                <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[20px]">vs {metric.label === "Top selling product" ? compareSelected.label : "last Tuesday"}</span>
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-[#f9f8f4] font-['Inter:Medium'] text-[#22201f] text-[12px] leading-[16px]">
              <tr className="h-[40px] border-b border-[#e3e2dd]">
                {columns.map((column) => (
                  <th key={column.key} className={`${column.className} ${column.key === "name" ? "pl-[16px] pr-[8px]" : "px-[8px]"} py-[6px] font-medium`}>
                    <button
                      type="button"
                      aria-label={`Sort by ${column.label}${sort.key === column.key ? `, ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
                      onClick={() => setSort((current) => ({
                        key: column.key,
                        direction: current.key === column.key && current.direction === "asc" ? "desc" : "asc",
                      }))}
                      className={`inline-flex min-w-0 items-center gap-[4px] whitespace-normal ${column.className.includes("text-right") ? "w-full justify-end text-right" : "text-left"}`}
                    >
                      <span className="min-w-0">{column.label}</span>
                      <svg
                        aria-hidden="true"
                        className={`size-[14px] shrink-0 transition-transform ${sort.key === column.key ? "text-[#22201f]" : "text-[#85837e]"} ${sort.key === column.key && sort.direction === "desc" ? "rotate-180" : ""}`}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path d="M8 13V3m0 0L3.75 7.25M8 3l4.25 4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-['Inter:Regular'] text-[#22201f] text-[12px] leading-[16px]">
              {sortedRows.map((product) => (
                <tr key={product.name} className="h-[48px] border-b border-[#e3e2dd] last:border-b-0">
                  <td className="break-all py-[6px] pl-[16px] pr-[8px]">{isRefreshing ? <Sk w="w-full" /> : <span className="text-[14px] leading-[20px]">{product.name}</span>}</td>
                  <td className="break-all px-[4px] py-[6px]">{isRefreshing ? <Sk w="w-full" /> : product.quantity}</td>
                  <td className="break-all px-[4px] py-[6px] text-right">{isRefreshing ? <Sk w="w-full" /> : product.sales}</td>
                  <td className="break-all px-[4px] py-[6px] text-right">{isRefreshing ? <Sk w="w-full" /> : product.tax}</td>
                  <td className="break-all px-[4px] py-[6px] text-right">{isRefreshing ? <Sk w="w-full" /> : product.cost}</td>
                  <td className="break-all px-[4px] py-[6px]">{isRefreshing ? <Sk w="w-full" /> : product.quantityShare}</td>
                  <td className="break-all px-[4px] py-[6px]">{isRefreshing ? <Sk w="w-full" /> : product.salesShare}</td>
                  <td className="break-all px-[4px] py-[6px]">{isRefreshing ? <Sk w="w-full" /> : product.profitShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {showSaveModal && <SaveViewModal
        onClose={() => setShowSaveModal(false)}
        onSave={saveView}
        onUpdate={updateSavedView}
        existingFilters={savedViews.map((view) => view.name)}
        hasExisting={savedViews.length > 0}
        suggestedName={[
          selectedSites.length === 1 ? selectedSites[0].name.split(" – ")[0] : selectedSites.length > 1 ? `${selectedSites.length} sites` : "",
          dateSelected.id === "today" ? "" : dateSelected.id === "past-week" ? "Last week" : dateSelected.label,
        ].filter(Boolean).join(" - ") || "Product sales"}
      />}
      {showExportModal && <ExportModal
        onClose={() => setShowExportModal(false)}
        onExport={(format) => {
          setShowExportModal(false);
          setToast(`${format} selected`);
        }}
      />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
