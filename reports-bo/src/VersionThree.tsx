import React, { useState, useRef, useEffect } from "react";
import VersionOnePrototype from "./VersionOne";
import ActionButton from "./components/ActionButton";

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
const imgExport = `${assetPathPrefix}/version-3-export.svg`;
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

type ReportName = "Reports" | "Snapshot" | "Product sales" | "Transactions";
type SavedReportKind = Exclude<ReportName, "Reports">;
type SavedViewSummary = { name: string; createdBy?: string };

type DirectoryReport = {
  id: string;
  title: string;
  description: string;
  category: string;
  report: SavedReportKind;
  viewName?: string;
  createdBy?: string;
};

const DEFAULT_PINNED_REPORT_IDS: string[] = [];
const LEGACY_DEFAULT_PINNED_REPORT_IDS = ["preset:product-sales-amberley", "preset:bopple-transactions", "preset:top-products-wa"];
const REPORT_PINS_STORAGE_KEY = "reports-bo:version-3:report-pins";
const REPORT_DESCRIPTION = "See report on sales by product, category, site, reporting groups, and more.";
const CURRENT_CREATOR = "Poppy B.";

const reportDirectoryItems: DirectoryReport[] = [
  { id: "preset:product-sales-amberley", title: "Product sales for Amberley VIC", description: REPORT_DESCRIPTION, category: "Sales", report: "Product sales" },
  { id: "preset:bopple-transactions", title: "All Bopple transactions", description: REPORT_DESCRIPTION, category: "Transactions", report: "Transactions" },
  { id: "preset:top-products-wa", title: "Top selling products in WA", description: REPORT_DESCRIPTION, category: "Sales", report: "Product sales" },
  { id: "preset:transactions", title: "Transactions", description: REPORT_DESCRIPTION, category: "Transactions", report: "Transactions" },
  { id: "preset:product-sales", title: "Product sales", description: REPORT_DESCRIPTION, category: "Sales", report: "Product sales" },
];

function ReportsLanding({ onSelectReport }: { onSelectReport: (report: DirectoryReport) => void }) {
  const [category, setCategory] = useState("All");
  const [creator, setCreator] = useState("Anyone");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const pins: unknown = JSON.parse(window.localStorage.getItem(REPORT_PINS_STORAGE_KEY) ?? "null");
      return Array.isArray(pins) && pins.every((pin) => typeof pin === "string")
        ? pins.filter((pin) => !LEGACY_DEFAULT_PINNED_REPORT_IDS.includes(pin))
        : DEFAULT_PINNED_REPORT_IDS;
    } catch {
      return DEFAULT_PINNED_REPORT_IDS;
    }
  });
  const savedReports: DirectoryReport[] = [
    ...loadStoredValue<SalesOverviewStorage>(SALES_OVERVIEW_STORAGE_KEY, { savedFilters: [], defaultView: "__system__" }).savedFilters.filter((view) => view.createdBy).map((view) => ({ id: `saved:Snapshot:${view.name}`, title: view.name, description: REPORT_DESCRIPTION, category: "Sales", report: "Snapshot" as const, viewName: view.name, createdBy: view.createdBy })),
    ...loadStoredValue<ProductSalesStorage>(PRODUCT_SALES_STORAGE_KEY, { savedViews: [], defaultView: "__system__" }).savedViews.filter((view) => view.createdBy).map((view) => ({ id: `saved:Product sales:${view.name}`, title: view.name, description: REPORT_DESCRIPTION, category: "Sales", report: "Product sales" as const, viewName: view.name, createdBy: view.createdBy })),
    ...loadStoredValue<TransactionsStorage>(TRANSACTIONS_STORAGE_KEY, { savedViews: [], defaultView: "__system__" }).savedViews.filter((view) => view.createdBy).map((view) => ({ id: `saved:Transactions:${view.name}`, title: view.name, description: REPORT_DESCRIPTION, category: "Transactions", report: "Transactions" as const, viewName: view.name, createdBy: view.createdBy })),
  ];
  const reports = [...reportDirectoryItems, ...savedReports];
  const creators = [...new Set(reports.map((report) => report.createdBy).filter((name): name is string => !!name))];
  const visibleReports = reports.filter((report) =>
    (category === "All" || report.category === category) &&
    (creator === "Anyone" || report.createdBy === creator)
  );
  const pinnedReports = visibleReports.filter((report) => pinnedIds.includes(report.id));
  const allReports = visibleReports.filter((report) => !pinnedIds.includes(report.id));

  useEffect(() => {
    window.localStorage.setItem(REPORT_PINS_STORAGE_KEY, JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  function togglePin(id: string) {
    setPinnedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function ReportRows({ reports, hoverClassName = "hover:bg-[#edeae4]" }: { reports: DirectoryReport[]; hoverClassName?: string }) {
    return reports.map((report) => (
      <div
        key={report.id}
        className={`group flex w-full items-center gap-[12px] border-t border-[#e3e2dd] p-[16px] transition-colors ${hoverClassName}`}
      >
        <button type="button" onClick={() => onSelectReport(report)} className="flex min-w-0 flex-1 flex-col gap-[2px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1e72c4]">
          <span className="font-['Inter:Semibold'] text-[15px] leading-[22px] text-[#22201f]">{report.title}</span>
          <span className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">{report.description}</span>
        </button>
        <div className="flex shrink-0 items-center gap-[8px]">
          {report.createdBy && <span className="font-['Inter:Regular'] text-[12px] leading-[16px] text-[#62615d]">Created by {report.createdBy}</span>}
          <Tooltip text={pinnedIds.includes(report.id) ? "Unpin report" : "Pin report"}>
            <button type="button" aria-label={`${pinnedIds.includes(report.id) ? "Unpin" : "Pin"} ${report.title}`} aria-pressed={pinnedIds.includes(report.id)} onClick={() => togglePin(report.id)} className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] text-[#777671] transition-colors hover:bg-[#e3e2dd] hover:text-[#22201f] focus-visible:outline-2 focus-visible:outline-[#1e72c4]">
              {pinnedIds.includes(report.id) ? (
                <svg aria-hidden="true" className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M5.58471 10.4105L1.81348 14.1817M7.7965 4.42747L6.75591 5.46806C6.67103 5.55294 6.62859 5.59538 6.58023 5.62911C6.53731 5.65904 6.49102 5.68382 6.44231 5.70293C6.38742 5.72445 6.32857 5.73622 6.21086 5.75977L3.76788 6.24836C3.13301 6.37534 2.81558 6.43882 2.66707 6.60619C2.53769 6.752 2.47861 6.94713 2.50538 7.14021C2.53611 7.36185 2.76501 7.59075 3.22282 8.04856L7.94665 12.7724C8.40446 13.2302 8.63336 13.4591 8.855 13.4898C9.04808 13.5166 9.24321 13.4575 9.38902 13.3281C9.55639 13.1796 9.61987 12.8622 9.74685 12.2273L10.2354 9.78435C10.259 9.66664 10.2708 9.60779 10.2923 9.5529C10.3114 9.50419 10.3362 9.4579 10.3661 9.41498C10.3998 9.36662 10.4423 9.32418 10.5271 9.2393L11.5677 8.19871C11.622 8.14444 11.6491 8.1173 11.679 8.09361C11.7055 8.07256 11.7335 8.05356 11.7629 8.03678C11.796 8.01788 11.8313 8.00277 11.9018 7.97253L13.5647 7.25986C14.0498 7.05194 14.2924 6.94799 14.4026 6.78C14.499 6.63309 14.5334 6.45409 14.4985 6.28191C14.4586 6.08502 14.272 5.89841 13.8988 5.52519L10.47 2.09643C10.0968 1.72321 9.91019 1.53661 9.7133 1.49669C9.54112 1.46179 9.36212 1.49626 9.21521 1.59261C9.04722 1.7028 8.94327 1.94536 8.73535 2.4305L8.02268 4.0934C7.99244 4.16395 7.97733 4.19922 7.95843 4.23229C7.94165 4.26168 7.92265 4.28974 7.9016 4.31624C7.87791 4.34606 7.85077 4.3732 7.7965 4.42747Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="m4 4 8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" /></svg>
              ) : (
                <svg aria-hidden="true" className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M5.58471 10.4105L1.81348 14.1817M7.7965 4.42747L6.75591 5.46806C6.67103 5.55294 6.62859 5.59538 6.58023 5.62911C6.53731 5.65904 6.49102 5.68382 6.44231 5.70293C6.38742 5.72445 6.32857 5.73622 6.21086 5.75977L3.76788 6.24836C3.13301 6.37534 2.81558 6.43882 2.66707 6.60619C2.53769 6.752 2.47861 6.94713 2.50538 7.14021C2.53611 7.36185 2.76501 7.59075 3.22282 8.04856L7.94665 12.7724C8.40446 13.2302 8.63336 13.4591 8.855 13.4898C9.04808 13.5166 9.24321 13.4575 9.38902 13.3281C9.55639 13.1796 9.61987 12.8622 9.74685 12.2273L10.2354 9.78435C10.259 9.66664 10.2708 9.60779 10.2923 9.5529C10.3114 9.50419 10.3362 9.4579 10.3661 9.41498C10.3998 9.36662 10.4423 9.32418 10.5271 9.2393L11.5677 8.19871C11.622 8.14444 11.6491 8.1173 11.679 8.09361C11.7055 8.07256 11.7335 8.05356 11.7629 8.03678C11.796 8.01788 11.8313 8.00277 11.9018 7.97253L13.5647 7.25986C14.0498 7.05194 14.2924 6.94799 14.4026 6.78C14.499 6.63309 14.5334 6.45409 14.4985 6.28191C14.4586 6.08502 14.272 5.89841 13.8988 5.52519L10.47 2.09643C10.0968 1.72321 9.91019 1.53661 9.7133 1.49669C9.54112 1.46179 9.36212 1.49626 9.21521 1.59261C9.04722 1.7028 8.94327 1.94536 8.73535 2.4305L8.02268 4.0934C7.99244 4.16395 7.97733 4.19922 7.95843 4.23229C7.94165 4.26168 7.92265 4.28974 7.9016 4.31624C7.87791 4.34606 7.85077 4.3732 7.7965 4.42747Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    ));
  }

  return (
    <div className="h-0 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-[24px] px-[20px] py-[24px] sm:px-[24px]">
        <div className="flex flex-wrap gap-[8px]">
          <div className="relative">
            <DefaultFilterChip label="Category" value={category} onClick={() => setOpenFilter((current) => current === "category" ? null : "category")} />
            {openFilter === "category" && <OptionsDropdown options={["All", "Sales", "Transactions"]} selected={category} onSelect={setCategory} onClose={() => setOpenFilter(null)} width={180} />}
          </div>
          <div className="relative">
            <DefaultFilterChip label="Created by" value={creator} onClick={() => setOpenFilter((current) => current === "creator" ? null : "creator")} />
            {openFilter === "creator" && <OptionsDropdown options={["Anyone", ...creators]} selected={creator} onSelect={setCreator} onClose={() => setOpenFilter(null)} width={180} />}
          </div>
        </div>

        <section aria-labelledby="pinned-reports-heading" className="rounded-[12px] bg-[#f9f8f4] p-[24px]">
            <h2 id="pinned-reports-heading" className="mb-[16px] flex items-center gap-[10px] px-[2px] font-['Inter:Semibold'] text-[16px] leading-[24px] text-[#22201f]">
              <svg aria-hidden="true" className="size-[16px]" fill="none" viewBox="0 0 16 16"><path d="M5.58471 10.4105L1.81348 14.1817M7.7965 4.42747L6.75591 5.46806C6.67103 5.55294 6.62859 5.59538 6.58023 5.62911C6.53731 5.65904 6.49102 5.68382 6.44231 5.70293C6.38742 5.72445 6.32857 5.73622 6.21086 5.75977L3.76788 6.24836C3.13301 6.37534 2.81558 6.43882 2.66707 6.60619C2.53769 6.752 2.47861 6.94713 2.50538 7.14021C2.53611 7.36185 2.76501 7.59075 3.22282 8.04856L7.94665 12.7724C8.40446 13.2302 8.63336 13.4591 8.855 13.4898C9.04808 13.5166 9.24321 13.4575 9.38902 13.3281C9.55639 13.1796 9.61987 12.8622 9.74685 12.2273L10.2354 9.78435C10.259 9.66664 10.2708 9.60779 10.2923 9.5529C10.3114 9.50419 10.3362 9.4579 10.3661 9.41498C10.3998 9.36662 10.4423 9.32418 10.5271 9.2393L11.5677 8.19871C11.622 8.14444 11.6491 8.1173 11.679 8.09361C11.7055 8.07256 11.7335 8.05356 11.7629 8.03678C11.796 8.01788 11.8313 8.00277 11.9018 7.97253L13.5647 7.25986C14.0498 7.05194 14.2924 6.94799 14.4026 6.78C14.499 6.63309 14.5334 6.45409 14.4985 6.28191C14.4586 6.08502 14.272 5.89841 13.8988 5.52519L10.47 2.09643C10.0968 1.72321 9.91019 1.53661 9.7133 1.49669C9.54112 1.46179 9.36212 1.49626 9.21521 1.59261C9.04722 1.7028 8.94327 1.94536 8.73535 2.4305L8.02268 4.0934C7.99244 4.16395 7.97733 4.19922 7.95843 4.23229C7.94165 4.26168 7.92265 4.28974 7.9016 4.31624C7.87791 4.34606 7.85077 4.3732 7.7965 4.42747Z" stroke="#777671" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
              Pinned
            </h2>
            <ReportRows reports={pinnedReports} />
            {pinnedReports.length === 0 && <p className="px-[16px] py-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">Pin reports to keep them handy. They will appear here.</p>}
          </section>

        <section aria-labelledby="all-reports-heading" className="rounded-[12px] border border-[#e3e2dd] p-[24px]">
          <h2 id="all-reports-heading" className="mb-[16px] px-[2px] font-['Inter:Semibold'] text-[16px] leading-[24px] text-[#22201f]">All reports</h2>
          {allReports.length > 0 ? <ReportRows reports={allReports} hoverClassName="hover:bg-[#f9f8f4]" /> : <p className="border-t border-[#e3e2dd] px-[16px] py-[20px] text-[14px] leading-[20px] text-[#62615d]">No reports match these filters.</p>}
        </section>
      </div>
    </div>
  );
}

const overviewV2Donuts = [
  {
    title: "Open orders",
    segments: [{ label: "Open orders", value: "218", color: "#3390e0", share: 91 }, { label: "Closed orders", value: "23", color: "#1fc641", share: 9 }],
  },
  {
    title: "Payment methods",
    segments: [
      { label: "Lightspeed Payments", value: "84.4%", color: "#3390e0", change: "−2.4%", positive: false, share: 54 },
      { label: "Cash", value: "5.2%", color: "#a367e8", change: "+3.3%", positive: true, share: 14 },
      { label: "Loyalty Credit", value: "4.8%", color: "#9bd879", change: "+8.7%", positive: true, share: 12 },
      { label: "Gift Cards", value: "2.1%", color: "#ed8ddc", change: "+8.3%", positive: true, share: 10 },
      { label: "Other", value: "3.5%", color: "#f4a158", change: "−2.1%", positive: false, share: 10 },
    ],
  },
  {
    title: "Order types",
    segments: [
      { label: "Takeaway", value: "84.4%", color: "#3390e0", change: "−2.4%", positive: false, share: 54 },
      { label: "Dine in", value: "5.2%", color: "#a367e8", change: "+3.3%", positive: true, share: 14 },
      { label: "Pickup", value: "4.8%", color: "#9bd879", change: "+8.7%", positive: true, share: 12 },
      { label: "Delivery", value: "2.1%", color: "#ed8ddc", change: "+6.3%", positive: true, share: 10 },
      { label: "Other", value: "3.5%", color: "#f4a158", change: "−2.1%", positive: false, share: 10 },
    ],
  },
];

function getRoundedDonutSegmentPath(startAngle: number, endAngle: number, outerRadius: number, innerRadius: number, cornerRadius: number) {
  const point = (radius: number, angle: number) => [118 + radius * Math.cos(angle), 118 + radius * Math.sin(angle)];
  const outerAngle = cornerRadius / outerRadius;
  const innerAngle = cornerRadius / innerRadius;
  const radialPoint = (radius: number, angle: number) => point(radius, angle);
  const outerStart = point(outerRadius, startAngle + outerAngle);
  const outerEnd = point(outerRadius, endAngle - outerAngle);
  const innerEnd = point(innerRadius, endAngle - innerAngle);
  const innerStart = point(innerRadius, startAngle + innerAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.join(" ")}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.join(" ")}`,
    `Q ${point(outerRadius, endAngle).join(" ")} ${radialPoint(outerRadius - cornerRadius, endAngle).join(" ")}`,
    `L ${radialPoint(innerRadius + cornerRadius, endAngle).join(" ")}`,
    `Q ${point(innerRadius, endAngle).join(" ")} ${innerEnd.join(" ")}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.join(" ")}`,
    `Q ${point(innerRadius, startAngle).join(" ")} ${radialPoint(innerRadius + cornerRadius, startAngle).join(" ")}`,
    `L ${radialPoint(outerRadius - cornerRadius, startAngle).join(" ")}`,
    `Q ${point(outerRadius, startAngle).join(" ")} ${outerStart.join(" ")} Z`,
  ].join(" ");
}

function OverviewV2DonutCard({ title, segments, isRefreshing }: { title: string; segments: Array<{ label: string; value: string; color: string; change?: string; positive?: boolean; share: number }>; isRefreshing: boolean }) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const hoveredAngle = hoveredSegment === null
    ? null
    : -Math.PI / 2 + (segments.slice(0, hoveredSegment).reduce((sum, segment) => sum + segment.share, 0) + (segments[hoveredSegment].share - 2) / 2) / 100 * Math.PI * 2;
  const tooltipX = hoveredAngle === null ? 50 : 50 + Math.cos(hoveredAngle) * 44;
  const tooltipY = hoveredAngle === null ? 50 : 50 + Math.sin(hoveredAngle) * 44;
  const tooltipTransform = hoveredAngle === null
    ? "translate(-50%, -50%)"
    : Math.abs(Math.cos(hoveredAngle)) > Math.abs(Math.sin(hoveredAngle))
      ? `${Math.cos(hoveredAngle) > 0 ? "translate(10px, -50%)" : "translate(calc(-100% - 10px), -50%)"}`
      : Math.sin(hoveredAngle) > 0
        ? "translate(-50%, 10px)"
        : "translate(-50%, calc(-100% - 10px))";
  let startShare = 0;

  return (
    <section className="flex min-w-0 flex-1 flex-col rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
      <div className="mb-[12px] flex items-center gap-[8px]">
        <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">{title}</h3>
        <MetricMoreMenu onExportPng={() => {}} onViewMethodology={() => {}} />
        <InfoIcon tooltip={title} />
      </div>
      <div className="relative mx-auto mb-[8px] grid size-[160px] shrink-0 place-items-center sm:size-[180px]">
        {isRefreshing ? (
          <div aria-label={`Loading ${title} chart`} className="skeleton size-[160px] rounded-full sm:size-[180px]" role="status" />
        ) : <>
        <svg aria-label={`${title} breakdown`} className="size-full overflow-visible" role="group" viewBox="0 0 236 236">
          {segments.map((segment, index) => {
            const separatorShare = Math.min(1, segment.share / 4);
            const startAngle = -Math.PI / 2 + ((startShare + separatorShare / 2) / 100) * Math.PI * 2;
            const endAngle = -Math.PI / 2 + ((startShare + segment.share - separatorShare / 2) / 100) * Math.PI * 2;
            startShare += segment.share;
            return (
              <path
                key={segment.label}
                aria-label={`${segment.label}: ${segment.value}`}
                className="cursor-pointer transition-opacity hover:opacity-80 focus:opacity-80"
                d={getRoundedDonutSegmentPath(startAngle, endAngle, 118, 88, 4)}
                fill={segment.color}
                onBlur={() => setHoveredSegment(null)}
                onFocus={() => setHoveredSegment(index)}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                role="button"
                tabIndex={0}
              />
            );
          })}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute size-[120px] rounded-full bg-white sm:size-[134px]" />
        {hoveredSegment !== null && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-20 flex min-w-[160px] flex-col gap-[6px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] py-[10px] shadow-[0px_4px_8px_0px_rgba(18,18,18,0.1)]"
            style={{ left: `${tooltipX}%`, top: `${tooltipY}%`, transform: tooltipTransform }}
          >
            <span className="font-['Inter:Medium'] text-[12px] leading-[16px] text-[#22201f]">{segments[hoveredSegment].label}</span>
            <span className="font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">{segments[hoveredSegment].value}</span>
            {segments[hoveredSegment].change && <span className="font-['Inter:Regular'] text-[12px] leading-[16px] text-[#62615d]">{segments[hoveredSegment].change}</span>}
          </div>
        )}
        </>}
      </div>
      <div className="mt-auto flex flex-col gap-[10px]">
        {isRefreshing ? segments.map((segment) => (
          <div key={segment.label} aria-hidden="true" className="flex h-[20px] items-center gap-[6px]">
            <Sk w="w-[8px]" h="h-[8px]" />
            <Sk w="w-[80px]" />
            <Sk w="w-[32px]" />
          </div>
        )) : segments.map((segment) => (
          <div key={segment.label} className="flex min-w-0 items-center gap-[6px] text-[14px] leading-[20px]">
            <span aria-hidden="true" className="size-[8px] shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="min-w-0 flex-1 truncate text-[#22201f]">{segment.label}</span>
            <span className="shrink-0 font-['Inter:Medium'] text-[#22201f]">{segment.value}</span>
            {segment.change && <span className={`shrink-0 rounded-[4px] px-[4px] font-['Inter:Medium'] ${segment.positive ? "bg-[#d8fcdc] text-[#0d6b27]" : "bg-[#ffedd4] text-[#7a4100]"}`}>{segment.change}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

function OverviewV2RankedCard({ title, headline, detail, trend, rows, onSeeMore }: { title: string; headline: string; detail: string; trend: string; rows: Array<{ name: string; value: string; change: string; positive: boolean }>; onSeeMore: () => void }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
      <div className="mb-[12px] flex items-center gap-[8px]">
        <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">{title}</h3>
        <MetricMoreMenu onExportPng={() => {}} onViewMethodology={() => {}} />
        <InfoIcon tooltip={title} />
      </div>
      <div className="mb-[12px]">
        <p className="truncate font-['Inter:Semibold'] text-[24px] leading-[32px] text-[#22201f]">{headline}</p>
        <div className="mt-[2px] flex items-center gap-[6px] text-[14px] leading-[20px] text-[#62615d]">
          <span>{detail}</span>
          <span className={`rounded-[4px] px-[4px] font-['Inter:Medium'] ${trend.startsWith("+") ? "bg-[#d8fcdc] text-[#0d6b27]" : "bg-[#ffedd4] text-[#7a4100]"}`}>{trend}</span>
        </div>
      </div>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div key={row.name} className="flex h-[44px] min-w-0 shrink-0 items-center gap-[6px] px-[6px] odd:bg-[#f9f8f4]">
            <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">{row.name}</span>
            <span className="w-[48px] shrink-0 text-right font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">{row.value}</span>
            <span className={`shrink-0 rounded-[4px] px-[4px] font-['Inter:Medium'] text-[14px] leading-[20px] ${row.positive ? "bg-[#d8fcdc] text-[#0d6b27]" : "bg-[#ffedd4] text-[#7a4100]"}`}>{row.change}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={onSeeMore} className="mt-auto pt-[10px] text-left font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline">See more</button>
    </section>
  );
}

function OverviewV2Dashboard({ isRefreshing, compareLabel, showComparison, selectProductSales }: { isRefreshing: boolean; compareLabel: string; showComparison: boolean; selectProductSales: (dimension: string) => void }) {
  const kpis = [
    { label: "Total sales", value: "$4,182.60", change: "+12.4%", positive: true },
    { label: "Orders", value: "241", change: "−12.4%", positive: false },
    { label: "Average order value", value: "$17.35", change: "+6.2%", positive: true },
    { label: "Top selling product", value: "Latte", change: "−3.1%", positive: false },
  ];
  const topCards = [
    { title: "Sales by products", headline: "Latte", detail: "82 sold ·", trend: "+3.3%", rows: [{ name: "Latte", value: "82", change: "+3.3%", positive: true }, { name: "Flat White", value: "67", change: "−5.7%", positive: false }, { name: "Plain Croissant", value: "32", change: "+7.8%", positive: true }, { name: "Cappuccino", value: "31", change: "+12.1%", positive: true }, { name: "Banana Bread", value: "16", change: "−6.8%", positive: false }, { name: "Choc Chip Muffin", value: "9", change: "+6.4%", positive: true }], dimension: "Product" },
    { title: "Sales by categories", headline: "Coffee", detail: "125 sold ·", trend: "+11.6%", rows: [{ name: "Coffee", value: "125", change: "+11.6%", positive: true }, { name: "Pastries", value: "67", change: "+7.1%", positive: true }, { name: "Sweets", value: "32", change: "−15.7%", positive: false }, { name: "Toasties", value: "31", change: "−5.7%", positive: false }, { name: "Other drinks", value: "16", change: "+2.0%", positive: true }], dimension: "Category" },
    { title: "Sales by reporting groups", headline: "Drinks", detail: "187 sold ·", trend: "−11.4%", rows: [{ name: "Drinks", value: "187", change: "−11.4%", positive: false }, { name: "Food", value: "24", change: "+9.2%", positive: true }, { name: "Other", value: "12", change: "−15.7%", positive: false }], dimension: "Reporting group" },
  ];
  const tables = [
    { title: "Sales by site", rows: [["Amberley – The Coffee Company", "$4,356.39", "+3.3%"], ["Brambleton – The Coffee Company", "$2,764.40", "−5.7%"], ["Copperfield – The Coffee Company", "$2,661.29", "+7.8%"], ["Foxglove – The Coffee Company", "$2,045.94", "+12.1%"], ["Mossgate – The Coffee Company", "$1,613.69", "−8.8%"], ["Pinehollow – The Coffee Company", "$914.10", "−8.6%"]] as const, dimension: "Site" },
    { title: "Sales by staff", rows: [["Olivia Hartwell", "$614.10", "—"], ["Marcus Delgado", "$607.28", "+3.3%"], ["Priya Nair", "$547.45", "−5.7%"], ["Tom Ashworth", "$476.32", "—"], ["Sophie Brennan", "$318.79", "+3.3%"], ["Amy Tran", "$304.49", "—"]] as const, dimension: "Staff" },
  ];

  return (
    <div className="flex w-full flex-col gap-[12px] sm:gap-[16px]">
      <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-4 sm:gap-[12px]">
        {kpis.map((kpi) => (
            <section key={kpi.label} className="flex min-w-0 flex-col gap-[10px] rounded-[12px] border border-[#e3e2dd] bg-white p-[16px] sm:h-[120px] sm:justify-between sm:gap-0">
            <div className="flex items-center gap-[6px]">
              <span className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">{kpi.label}</span>
              <InfoIcon tooltip={kpi.label} />
            </div>
            <div className="flex min-w-0 flex-col items-start gap-[4px]">
              <span className="truncate font-['Inter:Semibold'] text-[24px] leading-[32px] text-[#22201f]">{isRefreshing ? <Sk w="w-[72px]" /> : kpi.value}</span>
              <span className={`rounded-[4px] px-[5px] font-['Inter:Medium'] text-[14px] leading-[20px] ${kpi.positive ? "bg-[#d8fcdc] text-[#0d6b27]" : "bg-[#ffedd4] text-[#7a4100]"}`}>{kpi.change}</span>
            </div>
          </section>
        ))}
      </div>

      <WidgetCard className="w-full">
        <div className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
          <div className="mb-[8px] flex items-center gap-[8px]">
            <h3 className="min-w-0 flex-1 font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">Hourly sales</h3>
            <MetricMoreMenu onExportPng={() => {}} onViewMethodology={() => {}} />
            <InfoIcon tooltip="Hourly sales compared with the previous period" />
          </div>
          <HourlySalesChart compareLabel={compareLabel} showComparison={showComparison} isRefreshing={isRefreshing} largeLabels />
        </div>
      </WidgetCard>

      <div className="grid grid-cols-1 items-stretch gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
        {overviewV2Donuts.map((chart) => <OverviewV2DonutCard key={chart.title} {...chart} isRefreshing={isRefreshing} />)}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
        {topCards.map((card) => <OverviewV2RankedCard key={card.title} {...card} onSeeMore={() => selectProductSales(card.dimension)} />)}
      </div>

      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 sm:gap-[12px]">
        {tables.map((table) => (
          <section key={table.title} className="min-w-0 rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
            <div className="mb-[8px] flex items-center gap-[8px]">
              <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">{table.title}</h3>
              <InfoIcon tooltip={table.title} />
            </div>
            <div className="flex flex-col">
              {table.rows.map(([name, value, change]) => (
                <div key={name} className="flex h-[44px] min-w-0 shrink-0 items-center gap-[8px] px-[6px] odd:bg-[#f9f8f4]">
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">{name}</span>
                  <span className="shrink-0 font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">{value}</span>
                  <span className={`w-[56px] shrink-0 rounded-[4px] px-[4px] text-center font-['Inter:Medium'] text-[14px] leading-[20px] ${change.startsWith("+") ? "bg-[#d8fcdc] text-[#0d6b27]" : change === "—" ? "text-[#62615d]" : "bg-[#ffedd4] text-[#7a4100]"}`}>{change}</span>
                </div>
              ))}
            </div>
              <button type="button" onClick={() => selectProductSales(table.dimension)} className="mt-[6px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline">See more</button>
          </section>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ activeReport, onSelectReport }: { activeReport: ReportName; onSelectReport: (report: ReportName) => void }) {
  return (
    <div className="flex flex-col gap-[12px] h-screen items-start p-[8px] shrink-0 w-[200px] bg-[#f9f8f4] sticky top-0">
      {/* Back Office header */}
      <a href={import.meta.env.BASE_URL} className="flex gap-[4px] items-center p-[8px] rounded-[8px] w-full hover:bg-[#f2f0ea]">
        <span className="font-['Inter:Semibold'] text-[#22201f] text-[16px] leading-[24px] whitespace-nowrap">Back Office</span>
        <img alt="" className="block size-[16px]" src={imgArrowRight} />
      </a>

      {/* Nav items */}
      <div className="flex flex-1 flex-col gap-[4px] items-start w-full min-h-0 overflow-y-auto">
        <NavItem icon={imgHome} label="Home" />
        <NavItem icon={imgClipboard} label="Products" hasArrow />

        {/* Reports with children */}
        <div className="flex flex-col gap-[8px] items-start w-full shrink-0">
          <NavItem icon={imgGraph} label="Reports" hasArrow />
          <div className="flex flex-col gap-[4px] items-start w-full pl-[24px]">
            {([["Snapshot", "Snapshot"], ["Reports", "Reports"]] as const).map(([label, report]) => (
              <React.Fragment key={report}>
                <button
                  type="button"
                  aria-current={activeReport === report ? "page" : undefined}
                  onClick={() => onSelectReport(report)}
                  className={`flex h-[32px] w-full items-center justify-start rounded-[8px] p-[8px] text-left transition-colors ${activeReport === report ? "bg-[#edeae4]" : "hover:bg-[#edeae4]"}`}
                >
                  <span className={`flex-1 truncate text-[14px] leading-[20px] ${activeReport === report ? "font-['Inter:Semibold'] text-[#22201f]" : "font-['Inter:Medium'] text-[#22201f]"}`}>
                    {label}
                  </span>
                </button>
              </React.Fragment>
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
  const [tooltip, setTooltip] = useState<{ alignRight: boolean; maxWidth: number; left?: number; right?: number; bottom: number } | null>(null);

  function showTooltip(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const leftSpace = bounds.right - 16;
    const rightSpace = window.innerWidth - bounds.left - 16;
    const alignRight = leftSpace > rightSpace;
    setTooltip({
      alignRight,
      maxWidth: Math.max(0, alignRight ? leftSpace : rightSpace),
      ...(alignRight ? { right: window.innerWidth - bounds.right } : { left: bounds.left }),
      bottom: window.innerHeight - bounds.top + 6,
    });
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
          className={`fixed z-[200] pointer-events-none w-max ${tooltip.alignRight ? "text-right" : "text-left"}`}
          style={{ maxWidth: tooltip.maxWidth, left: tooltip.left, right: tooltip.right, bottom: tooltip.bottom }}
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
      {label && <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">{label}</span>}
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
  createdBy?: string;
};

type SalesOverviewView = {
  name: string;
  sites: string[];
  registers: string[];
  date: { id: string; label: string };
  compare: { id: string; label: string };
  tax: string;
  createdBy?: string;
};

type ProductSalesStorage = {
  savedViews: ProductSalesView[];
  defaultView: string | null;
};

type SalesOverviewStorage = {
  savedFilters: SalesOverviewView[];
  defaultView: string | null;
};

type TransactionView = {
  name: string;
  sites: string[];
  date: { id: string; label: string };
  paymentTypes: string[];
  customers: string[];
  statuses?: string[];
  deletedOptions?: "Hide" | "Show";
  createdBy?: string;
};

type TransactionsStorage = {
  savedViews: TransactionView[];
  defaultView: string | null;
};

const PRODUCT_SALES_STORAGE_KEY = "reports-bo:version-3:product-sales";
const SALES_OVERVIEW_STORAGE_KEY = "reports-bo:version-3:sales-overview";
const TRANSACTIONS_STORAGE_KEY = "reports-bo:version-3:transactions";

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
        <ActionButton variant="primary" size="slim" className="w-full" onClick={() => { onApply(draft); onClose(); }}>Apply</ActionButton>
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
            <ActionButton variant="primary" size="slim" className="w-full" onClick={() => { onApply(activeFilter, draft); onClose(); }}>Apply</ActionButton>
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

function TransactionDateDropdown({ selected, onSelect, onClose }: {
  selected: string;
  onSelect: (id: string, label: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);

  return (
    <div ref={ref} className="absolute left-0 top-[40px] z-50 w-[260px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
      <div className="max-h-[360px] overflow-y-auto p-[4px]">
        {DATE_OPTIONS.map((option) => (
          <button key={option.id} type="button" onClick={() => { onSelect(option.id, option.label); onClose(); }} className="flex w-full items-start gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]">
            <span className="flex flex-1 flex-col">
              <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">{option.label}</span>
              {selected === option.id && <span className="mt-[1px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">{getDateRangeLabel(option.id)}</span>}
            </span>
            {selected === option.id && <img alt="Selected" className="mt-[2px] size-[16px] shrink-0" src={imgCheck} />}
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

function RefreshControl({ isRefreshing, onRefresh, minutesSinceUpdate }: { isRefreshing: boolean; onRefresh: () => void; minutesSinceUpdate: number }) {
  const isDelayed = minutesSinceUpdate >= 1;
  return (
    <div className="flex shrink-0 items-center gap-[2px]">
      <Tooltip text={isDelayed ? "Reporting data may be delayed. The pipeline is taking longer than the expected 1-minute update window." : "Reporting data is current through the last update."}>
        <span role="status" aria-live="polite" className={`inline-flex items-center gap-[5px] whitespace-nowrap font-['Inter:Medium'] text-[12px] leading-[16px] ${isDelayed ? "text-[#9a5b00]" : "text-[#397348]"}`}>
          <span aria-hidden="true" className={`size-[6px] rounded-full ${isDelayed ? "bg-[#d88913]" : "bg-[#4a9b63]"}`} />
          {isDelayed ? `Data delayed · ${minutesSinceUpdate} min` : "Data current · <1 min"}
        </span>
      </Tooltip>
      <button
        type="button"
        aria-label="Refresh report"
        onClick={onRefresh}
        className="flex size-[32px] items-center justify-center rounded-full transition-colors hover:bg-[#f4f3ef]"
        title="Refresh"
      >
        <img alt="" src={imgRefresh} className={`block${isRefreshing ? " spin-once" : ""}`} style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

function MetricMoreMenu({ onExportPng, onViewMethodology }: { onExportPng: () => void; onViewMethodology: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="More chart options"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex size-[32px] items-center justify-center rounded-[8px] text-[#777671] transition-colors hover:bg-[#f2f0ea]"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-[40px] z-50 w-[190px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
          <button
            type="button"
            onClick={() => { setIsOpen(false); onExportPng(); }}
            className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
          >
            <svg aria-hidden="true" className="size-[16px] shrink-0 text-[#22201f]" viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m3.5 15 4-4 2.5 2.5 2-2 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">Export PNG</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsOpen(false); onViewMethodology(); }}
            className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
          >
            <svg aria-hidden="true" className="size-[16px] shrink-0 text-[#22201f]" viewBox="0 0 20 20" fill="none">
              <path d="M10 4.5C8.5 3.2 6.2 2.8 2.5 3.5v12c3.7-.7 6-.3 7.5 1 1.5-1.3 3.8-1.7 7.5-1v-12c-3.7-.7-6-.3-7.5 1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M10 4.5v12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">View methodology</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Hourly Sales Chart ───────────────────────────────────────────────────────

const HALF_HOURS = [
  "7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
];

const CURRENT_DATA = [120,185,310,420,510,580,640,690,720,760,810,770,680,590,480,320];
const PREV_DATA    = [100,155,270,360,430,490,530,570,600,630,670,640,580,510,420,280];

function HourlySalesChart({ compareLabel, showComparison, isRefreshing, largeLabels = false }: { compareLabel: string; showComparison: boolean; isRefreshing?: boolean; largeLabels?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 600, H = 161;
  const PAD_T = 8, PAD_B = 4, PAD_L = 0, PAD_R = 0;
  const Y_LABEL_W = largeLabels ? 48 : 36;
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
        <div className={`relative shrink-0 font-['Inter:Regular'] text-[#bbbab6] leading-none ${largeLabels ? "text-[14px]" : "text-[10px]"}`} style={{ width: Y_LABEL_W, height: H }}>
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
          {showComparison && <polyline points={makeLine(PREV_DATA)} fill="none" stroke="#9bcdf7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}

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
              className="pointer-events-none absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9bcdf7]"
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
              <span className={`font-['Inter:Medium'] text-[#22201f] leading-[20px] ${largeLabels ? "text-[14px]" : "text-[12px]"}`}>{HALF_HOURS[hovered]}</span>
              <div className="flex items-center gap-[8px]">
                <span className="inline-block size-[8px] rounded-full bg-[#58aaf5] shrink-0" />
                <span className={`font-['Inter:Regular'] text-[#22201f] leading-[20px] ${largeLabels ? "text-[14px]" : "text-[13px]"}`}>Today</span>
                <span className={`font-['Inter:Medium'] text-[#22201f] leading-[20px] ml-auto pl-[12px] ${largeLabels ? "text-[14px]" : "text-[13px]"}`}>${CURRENT_DATA[hovered]}</span>
              </div>
              {showComparison && <div className="flex items-center gap-[8px]">
                <span className="inline-block size-[8px] rounded-full bg-[#9bcdf7] shrink-0" />
                <span className={`font-['Inter:Regular'] text-[#22201f] leading-[20px] flex-1 min-w-0 truncate ${largeLabels ? "text-[14px]" : "text-[13px]"}`}>{compareLabel.charAt(0).toUpperCase() + compareLabel.slice(1)}</span>
                <span className={`font-['Inter:Medium'] text-[#22201f] leading-[20px] ml-auto pl-[12px] ${largeLabels ? "text-[14px]" : "text-[13px]"}`}>${PREV_DATA[hovered]}</span>
              </div>}
            </div>
          );
        })()}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex gap-[0px] w-full">
        <div style={{ width: Y_LABEL_W }} className="shrink-0" />
        <div className={`relative flex-1 min-w-0 font-['Inter:Regular'] text-[#62615d] ${largeLabels ? "text-[14px]" : "text-[11px]"}`} style={{ height: largeLabels ? 20 : 16 }}>
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

function KpiCard({ label, value, change, changeColor, compareLabel, showComparison, isRefreshing, compact = false }: { label: string; value: string; change?: string; changeColor?: string; compareLabel?: string; showComparison: boolean; isRefreshing?: boolean; compact?: boolean }) {
  return (
    <WidgetCard className="flex-1 min-w-0">
      <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
      <div className="flex gap-[8px] items-center w-full">
        <div className="flex flex-1 min-w-0 items-center gap-[4px]">
          <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">{label}</span>
          <InfoIcon tooltip={`${label} for the selected period`} />
        </div>
        <AskButton label="Ask" />
      </div>
      <div className="flex flex-col gap-[8px] items-start w-full">
        {isRefreshing
          ? <Sk w="w-[100px]" h={compact ? "h-[24px]" : "h-[32px]"} />
          : <span className={`font-['Inter:Semibold'] text-[#22201f] ${compact ? "text-[18px] leading-[24px]" : "text-[24px] leading-[32px]"} block w-full`}>{value}</span>
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

function TopListCard({ title, items, compareLabel, showComparison, isRefreshing, onExportPng, onViewMethodology, onSeeMore }: { title: string; compareLabel: string; showComparison: boolean; isRefreshing?: boolean; items: Array<{ rank: number; name: string; count: number; change: string; positive: boolean }>; onExportPng: () => void; onViewMethodology: () => void; onSeeMore: () => void }) {
  const top = items[0];
  return (
    <WidgetCard className="flex-1 min-w-0 self-stretch">
    <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
      <div className="flex gap-[8px] items-center w-full shrink-0">
        <div className="flex flex-1 min-w-0 items-center gap-[4px]">
          <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">{title}</span>
          <InfoIcon tooltip={title} />
        </div>
        <AskButton label="Ask" />
        <MetricMoreMenu onExportPng={onExportPng} onViewMethodology={onViewMethodology} />
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
      <button type="button" onClick={onSeeMore} className="cursor-pointer font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] hover:underline">See more</button>
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

// ─── More Menu ───────────────────────────────────────────────────────────────

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
        <ActionButton
          variant="primary"
          className="w-full"
          onClick={handleSave}
          disabled={!canSave}
        >
          Save
        </ActionButton>
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
  onEditFilter,
  onSaveView,
}: {
  savedFilters: Array<{ name: string }>;
  defaultView: string | null;
  onClose: () => void;
  onApplyDefault: () => void;
  onApplyFilter: (name: string) => void;
  onSetDefault: (name: string) => void;
  onEditFilter: (name: string) => void;
  onSaveView: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDropdownClose(ref, onClose);

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 w-[220px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_0px_0px_0px_rgba(18,18,18,0.16),0px_2px_2px_0px_rgba(18,18,18,0.11),0px_4px_4px_0px_rgba(18,18,18,0.05)]"
    >
      <div className="p-[4px]">
        <div className="group flex h-[36px] items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] hover:bg-[#f9f8f4]">
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-left font-['Inter:Medium'] text-[#22201f] text-[15px] leading-[20px]"
            onClick={() => { onApplyDefault(); onClose(); }}
          >
            Default
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-[#e3e2dd]" />
      <div className="p-[4px]">
        <div className="flex items-center px-[12px] pb-[4px] pt-[8px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">My saved views</div>
      {savedFilters.length === 0 ? (
        <div className="mx-[4px] mb-[4px] rounded-[8px] bg-[#f9f8f4] px-[12px] py-[16px] text-center">
          <p className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">No saved views yet</p>
          <p className="mt-[4px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">Save your filter selection to quickly access it later.</p>
        </div>
      ) : savedFilters.map((filter) => (
        <div key={filter.name} className="group flex h-[36px] items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] hover:bg-[#f9f8f4]">
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
              className={`rounded-[4px] p-[4px] transition-colors hover:bg-[#edeae4] ${defaultView === filter.name ? "text-[#22201f]" : "text-[#777671]"}`}
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
          <Tooltip text="Settings">
            <button
              type="button"
              aria-label={`Settings for ${filter.name}`}
              className="shrink-0 rounded-[4px] p-[4px] text-[#777671] opacity-60 hover:bg-[#edeae4] hover:opacity-100"
              onClick={() => { onEditFilter(filter.name); onClose(); }}
            >
              <img alt="" className="block size-[16px]" src={imgCog} />
            </button>
          </Tooltip>
        </div>
      ))}
      </div>
      <div className="border-t border-[#e3e2dd] p-[8px]">
        <button
          type="button"
          className="flex h-[32px] w-full items-center justify-center rounded-[8px] bg-[#1e72c4] px-[12px] text-center font-['Inter:Semibold'] text-[14px] leading-[20px] text-white transition-colors hover:bg-[#1558a0]"
          onClick={() => { onSaveView(); onClose(); }}
        >
          Save this view
        </button>
      </div>
    </div>
  );
}

function EditSavedViewModal({
  name,
  existingNames,
  onClose,
  onRename,
  onDelete,
}: {
  name: string;
  existingNames: string[];
  onClose: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [newName, setNewName] = useState(name);
  const trimmedName = newName.trim();
  const canRename = trimmedName.length > 0 && (trimmedName === name || !existingNames.includes(trimmedName));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(70,74,81,0.6)] p-[16px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-saved-view-title"
        className="flex w-full max-w-[400px] flex-col gap-[24px] rounded-[12px] bg-white p-[24px] shadow-[0px_8px_8px_0px_rgba(18,18,18,0.04),0px_4px_4px_0px_rgba(18,18,18,0.08),0px_1px_1px_0px_rgba(18,18,18,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <div className="flex items-start gap-[16px]">
            <h2 id="edit-saved-view-title" className="min-w-0 flex-1 font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[28px]">Edit saved view</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="mt-[4px] size-[16px] shrink-0 hover:opacity-70">
              <img alt="" className="block size-full" src={imgModalClose} />
            </button>
          </div>
          <p className="mt-[4px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">Filters can't be changed from here.</p>
        </div>

        <label className="flex flex-col gap-[6px] font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
          View name
          <input
            autoFocus
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && canRename) onRename(trimmedName); }}
            className="h-[40px] w-full rounded-[8px] border border-[#bbbab6] bg-white px-[12px] font-['Inter:Regular'] text-[14px] outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
          />
        </label>

        <div className="flex items-center gap-[12px]">
          <ActionButton variant="destructive" onClick={onDelete}>Delete view</ActionButton>
          <ActionButton variant="primary" className="ml-auto" onClick={() => onRename(trimmedName)} disabled={!canRename}>Save name</ActionButton>
        </div>
      </div>
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
    version: "Version 3A",
    updated: "30 September 2026",
    description: "Reports library and reporting views for continued exploration.",
    href: `${import.meta.env.BASE_URL}version-3a`,
  },
  {
    version: "Version 3B",
    updated: "6 October 2026",
    description: "A duplicate of Version 3A for continued exploration.",
    href: `${import.meta.env.BASE_URL}version-3b`,
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
              # prototypes
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
                  </div>
                  <h3 className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[26px]">
                    {prototype.version}
                  </h3>
                  <p className="mt-[5px] max-w-[620px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[22px]">
                    {prototype.description}
                  </p>
                </div>
                <ActionButton
                  as="a"
                  href={prototype.href}
                  variant="primary"
                  className="shrink-0"
                >
                  View prototype
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ActionButton>
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

export default function VersionThree() {
  const versionOnePath = `${import.meta.env.BASE_URL}version-1`.replace(/\/+$/, "");
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  if (currentPath === versionOnePath) return <VersionOnePrototype />;
  return <ReportsPrototype />;
}

function ReportsPrototype() {
  const initialSalesStorage = loadStoredValue<SalesOverviewStorage>(SALES_OVERVIEW_STORAGE_KEY, { savedFilters: [], defaultView: "__system__" });
  const initialSalesDefault = initialSalesStorage.savedFilters.find((view) => view.name === initialSalesStorage.defaultView);
  const [activeReport, setActiveReport] = useState<ReportName>("Reports");
  const [productSalesEntryDimension, setProductSalesEntryDimension] = useState<string | null>(null);
  const [requestedSavedViewName, setRequestedSavedViewName] = useState<string | null>(null);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(initialSalesDefault?.sites ?? []);
  const [selectedRegisters, setSelectedRegisters] = useState<string[]>(initialSalesDefault?.registers ?? []);
  const [taxSelected, setTaxSelected] = useState(initialSalesDefault?.tax ?? "Inclusive");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [dateSelected, setDateSelected] = useState<{ id: string; label: string }>(initialSalesDefault?.date ?? { id: "today", label: "Today" });
  const [compareSelected, setCompareSelected] = useState<{ id: string; label: string }>(initialSalesDefault?.compare ?? { id: "last-same-day", label: "Last Tuesday" });
  const showComparison = compareSelected.id !== "none";
  const [activeViewName, setActiveViewName] = useState<string | null>(initialSalesDefault?.name ?? null);
  const [defaultView, setDefaultView] = useState<string | null>(initialSalesStorage.defaultView);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingSavedViewName, setEditingSavedViewName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date(Date.now() - 2 * 60_000));
  const [now, setNow] = useState<Date>(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  function refreshData() {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setNow(new Date());
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }

  const minutesSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000);

  const [savedFilters, setSavedFilters] = useState<SalesOverviewView[]>(initialSalesStorage.savedFilters);
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
  ].filter(Boolean).join(" - ") || "Overview";

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
    if (savedDefault) applyFilter(savedDefault);
    else reset();
  }

  function selectReport(report: ReportName) {
    if (report !== activeReport) refreshData();
    if (report === "Product sales") setProductSalesEntryDimension(null);
    setRequestedSavedViewName(null);
    setActiveReport(report);
    if (report === "Snapshot") {
      applyDefaultView();
    }
  }

  function selectDirectoryReport(report: DirectoryReport) {
    selectReport(report.report);
    setRequestedSavedViewName(report.viewName ?? null);
    if (report.viewName && report.report === "Snapshot") {
      const view = savedFilters.find((filter) => filter.name === report.viewName);
      if (view) applyFilter(view);
    }
  }

  function selectProductSales(dimension: string) {
    if (activeReport !== "Product sales") refreshData();
    setProductSalesEntryDimension(dimension);
    setActiveReport("Product sales");
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
        createdBy: CURRENT_CREATOR,
      },
    ]);
    setActiveViewName(name);
    setToast(`"${name}" saved`);
  }

  function deleteFilter(name: string) {
    const remainingFilters = savedFilters.filter((filter) => filter.name !== name);
    setSavedFilters(remainingFilters);
    if (defaultView === name) {
      setDefaultView("__system__");
      reset();
    }
  }

  function renameFilter(oldName: string, newName: string) {
    setSavedFilters((current) => current.map((filter) => filter.name === oldName ? { ...filter, name: newName } : filter));
    if (defaultView === oldName) setDefaultView(newName);
    if (activeViewName === oldName) setActiveViewName(newName);
    setEditingSavedViewName(null);
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
            <div className="flex-1 min-w-0" />
            <img alt="" className="block shrink-0 size-[24px] cursor-pointer" src={imgChat} />
            <img alt="" className="block shrink-0 size-[24px] cursor-pointer" src={imgAnnouncement} />
            <ActionButton variant="secondary" size="slim">POS</ActionButton>
          </div>

          {activeReport === "Reports" ? (
            <ReportsLanding onSelectReport={selectDirectoryReport} />
          ) : activeReport === "Transactions" ? (
            <div className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              <TransactionsPage
                requestedSavedViewName={requestedSavedViewName}
                selectedSiteIds={selectedSiteIds}
                selectedSites={selectedSites}
                siteLabel={siteLabel}
                dateSelected={dateSelected}
                isRefreshing={isRefreshing}
                minutesSinceUpdate={minutesSinceUpdate}
                onRefresh={refreshData}
                onToggleSite={toggleSite}
                onApplyLocationSnapshot={(sites, registers) => { setSelectedSiteIds(sites); setSelectedRegisters(registers); }}
                onSelectDate={(id, label) => setDateSelected({ id, label })}
              />
            </div>
          ) : activeReport === "Product sales" ? (
            <div className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              <ProductSalesPage
                requestedSavedViewName={requestedSavedViewName}
                initialSalesBy={productSalesEntryDimension}
                selectedSiteIds={selectedSiteIds}
                selectedSites={selectedSites}
                siteLabel={siteLabel}
                selectedRegisters={selectedRegisters}
                dateSelected={dateSelected}
                compareSelected={compareSelected}
                taxSelected={taxSelected}
                isRefreshing={isRefreshing}
                minutesSinceUpdate={minutesSinceUpdate}
                onRefresh={refreshData}
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
                  <span className="-mx-[4px] shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">vs</span>
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
              {isFilteredFromDefault && (
                <div className="ml-[8px] flex items-center gap-[12px]">
                  <ActionButton variant="text" size="slim" className="!h-auto !px-0 hover:!bg-transparent" onClick={reset}>Reset</ActionButton>
                  {!isSaved && <ActionButton variant="text" size="slim" className="!h-auto !px-0 hover:!bg-transparent" onClick={() => setShowSaveModal(true)}>Save view</ActionButton>}
                </div>
              )}
              </div>

              {/* Right actions */}
              <div className="ml-auto flex shrink-0 items-center gap-[8px]">
                <RefreshControl isRefreshing={isRefreshing} onRefresh={refreshData} minutesSinceUpdate={minutesSinceUpdate} />
              </div>
            </div>

            {activeReport === "Snapshot" ? (
              <OverviewV2Dashboard isRefreshing={isRefreshing} compareLabel={compareSelected.label} showComparison={showComparison} selectProductSales={selectProductSales} />
            ) : <>
            {/* KPI row */}
            <div className="flex gap-[16px] items-start w-full">
              <KpiCard label="Total sales" value="$4,182.60" change="+9.7%" changeColor="text-[#008e13]" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
              <KpiCard label="Orders" value="241" change="−4.6%" changeColor="text-[#8e1311]" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
              <KpiCard label="Average order" value="$17.35" change="+13.2%" changeColor="text-[#008e13]" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
              <WidgetCard className="flex-1 min-w-0 h-full">
              <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
                <div className="flex gap-[8px] items-center w-full">
                  <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                    <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Top selling product</span>
                    <InfoIcon tooltip="Best-selling product by order volume" />
                  </div>
                  <AskButton label="Ask" />
                </div>
                {isRefreshing ? <Sk w="w-[60px]" h="h-[32px]" /> : <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px]">Latte</span>}
              </div>
              </WidgetCard>
            </div>

            {/* Hourly sales chart */}
              <WidgetCard className="w-full">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                  <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Hourly sales</span>
                  <InfoIcon tooltip="Total sales revenue broken down by hour" />
                </div>
                <AskButton label="Ask about this" />
                <MetricMoreMenu onExportPng={() => setToast("PNG export selected")} onViewMethodology={() => setToast("Methodology opened")} />
              </div>
              <HourlySalesChart compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} />
            </div>
            </WidgetCard>

            {/* Top lists row */}
            <div className="flex gap-[16px] items-stretch w-full">
              <TopListCard title="Top selling products" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} onExportPng={() => setToast("PNG export selected")} onViewMethodology={() => setToast("Methodology opened")} onSeeMore={() => selectProductSales("Product")} items={[
                { rank: 1, name: "Latte", count: 82, change: "+7.4%", positive: true },
                { rank: 2, name: "Flat White", count: 67, change: "−2.9%", positive: false },
                { rank: 3, name: "Plain Croissant", count: 32, change: "+15.6%", positive: true },
                { rank: 4, name: "Cappuccino", count: 31, change: "+4.8%", positive: true },
                { rank: 5, name: "Banana Bread", count: 16, change: "−8.3%", positive: false },
              ]} />
              <TopListCard title="Top selling categories" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} onExportPng={() => setToast("PNG export selected")} onViewMethodology={() => setToast("Methodology opened")} onSeeMore={() => selectProductSales("Category")} items={[
                { rank: 1, name: "Coffee", count: 187, change: "+12.1%", positive: true },
                { rank: 2, name: "Pastries", count: 76, change: "+6.5%", positive: true },
                { rank: 3, name: "Sweets", count: 65, change: "−5.7%", positive: false },
                { rank: 4, name: "Toasties", count: 47, change: "+10.9%", positive: true },
                { rank: 5, name: "Other drinks", count: 30, change: "+3.6%", positive: true },
              ]} />
              <TopListCard title="Top selling reporting groups" compareLabel={compareSelected.label} showComparison={showComparison} isRefreshing={isRefreshing} onExportPng={() => setToast("PNG export selected")} onViewMethodology={() => setToast("Methodology opened")} onSeeMore={() => selectProductSales("Reporting group")} items={[
                { rank: 1, name: "Drinks", count: 384, change: "−11.4%", positive: false },
                { rank: 2, name: "Food", count: 265, change: "+14.7%", positive: true },
                { rank: 3, name: "Other", count: 157, change: "−6.2%", positive: false },
              ]} />
            </div>

            {/* Sales by site table */}
              <WidgetCard className="w-full">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                  <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Sales by site</span>
                  <InfoIcon tooltip="Revenue comparison by location for the selected period" />
                </div>
                <AskButton label="Ask about this" />
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
              <button type="button" onClick={() => selectProductSales("Site")} className="cursor-pointer font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] hover:underline">See more</button>
            </div>
            </WidgetCard>

            {/* Sales by staff table */}
              <WidgetCard className="w-full">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                  <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">Sales by staff</span>
                  <InfoIcon tooltip="Revenue broken down by staff member for the selected period" />
                </div>
                <AskButton label="Ask about this" />
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
              <button type="button" onClick={() => selectProductSales("Staff")} className="cursor-pointer font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] hover:underline">See more</button>
            </div>
            </WidgetCard>
            </>}
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

      {editingSavedViewName && (
        <EditSavedViewModal
          name={editingSavedViewName}
          existingNames={savedFilters.map((filter) => filter.name)}
          onClose={() => setEditingSavedViewName(null)}
          onRename={(name) => renameFilter(editingSavedViewName, name)}
          onDelete={() => {
            deleteFilter(editingSavedViewName);
            if (activeViewName === editingSavedViewName) setActiveViewName(null);
            setEditingSavedViewName(null);
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

type ProductSalesRow = {
  name: string;
  quantity: string;
  sales: string;
  tax: string;
  cost: string;
  quantityShare: string;
  salesShare: string;
  profitShare: string;
  products?: string;
  orders?: string;
  averageSale?: string;
};

function createProductBreakdownRows(entries: Array<[string, number, number, number, number]>) {
  const totalQuantity = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const totalSales = entries.reduce((sum, [, , sales]) => sum + sales, 0);

  return entries.map(([name, quantity, sales, products, orders]) => {
    const tax = sales * 0.1;
    const cost = sales * 0.4;
    return {
      name,
      quantity: String(quantity),
      sales: `$${sales.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      tax: `$${tax.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      cost: `$${cost.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      quantityShare: `${Math.round(quantity / totalQuantity * 100)}%`,
      salesShare: `${Math.round(sales / totalSales * 100)}%`,
      profitShare: `${Math.round((sales - cost) / sales * 100)}%`,
      products: String(products),
      orders: String(orders),
      averageSale: `$${(sales / orders).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  });
}

const PRODUCT_SALES_BREAKDOWNS: Record<string, ProductSalesRow[]> = {
  Site: createProductBreakdownRows([
    ["Amberley", 36, 482.5, 18, 29], ["Brambleton", 29, 395, 16, 25], ["Oakridge", 24, 326.75, 14, 21],
    ["Pinehollow", 21, 284.5, 13, 19], ["Riverbend", 19, 260, 12, 18], ["Willowmere", 16, 218.25, 11, 16],
  ]),
  Category: createProductBreakdownRows([
    ["Coffee", 54, 198.5, 8, 43], ["Pastries", 38, 152, 6, 31], ["Mains", 32, 1018, 9, 25],
    ["Sides", 27, 142.5, 12, 23], ["Drinks", 18, 86, 5, 16],
  ]),
  "Reporting group": createProductBreakdownRows([
    ["Beverages", 72, 284.5, 13, 57], ["Brunch", 80, 1265, 20, 63], ["Bakery", 17, 47.5, 7, 18],
  ]),
  Staff: createProductBreakdownRows([
    ["Alex Morgan", 39, 384.5, 16, 31], ["Jordan Lee", 36, 356, 15, 29], ["Sam Taylor", 34, 328.25, 14, 27],
    ["Casey Brown", 32, 306, 13, 25], ["Riley Chen", 28, 263.75, 12, 22],
  ]),
};

type TransactionRow = {
  saleNumber: string;
  dateTime: string;
  site: string;
  terminal: string;
  operator: string;
  customer: string;
  tipAmount: string;
  netAmount: string;
  taxAmount: string;
  total: string;
  payments: string;
  surcharge: string;
  siteId: string;
  register: string;
  products: string[];
  categories: string[];
  taxType: string;
  deleted: boolean;
};

function SortIcon({ isSorted, direction }: { isSorted: boolean; direction: "asc" | "desc" }) {
  if (!isSorted) {
    return (
      <svg aria-hidden="true" className="size-[20px] shrink-0 text-[#22201f]" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 12.5L10 15L12.5 12.5M7.5 9.5L10 7L12.5 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={`size-[20px] shrink-0 text-[#22201f] transition-transform ${direction === "desc" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none">
      <path d="M10 14.5V7.5M13.5 11L10 7.5L6.5 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TERMINAL_PREFIX_BY_SITE: Record<string, Record<string, string>> = {
  amberley: { "Front POS": "SP-4", "POS A": "SP-2", "Back POS": "SP-3" },
  brambleton: { "Front POS": "SP-1", "POS A": "SP-2", "Back POS": "SP-5" },
  oakridge: { "Front POS": "SP-6", "POS A": "SP-3", "Back POS": "SP-2" },
  pinehollow: { "Front POS": "SP-2", "POS A": "SP-5", "Back POS": "SP-1" },
  riverbend: { "Front POS": "SP-3", "POS A": "SP-4", "Back POS": "SP-6" },
  willowmere: { "Front POS": "SP-5", "POS A": "SP-1", "Back POS": "SP-4" },
};

function formatTransactionSaleNumber(siteId: string, terminal: string, sequence: number) {
  const prefix = TERMINAL_PREFIX_BY_SITE[siteId]?.[terminal] ?? "SP-1";
  return `${prefix} 093000${String(sequence).padStart(4, "0")}`;
}

const BASE_TRANSACTION_ROWS: TransactionRow[] = [
  { saleNumber: formatTransactionSaleNumber("amberley", "Front POS", 4724), dateTime: "30 Sep 2026, 10:42 am", site: "Amberley", terminal: "Front POS", operator: "Alex Morgan", customer: "Jamie Wilson", tipAmount: "$4.50", netAmount: "$42.00", taxAmount: "$4.20", total: "$50.70", payments: "Lightspeed Payments", surcharge: "$0.00", siteId: "amberley", register: "Front POS", products: ["Long Black", "Salmon Fillet"], categories: ["Coffee", "Mains"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("brambleton", "POS A", 4723), dateTime: "30 Sep 2026, 10:36 am", site: "Brambleton", terminal: "POS A", operator: "Jordan Lee", customer: "Walk-in", tipAmount: "$0.00", netAmount: "$18.18", taxAmount: "$1.82", total: "$20.00", payments: "Account credit", surcharge: "$0.00", siteId: "brambleton", register: "POS A", products: ["Margherita Pizza - 12in"], categories: ["Mains"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("oakridge", "Back POS", 4722), dateTime: "30 Sep 2026, 10:21 am", site: "Oakridge", terminal: "Back POS", operator: "Sam Taylor", customer: "Morgan Davis", tipAmount: "$2.00", netAmount: "$16.36", taxAmount: "$1.64", total: "$20.00", payments: "Cash", surcharge: "$0.00", siteId: "oakridge", register: "Back POS", products: ["Eggs Bene - Bacon"], categories: ["Mains"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("pinehollow", "Front POS", 4721), dateTime: "30 Sep 2026, 10:08 am", site: "Pinehollow", terminal: "Front POS", operator: "Casey Brown", customer: "Taylor Smith", tipAmount: "$1.25", netAmount: "$11.14", taxAmount: "$1.11", total: "$13.50", payments: "Lightspeed Payments", surcharge: "$0.00", siteId: "pinehollow", register: "Front POS", products: ["Matcha Latte - Regular", "Hashbrown"], categories: ["Coffee", "Sides"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("riverbend", "POS A", 4720), dateTime: "30 Sep 2026, 9:54 am", site: "Riverbend", terminal: "POS A", operator: "Riley Chen", customer: "Walk-in", tipAmount: "$0.00", netAmount: "$27.27", taxAmount: "$2.73", total: "$30.00", payments: "Gift cards", surcharge: "$0.00", siteId: "riverbend", register: "POS A", products: ["Salt & Pepper Squid"], categories: ["Mains"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("willowmere", "Back POS", 4719), dateTime: "30 Sep 2026, 9:41 am", site: "Willowmere", terminal: "Back POS", operator: "Alex Morgan", customer: "Avery Taylor", tipAmount: "$3.00", netAmount: "$12.73", taxAmount: "$1.27", total: "$17.00", payments: "Account credit", surcharge: "$0.00", siteId: "willowmere", register: "Back POS", products: ["Pastry selection"], categories: ["Pastries"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("amberley", "POS A", 4718), dateTime: "30 Sep 2026, 9:22 am", site: "Amberley", terminal: "POS A", operator: "Jordan Lee", customer: "Chris Martin", tipAmount: "$0.00", netAmount: "$3.00", taxAmount: "$0.30", total: "$3.30", payments: "Cash", surcharge: "$0.00", siteId: "amberley", register: "POS A", products: ["Long Black"], categories: ["Coffee"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("brambleton", "Front POS", 4717), dateTime: "30 Sep 2026, 9:10 am", site: "Brambleton", terminal: "Front POS", operator: "Sam Taylor", customer: "Walk-in", tipAmount: "$2.50", netAmount: "$22.73", taxAmount: "$2.27", total: "$27.50", payments: "Gift cards", surcharge: "$0.00", siteId: "brambleton", register: "Front POS", products: ["Chef special pizza"], categories: ["Mains"], taxType: "Inclusive", deleted: false },
  { saleNumber: formatTransactionSaleNumber("oakridge", "Back POS", 4716), dateTime: "30 Sep 2026, 8:58 am", site: "Oakridge", terminal: "Back POS", operator: "Casey Brown", customer: "Walk-in", tipAmount: "$0.00", netAmount: "$7.27", taxAmount: "$0.73", total: "$8.00", payments: "Cash", surcharge: "$0.00", siteId: "oakridge", register: "Back POS", products: ["Hashbrown"], categories: ["Sides"], taxType: "Inclusive", deleted: true },
];

const TRANSACTION_ROWS: TransactionRow[] = [
  ...BASE_TRANSACTION_ROWS,
  ...Array.from({ length: 60 }, (_, index) => {
    const site = SITE_OPTIONS.slice(1)[index % (SITE_OPTIONS.length - 1)];
    const terminals = REGISTERS_BY_SITE[site.id];
    const productsByCategory = [
      { product: "Long Black", category: "Coffee" },
      { product: "Pastry selection", category: "Pastries" },
      { product: "Chef special pizza", category: "Mains" },
      { product: "Hashbrown", category: "Sides" },
      { product: "Matcha Latte - Regular", category: "Coffee" },
      { product: "Salt & Pepper Squid", category: "Mains" },
    ];
    const { product, category } = productsByCategory[index % productsByCategory.length];
    const payment = ["Account credit", "Cash", "Gift cards", "Lightspeed Payments"][index % 4];
    const total = 8.5 + (index * 7.35 % 125);
    const net = total / 1.1;
    const date = new Date(2026, 8, 30 - Math.floor(index / 15), 8 + (index % 10), (index * 7) % 60);
    const formatAmount = (amount: number) => `$${amount.toFixed(2)}`;

    return {
      saleNumber: formatTransactionSaleNumber(site.id, terminals[index % terminals.length], 4715 - index),
      dateTime: `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }).toLowerCase()}`,
      site: site.name.split(" – ")[0],
      terminal: terminals[index % terminals.length],
      operator: ["Alex Morgan", "Jordan Lee", "Sam Taylor", "Casey Brown", "Riley Chen"][index % 5],
      customer: ["Walk-in", "Jamie Wilson", "Morgan Davis", "Taylor Smith", "Avery Taylor", "Chris Martin"][index % 6],
      tipAmount: formatAmount([0, 1.5, 2.5, 3.5][index % 4]),
      netAmount: formatAmount(net),
      taxAmount: formatAmount(total - net),
      total: formatAmount(total),
      payments: payment,
      surcharge: formatAmount(payment === "Lightspeed Payments" ? total * 0.015 : 0),
      siteId: site.id,
      register: terminals[index % terminals.length],
      products: [product],
      categories: [category],
      taxType: "Inclusive",
      deleted: index % 13 === 0,
    };
  }),
];

function TransactionsPage({
  requestedSavedViewName,
  selectedSiteIds, selectedSites, siteLabel, dateSelected, isRefreshing, minutesSinceUpdate, onRefresh,
  onToggleSite, onApplyLocationSnapshot, onSelectDate,
}: {
  requestedSavedViewName: string | null;
  selectedSiteIds: string[];
  selectedSites: SiteOption[];
  siteLabel: string;
  dateSelected: { id: string; label: string };
  isRefreshing: boolean;
  minutesSinceUpdate: number;
  onRefresh: () => void;
  onToggleSite: (id: string) => void;
  onApplyLocationSnapshot: (sites: string[], registers: string[]) => void;
  onSelectDate: (id: string, label: string) => void;
}) {
  const stored = loadStoredValue<TransactionsStorage>(TRANSACTIONS_STORAGE_KEY, { savedViews: [], defaultView: "__system__" });
  const initialDefault = stored.savedViews.find((view) => view.name === stored.defaultView);
  const [savedViews, setSavedViews] = useState<TransactionView[]>(stored.savedViews);
  const [defaultView, setDefaultView] = useState<string | null>(stored.defaultView);
  const [activeViewName, setActiveViewName] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingSavedViewName, setEditingSavedViewName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [paymentTypes, setPaymentTypes] = useState<string[]>(initialDefault?.paymentTypes ?? []);
  const [customers, setCustomers] = useState<string[]>(initialDefault?.customers ?? []);
  const [statuses, setStatuses] = useState<string[]>(initialDefault?.statuses ?? (initialDefault?.deletedOptions === "Show" ? [] : ["Processed"]));
  const [sort, setSort] = useState<{ key: keyof TransactionRow; direction: "asc" | "desc" }>({ key: "dateTime", direction: "desc" });
  const [isTransactionTableScrolled, setIsTransactionTableScrolled] = useState(false);
  const paymentTypesRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const transactionTableRef = useRef<HTMLDivElement>(null);
  useDropdownClose(paymentTypesRef, () => {
    if (openFilter === "payment-types") setOpenFilter(null);
  });
  useDropdownClose(statusRef, () => {
    if (openFilter === "status") setOpenFilter(null);
  });

  useEffect(() => {
    window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify({ savedViews, defaultView } satisfies TransactionsStorage));
  }, [savedViews, defaultView]);

  useEffect(() => {
    if (initialDefault) {
      onApplyLocationSnapshot(initialDefault.sites, []);
      onSelectDate(initialDefault.date.id, initialDefault.date.label);
      setPaymentTypes(initialDefault.paymentTypes ?? []);
      setCustomers(initialDefault.customers ?? []);
      setStatuses(initialDefault.statuses ?? (initialDefault.deletedOptions === "Show" ? [] : ["Processed"]));
      setActiveViewName(initialDefault.name);
    } else {
      onApplyLocationSnapshot([], []);
      onSelectDate("today", "Today");
    }
  }, []);

  useEffect(() => {
    if (!requestedSavedViewName) return;
    const view = savedViews.find((savedView) => savedView.name === requestedSavedViewName);
    if (view) applyView(view);
  }, [requestedSavedViewName]);

  const filterSnapshot = (): TransactionView => ({
    name: "", sites: selectedSiteIds, date: dateSelected, paymentTypes, customers, statuses,
  });
  const applyView = (view: TransactionView) => {
    onApplyLocationSnapshot(view.sites, []);
    onSelectDate(view.date.id, view.date.label);
    setPaymentTypes(view.paymentTypes ?? []);
    setCustomers(view.customers ?? []);
    setStatuses(view.statuses ?? (view.deletedOptions === "Show" ? [] : ["Processed"]));
    setActiveViewName(view.name);
  };
  const resetFilters = () => {
    onApplyLocationSnapshot([], []);
    onSelectDate("today", "Today");
    setPaymentTypes([]); setCustomers([]); setStatuses(["Processed"]); setActiveViewName(null); setOpenFilter(null);
  };
  const isFiltered = selectedSiteIds.length > 0 || dateSelected.id !== "today" || paymentTypes.length > 0 || customers.length > 0 || statuses.length !== 1 || statuses[0] !== "Processed";
  const activeRows = TRANSACTION_ROWS.filter((row) =>
    (selectedSiteIds.length === 0 || selectedSiteIds.includes(row.siteId)) &&
    (paymentTypes.length === 0 || paymentTypes.includes(row.payments)) &&
    (customers.length === 0 || customers.includes(row.customer)) &&
    (statuses.length === 0 || statuses.includes(row.deleted ? "Deleted" : "Processed"))
  );
  const sortedRows = [...activeRows].sort((left, right) => {
    const leftValue = left[sort.key];
    const rightValue = right[sort.key];
    let comparison: number;
    if (["tipAmount", "netAmount", "taxAmount", "total", "surcharge"].includes(sort.key)) {
      comparison = Number(String(leftValue).replace(/[$,]/g, "")) - Number(String(rightValue).replace(/[$,]/g, ""));
    } else if (sort.key === "dateTime") {
      comparison = Date.parse(String(leftValue)) - Date.parse(String(rightValue));
    } else if (typeof leftValue === "boolean" && typeof rightValue === "boolean") {
      comparison = Number(leftValue) - Number(rightValue);
    } else {
      comparison = String(leftValue).localeCompare(String(rightValue));
    }
    return sort.direction === "asc" ? comparison : -comparison;
  });
  const totals = {
    tipAmount: activeRows.reduce((sum, row) => sum + Number(row.tipAmount.replace(/[$,]/g, "")), 0),
    netAmount: activeRows.reduce((sum, row) => sum + Number(row.netAmount.replace(/[$,]/g, "")), 0),
    taxAmount: activeRows.reduce((sum, row) => sum + Number(row.taxAmount.replace(/[$,]/g, "")), 0),
    total: activeRows.reduce((sum, row) => sum + Number(row.total.replace(/[$,]/g, "")), 0),
    surcharge: activeRows.reduce((sum, row) => sum + Number(row.surcharge.replace(/[$,]/g, "")), 0),
  };
  const formatTotal = (amount: number) => `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const columns: Array<{ key: keyof TransactionRow; label: string; width: string; align?: string }> = [
    { key: "saleNumber", label: "Sale #", width: "w-[180px]" },
    { key: "dateTime", label: "Date/time", width: "w-[190px]" },
    { key: "site", label: "Site", width: "w-[140px]" },
    { key: "terminal", label: "Terminal", width: "w-[140px]" },
    { key: "operator", label: "Operator", width: "w-[150px]" },
    { key: "customer", label: "Customer", width: "w-[150px]" },
    { key: "tipAmount", label: "Tip amount", width: "w-[120px]", align: "text-right" },
    { key: "netAmount", label: "Net amount", width: "w-[130px]", align: "text-right" },
    { key: "taxAmount", label: "Tax amount", width: "w-[120px]", align: "text-right" },
    { key: "total", label: "Total", width: "w-[120px]", align: "text-right" },
    { key: "payments", label: "Payments", width: "w-[140px]" },
    { key: "surcharge", label: "Surcharge", width: "w-[130px]", align: "text-right" },
  ];
  const paymentOptions = ["Account credit", "Bopple", "Cash", "Gift cards", "Lightspeed Payments", "Loyalty credit", "UberEats"];
  const customerOptions = [...new Set(TRANSACTION_ROWS.map((row) => row.customer))].sort((left, right) => left.localeCompare(right));

  function saveView(name: string) {
    setSavedViews((current) => [...current, { ...filterSnapshot(), name, createdBy: CURRENT_CREATOR }]);
    setActiveViewName(name);
    setShowSaveModal(false);
  }
  function saveExistingView(name: string) {
    setSavedViews((current) => current.map((view) => view.name === name ? { ...filterSnapshot(), name, createdBy: view.createdBy ?? CURRENT_CREATOR } : view));
    setActiveViewName(name);
    setShowSaveModal(false);
  }
  function renameView(oldName: string, newName: string) {
    setSavedViews((current) => current.map((view) => view.name === oldName ? { ...view, name: newName } : view));
    if (defaultView === oldName) setDefaultView(newName);
    if (activeViewName === oldName) setActiveViewName(newName);
    setEditingSavedViewName(null);
  }
  function deleteView(name: string) {
    setSavedViews((current) => current.filter((view) => view.name !== name));
    if (defaultView === name) { setDefaultView("__system__"); resetFilters(); }
    if (activeViewName === name) setActiveViewName(null);
  }
  const suggestedViewName = selectedSites.length === 1 ? selectedSites[0].name.split(" – ")[0] : selectedSites.length > 1 ? `${selectedSites.length} sites` : "Transactions";
  const paymentTypeLabel = paymentTypes.length === 0 ? "All" : paymentTypes.length === 1 ? paymentTypes[0] : `${paymentTypes.length} selected`;
  const customerLabel = customers.length === 0 ? "All" : customers.length === 1 ? customers[0] : `${customers.length} selected`;
  const statusLabel = statuses.length === 0 || statuses.length === 2 ? "All" : statuses[0];
  function togglePaymentType(type: string) {
    setPaymentTypes((current) => current.includes(type) ? current.filter((value) => value !== type) : [...current, type]);
    setActiveViewName(null);
  }

  return <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-[24px] px-[24px] pt-[24px] pb-0">
    <div className="flex w-full flex-wrap items-start gap-[8px]">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
        <div className="relative"><DefaultFilterChip label="Site" value={siteLabel} valueClassName={selectedSites.length === 1 ? "max-w-[145px]" : ""} onClick={() => setOpenFilter("site")} />{openFilter === "site" && <SiteDropdown selectedIds={selectedSiteIds} onToggle={onToggleSite} onClose={() => setOpenFilter(null)} />}</div>
        <div className="relative"><DefaultFilterChip label="Date" value={dateSelected.label} onClick={() => setOpenFilter("date")} />{openFilter === "date" && <TransactionDateDropdown selected={dateSelected.id} onSelect={onSelectDate} onClose={() => setOpenFilter(null)} />}</div>
        <div className="relative">
          <DefaultFilterChip label="Customer" value={customerLabel} onClick={() => setOpenFilter((current) => current === "customer" ? null : "customer")} />
          {openFilter === "customer" && <MultiSelectDropdown title="Customer" options={customerOptions} selected={customers} onApply={(values) => { setCustomers(values); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} searchable />}
        </div>
        <div ref={paymentTypesRef} className="relative">
          <DefaultFilterChip label="Payment" value={paymentTypeLabel} onClick={() => setOpenFilter((current) => current === "payment-types" ? null : "payment-types")} />
          {openFilter === "payment-types" && <div className="absolute left-0 top-[40px] z-50 w-[220px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
            {paymentOptions.map((option) => <CheckboxMenuRow key={option} label={option} checked={paymentTypes.includes(option)} onClick={() => togglePaymentType(option)} />)}
          </div>}
        </div>
        <div ref={statusRef} className="relative">
          <DefaultFilterChip label="Status" value={statusLabel} onClick={() => setOpenFilter((current) => current === "status" ? null : "status")} />
          {openFilter === "status" && <div role="group" aria-label="Transaction status" className="absolute left-0 top-[40px] z-50 w-[220px] rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
            {["Processed", "Deleted"].map((option) => <CheckboxMenuRow key={option} label={option} checked={statuses.includes(option)} onClick={() => {
              setStatuses((current) => current.includes(option) ? current.filter((value) => value !== option) : [...current, option]);
              setActiveViewName(null);
            }} />)}
          </div>}
        </div>
        {isFiltered && (
          <div className="ml-[8px] flex items-center gap-[12px]">
            <ActionButton variant="text" size="slim" className="!h-auto !px-0 hover:!bg-transparent" onClick={resetFilters}>Reset</ActionButton>
            {!savedViews.some((view) => JSON.stringify({ ...view, name: "" }) === JSON.stringify(filterSnapshot())) && <ActionButton variant="text" size="slim" className="!h-auto !px-0 hover:!bg-transparent" onClick={() => setShowSaveModal(true)}>Save view</ActionButton>}
          </div>
        )}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-[4px]">
        <RefreshControl isRefreshing={isRefreshing} onRefresh={onRefresh} minutesSinceUpdate={minutesSinceUpdate} />
        <Tooltip text="Export CSV"><button type="button" aria-label="Export CSV" onClick={() => setToast("CSV file downloaded")} className="flex size-[32px] items-center justify-center rounded-full transition-colors hover:bg-[#f4f3ef]"><img alt="" className="size-[16px]" src={imgExport} /></button></Tooltip>
      </div>
    </div>
    <div ref={transactionTableRef} onScroll={(event) => setIsTransactionTableScrolled(event.currentTarget.scrollLeft > 0)} className="min-h-0 w-full min-w-0 flex-1 overflow-auto rounded-t-[8px] border border-[#e3e2dd] bg-white">
      <table className="w-full min-w-[1710px] table-fixed border-collapse text-left">
        <thead className="bg-[#f9f8f4] font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]"><tr className="h-[40px] border-b border-[#e3e2dd]">{columns.map((column, index) => <th key={column.key} className={`${column.width} ${index === 0 ? "pl-[16px] pr-[8px]" : "px-[8px]"} whitespace-nowrap py-[6px] font-medium ${index === 0 ? `sticky left-0 z-30 bg-[#f9f8f4] after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${isTransactionTableScrolled ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100" : "after:opacity-0"}` : ""} ${column.align ?? ""}`}><button type="button" aria-label={`Sort by ${column.label}${sort.key === column.key ? `, ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`} onClick={() => setSort((current) => ({ key: column.key, direction: current.key === column.key && current.direction === "asc" ? "desc" : "asc" }))} className={`inline-flex min-w-0 items-center gap-[4px] whitespace-nowrap ${column.align ? "w-full justify-end text-right" : "text-left"}`}><span>{column.label}</span><SortIcon isSorted={sort.key === column.key} direction={sort.direction} /></button></th>)}</tr></thead>
        <tbody className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">{sortedRows.map((row) => <tr key={row.saleNumber} className={`h-[48px] border-b border-[#e3e2dd] last:border-b-0 ${row.deleted ? "bg-[#fff8ed] text-[#777671]" : ""}`}>{columns.map((column, index) => <td key={column.key} className={`${column.width} ${index === 0 ? "pl-[16px] pr-[8px]" : "px-[4px]"} whitespace-nowrap py-[6px] ${index === 0 ? `sticky left-0 z-20 after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${isTransactionTableScrolled ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100" : "after:opacity-0"} ${row.deleted ? "bg-[#fff8ed]" : "bg-white"}` : ""} ${column.align ?? ""}`}>{isRefreshing ? <Sk w="w-full" /> : column.key === "saleNumber" && row.deleted ? <span className="inline-flex items-center gap-[8px]">{row.saleNumber}<span className="rounded-[4px] bg-[#f2f0ea] px-[4px] py-[1px] font-['Inter:Medium'] text-[11px] leading-[16px] text-[#62615d]">Deleted</span></span> : String(row[column.key])}</td>)}</tr>)}</tbody>
        <tfoot className="bg-[#f9f8f4] font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]"><tr className="h-[48px]">{columns.map((column, index) => <td key={column.key} className={`${column.width} ${index === 0 ? "pl-[16px] pr-[8px]" : "px-[4px]"} sticky bottom-0 z-10 whitespace-nowrap bg-[#f9f8f4] py-[6px] shadow-[0_-1px_0_0_#e3e2dd] ${index === 0 ? `left-0 z-30 after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${isTransactionTableScrolled ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100" : "after:opacity-0"}` : ""} ${column.align ?? ""}`}>{index === 0 ? "Totals" : column.key === "tipAmount" ? formatTotal(totals.tipAmount) : column.key === "netAmount" ? formatTotal(totals.netAmount) : column.key === "taxAmount" ? formatTotal(totals.taxAmount) : column.key === "total" ? formatTotal(totals.total) : column.key === "surcharge" ? formatTotal(totals.surcharge) : ""}</td>)}</tr></tfoot>
      </table>
      {!isRefreshing && activeRows.length === 0 && <p className="px-[16px] py-[24px] text-center font-['Inter:Regular'] text-[#62615d] text-[14px]">No transactions match these filters.</p>}
    </div>
    {showSaveModal && <SaveViewModal onClose={() => setShowSaveModal(false)} onSave={saveView} onUpdate={saveExistingView} existingFilters={savedViews.map((view) => view.name)} hasExisting={savedViews.length > 0} suggestedName={suggestedViewName} />}
    {editingSavedViewName && <EditSavedViewModal name={editingSavedViewName} existingNames={savedViews.map((view) => view.name)} onClose={() => setEditingSavedViewName(null)} onRename={(name) => renameView(editingSavedViewName, name)} onDelete={() => deleteView(editingSavedViewName)} />}
    {toast && <Toast message={toast} onDone={() => setToast(null)} />}
  </div>;
}

function ProductSalesPage({
  requestedSavedViewName,
  initialSalesBy,
  selectedSiteIds,
  selectedSites,
  siteLabel,
  selectedRegisters,
  dateSelected,
  compareSelected,
  taxSelected,
  isRefreshing,
  minutesSinceUpdate,
  onRefresh,
  onToggleSite,
  onApplyRegisters,
  onApplyLocationSnapshot,
  onSelectDate,
  onSelectCompare,
  onSelectTax,
}: {
  requestedSavedViewName: string | null;
  initialSalesBy: string | null;
  selectedSiteIds: string[];
  selectedSites: SiteOption[];
  siteLabel: string;
  selectedRegisters: string[];
  dateSelected: { id: string; label: string };
  compareSelected: { id: string; label: string };
  taxSelected: string;
  isRefreshing: boolean;
  minutesSinceUpdate: number;
  onRefresh: () => void;
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
  const normalizeSalesBy = (value: string) => value === "User" ? "Staff" : value;
  const [salesBy, setSalesBy] = useState(normalizeSalesBy(initialSalesBy ?? initialProductDefault?.salesBy ?? "Product"));
  const [product, setProduct] = useState<string[]>(initialProductDefault?.products ?? []);
  const [category, setCategory] = useState<string[]>(initialProductDefault?.categories ?? []);
  const [reportingGroup, setReportingGroup] = useState<string[]>(initialProductDefault?.reportingGroups ?? []);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(initialProductDefault?.visibleFilters ?? []);
  const [savedViews, setSavedViews] = useState<ProductSalesView[]>(initialProductStorage.savedViews.map((view) => ({ ...view, salesBy: normalizeSalesBy(view.salesBy) })));
  const [activeViewName, setActiveViewName] = useState<string | null>(initialProductDefault?.name ?? null);
  const [defaultView, setDefaultView] = useState<string | null>(initialProductStorage.defaultView);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingSavedViewName, setEditingSavedViewName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  type SortKey = keyof ProductSalesRow;
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  useEffect(() => {
    window.localStorage.setItem(PRODUCT_SALES_STORAGE_KEY, JSON.stringify({ savedViews, defaultView } satisfies ProductSalesStorage));
  }, [savedViews, defaultView]);

  useEffect(() => {
    if (initialSalesBy !== null) return;
    if (initialProductDefault) {
      onApplyLocationSnapshot(initialProductDefault.sites, initialProductDefault.registers);
      onSelectDate(initialProductDefault.date.id, initialProductDefault.date.label);
      onSelectCompare(initialProductDefault.compare.id, initialProductDefault.compare.label);
      onSelectTax(initialProductDefault.tax);
    } else {
      onApplyLocationSnapshot([], []);
      onSelectDate("today", "Today");
      onSelectCompare("last-same-day", "Last Tuesday");
      onSelectTax("Inclusive");
    }
  }, []);

  useEffect(() => {
    if (!requestedSavedViewName) return;
    const view = savedViews.find((savedView) => savedView.name === requestedSavedViewName);
    if (view) applyView(view);
  }, [requestedSavedViewName]);
  const dimensionLabel = salesBy === "Staff" ? "Staff member" : salesBy;
  const productRows: ProductSalesRow[] = PRODUCT_SALES_ROWS.map((row) => ({
    ...row,
    products: "1",
    orders: String(Math.max(1, Math.round(Number(row.quantity) * 0.8))),
    averageSale: `$${(Number(row.sales.replace(/[$,]/g, "")) / Math.max(1, Math.round(Number(row.quantity) * 0.8))).toFixed(2)}`,
  }));
  const baseRows: ProductSalesRow[] = salesBy === "Product"
    ? productRows
    : PRODUCT_SALES_BREAKDOWNS[salesBy] ?? productRows;
  const selectedBreakdownValues = salesBy === "Site"
    ? selectedSites.length > 0 ? selectedSites.map((site) => site.name.split(" – ")[0]) : []
    : salesBy === "Category" ? category
      : salesBy === "Reporting group" ? reportingGroup
        : salesBy === "Product" ? product
          : [];
  const reportRows = selectedBreakdownValues.length > 0
    ? baseRows.filter((row) => selectedBreakdownValues.includes(row.name))
    : baseRows;
  const metricDimension = salesBy === "Staff" ? "staff member" : salesBy.toLowerCase();
  const metricDimensionPlural = salesBy === "Staff" ? "staff members" : salesBy === "Category" ? "categories" : `${metricDimension}s`;
  const topSellingRow = [...reportRows].sort((left, right) => Number(right.quantity) - Number(left.quantity))[0];
  const lowestSellingRow = [...reportRows].sort((left, right) => Number(left.quantity) - Number(right.quantity))[0];
  const topProfitRow = [...reportRows].sort((left, right) => Number(right.sales.replace(/[$,]/g, "")) - Number(left.sales.replace(/[$,]/g, "")))[0];
  const salesBreadthCount = salesBy === "Product" ? 18 : reportRows.length;
  const salesBreadthTotal = salesBy === "Product" ? 45 : baseRows.length;
  const salesBreadthLabel = salesBy === "Product" ? "Menu sales breadth" : `${salesBy} sales breadth`;
  const salesBreadthValue = salesBy === "Product" ? "18/45 items sold" : `${salesBreadthCount}/${salesBreadthTotal} ${metricDimensionPlural} represented`;
  const salesBreadthDetail = salesBy === "Product" ? "40% of menu" : `${Math.round(salesBreadthCount / Math.max(1, salesBreadthTotal) * 100)}% of ${metricDimensionPlural}`;
  const topProductValue = salesBy === "Product" ? "Salmon Fillet" : topSellingRow?.name ?? "—";
  const lowestProductValue = salesBy === "Product" ? "Extra Eggs" : lowestSellingRow?.name ?? "—";
  const topProfitValue = salesBy === "Product" ? "Cold Brew Coffee" : topProfitRow?.name ?? "—";
  const sortedRows = [...reportRows].sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const comparison = sort.key === "name"
      ? String(left).localeCompare(String(right))
      : Number(String(left).replace(/[^\d.-]/g, "")) - Number(String(right).replace(/[^\d.-]/g, ""));
    return sort.direction === "asc" ? comparison : -comparison;
  });
  const showComparison = compareSelected.id !== "none";
  const columns: Array<{ key: SortKey; label: string; className: string }> = salesBy === "Product"
    ? [
        { key: "name", label: "Product", className: "w-[20%]" },
        { key: "quantity", label: "Quantity", className: "w-[12%]" },
        { key: "sales", label: "$ sales", className: "w-[10%] text-right" },
        { key: "tax", label: "Total tax", className: "w-[10%] text-right" },
        { key: "cost", label: "Cost", className: "w-[9%] text-right" },
        { key: "quantityShare", label: "% of quantity", className: "w-[12%]" },
        { key: "salesShare", label: "% of sale amount", className: "w-[17%]" },
        { key: "profitShare", label: "Gross profit %", className: "w-[10%]" },
      ]
    : [
        { key: "name", label: dimensionLabel, className: "w-[20%]" },
        { key: "products", label: "Products", className: "w-[11%]" },
        { key: "quantity", label: "Quantity", className: "w-[11%]" },
        { key: "sales", label: "$ sales", className: "w-[13%] text-right" },
        { key: "tax", label: "Total tax", className: "w-[12%] text-right" },
        { key: "cost", label: "Cost", className: "w-[10%] text-right" },
        { key: "averageSale", label: "Average sale", className: "w-[13%] text-right" },
        { key: "salesShare", label: "% of sale amount", className: "w-[10%]" },
      ];

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
    setSalesBy(normalizeSalesBy(view.salesBy));
    setProduct(view.products);
    setCategory(view.categories);
    setReportingGroup(view.reportingGroups);
    setVisibleFilters(view.visibleFilters);
    setActiveViewName(view.name);
    onApplyLocationSnapshot(view.sites, view.registers);
    onSelectDate(view.date.id, view.date.label);
    onSelectCompare(view.compare.id, view.compare.label);
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
    const view = { ...captureView(name), createdBy: CURRENT_CREATOR };
    setSavedViews((current) => [...current, view]);
    setActiveViewName(name);
    setShowSaveModal(false);
  }

  function updateSavedView(name: string) {
    setSavedViews((current) => current.map((view) => view.name === name ? { ...captureView(name), createdBy: view.createdBy ?? CURRENT_CREATOR } : view));
    setActiveViewName(name);
    setShowSaveModal(false);
  }

  const suggestedViewName = [
    salesBy === "Category" ? "Categories" : salesBy === "Reporting group" ? "Reporting groups" : salesBy === "Staff" ? "Staff sales" : salesBy === "Site" ? "Site sales" : visibleFilters.includes("Category") ? "Categories" : "Products",
    salesBy !== "Category" && salesBy !== "Reporting group" && salesBy !== "Site" && selectedSites.length === 1 ? selectedSites[0].name.split(" – ")[0] : "",
    selectedSites.length > 1 ? `${selectedSites.length} sites` : "",
    dateSelected.id === "today" ? "" : dateSelected.id === "past-week" ? "Last week" : dateSelected.label,
  ].filter(Boolean).join(" - ");

  function deleteSavedView(name: string) {
    setSavedViews((current) => current.filter((view) => view.name !== name));
    if (defaultView === name) {
      setDefaultView("__system__");
      resetProductSalesFilters();
    }
    if (activeViewName === name) setActiveViewName(null);
  }

  function renameSavedView(oldName: string, newName: string) {
    setSavedViews((current) => current.map((view) => view.name === oldName ? { ...view, name: newName } : view));
    if (defaultView === oldName) setDefaultView(newName);
    if (activeViewName === oldName) setActiveViewName(newName);
    setEditingSavedViewName(null);
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
          <MultiSelectDropdown title="Category" options={["Coffee", "Pastries", "Mains", "Sides", "Drinks"]} selected={category} onApply={(values) => { setCategory(values); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} searchable />
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
          <div className="relative">
            <DefaultFilterChip label="Sales by" value={salesBy} onClick={() => toggleFilter("sales-by")} />
            {openFilter === "sales-by" && <OptionsDropdown options={["Product", "Site", "Category", "Reporting group", "Staff"]} selected={salesBy} onSelect={(value) => { setSalesBy(value); setActiveViewName(null); }} onClose={() => setOpenFilter(null)} width={180} />}
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
              <span className="-mx-[4px] shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">vs</span>
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
                Category: ["All", "Coffee", "Pastries", "Mains", "Sides", "Drinks"],
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
          {isFilteredFromDefault && (
            <div className="ml-[8px] flex items-center gap-[12px]">
              <ActionButton variant="text" size="slim" className="!h-auto !px-0 hover:!bg-transparent" onClick={resetProductSalesFilters}>Reset</ActionButton>
              <ActionButton variant="text" size="slim" className="!h-auto !px-0 hover:!bg-transparent" onClick={() => setShowSaveModal(true)}>Save view</ActionButton>
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-[4px]">
          <RefreshControl isRefreshing={isRefreshing} onRefresh={onRefresh} minutesSinceUpdate={minutesSinceUpdate} />
          <Tooltip text="Export CSV">
            <button
              type="button"
              aria-label="Export CSV"
              onClick={() => setToast("CSV file downloaded")}
              className="flex size-[32px] items-center justify-center rounded-full transition-colors hover:bg-[#f4f3ef]"
            >
              <img alt="" className="size-[16px]" src={imgExport} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-stretch gap-[16px]">
        <KpiCard label={`Top selling ${metricDimension}`} value={topProductValue} change="+7.8%" changeColor="text-[#008e13]" compareLabel="Last Tuesday" showComparison isRefreshing={isRefreshing} compact />
        <KpiCard label={`Lowest selling ${metricDimension}`} value={lowestProductValue} change="+1.3%" changeColor="text-[#008e13]" compareLabel="Last Tuesday" showComparison isRefreshing={isRefreshing} compact />
        <KpiCard label="Top profit contributor" value={topProfitValue} change="−3.2%" changeColor="text-[#8e1311]" compareLabel="Last Tuesday" showComparison isRefreshing={isRefreshing} compact />
        {salesBy === "Product" && (
          <WidgetCard className="flex-1 min-w-0">
            <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                  <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">{salesBreadthLabel}</span>
                  <InfoIcon tooltip={`${salesBreadthLabel} for the selected period`} />
                </div>
                <AskButton label="Ask" />
              </div>
              {isRefreshing ? <Sk w="w-[112px]" h="h-[24px]" /> : <>
                <span className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[24px]">{salesBreadthValue}</span>
                <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">{salesBreadthDetail}</span>
              </>}
            </div>
          </WidgetCard>
        )}
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-[#f9f8f4] font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
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
                      <SortIcon isSorted={sort.key === column.key} direction={sort.direction} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">
              {sortedRows.map((product) => (
                <tr key={product.name} className="h-[48px] border-b border-[#e3e2dd] last:border-b-0">
                  {columns.map((column, index) => (
                    <td key={column.key} className={`break-all px-[4px] py-[6px] ${index === 0 ? "pl-[16px] pr-[8px]" : ""} ${column.className.includes("text-right") ? "text-right" : ""}`}>
                      {isRefreshing ? <Sk w="w-full" /> : product[column.key] ?? "—"}
                    </td>
                  ))}
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
        suggestedName={suggestedViewName}
      />}
      {editingSavedViewName && <EditSavedViewModal
        name={editingSavedViewName}
        existingNames={savedViews.map((view) => view.name)}
        onClose={() => setEditingSavedViewName(null)}
        onRename={(name) => renameSavedView(editingSavedViewName, name)}
        onDelete={() => {
          deleteSavedView(editingSavedViewName);
          setEditingSavedViewName(null);
        }}
      />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
