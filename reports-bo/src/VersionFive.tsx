import React, { useState, useRef, useEffect } from "react"
import VersionOnePrototype from "./VersionOne"
import ActionButton from "./components/ActionButton"

const assetPathPrefix = `${import.meta.env.BASE_URL}assets`

// Icons
const imgArrowRight = `${assetPathPrefix}/ee956.svg`
const imgHome = `${assetPathPrefix}/e8666.svg`
const imgClipboard = `${assetPathPrefix}/769a2.svg`
const imgGraph = `${assetPathPrefix}/91e0c.svg`
const imgUsers = `${assetPathPrefix}/c4beb.svg`
const imgApps = `${assetPathPrefix}/5fa18.svg`
const imgWallet = `${assetPathPrefix}/e29e2.svg`
const imgCog = `${assetPathPrefix}/87ae5.svg`
const imgHelp = `${assetPathPrefix}/c8458.svg`
const imgProfile = `${assetPathPrefix}/6c93b.svg`
const imgChat = `${assetPathPrefix}/c3b6d.svg`
const imgAnnouncement = `${assetPathPrefix}/4d025.svg`
const imgInfo = `${assetPathPrefix}/753ad.svg`
const imgLine = `${assetPathPrefix}/96b81.svg`
const imgPrevShape = `${assetPathPrefix}/1b21c.svg`
const imgPrevLine = `${assetPathPrefix}/a452e.svg`
const imgSparkShape = `${assetPathPrefix}/66d26.svg`
const imgSparkLine = `${assetPathPrefix}/1fda1.svg`
const imgRowLine = `${assetPathPrefix}/7183d.svg`
const imgSearch = `${assetPathPrefix}/a4aea.svg`
const imgCheck = `${assetPathPrefix}/7279d.svg`
const imgChecked = `${assetPathPrefix}/3d476.svg`
const imgDivider = `${assetPathPrefix}/973a3.svg`
const imgCustomiseTable = `${assetPathPrefix}/columns-03.svg`
const imgSharedReportsEmpty = `${assetPathPrefix}/reports-empty-state.svg`

// ─── Types ──────────────────────────────────────────────────────────────────

// ─── Sidebar ────────────────────────────────────────────────────────────────

type ReportName = "All reports" | "Lightspeed reports" | "Shared reports" | "My reports" | "Overview" | "Product sales" | "Transactions" | "Hourly sales" | "Reconciliation" | "Legacy"
type SavedReportKind = Exclude<ReportName, "All reports" | "Lightspeed reports" | "Shared reports" | "My reports">
type SavedViewSummary = { name: string createdBy?: string }
type SavedViewHeaderActions = {
  rename: () => void
  delete: () => void
  export?: () => void
  save?: () => void
  reset?: () => void
  customiseColumns?: () => void
  showSaveReport?: boolean
  backFromInvoice?: () => void
}

type DirectoryReport = {
  id: string
  title: string
  description: string
  category: string
  report: SavedReportKind
  viewName?: string
  createdBy?: string
  createdAt?: number
  sharedWithTeam?: boolean
  legacy?: boolean
}

const REPORT_DESCRIPTION =
  "See report on sales by product, category, site, reporting groups, and more."
const CURRENT_CREATOR = "Poppy B."

function buildSmartReportDescription(report: string, filters: string[]) {
  return `${report} report for ${filters.join(", ")}.`
}

const reportDirectoryItems: DirectoryReport[] = [
  {
    id: "preset:transactions",
    title: "Sales feed",
    description: "All transactions made to your business.",
    category: "Sales",
    report: "Transactions",
  },
  {
    id: "preset:product-sales",
    title: "Product sales",
    description:
      "What products have we sold, who sold them and what was our profit?",
    category: "Sales",
    report: "Product sales",
  },
  {
    id: "preset:hourly-sales",
    title: "Hourly sales",
    description:
      "See report on sales by product, category, site, reporting groups, and more.",
    category: "Sales",
    report: "Hourly sales",
  },
  {
    id: "preset:reconciliation",
    title: "Reconciliations",
    description: "How have we been paid, and has it balanced?",
    category: "Sales",
    report: "Reconciliation",
  },
  ...[
    "Comparison",
    "Taxes",
    "Audit",
    "Attendance",
    "Wastage",
    "Adjustments",
    "Refunds",
    "Guests",
    "Purchases",
  ].map((title) => ({
    id: `legacy:${title.toLowerCase().replace(/\s+/g, "-")}`,
    title,
    description: "How are our promotions, discounts and surcharges being used?",
    category: "Legacy",
    report: "Legacy" as const,
    legacy: true,
  })),
]

function ReportsLanding({
  page,
  onSelectPage,
  onSelectReport,
}: {
  page: "All reports" | "Lightspeed reports" | "Shared reports" | "My reports"
  onSelectPage: (
    page: "Lightspeed reports" | "Shared reports" | "My reports" | "All reports",
  ) => void
  onSelectReport: (
    report: DirectoryReport,
    source: "All reports" | "Lightspeed reports" | "Shared reports" | "My reports",
  ) => void
}) {
  const [creator, setCreator] = useState("Anyone")
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("Last added")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSharedSearchFocused, setIsSharedSearchFocused] = useState(false)
  useEffect(
    () =>
      setSortBy(
        page === "All reports" || page === "Shared reports"
          ? "Last added"
          : "First added",
      ),
    [page],
  )
  const creatorLabel =
    creator === "Anyone" ? "Added by anyone" : `Added by ${creator}`
  const savedReports: DirectoryReport[] = [
    ...loadStoredValue<HourlySalesStorage>(HOURLY_SALES_STORAGE_KEY, {
      savedViews: [],
      defaultView: "__system__",
    })
      .savedViews.filter((view) => view.createdBy)
      .map((view) => ({
        id: `saved:Hourly sales:${view.name}`,
        title: view.name,
        description: view.description ?? "",
        category: "Sales",
        report: "Hourly sales" as const,
        viewName: view.name,
        createdBy: view.createdBy,
        createdAt: view.createdAt,
        sharedWithTeam: view.sharedWithTeam,
      })),
    ...loadStoredValue<ProductSalesStorage>(PRODUCT_SALES_STORAGE_KEY, {
      savedViews: [],
      defaultView: "__system__",
    })
      .savedViews.filter((view) => view.createdBy)
      .map((view) => ({
        id: `saved:Product sales:${view.name}`,
        title: view.name,
        description: view.description ?? "",
        category: "Sales",
        report: "Product sales" as const,
        viewName: view.name,
        createdBy: view.createdBy,
        createdAt: view.createdAt,
        sharedWithTeam: view.sharedWithTeam,
      })),
    ...loadStoredValue<TransactionsStorage>(TRANSACTIONS_STORAGE_KEY, {
      savedViews: [],
      defaultView: "__system__",
    })
      .savedViews.filter((view) => view.createdBy)
      .map((view) => ({
        id: `saved:Transactions:${view.name}`,
        title: view.name,
        description: view.description ?? "",
        category: "Sales",
        report: "Transactions" as const,
        viewName: view.name,
        createdBy: view.createdBy,
        createdAt: view.createdAt,
        sharedWithTeam: view.sharedWithTeam,
      })),
  ]
  const allReports = [...reportDirectoryItems, ...savedReports]
  const sharedSampleReports: DirectoryReport[] = [
    {
      id: "shared:hourly-sales-riverbend",
      title: "Hourly sales for Riverbend WA",
      description: "Custom report",
      category: "Sales",
      report: "Hourly sales",
      viewName: "Hourly sales for Riverbend WA",
      createdBy: "Benny Parker",
      createdAt: 2,
      sharedWithTeam: true,
    },
  ]
  const reports =
    page === "Lightspeed reports"
      ? reportDirectoryItems
      : page === "Shared reports"
        ? [
            ...sharedSampleReports,
            ...savedReports.filter(
              (report) =>
                report.sharedWithTeam || report.createdBy !== CURRENT_CREATOR,
            ),
          ]
        : page === "My reports"
          ? savedReports.filter(
              (report) => report.createdBy === CURRENT_CREATOR,
            )
          : allReports
  const creators = [
    ...new Set(
      reports
        .map((report) => report.createdBy)
        .filter((name): name is string => !!name),
    ),
  ]
  const creatorOptions = creators.map((name) =>
    page === "Shared reports" && name === "Poppy B." ? "Poppy Belle" : name,
  )
  if (page === "Shared reports") {
    creatorOptions.push(
      "Alex Morgan",
      "Avery Taylor",
      "Casey Brown",
      "Charlie Wilson",
      "Jamie Chen",
      "Jordan Lee",
      "Morgan Davis",
      "Riley Thompson",
      "Sam Patel",
      "Taylor Nguyen",
      "Cameron Brooks",
      "Drew Mitchell",
    )
  }
  const visibleReports = reports.filter(
    (report) =>
      (creator === "Anyone" ||
        (page === "Shared reports" && report.createdBy === "Poppy B."
          ? "Poppy Belle"
          : report.createdBy) === creator) &&
      (!(page === "Shared reports" || page === "My reports") ||
        `${report.title} ${report.description} ${report.createdBy ?? ""}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())),
  )
  const sortedReports =
    sortBy === "First added" || sortBy === "Last added"
      ? [...visibleReports].sort((a, b) => {
          const aIsSaved = a.id.startsWith("saved:")
          const bIsSaved = b.id.startsWith("saved:")
          if (
            page === "All reports" &&
            sortBy === "First added" &&
            aIsSaved !== bIsSaved
          )
            return Number(aIsSaved) - Number(bIsSaved)
          const order = (a.createdAt ?? 0) - (b.createdAt ?? 0)
          return sortBy === "First added" ? order : -order
        })
      : [...visibleReports].sort((a, b) =>
          sortBy === "A-Z"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title),
        )
  const matchingReports =
    page === "All reports" && sortBy === "Last added"
      ? visibleReports
      : sortedReports
  const lightspeedReports = reportDirectoryItems.filter(
    (report) => !report.legacy,
  )
  const legacyReports = reportDirectoryItems
    .filter((report) => report.legacy)
    .sort((a, b) => a.title.localeCompare(b.title))
  const collectionTabs = [
    ["Lightspeed reports", "Lightspeed"],
    ["Shared reports", "Shared"],
    ["My reports", "My reports"],
  ] as const

  function ReportRows({ reports }: { reports: DirectoryReport[] }) {
    return reports.map((report, index) => (
      <div
        key={report.id}
        className={`group flex min-h-[80px] w-full items-center gap-[12px] border-t border-[#e3e2dd] px-[16px] py-[12px] transition-colors hover:bg-[#f9f8f4] ${
          index === 0 ? "border-t-0" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectReport(report, page)}
          className="flex min-h-[48px] min-w-0 flex-1 flex-col justify-center gap-[2px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1e72c4]"
        >
          <span className="flex items-center gap-[8px]">
            <span className="font-['Inter:Semibold'] text-[15px] leading-[22px] text-[#22201f]">
              {report.title}
            </span>
          </span>
          {report.description && (
            <span className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
              {report.description}
            </span>
          )}
        </button>
        {report.createdBy && (
          <span className="shrink-0 font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
            Added by{" "}
            {report.createdBy.trim().split(/\s+/).length > 1
              ? `${report.createdBy.trim().split(/\s+/)[0]} ${report.createdBy.trim().split(/\s+/).at(-1)?.[0]}.`
              : report.createdBy}
          </span>
        )}
      </div>
    ))
  }

  return (
    <div className="h-0 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-[24px] px-[20px] py-[24px] sm:px-[24px]">
        <div
          aria-label="Report collection"
          className="flex h-[40px] w-fit max-w-full shrink-0 overflow-x-auto rounded-[8px] bg-[#edeae4] p-[4px]"
          role="group"
        >
          {collectionTabs.map(([option, label]) => (
            <button
              key={option}
              type="button"
              aria-pressed={page === option}
              onClick={() => onSelectPage(option)}
              className={`flex h-[32px] w-[96px] shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] border px-[12px] font-['Inter:Semibold'] text-[14px] leading-[20px] transition-colors ${
                page === option
                  ? "border-[#e3e2dd] bg-white text-[#22201f]"
                  : "border-transparent text-[#22201f] hover:bg-[#f4f2ed]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {page === "Lightspeed reports" ? (
          <div className="flex flex-col gap-[24px]">
            <section
              aria-label="Lightspeed reports"
              className="overflow-hidden rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]"
            >
              <ReportRows reports={lightspeedReports} />
            </section>
            <section
              aria-label="Legacy reports"
              className="overflow-hidden rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]"
            >
              <h2 className="flex h-[48px] items-center border-b border-[#e3e2dd] px-[16px] font-['Inter:Semibold'] text-[12px] uppercase leading-[16px] text-[#62615d]">
                Legacy reports
              </h2>
              <ReportRows reports={legacyReports} />
            </section>
          </div>
        ) : page === "Shared reports" ? (
          <div className="flex flex-col gap-[24px]">
            <div className="flex w-full flex-wrap items-center gap-[12px]">
              <label
                className={`flex h-[40px] min-w-[180px] flex-1 items-center gap-[8px] rounded-[8px] border bg-white px-[10px] transition-shadow ${
                  isSharedSearchFocused
                    ? "border-[#3390e0] shadow-[0_0_0_4px_#edf6ff]"
                    : "border-[#bbbab6]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="size-[16px] shrink-0 text-[#22201f]"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="m10.5 10.5 3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  aria-label="Search shared reports"
                  placeholder="Search"
                  value={searchQuery}
                  onFocus={() => setIsSharedSearchFocused(true)}
                  onBlur={() => setIsSharedSearchFocused(false)}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] outline-none placeholder:text-[#22201f]"
                />
                {isSharedSearchFocused && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setSearchQuery("")}
                    className="flex size-[20px] shrink-0 items-center justify-center text-[#22201f]"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-[16px]"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6.25"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="m6.5 6.5 3 3m0-3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </label>
              <div className="relative w-full sm:w-[200px]">
                <button
                  type="button"
                  aria-expanded={openFilter === "creator"}
                  onClick={() =>
                    setOpenFilter((current) =>
                      current === "creator" ? null : "creator",
                    )
                  }
                  className="flex h-[40px] w-full items-center justify-between gap-[12px] rounded-[8px] border border-[#bbbab6] bg-white px-[12px] text-left font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] hover:bg-[#f9f8f4]"
                >
                  <span className="min-w-0 truncate">{creatorLabel}</span>
                  <svg
                    aria-hidden="true"
                    className="size-[16px] shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="m4 6 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {openFilter === "creator" && (
                  <OptionsDropdown
                    options={["Anyone", ...creatorOptions]}
                    selected={creator}
                    onSelect={setCreator}
                    onClose={() => setOpenFilter(null)}
                    width={200}
                    topOffset={44}
                  />
                )}
              </div>
              <div className="relative w-full sm:w-[200px]">
                <button
                  type="button"
                  aria-expanded={openFilter === "sort"}
                  onClick={() =>
                    setOpenFilter((current) =>
                      current === "sort" ? null : "sort",
                    )
                  }
                  className="flex h-[40px] w-full items-center justify-between gap-[12px] rounded-[8px] border border-[#bbbab6] bg-white px-[12px] text-left font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] hover:bg-[#f9f8f4]"
                >
                  <span className="min-w-0 truncate">
                    Sort by {sortBy.toLowerCase()}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="size-[16px] shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="m4 6 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {openFilter === "sort" && (
                  <OptionsDropdown
                    options={["First added", "Last added", "A-Z", "Z-A"]}
                    selected={sortBy}
                    onSelect={setSortBy}
                    onClose={() => setOpenFilter(null)}
                    width={200}
                    topOffset={44}
                  />
                )}
              </div>
            </div>
            <section
              aria-label="Shared reports"
              className={`overflow-hidden rounded-[12px] border border-[#e3e2dd] bg-white ${
                reports.length === 0 ? "p-0" : "p-[16px]"
              }`}
            >
              {matchingReports.length > 0 ? (
                <ReportRows reports={matchingReports} />
              ) : reports.length === 0 ? (
                <div className="flex min-h-[308px] flex-col items-center justify-center gap-[24px] p-[56px] text-center">
                  <img
                    src={imgSharedReportsEmpty}
                    alt=""
                    aria-hidden="true"
                    className="h-[120px] w-[128px] shrink-0"
                  />
                  <div className="flex w-full flex-col gap-[4px]">
                    <h2 className="font-['Inter:Semibold'] text-[16px] leading-[24px] text-[#22201f]">
                      No shared reports yet
                    </h2>
                    <p className="font-['Inter:Regular'] text-[15px] leading-[24px] text-[#62615d]">
                      When someone on your team shares a saved report, it’ll
                      show up here for everyone to open.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="px-[16px] py-[20px] text-center font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
                  No shared reports match these filters.
                </p>
              )}
            </section>
          </div>
        ) : page === "My reports" ? (
          <div className="flex flex-col gap-[24px]">
            <div className="flex w-full flex-wrap items-center gap-[12px]">
              <label
                className={`flex h-[40px] min-w-[180px] flex-1 items-center gap-[8px] rounded-[8px] border bg-white px-[10px] transition-shadow ${
                  isSharedSearchFocused
                    ? "border-[#3390e0] shadow-[0_0_0_4px_#edf6ff]"
                    : "border-[#bbbab6]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="size-[16px] shrink-0 text-[#22201f]"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="m10.5 10.5 3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  aria-label="Search my reports"
                  placeholder="Search"
                  value={searchQuery}
                  onFocus={() => setIsSharedSearchFocused(true)}
                  onBlur={() => setIsSharedSearchFocused(false)}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] outline-none placeholder:text-[#22201f]"
                />
                {isSharedSearchFocused && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setSearchQuery("")}
                    className="flex size-[20px] shrink-0 items-center justify-center text-[#22201f]"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-[16px]"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6.25"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="m6.5 6.5 3 3m0-3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </label>
              <div className="relative w-full sm:w-[200px]">
                <button
                  type="button"
                  aria-expanded={openFilter === "sort"}
                  onClick={() =>
                    setOpenFilter((current) =>
                      current === "sort" ? null : "sort",
                    )
                  }
                  className="flex h-[40px] w-full items-center justify-between gap-[12px] rounded-[8px] border border-[#bbbab6] bg-white px-[12px] text-left font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] hover:bg-[#f9f8f4]"
                >
                  <span className="min-w-0 truncate">
                    Sort by {sortBy.toLowerCase()}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="size-[16px] shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="m4 6 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {openFilter === "sort" && (
                  <OptionsDropdown
                    options={["First added", "Last added", "A-Z", "Z-A"]}
                    selected={sortBy}
                    onSelect={setSortBy}
                    onClose={() => setOpenFilter(null)}
                    width={200}
                    topOffset={44}
                  />
                )}
              </div>
            </div>
            <section
              aria-label="My reports"
              className={`overflow-hidden rounded-[12px] border border-[#e3e2dd] bg-white ${
                reports.length === 0 ? "p-0" : "p-[16px]"
              }`}
            >
              {matchingReports.length > 0 ? (
                <ReportRows reports={matchingReports} />
              ) : reports.length === 0 ? (
                <div className="flex min-h-[308px] flex-col items-center justify-center gap-[24px] p-[56px] text-center">
                  <img
                    src={imgSharedReportsEmpty}
                    alt=""
                    aria-hidden="true"
                    className="h-[120px] w-[128px] shrink-0"
                  />
                  <div className="flex w-full flex-col gap-[4px]">
                    <h2 className="font-['Inter:Semibold'] text-[16px] leading-[24px] text-[#22201f]">
                      No saved reports yet
                    </h2>
                    <p className="font-['Inter:Regular'] text-[15px] leading-[24px] text-[#62615d]">
                      When you save a report view, it’ll show up here. Open it
                      any time to see it with fresh data.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="px-[16px] py-[20px] text-center font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
                  No reports match your search.
                </p>
              )}
            </section>
          </div>
        ) : (
          <section
            aria-label="Reports list"
            className="overflow-visible rounded-[12px] border border-[#e3e2dd] p-[16px]"
          >
            {page === "All reports" && (
              <div className="flex flex-wrap items-center gap-[8px] pb-[16px]">
                {page !== "My reports" && (
                  <div className="relative">
                    <DefaultFilterChip
                      label="Created by"
                      value={creator}
                      onClick={() =>
                        setOpenFilter((current) =>
                          current === "creator" ? null : "creator",
                        )
                      }
                    />
                    {openFilter === "creator" && (
                      <OptionsDropdown
                        options={["Anyone", ...creators]}
                        selected={creator}
                        onSelect={setCreator}
                        onClose={() => setOpenFilter(null)}
                        width={180}
                      />
                    )}
                  </div>
                )}
                <div
                  className={`relative ${
                    page === "My reports" ? "" : "ml-auto"
                  }`}
                >
                  <DefaultFilterChip
                    label="Sort by"
                    value={sortBy}
                    onClick={() =>
                      setOpenFilter((current) =>
                        current === "sort" ? null : "sort",
                      )
                    }
                  />
                  {openFilter === "sort" && (
                    <OptionsDropdown
                      options={["First added", "Last added", "A-Z", "Z-A"]}
                      selected={sortBy}
                      onSelect={setSortBy}
                      onClose={() => setOpenFilter(null)}
                      width={160}
                    />
                  )}
                </div>
              </div>
            )}
            {matchingReports.length > 0 ? (
              <ReportRows reports={matchingReports} />
            ) : (
              <p className="px-[16px] py-[20px] text-center text-[14px] leading-[20px] text-[#62615d]">
                {page === "Shared reports"
                  ? "Reports shared with you will appear here."
                  : page === "My reports"
                    ? "Reports you create will appear here."
                    : "No reports match these filters."}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

const REPORT_CHART_COLORS = {
  primary: "#3390E0",
  secondary: "#D5730C",
  tertiary: "#089B76",
  quaternary: "#8A72EA",
  other: "#777671",
  axis: "#62615D",
  grid: "#E3E2DD",
}

const OVERVIEW_TOOLTIPS: Record<string, string> = {
  "Total sales": "The total value of everything sold, including tax and tips.",
  Orders:
    "The number of completed sales. An order with several items still counts as one order. Voided and cancelled orders aren’t counted.",
  "Average order value":
    "The average amount spent per order: total sales divided by the number of orders. A rising number means customers are spending more each visit.",
  "Top selling product": "The item sold the most (by quantity) in this period.",
  "Hourly sales":
    "Total sales for each hour of the day, including tax and tips.",
  "Payment methods":
    "How customers paid, shown as a share of total sales. Gift cards and loyalty credit are counted when they’re used to pay, not when they’re sold or earned.",
  "Order types":
    "How orders were placed, shown as a share of total sales. “Other” covers orders that don’t have an order type set.",
  "Sales by site":
    "Total sales for each site today, including tax and tips. Sites are ranked from highest to lowest.",
  "Sales by staff (closed)":
    "Total sales for each team member who closed the order. An order is credited to whoever closed it, not to anyone who started it or added items along the way.",
}

const overviewV2Donuts = [
  {
    title: "Payment methods",
    segments: [
      {
        label: "Lightspeed Payments",
        value: "84.4%",
        color: REPORT_CHART_COLORS.primary,
        change: "−2.4%",
        positive: false,
        share: 54,
      },
      {
        label: "Cash",
        value: "5.2%",
        color: REPORT_CHART_COLORS.secondary,
        change: "+3.3%",
        positive: true,
        share: 14,
      },
      {
        label: "Loyalty Credit",
        value: "4.8%",
        color: REPORT_CHART_COLORS.tertiary,
        change: "+8.7%",
        positive: true,
        share: 12,
      },
      {
        label: "Gift Cards",
        value: "2.1%",
        color: REPORT_CHART_COLORS.quaternary,
        change: "+8.3%",
        positive: true,
        share: 10,
      },
      {
        label: "Other",
        value: "3.5%",
        color: REPORT_CHART_COLORS.other,
        change: "−2.1%",
        positive: false,
        share: 10,
      },
    ],
  },
  {
    title: "Order types",
    segments: [
      {
        label: "Takeaway",
        value: "84.4%",
        color: REPORT_CHART_COLORS.primary,
        change: "−2.4%",
        positive: false,
        share: 54,
      },
      {
        label: "Dine in",
        value: "5.2%",
        color: REPORT_CHART_COLORS.secondary,
        change: "+3.3%",
        positive: true,
        share: 14,
      },
      {
        label: "Pickup",
        value: "4.8%",
        color: REPORT_CHART_COLORS.tertiary,
        change: "+8.7%",
        positive: true,
        share: 12,
      },
      {
        label: "Delivery",
        value: "2.1%",
        color: REPORT_CHART_COLORS.quaternary,
        change: "+6.3%",
        positive: true,
        share: 10,
      },
      {
        label: "Other",
        value: "3.5%",
        color: REPORT_CHART_COLORS.other,
        change: "−2.1%",
        positive: false,
        share: 10,
      },
    ],
  },
]

const overviewDashboardWidgets = [
  { key: "kpis", label: "Key metrics", optional: false },
  { key: "hourly-sales", label: "Hourly sales", optional: false },
  { key: "breakdowns", label: "Order and payment breakdowns", optional: false },
  { key: "top-products", label: "Top-selling products", optional: false },
  { key: "sales-by-site", label: "Sales by site", optional: false },
  {
    key: "sales-closed-by-staff",
    label: "Sales by staff (closed)",
    optional: false,
  },
  { key: "discounts", label: "Sales by discounts", optional: true },
  { key: "tax-rates", label: "Sales by tax rate", optional: true },
  { key: "order-source", label: "Sales by order source", optional: true },
] as const

const defaultOverviewDashboardWidgets = overviewDashboardWidgets
  .filter((widget) => !widget.optional)
  .map((widget) => widget.key)

const defaultOverviewWidgetOrder = [
  "hourly-sales",
  "payment-methods",
  "order-types",
  "top-product",
  "top-category",
  "top-reporting-group",
  "sales-by-site",
  "sales-closed-by-staff",
  "discounts",
  "tax-rates",
  "order-source",
]

function CustomiseDashboardDrawer({
  visibleWidgets,
  onToggle,
  onReset,
  onClose,
}: {
  visibleWidgets: string[]
  onToggle: (key: string) => void
  onReset: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-[rgba(34,32,31,0.24)]"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="customise-dashboard-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[360px] flex-col border-l border-[#e3e2dd] bg-white shadow-[-8px_0_24px_rgba(18,18,18,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[64px] shrink-0 items-center border-b border-[#e3e2dd] px-[20px]">
          <h2
            id="customise-dashboard-title"
            className="flex-1 font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#22201f]"
          >
            Customise dashboard
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-full text-[#62615d] hover:bg-[#f4f3ef]"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m4 4 8 8m0-8-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-[20px]">
          <p className="mb-[20px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
            Choose which widgets appear on your Overview dashboard.
          </p>
          <div className="flex flex-col">
            {overviewDashboardWidgets.map((widget) => (
              <CheckboxMenuRow
                key={widget.key}
                label={widget.label}
                checked={visibleWidgets.includes(widget.key)}
                onClick={() => onToggle(widget.key)}
              />
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-[12px] border-t border-[#e3e2dd] p-[16px]">
          <button
            type="button"
            onClick={onReset}
            className="h-[36px] flex-1 rounded-[8px] border border-[#bbbab6] font-['Inter:Semibold'] text-[14px] text-[#22201f] hover:bg-[#f9f8f4]"
          >
            Reset to default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] flex-1 rounded-[8px] bg-[#1e72c4] font-['Inter:Semibold'] text-[14px] text-white hover:bg-[#1558a0]"
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  )
}

function getRoundedDonutSegmentPath(
  startAngle: number,
  endAngle: number,
  outerRadius: number,
  innerRadius: number,
  cornerRadius: number,
) {
  const point = (radius: number, angle: number) => [
    118 + radius * Math.cos(angle),
    118 + radius * Math.sin(angle),
  ]
  const outerAngle = cornerRadius / outerRadius
  const innerAngle = cornerRadius / innerRadius
  const radialPoint = (radius: number, angle: number) => point(radius, angle)
  const outerStart = point(outerRadius, startAngle + outerAngle)
  const outerEnd = point(outerRadius, endAngle - outerAngle)
  const innerEnd = point(innerRadius, endAngle - innerAngle)
  const innerStart = point(innerRadius, startAngle + innerAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

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
  ].join(" ")
}

function OverviewV2DonutCard({
  title,
  segments,
  isRefreshing,
}: {
  title: string
  segments: Array<{
    label: string
    value: string
    color: string
    change?: string
    positive?: boolean
    share: number
  }>
  isRefreshing: boolean
}) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const hoveredAngle =
    hoveredSegment === null
      ? null
      : -Math.PI / 2 +
        ((segments
          .slice(0, hoveredSegment)
          .reduce((sum, segment) => sum + segment.share, 0) +
          (segments[hoveredSegment].share - 2) / 2) /
          100) *
          Math.PI *
          2
  const tooltipX = hoveredAngle === null ? 50 : 50 + Math.cos(hoveredAngle) * 44
  const tooltipY = hoveredAngle === null ? 50 : 50 + Math.sin(hoveredAngle) * 44
  const tooltipTransform =
    hoveredAngle === null
      ? "translate(-50%, -50%)"
      : Math.abs(Math.cos(hoveredAngle)) > Math.abs(Math.sin(hoveredAngle))
        ? `${
            Math.cos(hoveredAngle) > 0
              ? "translate(10px, -50%)"
              : "translate(calc(-100% - 10px), -50%)"
          }`
        : Math.sin(hoveredAngle) > 0
          ? "translate(-50%, 10px)"
          : "translate(-50%, calc(-100% - 10px))"
  let startShare = 0

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
      <div className="mb-[12px] flex items-center gap-[8px]">
        <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
          {title}
        </h3>
        <MetricMoreMenu onExportPng={() => {}} onViewMethodology={() => {}} />
        <InfoIcon tooltip={OVERVIEW_TOOLTIPS[title] ?? title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-[12px] lg:flex-row lg:items-center">
        <div className="relative grid size-[160px] shrink-0 place-items-center sm:size-[180px]">
          {isRefreshing ? (
            <div
              aria-label={`Loading ${title} chart`}
              className="skeleton size-[160px] rounded-full sm:size-[180px]"
              role="status"
            />
          ) : (
            <>
              <svg
                aria-label={`${title} breakdown`}
                className="size-full overflow-visible"
                role="group"
                viewBox="0 0 236 236"
              >
                {segments.map((segment, index) => {
                  const separatorShare = Math.min(1, segment.share / 4)
                  const startAngle =
                    -Math.PI / 2 +
                    ((startShare + separatorShare / 2) / 100) * Math.PI * 2
                  const endAngle =
                    -Math.PI / 2 +
                    ((startShare + segment.share - separatorShare / 2) / 100) *
                      Math.PI *
                      2
                  startShare += segment.share
                  return (
                    <path
                      key={segment.label}
                      aria-label={`${segment.label}: ${segment.value}`}
                      className="cursor-pointer transition-opacity hover:opacity-80 focus:opacity-80"
                      d={getRoundedDonutSegmentPath(
                        startAngle,
                        endAngle,
                        118,
                        88,
                        4,
                      )}
                      fill={segment.color}
                      onBlur={() => setHoveredSegment(null)}
                      onFocus={() => setHoveredSegment(index)}
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      role="button"
                      tabIndex={0}
                    />
                  )
                })}
              </svg>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute size-[120px] rounded-full bg-white sm:size-[134px]"
              />
              {hoveredSegment !== null && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute z-20 flex min-w-[160px] flex-col gap-[6px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] py-[10px] shadow-[0px_4px_8px_0px_rgba(18,18,18,0.1)]"
                  style={{
                    left: `${tooltipX}%`,
                    top: `${tooltipY}%`,
                    transform: tooltipTransform,
                  }}
                >
                  <span className="font-['Inter:Medium'] text-[12px] leading-[16px] text-[#22201f]">
                    {segments[hoveredSegment].label}
                  </span>
                  <span className="font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                    {segments[hoveredSegment].value}
                  </span>
                  {segments[hoveredSegment].change && (
                    <span className="font-['Inter:Regular'] text-[12px] leading-[16px] text-[#62615d]">
                      {segments[hoveredSegment].change}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          {isRefreshing
            ? segments.map((segment) => (
                <div
                  key={segment.label}
                  aria-hidden="true"
                  className="flex h-[20px] items-center gap-[6px]"
                >
                  <Sk w="w-[8px]" h="h-[8px]" />
                  <Sk w="w-[80px]" />
                  <Sk w="w-[32px]" />
                </div>
              ))
            : segments.map((segment) => (
                <div
                  key={segment.label}
                  className="flex min-w-0 items-center gap-[6px] text-[14px] leading-[20px]"
                >
                  <span
                    aria-hidden="true"
                    className="size-[8px] shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[#22201f]">
                    {segment.label}
                  </span>
                  <span className="shrink-0 font-['Inter:Medium'] text-[#22201f]">
                    {segment.value}
                  </span>
                  {segment.change && (
                    <span
                      className={`shrink-0 font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] ${
                        segment.positive ? "text-[#008e13]" : "text-[#8e1311]"
                      }`}
                    >
                      {segment.change}
                    </span>
                  )}
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

const RECONCILIATION_TABS = [
  "Reports",
  "Payment breakdown",
  "Sales",
  "Payments",
  "Tips",
  "Money in/out",
  "Adjustments",
]

const RECONCILIATION_ROWS = [
  {
    number: "0000235",
    site: "Amberley",
    staff: "Olivia Hartwell",
    date: "21 Oct",
    register: "Front POS",
    counted: "$500.00",
    recorded: "$1,141.87",
    variance: "−$641.87",
  },
  {
    number: "0000234",
    site: "Brambleton",
    staff: "Marcus Delgado",
    date: "21 Oct",
    register: "Front POS",
    counted: "$1,286.40",
    recorded: "$1,279.40",
    variance: "$7.00",
  },
  {
    number: "0000233",
    site: "Oakridge",
    staff: "Priya Nair",
    date: "21 Oct",
    register: "Coffee bar",
    counted: "$986.20",
    recorded: "$986.20",
    variance: "$0.00",
  },
  {
    number: "0000232",
    site: "Pinehollow",
    staff: "Tom Ashworth",
    date: "20 Oct",
    register: "Front POS",
    counted: "$742.80",
    recorded: "$750.00",
    variance: "−$7.20",
  },
  {
    number: "0000231",
    site: "Riverbend",
    staff: "Sophie Brennan",
    date: "20 Oct",
    register: "Coffee bar",
    counted: "$1,104.60",
    recorded: "$1,104.60",
    variance: "$0.00",
  },
  {
    number: "0000230",
    site: "Willowmere",
    staff: "Amy Tran",
    date: "20 Oct",
    register: "Front POS",
    counted: "$618.40",
    recorded: "$603.40",
    variance: "$15.00",
  },
  {
    number: "0000229",
    site: "Amberley",
    staff: "Olivia Hartwell",
    date: "19 Oct",
    register: "Coffee bar",
    counted: "$932.00",
    recorded: "$928.00",
    variance: "$4.00",
  },
]

function ReconciliationReport({
  selectedTaking,
  onSelectTaking,
  selectedSiteIds,
  selectedSites,
  siteLabel,
  selectedRegisters,
  registerLabel,
  showDeletedSites,
  includeDeletedRegisters,
  onToggleSite,
  onToggleRegister,
  onToggleShowDeletedSites,
  onToggleIncludeDeletedRegisters,
  onFiltersChanged,
}: {
  selectedTaking: typeof RECONCILIATION_ROWS[number] | null
  onSelectTaking: (taking: typeof RECONCILIATION_ROWS[number] | null) => void
  selectedSiteIds: string[]
  selectedSites: SiteOption[]
  siteLabel: string
  selectedRegisters: string[]
  registerLabel: string
  showDeletedSites: boolean
  includeDeletedRegisters: boolean
  onToggleSite: (id: string) => void
  onToggleRegister: (key: string) => void
  onToggleShowDeletedSites: () => void
  onToggleIncludeDeletedRegisters: () => void
  onFiltersChanged: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [activeTab, setActiveTab] = useState("Reports")
  const [detailTab, setDetailTab] = useState("Payment breakdown")
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [date, setDate] = useState("Last 7 days")
  const [staff, setStaff] = useState<string[]>([])
  const [salesPage, setSalesPage] = useState(1)
  const hasChangedFilters =
    date !== "Last 7 days" ||
    staff.length > 0 ||
    selectedSiteIds.length > 0 ||
    selectedRegisters.length > 0
  function resetFilters() {
    setDate("Last 7 days")
    setStaff([])
    onToggleSite("all")
    onToggleRegister("all")
    setOpenFilter(null)
    onSelectTaking(null)
  }
  useEffect(() => {
    onFiltersChanged(hasChangedFilters)
  }, [hasChangedFilters, onFiltersChanged])
  const isDetail = selectedTaking !== null
  const currentTab = isDetail ? detailTab : activeTab
  const isSalesTab = currentTab === "Sales"
  const isPaymentBreakdownTab = isDetail
    ? detailTab === "Payment breakdown"
    : activeTab === "Payment breakdown"
  const tabs = isDetail ? RECONCILIATION_TABS.slice(1) : RECONCILIATION_TABS
  const columns = isSalesTab
    ? [
        "Sale #",
        "Date / Time",
        "Site",
        "Register",
        "Staff",
        "Customer",
        "Net Amount",
        "Tax Amount",
        "Total",
        "View",
      ]
    : isPaymentBreakdownTab
      ? [
          "Payment Mean",
          "Payments",
          "- Returns",
          "+ Money In",
          "+ Tips",
          "- Money Out",
          "= Recorded",
          "Counted",
          "Variance",
        ]
      : isDetail
        ? [
            "Payment mean",
            "Payments",
            "Returns",
            "Money in",
            "Tips",
            "Money out",
            "Recorded",
            "Counted",
            "Variance",
          ]
        : [
            "Number",
            "Site",
            "Staff",
            "Date",
            "Register",
            "Counted",
            "Recorded",
            "Variance",
            "",
          ]
  const reconciliationRegistersBySite = Object.fromEntries(
    SITE_OPTIONS.slice(1).map((siteOption) => [
      siteOption.id,
      [
        ...new Set(
          RECONCILIATION_ROWS.filter(
            (row) => row.site === siteOption.name.split(" – ")[0],
          ).map((row) => row.register),
        ),
      ],
    ]),
  )
  const registerSites =
    selectedSites.length > 0
      ? selectedSites
      : SITE_OPTIONS.slice(1).filter(
          (siteOption) => showDeletedSites || !siteOption.deleted,
        )
  const rows = RECONCILIATION_ROWS.filter((row) => {
    const rowSite = SITE_OPTIONS.find(
      (siteOption) => siteOption.name.split(" – ")[0] === row.site,
    )
    return (
      (!selectedSiteIds.length ||
        selectedSiteIds.includes(rowSite?.id ?? "")) &&
      (!staff.length || staff.includes(row.staff)) &&
      (!selectedRegisters.length ||
        selectedRegisters.includes(`${rowSite?.id}:${row.register}`))
    )
  })
  const reconciliationSalesRows = TRANSACTION_ROWS.slice(0, 28)
  const paymentBreakdownRows = [
    [
      "Account Credit",
      "$1,620.00",
      "$0.00",
      "$0.00",
      "$0.00",
      "$-1,000.00",
      "$620.00",
      "$620.00",
      "$0.00",
    ],
    [
      "Cash",
      "$989.60",
      "$-32.40",
      "$1,000.00",
      "$0.00",
      "$0.00",
      "$1,957.20",
      "$400.00",
      "$-1,557.20",
    ],
    [
      "Manual eftpos",
      "$244.00",
      "$0.00",
      "$0.00",
      "$0.00",
      "$0.00",
      "$244.00",
      "$0.00",
      "$-244.00",
    ],
  ]
  const paymentBreakdownTotals = [
    "Total",
    "$2,853.60",
    "$-32.40",
    "$1,000.00",
    "$0.00",
    "$-1,000.00",
    "$2,821.20",
    "$1,020.00",
    "$-1,801.20",
  ]
  const staffOptions = [...new Set(RECONCILIATION_ROWS.map((row) => row.staff))]
  const staffLabel =
    staff.length === 0
      ? "Any"
      : staff.length === 1
        ? staff[0]
        : `${staff.length} selected`

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto p-[16px] sm:p-[24px]">
      {isDetail ? (
        <div className="mb-[24px] flex flex-wrap items-center gap-[8px]">
          <div className="flex flex-1 flex-wrap items-center gap-[8px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]">
            {[
              "Date, time",
              selectedTaking.date,
              "Site Name",
              selectedTaking.site,
              "Register Name",
              selectedTaking.register,
              "Staff Name",
              selectedTaking.staff,
            ].map(
              (item, index) =>
                index % 2 === 0 && (
                  <span key={item} className="flex items-center gap-[8px]">
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-[20px] w-px bg-[#e3e2dd]"
                      />
                    )}
                    {item}
                  </span>
                ),
            )}
          </div>
          {hasChangedFilters && (
            <ActionButton
              variant="text"
              size="slim"
              className="!h-auto !px-0 hover:!bg-transparent"
              onClick={resetFilters}
            >
              Reset
            </ActionButton>
          )}
        </div>
      ) : (
        <>
          <div className="mb-[24px] flex flex-wrap items-center gap-[8px]">
            <div className="relative">
              <DefaultFilterChip
                label="Date"
                value={date}
                onClick={() =>
                  setOpenFilter((current) =>
                    current === "Date" ? null : "Date",
                  )
                }
              />
              {openFilter === "Date" && (
                <OptionsDropdown
                  options={[
                    "Today",
                    "Yesterday",
                    "Last 7 days",
                    "Week to date",
                  ]}
                  selected={date}
                  onSelect={setDate}
                  onClose={() => setOpenFilter(null)}
                  width={200}
                />
              )}
            </div>
            <div className="relative">
              <DefaultFilterChip
                label="Site"
                value={siteLabel}
                valueClassName={
                  selectedSites.length === 1 ? "max-w-[145px]" : ""
                }
                onClick={() =>
                  setOpenFilter((current) =>
                    current === "Site" ? null : "Site",
                  )
                }
              />
              {openFilter === "Site" && (
                <SiteDropdown
                  selectedIds={selectedSiteIds}
                  onToggle={onToggleSite}
                  onClose={() => setOpenFilter(null)}
                  showDeletedSites={showDeletedSites}
                  onToggleShowDeletedSites={onToggleShowDeletedSites}
                />
              )}
            </div>
            <div className="relative">
              <DefaultFilterChip
                label="Register"
                value={registerLabel}
                onClick={() =>
                  setOpenFilter((current) =>
                    current === "Register" ? null : "Register",
                  )
                }
              />
              {openFilter === "Register" && (
                <RegisterDropdown
                  selectedSites={registerSites}
                  selectedRegisters={selectedRegisters}
                  onToggle={onToggleRegister}
                  onClose={() => setOpenFilter(null)}
                  searchable
                  includeDeletedRegisters={includeDeletedRegisters}
                  onToggleIncludeDeletedRegisters={
                    onToggleIncludeDeletedRegisters
                  }
                  registersBySite={reconciliationRegistersBySite}
                />
              )}
            </div>
            <div className="relative">
              <DefaultFilterChip
                label="Staff"
                value={staffLabel}
                onClick={() =>
                  setOpenFilter((current) =>
                    current === "Staff" ? null : "Staff",
                  )
                }
              />
              {openFilter === "Staff" && (
                <MultiSelectDropdown
                  title="Staff"
                  options={staffOptions}
                  selected={staff}
                  onApply={setStaff}
                  onClose={() => setOpenFilter(null)}
                  searchable
                />
              )}
            </div>
            {hasChangedFilters && (
              <ActionButton
                variant="text"
                size="slim"
                className="!h-auto !px-0 hover:!bg-transparent"
                onClick={resetFilters}
              >
                Reset
              </ActionButton>
            )}
          </div>
          <div className="mb-[24px] grid grid-cols-1 gap-[12px] sm:grid-cols-3">
            {[
              [
                "Number of reconciliations",
                "26",
                "How many register reconciliations were completed in the selected date range, across the sites, registers and staff you’ve filtered to.",
              ],
              [
                "Counted amount",
                "$500.00",
                "The total cash your team counted in the registers when they reconciled. This is the physical count, not what the system expected to be there.",
              ],
              [
                "Variance",
                "−$641.87",
                "The difference between the amount counted and the amount the system expected. A negative number means there was less cash than expected (a shortage). A positive number means there was more (an overage).",
              ],
            ].map(([label, value, tooltip]) => (
              <section
                key={label}
                className="flex h-[92px] flex-col justify-between rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] pt-[16px] pb-[12px]"
              >
                <div className="flex items-center justify-between gap-[8px]">
                  <span className="font-['Inter:Regular'] text-[12px] leading-[16px] text-[#62615d]">
                    {label}
                  </span>
                  <InfoIcon tooltip={tooltip} />
                </div>
                <strong className="font-['Inter:Semibold'] text-[24px] leading-[32px] text-[#22201f]">
                  {value}
                </strong>
              </section>
            ))}
          </div>
        </>
      )}
      <div className="min-w-0 overflow-x-auto">
        <div
          role="tablist"
          aria-label={isDetail ? "Taking breakdown" : "Reconciliation reports"}
          className="flex min-w-max items-end gap-[12px]"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={currentTab === tab}
              onClick={() => (isDetail ? setDetailTab(tab) : setActiveTab(tab))}
              className={`relative flex h-[36px] items-center border-b-2 border-transparent px-0 font-['Inter:Medium'] text-[14px] leading-[20px] ${
                currentTab === tab
                  ? "text-[#22201f]"
                  : "text-[#62615d] hover:text-[#22201f]"
              }`}
            >
              {tab}
              {currentTab === tab && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[-2px] h-[2px] bg-[#22201f]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-[16px] w-full min-w-0">
        <div className="w-full min-w-0 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white">
          <div
            className={`w-full min-w-0 ${
              isPaymentBreakdownTab ? "overflow-hidden" : "overflow-x-auto"
            }`}
          >
            <table
              className={`w-full table-fixed border-collapse text-left ${
                isPaymentBreakdownTab ? "min-w-0" : "min-w-[1206px]"
              } [&_th:first-child]:pl-[16px] [&_td:first-child]:pl-[16px] [&_th:last-child]:pr-[16px] [&_td:last-child]:pr-[16px]`}
            >
              <colgroup>
                {isSalesTab ? (
                  <>
                    {[11, 14, 13, 10, 9, 10, 9, 8, 8, 8].map((width, index) => (
                      <col key={index} style={{ width: `${width}%` }} />
                    ))}
                  </>
                ) : isPaymentBreakdownTab ? (
                  <>
                    <col className="w-[16%]" />
                    {Array.from({ length: 8 }, (_, index) => (
                      <col key={index} className="w-[10.5%]" />
                    ))}
                  </>
                ) : isDetail ? (
                  <>
                    <col className="w-[187px]" />
                    {Array.from({ length: 8 }, (_, index) => (
                      <col key={index} className="w-[123.375px]" />
                    ))}
                  </>
                ) : (
                  <>
                    <col className="w-[123px]" />
                    <col className="w-[180px]" />
                    <col className="w-[179px]" />
                    {Array.from({ length: 5 }, (_, index) => (
                      <col key={index} className="w-[125.6px]" />
                    ))}
                    <col className="w-[96px]" />
                  </>
                )}
              </colgroup>
              <thead className="font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]">
                <tr className="h-[40px] border-b border-[#e3e2dd] bg-[#f9f8f4]">
                  {columns.map((column, index) => (
                    <th
                      key={`${column}-${index}`}
                      scope="col"
                      className={`px-[8px] py-[6px] text-left font-medium ${
                        isPaymentBreakdownTab
                          ? "whitespace-normal break-words"
                          : "whitespace-nowrap"
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]">
                {isSalesTab
                  ? reconciliationSalesRows
                      .slice((salesPage - 1) * 10, salesPage * 10)
                      .map((row) => (
                        <tr
                          key={row.saleNumber}
                          className="h-[48px] border-b border-[#e3e2dd] last:border-b-0"
                        >
                          {[
                            row.saleNumber,
                            row.dateTime,
                            row.site,
                            row.register,
                            row.operator,
                            row.customer,
                            row.netAmount,
                            row.taxAmount,
                            row.total,
                          ].map((value, index) => (
                            <td
                              key={`${row.saleNumber}-${index}`}
                              className={`truncate whitespace-nowrap px-[8px] py-[6px] ${
                                index >= 6 ? "text-right" : "text-left"
                              }`}
                            >
                              {value}
                            </td>
                          ))}
                          <td className="px-[4px] text-center">
                            <button
                              type="button"
                              className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                  : isPaymentBreakdownTab
                    ? paymentBreakdownRows.map((row) => (
                        <tr
                          key={row[0]}
                          className="h-[48px] border-b border-[#e3e2dd] last:border-b-0"
                        >
                          {row.map((value, index) => (
                            <td
                              key={`${row[0]}-${index}`}
                              className="break-all px-[8px] py-[6px] text-left"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))
                    : (isDetail ? rows.slice(0, 4) : rows).map(
                        (row, rowIndex) => (
                          <tr
                            key={row.number}
                            className="h-[48px] border-b border-[#e3e2dd] last:border-b-0"
                          >
                            {isDetail ? (
                              [
                                "Value",
                                "Value",
                                "Value",
                                "Value",
                                "Value",
                                "Value",
                                "Value",
                                "Value",
                                "Value",
                              ].map((value, index) => (
                                <td
                                  key={`${row.number}-${index}`}
                                  className="truncate whitespace-nowrap px-[8px] py-[6px]"
                                >
                                  {value}
                                </td>
                              ))
                            ) : (
                              <>
                                {[
                                  row.number,
                                  row.site,
                                  row.staff,
                                  row.date,
                                  row.register,
                                  rowIndex === 0 ? "Value" : row.counted,
                                  rowIndex === 0 ? "Value" : row.recorded,
                                  rowIndex === 0 ? "Value" : row.variance,
                                ].map((value, index) => (
                                  <td
                                    key={`${row.number}-${index}`}
                                    className="truncate whitespace-nowrap px-[8px] py-[6px]"
                                  >
                                    {value}
                                  </td>
                                ))}
                                <td className="pl-[4px] pr-[12px] text-center">
                                  <button
                                    type="button"
                                    onClick={() => onSelectTaking(row)}
                                    className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                                  >
                                    View
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ),
                      )}
                {isSalesTab ? (
                  <tr className="h-[48px] border-t border-[#e3e2dd] bg-[#f9f8f4] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                    <td className="px-[8px] py-[6px]">Total</td>
                    <td colSpan={5} />
                    {["netAmount", "taxAmount", "total"].map((key) => {
                      const total = reconciliationSalesRows.reduce(
                        (sum, row) =>
                          sum +
                          Number(
                            row[
                              (key as "netAmount" | "taxAmount" | "total")
                            ].replace(/[$,]/g, ""),
                          ),
                        0,
                      )
                      return (
                        <td key={key} className="px-[8px] py-[6px] text-right">
                          $
                          {total.toLocaleString("en-AU", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      )
                    })}
                    <td />
                  </tr>
                ) : isPaymentBreakdownTab ? (
                  <tr className="h-[48px] border-t border-[#e3e2dd] bg-[#f9f8f4] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                    {paymentBreakdownTotals.map((value, index) => (
                      <td
                        key={`total-${index}`}
                        className="break-all px-[8px] py-[6px] text-left"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ) : (
                  !isDetail && (
                    <tr className="h-[48px] border-t border-[#e3e2dd] bg-[#f9f8f4] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                      <td colSpan={5} className="px-[8px] py-[6px]">
                        Total
                      </td>
                      <td className="px-[8px] py-[6px]">Value</td>
                      <td className="px-[8px] py-[6px]">Value</td>
                      <td className="px-[8px] py-[6px]">Value</td>
                      <td />
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isSalesTab && (
          <div className="flex items-center justify-between px-[8px] pt-[8px]">
            <span className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
              {`${(salesPage - 1) * 10 + 1}-${Math.min(salesPage * 10, reconciliationSalesRows.length)} of ${reconciliationSalesRows.length} items`}
            </span>
            <div className="flex items-center gap-[4px]">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-label={`Page ${page}`}
                  aria-current={salesPage === page ? "page" : undefined}
                  onClick={() => setSalesPage(page)}
                  className={`flex size-[36px] items-center justify-center rounded-[6px] font-['Inter:Medium'] text-[14px] ${
                    salesPage === page
                      ? "bg-[#45484e] text-white"
                      : "text-[#22201f] hover:bg-[#f9f8f4]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OverviewV2RankedCard({
  title,
  headline,
  detail,
  trend,
  rows,
  compareLabel,
  showComparison,
  onSeeMore,
}: {
  title: string
  headline: string
  detail: string
  trend: string
  rows: Array<{ name: string value: string change: string positive: boolean }>
  compareLabel: string
  showComparison: boolean
  onSeeMore: () => void
}) {
  return (
    <section className="flex h-full min-w-0 flex-1 flex-col rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
      <div className="mb-[12px] flex items-center gap-[8px]">
        <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
          {title}
        </h3>
        <InfoIcon tooltip={OVERVIEW_TOOLTIPS[title] ?? title} />
      </div>
      <div className="mb-[12px]">
        <p className="truncate font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#22201f]">
          {headline}
        </p>
        <div className="mt-[2px] flex items-center gap-[6px] text-[14px] leading-[20px] text-[#62615d]">
          <span>{detail}</span>
          <span
            className={`font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] ${
              trend.startsWith("+") ? "text-[#008e13]" : "text-[#8e1311]"
            }`}
          >
            {trend}
          </span>
          {showComparison && (
            <span className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
              vs {lowercaseFirstLetter(compareLabel)}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex h-[44px] min-w-0 shrink-0 items-center gap-[6px] border-b border-[#e3e2dd] px-[6px] last:border-b-0"
          >
            <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">
              {row.name}
            </span>
            <span className="w-[48px] shrink-0 text-right font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
              {row.value}
            </span>
            <span
              className={`w-[56px] shrink-0 text-right font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] ${
                row.positive ? "text-[#008e13]" : "text-[#8e1311]"
              }`}
            >
              {row.change}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onSeeMore}
        className="mt-auto pt-[10px] text-left font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline"
      >
        Drill in
      </button>
    </section>
  )
}

function OverviewV2Dashboard({
  isRefreshing,
  compareLabel,
  showComparison,
  selectProductSales,
  visibleWidgets,
  onHourlySalesDrillIn,
}: {
  isRefreshing: boolean
  compareLabel: string
  showComparison: boolean
  selectProductSales: (dimension: string) => void
  visibleWidgets: string[]
  onHourlySalesDrillIn: () => void
}) {
  const [widgetOrder, setWidgetOrder] = useState(defaultOverviewWidgetOrder)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const kpis = [
    {
      label: "Total sales",
      value: "$4,182.60",
      change: "+12.4%",
      positive: true,
    },
    { label: "Orders", value: "241", change: "−12.4%", positive: false },
    {
      label: "Average order value",
      value: "$17.35",
      change: "+6.2%",
      positive: true,
    },
    {
      label: "Top selling product",
      value: "Latte",
      change: "−3.1%",
      positive: false,
    },
  ]
  const topCards = [
    {
      title: "Sales by products",
      headline: "Latte",
      detail: "82 sold ·",
      trend: "+3.3%",
      rows: [
        { name: "Latte", value: "82", change: "+3.3%", positive: true },
        { name: "Flat White", value: "67", change: "−5.7%", positive: false },
        {
          name: "Plain Croissant",
          value: "32",
          change: "+7.8%",
          positive: true,
        },
        { name: "Cappuccino", value: "31", change: "+12.1%", positive: true },
        { name: "Banana Bread", value: "16", change: "−6.8%", positive: false },
        {
          name: "Choc Chip Muffin",
          value: "9",
          change: "+6.4%",
          positive: true,
        },
      ],
      dimension: "Product",
    },
    {
      title: "Sales by categories",
      headline: "Coffee",
      detail: "125 sold ·",
      trend: "+11.6%",
      rows: [
        { name: "Coffee", value: "125", change: "+11.6%", positive: true },
        { name: "Pastries", value: "67", change: "+7.1%", positive: true },
        { name: "Sweets", value: "32", change: "−15.7%", positive: false },
        { name: "Toasties", value: "31", change: "−5.7%", positive: false },
        { name: "Other drinks", value: "16", change: "+2.0%", positive: true },
      ],
      dimension: "Category",
    },
    {
      title: "Sales by reporting groups",
      headline: "Drinks",
      detail: "187 sold ·",
      trend: "−11.4%",
      rows: [
        { name: "Drinks", value: "187", change: "−11.4%", positive: false },
        { name: "Food", value: "24", change: "+9.2%", positive: true },
        { name: "Other", value: "12", change: "−15.7%", positive: false },
      ],
      dimension: "Reporting group",
    },
  ]
  const tables = [
    {
      key: "sales-by-site",
      title: "Sales by site",
      rows: [
        ["Amberley – The Coffee Company", "$4,356.39", "+3.3%"],
        ["Brambleton – The Coffee Company", "$2,764.40", "−5.7%"],
        ["Copperfield – The Coffee Company", "$2,661.29", "+7.8%"],
        ["Foxglove – The Coffee Company", "$2,045.94", "+12.1%"],
        ["Mossgate – The Coffee Company", "$1,613.69", "−8.8%"],
        ["Pinehollow – The Coffee Company", "$914.10", "−8.6%"],
      ] as const,
      dimension: "Site",
    },
    {
      key: "sales-closed-by-staff",
      title: "Sales by staff (closed)",
      rows: [
        ["Olivia Hartwell", "$614.10", "—"],
        ["Marcus Delgado", "$607.28", "+3.3%"],
        ["Priya Nair", "$547.45", "−5.7%"],
        ["Tom Ashworth", "$476.32", "—"],
        ["Sophie Brennan", "$318.79", "+3.3%"],
        ["Amy Tran", "$304.49", "—"],
      ] as const,
      dimension: "Staff",
    },
  ]
  const chartSegments = {
    "Sales by order source": [
      {
        label: "Bopple",
        value: "$1,842.60",
        color: REPORT_CHART_COLORS.primary,
        share: 33,
      },
      {
        label: "Uber Eats",
        value: "$1,426.80",
        color: REPORT_CHART_COLORS.secondary,
        share: 26,
      },
      {
        label: "DoorDash",
        value: "$986.40",
        color: REPORT_CHART_COLORS.tertiary,
        share: 18,
      },
      {
        label: "Lightspeed Online",
        value: "$742.20",
        color: REPORT_CHART_COLORS.quaternary,
        share: 13,
      },
      {
        label: "Deliveroo",
        value: "$518.50",
        color: REPORT_CHART_COLORS.other,
        share: 10,
      },
    ],
  }
  const widgets: Record<string, React.ReactNode> = {
    "hourly-sales": (
      <WidgetCard className="w-full">
        <div className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
          <div className="mb-[8px] flex items-center gap-[8px]">
            <h3 className="min-w-0 flex-1 font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
              Hourly sales
            </h3>
            <MetricMoreMenu
              onExportPng={() => {}}
              onViewMethodology={() => {}}
            />
            <InfoIcon tooltip={OVERVIEW_TOOLTIPS["Hourly sales"]} />
          </div>
          <HourlySalesChart
            compareLabel={compareLabel}
            showComparison={showComparison}
            isRefreshing={isRefreshing}
            largeLabels
          />
          <button
            type="button"
            onClick={onHourlySalesDrillIn}
            className="mt-[12px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline"
          >
            Drill in
          </button>
        </div>
      </WidgetCard>
    ),
    ...Object.fromEntries(
      overviewV2Donuts.map((chart) => [
        chart.title === "Payment methods" ? "payment-methods" : "order-types",
        <OverviewV2DonutCard {...chart} isRefreshing={isRefreshing} />,
      ]),
    ),
    "order-source": (
      <OverviewV2DonutCard
        title="Sales by order source"
        isRefreshing={isRefreshing}
        segments={chartSegments["Sales by order source"]}
      />
    ),
    ...Object.fromEntries(
      topCards.map((card, index) => [
        ["top-product", "top-category", "top-reporting-group"][index],
        <OverviewV2RankedCard
          {...card}
          compareLabel={compareLabel}
          showComparison={showComparison}
          onSeeMore={() => selectProductSales(card.dimension)}
        />,
      ]),
    ),
    ...Object.fromEntries(
      tables.map((table) => [
        table.key,
        <section className="flex h-full w-full min-w-0 flex-col rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
          <div className="mb-[12px] flex items-center gap-[8px]">
            <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
              {table.title}
            </h3>
            <InfoIcon tooltip={OVERVIEW_TOOLTIPS[table.title] ?? table.title} />
          </div>
          <div className="mb-[12px]">
            <p className="truncate font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#22201f]">
              {table.rows[0][0]}
            </p>
            <div className="mt-[2px] flex flex-wrap items-center gap-[6px] text-[14px] leading-[20px] text-[#62615d]">
              <span className="font-['Inter:Regular'] text-[#62615d]">
                {table.rows[0][1]}
              </span>
              {table.rows[0][2] !== "—" && (
                <>
                  <span
                    aria-hidden="true"
                    className="font-['Inter:Regular'] text-[#62615d]"
                  >
                    ·
                  </span>
                  <span
                    className={`font-['Inter:Semibold'] font-semibold ${
                      table.rows[0][2].startsWith("+")
                        ? "text-[#008e13]"
                        : "text-[#8e1311]"
                    }`}
                  >
                    {table.rows[0][2]}
                  </span>
                </>
              )}
              {showComparison && (
                <span className="font-['Inter:Regular'] text-[#62615d]">
                  vs {lowercaseFirstLetter(compareLabel)}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {table.rows.map(([name, value, change]) => (
              <div
                key={name}
                className="flex h-[44px] min-w-0 shrink-0 items-center gap-[8px] border-b border-[#e3e2dd] px-[6px] last:border-b-0"
              >
                <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">
                  {name}
                </span>
                <span className="shrink-0 font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                  {value}
                </span>
                <span
                  className={`w-[56px] shrink-0 text-center font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] ${
                    change.startsWith("+")
                      ? "text-[#008e13]"
                      : change === "—"
                        ? "text-[#62615d]"
                        : "text-[#8e1311]"
                  }`}
                >
                  {change}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => selectProductSales(table.dimension)}
            className="mt-[6px] block w-fit self-start text-left font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline"
          >
            Drill in
          </button>
        </section>,
      ]),
    ),
    discounts: (
      <section className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
        <h3 className="mb-[12px] font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
          Sales by discounts
        </h3>
        <div className="flex flex-col">
          {[
            ["Loyalty reward", "$1,284.20", "31 orders"],
            ["Happy hour", "$846.50", "24 orders"],
            ["Staff discount", "$218.40", "12 orders"],
          ].map(([name, value, orders]) => (
            <div
              key={name}
              className="flex min-h-[44px] items-center gap-[8px] border-b border-[#e3e2dd] px-[6px] last:border-b-0"
            >
              <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">
                {name}
              </span>
              <span className="font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                {value}
              </span>
              <span className="w-[72px] text-right text-[12px] leading-[16px] text-[#62615d]">
                {orders}
              </span>
            </div>
          ))}
        </div>
      </section>
    ),
    "tax-rates": (
      <section className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
        <h3 className="mb-[12px] font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
          Sales by tax rate
        </h3>
        <div className="flex flex-col gap-[8px]">
          {[
            ["Standard rate", "10%", "$3,245.80"],
            ["Reduced rate", "5%", "$724.60"],
            ["Zero rate", "0%", "$212.20"],
          ].map(([name, rate, value]) => (
            <div
              key={name}
              className="flex items-center justify-between gap-[8px] rounded-[8px] bg-[#f9f8f4] p-[12px]"
            >
              <span className="text-[12px] leading-[16px] text-[#62615d]">
                {name} · {rate}
              </span>
              <span className="font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#22201f]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
    ),
  }
  const reorderableWidgetKeys = widgetOrder.filter(
    (key) =>
      widgets[key] &&
      (key === "payment-methods" || key === "order-types"
        ? visibleWidgets.includes("breakdowns")
        : key === "top-product" ||
            key === "top-category" ||
            key === "top-reporting-group"
          ? visibleWidgets.includes("top-products")
          : visibleWidgets.includes(key)),
  )
  const renderWidget = (key: string) => (
    <div
      key={key}
      draggable
      onDragStart={(event) => {
        setDraggedWidget(key)
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", key)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
      }}
      onDrop={(event) => {
        event.preventDefault()
        const sourceKey =
          event.dataTransfer.getData("text/plain") || draggedWidget
        if (!sourceKey || sourceKey === key) return
        setWidgetOrder((current) => {
          const next = [...current]
          const sourceIndex = next.indexOf(sourceKey)
          const targetIndex = next.indexOf(key)
          if (sourceIndex < 0 || targetIndex < 0) return current
          next.splice(sourceIndex, 1)
          next.splice(next.indexOf(key), 0, sourceKey)
          return next
        })
        setDraggedWidget(null)
      }}
      onDragEnd={() => setDraggedWidget(null)}
      role="group"
      aria-label={`Drag to reorder ${key}`}
      aria-roledescription="Draggable dashboard widget"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
        event.preventDefault()
        setWidgetOrder((current) => {
          const index = current.indexOf(key)
          const targetIndex = index + (event.key === "ArrowUp" ? -1 : 1)
          if (index < 0 || targetIndex < 0 || targetIndex >= current.length)
            return current
          const next = [...current]
          ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
          return next
        })
      }}
      className={`group/widget relative flex w-full min-w-0 cursor-grab items-stretch active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#1e72c4] ${
        key === "hourly-sales"
          ? "col-span-1 sm:col-span-6"
          : key === "payment-methods" || key === "order-types"
            ? "col-span-1 sm:col-span-3"
            : "col-span-1 sm:col-span-2"
      } ${draggedWidget === key ? "opacity-40" : ""}`}
      style={{ order: widgetOrder.indexOf(key) }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[12px] top-0 z-10 flex -translate-y-1/2 items-center rounded-[4px] bg-white px-[4px] py-[2px] text-[#85837e] opacity-0 transition-opacity group-hover/widget:opacity-100"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="4" cy="2" r="1" />
          <circle cx="8" cy="2" r="1" />
          <circle cx="4" cy="6" r="1" />
          <circle cx="8" cy="6" r="1" />
          <circle cx="4" cy="10" r="1" />
          <circle cx="8" cy="10" r="1" />
        </svg>
      </span>
      {widgets[key]}
    </div>
  )

  return (
    <div className="flex w-full flex-col gap-[12px] sm:gap-[16px]">
      {visibleWidgets.includes("kpis") && (
        <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-4 sm:gap-[12px]">
          {kpis.map((kpi) => (
            <section
              key={kpi.label}
              className="flex min-w-0 flex-col gap-[10px] rounded-[12px] border border-[#e3e2dd] bg-white p-[16px] sm:h-[120px] sm:justify-between sm:gap-0"
            >
              <div className="flex items-center gap-[6px]">
                <span className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
                  {kpi.label}
                </span>
                <InfoIcon tooltip={OVERVIEW_TOOLTIPS[kpi.label] ?? kpi.label} />
              </div>
              <div className="flex min-w-0 flex-col items-start gap-[4px]">
                <span className="truncate font-['Inter:Semibold'] text-[24px] leading-[32px] text-[#22201f]">
                  {isRefreshing ? <Sk w="w-[72px]" /> : kpi.value}
                </span>
                {showComparison && (
                  <div className="flex items-center gap-[6px]">
                    <span
                      className={`font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] ${
                        kpi.positive ? "text-[#008e13]" : "text-[#8e1311]"
                      }`}
                    >
                      {kpi.change}
                    </span>
                    <span className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
                      vs {lowercaseFirstLetter(compareLabel)}
                    </span>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="grid w-full grid-flow-row-dense grid-cols-1 items-stretch gap-[12px] sm:grid-cols-6 sm:gap-[16px]">
        {reorderableWidgetKeys.map(renderWidget)}
      </div>

      {false && visibleWidgets.includes("hourly-sales") && (
        <WidgetCard className="w-full">
          <div className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
            <div className="mb-[8px] flex items-center gap-[8px]">
              <h3 className="min-w-0 flex-1 font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
                Hourly sales
              </h3>
              <MetricMoreMenu
                onExportPng={() => {}}
                onViewMethodology={() => {}}
              />
              <InfoIcon tooltip="Hourly sales compared with the previous period" />
            </div>
            <HourlySalesChart
              compareLabel={compareLabel}
              showComparison={showComparison}
              isRefreshing={isRefreshing}
              largeLabels
            />
            <button
              type="button"
              onClick={onHourlySalesDrillIn}
              className="mt-[12px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline"
            >
              Drill in
            </button>
          </div>
        </WidgetCard>
      )}

      {false && visibleWidgets.includes("breakdowns") && (
        <div className="grid grid-cols-1 items-stretch gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
          {overviewV2Donuts.map((chart) => (
            <OverviewV2DonutCard
              key={chart.title}
              {...chart}
              isRefreshing={isRefreshing}
            />
          ))}
        </div>
      )}

      {false && visibleWidgets.includes("top-products") && (
        <div className="grid grid-cols-1 items-stretch gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
          {topCards.map((card) => (
            <OverviewV2RankedCard
              key={card.title}
              {...card}
              compareLabel={compareLabel}
              showComparison={showComparison}
              onSeeMore={() => selectProductSales(card.dimension)}
            />
          ))}
        </div>
      )}

      {false &&
        (tables.some((table) => visibleWidgets.includes(table.key)) ||
          visibleWidgets.includes("order-source")) && (
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
            {tables
              .filter((table) => visibleWidgets.includes(table.key))
              .map((table) => (
                <section
                  key={table.title}
                  className="min-w-0 rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]"
                >
                  <div className="mb-[12px] flex items-center gap-[8px]">
                    <h3 className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
                      {table.title}
                    </h3>
                    <InfoIcon
                      tooltip={OVERVIEW_TOOLTIPS[table.title] ?? table.title}
                    />
                  </div>
                  <div className="mb-[12px]">
                    <p className="truncate font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#22201f]">
                      {table.rows[0][0]}
                    </p>
                    <div className="mt-[2px] flex flex-wrap items-center gap-[6px] text-[14px] leading-[20px]">
                      <span className="font-['Inter:Semibold'] text-[#22201f]">
                        {table.rows[0][1]}
                      </span>
                      {table.rows[0][2] !== "—" && (
                        <span
                          className={`font-['Inter:Semibold'] font-semibold ${
                            table.rows[0][2].startsWith("+")
                              ? "text-[#008e13]"
                              : "text-[#8e1311]"
                          }`}
                        >
                          {table.rows[0][2]}
                        </span>
                      )}
                      {showComparison && (
                        <span className="font-['Inter:Regular'] text-[#62615d]">
                          vs {lowercaseFirstLetter(compareLabel)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {table.rows.map(([name, value, change]) => (
                      <div
                        key={name}
                        className="flex h-[44px] min-w-0 shrink-0 items-center gap-[8px] border-b border-[#e3e2dd] px-[6px] last:border-b-0"
                      >
                        <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">
                          {name}
                        </span>
                        <span className="shrink-0 font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                          {value}
                        </span>
                        <span
                          className={`w-[56px] shrink-0 text-center font-['Inter:Semibold'] font-semibold text-[14px] leading-[20px] ${
                            change.startsWith("+")
                              ? "text-[#008e13]"
                              : change === "—"
                                ? "text-[#62615d]"
                                : "text-[#8e1311]"
                          }`}
                        >
                          {change}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => selectProductSales(table.dimension)}
                    className="mt-[6px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#1e72c4] hover:underline"
                  >
                    Drill in
                  </button>
                </section>
              ))}
            {visibleWidgets.includes("order-source") && (
              <OverviewV2DonutCard
                title="Sales by order source"
                isRefreshing={isRefreshing}
                segments={[
                  {
                    label: "Bopple",
                    value: "$1,842.60",
                    color: REPORT_CHART_COLORS.primary,
                    share: 33,
                  },
                  {
                    label: "Uber Eats",
                    value: "$1,426.80",
                    color: REPORT_CHART_COLORS.secondary,
                    share: 26,
                  },
                  {
                    label: "DoorDash",
                    value: "$986.40",
                    color: REPORT_CHART_COLORS.tertiary,
                    share: 18,
                  },
                  {
                    label: "Lightspeed Online",
                    value: "$742.20",
                    color: REPORT_CHART_COLORS.quaternary,
                    share: 13,
                  },
                  {
                    label: "Deliveroo",
                    value: "$518.50",
                    color: REPORT_CHART_COLORS.other,
                    share: 10,
                  },
                ]}
              />
            )}
          </div>
        )}

      {false && visibleWidgets.includes("discounts") && (
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
          <section className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
            <h3 className="mb-[12px] font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
              Sales by discounts
            </h3>
            <div className="flex flex-col">
              {[
                ["Loyalty reward", "$1,284.20", "31 orders"],
                ["Happy hour", "$846.50", "24 orders"],
                ["Staff discount", "$218.40", "12 orders"],
              ].map(([name, value, orders]) => (
                <div
                  key={name}
                  className="flex min-h-[44px] items-center gap-[8px] border-b border-[#e3e2dd] px-[6px] last:border-b-0"
                >
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-[20px] text-[#22201f]">
                    {name}
                  </span>
                  <span className="font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                    {value}
                  </span>
                  <span className="w-[72px] text-right text-[12px] leading-[16px] text-[#62615d]">
                    {orders}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {false && visibleWidgets.includes("tax-rates") && (
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
          <section className="rounded-[12px] border border-[#e3e2dd] bg-white p-[16px]">
            <h3 className="mb-[12px] font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
              Sales by tax rate
            </h3>
            <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-3">
              {[
                ["Standard rate", "10%", "$3,245.80"],
                ["Reduced rate", "5%", "$724.60"],
                ["Zero rate", "0%", "$212.20"],
              ].map(([name, rate, value]) => (
                <div
                  key={name}
                  className="flex flex-col gap-[8px] rounded-[8px] bg-[#f9f8f4] p-[12px]"
                >
                  <span className="text-[12px] leading-[16px] text-[#62615d]">
                    {name} · {rate}
                  </span>
                  <span className="font-['Inter:Semibold'] text-[20px] leading-[28px] text-[#22201f]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function Sidebar({
  activeReport,
  onSelectReport,
}: {
  activeReport: ReportName
  onSelectReport: (report: ReportName) => void
}) {
  return (
    <div className="flex flex-col gap-[12px] h-screen items-start p-[8px] shrink-0 w-[200px] bg-[#f9f8f4] sticky top-0">
      {/* Back Office header */}
      <a
        href={import.meta.env.BASE_URL}
        className="flex gap-[4px] items-center p-[8px] rounded-[8px] w-full hover:bg-[#f2f0ea]"
      >
        <span className="font-['Inter:Semibold'] text-[#22201f] text-[16px] leading-[24px] whitespace-nowrap">
          All prototypes
        </span>
        <img alt="" className="block size-[16px]" src={imgArrowRight} />
      </a>

      {/* Nav items */}
      <div className="flex flex-1 flex-col gap-[4px] items-start w-full min-h-0 overflow-y-auto">
        <NavItem icon={imgHome} label="Home" />
        <NavItem icon={imgClipboard} label="Products" hasArrow />

        {/* Reports with children */}
        <div className="flex flex-col gap-[4px] items-start w-full shrink-0">
          <NavItem icon={imgGraph} label="Reports" hasArrow />
          <div className="flex flex-col gap-[4px] items-start w-full pl-[24px]">
            {([
              ["Overview", "Overview"],
              ["All reports", "All reports"],
            ] as const).map(([label, report]) => (
              <React.Fragment key={report}>
                <button
                  type="button"
                  aria-current={activeReport === report ? "page" : undefined}
                  onClick={() => onSelectReport(report)}
                  className={`flex h-[32px] w-full items-center justify-start rounded-[8px] p-[8px] text-left transition-colors ${
                    activeReport === report
                      ? "bg-[#edeae4]"
                      : "hover:bg-[#edeae4]"
                  }`}
                >
                  <span
                    className={`flex-1 truncate text-[14px] leading-[20px] ${
                      activeReport === report
                        ? "font-['Inter:Semibold'] text-[#22201f]"
                        : "font-['Inter:Medium'] text-[#22201f]"
                    }`}
                  >
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
          <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate">
            Help &amp; support
          </span>
        </div>
        <div className="flex gap-[8px] items-start justify-center p-[8px] rounded-[8px] w-full">
          <div className="flex items-center py-[2px] shrink-0">
            <img alt="" className="block size-[16px]" src={imgProfile} />
          </div>
          <div className="flex flex-col gap-[2px] items-start flex-1 min-w-0">
            <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] w-full truncate">
              Poppy Belle
            </span>
            <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">
              My Coffee Company
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  hasArrow,
}: {
  icon: string
  label: string
  hasArrow?: boolean
}) {
  return (
    <div className="flex gap-[8px] items-center justify-center px-[8px] py-[6px] rounded-[8px] w-full cursor-pointer hover:bg-[#edeae4] transition-colors">
      <img alt="" className="block shrink-0 size-[16px]" src={icon} />
      <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px] flex-1 min-w-0 truncate">
        {label}
      </span>
      {hasArrow && (
        <img
          alt=""
          className="block shrink-0 size-[16px]"
          src={imgArrowRight}
        />
      )}
    </div>
  )
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({
  text,
  children,
  centerAbove = false,
  centerBelow = false,
  singleLine = false,
  delay = 0,
}: {
  text: string
  children: React.ReactNode
  centerAbove?: boolean
  centerBelow?: boolean
  singleLine?: boolean
  delay?: number
}) {
  const [tooltip, setTooltip] = useState<{
    placement: "above" | "below"
    width: number
    left: number
    top: number
    arrowLeft: number
  } | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showTooltip(bounds: DOMRect) {
    const maxWidth = Math.max(0, Math.min(280, window.innerWidth - 32))
    const tooltipWidth = Math.min(maxWidth, Math.max(64, text.length * 6 + 16))
    const estimatedLines = Math.max(
      1,
      Math.ceil((text.length * 6) / Math.max(1, tooltipWidth - 16)),
    )
    const tooltipHeight = estimatedLines * 16 + 12
    const left =
      centerAbove || centerBelow
        ? Math.min(
            Math.max(16, bounds.left + bounds.width / 2 - tooltipWidth / 2),
            window.innerWidth - tooltipWidth - 16,
          )
        : (() => {
            const alignRight = bounds.left > window.innerWidth - bounds.right
            return Math.min(
              Math.max(
                16,
                alignRight ? bounds.right - tooltipWidth : bounds.left,
              ),
              window.innerWidth - tooltipWidth - 16,
            )
          })()
    const aboveTop = bounds.top - tooltipHeight - 6
    const belowTop = bounds.bottom + 6
    const placement =
      centerAbove ||
      (!centerBelow &&
        (aboveTop >= 16 || belowTop + tooltipHeight > window.innerHeight - 16))
        ? "above"
        : "below"
    const finalPlacement = centerBelow ? "below" : placement
    setTooltip({
      placement: finalPlacement,
      width: tooltipWidth,
      left,
      top: finalPlacement === "above" ? Math.max(16, aboveTop) : belowTop,
      arrowLeft: Math.min(
        tooltipWidth - 8,
        Math.max(8, bounds.left + bounds.width / 2 - left),
      ),
    })
  }

  function handleMouseEnter(event: React.MouseEvent<HTMLDivElement>) {
    setIsHovered(true)
    const bounds = event.currentTarget.getBoundingClientRect()
    if (delay === 0) {
      showTooltip(bounds)
      return
    }
    hoverTimeoutRef.current = setTimeout(() => showTooltip(bounds), delay)
  }

  function handleMouseLeave() {
    setIsHovered(false)
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = null
    setTooltip(null)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {tooltip && isHovered && (
        <div
          className="fixed z-[200] pointer-events-none text-left"
          style={{
            width: tooltip.width,
            left: tooltip.left,
            top: tooltip.top,
          }}
        >
          <div
            className={`bg-[#22201f] text-white font-['Inter:Regular'] text-[12px] leading-[16px] px-[8px] py-[6px] rounded-[6px] shadow-lg ${
              singleLine ? "whitespace-nowrap" : "whitespace-normal break-words"
            }`}
          >
            {text}
          </div>
          <div
            className={`absolute w-0 h-0 border-l-[5px] border-r-[5px] border-l-transparent border-r-transparent ${
              tooltip.placement === "above"
                ? "top-full border-t-[5px] border-t-[#22201f]"
                : "bottom-full border-b-[5px] border-b-[#22201f]"
            }`}
            style={{ left: tooltip.arrowLeft - 5 }}
          />
        </div>
      )}
    </div>
  )
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
  label: string
  value: string
  onClick?: () => void
  disabled?: boolean
  valueClassName?: string
  chipClassName?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[32px] max-w-full items-center gap-[6px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors ${
        disabled
          ? "cursor-not-allowed opacity-45"
          : "cursor-pointer hover:bg-[#f9f8f4]"
      } ${chipClassName}`}
    >
      {label && (
        <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
          {label}
        </span>
      )}
      <span
        className={`min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px] ${valueClassName}`}
      >
        {value}
      </span>
    </button>
  )
}

// ─── Site Dropdown ───────────────────────────────────────────────────────────

type SiteOption = { id: string name: string deleted?: boolean }

type ProductSalesView = {
  name: string
  salesBy: string
  sites: string[]
  registers: string[]
  date: { id: string label: string }
  compare: { id: string label: string }
  products: string[]
  categories: string[]
  reportingGroups: string[]
  tags?: string[]
  sale?: string
  tax: string
  visibleFilters: string[]
  createdBy?: string
  createdAt?: number
  description?: string
  sharedWithTeam?: boolean
}

type SalesOverviewView = {
  name: string
  sites: string[]
  registers: string[]
  date: { id: string label: string }
  compare: { id: string label: string }
  tax: string
  createdBy?: string
  createdAt?: number
  description?: string
  sharedWithTeam?: boolean
}

type HourlySalesView = {
  name: string
  sites: string[]
  registers: string[]
  date: { id: string label: string }
  compare: { id: string label: string }
  metric: HourlySalesMetric
  createdBy?: string
  createdAt?: number
  description?: string
  sharedWithTeam?: boolean
}

type ProductSalesStorage = {
  savedViews: ProductSalesView[]
  defaultView: string | null
}

type SalesOverviewStorage = {
  savedFilters: SalesOverviewView[]
  defaultView: string | null
}

type HourlySalesStorage = {
  savedViews: HourlySalesView[]
  defaultView: string | null
}

type TransactionView = {
  name: string
  sites: string[]
  date: { id: string label: string }
  customDateRange?: TransactionDateRange | null
  paymentTypes: string[]
  customers: string[]
  statuses?: string[]
  timeRange?: { from: string to: string } | null
  loyaltyMember?: "All" | "Yes" | "No"
  visibleFilters?: string[]
  terminals?: string[]
  orderTypes?: string[]
  sources?: string[]
  deletedOptions?: "Hide" | "Show"
  createdBy?: string
  createdAt?: number
  description?: string
  sharedWithTeam?: boolean
}

function shouldShowDeletedOptions(view?: TransactionView) {
  if (view?.deletedOptions) return view.deletedOptions === "Show"
  return false
}

type TransactionsStorage = {
  savedViews: TransactionView[]
  defaultView: string | null
}

const PRODUCT_SALES_STORAGE_KEY = "reports-bo:version-5:product-sales"
const SALES_OVERVIEW_STORAGE_KEY = "reports-bo:version-5:sales-overview"
const HOURLY_SALES_STORAGE_KEY = "reports-bo:version-5:hourly-sales"
const TRANSACTIONS_STORAGE_KEY = "reports-bo:version-5:transactions"
const TRANSACTION_COLUMNS_STORAGE_KEY =
  "reports-bo:version-5:transaction-columns"
const TRANSACTION_COLUMN_ORDER_STORAGE_KEY =
  "reports-bo:version-5:transaction-column-order"
const TRANSACTION_COLUMN_KEYS = [
  "saleNumber",
  "date",
  "time",
  "site",
  "terminal",
  "operator",
  "customer",
  "loyaltyMember",
  "tipAmount",
  "taxAmount",
  "netAmount",
  "total",
  "payments",
  "surcharge",
]

function loadTransactionColumns() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(TRANSACTION_COLUMNS_STORAGE_KEY) ?? "null",
    )
    if (Array.isArray(stored)) {
      const migrated = stored.flatMap((key) =>
        key === "dateTime" ? ["date", "time"] : [key],
      )
      return TRANSACTION_COLUMN_KEYS.filter((key) => migrated.includes(key))
    }
  } catch {
    /* Use the default columns when storage is unavailable or invalid. */
  }
  return TRANSACTION_COLUMN_KEYS
}

function loadTransactionColumnOrder() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(TRANSACTION_COLUMN_ORDER_STORAGE_KEY) ??
        "null",
    )
    if (Array.isArray(stored)) {
      return [
        ...stored.filter((key) => TRANSACTION_COLUMN_KEYS.includes(key)),
        ...TRANSACTION_COLUMN_KEYS.filter((key) => !stored.includes(key)),
      ]
    }
  } catch {
    /* Use the default order when storage is unavailable or invalid. */
  }
  return TRANSACTION_COLUMN_KEYS
}

function loadStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback
  } catch {
    return fallback
  }
}

function getStoredSalesDefault() {
  const stored = loadStoredValue<SalesOverviewStorage>(
    SALES_OVERVIEW_STORAGE_KEY,
    { savedFilters: [], defaultView: "__system__" },
  )
  return stored.savedFilters.find((view) => view.name === stored.defaultView)
}

function getStoredProductSalesDefault() {
  const stored = loadStoredValue<ProductSalesStorage>(
    PRODUCT_SALES_STORAGE_KEY,
    { savedViews: [], defaultView: "__system__" },
  )
  return stored.savedViews.find((view) => view.name === stored.defaultView)
}

const SITE_OPTIONS: SiteOption[] = [
  { id: "all", name: "All sites" },
  { id: "amberley", name: "Amberley – My Coffee Company" },
  { id: "brambleton", name: "Brambleton – My Coffee Company" },
  { id: "oakridge", name: "Oakridge – My Coffee Company" },
  { id: "pinehollow", name: "Pinehollow – My Coffee Company" },
  { id: "riverbend", name: "Riverbend – My Coffee Company" },
  { id: "willowmere", name: "Willowmere – My Coffee Company" },
  { id: "footscray", name: "Footscray – My Coffee Company", deleted: true },
]

const DELETED_PAYMENT_OPTIONS = ["Legacy EFTPOS"]
const DELETED_TERMINAL_OPTIONS = ["Old Front POS"]
const DELETED_CUSTOMER_OPTIONS = ["Deleted customer"]
const DELETED_ORDER_TYPE_OPTIONS = ["Legacy dine-in"]
const DELETED_SOURCE_OPTIONS = ["Legacy delivery"]

function SiteDropdown({
  selectedIds,
  onToggle,
  onClose,
  showDeletedSites,
  onToggleShowDeletedSites,
}: {
  selectedIds: string[]
  onToggle: (id: string) => void
  onClose: () => void
  showDeletedSites: boolean
  onToggleShowDeletedSites: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [onClose])

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
        <button
          type="button"
          role="checkbox"
          aria-checked={showDeletedSites}
          onClick={onToggleShowDeletedSites}
          className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
        >
          <span
            className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${
              showDeletedSites ? "" : "border border-[#bbbab6] bg-white"
            }`}
          >
            {showDeletedSites && (
              <img alt="" className="size-full" src={imgChecked} />
            )}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-[4px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]">
            Include deleted sites
            <InfoIcon tooltip="Include deleted sites in this report." />
          </span>
        </button>
      </div>
      <div className="h-px w-full bg-[#e3e2dd]" />
      <div className="max-h-[320px] overflow-y-auto p-[4px]">
        {SITE_OPTIONS.slice(1)
          .filter((site) => !site.deleted)
          .map((site) => (
            <CheckboxMenuRow
              key={site.id}
              label={site.name}
              checked={selectedIds.includes(site.id)}
              onClick={() => onToggle(site.id)}
            />
          ))}
        {SITE_OPTIONS.filter((site) => site.deleted).length > 0 && (
          <>
            <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[#85837e] text-[11px] uppercase tracking-[0.04em]">
              Deleted
            </p>
            {SITE_OPTIONS.filter((site) => site.deleted).map((site) => (
              <CheckboxMenuRow
                key={site.id}
                label={site.name}
                checked={selectedIds.includes(site.id)}
                onClick={() => onToggle(site.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function CheckboxMenuRow({
  label,
  checked,
  onClick,
  accessory,
  leading,
  className,
}: {
  label: string
  checked: boolean
  onClick: () => void
  accessory?: React.ReactNode
  leading?: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={
        className ??
        "flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
      }
    >
      {leading}
      <span
        className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${
          checked ? "" : "border border-[#bbbab6] bg-white"
        }`}
      >
        {checked && <img alt="" className="size-full" src={imgChecked} />}
      </span>
      <span className="min-w-0 flex-1 truncate font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
        {label}
      </span>
      {accessory}
    </button>
  )
}

function TransactionCheckbox({
  checked,
  mixed = false,
  label,
  onClick,
}: {
  checked: boolean
  mixed?: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={mixed ? "mixed" : checked}
      aria-label={label}
      onClick={onClick}
      className={`flex size-[20px] shrink-0 items-center justify-center rounded-[5px] ${
        checked || mixed
          ? "bg-[#22201f] text-white"
          : "border border-[#bbbab6] bg-white"
      }`}
    >
      {checked || mixed ? (
        <svg
          aria-hidden="true"
          className="size-[14px]"
          viewBox="0 0 16 16"
          fill="none"
        >
          {mixed ? (
            <path
              d="M4 8h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="m3.5 8.5 3 3 6-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      ) : null}
    </button>
  )
}

function CustomiseColumnsDrawer({
  columns,
  visibleKeys,
  onToggle,
  onReorder,
  onClose,
}: {
  columns: Array<{ key: string label: string }>
  visibleKeys: string[]
  onToggle: (key: string) => void
  onReorder: (sourceKey: string, targetKey: string) => void
  onClose: () => void
}) {
  const [draggedKey, setDraggedKey] = useState<string | null>(null)

  return (
    <div
      className="fixed inset-0 z-[100] bg-[rgba(34,32,31,0.24)]"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="customise-columns-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[360px] flex-col border-l border-[#e3e2dd] bg-white shadow-[-8px_0_24px_rgba(18,18,18,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[64px] shrink-0 items-center border-b border-[#e3e2dd] px-[20px]">
          <h2
            id="customise-columns-title"
            className="flex-1 font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[24px]"
          >
            Customise columns
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-full text-[#62615d] hover:bg-[#f4f3ef]"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m4 4 8 8m0-8-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-[12px]">
          {columns.map((column) => (
            <div
              key={column.key}
              draggable
              onDragStart={(event) => {
                setDraggedKey(column.key)
                event.dataTransfer.effectAllowed = "move"
                event.dataTransfer.setData("text/plain", column.key)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = "move"
              }}
              onDrop={(event) => {
                event.preventDefault()
                const sourceKey =
                  event.dataTransfer.getData("text/plain") || draggedKey
                if (sourceKey && sourceKey !== column.key)
                  onReorder(sourceKey, column.key)
                setDraggedKey(null)
              }}
              onDragEnd={() => setDraggedKey(null)}
              className={`flex min-h-[40px] items-center gap-[4px] rounded-[6px] px-[4px] ${
                draggedKey === column.key ? "opacity-40" : ""
              }`}
            >
              <CheckboxMenuRow
                label={column.label}
                checked={visibleKeys.includes(column.key)}
                onClick={() => onToggle(column.key)}
                className="flex min-w-0 flex-1 items-center gap-[10px] rounded-[6px] px-[8px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
                leading={
                  <span
                    aria-label={`Drag to reorder ${column.label}`}
                    className="flex size-[24px] shrink-0 cursor-grab items-center justify-center text-[#85837e] active:cursor-grabbing"
                  >
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle cx="5" cy="3" r="1" />
                      <circle cx="11" cy="3" r="1" />
                      <circle cx="5" cy="8" r="1" />
                      <circle cx="11" cy="8" r="1" />
                      <circle cx="5" cy="13" r="1" />
                      <circle cx="11" cy="13" r="1" />
                    </svg>
                  </span>
                }
              />
            </div>
          ))}
        </div>
        <div className="shrink-0 border-t border-[#e3e2dd] p-[16px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] w-full rounded-[8px] bg-[#1e72c4] font-['Inter:Semibold'] text-[14px] text-white hover:bg-[#1558a0]"
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  )
}

const REGISTERS_BY_SITE: Record<string, string[]> = {
  amberley: ["POS A", "Front POS", "Back POS"],
  brambleton: ["POS A", "Front POS", "Back POS"],
  oakridge: ["POS A", "Front POS", "Back POS"],
  pinehollow: ["POS A", "Front POS", "Back POS"],
  riverbend: ["POS A", "Front POS", "Back POS"],
  willowmere: ["POS A", "Front POS", "Back POS"],
  footscray: ["Front POS", "Old Front POS"],
}

const DELETED_SITE_IDS = new Set(
  SITE_OPTIONS.filter((site) => site.deleted).map((site) => site.id),
)
const DELETED_PAYMENT_OPTION_SET = new Set(DELETED_PAYMENT_OPTIONS)
const DELETED_TERMINAL_OPTION_SET = new Set(DELETED_TERMINAL_OPTIONS)
const DELETED_ORDER_TYPE_OPTION_SET = new Set(DELETED_ORDER_TYPE_OPTIONS)
const DELETED_SOURCE_OPTION_SET = new Set(DELETED_SOURCE_OPTIONS)

function TransactionOptionDropdown({
  label,
  allLabel,
  includeDeletedLabel,
  options,
  deletedOptions,
  selected,
  onToggle,
  includeDeletedOptions,
  onToggleIncludeDeletedOptions,
  onClose,
  onBack,
}: {
  label: string
  allLabel: string
  includeDeletedLabel: string
  options: string[]
  deletedOptions: string[]
  selected: string[]
  onToggle: (option: string) => void
  includeDeletedOptions: boolean
  onToggleIncludeDeletedOptions: () => void
  onClose: () => void
  onBack?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const [query, setQuery] = useState("")
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredDeletedOptions = deletedOptions.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const visibleDeletedOptions = includeDeletedOptions
    ? filteredDeletedOptions
    : []

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 flex max-h-[min(560px,calc(100dvh-96px))] w-[min(320px,calc(100vw-32px))] flex-col overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex h-[40px] w-full shrink-0 items-center gap-[8px] border-b border-[#e3e2dd] px-[8px] text-left"
        >
          <svg
            aria-hidden="true"
            className="size-[16px] shrink-0"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="m10 3-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
            Select {label.toLowerCase()}
          </span>
        </button>
      )}
      <div className="shrink-0 border-b border-[#e3e2dd] p-[4px]">
        <CheckboxMenuRow
          label={allLabel}
          checked={selected.length === 0}
          onClick={() => onToggle("all")}
        />
        <button
          type="button"
          role="checkbox"
          aria-checked={includeDeletedOptions}
          onClick={onToggleIncludeDeletedOptions}
          className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
        >
          <span
            className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${
              includeDeletedOptions ? "" : "border border-[#bbbab6] bg-white"
            }`}
          >
            {includeDeletedOptions && (
              <img alt="" className="size-full" src={imgChecked} />
            )}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-[4px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]">
            {includeDeletedLabel}
            <InfoIcon
              tooltip={`Include all deleted ${label.toLowerCase()} options in this report`}
            />
          </span>
        </button>
      </div>
      <div className="shrink-0 p-[8px]">
        <input
          aria-label={`Search ${label.toLowerCase()}`}
          autoFocus
          placeholder={`Search ${label.toLowerCase()}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="box-border h-[36px] w-full rounded-[6px] border border-[#bbbab6] bg-white px-[12px] font-['Inter:Regular'] text-[14px] text-[#22201f] outline-none placeholder:text-[#85837e] focus:border-[#62615d]"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[4px]">
        {filteredOptions.map((option) => (
          <CheckboxMenuRow
            key={option}
            label={option}
            checked={selected.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
        {visibleDeletedOptions.length > 0 && (
          <>
            <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[11px] uppercase tracking-[0.04em] text-[#85837e]">
              Deleted
            </p>
            {visibleDeletedOptions.map((option) => (
              <CheckboxMenuRow
                key={option}
                label={option}
                checked={selected.includes(option)}
                onClick={() => onToggle(option)}
              />
            ))}
          </>
        )}
        {filteredOptions.length === 0 && visibleDeletedOptions.length === 0 && (
          <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
            No matching {label.toLowerCase()} options
          </p>
        )}
      </div>
    </div>
  )
}

function ProductSalesOptionDropdown({
  label,
  options,
  deletedOptions = [],
  selected,
  onToggle,
  includeDeleted,
  onToggleIncludeDeleted,
  onClose,
  onBack,
}: {
  label: string
  options: string[]
  deletedOptions?: string[]
  selected: string[]
  onToggle: (option: string) => void
  includeDeleted: boolean
  onToggleIncludeDeleted: () => void
  onClose: () => void
  onBack?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const [query, setQuery] = useState("")
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredDeletedOptions = deletedOptions.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const pluralLabel =
    label === "Category"
      ? "categories"
      : label === "Reporting group"
        ? "reporting groups"
        : `${label.toLowerCase()}s`

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 flex max-h-[min(560px,calc(100dvh-96px))] w-[min(320px,calc(100vw-32px))] flex-col overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex h-[40px] w-full shrink-0 items-center gap-[8px] border-b border-[#e3e2dd] px-[8px] text-left"
        >
          <svg
            aria-hidden="true"
            className="size-[16px] shrink-0"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="m10 3-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
            Select {label.toLowerCase()}
          </span>
        </button>
      )}
      <div className="shrink-0 border-b border-[#e3e2dd] p-[4px]">
        <CheckboxMenuRow
          label={`All ${pluralLabel}`}
          checked={selected.length === 0}
          onClick={() => onToggle("all")}
        />
        <button
          type="button"
          role="checkbox"
          aria-checked={includeDeleted}
          onClick={onToggleIncludeDeleted}
          className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
        >
          <span
            className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${
              includeDeleted ? "" : "border border-[#bbbab6] bg-white"
            }`}
          >
            {includeDeleted && (
              <img alt="" className="size-full" src={imgChecked} />
            )}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-[4px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]">
            Include deleted {pluralLabel}
            <InfoIcon
              tooltip={`Include deleted ${pluralLabel} in this report`}
            />
          </span>
        </button>
      </div>
      <div className="shrink-0 p-[8px]">
        <input
          aria-label={`Search ${label.toLowerCase()}`}
          autoFocus
          placeholder={`Search ${label.toLowerCase()}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="box-border h-[36px] w-full rounded-[6px] border border-[#bbbab6] bg-white px-[12px] font-['Inter:Regular'] text-[14px] text-[#22201f] outline-none placeholder:text-[#85837e] focus:border-[#62615d]"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[4px]">
        {filteredOptions.map((option) => (
          <CheckboxMenuRow
            key={option}
            label={option}
            checked={selected.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
        {includeDeleted &&
          (filteredDeletedOptions.length > 0 || label === "Product") && (
            <>
              <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[11px] uppercase tracking-[0.04em] text-[#85837e]">
                Deleted
              </p>
              {filteredDeletedOptions.length > 0 ? (
                filteredDeletedOptions.map((option) => (
                  <CheckboxMenuRow
                    key={option}
                    label={option}
                    checked={selected.includes(option)}
                    onClick={() => onToggle(option)}
                  />
                ))
              ) : label === "Product" ? (
                <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
                  No deleted products
                </p>
              ) : null}
            </>
          )}
        {filteredOptions.length === 0 &&
          (!includeDeleted ||
            (filteredDeletedOptions.length === 0 && label !== "Product")) && (
            <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
              No matching {label.toLowerCase()} options
            </p>
          )}
      </div>
    </div>
  )
}

function RegisterDropdown({
  selectedSites,
  selectedRegisters,
  onToggle,
  onClose,
  onBack,
  searchable = false,
  includeDeletedRegisters,
  onToggleIncludeDeletedRegisters,
  registersBySite = REGISTERS_BY_SITE,
}: {
  selectedSites: SiteOption[]
  selectedRegisters: string[]
  onToggle: (key: string) => void
  onClose: () => void
  onBack?: () => void
  searchable?: boolean
  includeDeletedRegisters: boolean
  onToggleIncludeDeletedRegisters: () => void
  registersBySite?: Record<string, string[]>
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const [query, setQuery] = useState("")
  const options = selectedSites.flatMap((site) =>
    (registersBySite[site.id] ?? []).map((name) => ({
      key: `${site.id}:${name}`,
      site: site.name,
      name,
      deleted: DELETED_TERMINAL_OPTION_SET.has(name),
    })),
  )
  const filteredOptions = options.filter((option) =>
    `${option.site} ${option.name}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 flex max-h-[min(560px,calc(100dvh-96px))] w-[min(320px,calc(100vw-32px))] flex-col overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex h-[40px] w-full shrink-0 items-center gap-[8px] border-b border-[#e3e2dd] px-[8px] text-left"
        >
          <svg
            aria-hidden="true"
            className="size-[16px] shrink-0"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="m10 3-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-['Inter:Medium'] text-[12px] leading-[16px] text-[#62615d]">
            Select registers
          </span>
        </button>
      )}
      <div className="shrink-0 border-b border-[#e3e2dd] p-[4px]">
        <CheckboxMenuRow
          label="All registers"
          checked={selectedRegisters.length === 0}
          onClick={() => onToggle("all")}
        />
        <button
          type="button"
          role="checkbox"
          aria-checked={includeDeletedRegisters}
          onClick={onToggleIncludeDeletedRegisters}
          className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
        >
          <span
            className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${
              includeDeletedRegisters ? "" : "border border-[#bbbab6] bg-white"
            }`}
          >
            {includeDeletedRegisters && (
              <img alt="" className="size-full" src={imgChecked} />
            )}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-[4px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]">
            Include deleted registers
            <InfoIcon tooltip="Include all deleted registers in this report" />
          </span>
        </button>
      </div>
      {searchable && (
        <div className="shrink-0 p-[8px]">
          <input
            aria-label="Search registers"
            autoFocus
            placeholder="Search registers"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="box-border h-[36px] w-full rounded-[6px] border border-[#bbbab6] bg-white px-[12px] font-['Inter:Regular'] text-[14px] text-[#22201f] outline-none placeholder:text-[#85837e] focus:border-[#62615d]"
          />
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[4px]">
        {options.length === 0 ? (
          <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
            No registers available for this site.
          </p>
        ) : selectedSites.length > 1 ? (
          selectedSites.map((site) => {
            const siteOptions = options.filter(
              (option) => option.site === site.name,
            )
            return (
              <div key={site.id} className="mb-[4px] last:mb-0">
                <p className="px-[12px] py-[8px] font-['Inter:Medium'] text-[#62615d] text-[14px] leading-[20px]">
                  {site.name}
                </p>
                {siteOptions
                  .filter((option) => !option.deleted)
                  .map((option) => (
                    <CheckboxMenuRow
                      key={option.key}
                      label={option.name}
                      checked={selectedRegisters.includes(option.key)}
                      onClick={() => onToggle(option.key)}
                    />
                  ))}
                {siteOptions.some((option) => option.deleted) && (
                  <>
                    <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[11px] uppercase tracking-[0.04em] text-[#85837e]">
                      Deleted
                    </p>
                    {siteOptions
                      .filter(
                        (option) => option.deleted && includeDeletedRegisters,
                      )
                      .map((option) => (
                        <CheckboxMenuRow
                          key={option.key}
                          label={option.name}
                          checked={selectedRegisters.includes(option.key)}
                          onClick={() => onToggle(option.key)}
                        />
                      ))}
                  </>
                )}
              </div>
            )
          })
        ) : (
          <>
            {filteredOptions
              .filter((option) => !option.deleted)
              .map((option) => (
                <CheckboxMenuRow
                  key={option.key}
                  label={option.name}
                  checked={selectedRegisters.includes(option.key)}
                  onClick={() => onToggle(option.key)}
                />
              ))}
            {options.some((option) => option.deleted) && (
              <>
                <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[11px] uppercase tracking-[0.04em] text-[#85837e]">
                  Deleted
                </p>
                {filteredOptions
                  .filter((option) => option.deleted && includeDeletedRegisters)
                  .map((option) => (
                    <CheckboxMenuRow
                      key={option.key}
                      label={option.name}
                      checked={selectedRegisters.includes(option.key)}
                      onClick={() => onToggle(option.key)}
                    />
                  ))}
              </>
            )}
          </>
        )}
        {searchable && filteredOptions.length === 0 && (
          <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
            No matching registers
          </p>
        )}
      </div>
    </div>
  )
}

function TaxDropdown({
  selected,
  onSelect,
  onClose,
  options = ["Inclusive", "Exclusive"],
}: {
  selected: string
  onSelect: (value: string) => void
  onClose: () => void
  options?: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 w-[190px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            onSelect(option)
            onClose()
          }}
          className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
        >
          <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
            {option}
          </span>
          {selected === option && (
            <img
              alt="Selected"
              className="size-[16px] shrink-0"
              src={imgCheck}
            />
          )}
        </button>
      ))}
    </div>
  )
}

function OptionsDropdown({
  options,
  selected,
  onSelect,
  onClose,
  searchable = false,
  borderedSearch = false,
  width = 280,
  topOffset = 40,
}: {
  options: string[]
  selected: string
  onSelect: (value: string) => void
  onClose: () => void
  searchable?: boolean
  borderedSearch?: boolean
  width?: number
  topOffset?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const [query, setQuery] = useState("")
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div
      ref={ref}
      style={{ width, top: topOffset }}
      className="absolute left-0 z-50 max-h-[360px] overflow-y-auto rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      {searchable && (
        <input
          aria-label="Search options"
          autoFocus
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`mb-[4px] h-[36px] w-full rounded-[6px] px-[12px] font-['Inter:Regular'] text-[14px] text-[#22201f] outline-none placeholder:text-[#85837e] ${
            borderedSearch
              ? "border border-[#bbbab6] focus:border-[#3390e0]"
              : "border-b border-[#e3e2dd]"
          }`}
        />
      )}
      {filteredOptions.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            onSelect(option)
            onClose()
          }}
          className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
        >
          <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
            {option}
          </span>
          {selected === option && (
            <img
              alt="Selected"
              className="size-[16px] shrink-0"
              src={imgCheck}
            />
          )}
        </button>
      ))}
      {searchable && filteredOptions.length === 0 && (
        <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
          No matching options
        </p>
      )}
    </div>
  )
}

function MultiSelectDropdown({
  title,
  options,
  selected,
  onApply,
  onClose,
  searchable = false,
  singleSelect = false,
  deletedOptions = [],
}: {
  title: string
  options: string[]
  selected: string[]
  onApply: (values: string[]) => void
  onClose: () => void
  searchable?: boolean
  singleSelect?: boolean
  deletedOptions?: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const [draft, setDraft] = useState(selected)
  const [query, setQuery] = useState("")
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredDeletedOptions = deletedOptions.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const allSelected = draft.length === 0

  function toggleOption(option: string) {
    setDraft((current) =>
      current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option],
    )
  }

  return (
    <div
      ref={ref}
      className={`absolute left-0 top-[40px] z-50 ${"w-[220px] max-w-[calc(100vw-32px)]"} overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]`}
    >
      <div className="flex h-[40px] items-center border-b border-[#e3e2dd] px-[12px]">
        <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
          Select {title.toLowerCase()}
        </span>
      </div>
      {searchable && (
        <div className="px-[8px] pb-[4px] pt-[8px]">
          <label className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#bbbab6] px-[12px]">
            <svg
              aria-hidden="true"
              className="size-[16px] shrink-0 text-[#22201f]"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m10.5 10.5 3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              aria-label={`Search ${title}`}
              autoFocus
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] outline-none placeholder:text-[#aaaba6]"
            />
          </label>
        </div>
      )}
      <div className="max-h-[260px] overflow-y-auto p-[4px]">
        {!singleSelect && (
          <CheckboxMenuRow
            label="All"
            checked={allSelected}
            onClick={() => setDraft([])}
          />
        )}
        {filteredOptions
          .filter((option) => option !== "All")
          .map((option) =>
            singleSelect ? (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onApply([option])
                  onClose()
                }}
                className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]"
              >
                <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {option}
                </span>
              </button>
            ) : (
              <CheckboxMenuRow
                key={option}
                label={option}
                checked={draft.includes(option)}
                onClick={() => toggleOption(option)}
              />
            ),
          )}
        {filteredDeletedOptions.length > 0 && (
          <>
            <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[#85837e] text-[11px] uppercase tracking-[0.04em]">
              Deleted
            </p>
            {filteredDeletedOptions.map((option) =>
              singleSelect ? (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onApply([option])
                    onClose()
                  }}
                  className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]"
                >
                  <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                    {option}
                  </span>
                </button>
              ) : (
                <CheckboxMenuRow
                  key={option}
                  label={option}
                  checked={draft.includes(option)}
                  onClick={() => toggleOption(option)}
                />
              ),
            )}
          </>
        )}
        {searchable &&
          filteredOptions.filter((option) => option !== "All").length === 0 &&
          filteredDeletedOptions.length === 0 && (
            <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
              No matching options
            </p>
          )}
      </div>
      <div className="border-t border-[#e3e2dd] p-[8px]">
        <ActionButton
          variant="primary"
          size="slim"
          className="w-full"
          onClick={() => {
            onApply(draft)
            onClose()
          }}
        >
          Apply
        </ActionButton>
      </div>
    </div>
  )
}

function AddFilterDropdown({
  filters,
  filterOptions,
  selectedValues,
  registerSites = [],
  selectedRegisterKeys = [],
  onToggleRegister = () => {},
  includeDeletedRegisters = true,
  onToggleIncludeDeletedRegisters = () => {},
  includeDeletedPaymentTypes = true,
  onToggleIncludeDeletedPaymentTypes = () => {},
  onTogglePaymentType = () => {},
  includeDeletedOrderTypes = true,
  onToggleIncludeDeletedOrderTypes = () => {},
  onToggleOrderType = () => {},
  includeDeletedSources = true,
  onToggleIncludeDeletedSources = () => {},
  onToggleSource = () => {},
  immediateFilters = [],
  onToggleImmediateFilter = () => {},
  includeDeletedImmediateFilters = {},
  onToggleIncludeDeletedImmediateFilter = () => {},
  showAllOption = true,
  showDeletedOptions,
  deletedOptions = {},
  onToggleHideDeletedOptions,
  onToggleDeletedRegisters,
  onApply,
  onClose,
}: {
  filters: string[]
  filterOptions: Record<string, string[]>
  selectedValues: Record<string, string[]>
  registerSites?: SiteOption[]
  selectedRegisterKeys?: string[]
  onToggleRegister?: (key: string) => void
  includeDeletedRegisters?: boolean
  onToggleIncludeDeletedRegisters?: () => void
  includeDeletedPaymentTypes?: boolean
  onToggleIncludeDeletedPaymentTypes?: () => void
  onTogglePaymentType?: (paymentType: string) => void
  includeDeletedOrderTypes?: boolean
  onToggleIncludeDeletedOrderTypes?: () => void
  onToggleOrderType?: (orderType: string) => void
  includeDeletedSources?: boolean
  onToggleIncludeDeletedSources?: () => void
  onToggleSource?: (source: string) => void
  immediateFilters?: string[]
  onToggleImmediateFilter?: (filter: string, value: string) => void
  includeDeletedImmediateFilters?: Record<string, boolean>
  onToggleIncludeDeletedImmediateFilter?: (filter: string) => void
  showAllOption?: boolean
  showDeletedOptions?: boolean
  deletedOptions?: Record<string, string[]>
  onToggleHideDeletedOptions?: () => void
  onToggleDeletedRegisters?: () => void
  onApply: (filter: string, values: string[]) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState<string[]>([])
  const options = activeFilter ? (filterOptions[activeFilter] ?? []) : []
  const activeDeletedOptions = activeFilter
    ? (deletedOptions[activeFilter] ?? [])
    : []
  const activeFilterLabel =
    activeFilter === "Terminal" ? "Register" : activeFilter
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredDeletedOptions = activeDeletedOptions.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  )
  const searchableFilters = [
    "Product",
    "Category",
    "Reporting group",
    "Register",
    "Tags",
    "Terminal",
  ]
  const multiSelectFilters = [
    "Payment type",
    "Product",
    "Category",
    "Reporting group",
    "Register",
    "Tags",
    "Terminal",
    "Order type",
    "Source",
  ]

  if (activeFilter === "Payment type") {
    return (
      <TransactionOptionDropdown
        label="Payment type"
        allLabel="All payment types"
        includeDeletedLabel="Include deleted payment types"
        options={filterOptions[activeFilter] ?? []}
        deletedOptions={deletedOptions[activeFilter] ?? []}
        selected={selectedValues[activeFilter] ?? []}
        onToggle={onTogglePaymentType}
        includeDeletedOptions={includeDeletedPaymentTypes}
        onToggleIncludeDeletedOptions={onToggleIncludeDeletedPaymentTypes}
        onClose={onClose}
        onBack={() => {
          setActiveFilter(null)
          setQuery("")
        }}
      />
    )
  }

  if (activeFilter === "Order type" || activeFilter === "Source") {
    const isOrderType = activeFilter === "Order type"
    return (
      <TransactionOptionDropdown
        label={activeFilter}
        allLabel={isOrderType ? "All order types" : "All sources"}
        includeDeletedLabel={
          isOrderType
            ? "Include deleted order types"
            : "Include deleted sources"
        }
        options={filterOptions[activeFilter] ?? []}
        deletedOptions={deletedOptions[activeFilter] ?? []}
        selected={selectedValues[activeFilter] ?? []}
        onToggle={isOrderType ? onToggleOrderType : onToggleSource}
        includeDeletedOptions={
          isOrderType ? includeDeletedOrderTypes : includeDeletedSources
        }
        onToggleIncludeDeletedOptions={
          isOrderType
            ? onToggleIncludeDeletedOrderTypes
            : onToggleIncludeDeletedSources
        }
        onClose={onClose}
        onBack={() => {
          setActiveFilter(null)
          setQuery("")
        }}
      />
    )
  }

  if (activeFilter && immediateFilters.includes(activeFilter)) {
    return (
      <ProductSalesOptionDropdown
        label={activeFilter}
        options={(filterOptions[activeFilter] ?? []).filter(
          (option) => option !== "All",
        )}
        selected={selectedValues[activeFilter] ?? []}
        onToggle={(value) => onToggleImmediateFilter(activeFilter, value)}
        includeDeleted={includeDeletedImmediateFilters[activeFilter] ?? true}
        onToggleIncludeDeleted={() =>
          onToggleIncludeDeletedImmediateFilter(activeFilter)
        }
        onClose={onClose}
        onBack={() => {
          setActiveFilter(null)
          setQuery("")
        }}
      />
    )
  }

  if (activeFilter === "Terminal" || activeFilter === "Register") {
    return (
      <RegisterDropdown
        selectedSites={registerSites}
        selectedRegisters={selectedRegisterKeys}
        onToggle={onToggleRegister}
        onClose={onClose}
        onBack={() => {
          setActiveFilter(null)
          setQuery("")
        }}
        searchable
        includeDeletedRegisters={includeDeletedRegisters}
        onToggleIncludeDeletedRegisters={onToggleIncludeDeletedRegisters}
      />
    )
  }

  return (
    <div
      ref={ref}
      className={`absolute left-0 top-[40px] z-50 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-0 shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] ${
        activeFilter
          ? "w-[220px]"
          : onToggleHideDeletedOptions
            ? "w-[260px]"
            : "w-[180px]"
      }`}
    >
      {activeFilter ? (
        <>
          <button
            type="button"
            onClick={() => {
              setActiveFilter(null)
              setQuery("")
            }}
            className="flex h-[40px] w-full items-center gap-[8px] border-b border-[#e3e2dd] px-[8px] text-left"
          >
            <svg
              aria-hidden="true"
              className="size-[16px] shrink-0"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m10 3-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
              Select {activeFilterLabel?.toLowerCase()}
            </span>
          </button>
          {searchableFilters.includes(activeFilter) &&
            activeFilter !== "Register" &&
            activeFilter !== "Terminal" && (
              <div className="px-[8px] pb-[4px] pt-[8px]">
                <label className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#bbbab6] px-[12px]">
                  <svg
                    aria-hidden="true"
                    className="size-[16px] shrink-0 text-[#22201f]"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m10.5 10.5 3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    aria-label={`Search ${activeFilterLabel}`}
                    autoFocus
                    placeholder="Search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] outline-none placeholder:text-[#aaaba6]"
                  />
                </label>
              </div>
            )}
          <div className="max-h-[280px] overflow-y-auto p-[4px]">
            {activeFilter === "Loyalty member" ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onApply(activeFilter, [option])
                    onClose()
                  }}
                  className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]"
                >
                  <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                    {option}
                  </span>
                </button>
              ))
            ) : multiSelectFilters.includes(activeFilter) ? (
              <>
                {showAllOption && (
                  <CheckboxMenuRow
                    label="All"
                    checked={draft.length === 0}
                    onClick={() => setDraft([])}
                  />
                )}
                {filteredOptions
                  .filter((option) => option !== "All")
                  .map((option) => (
                    <CheckboxMenuRow
                      key={option}
                      label={option}
                      checked={draft.includes(option)}
                      onClick={() =>
                        setDraft((current) =>
                          current.includes(option)
                            ? current.filter((value) => value !== option)
                            : [...current, option],
                        )
                      }
                    />
                  ))}
                {filteredDeletedOptions.length > 0 && (
                  <>
                    <p className="px-[12px] pb-[4px] pt-[10px] font-['Inter:Medium'] text-[#85837e] text-[11px] uppercase tracking-[0.04em]">
                      Deleted
                    </p>
                    {filteredDeletedOptions.map((option) => (
                      <CheckboxMenuRow
                        key={option}
                        label={option}
                        checked={draft.includes(option)}
                        onClick={() =>
                          setDraft((current) =>
                            current.includes(option)
                              ? current.filter((value) => value !== option)
                              : [...current, option],
                          )
                        }
                      />
                    ))}
                  </>
                )}
                {filteredOptions.filter((option) => option !== "All").length ===
                  0 && (
                  <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                    No matching options
                  </p>
                )}
              </>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onApply(activeFilter, [option])
                    onClose()
                  }}
                  className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]"
                >
                  <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                    {option}
                  </span>
                </button>
              ))
            )}
          </div>
          {activeFilter !== "Loyalty member" && activeFilter !== "Tax" && (
            <div className="border-t border-[#e3e2dd] p-[8px]">
              <ActionButton
                variant="primary"
                size="slim"
                className="w-full"
                onClick={() => {
                  onApply(activeFilter, draft)
                  onClose()
                }}
              >
                Apply
              </ActionButton>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="border-b border-[#e3e2dd] px-[12px] py-[8px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
            Add filter
          </p>
          <div className="p-[4px]">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter)
                  setDraft(selectedValues[filter] ?? [])
                  setQuery("")
                }}
                className="flex h-[36px] w-full items-center rounded-[6px] px-[12px] text-left transition-colors hover:bg-[#f9f8f4]"
              >
                <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {filter === "Terminal" ? "Register" : filter}
                </span>
                <svg
                  aria-hidden="true"
                  className="size-[16px] text-[#85837e]"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="m6 3 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
            {filters.length === 0 && (
              <p className="px-[12px] py-[8px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                All filters are shown
              </p>
            )}
          </div>
          {onToggleHideDeletedOptions && (
            <div className="border-t border-[#e3e2dd] p-[4px]">
              <CheckboxMenuRow
                label="Show deleted options"
                checked={showDeletedOptions ?? false}
                onClick={onToggleHideDeletedOptions}
                accessory={
                  <Tooltip text="Excludes deleted sites, terminals, customers, order types, and other deleted options from this report.">
                    <span
                      role="img"
                      aria-label="About hiding deleted options"
                      className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-[#85837e] font-['Inter:Semibold'] text-[11px] leading-none text-[#62615d]"
                    >
                      i
                    </span>
                  </Tooltip>
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function DateComparisonDropdown({
  dateId,
  compareId,
  onSelectDate,
  onSelectCompare,
  onClose,
}: {
  dateId: string
  compareId: string
  onSelectDate: (id: string, label: string) => void
  onSelectCompare: (id: string, label: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const compareOptions = COMPARE_TO_OPTIONS[dateId] ?? COMPARE_TO_OPTIONS.today
  const visibleCompareOptions = [
    ...compareOptions,
    { id: "custom-date", label: "Custom date" },
  ]

  return (
    <div
      ref={ref}
      className="absolute left-0 top-[40px] z-50 grid w-[min(400px,calc(100vw-32px))] grid-cols-2 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      <section className="min-w-0 border-r border-[#e3e2dd]">
        <p className="border-b border-[#e3e2dd] px-[16px] pb-[8px] pt-[12px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
          Date range
        </p>
        <div className="max-h-[360px] overflow-y-auto p-[4px]">
          {DATE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectDate(option.id, option.label)}
              className="flex w-full items-start gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
            >
              <span className="flex flex-1 flex-col">
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {option.label}
                </span>
                <span className="mt-[1px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">
                  {getDateRangeLabel(option.id)}
                </span>
              </span>
              {dateId === option.id && (
                <img
                  alt="Selected"
                  className="mt-[2px] size-[16px] shrink-0"
                  src={imgCheck}
                />
              )}
            </button>
          ))}
        </div>
      </section>
      <section className="min-w-0">
        <p className="border-b border-[#e3e2dd] px-[16px] pb-[8px] pt-[12px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
          Compare to
        </p>
        <div className="max-h-[360px] overflow-y-auto p-[4px]">
          {visibleCompareOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectCompare(option.id, option.label)}
              className="flex w-full items-start gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
            >
              <span className="flex flex-1 flex-col">
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {option.label}
                </span>
                {getDateRangeLabel(option.id, dateId) && (
                  <span className="mt-[1px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">
                    {getDateRangeLabel(option.id, dateId)}
                  </span>
                )}
              </span>
              {compareId === option.id && (
                <img
                  alt="Selected"
                  className="mt-[2px] size-[16px] shrink-0"
                  src={imgCheck}
                />
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onSelectCompare("none", "None")}
            className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
          >
            <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
              None
            </span>
            {compareId === "none" && (
              <img
                alt="Selected"
                className="size-[16px] shrink-0"
                src={imgCheck}
              />
            )}
          </button>
        </div>
      </section>
    </div>
  )
}

function TransactionDateDropdown({
  selected,
  selectedRange,
  onSelect,
  onClose,
}: {
  selected: string
  selectedRange: TransactionDateRange | null
  onSelect: (id: string, label: string, range?: TransactionDateRange) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const today = new Date()
  const defaultTo = formatDateInputValue(today)
  const defaultFrom = formatDateInputValue(addDays(today, -29))
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false)
  const [draftRange, setDraftRange] = useState<TransactionDateRange>(
    selectedRange ?? { from: defaultFrom, to: defaultTo },
  )
  const fromDate = parseDateInputValue(draftRange.from)
  const toDate = parseDateInputValue(draftRange.to)
  const rangeDays =
    fromDate && toDate
      ? Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1
      : 0
  const rangeError =
    !fromDate || !toDate
      ? "Enter a start and end date."
      : rangeDays < 1
        ? "Start date must be before the end date."
        : rangeDays > 30
          ? "Choose a range of 30 days or less."
          : ""
  useDropdownClose(ref, onClose)

  return (
    <div
      ref={ref}
      className="absolute left-0 top-[40px] z-50 w-[220px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      {isCustomDateOpen ? (
        <div>
          <button
            type="button"
            onClick={() => setIsCustomDateOpen(false)}
            className="flex h-[40px] w-full shrink-0 items-center gap-[8px] border-b border-[#e3e2dd] px-[8px] text-left"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-[16px] shrink-0"
              fill="none"
            >
              <path
                d="m10 3-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
              Custom date
            </span>
          </button>
          <div className="flex flex-col gap-[8px] p-[12px]">
            <div className="flex flex-col gap-[10px]">
              <label className="flex min-w-0 flex-1 flex-col gap-[4px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                From
                <input
                  aria-label="Start date"
                  type="date"
                  max={defaultTo}
                  value={draftRange.from}
                  onChange={(event) =>
                    setDraftRange((range) => ({
                      ...range,
                      from: event.target.value,
                    }))
                  }
                  className="h-[36px] min-w-0 rounded-[8px] border border-[#bbbab6] px-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]"
                />
              </label>
              <label className="flex min-w-0 flex-1 flex-col gap-[4px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                To
                <input
                  aria-label="End date"
                  type="date"
                  min={draftRange.from}
                  max={defaultTo}
                  value={draftRange.to}
                  onChange={(event) =>
                    setDraftRange((range) => ({
                      ...range,
                      to: event.target.value,
                    }))
                  }
                  className="h-[36px] min-w-0 rounded-[8px] border border-[#bbbab6] px-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]"
                />
              </label>
            </div>
            <p
              aria-live="polite"
              className={`font-['Inter:Regular'] text-[12px] leading-[16px] ${
                rangeError ? "text-[#b42318]" : "text-[#62615d]"
              }`}
            >
              {rangeError || "Max range: 30 days"}
            </p>
          </div>
          <div className="border-t border-[#e3e2dd] p-[8px]">
            <button
              type="button"
              disabled={Boolean(rangeError)}
              onClick={() => {
                if (rangeError || !fromDate || !toDate) return
                onSelect(
                  "custom",
                  `${formatTransactionDate(fromDate)} - ${formatTransactionDate(toDate)}`,
                  draftRange,
                )
                onClose()
              }}
              className="h-[36px] w-full rounded-[8px] bg-[#1e72c4] font-['Inter:Semibold'] text-[14px] leading-[20px] text-white hover:bg-[#1558a0] disabled:cursor-not-allowed disabled:bg-[#bbbab6]"
            >
              Apply
            </button>
          </div>
        </div>
      ) : (
        <div className="p-[4px]">
          {TRANSACTION_DATE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onSelect(option.id, option.label)
                onClose()
              }}
              className="flex w-full items-start gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
            >
              <span className="flex flex-1 flex-col">
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {option.label}
                </span>
                {getDateRangeLabel(option.id) && (
                  <span className="mt-[1px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">
                    {getDateRangeLabel(option.id)}
                  </span>
                )}
              </span>
              {selected === option.id && (
                <img
                  alt="Selected"
                  className="mt-[2px] size-[16px] shrink-0"
                  src={imgCheck}
                />
              )}
            </button>
          ))}
          <div>
            <button
              type="button"
              onClick={() => setIsCustomDateOpen(true)}
              className="flex w-full items-center justify-between rounded-[6px] px-[12px] py-[8px] text-left font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] transition-colors hover:bg-[#f9f8f4]"
            >
              Custom date
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-[16px] text-[#62615d]"
                fill="none"
              >
                <path
                  d="m6 3 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type TransactionTimeRange = { from: string to: string }
type TransactionDateRange = { from: string to: string }

function formatDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseDateInputValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null
}

function formatTransactionDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTransactionTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  const suffix = hours >= 12 ? "pm" : "am"
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`
}

function getTransactionTimeMinutes(dateTime: string) {
  const match = dateTime.match(/,\s*(\d{1,2}):(\d{2})\s*(am|pm)$/i)
  if (!match) return null
  const hours =
    (Number(match[1]) % 12) + (match[3].toLowerCase() === "pm" ? 12 : 0)
  return hours * 60 + Number(match[2])
}

function parseTransactionDate(dateTime: string) {
  const match = dateTime.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/)
  if (!match) return null
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(match[2])
  return month < 0 ? null : new Date(Number(match[3]), month, Number(match[1]))
}

function TransactionTimeDropdown({
  selected,
  onApply,
  onClose,
}: {
  selected: TransactionTimeRange | null
  onApply: (value: TransactionTimeRange | null) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isAllDay, setIsAllDay] = useState(selected === null)
  const [draft, setDraft] = useState<TransactionTimeRange>(
    selected ?? { from: "00:00", to: "23:59" },
  )
  useDropdownClose(ref, onClose)

  return (
    <div
      ref={ref}
      className="absolute left-0 top-[40px] z-50 w-[220px] rounded-[8px] border border-[#e3e2dd] bg-white p-[12px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]"
    >
      <div className="flex flex-col gap-[12px]">
        <div className="flex h-[20px] items-center gap-[10px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]">
          <button
            type="button"
            role="checkbox"
            aria-label="All day"
            aria-checked={isAllDay}
            onClick={() => {
              setIsAllDay((checked) => {
                if (!checked) {
                  setDraft({ from: "00:00", to: "23:59" })
                }
                return !checked
              })
            }}
            className={`flex size-[16px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] ${
              isAllDay ? "" : "border border-[#bbbab6] bg-white"
            }`}
          >
            {isAllDay && <img alt="" className="size-full" src={imgChecked} />}
          </button>
          <span>All day</span>
        </div>
        {(["from", "to"] as const).map((key) => (
          <label
            key={key}
            className="flex flex-col gap-[4px] font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]"
          >
            <span>{key === "from" ? "From" : "To"}</span>
            <input
              aria-label={key === "from" ? "Start time" : "End time"}
              type="time"
              disabled={isAllDay}
              value={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="h-[40px] w-full rounded-[8px] border border-[#bbbab6] px-[10px] font-['Inter:Regular'] text-[14px] disabled:border-[#e3e2dd] disabled:bg-[#f9f8f4] disabled:text-[#aaaba6]"
            />
          </label>
        ))}
        <div>
          <button
            type="button"
            onClick={() => {
              onApply(isAllDay ? null : draft)
              onClose()
            }}
            className="h-[40px] w-full rounded-[8px] bg-[#1e72c4] font-['Inter:Semibold'] text-[14px] text-white hover:bg-[#1558a0]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Date Dropdown ───────────────────────────────────────────────────────────

const DATE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "week-to-date", label: "Week to date" },
  { id: "past-week", label: "Past week" },
  { id: "month-to-date", label: "Month to date" },
  { id: "past-4-weeks", label: "Past 4 weeks" },
  { id: "past-12-weeks", label: "Past 12 weeks" },
  { id: "year-to-date", label: "Year to date" },
  { id: "past-6-months", label: "Past 6 months" },
  { id: "past-12-months", label: "Past 12 months" },
  { id: "custom", label: "Custom", isCustom: true },
]

const TRANSACTION_DATE_OPTIONS = DATE_OPTIONS.filter(({ id }) =>
  [
    "today",
    "yesterday",
    "past-week",
    "week-to-date",
    "month-to-date",
    "past-4-weeks",
  ].includes(id),
)

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <rect
        x="1"
        y="3"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5 1v4M11 1v4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function useDropdownClose(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [ref, onClose])
}

function DateDropdown({
  selected,
  onSelect,
  onClose,
}: {
  selected: string
  onSelect: (id: string, label: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[240px] overflow-hidden"
    >
      <div className="p-[4px]">
        {DATE_OPTIONS.filter((o) => !o.isCustom).map((opt) => {
          const dateStr = selected === opt.id ? getDateRangeLabel(opt.id) : ""
          return (
            <button
              key={opt.id}
              onClick={() => {
                onSelect(opt.id, opt.label)
                onClose()
              }}
              className="flex gap-[10px] items-start px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
            >
              <div className="flex flex-col flex-1 text-left">
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {opt.label}
                </span>
                {dateStr && (
                  <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px] mt-[1px]">
                    {dateStr}
                  </span>
                )}
              </div>
              {selected === opt.id && (
                <img
                  alt=""
                  className="block shrink-0 size-[16px] mt-[2px]"
                  src={imgCheck}
                />
              )}
            </button>
          )
        })}
      </div>
      <div className="relative h-px w-full">
        <img alt="" className="block w-full" src={imgDivider} />
      </div>
      <div className="p-[4px]">
        <button
          onClick={() => {
            onSelect("custom", "Custom")
            onClose()
          }}
          className="flex gap-[10px] items-center px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
        >
          <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px] flex-1 text-left">
            Custom
          </span>
          {selected === "custom" && (
            <img alt="" className="block shrink-0 size-[16px]" src={imgCheck} />
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const TODAY_NAME = DAYS[new Date().getDay()]
const YESTERDAY_NAME = DAYS[(new Date().getDay() + 6) % 7]

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
function fmtShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}
function lowercaseFirstLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}
function startOfWeek(d: Date) {
  const r = new Date(d)
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7))
  return r
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

const _today = new Date()
_today.setHours(0, 0, 0, 0)

function getDateRangeLabel(id: string, _dateId?: string): string {
  const t = _today
  const yesterday = addDays(t, -1)

  switch (id) {
    case "today":
      return fmtDate(t)
    case "yesterday":
      return fmtDate(yesterday)
    case "past-week": {
      const s = addDays(t, -6)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "week-to-date": {
      const s = startOfWeek(t)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "month-to-date": {
      const s = startOfMonth(t)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "past-4-weeks": {
      const s = addDays(t, -27)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "past-12-weeks": {
      const s = addDays(t, -83)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "year-to-date": {
      const s = new Date(t.getFullYear(), 0, 1)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "past-6-months": {
      const s = new Date(t.getFullYear(), t.getMonth() - 6, t.getDate())
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    case "past-12-months": {
      const s = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate() + 1)
      return `${fmtShort(s)} – ${fmtShort(t)}`
    }
    // Compare-to options
    case "last-same-day": {
      const base = _dateId === "yesterday" ? yesterday : t
      return fmtDate(addDays(base, -7))
    }
    case "day-before": {
      return fmtDate(addDays(t, -2))
    }
    case "yesterday":
      return fmtDate(yesterday)
    case "custom-date":
      return ""
    case "last-week-same-day": {
      return fmtDate(addDays(_dateId === "yesterday" ? yesterday : t, -7))
    }
    case "last-year-same-day": {
      const base = _dateId === "yesterday" ? yesterday : t
      return fmtDate(
        new Date(base.getFullYear() - 1, base.getMonth(), base.getDate()),
      )
    }
    case "prev-period": {
      let start: Date
      let end: Date
      if (_dateId === "past-week") {
        end = addDays(t, -7)
        start = addDays(end, -6)
      } else if (_dateId === "week-to-date") {
        start = addDays(startOfWeek(t), -7)
        end = addDays(start, (t.getDay() + 6) % 7)
      } else if (_dateId === "past-4-weeks") {
        end = addDays(t, -28)
        start = addDays(end, -27)
      } else if (_dateId === "past-12-weeks") {
        end = addDays(t, -84)
        start = addDays(end, -83)
      } else if (_dateId === "month-to-date") {
        start = new Date(t.getFullYear(), t.getMonth() - 1, 1)
        end = new Date(
          start.getFullYear(),
          start.getMonth(),
          Math.min(
            t.getDate(),
            new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate(),
          ),
        )
      } else if (_dateId === "year-to-date") {
        start = new Date(t.getFullYear() - 1, 0, 1)
        end = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate())
      } else if (_dateId === "past-6-months") {
        end = new Date(t.getFullYear(), t.getMonth() - 6, t.getDate())
        start = new Date(
          end.getFullYear(),
          end.getMonth() - 6,
          end.getDate() + 1,
        )
      } else if (_dateId === "past-12-months") {
        end = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate())
        start = new Date(
          end.getFullYear() - 1,
          end.getMonth(),
          end.getDate() + 1,
        )
      } else {
        return ""
      }
      return `${fmtShort(start)} – ${fmtShort(end)}`
    }
    case "same-period-last-year": {
      if (
        ![
          "past-week",
          "week-to-date",
          "past-4-weeks",
          "past-12-weeks",
          "month-to-date",
          "year-to-date",
          "past-6-months",
          "past-12-months",
        ].includes(_dateId ?? "")
      )
        return ""
      let start: Date
      let end = new Date(t)
      if (_dateId === "week-to-date") {
        start = startOfWeek(t)
        end = addDays(t, -1)
      } else if (_dateId === "past-week") {
        start = addDays(t, -6)
      } else if (_dateId === "past-4-weeks") {
        start = addDays(t, -27)
      } else if (_dateId === "past-12-weeks") {
        start = addDays(t, -83)
      } else if (_dateId === "month-to-date") {
        start = startOfMonth(t)
      } else if (_dateId === "past-6-months") {
        start = new Date(t.getFullYear(), t.getMonth() - 6, t.getDate())
      } else if (_dateId === "past-12-months") {
        start = new Date(t.getFullYear() - 1, t.getMonth(), t.getDate() + 1)
      } else {
        start = new Date(t.getFullYear(), 0, 1)
      }
      start = new Date(
        start.getFullYear() - 1,
        start.getMonth(),
        start.getDate(),
      )
      end = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate())
      return `${fmtShort(start)} – ${fmtShort(end)}`
    }
    default:
      return ""
  }
}

// ─── Compare To Dropdown ──────────────────────────────────────────────────────

const COMPARE_TO_OPTIONS: Record<string, Array<{ id: string label: string }>> =
  {
    today: [
      { id: "last-same-day", label: `Last ${TODAY_NAME}` },
      { id: "yesterday", label: "Yesterday" },
    ],
    yesterday: [{ id: "last-same-day", label: `Last ${YESTERDAY_NAME}` }],
    ...Object.fromEntries(
      [
        "past-week",
        "week-to-date",
        "past-4-weeks",
        "month-to-date",
        "year-to-date",
        "custom",
        "past-12-weeks",
        "past-6-months",
        "past-12-months",
      ].map((id) => [
        id,
        [
          { id: "prev-period", label: "Previous period" },
          { id: "same-period-last-year", label: "Previous year" },
        ],
      ]),
    ),
  }

function CompareToDropdown({
  dateId,
  selected,
  onSelect,
  onClose,
}: {
  dateId: string
  selected: string
  onSelect: (id: string, label: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)
  const options = [
    ...(COMPARE_TO_OPTIONS[dateId] ?? COMPARE_TO_OPTIONS["today"]),
    { id: "custom-date", label: "Custom date" },
    { id: "none", label: "None" },
  ]

  return (
    <div
      ref={ref}
      className="absolute top-[40px] left-0 z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)] w-[260px] overflow-hidden"
    >
      <div className="p-[4px]">
        {options.map((opt) => {
          const dateStr = getDateRangeLabel(opt.id, dateId)
          return (
            <button
              key={opt.id}
              onClick={() => {
                onSelect(opt.id, opt.label)
                onClose()
              }}
              className="flex gap-[10px] items-start px-[12px] py-[8px] w-full rounded-[6px] hover:bg-[#f9f8f4] transition-colors"
            >
              <div className="flex flex-col flex-1 text-left">
                <span className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
                  {opt.label}
                </span>
                {dateStr && (
                  <span className="font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px] mt-[1px]">
                    {dateStr}
                  </span>
                )}
              </div>
              {selected === opt.id && (
                <img
                  alt=""
                  className="block shrink-0 size-[16px] mt-[2px]"
                  src={imgCheck}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <Tooltip text={tooltip}>
      <img
        alt=""
        className="block shrink-0 size-[16px] cursor-default"
        src={imgInfo}
      />
    </Tooltip>
  )
}

function RefreshControl({
  isRefreshing,
  onRefresh,
  minutesSinceUpdate,
}: {
  isRefreshing: boolean
  onRefresh: () => void
  minutesSinceUpdate: number
}) {
  const isDelayed = minutesSinceUpdate >= 1
  return (
    <div className="flex shrink-0 items-center gap-[2px]">
      <Tooltip
        text={
          isDelayed
            ? "Reporting data may be delayed. The pipeline is taking longer than the expected 1-minute update window."
            : "Reporting data is current through the last update."
        }
      >
        <span
          role="status"
          aria-live="polite"
          aria-label={`Last updated ${minutesSinceUpdate} ${
            minutesSinceUpdate === 1 ? "minute" : "minutes"
          } ago`}
          className={`inline-flex items-center gap-[5px] whitespace-nowrap font-['Inter:Medium'] text-[12px] leading-[16px] ${
            isDelayed ? "text-[#9a5b00]" : "text-[#397348]"
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-[6px] rounded-full ${
              isDelayed ? "bg-[#d88913]" : "bg-[#4a9b63]"
            }`}
          />
          {minutesSinceUpdate > 0 ? `${minutesSinceUpdate}m ago` : "Just now"}
        </span>
      </Tooltip>
      <Tooltip text="Refresh" centerBelow delay={600}>
        <button
          type="button"
          aria-label="Refresh report"
          onClick={onRefresh}
          className="flex size-[32px] items-center justify-center rounded-full transition-colors hover:bg-[#f4f3ef]"
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={isRefreshing ? "spin-once" : ""}
          >
            <path
              d="M17 18.8742C19.1213 17.3287 20.5 14.8251 20.5 11.9996C20.5 7.30519 16.6944 3.49961 12 3.49961H11.5M12 20.4996C7.30558 20.4996 3.5 16.694 3.5 11.9996C3.5 9.17407 4.87867 6.67054 7 5.12501M11 22.3996L13 20.3996L11 18.3996M13 5.59961L11 3.59961L13 1.59961"
              stroke="#22201F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Tooltip>
    </div>
  )
}

function ReportHeaderActions({
  isRefreshing,
  onRefresh,
  minutesSinceUpdate,
  onCustomise,
  onExport,
  onSave,
}: {
  isRefreshing: boolean
  onRefresh: () => void
  minutesSinceUpdate: number
  onCustomise?: () => void
  onExport?: () => void
  onSave?: () => void
}) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-[8px]">
      <RefreshControl
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        minutesSinceUpdate={minutesSinceUpdate}
      />
      {onCustomise && (
        <Tooltip text="Customise table" centerBelow delay={600}>
          <button
            type="button"
            aria-label="Customise table"
            onClick={onCustomise}
            className="flex size-[32px] items-center justify-center rounded-full text-[#22201f] transition-colors hover:bg-[#f4f3ef]"
          >
            <img
              aria-hidden="true"
              alt=""
              src={imgCustomiseTable}
              className="size-[24px]"
            />
          </button>
        </Tooltip>
      )}
      {onExport && (
        <button
          type="button"
          aria-label="Export"
          onClick={onExport}
          className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
        >
          Export
        </button>
      )}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
        >
          Save view
        </button>
      )}
    </div>
  )
}

function SavedReportHeaderActions({
  isRefreshing,
  onRefresh,
  minutesSinceUpdate,
  onCustomise,
  onSettings,
  onDelete,
  onExport,
  onSave,
}: {
  isRefreshing: boolean
  onRefresh: () => void
  minutesSinceUpdate: number
  onCustomise: () => void
  onSettings: () => void
  onDelete: () => void
  onExport: () => void
  onSave?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDropdownClose(menuRef, () => setIsOpen(false))

  function runMenuAction(action: () => void) {
    setIsOpen(false)
    action()
  }

  return (
    <div className="ml-auto flex shrink-0 items-center gap-[8px]">
      <RefreshControl
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        minutesSinceUpdate={minutesSinceUpdate}
      />
      <div className="relative" ref={menuRef}>
        <Tooltip text="More options" centerBelow singleLine delay={600}>
          <button
            type="button"
            aria-label="More report options"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="flex size-[32px] items-center justify-center rounded-full text-[#22201f] transition-colors hover:bg-[#f4f3ef]"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          </button>
        </Tooltip>
        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[40px] z-50 w-[220px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_8px_0px_rgba(18,18,18,0.12)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => runMenuAction(onCustomise)}
              className="flex h-[36px] w-full items-center gap-[12px] rounded-[4px] px-[12px] text-left font-['Inter:Medium'] text-[15px] leading-[20px] text-[#22201f] hover:bg-[#f9f8f4]"
            >
              <img
                src={imgCustomiseTable}
                alt=""
                aria-hidden="true"
                className="size-[20px]"
              />
              Customise table
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => runMenuAction(onSettings)}
              className="flex h-[36px] w-full items-center gap-[12px] rounded-[4px] px-[12px] text-left font-['Inter:Medium'] text-[15px] leading-[20px] text-[#22201f] hover:bg-[#f9f8f4]"
            >
              <img
                src={imgCog}
                alt=""
                aria-hidden="true"
                className="size-[20px]"
              />
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => runMenuAction(onDelete)}
              className="flex h-[36px] w-full items-center gap-[12px] rounded-[4px] px-[12px] text-left font-['Inter:Medium'] text-[15px] leading-[20px] text-[#a51d18] hover:bg-[#fef3f2]"
            >
              <svg
                aria-hidden="true"
                className="size-[20px]"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M3.5 5.5h13M8 3.5h4m-7 2 1 11h8l1-11M8 8v5m4-5v5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete report
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="Export"
        onClick={onExport}
        className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
      >
        Export
      </button>
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
        >
          Save
        </button>
      )}
    </div>
  )
}

function MetricMoreMenu({
  onExportPng,
  onViewMethodology,
}: {
  onExportPng: () => void
  onViewMethodology: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, () => setIsOpen(false))

  return (
    <div ref={ref} className="relative shrink-0">
      <Tooltip text="More options" centerAbove singleLine delay={600}>
        <button
          type="button"
          aria-label="More chart options"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex size-[32px] items-center justify-center rounded-[8px] text-[#777671] transition-colors hover:bg-[#f2f0ea]"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
      </Tooltip>
      {isOpen && (
        <div className="absolute right-0 top-[40px] z-50 w-[190px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onExportPng()
            }}
            className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
          >
            <svg
              aria-hidden="true"
              className="size-[16px] shrink-0 text-[#22201f]"
              viewBox="0 0 20 20"
              fill="none"
            >
              <rect
                x="2.5"
                y="2.5"
                width="15"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle
                cx="7"
                cy="7"
                r="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m3.5 15 4-4 2.5 2.5 2-2 4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
            <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
              Export PNG
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onViewMethodology()
            }}
            className="flex w-full items-center gap-[10px] rounded-[6px] px-[12px] py-[8px] text-left transition-colors hover:bg-[#f9f8f4]"
          >
            <svg
              aria-hidden="true"
              className="size-[16px] shrink-0 text-[#22201f]"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 4.5C8.5 3.2 6.2 2.8 2.5 3.5v12c3.7-.7 6-.3 7.5 1 1.5-1.3 3.8-1.7 7.5-1v-12c-3.7-.7-6-.3-7.5 1Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M10 4.5v12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="flex-1 font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
              View methodology
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Hourly Sales Chart ───────────────────────────────────────────────────────

const HALF_HOURS = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
]

const CURRENT_DATA = [
  120, 185, 310, 420, 510, 580, 640, 690, 720, 760, 810, 770, 680, 590, 480,
  320,
]
const PREV_DATA = [
  100, 155, 270, 360, 430, 490, 530, 570, 600, 630, 670, 640, 580, 510, 420,
  280,
]
const CURRENT_ORDER_DATA = [
  7, 10, 16, 20, 24, 27, 30, 32, 34, 36, 38, 36, 32, 28, 23, 15,
]
const PREV_ORDER_DATA = [
  6, 9, 14, 18, 21, 24, 27, 29, 31, 33, 35, 33, 29, 25, 20, 13,
]
type HourlySalesMetric = "Sale amount" | "Order count" | "Average sale"

function getHourlyMetricData(metric: HourlySalesMetric) {
  if (metric === "Order count") {
    return { current: CURRENT_ORDER_DATA, previous: PREV_ORDER_DATA }
  }
  if (metric === "Average sale") {
    return {
      current: CURRENT_DATA.map(
        (amount, index) => amount / CURRENT_ORDER_DATA[index],
      ),
      previous: PREV_DATA.map(
        (amount, index) => amount / PREV_ORDER_DATA[index],
      ),
    }
  }
  return { current: CURRENT_DATA, previous: PREV_DATA }
}

function formatHourlyMetric(value: number, metric: HourlySalesMetric) {
  return metric === "Order count"
    ? Math.round(value).toLocaleString("en-AU")
    : `$${value.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function HourlySalesChart({
  compareLabel,
  showComparison,
  isRefreshing,
  largeLabels = false,
  metric = "Sale amount",
}: {
  compareLabel: string
  showComparison: boolean
  isRefreshing?: boolean
  largeLabels?: boolean
  metric?: HourlySalesMetric
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { current: currentData, previous: previousData } =
    getHourlyMetricData(metric)
  const W = 600,
    H = 161
  const PAD_T = 8,
    PAD_B = 4,
    PAD_L = 0,
    PAD_R = 0
  const Y_LABEL_W = largeLabels ? 48 : 36
  const maxVal = Math.max(
    ...(showComparison ? [...currentData, ...previousData] : currentData),
  )
  const Y_TICKS = [0.25, 0.5, 0.75, 1]
  const slotW = W / currentData.length
  const barW = slotW * (showComparison ? 0.32 : 0.56)
  const groupGap = slotW * 0.06
  const baseline = H - PAD_B

  function xv(i: number) {
    return PAD_L + (i + 0.5) * slotW
  }
  function yv(v: number) {
    return PAD_T + (1 - v / (maxVal * 1.05)) * (H - PAD_T - PAD_B)
  }
  function barPath(x: number, y: number, width: number) {
    const radius = Math.min(4, width / 2, baseline - y)
    return `M ${x} ${y + radius} A ${radius} ${radius} 0 0 1 ${x + radius} ${y} H ${x + width - radius} A ${radius} ${radius} 0 0 1 ${x + width} ${y + radius} V ${baseline} H ${x} Z`
  }
  function xPct(i: number) {
    return (xv(i) / W) * 100
  }

  // label every whole hour
  const X_LABELS = ["7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm"]

  return (
    <div className="w-full flex flex-col gap-[8px]">
      <div className="flex gap-[0px] w-full">
        {/* Y-axis labels */}
        <div
          className={`relative shrink-0 font-['Inter:Regular'] leading-none ${
            largeLabels ? "text-[14px]" : "text-[10px]"
          }`}
          style={{
            width: Y_LABEL_W,
            height: H,
            color: REPORT_CHART_COLORS.axis,
          }}
        >
          {Y_TICKS.map((f) => {
            const val = Math.round(maxVal * 1.05 * f)
            const top = PAD_T + (1 - f) * (H - PAD_T - PAD_B)
            return (
              <span
                key={f}
                className="absolute right-[6px] -translate-y-1/2"
                style={{ top }}
              >
                {metric === "Order count"
                  ? val.toLocaleString("en-AU")
                  : `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              </span>
            )
          })}
        </div>

        {/* Chart area */}
        <div className="relative flex-1 min-w-0" style={{ height: H }}>
          {isRefreshing && (
            <div className="absolute inset-0 z-10 flex flex-col justify-between py-[8px] gap-[8px]">
              {[1, 2, 3].map((i) => (
                <Sk key={i} w="w-full" h="h-[20px]" />
              ))}
            </div>
          )}
          {!isRefreshing && (
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              onMouseLeave={() => setHovered(null)}
            >
              {/* Grid lines */}
              {Y_TICKS.map((f) => {
                const y = PAD_T + (1 - f) * (H - PAD_T - PAD_B)
                return (
                  <line
                    key={f}
                    x1={0}
                    y1={y}
                    x2={W}
                    y2={y}
                    stroke={REPORT_CHART_COLORS.grid}
                    strokeWidth="0.6"
                  />
                )
              })}

              {/* Previous period bars */}
              {showComparison &&
                previousData.map((value, index) => {
                  const y = yv(value)
                  return (
                    <path
                      key={`previous-${index}`}
                      d={barPath(xv(index) - groupGap / 2 - barW, y, barW)}
                      fill={REPORT_CHART_COLORS.other}
                    />
                  )
                })}

              {/* Current period bars */}
              {currentData.map((value, index) => {
                const y = yv(value)
                return (
                  <path
                    key={`current-${index}`}
                    d={barPath(
                      xv(index) + (showComparison ? groupGap / 2 : -barW / 2),
                      y,
                      barW,
                    )}
                    fill={REPORT_CHART_COLORS.primary}
                  />
                )
              })}

              {/* Invisible hover targets */}
              {currentData.map((_, i) => {
                return (
                  <rect
                    key={i}
                    x={i * slotW}
                    y={0}
                    width={slotW}
                    height={H}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                  />
                )
              })}
            </svg>
          )}

          {/* Tooltip card */}
          {!isRefreshing &&
            hovered !== null &&
            (() => {
              const pct = xPct(hovered) / 100
              const side = pct > 0.65 ? "right" : "left"
              const barCenterY = (yv(currentData[hovered]) + baseline) / 2
              const barEdgePct =
                ((barW + (showComparison ? groupGap / 2 : 0)) / W) * 100
              return (
                <div
                  className="pointer-events-none absolute z-50 bg-white border border-[#e3e2dd] rounded-[8px] shadow-[0px_4px_8px_0px_rgba(18,18,18,0.1)] px-[12px] py-[10px] flex flex-col gap-[6px] min-w-[160px]"
                  style={{
                    top: `${(barCenterY / H) * 100}%`,
                    transform: "translateY(-50%)",
                    ...(side === "left"
                      ? {
                          left: `calc(${xPct(hovered) + barEdgePct}% + 8px)`,
                        }
                      : {
                          right: `calc(${100 - xPct(hovered) + barEdgePct}% + 8px)`,
                        }),
                  }}
                >
                  <span
                    className={`font-['Inter:Medium'] text-[#22201f] leading-[20px] ${
                      largeLabels ? "text-[14px]" : "text-[12px]"
                    }`}
                  >
                    {HALF_HOURS[hovered]}
                  </span>
                  <div className="flex items-center gap-[8px]">
                    <span
                      className="inline-block size-[8px] shrink-0 rounded-full"
                      style={{ backgroundColor: REPORT_CHART_COLORS.primary }}
                    />
                    <span
                      className={`font-['Inter:Regular'] text-[#22201f] leading-[20px] ${
                        largeLabels ? "text-[14px]" : "text-[13px]"
                      }`}
                    >
                      Today
                    </span>
                    <span
                      className={`font-['Inter:Medium'] text-[#22201f] leading-[20px] ml-auto pl-[12px] ${
                        largeLabels ? "text-[14px]" : "text-[13px]"
                      }`}
                    >
                      {formatHourlyMetric(currentData[hovered], metric)}
                    </span>
                  </div>
                  {showComparison && (
                    <div className="flex items-center gap-[8px]">
                      <span
                        className="inline-block size-[8px] shrink-0 rounded-full"
                        style={{ backgroundColor: REPORT_CHART_COLORS.other }}
                      />
                      <span
                        className={`font-['Inter:Regular'] text-[#22201f] leading-[20px] flex-1 min-w-0 truncate ${
                          largeLabels ? "text-[14px]" : "text-[13px]"
                        }`}
                      >
                        {compareLabel.charAt(0).toUpperCase() +
                          compareLabel.slice(1)}
                      </span>
                      <span
                        className={`font-['Inter:Medium'] text-[#22201f] leading-[20px] ml-auto pl-[12px] ${
                          largeLabels ? "text-[14px]" : "text-[13px]"
                        }`}
                      >
                        {formatHourlyMetric(previousData[hovered], metric)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })()}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex gap-[0px] w-full">
        <div style={{ width: Y_LABEL_W }} className="shrink-0" />
        <div
          className={`relative flex-1 min-w-0 font-['Inter:Regular'] ${
            largeLabels ? "text-[14px]" : "text-[11px]"
          }`}
          style={{
            height: largeLabels ? 20 : 16,
            color: REPORT_CHART_COLORS.axis,
          }}
        >
          {X_LABELS.map((label, idx) => {
            const dataIdx = idx * 2
            return (
              <span
                key={label}
                className="absolute -translate-x-1/2"
                style={{ left: `${xPct(dataIdx)}%` }}
              >
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HourlySalesTable({
  dateSelected,
  compareSelected,
  showComparison,
  isRefreshing,
  metric,
  visibleColumnKeys,
}: {
  dateSelected: { id: string label: string }
  compareSelected: { id: string label: string }
  showComparison: boolean
  isRefreshing: boolean
  metric: HourlySalesMetric
  visibleColumnKeys: string[]
}) {
  const currentDateLabel =
    getDateRangeLabel(dateSelected.id) || dateSelected.label
  const comparisonDateLabel =
    getDateRangeLabel(compareSelected.id, dateSelected.id) ||
    compareSelected.label
  const { current: currentData, previous: previousData } =
    getHourlyMetricData(metric)
  const currentOrders = getHourlyMetricData("Order count").current
  const previousOrders = getHourlyMetricData("Order count").previous
  const chartHours = new Map(
    Array.from({ length: currentData.length / 2 }, (_, index) => [
      (Number(HALF_HOURS[index * 2].match(/^(\d+):/)?.[1]) % 12) +
        (HALF_HOURS[index * 2].includes("PM") ? 12 : 0),
      {
        current:
          metric === "Average sale"
            ? (CURRENT_DATA[index * 2] + CURRENT_DATA[index * 2 + 1]) /
              (currentOrders[index * 2] + currentOrders[index * 2 + 1])
            : currentData[index * 2] + currentData[index * 2 + 1],
        previous:
          metric === "Average sale"
            ? (PREV_DATA[index * 2] + PREV_DATA[index * 2 + 1]) /
              (previousOrders[index * 2] + previousOrders[index * 2 + 1])
            : previousData[index * 2] + previousData[index * 2 + 1],
      },
    ]),
  )
  const hours = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`,
    current: chartHours.get(hour)?.current ?? 0,
    previous: chartHours.get(hour)?.previous ?? 0,
  }))
  const allColumns = [
    { key: "hour", label: "Hour" },
    { key: "current", label: `${metric} [${currentDateLabel}]` },
    { key: "previous", label: `${metric} [${comparisonDateLabel}]` },
    { key: "difference", label: "Difference (%)" },
  ]
  const visibleColumns = visibleColumnKeys
    .map((key) => allColumns.find((column) => column.key === key))
    .filter(
      (column): column is typeof allColumns[number] =>
        !!column &&
        (showComparison ||
          (column.key !== "previous" && column.key !== "difference")),
    )
  return (
    <div className="w-full overflow-x-auto rounded-[8px] border border-[#e3e2dd]">
      <table
        aria-label="Hourly sales breakdown"
        className="w-full min-w-[560px] table-fixed border-collapse text-left"
      >
        <thead className="bg-[#f9f8f4] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]">
          <tr className="h-[44px] border-b border-[#e3e2dd]">
            {visibleColumns.map((column) => (
              <th
                key={column.key}
                className={`${
                  column.key === "hour"
                    ? "w-[22%] px-[16px]"
                    : column.key === "difference"
                      ? "w-[18%] px-[16px]"
                      : "px-[12px]"
                } text-left font-normal`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]">
          {hours.map(({ hour, current, previous }) => {
            const difference =
              previous === 0 ? null : ((current - previous) / previous) * 100
            return (
              <tr
                key={hour}
                className="h-[44px] border-b border-[#e3e2dd] last:border-b-0"
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column.key}
                    className={`${
                      column.key === "hour"
                        ? "px-[16px]"
                        : column.key === "difference"
                          ? "px-[16px]"
                          : "px-[12px]"
                    } text-left font-['Inter:Regular'] ${
                      column.key === "difference"
                        ? difference === null
                          ? "text-[#62615d]"
                          : difference >= 0
                            ? "text-[#008e13]"
                            : "text-[#8e1311]"
                        : ""
                    }`}
                  >
                    {column.key === "hour" ? (
                      hour
                    ) : column.key === "current" ? (
                      isRefreshing ? (
                        <Sk w="w-[64px]" />
                      ) : (
                        formatHourlyMetric(current, metric)
                      )
                    ) : column.key === "previous" ? (
                      !showComparison ? (
                        "—"
                      ) : isRefreshing ? (
                        <Sk w="w-[64px]" />
                      ) : (
                        formatHourlyMetric(previous, metric)
                      )
                    ) : isRefreshing ? (
                      <Sk w="w-[48px]" />
                    ) : difference === null || !showComparison ? (
                      "—"
                    ) : (
                      `${difference > 0 ? "+" : ""}${difference.toFixed(1)}%`
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Sk({ w, h = "h-[16px]" }: { w: string h?: string }) {
  return <span className={`skeleton ${w} ${h} align-middle`} />
}

function KpiCard({
  label,
  value,
  change,
  changeColor,
  compareLabel,
  showComparison,
  isRefreshing,
  compact = false,
  infoIconRight = false,
  tooltip,
}: {
  label: string
  value: string
  change?: string
  changeColor?: string
  compareLabel?: string
  showComparison: boolean
  isRefreshing?: boolean
  compact?: boolean
  infoIconRight?: boolean
  tooltip?: string
}) {
  return (
    <WidgetCard className="flex-1 min-w-0">
      <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
        <div className="flex w-full items-center gap-[8px]">
          <div className="flex min-w-0 flex-1 items-center gap-[4px]">
            <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
              {label}
            </span>
            {!infoIconRight && (
              <InfoIcon
                tooltip={tooltip ?? `${label} for the selected period`}
              />
            )}
          </div>
          {infoIconRight && (
            <InfoIcon tooltip={tooltip ?? `${label} for the selected period`} />
          )}
        </div>
        <div className="flex flex-col gap-[8px] items-start w-full">
          {isRefreshing ? (
            <Sk w="w-[100px]" h={compact ? "h-[24px]" : "h-[32px]"} />
          ) : (
            <span
              className={`font-['Inter:Semibold'] text-[#22201f] ${
                compact
                  ? "text-[18px] leading-[24px]"
                  : "text-[24px] leading-[32px]"
              } block w-full`}
            >
              {value}
            </span>
          )}
          {showComparison &&
            change &&
            (isRefreshing ? (
              <Sk w="w-[160px]" h="h-[16px]" />
            ) : (
              <p className="text-[0px] leading-[0] w-full">
                <span
                  className={`font-['Inter:Semi_Bold'] font-semibold text-[14px] leading-[24px] ${changeColor}`}
                >
                  {change}{" "}
                </span>
                <span className="text-[#62615d] text-[14px] leading-[20px]">
                  vs{" "}
                  {compareLabel
                    ? lowercaseFirstLetter(compareLabel)
                    : "previous period"}
                </span>
              </p>
            ))}
        </div>
      </div>
    </WidgetCard>
  )
}

function ProductRow({
  rank,
  name,
  count,
  change,
  positive,
  showComparison,
  isRefreshing,
}: {
  rank: number
  name: string
  count: number
  change: string
  positive: boolean
  showComparison: boolean
  isRefreshing?: boolean
}) {
  return (
    <>
      <div className="flex gap-[8px] items-center px-[4px] w-full">
        <div className="flex gap-[8px] items-center flex-1 min-w-0">
          <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px] w-[10px] shrink-0">
            {rank}
          </span>
          <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] flex-1 min-w-0 truncate">
            {name}
          </span>
        </div>
        {isRefreshing ? (
          <Sk w="w-[28px]" />
        ) : (
          <span className="font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[24px] whitespace-nowrap">
            {count}
          </span>
        )}
        {showComparison &&
          (isRefreshing ? (
            <Sk w="w-[44px]" />
          ) : (
            <span
              className={`font-['Inter:Semibold'] text-[14px] leading-[24px] text-right w-[60px] ${
                positive ? "text-[#008e13]" : "text-[#8e1311]"
              }`}
            >
              {change}
            </span>
          ))}
      </div>
      <div className="relative h-0 w-full shrink-0">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgRowLine} />
        </div>
      </div>
    </>
  )
}

function TopListCard({
  title,
  items,
  compareLabel,
  showComparison,
  isRefreshing,
  onExportPng,
  onViewMethodology,
  onSeeMore,
}: {
  title: string
  compareLabel: string
  showComparison: boolean
  isRefreshing?: boolean
  items: Array<{
    rank: number
    name: string
    count: number
    change: string
    positive: boolean
  }>
  onExportPng: () => void
  onViewMethodology: () => void
  onSeeMore: () => void
}) {
  const top = items[0]
  return (
    <WidgetCard className="flex-1 min-w-0 self-stretch">
      <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
        <div className="flex gap-[8px] items-center w-full shrink-0">
          <div className="flex flex-1 min-w-0 items-center gap-[4px]">
            <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
              {title}
            </span>
            <InfoIcon tooltip={title} />
          </div>
          <MetricMoreMenu
            onExportPng={onExportPng}
            onViewMethodology={onViewMethodology}
          />
        </div>
        {/* Highlight — #1 item */}
        <div className="flex flex-col gap-[4px] items-start shrink-0 w-full">
          {isRefreshing ? (
            <Sk w="w-[80px]" h="h-[32px]" />
          ) : (
            <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px] truncate w-full">
              {top.name}
            </span>
          )}
          {showComparison && isRefreshing ? (
            <Sk w="w-[180px]" h="h-[16px]" />
          ) : (
            showComparison && (
              <p className="text-[0px] leading-[0] w-full">
                <span className="font-['Inter:Semi_Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px]">
                  {top.count} units sold •{" "}
                </span>
                <span
                  className={`font-['Inter:Semi_Bold'] font-semibold text-[14px] leading-[20px] ${
                    top.positive ? "text-[#008e13]" : "text-[#8e1311]"
                  }`}
                >
                  {top.change}{" "}
                </span>
                <span className="font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                  vs {lowercaseFirstLetter(compareLabel)}
                </span>
              </p>
            )
          )}
        </div>
        <div className="h-px w-full shrink-0 bg-[#e3e2dd]" />
        <div className="flex flex-col gap-[12px] items-start w-full flex-1">
          {items.map((item) => (
            <ProductRow
              key={item.rank}
              {...item}
              showComparison={showComparison}
              isRefreshing={isRefreshing}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onSeeMore}
          className="cursor-pointer font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] hover:underline"
        >
          Drill in
        </button>
      </div>
    </WidgetCard>
  )
}

function SiteTableRow({
  rank,
  name,
  today,
  last,
  diff,
  positive,
  showComparison,
  isRefreshing,
}: {
  rank: number
  name: string
  today: string
  last: string
  diff: string
  positive: boolean
  showComparison: boolean
  isRefreshing?: boolean
}) {
  return (
    <div className="h-[48px] border-b border-[#e3e2dd] flex gap-[16px] items-center pl-[4px] pr-[12px] w-full">
      <span className="font-['Inter:Regular'] text-[#62615d] text-[13px] leading-[24px] w-[20px] shrink-0 text-right">
        {rank}
      </span>
      <span className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] flex-1 min-w-0">
        {name}
      </span>
      {isRefreshing ? (
        <Sk w="w-[72px]" h="h-[16px]" />
      ) : (
        <span className="font-['Inter:Regular'] text-black text-[14px] leading-[24px] text-right w-[120px] shrink-0">
          {today}
        </span>
      )}
      {showComparison &&
        (isRefreshing ? (
          <Sk w="w-[72px]" h="h-[16px]" />
        ) : (
          <span className="font-['Inter:Regular'] text-black text-[14px] leading-[24px] text-right w-[120px] shrink-0">
            {last}
          </span>
        ))}
      {showComparison &&
        (isRefreshing ? (
          <Sk w="w-[48px]" h="h-[16px]" />
        ) : (
          <span
            className={`font-['Inter:Semibold'] text-[14px] leading-[24px] text-right w-[120px] shrink-0 ${
              positive ? "text-[#008e13]" : "text-[#8e1311]"
            }`}
          >
            {diff}
          </span>
        ))}
    </div>
  )
}

// ─── More Menu ───────────────────────────────────────────────────────────────

const imgModalClose = `${assetPathPrefix}/a578b.svg`

// ─── Save View Modal ──────────────────────────────────────────────────────────

// ─── Toast ───────────────────────────────────────────────────────────────────

type ToastContent = string | {
  message: string
  actionLabel?: string
  onAction?: () => void
}

function Toast({
  message,
  actionLabel,
  onAction,
  onDone,
}: {
  message: string
  actionLabel?: string
  onAction?: () => void
  onDone: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[24px] left-1/2 z-[200] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-[10px] rounded-[10px] bg-[#22201f] px-[16px] py-[12px] font-['Inter:Regular'] text-center text-[14px] leading-[20px] text-white shadow-[0px_4px_16px_0px_rgba(18,18,18,0.2)]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0"
      >
        <circle cx="8" cy="8" r="7" stroke="#4ade80" strokeWidth="1.5" />
        <path
          d="M5 8l2 2 4-4"
          stroke="#4ade80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 font-['Inter:Semibold'] text-white underline underline-offset-2 hover:text-[#d5e9ff]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// ─── Save Filters Modal ───────────────────────────────────────────────────────

function SaveViewModal({
  onClose,
  onSave,
  onUpdate,
  existingFilters,
  hasExisting,
  suggestedName,
  suggestedDescription,
  initialMode = "new",
  initialExistingName,
  initialSharedWithTeam = false,
  sharedExistingFilters = [],
}: {
  onClose: () => void
  onSave: (name: string, description: string, sharedWithTeam: boolean) => void
  onUpdate: (name: string, sharedWithTeam: boolean) => void
  existingFilters: string[]
  hasExisting: boolean
  suggestedName: string
  suggestedDescription: string
  initialMode?: "existing" | "new"
  initialExistingName?: string | null
  initialSharedWithTeam?: boolean
  sharedExistingFilters?: string[]
}) {
  const [mode, setMode] = useState<"existing" | "new">(initialMode)
  const [selectedExisting, setSelectedExisting] = useState(
    initialExistingName && existingFilters.includes(initialExistingName)
      ? initialExistingName
      : (existingFilters[0] ?? ""),
  )
  const [newName, setNewName] = useState(suggestedName)
  const [description, setDescription] = useState("Custom report")
  const [sharedWithTeam, setSharedWithTeam] = useState(initialSharedWithTeam)

  function chooseMode(nextMode: "existing" | "new") {
    setMode(nextMode)
    setSharedWithTeam(
      nextMode === "existing" &&
        sharedExistingFilters.includes(selectedExisting),
    )
  }

  const canSave = mode === "existing" ? !!selectedExisting : !!newName.trim()

  function handleSave() {
    if (!canSave) return
    if (mode === "existing") {
      onUpdate(selectedExisting, sharedWithTeam)
    } else {
      onSave(newName.trim(), description.trim(), sharedWithTeam)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(70,74,81,0.6)]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[12px] shadow-[0px_8px_8px_0px_rgba(18,18,18,0.04),0px_4px_4px_0px_rgba(18,18,18,0.08),0px_1px_1px_0px_rgba(18,18,18,0.12)] p-[24px] flex flex-col gap-[24px] w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heading */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex gap-[16px] items-start">
            <p className="font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[32px] flex-1 min-w-0">
              Save view
            </p>
            <button
              onClick={onClose}
              className="shrink-0 size-[16px] mt-[8px] hover:opacity-70 transition-opacity"
            >
              <img
                alt="Close"
                className="block size-full"
                src={imgModalClose}
              />
            </button>
          </div>
          <p className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px]">
            Keep these filters and its comparisons and open it again with fresh
            data.
          </p>
        </div>

        {/* Mode selection — only when saved views exist */}
        {hasExisting && (
          <div className="flex flex-col gap-[12px]">
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  mode === "existing" ? "border-[#1e72c4]" : "border-[#bbbab6]"
                }`}
                onClick={() => chooseMode("existing")}
              >
                {mode === "existing" && (
                  <div className="size-[8px] rounded-full bg-[#1e72c4]" />
                )}
              </div>
              <span
                className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]"
                onClick={() => chooseMode("existing")}
              >
                Update existing report
              </span>
            </label>
            {mode === "existing" && (
              <div className="relative ml-[26px] w-[calc(100%-26px)]">
                <select
                  className="block appearance-none bg-white border border-[#bbbab6] rounded-[8px] h-[40px] pl-[12px] pr-[36px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4]"
                  value={selectedExisting}
                  onChange={(e) => {
                    setSelectedExisting(e.target.value)
                    setSharedWithTeam(
                      sharedExistingFilters.includes(e.target.value),
                    )
                  }}
                >
                  {existingFilters.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="m4 6 4 4 4-4"
                    stroke="#22201f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  mode === "new" ? "border-[#1e72c4]" : "border-[#bbbab6]"
                }`}
                onClick={() => chooseMode("new")}
              >
                {mode === "new" && (
                  <div className="size-[8px] rounded-full bg-[#1e72c4]" />
                )}
              </div>
              <span
                className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]"
                onClick={() => chooseMode("new")}
              >
                Save new report
              </span>
            </label>
            {mode === "new" && (
              <div
                className="flex flex-col gap-[4px] ml-[26px]"
                style={{ width: "calc(100% - 26px)" }}
              >
                <input
                  className="bg-white border border-[#bbbab6] rounded-[8px] h-[40px] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
                  placeholder="View name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <label className="mt-[12px] flex flex-col gap-[4px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                  Description
                  <textarea
                    aria-label="Description (optional)"
                    className="min-h-[80px] resize-y rounded-[8px] border border-[#bbbab6] px-[12px] py-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
                    placeholder="Add a description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* Simple name input — when no saved views exist */}
        {!hasExisting && (
          <div className="flex flex-col gap-[4px]">
            <label className="font-['Inter:Semi Bold'] font-semibold text-[#22201f] text-[14px] leading-[20px] tracking-[0.014px]">
              Name
            </label>
            <input
              className="bg-white border border-[#bbbab6] rounded-[8px] h-[40px] px-[12px] font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[24px] w-full outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <label className="mt-[12px] flex flex-col gap-[4px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
              Description
              <textarea
                aria-label="Description (optional)"
                className="min-h-[80px] resize-y rounded-[8px] border border-[#bbbab6] px-[12px] py-[8px] font-['Inter:Regular'] text-[14px] leading-[20px] outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
                placeholder="Add a description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-[10px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]">
          <input
            type="checkbox"
            checked={sharedWithTeam}
            onChange={(event) => setSharedWithTeam(event.target.checked)}
            className="size-[16px] accent-[#1e72c4]"
          />
          Share report with team
        </label>

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
  )
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
  savedFilters: Array<{ name: string }>
  defaultView: string | null
  onClose: () => void
  onApplyDefault: () => void
  onApplyFilter: (name: string) => void
  onSetDefault: (name: string) => void
  onEditFilter: (name: string) => void
  onSaveView: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDropdownClose(ref, onClose)

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
            onClick={() => {
              onApplyDefault()
              onClose()
            }}
          >
            Default
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-[#e3e2dd]" />
      <div className="p-[4px]">
        <div className="flex items-center px-[12px] pb-[4px] pt-[8px] font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
          My saved views
        </div>
        {savedFilters.length === 0 ? (
          <div className="mx-[4px] mb-[4px] rounded-[8px] bg-[#f9f8f4] px-[12px] py-[16px] text-center">
            <p className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
              No saved views yet
            </p>
            <p className="mt-[4px] font-['Inter:Regular'] text-[#62615d] text-[12px] leading-[16px]">
              Save your filter selection to quickly access it later.
            </p>
          </div>
        ) : (
          savedFilters.map((filter) => (
            <div
              key={filter.name}
              className="group flex h-[36px] items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] hover:bg-[#f9f8f4]"
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]"
                onClick={() => {
                  onApplyFilter(filter.name)
                  onClose()
                }}
              >
                {filter.name}
              </button>
              <span className="group/star relative shrink-0">
                <button
                  type="button"
                  aria-label={`Set ${filter.name} as default view`}
                  aria-pressed={defaultView === filter.name}
                  disabled={defaultView === filter.name}
                  className={`rounded-[4px] p-[4px] transition-colors hover:bg-[#edeae4] ${
                    defaultView === filter.name
                      ? "text-[#22201f]"
                      : "text-[#777671]"
                  }`}
                  onClick={() => onSetDefault(filter.name)}
                >
                  <svg
                    aria-hidden="true"
                    className="size-[16px]"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="m8 1.5 1.9 3.85 4.25.62-3.08 3 .73 4.23L8 11.2l-3.8 2 .73-4.23-3.08-3 4.25-.62L8 1.5Z"
                      fill={
                        defaultView === filter.name ? "currentColor" : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-[6px] hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#22201f] px-[8px] py-[6px] font-['Inter:Regular'] text-[12px] leading-[16px] text-white group-hover/star:block"
                >
                  {defaultView === filter.name
                    ? "Default view"
                    : "Set as default"}
                </span>
              </span>
              <Tooltip text="Settings">
                <button
                  type="button"
                  aria-label={`Settings for ${filter.name}`}
                  className="shrink-0 rounded-[4px] p-[4px] text-[#777671] opacity-60 hover:bg-[#edeae4] hover:opacity-100"
                  onClick={() => {
                    onEditFilter(filter.name)
                    onClose()
                  }}
                >
                  <img alt="" className="block size-[16px]" src={imgCog} />
                </button>
              </Tooltip>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-[#e3e2dd] p-[8px]">
        <button
          type="button"
          className="flex h-[32px] w-full items-center justify-center rounded-[8px] bg-[#1e72c4] px-[12px] text-center font-['Inter:Semibold'] text-[14px] leading-[20px] text-white transition-colors hover:bg-[#1558a0]"
          onClick={() => {
            onSaveView()
            onClose()
          }}
        >
          Save this view
        </button>
      </div>
    </div>
  )
}

function EditSavedViewModal({
  name,
  description,
  sharedWithTeam = false,
  existingNames,
  onClose,
  onSave,
}: {
  name: string
  description: string
  sharedWithTeam?: boolean
  existingNames: string[]
  onClose: () => void
  onSave: (name: string, description: string, sharedWithTeam: boolean) => void
}) {
  const [newName, setNewName] = useState(name)
  const [newDescription, setNewDescription] = useState(description)
  const [isSharedWithTeam, setIsSharedWithTeam] = useState(sharedWithTeam)
  const trimmedName = newName.trim()
  const canRename =
    trimmedName.length > 0 &&
    (trimmedName === name || !existingNames.includes(trimmedName))
  const saveChanges = () =>
    onSave(trimmedName, newDescription.trim(), isSharedWithTeam)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(70,74,81,0.6)] p-[16px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-saved-view-title"
        className="flex w-full max-w-[400px] flex-col gap-[24px] rounded-[12px] bg-white p-[24px] shadow-[0px_8px_8px_0px_rgba(18,18,18,0.04),0px_4px_4px_0px_rgba(18,18,18,0.08),0px_1px_1px_0px_rgba(18,18,18,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <div className="flex items-start gap-[16px]">
            <h2
              id="edit-saved-view-title"
              className="min-w-0 flex-1 font-['Inter:Semibold'] text-[#22201f] text-[18px] leading-[28px]"
            >
              Report settings
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="mt-[4px] size-[16px] shrink-0 hover:opacity-70"
            >
              <img alt="" className="block size-full" src={imgModalClose} />
            </button>
          </div>
          <p className="mt-[4px] font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
            Filters can't be changed from here.
          </p>
        </div>

        <div className="flex flex-col gap-[16px]">
          <label className="flex flex-col gap-[6px] font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
            View name
            <input
              autoFocus
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canRename) saveChanges()
              }}
              className="h-[40px] w-full rounded-[8px] border border-[#bbbab6] bg-white px-[12px] font-['Inter:Regular'] text-[14px] outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
            />
          </label>
          <label className="flex flex-col gap-[6px] font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
            Description
            <textarea
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              rows={3}
              className="w-full resize-y rounded-[8px] border border-[#bbbab6] bg-white px-[12px] py-[10px] font-['Inter:Regular'] text-[14px] leading-[20px] outline-none focus:border-[#1e72c4] focus:ring-1 focus:ring-[#1e72c4]"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-[10px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]">
            <input
              type="checkbox"
              checked={isSharedWithTeam}
              onChange={(event) => setIsSharedWithTeam(event.target.checked)}
              className="size-[16px] accent-[#1e72c4]"
            />
            Share with company
          </label>
        </div>

        <div className="flex">
          <ActionButton
            variant="primary"
            className="w-full"
            onClick={saveChanges}
            disabled={!canRename}
          >
            Save changes
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

function DeleteSavedReportModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(34,32,31,0.48)] p-[16px]"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-saved-report-title"
        aria-describedby="delete-saved-report-description"
        className="flex w-full max-w-[400px] flex-col gap-[24px] rounded-[12px] bg-white p-[24px] shadow-[0px_8px_16px_rgba(18,18,18,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between gap-[16px]">
            <h2
              id="delete-saved-report-title"
              className="font-['Inter:Semibold'] text-[18px] leading-[28px] text-[#22201f]"
            >
              Delete report?
            </h2>
            <button
              type="button"
              aria-label="Close delete confirmation"
              onClick={onCancel}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[#22201f] hover:bg-[#f4f3ef]"
            >
              <svg
                aria-hidden="true"
                className="size-[24px]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <p
            id="delete-saved-report-description"
            className="font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f]"
          >
            This report will be permanently deleted. If you’ve shared it, your
            team will lose access too.
          </p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-[40px] w-full items-center justify-center rounded-[8px] border border-[#ffd4d2] bg-[#fff4f3] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#a51d18] shadow-[0px_1px_2px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#ffe9e7]"
        >
          Delete report
        </button>
      </div>
    </div>
  )
}

// ─── Widget Card ─────────────────────────────────────────────────────────────

function WidgetCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`relative group ${className}`}>{children}</div>
}

// ─── App ─────────────────────────────────────────────────────────────────────

const prototypeVersions = [
  {
    version: "Version 1",
    updated: "24 September 2026",
    description:
      "Saved filters, and filtering pattern based on the new prod management system.",
    href: `${import.meta.env.BASE_URL}version-1`,
  },
  {
    version: "Version 3A",
    updated: "30 September 2026",
    description:
      "Reports library and reporting views for continued exploration.",
    href: `${import.meta.env.BASE_URL}version-3a`,
  },
  {
    version: "Version 5",
    updated: "30 October 2026",
    description: "A duplicate of Version 3B for continued exploration.",
    href: `${import.meta.env.BASE_URL}version-5`,
  },
]

function PrototypeHome() {
  return (
    <main className="min-h-screen bg-[#f9f8f4] px-[24px] py-[48px] sm:px-[40px] sm:py-[72px]">
      <div className="mx-auto flex w-full max-w-[960px] flex-col">
        <header className="mb-[36px] max-w-[620px]">
          <h1 className="font-['Inter:Semibold'] text-[#22201f] text-[36px] leading-[44px] tracking-[-0.04em] sm:text-[44px] sm:leading-[52px]">
            Back Office Reports
          </h1>
          <p className="mt-[14px] max-w-[560px] font-['Inter:Regular'] text-[#62615d] text-[16px] leading-[26px]">
            Browse and compare the latest explorations for Back Office
            reporting.
          </p>
        </header>

        <section aria-labelledby="versions-heading">
          <div className="mb-[14px] flex items-center justify-between">
            <h2
              id="versions-heading"
              className="font-['Inter:Semibold'] text-[#22201f] text-[16px] leading-[24px]"
            >
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
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 8h10M8 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ActionButton>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-[48px] border-t border-[#e3e2dd] pt-[16px] font-['Inter:Regular'] text-[#85837e] text-[12px] leading-[18px]">
          Prototype explorations are for review and may not reflect final
          product behavior.
        </footer>
      </div>
    </main>
  )
}

export default function VersionFive() {
  const versionOnePath = `${import.meta.env.BASE_URL}version-1`.replace(
    /\/+$/,
    "",
  )
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/"

  if (currentPath === versionOnePath) return <VersionOnePrototype />
  return <ReportsPrototype />
}

function ReportsPrototype() {
  const initialSalesStorage: SalesOverviewStorage = {
    savedFilters: [],
    defaultView: "__system__",
  }
  const initialSalesDefault = initialSalesStorage.savedFilters.find(
    (view) => view.name === initialSalesStorage.defaultView,
  )
  const [activeReport, setActiveReport] = useState<ReportName>("Overview")
  const [activeReportsNavigation, setActiveReportsNavigation] =
    useState<"All reports" | null>(null)
  const [reportReturnPage, setReportReturnPage] =
    useState<"All reports" | "Lightspeed reports" | "Shared reports" | "My reports">(
      "All reports",
    )
  const [productSalesEntryDimension, setProductSalesEntryDimension] =
    useState<string | null>(null)
  const [requestedSavedViewName, setRequestedSavedViewName] =
    useState<string | null>(null)
  const [isViewingSharedReport, setIsViewingSharedReport] = useState(false)
  const [selectedDirectoryReport, setSelectedDirectoryReport] =
    useState<DirectoryReport | null>(null)
  const [selectedReconciliationTaking, setSelectedReconciliationTaking] =
    useState<typeof RECONCILIATION_ROWS[number] | null>(null)
  const [reconciliationFiltersChanged, setReconciliationFiltersChanged] =
    useState(false)
  const [showSavedViewMenu, setShowSavedViewMenu] = useState(false)
  const [showDeleteSavedReport, setShowDeleteSavedReport] = useState(false)
  const [showSalesFeedActionsMenu, setShowSalesFeedActionsMenu] =
    useState(false)
  const [showProductSalesActionsMenu, setShowProductSalesActionsMenu] =
    useState(false)
  const [isCustomiseDashboardOpen, setIsCustomiseDashboardOpen] =
    useState(false)
  const [visibleOverviewWidgets, setVisibleOverviewWidgets] =
    useState<string[]>(defaultOverviewDashboardWidgets)
  const [showSalesFeedSaveReport, setShowSalesFeedSaveReport] = useState(false)
  const [showProductSalesSaveReport, setShowProductSalesSaveReport] =
    useState(false)
  const [hourlySalesViews, setHourlySalesViews] = useState<HourlySalesView[]>(
    () =>
      loadStoredValue<HourlySalesStorage>(HOURLY_SALES_STORAGE_KEY, {
        savedViews: [],
        defaultView: "__system__",
      }).savedViews,
  )
  const hourlySalesColumnDefinitions = [
    { key: "hour", label: "Hour" },
    { key: "current", label: "Current period" },
    { key: "previous", label: "Previous period" },
    { key: "difference", label: "Difference (%)" },
  ]
  const [visibleHourlySalesColumnKeys, setVisibleHourlySalesColumnKeys] =
    useState(hourlySalesColumnDefinitions.map((column) => column.key))
  const [hourlySalesColumnOrder, setHourlySalesColumnOrder] = useState(
    hourlySalesColumnDefinitions.map((column) => column.key),
  )
  const [isHourlySalesColumnsOpen, setIsHourlySalesColumnsOpen] =
    useState(false)
  function toggleHourlySalesColumn(key: string) {
    setVisibleHourlySalesColumnKeys((current) =>
      current.includes(key)
        ? current.length === 1
          ? current
          : current.filter((columnKey) => columnKey !== key)
        : hourlySalesColumnOrder.filter(
            (columnKey) => current.includes(columnKey) || columnKey === key,
          ),
    )
  }
  function reorderHourlySalesColumns(sourceKey: string, targetKey: string) {
    setHourlySalesColumnOrder((current) => {
      const sourceIndex = current.indexOf(sourceKey)
      const targetIndex = current.indexOf(targetKey)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const next = [...current]
      next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, sourceKey)
      return next
    })
    setVisibleHourlySalesColumnKeys((current) => {
      const sourceIndex = current.indexOf(sourceKey)
      const targetIndex = current.indexOf(targetKey)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const next = [...current]
      next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, sourceKey)
      return next
    })
  }
  const [isTransactionInvoiceOpen, setIsTransactionInvoiceOpen] =
    useState(false)
  const savedViewMenuRef = useRef<HTMLDivElement>(null)
  const savedViewHeaderActions = useRef<SavedViewHeaderActions | null>(null)
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(
    initialSalesDefault?.sites ?? [],
  )
  const [selectedRegisters, setSelectedRegisters] = useState<string[]>(
    initialSalesDefault?.registers ?? [],
  )
  const [taxSelected, setTaxSelected] = useState(
    initialSalesDefault?.tax ?? "Inclusive",
  )
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [dateSelected, setDateSelected] = useState<{
    id: string
    label: string
  }>(initialSalesDefault?.date ?? { id: "today", label: "Today" })
  const [hourlySalesMetric, setHourlySalesMetric] =
    useState<HourlySalesMetric>("Sale amount")
  const [showDeletedSites, setShowDeletedSites] = useState(true)
  const [includeDeletedRegisters, setIncludeDeletedRegisters] = useState(true)
  const [compareSelected, setCompareSelected] = useState<{
    id: string
    label: string
  }>(
    initialSalesDefault?.compare ?? {
      id: "last-same-day",
      label: `Last ${TODAY_NAME}`,
    },
  )
  const showComparison = compareSelected.id !== "none"
  const [activeViewName, setActiveViewName] = useState<string | null>(
    initialSalesDefault?.name ?? null,
  )
  const [defaultView, setDefaultView] = useState<string | null>(
    initialSalesStorage.defaultView,
  )
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingSavedViewName, setEditingSavedViewName] =
    useState<string | null>(null)
  const [toast, setToast] = useState<ToastContent | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(
    () => new Date(Date.now() - 2 * 60_000),
  )
  const [now, setNow] = useState<Date>(() => new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useDropdownClose(savedViewMenuRef, () => {
    setShowSavedViewMenu(false)
    setShowSalesFeedActionsMenu(false)
  })
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  function refreshData() {
    setIsRefreshing(true)
    setLastUpdated(new Date())
    setNow(new Date())
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }

  const minutesSinceUpdate = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / 60000,
  )

  const [savedFilters, setSavedFilters] = useState<SalesOverviewView[]>(
    initialSalesStorage.savedFilters,
  )
  useEffect(() => {
    window.localStorage.setItem(
      HOURLY_SALES_STORAGE_KEY,
      JSON.stringify({
        savedViews: hourlySalesViews,
        defaultView: "__system__",
      } satisfies HourlySalesStorage),
    )
  }, [hourlySalesViews])
  const selectedSites = SITE_OPTIONS.slice(1).filter((site) =>
    selectedSiteIds.includes(site.id),
  )
  const siteLabel =
    selectedSites.length === 0
      ? "All sites"
      : selectedSites.length > 1
        ? `${selectedSites.length} sites`
        : selectedSites[0].name
  const registerLabel =
    selectedRegisters.length > 0
      ? `${selectedRegisters.length} selected`
      : "All"
  const suggestedViewName =
    [
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
    ]
      .filter(Boolean)
      .join(" - ") || "Overview"
  const suggestedDescription = buildSmartReportDescription("Overview", [
    `sites: ${siteLabel}`,
    `registers: ${registerLabel}`,
    `date: ${dateSelected.label}`,
    `comparison: ${compareSelected.label}`,
    `tax: ${taxSelected}`,
  ])
  const hourlySalesSuggestedName = [
    "Hourly sales",
    selectedSites.length === 1
      ? selectedSites[0].name.split(" – ")[0]
      : selectedSites.length > 1
        ? `${selectedSites.length} sites`
        : "",
    dateSelected.id === "today" ? "" : dateSelected.label,
  ]
    .filter(Boolean)
    .join(" - ")
  const hourlySalesSuggestedDescription = buildSmartReportDescription(
    "Hourly sales",
    [
      `sites: ${siteLabel}`,
      `registers: ${registerLabel}`,
      `date: ${dateSelected.label}`,
      `comparison: ${compareSelected.label}`,
      `show: ${hourlySalesMetric.toLowerCase()}`,
    ],
  )

  const requestedHourlySalesView = hourlySalesViews.find(
    (view) => view.name === requestedSavedViewName,
  )
  const hourlySalesHasChangedFilters = requestedSavedViewName
    ? isViewingSharedReport || !requestedHourlySalesView
      ? selectedSiteIds.length > 0 ||
        selectedRegisters.length > 0 ||
        dateSelected.id !== "today" ||
        compareSelected.id !== "last-same-day" ||
        hourlySalesMetric !== "Sale amount"
      : JSON.stringify({
          sites: requestedHourlySalesView.sites,
          registers: requestedHourlySalesView.registers,
          date: requestedHourlySalesView.date,
          compare: requestedHourlySalesView.compare,
          metric: requestedHourlySalesView.metric,
        }) !==
        JSON.stringify({
          sites: selectedSiteIds,
          registers: selectedRegisters,
          date: dateSelected,
          compare: compareSelected,
          metric: hourlySalesMetric,
        })
    : selectedSiteIds.length > 0 ||
      selectedRegisters.length > 0 ||
      dateSelected.id !== "today" ||
      compareSelected.id !== "last-same-day" ||
      hourlySalesMetric !== "Sale amount"
  const requestedSavedView = savedFilters.find(
    (filter) => filter.name === requestedSavedViewName,
  )
  const hasChangedSavedView = requestedSavedViewName
    ? isViewingSharedReport || !requestedSavedView
      ? selectedSiteIds.length > 0 ||
        selectedRegisters.length > 0 ||
        dateSelected.id !== "today" ||
        compareSelected.id !== "last-same-day" ||
        taxSelected !== "Inclusive"
      : JSON.stringify({
          sites: requestedSavedView.sites ?? [],
          registers: requestedSavedView.registers ?? [],
          date: requestedSavedView.date,
          compare: requestedSavedView.compare,
          tax: requestedSavedView.tax,
        }) !==
        JSON.stringify({
          sites: selectedSiteIds,
          registers: selectedRegisters,
          date: dateSelected,
          compare: compareSelected,
          tax: taxSelected,
        })
    : selectedSiteIds.length > 0 ||
      selectedRegisters.length > 0 ||
      dateSelected.id !== "today" ||
      compareSelected.id !== "last-same-day" ||
      taxSelected !== "Inclusive"

  function applyFilter(view: SalesOverviewView) {
    setSelectedSiteIds(view.sites)
    setSelectedRegisters(view.registers)
    setDateSelected(view.date)
    setCompareSelected(view.compare)
    setTaxSelected(view.tax)
    setActiveViewName(view.name)
  }

  function applyDefaultView() {
    const savedDefault = savedFilters.find(
      (filter) => filter.name === defaultView,
    )
    if (savedDefault) applyFilter(savedDefault)
    else reset()
  }

  function resetActiveReportFilters() {
    if (activeReport === "Hourly sales") {
      resetHourlySalesFilters()
    } else if (activeReport === "Overview" && isViewingSharedReport) {
      reset()
    } else if (isViewingSharedReport) {
      resetSharedReportFilters()
    } else if (requestedSavedViewName) {
      savedViewHeaderActions.current?.reset?.()
    }
  }

  useEffect(() => {
    window.localStorage.setItem(
      SALES_OVERVIEW_STORAGE_KEY,
      JSON.stringify({
        savedFilters,
        defaultView,
      } satisfies SalesOverviewStorage),
    )
  }, [savedFilters, defaultView])

  function selectReport(report: ReportName) {
    if (report !== activeReport) resetActiveReportFilters()
    if (report !== activeReport) refreshData()
    if (report === "Transactions") setIsTransactionInvoiceOpen(false)
    if (report === "Product sales") setProductSalesEntryDimension(null)
    setActiveReportsNavigation(null)
    savedViewHeaderActions.current = null
    setRequestedSavedViewName(null)
    setIsViewingSharedReport(false)
    setSelectedDirectoryReport(null)
    setActiveReport(report)
    if (report === "Overview") applyDefaultView()
  }

  function selectSidebarReport(report: ReportName) {
    if (report === "All reports") {
      selectReport("Lightspeed reports")
      setActiveReportsNavigation("All reports")
      return
    }
    selectReport(report)
  }

  function selectReportsTab(
    page: "Lightspeed reports" | "Shared reports" | "My reports" | "All reports",
  ) {
    selectReport(page)
    setActiveReportsNavigation("All reports")
  }

  function selectDirectoryReport(
    report: DirectoryReport,
    source: "All reports" | "Lightspeed reports" | "Shared reports" | "My reports",
  ) {
    if (
      requestedSavedViewName &&
      (report.report !== activeReport ||
        report.viewName !== requestedSavedViewName)
    ) {
      resetActiveReportFilters()
    }
    setSelectedReconciliationTaking(null)
    if (report.report !== activeReport) refreshData()
    if (report.report === "Transactions") setIsTransactionInvoiceOpen(false)
    if (report.report === "Product sales") setProductSalesEntryDimension(null)
    setReportReturnPage(
      source === "All reports" ? "Lightspeed reports" : source,
    )
    setActiveReportsNavigation("All reports")
    savedViewHeaderActions.current = null
    if (report.report === "Hourly sales") {
      savedViewHeaderActions.current = {
        rename: () => setEditingSavedViewName(report.viewName ?? ""),
        delete: () => {},
        export: () => setToast("CSV file downloaded"),
        customiseColumns: () => setIsHourlySalesColumnsOpen(true),
      }
    }
    setRequestedSavedViewName(report.viewName ?? null)
    setIsViewingSharedReport(source === "Shared reports")
    setSelectedDirectoryReport(report)
    setActiveReport(report.report)
    if (
      report.viewName &&
      report.report === "Overview" &&
      source !== "Shared reports"
    ) {
      const view = savedFilters.find(
        (filter) => filter.name === report.viewName,
      )
      if (view) applyFilter(view)
    }
    if (
      report.viewName &&
      report.report === "Hourly sales" &&
      source !== "Shared reports"
    ) {
      const view = hourlySalesViews.find(
        (savedView) => savedView.name === report.viewName,
      )
      if (view) {
        setSelectedSiteIds(view.sites)
        setSelectedRegisters(view.registers)
        setDateSelected(view.date)
        setCompareSelected(view.compare)
        setHourlySalesMetric(view.metric)
      } else {
        setSelectedSiteIds([])
        setSelectedRegisters([])
        setDateSelected({ id: "today", label: "Today" })
        setCompareSelected({ id: "last-same-day", label: `Last ${TODAY_NAME}` })
        setHourlySalesMetric("Sale amount")
      }
    } else if (report.report === "Hourly sales") {
      setSelectedSiteIds([])
      setSelectedRegisters([])
      setDateSelected({ id: "today", label: "Today" })
      setCompareSelected({ id: "last-same-day", label: `Last ${TODAY_NAME}` })
      setHourlySalesMetric("Sale amount")
    }
    if (source === "Shared reports") {
      resetSharedReportFilters()
    }
  }

  function selectProductSales(dimension: string) {
    if (activeReport !== "Product sales") refreshData()
    setProductSalesEntryDimension(dimension)
    setActiveReport("Product sales")
  }

  function saveCurrentFilters(
    name: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    if (activeReport !== "Hourly sales") return
    const view: HourlySalesView = {
      name,
      sites: selectedSiteIds,
      registers: selectedRegisters,
      date: dateSelected,
      compare: compareSelected,
      metric: hourlySalesMetric,
      createdBy: CURRENT_CREATOR,
      createdAt: Date.now(),
      description,
      sharedWithTeam,
    }
    setHourlySalesViews((current) => [...current, view])
    setRequestedSavedViewName(name)
    const report: DirectoryReport = {
      id: `saved:Hourly sales:${name}`,
      title: name,
      description,
      category: "Sales",
      report: "Hourly sales",
      viewName: name,
      createdBy: CURRENT_CREATOR,
      createdAt: view.createdAt,
      sharedWithTeam,
    }
    setSelectedDirectoryReport(report)
    setToast({
      message: "New report saved.",
      actionLabel: "See report",
      onAction: () => selectDirectoryReport(report, "My reports"),
    })
  }

  function deleteFilter(name: string) {
    const remainingFilters = savedFilters.filter(
      (filter) => filter.name !== name,
    )
    setSavedFilters(remainingFilters)
    if (defaultView === name) {
      setDefaultView("__system__")
      reset()
    }
  }

  function updateSavedFilter(
    oldName: string,
    newName: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    if (activeReport === "Hourly sales") {
      setHourlySalesViews((current) =>
        current.map((view) =>
          view.name === oldName
            ? { ...view, name: newName, description, sharedWithTeam }
            : view,
        ),
      )
      if (requestedSavedViewName === oldName) setRequestedSavedViewName(newName)
      setSelectedDirectoryReport((current) =>
        current?.viewName === oldName
          ? {
              ...current,
              id: `saved:${current.report}:${newName}`,
              title: newName,
              description,
              viewName: newName,
              sharedWithTeam,
            }
          : current,
      )
      setEditingSavedViewName(null)
      return
    }
    setSavedFilters((current) =>
      current.map((filter) =>
        filter.name === oldName
          ? { ...filter, name: newName, description, sharedWithTeam }
          : filter,
      ),
    )
    if (defaultView === oldName) setDefaultView(newName)
    if (activeViewName === oldName) setActiveViewName(newName)
    if (requestedSavedViewName === oldName) setRequestedSavedViewName(newName)
    setEditingSavedViewName(null)
    setSelectedDirectoryReport((current) =>
      current?.viewName === oldName
        ? {
            ...current,
            id: `saved:${current.report}:${newName}`,
            title: newName,
            description,
            viewName: newName,
            sharedWithTeam,
          }
        : current,
    )
  }

  function deleteActiveSavedView() {
    if (!requestedSavedViewName) return
    if (activeReport === "Overview") {
      deleteFilter(requestedSavedViewName)
    } else if (activeReport === "Hourly sales") {
      setHourlySalesViews((current) =>
        current.filter((view) => view.name !== requestedSavedViewName),
      )
    } else {
      savedViewHeaderActions.current?.delete()
    }
    setRequestedSavedViewName(null)
    setSelectedDirectoryReport(null)
    setShowSavedViewMenu(false)
    setShowDeleteSavedReport(false)
    setActiveReport("My reports")
    setActiveReportsNavigation(null)
  }

  function confirmDeleteActiveSavedView() {
    deleteActiveSavedView()
  }

  function updateSelectedSavedReport(
    oldName: string,
    name: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    setSelectedDirectoryReport((current) =>
      current?.viewName === oldName
        ? {
            ...current,
            id: `saved:${current.report}:${name}`,
            title: name,
            description,
            viewName: name,
            sharedWithTeam,
          }
        : current,
    )
  }

  function updateFilter(name: string, sharedWithTeam: boolean) {
    if (activeReport !== "Hourly sales") return
    setHourlySalesViews((current) =>
      current.map((view) =>
        view.name === name
          ? {
              ...view,
              sites: selectedSiteIds,
              registers: selectedRegisters,
              date: dateSelected,
              compare: compareSelected,
              metric: hourlySalesMetric,
              sharedWithTeam,
            }
          : view,
      ),
    )
    setToast(`"${name}" updated`)
  }

  function reset() {
    setSelectedSiteIds([])
    setSelectedRegisters([])
    setDateSelected({ id: "today", label: "Today" })
    setCompareSelected({ id: "last-same-day", label: `Last ${TODAY_NAME}` })
    setTaxSelected("Inclusive")
    setActiveViewName(null)
    setOpenFilter(null)
  }

  function resetHourlySalesFilters() {
    setSelectedSiteIds(
      isViewingSharedReport ? [] : (requestedHourlySalesView?.sites ?? []),
    )
    setSelectedRegisters(
      isViewingSharedReport ? [] : (requestedHourlySalesView?.registers ?? []),
    )
    setDateSelected(
      isViewingSharedReport
        ? { id: "today", label: "Today" }
        : (requestedHourlySalesView?.date ?? { id: "today", label: "Today" }),
    )
    setCompareSelected(
      isViewingSharedReport
        ? { id: "last-same-day", label: `Last ${TODAY_NAME}` }
        : (requestedHourlySalesView?.compare ?? {
            id: "last-same-day",
            label: `Last ${TODAY_NAME}`,
          }),
    )
    setHourlySalesMetric(
      isViewingSharedReport
        ? "Sale amount"
        : (requestedHourlySalesView?.metric ?? "Sale amount"),
    )
    setActiveViewName(null)
    setOpenFilter(null)
  }

  function resetSharedReportFilters() {
    setSelectedSiteIds([])
    setSelectedRegisters([])
    setDateSelected({ id: "today", label: "Today" })
    setCompareSelected({ id: "last-same-day", label: `Last ${TODAY_NAME}` })
    setTaxSelected("Inclusive")
    setHourlySalesMetric("Sale amount")
    setActiveViewName(null)
    setOpenFilter(null)
  }

  function toggleSite(id: string) {
    setActiveViewName(null)
    if (id === "all") {
      setSelectedSiteIds([])
      setSelectedRegisters([])
      return
    }

    setShowDeletedSites(false)
    const nextIds = selectedSiteIds.includes(id)
      ? selectedSiteIds.filter((selectedId) => selectedId !== id)
      : [...selectedSiteIds, id]
    setSelectedSiteIds(nextIds)
    setSelectedRegisters((current) =>
      current.filter((key) =>
        nextIds.some((siteId) => key.startsWith(`${siteId}:`)),
      ),
    )
  }

  function toggleRegister(key: string) {
    if (key === "all") {
      setActiveViewName(null)
      setSelectedRegisters([])
      return
    }
    setActiveViewName(null)
    setIncludeDeletedRegisters(false)
    setSelectedRegisters((current) =>
      current.includes(key)
        ? current.filter((register) => register !== key)
        : [...current, key],
    )
  }

  function toggleMenu(id: string) {
    setOpenFilter((current) => (current === id ? null : id))
  }

  function chooseDate(id: string, label: string) {
    setActiveViewName(null)
    setDateSelected({ id, label })
    const options = COMPARE_TO_OPTIONS[id] ?? COMPARE_TO_OPTIONS["today"]
    setCompareSelected((current) =>
      current.id === "none" ||
      current.id === "custom-date" ||
      options.some((option) => option.id === current.id)
        ? current
        : { id: options[0].id, label: options[0].label },
    )
  }

  return (
    <div className="bg-[#f9f8f4] flex h-screen w-full">
      <Sidebar
        activeReport={activeReportsNavigation ?? activeReport}
        onSelectReport={selectSidebarReport}
      />

      {/* Page area — white card fixed to viewport, only inner content scrolls */}
      <div className="flex-1 min-w-0 h-screen p-[8px] pl-0 flex flex-col">
        <div className="bg-white border border-[#e3e2dd] rounded-[16px] flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Title header — stays fixed */}
          <div
            className={`relative border-b border-[#e3e2dd] flex min-h-[56px] gap-[16px] items-center ${
              selectedDirectoryReport ? "px-[12px]" : "px-[24px]"
            } py-[8px] w-full shrink-0`}
          >
            {activeReport === "Transactions" && isTransactionInvoiceOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    savedViewHeaderActions.current?.backFromInvoice?.()
                    setIsTransactionInvoiceOpen(false)
                  }}
                  className="flex h-[32px] shrink-0 items-center gap-[4px] rounded-[8px] px-[8px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f] hover:bg-[#f2f0ea]"
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="m10 3-5 5 5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 font-['Inter:Semibold'] text-[16px] leading-[24px] text-[#22201f]">
                  Tax invoice
                </span>
              </>
            ) : selectedDirectoryReport ? (
              <>
                {!isTransactionInvoiceOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        selectedDirectoryReport.id ===
                          "preset:reconciliation" &&
                        selectedReconciliationTaking
                      ) {
                        setSelectedReconciliationTaking(null)
                        return
                      }
                      resetActiveReportFilters()
                      setShowSavedViewMenu(false)
                      setActiveReport(reportReturnPage)
                      setActiveReportsNavigation("All reports")
                      setRequestedSavedViewName(null)
                      setIsViewingSharedReport(false)
                      setSelectedDirectoryReport(null)
                      savedViewHeaderActions.current = null
                    }}
                    className="flex h-[32px] shrink-0 items-center gap-[4px] rounded-[8px] px-[8px] font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f] hover:bg-[#f2f0ea]"
                  >
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="m10 3-5 5 5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back
                  </button>
                )}
                <span
                  className={`${
                    isTransactionInvoiceOpen && activeReport === "Transactions"
                      ? "static translate-x-0"
                      : "absolute left-1/2 -translate-x-1/2"
                  } flex max-w-[60%] items-center gap-[8px]`}
                >
                  <span className="truncate font-['Inter:Semibold'] text-[16px] leading-[24px] text-[#22201f]">
                    {isTransactionInvoiceOpen && activeReport === "Transactions"
                      ? "Tax invoice"
                      : selectedDirectoryReport.id ===
                            "preset:reconciliation" &&
                          selectedReconciliationTaking
                        ? `Finalised takings: #${selectedReconciliationTaking.number}`
                        : selectedDirectoryReport.title}
                  </span>
                </span>
                {((activeReport === "Transactions" &&
                  !isTransactionInvoiceOpen) ||
                  activeReport === "Product sales" ||
                  selectedDirectoryReport.id === "preset:hourly-sales" ||
                  selectedDirectoryReport.report === "Hourly sales" ||
                  selectedDirectoryReport.id === "preset:reconciliation") &&
                  (selectedDirectoryReport.id === "preset:reconciliation" &&
                  selectedReconciliationTaking ? (
                    <button
                      type="button"
                      onClick={() => setToast("CSV file downloaded")}
                      className="ml-auto flex h-[32px] shrink-0 items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] hover:bg-[#f9f8f4]"
                    >
                      Export
                    </button>
                  ) : requestedSavedViewName ? (
                    <SavedReportHeaderActions
                      isRefreshing={isRefreshing}
                      onRefresh={refreshData}
                      minutesSinceUpdate={minutesSinceUpdate}
                      onCustomise={() =>
                        savedViewHeaderActions.current?.customiseColumns?.()
                      }
                      onSettings={() =>
                        activeReport === "Hourly sales"
                          ? setEditingSavedViewName(requestedSavedViewName)
                          : savedViewHeaderActions.current?.rename()
                      }
                      onDelete={() => setShowDeleteSavedReport(true)}
                      onExport={() => {
                        const exportReport =
                          savedViewHeaderActions.current?.export
                        if (exportReport) exportReport()
                        else setToast("CSV file downloaded")
                      }}
                      onSave={
                        selectedDirectoryReport.report === "Hourly sales"
                          ? hourlySalesHasChangedFilters
                            ? () => setShowSaveModal(true)
                            : undefined
                          : activeReport === "Transactions"
                            ? showSalesFeedSaveReport
                              ? () => savedViewHeaderActions.current?.save?.()
                              : undefined
                            : activeReport === "Product sales"
                              ? showProductSalesSaveReport
                                ? () => savedViewHeaderActions.current?.save?.()
                                : undefined
                              : undefined
                      }
                    />
                  ) : (
                    <ReportHeaderActions
                      isRefreshing={isRefreshing}
                      onRefresh={refreshData}
                      minutesSinceUpdate={minutesSinceUpdate}
                      onCustomise={() => {
                        const customise =
                          savedViewHeaderActions.current?.customiseColumns
                        if (customise) customise()
                        else setToast("Customise table options opened")
                      }}
                      onExport={() => {
                        const exportReport =
                          savedViewHeaderActions.current?.export
                        if (exportReport) exportReport()
                        else setToast("CSV file downloaded")
                      }}
                      onSave={
                        selectedDirectoryReport.report === "Reconciliation"
                          ? reconciliationFiltersChanged
                            ? () => setToast("Reconciliation report saved")
                            : undefined
                          : selectedDirectoryReport.report === "Hourly sales"
                            ? hourlySalesHasChangedFilters
                              ? () => setShowSaveModal(true)
                              : undefined
                            : activeReport === "Transactions"
                              ? showSalesFeedSaveReport
                                ? () => savedViewHeaderActions.current?.save?.()
                                : undefined
                              : activeReport === "Product sales"
                                ? showProductSalesSaveReport
                                  ? () =>
                                      savedViewHeaderActions.current?.save?.()
                                  : undefined
                                : () => setShowSaveModal(true)
                      }
                    />
                  ))}
              </>
            ) : (
              <>
                <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px] min-w-0 truncate">
                  {activeReport === "Transactions"
                    ? isTransactionInvoiceOpen
                      ? "Tax invoice"
                      : "Sales feed"
                    : activeReport === "Lightspeed reports" ||
                        activeReport === "Shared reports" ||
                        activeReport === "My reports"
                      ? "All reports"
                      : activeReport}
                </span>
                <div className="flex-1 min-w-0" />
                {((activeReport === "Transactions" &&
                  !isTransactionInvoiceOpen) ||
                  activeReport === "Product sales") && (
                  <ReportHeaderActions
                    isRefreshing={isRefreshing}
                    onRefresh={refreshData}
                    minutesSinceUpdate={minutesSinceUpdate}
                    onCustomise={() => {
                      const customise =
                        savedViewHeaderActions.current?.customiseColumns
                      if (customise) customise()
                      else setToast("Customise table options opened")
                    }}
                    onExport={() => {
                      const exportReport =
                        savedViewHeaderActions.current?.export
                      if (exportReport) exportReport()
                      else setToast("CSV file downloaded")
                    }}
                    onSave={
                      (
                        activeReport === "Transactions"
                          ? showSalesFeedSaveReport
                          : showProductSalesSaveReport
                      )
                        ? () => savedViewHeaderActions.current?.save?.()
                        : undefined
                    }
                  />
                )}
                <img
                  alt=""
                  className="block shrink-0 size-[24px] cursor-pointer"
                  src={imgChat}
                />
                <img
                  alt=""
                  className="block shrink-0 size-[24px] cursor-pointer"
                  src={imgAnnouncement}
                />
                <ActionButton variant="secondary" size="slim">
                  POS
                </ActionButton>
              </>
            )}
          </div>

          {activeReport === "All reports" ||
          activeReport === "Lightspeed reports" ||
          activeReport === "Shared reports" ||
          activeReport === "My reports" ? (
            <ReportsLanding
              page={activeReport}
              onSelectPage={selectReportsTab}
              onSelectReport={selectDirectoryReport}
            />
          ) : activeReport === "Transactions" ? (
            <div className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              <TransactionsPage
                onInvoiceViewChange={setIsTransactionInvoiceOpen}
                requestedSavedViewName={requestedSavedViewName}
                isViewingSharedReport={isViewingSharedReport}
                onRegisterSavedViewHeaderActions={(actions) => {
                  savedViewHeaderActions.current = actions
                  setShowSalesFeedSaveReport(Boolean(actions.showSaveReport))
                }}
                onSavedViewRenamed={(oldName, newName) =>
                  setRequestedSavedViewName((current) =>
                    current === oldName ? newName : current,
                  )
                }
                onSavedViewUpdated={updateSelectedSavedReport}
                selectedSiteIds={selectedSiteIds}
                selectedSites={selectedSites}
                siteLabel={siteLabel}
                selectedRegisters={selectedRegisters}
                includeDeletedRegisters={includeDeletedRegisters}
                showDeletedSites={showDeletedSites}
                onToggleShowDeletedSites={() =>
                  setShowDeletedSites((show) => !show)
                }
                dateSelected={dateSelected}
                isRefreshing={isRefreshing}
                minutesSinceUpdate={minutesSinceUpdate}
                onRefresh={refreshData}
                onToggleSite={toggleSite}
                onToggleRegister={toggleRegister}
                onToggleIncludeDeletedRegisters={() =>
                  setIncludeDeletedRegisters((include) => !include)
                }
                onApplyLocationSnapshot={(sites, registers) => {
                  setSelectedSiteIds(sites)
                  setSelectedRegisters(registers)
                }}
                onSelectDate={(id, label) => setDateSelected({ id, label })}
              />
            </div>
          ) : activeReport === "Product sales" ? (
            <div className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-auto overscroll-contain">
              <ProductSalesPage
                requestedSavedViewName={requestedSavedViewName}
                isViewingSharedReport={isViewingSharedReport}
                onRegisterSavedViewHeaderActions={(actions) => {
                  savedViewHeaderActions.current = actions
                  setShowProductSalesSaveReport(Boolean(actions.showSaveReport))
                }}
                onSavedViewRenamed={(oldName, newName) =>
                  setRequestedSavedViewName((current) =>
                    current === oldName ? newName : current,
                  )
                }
                onSavedViewUpdated={updateSelectedSavedReport}
                initialSalesBy={productSalesEntryDimension}
                selectedSiteIds={selectedSiteIds}
                selectedSites={selectedSites}
                siteLabel={siteLabel}
                showDeletedSites={showDeletedSites}
                onToggleShowDeletedSites={() =>
                  setShowDeletedSites((show) => !show)
                }
                selectedRegisters={selectedRegisters}
                dateSelected={dateSelected}
                compareSelected={compareSelected}
                taxSelected={taxSelected}
                isRefreshing={isRefreshing}
                minutesSinceUpdate={minutesSinceUpdate}
                onRefresh={refreshData}
                onToggleSite={toggleSite}
                onToggleRegister={toggleRegister}
                includeDeletedRegisters={includeDeletedRegisters}
                onToggleIncludeDeletedRegisters={() =>
                  setIncludeDeletedRegisters((include) => !include)
                }
                onApplyRegisters={(names) => {
                  const sites =
                    selectedSites.length > 0
                      ? selectedSites
                      : SITE_OPTIONS.slice(1)
                  const keys = sites.flatMap((site) =>
                    names
                      .filter((name) =>
                        (REGISTERS_BY_SITE[site.id] ?? []).includes(name),
                      )
                      .map((name) => `${site.id}:${name}`),
                  )
                  setSelectedRegisters(keys)
                }}
                onApplyLocationSnapshot={(sites, registers) => {
                  setSelectedSiteIds(sites)
                  setSelectedRegisters(registers)
                }}
                onSelectDate={(id, label) => {
                  setDateSelected({ id, label })
                  const options =
                    COMPARE_TO_OPTIONS[id] ?? COMPARE_TO_OPTIONS.today
                  setCompareSelected((current) =>
                    current.id === "none" ||
                    current.id === "custom-date" ||
                    options.some((option) => option.id === current.id)
                      ? current
                      : options[0],
                  )
                }}
                onSelectCompare={(id, label) =>
                  setCompareSelected({ id, label })
                }
                onSelectTax={setTaxSelected}
              />
            </div>
          ) : selectedDirectoryReport?.report === "Legacy" ? (
            <div className="h-0 min-h-0 w-full flex-1" />
          ) : selectedDirectoryReport?.report === "Hourly sales" ? (
            <div className="flex w-full flex-1 flex-col items-start gap-[24px] overflow-y-auto p-[24px]">
              <div className="flex w-full flex-wrap items-center gap-[8px]">
                <div className="relative order-2">
                  <DefaultFilterChip
                    label="Site"
                    value={siteLabel}
                    valueClassName={
                      selectedSites.length === 1 ? "max-w-[145px]" : ""
                    }
                    onClick={() => toggleMenu("site")}
                  />
                  {openFilter === "site" && (
                    <SiteDropdown
                      selectedIds={selectedSiteIds}
                      onToggle={toggleSite}
                      onClose={() => setOpenFilter(null)}
                      showDeletedSites={showDeletedSites}
                      onToggleShowDeletedSites={() =>
                        setShowDeletedSites((show) => !show)
                      }
                    />
                  )}
                </div>
                <div className="relative order-1">
                  <button
                    type="button"
                    onClick={() => toggleMenu("date")}
                    className="flex h-[32px] max-w-full items-center gap-[8px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                  >
                    <span className="shrink-0 font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
                      Date
                    </span>
                    <span className="min-w-0 truncate font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                      {dateSelected.label}
                    </span>
                    <span className="-mx-[4px] shrink-0 font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
                      vs
                    </span>
                    <span className="min-w-0 truncate font-['Inter:Semibold'] text-[14px] leading-[20px] text-[#22201f]">
                      {compareSelected.label}
                    </span>
                  </button>
                  {openFilter === "date" && (
                    <DateComparisonDropdown
                      dateId={dateSelected.id}
                      compareId={compareSelected.id}
                      onSelectDate={(id, label) => chooseDate(id, label)}
                      onSelectCompare={(id, label) =>
                        setCompareSelected({ id, label })
                      }
                      onClose={() => setOpenFilter(null)}
                    />
                  )}
                </div>
                <div className="relative order-3">
                  <DefaultFilterChip
                    label="Register"
                    value={registerLabel}
                    onClick={() => toggleMenu("hourly-register")}
                  />
                  {openFilter === "hourly-register" && (
                    <RegisterDropdown
                      selectedSites={
                        selectedSites.length > 0
                          ? selectedSites
                          : SITE_OPTIONS.slice(1).filter(
                              (site) => showDeletedSites || !site.deleted,
                            )
                      }
                      selectedRegisters={selectedRegisters}
                      onToggle={toggleRegister}
                      onClose={() => setOpenFilter(null)}
                      searchable
                      includeDeletedRegisters={includeDeletedRegisters}
                      onToggleIncludeDeletedRegisters={() =>
                        setIncludeDeletedRegisters((include) => !include)
                      }
                    />
                  )}
                </div>
                <div className="relative order-4">
                  <DefaultFilterChip
                    label="Show"
                    value={hourlySalesMetric}
                    onClick={() => toggleMenu("hourly-metric")}
                  />
                  {openFilter === "hourly-metric" && (
                    <OptionsDropdown
                      options={["Sale amount", "Order count", "Average sale"]}
                      selected={hourlySalesMetric}
                      onSelect={(value) =>
                        setHourlySalesMetric(value as HourlySalesMetric)
                      }
                      onClose={() => setOpenFilter(null)}
                      width={200}
                    />
                  )}
                </div>
                {selectedDirectoryReport?.report === "Hourly sales" &&
                  hourlySalesHasChangedFilters && (
                    <ActionButton
                      variant="text"
                      size="slim"
                      className="order-5 !h-auto !px-0 hover:!bg-transparent"
                      onClick={resetHourlySalesFilters}
                    >
                      Reset
                    </ActionButton>
                  )}
              </div>
              <div className="flex w-full flex-wrap items-stretch gap-[16px]">
                <KpiCard
                  label="Best hour"
                  value="12:00 PM"
                  change="+$142.80"
                  changeColor="text-[#008e13]"
                  compareLabel={compareSelected.label}
                  showComparison={showComparison}
                  isRefreshing={isRefreshing}
                  infoIconRight
                  tooltip="The hour of the day with the highest sales."
                />
                <KpiCard
                  label="Quietest hour"
                  value="7:00 AM"
                  change="−$18.40"
                  changeColor="text-[#8e1311]"
                  compareLabel={compareSelected.label}
                  showComparison={showComparison}
                  isRefreshing={isRefreshing}
                  infoIconRight
                  tooltip="The hour of the day with the lowest sales."
                />
              </div>
              <div className="w-full">
                <HourlySalesTable
                  dateSelected={dateSelected}
                  compareSelected={compareSelected}
                  showComparison={showComparison}
                  isRefreshing={isRefreshing}
                  metric={hourlySalesMetric}
                  visibleColumnKeys={visibleHourlySalesColumnKeys}
                />
                {isHourlySalesColumnsOpen && (
                  <CustomiseColumnsDrawer
                    columns={hourlySalesColumnOrder.map((key) => ({
                      key,
                      label:
                        hourlySalesColumnDefinitions.find(
                          (column) => column.key === key,
                        )?.label ?? key,
                    }))}
                    visibleKeys={visibleHourlySalesColumnKeys}
                    onToggle={toggleHourlySalesColumn}
                    onReorder={reorderHourlySalesColumns}
                    onClose={() => setIsHourlySalesColumnsOpen(false)}
                  />
                )}
              </div>
            </div>
          ) : selectedDirectoryReport?.id === "preset:reconciliation" ? (
            <ReconciliationReport
              selectedTaking={selectedReconciliationTaking}
              onSelectTaking={setSelectedReconciliationTaking}
              selectedSiteIds={selectedSiteIds}
              selectedSites={selectedSites}
              siteLabel={siteLabel}
              selectedRegisters={selectedRegisters}
              registerLabel={registerLabel}
              showDeletedSites={showDeletedSites}
              includeDeletedRegisters={includeDeletedRegisters}
              onToggleSite={toggleSite}
              onToggleRegister={toggleRegister}
              onToggleShowDeletedSites={() =>
                setShowDeletedSites((show) => !show)
              }
              onToggleIncludeDeletedRegisters={() =>
                setIncludeDeletedRegisters((include) => !include)
              }
              onFiltersChanged={setReconciliationFiltersChanged}
            />
          ) : selectedDirectoryReport &&
            ["preset:daily-sales", "preset:site-comparison"].includes(
              selectedDirectoryReport.id,
            ) ? (
            <div className="h-0 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain" />
          ) : (
            /* Scrollable content area */
            <div className="flex flex-col gap-[24px] items-start p-[24px] w-full overflow-y-auto flex-1">
              {/* Filter bar */}
              <div className="flex w-full flex-wrap items-start gap-[8px]">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
                  <div className="relative order-2">
                    <DefaultFilterChip
                      label="Site"
                      value={siteLabel}
                      valueClassName={
                        selectedSites.length === 1 ? "max-w-[145px]" : ""
                      }
                      onClick={() => toggleMenu("site")}
                    />
                    {openFilter === "site" && (
                      <SiteDropdown
                        selectedIds={selectedSiteIds}
                        onToggle={toggleSite}
                        onClose={() => setOpenFilter(null)}
                        showDeletedSites={showDeletedSites}
                        onToggleShowDeletedSites={() =>
                          setShowDeletedSites((show) => !show)
                        }
                      />
                    )}
                  </div>

                  <div className="relative order-1">
                    <button
                      type="button"
                      onClick={() => toggleMenu("date")}
                      className="flex h-[32px] max-w-full items-center gap-[8px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                    >
                      <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                        Date
                      </span>
                      <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">
                        {dateSelected.label}
                      </span>
                      <span className="-mx-[4px] shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                        vs
                      </span>
                      <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">
                        {compareSelected.label}
                      </span>
                    </button>
                    {openFilter === "date" && (
                      <DateComparisonDropdown
                        dateId={dateSelected.id}
                        compareId={compareSelected.id}
                        onSelectDate={(id, label) => {
                          setActiveViewName(null)
                          chooseDate(id, label)
                        }}
                        onSelectCompare={(id, label) => {
                          setActiveViewName(null)
                          setCompareSelected({ id, label })
                        }}
                        onClose={() => setOpenFilter(null)}
                      />
                    )}
                  </div>

                  {selectedSites.length > 0 && (
                    <div className="relative order-3">
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
                          includeDeletedRegisters={includeDeletedRegisters}
                          onToggleIncludeDeletedRegisters={() =>
                            setIncludeDeletedRegisters((include) => !include)
                          }
                        />
                      )}
                    </div>
                  )}
                  {hasChangedSavedView && (
                    <div className="order-5 ml-[8px] flex items-center gap-[12px]">
                      <ActionButton
                        variant="text"
                        size="slim"
                        className="!h-auto !px-0 hover:!bg-transparent"
                        onClick={() =>
                          !isViewingSharedReport && requestedSavedView
                            ? applyFilter(requestedSavedView)
                            : reset()
                        }
                      >
                        Reset
                      </ActionButton>
                      {activeReport !== "Overview" &&
                        requestedSavedViewName && (
                          <ActionButton
                            variant="text"
                            size="slim"
                            className="!h-auto !px-0 hover:!bg-transparent"
                            onClick={() => setShowSaveModal(true)}
                          >
                            Save view
                          </ActionButton>
                        )}
                    </div>
                  )}
                </div>

                {/* Right actions */}
                <div className="ml-auto flex shrink-0 items-center gap-[8px]">
                  {activeReport === "Overview" && (
                    <>
                      <RefreshControl
                        isRefreshing={isRefreshing}
                        onRefresh={refreshData}
                        minutesSinceUpdate={minutesSinceUpdate}
                      />
                      <Tooltip text="Settings" centerBelow delay={600}>
                        <button
                          type="button"
                          aria-label="Settings"
                          onClick={() => setIsCustomiseDashboardOpen(true)}
                          className="relative flex size-[32px] items-center justify-center rounded-full text-[#22201f] transition-colors hover:bg-[#f4f3ef]"
                        >
                          <svg
                            aria-hidden="true"
                            className="hidden"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12ZM18.7273 14.7273C18.6063 15.0015 18.5702 15.3056 18.6236 15.6005C18.6771 15.8954 18.8177 16.1676 19.0273 16.3818L19.0818 16.4364C19.2509 16.6052 19.385 16.8057 19.4765 17.0265C19.568 17.2472 19.6151 17.4838 19.6151 17.7227C19.6151 17.9617 19.568 18.1983 19.4765 18.419C19.385 18.6397 19.2509 18.8402 19.0818 19.0091C18.913 19.1781 18.7124 19.3122 18.4917 19.4037C18.271 19.4952 18.0344 19.5423 17.7955 19.5423C17.5565 19.5423 17.3199 19.4952 17.0992 19.4037C16.8785 19.3122 16.678 19.1781 16.5091 19.0091L16.4545 18.9545C16.2403 18.745 15.9682 18.6044 15.6733 18.5509C15.3784 18.4974 15.0742 18.5335 14.8 18.6545C14.5311 18.7698 14.3018 18.9611 14.1403 19.205C13.9788 19.4489 13.8921 19.7347 13.8909 20.0273V20.1818C13.8909 20.664 13.6994 21.1265 13.3584 21.4675C13.0174 21.8084 12.5549 22 12.0727 22C11.5905 22 11.1281 21.8084 10.7871 21.4675C10.4461 21.1265 10.2545 20.664 10.2545 20.1818V20.1C10.2475 19.7991 10.1501 19.5073 9.97501 19.2625C9.79991 19.0176 9.55521 18.8312 9.27273 18.7273C8.99853 18.6063 8.69437 18.5702 8.39947 18.6236C8.10456 18.6771 7.83244 18.8177 7.61818 19.0273L7.56364 19.0818C7.39478 19.2509 7.19425 19.385 6.97353 19.4765C6.7528 19.568 6.51621 19.6151 6.27727 19.6151C6.03834 19.6151 5.80174 19.568 5.58102 19.4765C5.36029 19.385 5.15977 19.2509 4.99091 19.0818C4.82186 18.913 4.68775 18.7124 4.59626 18.4917C4.50476 18.271 4.45766 18.0344 4.45766 17.7955C4.45766 17.5565 4.50476 17.3199 4.59626 17.0992C4.68775 16.8785 4.82186 16.678 4.99091 16.5091L5.04545 16.4545C5.25503 16.2403 5.39562 15.9682 5.4491 15.6733C5.50257 15.3784 5.46647 15.0742 5.34545 14.8C5.23022 14.5311 5.03887 14.3018 4.79497 14.1403C4.55107 13.9788 4.26526 13.8921 3.97273 13.8909H3.81818C3.33597 13.8909 2.87351 13.6994 2.53253 13.3584C2.19156 13.0174 2 12.5549 2 12.0727C2 11.5905 2.19156 11.1281 2.53253 10.7871C2.87351 10.4461 3.33597 10.2545 3.81818 10.2545H3.9C4.2009 10.2475 4.49273 10.1501 4.73754 9.97501C4.98236 9.79991 5.16883 9.55521 5.27273 9.27273C5.39374 8.99853 5.42984 8.69437 5.37637 8.39947C5.3229 8.10456 5.18231 7.83244 4.97273 7.61818L4.91818 7.56364C4.74913 7.39478 4.61503 7.19425 4.52353 6.97353C4.43203 6.7528 4.38493 6.51621 4.38493 6.27727C4.38493 6.03834 4.43203 5.80174 4.52353 5.58102C4.61503 5.36029 4.74913 5.15977 4.91818 4.99091C5.08704 4.82186 5.28757 4.68775 5.50829 4.59626C5.72901 4.50476 5.96561 4.45766 6.20455 4.45766C6.44348 4.45766 6.68008 4.50476 6.9008 4.59626C7.12152 4.68775 7.32205 4.82186 7.49091 4.99091L7.54545 5.04545C7.75971 5.25503 8.03183 5.39562 8.32674 5.4491C8.62164 5.50257 8.9258 5.46647 9.2 5.34545H9.27273C9.54161 5.23022 9.77093 5.03887 9.93245 4.79497C10.094 4.55107 10.1807 4.26526 10.1818 3.97273V3.81818C10.1818 3.33597 10.3734 2.87351 10.7144 2.53253C11.0553 2.19156 11.5178 2 12 2C12.4822 2 12.9447 2.19156 13.2856 2.53253C13.6266 2.87351 13.8182 3.33597 13.8182 3.81818V3.9C13.8193 4.19253 13.906 4.47834 14.0676 4.72224C14.2291 4.96614 14.4584 5.15749 14.7273 5.27273C15.0015 5.39374 15.3056 5.42984 15.6005 5.37637C15.8954 5.3229 16.1676 5.18231 16.3818 4.97273L16.4364 4.91818C16.6052 4.74913 16.8057 4.61503 17.0265 4.52353C17.2472 4.43203 17.4838 4.38493 17.7227 4.38493C17.9617 4.38493 18.1983 4.43203 18.419 4.52353C18.6397 4.61503 18.8402 4.74913 19.0091 4.91818C19.1781 5.08704 19.3122 5.28757 19.4037 5.50829C19.4952 5.72901 19.5423 5.96561 19.4037 6.9008C19.3122 7.12152 19.1781 7.32205 19.0091 7.49091L18.9545 7.54545C18.745 7.75971 18.6044 8.03183 18.5509 8.32674C18.4974 8.62164 18.5335 8.9258 18.6545 9.2V9.27273C18.7698 9.54161 18.9611 9.77093 19.205 9.93245C19.4489 10.094 19.7347 10.1807 20.0273 10.1818H20.1818C20.664 10.1818 21.1265 10.3734 21.4675 10.7144C21.8084 11.0553 22 11.5178 22 12C22 12.4822 21.8084 12.9447 21.4675 13.2856C21.1265 13.6266 20.664 13.8182 20.1818 13.8182H20.1C19.8075 13.8193 19.5217 13.906 19.2778 14.0676C19.0339 14.2291 18.8425 14.4584 18.7273 14.7273Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <img
                            alt=""
                            src={`${assetPathPrefix}/settings-gear-24.svg`}
                            width="24"
                            height="24"
                          />
                        </button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>

              {activeReport === "Overview" ? (
                <OverviewV2Dashboard
                  isRefreshing={isRefreshing}
                  compareLabel={compareSelected.label}
                  showComparison={showComparison}
                  selectProductSales={selectProductSales}
                  visibleWidgets={visibleOverviewWidgets}
                  onHourlySalesDrillIn={() =>
                    selectDirectoryReport(
                      reportDirectoryItems.find(
                        (report) => report.id === "preset:hourly-sales",
                      )!,
                      "Lightspeed reports",
                    )
                  }
                />
              ) : (
                <>
                  {/* KPI row */}
                  <div className="flex gap-[16px] items-start w-full">
                    <KpiCard
                      label="Total sales"
                      value="$4,182.60"
                      change="+9.7%"
                      changeColor="text-[#008e13]"
                      compareLabel={compareSelected.label}
                      showComparison={showComparison}
                      isRefreshing={isRefreshing}
                    />
                    <KpiCard
                      label="Orders"
                      value="241"
                      change="−4.6%"
                      changeColor="text-[#8e1311]"
                      compareLabel={compareSelected.label}
                      showComparison={showComparison}
                      isRefreshing={isRefreshing}
                    />
                    <KpiCard
                      label="Average order"
                      value="$17.35"
                      change="+13.2%"
                      changeColor="text-[#008e13]"
                      compareLabel={compareSelected.label}
                      showComparison={showComparison}
                      isRefreshing={isRefreshing}
                    />
                    <WidgetCard className="flex-1 min-w-0 h-full">
                      <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full h-full">
                        <div className="flex gap-[8px] items-center w-full">
                          <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                            <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
                              Top selling product
                            </span>
                            <InfoIcon tooltip="Best-selling product by order volume" />
                          </div>
                        </div>
                        {isRefreshing ? (
                          <Sk w="w-[60px]" h="h-[32px]" />
                        ) : (
                          <span className="font-['Inter:Semibold'] text-[#22201f] text-[24px] leading-[32px]">
                            Latte
                          </span>
                        )}
                      </div>
                    </WidgetCard>
                  </div>

                  {/* Hourly sales chart */}
                  <WidgetCard className="w-full">
                    <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
                      <div className="flex gap-[8px] items-center w-full">
                        <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                          <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
                            Hourly sales
                          </span>
                          <InfoIcon tooltip="Total sales revenue broken down by hour" />
                        </div>
                        <button
                          type="button"
                          aria-label="Export"
                          onClick={() => setToast("CSV file downloaded")}
                          className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                        >
                          Export
                        </button>
                        <MetricMoreMenu
                          onExportPng={() => setToast("PNG export selected")}
                          onViewMethodology={() =>
                            setToast("Methodology opened")
                          }
                        />
                      </div>
                      <HourlySalesChart
                        compareLabel={compareSelected.label}
                        showComparison={showComparison}
                        isRefreshing={isRefreshing}
                      />
                    </div>
                  </WidgetCard>

                  {/* Top lists row */}
                  <div className="flex gap-[16px] items-stretch w-full">
                    <TopListCard
                      title="Top selling products"
                      compareLabel={compareSelected.label}
                      showComparison={showComparison}
                      isRefreshing={isRefreshing}
                      onExportPng={() => setToast("PNG export selected")}
                      onViewMethodology={() => setToast("Methodology opened")}
                      onSeeMore={() => selectProductSales("Product")}
                      items={[
                        {
                          rank: 1,
                          name: "Latte",
                          count: 82,
                          change: "+7.4%",
                          positive: true,
                        },
                        {
                          rank: 2,
                          name: "Flat White",
                          count: 67,
                          change: "−2.9%",
                          positive: false,
                        },
                        {
                          rank: 3,
                          name: "Plain Croissant",
                          count: 32,
                          change: "+15.6%",
                          positive: true,
                        },
                        {
                          rank: 4,
                          name: "Cappuccino",
                          count: 31,
                          change: "+4.8%",
                          positive: true,
                        },
                        {
                          rank: 5,
                          name: "Banana Bread",
                          count: 16,
                          change: "−8.3%",
                          positive: false,
                        },
                      ]}
                    />
                    <TopListCard
                      title="Top selling categories"
                      compareLabel={compareSelected.label}
                      showComparison={showComparison}
                      isRefreshing={isRefreshing}
                      onExportPng={() => setToast("PNG export selected")}
                      onViewMethodology={() => setToast("Methodology opened")}
                      onSeeMore={() => selectProductSales("Category")}
                      items={[
                        {
                          rank: 1,
                          name: "Coffee",
                          count: 187,
                          change: "+12.1%",
                          positive: true,
                        },
                        {
                          rank: 2,
                          name: "Pastries",
                          count: 76,
                          change: "+6.5%",
                          positive: true,
                        },
                        {
                          rank: 3,
                          name: "Sweets",
                          count: 65,
                          change: "−5.7%",
                          positive: false,
                        },
                        {
                          rank: 4,
                          name: "Toasties",
                          count: 47,
                          change: "+10.9%",
                          positive: true,
                        },
                        {
                          rank: 5,
                          name: "Other drinks",
                          count: 30,
                          change: "+3.6%",
                          positive: true,
                        },
                      ]}
                    />
                    <TopListCard
                      title="Top selling reporting groups"
                      compareLabel={compareSelected.label}
                      showComparison={showComparison}
                      isRefreshing={isRefreshing}
                      onExportPng={() => setToast("PNG export selected")}
                      onViewMethodology={() => setToast("Methodology opened")}
                      onSeeMore={() => selectProductSales("Reporting group")}
                      items={[
                        {
                          rank: 1,
                          name: "Drinks",
                          count: 384,
                          change: "−11.4%",
                          positive: false,
                        },
                        {
                          rank: 2,
                          name: "Food",
                          count: 265,
                          change: "+14.7%",
                          positive: true,
                        },
                        {
                          rank: 3,
                          name: "Other",
                          count: 157,
                          change: "−6.2%",
                          positive: false,
                        },
                      ]}
                    />
                  </div>

                  {/* Sales by site table */}
                  <WidgetCard className="w-full">
                    <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
                      <div className="flex gap-[8px] items-center w-full">
                        <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                          <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
                            Sales by site
                          </span>
                          <InfoIcon tooltip="Revenue comparison by location for the selected period" />
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full overflow-hidden">
                        {/* Table header */}
                        <div className="bg-[#f9f8f4] border-y border-[#e3e2dd] flex gap-[16px] h-[40px] items-center font-['Inter:Medium'] text-[#22201f] text-[12px] leading-[16px] pl-[8px] pr-[12px] py-[8px] w-full">
                          <span className="w-[20px] shrink-0" />
                          <span className="flex-1 min-w-0">Site</span>
                          <span className="text-right w-[120px] shrink-0">
                            Sales {dateSelected.label.toLowerCase()}
                          </span>
                          {showComparison && (
                            <>
                              <span className="text-right w-[120px] shrink-0">
                                {compareSelected.label.charAt(0).toUpperCase() +
                                  compareSelected.label.slice(1)}
                              </span>
                              <span className="text-right w-[120px] shrink-0">
                                Difference
                              </span>
                            </>
                          )}
                        </div>
                        <SiteTableRow
                          rank={1}
                          name="Amberley – The Coffee Company"
                          today="$4,356.39"
                          last="$3,960.11"
                          diff="+8.8%"
                          positive
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={2}
                          name="Brambleton – The Coffee Company"
                          today="$2,764.40"
                          last="$2,940.24"
                          diff="−3.4%"
                          positive={false}
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={3}
                          name="Copperfield – The Coffee Company"
                          today="$2,661.29"
                          last="$2,464.88"
                          diff="+11.6%"
                          positive
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={4}
                          name="Foxglove – The Coffee Company"
                          today="$2,045.94"
                          last="$2,130.15"
                          diff="−9.1%"
                          positive={false}
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={5}
                          name="Mossgate – The Coffee Company"
                          today="$1,613.69"
                          last="$1,440.01"
                          diff="+5.3%"
                          positive
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => selectProductSales("Site")}
                        className="cursor-pointer font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] hover:underline"
                      >
                        Drill in
                      </button>
                    </div>
                  </WidgetCard>

                  {/* Sales by staff (closed) table */}
                  <WidgetCard className="w-full">
                    <div className="border border-[#e3e2dd] flex flex-col gap-[16px] items-start p-[16px] rounded-[8px] w-full">
                      <div className="flex gap-[8px] items-center w-full">
                        <div className="flex flex-1 min-w-0 items-center gap-[4px]">
                          <span className="truncate font-['Inter:Medium'] text-[#62615d] text-[12px] leading-[16px]">
                            Sales by staff (closed)
                          </span>
                          <InfoIcon tooltip="Revenue broken down by staff member for the selected period" />
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full overflow-hidden">
                        <div className="bg-[#f9f8f4] border-y border-[#e3e2dd] flex gap-[16px] h-[40px] items-center font-['Inter:Medium'] text-[#22201f] text-[12px] leading-[16px] pl-[8px] pr-[12px] py-[8px] w-full">
                          <span className="w-[20px] shrink-0" />
                          <span className="flex-1 min-w-0">Staff member</span>
                          <span className="text-right w-[120px] shrink-0">
                            Sales {dateSelected.label.toLowerCase()}
                          </span>
                          {showComparison && (
                            <>
                              <span className="text-right w-[120px] shrink-0">
                                {compareSelected.label.charAt(0).toUpperCase() +
                                  compareSelected.label.slice(1)}
                              </span>
                              <span className="text-right w-[120px] shrink-0">
                                Difference
                              </span>
                            </>
                          )}
                        </div>
                        <SiteTableRow
                          rank={1}
                          name="Olivia Hartwell"
                          today="$3,241.80"
                          last="$2,988.50"
                          diff="+8.5%"
                          positive
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={2}
                          name="Marcus Delgado"
                          today="$2,876.40"
                          last="$2,910.20"
                          diff="−1.2%"
                          positive={false}
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={3}
                          name="Priya Nair"
                          today="$2,534.60"
                          last="$2,310.75"
                          diff="+9.7%"
                          positive
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={4}
                          name="Tom Ashworth"
                          today="$2,190.30"
                          last="$2,050.00"
                          diff="+6.8%"
                          positive
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                        <SiteTableRow
                          rank={5}
                          name="Sophie Brennan"
                          today="$1,847.90"
                          last="$1,920.40"
                          diff="−3.8%"
                          positive={false}
                          showComparison={showComparison}
                          isRefreshing={isRefreshing}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => selectProductSales("Staff")}
                        className="cursor-pointer font-['Inter:Semibold'] text-[#1e72c4] text-[14px] leading-[24px] hover:underline"
                      >
                        Drill in
                      </button>
                    </div>
                  </WidgetCard>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isCustomiseDashboardOpen && (
        <CustomiseDashboardDrawer
          visibleWidgets={visibleOverviewWidgets}
          onToggle={(key) =>
            setVisibleOverviewWidgets((current) =>
              current.includes(key)
                ? current.filter((widget) => widget !== key)
                : [...current, key],
            )
          }
          onReset={() =>
            setVisibleOverviewWidgets(defaultOverviewDashboardWidgets)
          }
          onClose={() => setIsCustomiseDashboardOpen(false)}
        />
      )}

      {/* Save View Modal */}
      {showSaveModal && activeReport === "Hourly sales" && (
        <SaveViewModal
          onClose={() => setShowSaveModal(false)}
          onSave={saveCurrentFilters}
          onUpdate={updateFilter}
          existingFilters={
            activeReport === "Hourly sales"
              ? hourlySalesViews.map((view) => view.name)
              : savedFilters.map((filter) => filter.name)
          }
          hasExisting={
            activeReport === "Hourly sales"
              ? hourlySalesViews.length > 0
              : savedFilters.length > 0
          }
          suggestedName={
            activeReport === "Hourly sales"
              ? hourlySalesSuggestedName
              : suggestedViewName
          }
          suggestedDescription={
            activeReport === "Hourly sales"
              ? hourlySalesSuggestedDescription
              : suggestedDescription
          }
          initialMode={requestedSavedViewName ? "existing" : "new"}
          initialExistingName={requestedSavedViewName}
          initialSharedWithTeam={
            activeReport === "Hourly sales"
              ? (hourlySalesViews.find(
                  (view) => view.name === requestedSavedViewName,
                )?.sharedWithTeam ?? false)
              : (savedFilters.find(
                  (filter) => filter.name === requestedSavedViewName,
                )?.sharedWithTeam ?? false)
          }
          sharedExistingFilters={
            activeReport === "Hourly sales"
              ? hourlySalesViews
                  .filter((view) => view.sharedWithTeam)
                  .map((view) => view.name)
              : savedFilters
                  .filter((filter) => filter.sharedWithTeam)
                  .map((filter) => filter.name)
          }
        />
      )}

      {editingSavedViewName && activeReport === "Hourly sales" && (
        <EditSavedViewModal
          name={editingSavedViewName}
          description={
            hourlySalesViews.find((view) => view.name === editingSavedViewName)
              ?.description ?? ""
          }
          sharedWithTeam={
            hourlySalesViews.find((view) => view.name === editingSavedViewName)
              ?.sharedWithTeam ?? false
          }
          existingNames={hourlySalesViews.map((view) => view.name)}
          onClose={() => setEditingSavedViewName(null)}
          onSave={(name, description, sharedWithTeam) =>
            updateSavedFilter(
              editingSavedViewName,
              name,
              description,
              sharedWithTeam,
            )
          }
        />
      )}

      {editingSavedViewName && activeReport !== "Hourly sales" && (
        <EditSavedViewModal
          name={editingSavedViewName}
          description={
            savedFilters.find((filter) => filter.name === editingSavedViewName)
              ?.description ?? ""
          }
          sharedWithTeam={
            savedFilters.find((filter) => filter.name === editingSavedViewName)
              ?.sharedWithTeam ?? false
          }
          existingNames={savedFilters.map((filter) => filter.name)}
          onClose={() => setEditingSavedViewName(null)}
          onSave={(name, description, sharedWithTeam) =>
            updateSavedFilter(
              editingSavedViewName,
              name,
              description,
              sharedWithTeam,
            )
          }
        />
      )}

      {showDeleteSavedReport && selectedDirectoryReport && (
        <DeleteSavedReportModal
          onCancel={() => setShowDeleteSavedReport(false)}
          onConfirm={confirmDeleteActiveSavedView}
        />
      )}

      {toast && (
        <Toast
          message={typeof toast === "string" ? toast : toast.message}
          actionLabel={
            typeof toast === "string" ? undefined : toast.actionLabel
          }
          onAction={typeof toast === "string" ? undefined : toast.onAction}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}

const PRODUCT_SALES_ROWS = [
  {
    name: "Salmon Fillet",
    quantity: "10",
    sales: "$300.00",
    tax: "$27.30",
    cost: "$0.00",
    quantityShare: "12%",
    salesShare: "37%",
    profitShare: "0%",
  },
  {
    name: "Well Done",
    quantity: "10",
    sales: "$0.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "12%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Salt & Pepper Squid",
    quantity: "6",
    sales: "$72.00",
    tax: "$6.54",
    cost: "$0.00",
    quantityShare: "7%",
    salesShare: "9%",
    profitShare: "0%",
  },
  {
    name: "Mushrooms",
    quantity: "4",
    sales: "$4.00",
    tax: "$0.36",
    cost: "$0.00",
    quantityShare: "5%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Bacon",
    quantity: "3",
    sales: "$6.00",
    tax: "$0.54",
    cost: "$0.00",
    quantityShare: "4%",
    salesShare: "1%",
    profitShare: "0%",
  },
  {
    name: "Hashbrown",
    quantity: "3",
    sales: "$6.00",
    tax: "$0.54",
    cost: "$0.00",
    quantityShare: "4%",
    salesShare: "1%",
    profitShare: "0%",
  },
  {
    name: "Chef special pizza",
    quantity: "3",
    sales: "$75.00",
    tax: "$6.81",
    cost: "$0.00",
    quantityShare: "4%",
    salesShare: "9%",
    profitShare: "0%",
  },
  {
    name: "Onions",
    quantity: "2",
    sales: "$1.00",
    tax: "$0.09",
    cost: "$0.00",
    quantityShare: "2%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "No Pineapple",
    quantity: "2",
    sales: "$0.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "2%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Quinoa and Farro Salad",
    quantity: "1",
    sales: "$7.00",
    tax: "$0.64",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "1%",
    profitShare: "0%",
  },
  {
    name: "Extra Eggs",
    quantity: "1",
    sales: "$0.50",
    tax: "$0.05",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Mushroom Sauce",
    quantity: "1",
    sales: "$0.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Long Black",
    quantity: "1",
    sales: "$3.00",
    tax: "$0.27",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Margherita Pizza - 12in",
    quantity: "1",
    sales: "$20.00",
    tax: "$1.82",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "2%",
    profitShare: "0%",
  },
  {
    name: "Scrambled",
    quantity: "1",
    sales: "$0.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Extra Cheese",
    quantity: "1",
    sales: "$0.50",
    tax: "$0.05",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Eggs Bene - Bacon",
    quantity: "1",
    sales: "$18.00",
    tax: "$1.64",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "2%",
    profitShare: "0%",
  },
  {
    name: "Pork Sausage",
    quantity: "1",
    sales: "$0.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Add Fries",
    quantity: "1",
    sales: "$4.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Add Drink",
    quantity: "1",
    sales: "$3.00",
    tax: "$0.00",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Matcha Latte - Regular",
    quantity: "1",
    sales: "$3.75",
    tax: "$0.34",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Smoked Salmon",
    quantity: "1",
    sales: "$3.00",
    tax: "$0.27",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
  {
    name: "Edamame",
    quantity: "1",
    sales: "$3.00",
    tax: "$0.27",
    cost: "$0.00",
    quantityShare: "1%",
    salesShare: "0%",
    profitShare: "0%",
  },
]

const PRODUCT_SALES_TAGS: Record<string, string[]> = {
  "Salmon Fillet": ["Gluten-free", "Popular"],
  "Salt & Pepper Squid": ["Gluten-free", "Popular"],
  Mushrooms: ["Vegan", "Vegetarian", "Gluten-free"],
  Onions: ["Vegan", "Vegetarian", "Gluten-free"],
  "Quinoa and Farro Salad": ["Vegan", "Vegetarian", "Popular"],
  "Long Black": ["Vegan", "Vegetarian", "Gluten-free"],
  "Matcha Latte - Regular": ["Vegetarian", "Popular"],
}
const PRODUCT_TAG_OPTIONS = ["Vegan", "Vegetarian", "Gluten-free", "Popular"]
const PRODUCT_TAX_OPTIONS = ["Products with tax", "Products without tax"]

function getProductTaxLabel(value: string) {
  return value === "Exclusive" ? "Products without tax" : "Products with tax"
}

function getProductTaxValue(label: string) {
  return label === "Products without tax" ? "Exclusive" : "Inclusive"
}

type ProductSalesRow = {
  name: string
  tags?: string[]
  quantity: string
  sales: string
  exTax?: string
  tax: string
  cost: string
  quantityShare: string
  salesShare: string
  profitShare: string
  products?: string
  orders?: string
  averageSale?: string
}

function createProductBreakdownRows(
  entries: Array<[string, number, number, number, number]>,
) {
  const totalQuantity = entries.reduce((sum, [, quantity]) => sum + quantity, 0)
  const totalSales = entries.reduce((sum, [, , sales]) => sum + sales, 0)

  return entries.map(([name, quantity, sales, products, orders]) => {
    const tax = sales * 0.1
    const cost = sales * 0.4
    return {
      name,
      quantity: String(quantity),
      sales: `$${sales.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      tax: `$${tax.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      cost: `$${cost.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      quantityShare: `${Math.round((quantity / totalQuantity) * 100)}%`,
      salesShare: `${Math.round((sales / totalSales) * 100)}%`,
      profitShare: `${Math.round(((sales - cost) / sales) * 100)}%`,
      products: String(products),
      orders: String(orders),
      averageSale: `$${(sales / orders).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }
  })
}

const PRODUCT_SALES_BREAKDOWNS: Record<string, ProductSalesRow[]> = {
  Site: createProductBreakdownRows([
    ["Amberley", 36, 482.5, 18, 29],
    ["Brambleton", 29, 395, 16, 25],
    ["Oakridge", 24, 326.75, 14, 21],
    ["Pinehollow", 21, 284.5, 13, 19],
    ["Riverbend", 19, 260, 12, 18],
    ["Willowmere", 16, 218.25, 11, 16],
  ]),
  Category: createProductBreakdownRows([
    ["Coffee", 54, 198.5, 8, 43],
    ["Pastries", 38, 152, 6, 31],
    ["Mains", 32, 1018, 9, 25],
    ["Sides", 27, 142.5, 12, 23],
    ["Drinks", 18, 86, 5, 16],
  ]),
  "Reporting group": createProductBreakdownRows([
    ["Beverages", 72, 284.5, 13, 57],
    ["Brunch", 80, 1265, 20, 63],
    ["Bakery", 17, 47.5, 7, 18],
  ]),
  Staff: createProductBreakdownRows([
    ["Alex Morgan", 39, 384.5, 16, 31],
    ["Jordan Lee", 36, 356, 15, 29],
    ["Sam Taylor", 34, 328.25, 14, 27],
    ["Casey Brown", 32, 306, 13, 25],
    ["Riley Chen", 28, 263.75, 12, 22],
  ]),
}

type TransactionRow = {
  saleNumber: string
  dateTime: string
  date?: string
  time?: string
  site: string
  terminal: string
  operator: string
  customer: string
  loyaltyMember?: boolean
  orderType?: string
  source?: string
  tipAmount: string
  netAmount: string
  taxAmount: string
  total: string
  payments: string
  surcharge: string
  siteId: string
  register: string
  products: string[]
  categories: string[]
  taxType: string
  deleted: boolean
}

function EmailTaxInvoiceModal({
  row,
  onClose,
  onSend,
}: {
  row: TransactionRow
  onClose: () => void
  onSend: (details: { customerName: string email: string cc: string }) => void
}) {
  const [customerName, setCustomerName] = useState(
    row.customer === "Walk-in" ? "" : row.customer,
  )
  const [email, setEmail] = useState("")
  const [cc, setCc] = useState("")

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(34,32,31,0.32)] p-[16px]"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-tax-invoice-title"
        onSubmit={(event) => {
          event.preventDefault()
          onSend({ customerName, email, cc })
        }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[480px] rounded-[12px] bg-white shadow-[0px_12px_40px_rgba(18,18,18,0.2)]"
      >
        <div className="flex items-center border-b border-[#e3e2dd] px-[24px] py-[20px]">
          <div className="min-w-0 flex-1">
            <h2
              id="email-tax-invoice-title"
              className="font-['Inter:Semibold'] text-[20px] leading-[28px] text-[#22201f]"
            >
              Email tax invoice
            </h2>
            <p className="mt-[4px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#62615d]">
              Sale {row.saleNumber}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[#62615d] hover:bg-[#f4f3ef]"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m4 4 8 8m0-8-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-[16px] px-[24px] py-[20px]">
          {[
            {
              label: "Customer name",
              value: customerName,
              onChange: setCustomerName,
              type: "text",
              required: false,
            },
            {
              label: "Email address",
              value: email,
              onChange: setEmail,
              type: "email",
              required: true,
            },
            {
              label: "Additional email (CC)",
              value: cc,
              onChange: setCc,
              type: "email",
              required: false,
            },
          ].map((field) => (
            <label
              key={field.label}
              className="flex flex-col gap-[6px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f]"
            >
              {field.label}
              <input
                autoFocus={field.label === "Customer name"}
                required={field.required}
                type={field.type}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="h-[40px] rounded-[8px] border border-[#bbbab6] px-[12px] font-['Inter:Regular'] outline-none focus:border-[#3390e0] focus:shadow-[0_0_0_3px_#edf6ff]"
              />
            </label>
          ))}
          <p className="font-['Inter:Regular'] text-[13px] leading-[18px] text-[#62615d]">
            The tax invoice for {row.total} will be attached to the email.
          </p>
        </div>
        <div className="flex justify-end gap-[8px] border-t border-[#e3e2dd] px-[24px] py-[16px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] border border-[#bbbab6] px-[14px] font-['Inter:Semibold'] text-[14px] text-[#22201f] hover:bg-[#f9f8f4]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-[36px] rounded-[8px] bg-[#1e72c4] px-[16px] font-['Inter:Semibold'] text-[14px] text-white hover:bg-[#1558a0]"
          >
            Send email
          </button>
        </div>
      </form>
    </div>
  )
}

function InvoicePdfPreview({
  row,
  onClose,
}: {
  row: TransactionRow
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[150] flex flex-col bg-[#f4f3ef]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-preview-title"
    >
      <div className="flex h-[64px] shrink-0 items-center gap-[12px] border-b border-[#e3e2dd] bg-white px-[20px]">
        <button
          type="button"
          onClick={onClose}
          className="rounded-[8px] px-[12px] py-[8px] font-['Inter:Medium'] text-[14px] text-[#22201f] hover:bg-[#f9f8f4]"
        >
          Back to invoice
        </button>
        <h2
          id="invoice-preview-title"
          className="flex-1 font-['Inter:Semibold'] text-[16px] text-[#22201f]"
        >
          PDF preview
        </h2>
        <span className="font-['Inter:Regular'] text-[13px] text-[#62615d]">
          Tax invoice {row.saleNumber}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-[24px]">
        <TaxInvoiceDocument row={row} />
      </div>
    </div>
  )
}

function TaxInvoiceDocument({ row }: { row: TransactionRow }) {
  const numberFromAmount = (amount: string) =>
    Number(amount.replace(/[^\d.-]/g, "")) || 0
  const currency = (amount: number) =>
    amount.toLocaleString("en-AU", { style: "currency", currency: "AUD" })
  const totalExTax = numberFromAmount(row.netAmount)
  const tax = numberFromAmount(row.taxAmount)
  const subtotal = totalExTax + tax
  const totalIncludingTax = numberFromAmount(row.total)
  const tip = numberFromAmount(row.tipAmount)
  const surcharge = numberFromAmount(row.surcharge)
  const tendered = row.payments.toLowerCase().includes("cash")
    ? Math.ceil(numberFromAmount(row.total))
    : numberFromAmount(row.total)
  const change = Math.max(0, tendered - numberFromAmount(row.total))
  const itemCount = Math.max(row.products.length, 1)

  return (
    <article className="mx-auto w-full max-w-[920px] rounded-[12px] border border-[#e3e2dd] bg-white px-[24px] py-[28px] shadow-[0_2px_8px_rgba(34,32,31,0.05)] sm:px-[48px] sm:py-[40px]">
      <header className="flex flex-wrap items-start justify-between gap-[24px] border-b border-[#e3e2dd] pb-[28px]">
        <div className="min-w-[220px]">
          <h2 className="font-['Inter:Regular'] text-[28px] leading-[36px] tracking-[-0.02em] text-[#45464d] sm:text-[32px]">
            Tax invoice
          </h2>
          <div className="mt-[28px] font-['Inter:Regular'] text-[14px] leading-[24px] text-[#45464d] sm:text-[15px]">
            <p className="font-['Inter:Semibold'] text-[#22201f]">
              Kounta Cafe {row.site} - Internal Test
            </p>
            <p>36-42 Chippen St, Chippendale, NSW 2008</p>
            <p>Business Number: Kounta</p>
            <p>Phone: 0285992247</p>
            <p>
              Email: <span className="text-[#77787d]">test@kounta.com</span>
            </p>
            <p>
              Website: <span className="text-[#77787d]">-</span>
            </p>
          </div>
        </div>
        <div className="flex min-w-[180px] flex-col items-start gap-[14px] sm:items-end">
          <div
            className="flex items-center gap-[8px] text-[#22201f]"
            aria-label="Lightspeed"
          >
            <svg
              aria-hidden="true"
              width="24"
              height="28"
              viewBox="0 0 24 28"
              fill="none"
            >
              <path
                d="M13.8 2.5 4.5 15.1a2.5 2.5 0 0 0 .3 3.3l4.8 5a2.4 2.4 0 0 0 3.8-.4l6.1-10.5a2.7 2.7 0 0 0-.4-3.2L13.8 2.5Z"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="m13.7 9.2-4.5 6.1 3.1 3.2 3.2-5.6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-['Inter:Semibold'] text-[19px] tracking-[-0.04em]">
              lightspeed
            </span>
          </div>
          <div className="text-left font-['Inter:Regular'] text-[13px] leading-[22px] text-[#62636a] sm:text-right sm:text-[14px]">
            <p className="font-['Inter:Medium'] text-[#45464d]">
              Receipt Number: {row.saleNumber}
            </p>
            <p>{row.dateTime}</p>
            <p>Served by: {row.operator}</p>
          </div>
        </div>
      </header>

      <section className="pt-[28px] sm:pt-[36px]">
        <h3 className="mb-[18px] font-['Inter:Medium'] text-[20px] leading-[28px] text-[#45464d]">
          Purchase summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d9dadd] font-['Inter:Semibold'] text-[12px] uppercase tracking-[0.04em] text-[#62636a]">
                <th className="py-[12px] pr-[16px]">Description</th>
                <th className="py-[12px] pl-[16px] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="font-['Inter:Regular'] text-[14px] leading-[22px] text-[#45464d] sm:text-[15px]">
              {row.products.map((product, index) => (
                <tr
                  key={`${product}-${index}`}
                  className="border-b border-[#eeeff0]"
                >
                  <td className="py-[10px] pr-[16px]">{product}</td>
                  <td className="py-[10px] pl-[16px] text-right font-['Inter:Medium'] text-[#45464d]">
                    {currency(subtotal / itemCount)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-[#d9dadd] font-['Inter:Medium']">
                <td className="py-[11px] pr-[16px]">Sub total</td>
                <td className="py-[11px] pl-[16px] text-right">
                  {currency(subtotal)}
                </td>
              </tr>
              <tr>
                <td className="pt-[12px] pr-[16px]">Total ex tax</td>
                <td className="pt-[12px] pl-[16px] text-right">
                  {currency(totalExTax)}
                </td>
              </tr>
              <tr>
                <td className="py-[5px] pr-[16px]">GST</td>
                <td className="py-[5px] pl-[16px] text-right">
                  {currency(tax)}
                </td>
              </tr>
              {tip > 0 && (
                <tr>
                  <td className="py-[5px] pr-[16px]">Tip</td>
                  <td className="py-[5px] pl-[16px] text-right">
                    {currency(tip)}
                  </td>
                </tr>
              )}
              {surcharge > 0 && (
                <tr>
                  <td className="py-[5px] pr-[16px]">Surcharge</td>
                  <td className="py-[5px] pl-[16px] text-right">
                    {currency(surcharge)}
                  </td>
                </tr>
              )}
              <tr className="border-b border-[#d9dadd] font-['Inter:Semibold'] text-[20px] text-[#35363b]">
                <td className="py-[8px] pr-[16px]">Total inc tax</td>
                <td className="py-[8px] pl-[16px] text-right">
                  {currency(totalIncludingTax)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-[22px] flex flex-wrap items-end justify-between gap-[12px] border-b border-[#d9dadd] pb-[16px]">
        <div>
          <p className="font-['Inter:Regular'] text-[13px] text-[#62636a]">
            Payment mean
          </p>
          <p className="mt-[2px] font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#35363b]">
            {row.payments}
          </p>
        </div>
        <p className="font-['Inter:Semibold'] text-[18px] text-[#35363b]">
          {currency(tendered)}
        </p>
        <div className="flex w-full items-center justify-between gap-[16px] sm:w-auto sm:min-w-[200px]">
          <span className="font-['Inter:Semibold'] text-[17px] text-[#35363b]">
            Change
          </span>
          <span className="font-['Inter:Semibold'] text-[17px] text-[#35363b]">
            {currency(change)}
          </span>
        </div>
      </section>
      <p className="pt-[12px] text-center font-['Inter:Regular'] text-[13px] text-[#77787d]">
        All prices shown in AUD
      </p>
    </article>
  )
}

function TransactionInvoicePage({
  row,
  onPreviewPdf,
  onEmailInvoice,
}: {
  row: TransactionRow
  onPreviewPdf: () => void
  onEmailInvoice: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto bg-white px-[24px] py-[24px] sm:px-[32px] sm:py-[32px]">
      <div className="mx-auto flex w-full max-w-[920px] flex-wrap items-center gap-[12px] pb-[16px]">
        <h1 className="min-w-0 flex-1 truncate font-['Inter:Semibold'] text-[18px] leading-[24px] text-[#22201f]">
          Tax invoice {row.saleNumber}
        </h1>
        <div className="flex shrink-0 flex-wrap gap-[8px]">
          <button
            type="button"
            onClick={onPreviewPdf}
            className="flex h-[36px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
          >
            Preview PDF
          </button>
          <button
            type="button"
            onClick={onEmailInvoice}
            className="h-[36px] rounded-[8px] bg-[#1e72c4] px-[14px] font-['Inter:Semibold'] text-[14px] text-white hover:bg-[#1558a0]"
          >
            Email tax invoice
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <TaxInvoiceDocument row={row} />
      </div>
    </div>
  )
}

function SortIcon({
  isSorted,
  direction,
}: {
  isSorted: boolean
  direction: "asc" | "desc"
}) {
  if (!isSorted) {
    return (
      <svg
        aria-hidden="true"
        className="size-[20px] shrink-0 text-[#22201f]"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M7.5 12.5L10 15L12.5 12.5M7.5 9.5L10 7L12.5 9.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      className={`size-[20px] shrink-0 text-[#22201f] transition-transform ${
        direction === "desc" ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10 14.5V7.5M13.5 11L10 7.5L6.5 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const TERMINAL_PREFIX_BY_SITE: Record<string, Record<string, string>> = {
  amberley: { "Front POS": "SP-4", "POS A": "SP-2", "Back POS": "SP-3" },
  brambleton: { "Front POS": "SP-1", "POS A": "SP-2", "Back POS": "SP-5" },
  oakridge: { "Front POS": "SP-6", "POS A": "SP-3", "Back POS": "SP-2" },
  pinehollow: { "Front POS": "SP-2", "POS A": "SP-5", "Back POS": "SP-1" },
  riverbend: { "Front POS": "SP-3", "POS A": "SP-4", "Back POS": "SP-6" },
  willowmere: { "Front POS": "SP-5", "POS A": "SP-1", "Back POS": "SP-4" },
}

function formatTransactionSaleNumber(
  siteId: string,
  terminal: string,
  sequence: number,
) {
  const prefix = TERMINAL_PREFIX_BY_SITE[siteId]?.[terminal] ?? "SP-1"
  return `${prefix} 093000${String(sequence).padStart(4, "0")}`
}

const BASE_TRANSACTION_ROWS: TransactionRow[] = [
  {
    saleNumber: formatTransactionSaleNumber("amberley", "Front POS", 4724),
    dateTime: "30 Sep 2026, 10:42 am",
    site: "Amberley",
    terminal: "Front POS",
    operator: "Alex Morgan",
    customer: "Jamie Wilson",
    tipAmount: "$4.50",
    netAmount: "$42.00",
    taxAmount: "$4.20",
    total: "$50.70",
    payments: "Lightspeed Payments",
    surcharge: "$0.00",
    siteId: "amberley",
    register: "Front POS",
    products: ["Long Black", "Salmon Fillet"],
    categories: ["Coffee", "Mains"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("brambleton", "POS A", 4723),
    dateTime: "30 Sep 2026, 10:36 am",
    site: "Brambleton",
    terminal: "POS A",
    operator: "Jordan Lee",
    customer: "Walk-in",
    tipAmount: "$0.00",
    netAmount: "$18.18",
    taxAmount: "$1.82",
    total: "$20.00",
    payments: "Account credit",
    surcharge: "$0.00",
    siteId: "brambleton",
    register: "POS A",
    products: ["Margherita Pizza - 12in"],
    categories: ["Mains"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("oakridge", "Back POS", 4722),
    dateTime: "30 Sep 2026, 10:21 am",
    site: "Oakridge",
    terminal: "Back POS",
    operator: "Sam Taylor",
    customer: "Morgan Davis",
    tipAmount: "$2.00",
    netAmount: "$16.36",
    taxAmount: "$1.64",
    total: "$20.00",
    payments: "Cash",
    surcharge: "$0.00",
    siteId: "oakridge",
    register: "Back POS",
    products: ["Eggs Bene - Bacon"],
    categories: ["Mains"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("pinehollow", "Front POS", 4721),
    dateTime: "30 Sep 2026, 10:08 am",
    site: "Pinehollow",
    terminal: "Front POS",
    operator: "Casey Brown",
    customer: "Taylor Smith",
    tipAmount: "$1.25",
    netAmount: "$11.14",
    taxAmount: "$1.11",
    total: "$13.50",
    payments: "Lightspeed Payments",
    surcharge: "$0.00",
    siteId: "pinehollow",
    register: "Front POS",
    products: ["Matcha Latte - Regular", "Hashbrown"],
    categories: ["Coffee", "Sides"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("riverbend", "POS A", 4720),
    dateTime: "30 Sep 2026, 9:54 am",
    site: "Riverbend",
    terminal: "POS A",
    operator: "Riley Chen",
    customer: "Walk-in",
    tipAmount: "$0.00",
    netAmount: "$27.27",
    taxAmount: "$2.73",
    total: "$30.00",
    payments: "Gift cards",
    surcharge: "$0.00",
    siteId: "riverbend",
    register: "POS A",
    products: ["Salt & Pepper Squid"],
    categories: ["Mains"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("willowmere", "Back POS", 4719),
    dateTime: "30 Sep 2026, 9:41 am",
    site: "Willowmere",
    terminal: "Back POS",
    operator: "Alex Morgan",
    customer: "Avery Taylor",
    tipAmount: "$3.00",
    netAmount: "$12.73",
    taxAmount: "$1.27",
    total: "$17.00",
    payments: "Account credit",
    surcharge: "$0.00",
    siteId: "willowmere",
    register: "Back POS",
    products: ["Pastry selection"],
    categories: ["Pastries"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("amberley", "POS A", 4718),
    dateTime: "30 Sep 2026, 9:22 am",
    site: "Amberley",
    terminal: "POS A",
    operator: "Jordan Lee",
    customer: "Chris Martin",
    tipAmount: "$0.00",
    netAmount: "$3.00",
    taxAmount: "$0.30",
    total: "$3.30",
    payments: "Cash",
    surcharge: "$0.00",
    siteId: "amberley",
    register: "POS A",
    products: ["Long Black"],
    categories: ["Coffee"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("brambleton", "Front POS", 4717),
    dateTime: "30 Sep 2026, 9:10 am",
    site: "Brambleton",
    terminal: "Front POS",
    operator: "Sam Taylor",
    customer: "Walk-in",
    tipAmount: "$2.50",
    netAmount: "$22.73",
    taxAmount: "$2.27",
    total: "$27.50",
    payments: "Gift cards",
    surcharge: "$0.00",
    siteId: "brambleton",
    register: "Front POS",
    products: ["Chef special pizza"],
    categories: ["Mains"],
    taxType: "Inclusive",
    deleted: false,
  },
  {
    saleNumber: formatTransactionSaleNumber("oakridge", "Back POS", 4716),
    dateTime: "30 Sep 2026, 8:58 am",
    site: "Oakridge",
    terminal: "Back POS",
    operator: "Casey Brown",
    customer: "Walk-in",
    tipAmount: "$0.00",
    netAmount: "$7.27",
    taxAmount: "$0.73",
    total: "$8.00",
    payments: "Cash",
    surcharge: "$0.00",
    siteId: "oakridge",
    register: "Back POS",
    products: ["Hashbrown"],
    categories: ["Sides"],
    taxType: "Inclusive",
    deleted: true,
  },
]

const TRANSACTION_ROWS: TransactionRow[] = [
  ...BASE_TRANSACTION_ROWS.map((row) => {
    const [, time = ""] = row.dateTime.split(",")
    const index = BASE_TRANSACTION_ROWS.indexOf(row)
    return {
      ...row,
      dateTime:
        index < 5
          ? `${new Date(_today.getFullYear(), [8, 7, 6, 4, 1][index], [30, 18, 12, 25, 9][index]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${time.trim()}`
          : `${fmtDate(_today)},${time}`,
      siteId: index < 5 ? "footscray" : row.siteId,
      site: index < 5 ? "Footscray" : row.site,
      terminal: index < 5 ? "Old Front POS" : row.terminal,
      payments: index < 5 ? "Legacy EFTPOS" : row.payments,
      deleted: false,
      orderType:
        index < 5
          ? "Legacy dine-in"
          : ["Takeaway", "Dine in", "Pickup", "Delivery"][index % 4],
      source:
        index < 5
          ? "Legacy delivery"
          : ["POS", "Online ordering", "Delivery partner"][index % 3],
    }
  }),
  ...Array.from({ length: 260 }, (_, index) => {
    const site = SITE_OPTIONS.slice(1)[index % (SITE_OPTIONS.length - 1)]
    const terminals = REGISTERS_BY_SITE[site.id]
    const productsByCategory = [
      { product: "Long Black", category: "Coffee" },
      { product: "Pastry selection", category: "Pastries" },
      { product: "Chef special pizza", category: "Mains" },
      { product: "Hashbrown", category: "Sides" },
      { product: "Matcha Latte - Regular", category: "Coffee" },
      { product: "Salt & Pepper Squid", category: "Mains" },
    ]
    const { product, category } =
      productsByCategory[index % productsByCategory.length]
    const payment = [
      "Account credit",
      "Cash",
      "Gift cards",
      "Lightspeed Payments",
    ][index % 4]
    const total = 8.5 + ((index * 7.35) % 125)
    const net = total / 1.1
    const date = new Date(
      _today.getFullYear(),
      _today.getMonth(),
      _today.getDate() - Math.floor(Math.max(0, index - 240) / 15),
      8 + (index % 10),
      (index * 7) % 60,
    )
    const formatAmount = (amount: number) => `$${amount.toFixed(2)}`

    return {
      saleNumber: formatTransactionSaleNumber(
        site.id,
        terminals[index % terminals.length],
        4715 - index,
      ),
      dateTime: `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }).toLowerCase()}`,
      site: site.name.split(" – ")[0],
      terminal: terminals[index % terminals.length],
      orderType: ["Takeaway", "Dine in", "Pickup", "Delivery"][index % 4],
      source: ["POS", "Online ordering", "Delivery partner"][index % 3],
      operator: [
        "Alex Morgan",
        "Jordan Lee",
        "Sam Taylor",
        "Casey Brown",
        "Riley Chen",
      ][index % 5],
      customer: [
        "Walk-in",
        "Jamie Wilson",
        "Morgan Davis",
        "Taylor Smith",
        "Avery Taylor",
        "Chris Martin",
      ][index % 6],
      tipAmount: formatAmount([0, 1.5, 2.5, 3.5][index % 4]),
      netAmount: formatAmount(net),
      taxAmount: formatAmount(total - net),
      total: formatAmount(total),
      payments: payment,
      surcharge: formatAmount(
        payment === "Lightspeed Payments" ? total * 0.015 : 0,
      ),
      siteId: site.id,
      register: terminals[index % terminals.length],
      products: [product],
      categories: [category],
      taxType: "Inclusive",
      deleted: index % 13 === 0,
    }
  }),
]

function TransactionsPage({
  onInvoiceViewChange,
  requestedSavedViewName,
  isViewingSharedReport,
  onRegisterSavedViewHeaderActions,
  onSavedViewRenamed,
  onSavedViewUpdated,
  selectedSiteIds,
  selectedSites,
  siteLabel,
  selectedRegisters,
  includeDeletedRegisters,
  showDeletedSites,
  onToggleShowDeletedSites,
  dateSelected,
  isRefreshing,
  minutesSinceUpdate,
  onRefresh,
  onToggleSite,
  onToggleRegister,
  onToggleIncludeDeletedRegisters,
  onApplyLocationSnapshot,
  onSelectDate,
}: {
  onInvoiceViewChange: (isOpen: boolean) => void
  requestedSavedViewName: string | null
  isViewingSharedReport: boolean
  onRegisterSavedViewHeaderActions: (actions: SavedViewHeaderActions) => void
  onSavedViewRenamed: (oldName: string, newName: string) => void
  onSavedViewUpdated: (
    oldName: string,
    name: string,
    description: string,
    sharedWithTeam: boolean,
  ) => void
  selectedSiteIds: string[]
  selectedSites: SiteOption[]
  siteLabel: string
  selectedRegisters: string[]
  includeDeletedRegisters: boolean
  showDeletedSites: boolean
  onToggleShowDeletedSites: () => void
  dateSelected: { id: string label: string }
  isRefreshing: boolean
  minutesSinceUpdate: number
  onRefresh: () => void
  onToggleSite: (id: string) => void
  onToggleRegister: (key: string) => void
  onToggleIncludeDeletedRegisters: () => void
  onApplyLocationSnapshot: (sites: string[], registers: string[]) => void
  onSelectDate: (id: string, label: string) => void
}) {
  const stored = loadStoredValue<TransactionsStorage>(
    TRANSACTIONS_STORAGE_KEY,
    { savedViews: [], defaultView: "__system__" },
  )
  const initialDefault = stored.savedViews.find(
    (view) => view.name === stored.defaultView,
  )
  const [savedViews, setSavedViews] = useState<TransactionView[]>(
    stored.savedViews,
  )
  const [defaultView, setDefaultView] = useState<string | null>(
    stored.defaultView,
  )
  const [activeViewName, setActiveViewName] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingSavedViewName, setEditingSavedViewName] =
    useState<string | null>(null)
  const [toast, setToast] = useState<ToastContent | null>(null)
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [originalSavedView, setOriginalSavedView] =
    useState<TransactionView | null>(null)
  const [customDateRange, setCustomDateRange] =
    useState<TransactionDateRange | null>(
      initialDefault?.customDateRange ?? null,
    )
  const [paymentTypes, setPaymentTypes] = useState<string[]>(
    initialDefault?.paymentTypes ?? [],
  )
  const [customers, setCustomers] = useState<string[]>(
    initialDefault?.customers ?? [],
  )
  const [showDeletedOptions, setShowDeletedOptions] = useState(
    shouldShowDeletedOptions(initialDefault),
  )
  const [includeDeletedPaymentTypes, setIncludeDeletedPaymentTypes] =
    useState(true)
  const [includeDeletedOrderTypes, setIncludeDeletedOrderTypes] = useState(true)
  const [includeDeletedSources, setIncludeDeletedSources] = useState(true)
  const [timeRange, setTimeRange] = useState<TransactionTimeRange | null>(
    initialDefault?.timeRange ?? null,
  )
  const [loyaltyMember, setLoyaltyMember] = useState<"All" | "Yes" | "No">(
    initialDefault?.loyaltyMember ?? "All",
  )
  const [visibleFilters, setVisibleFilters] = useState<string[]>(
    initialDefault
      ? [
          ...(initialDefault.visibleFilters ?? []),
          ...(initialDefault.paymentTypes?.length ? ["Payment type"] : []),
        ]
      : [],
  )
  const [terminals, setTerminals] = useState<string[]>(
    initialDefault?.terminals ?? [],
  )
  const [orderTypes, setOrderTypes] = useState<string[]>(
    initialDefault?.orderTypes ?? [],
  )
  const [sources, setSources] = useState<string[]>(
    initialDefault?.sources ?? [],
  )
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(() => {
    return loadTransactionColumns()
  })
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    loadTransactionColumnOrder(),
  )
  const [isCustomiseColumnsOpen, setIsCustomiseColumnsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSaleNumbers, setSelectedSaleNumbers] = useState<Set<string>>(
    () => new Set(),
  )
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false)
  const [sort, setSortState] = useState<{
    key: string
    direction: "asc" | "desc"
  }>({ key: "dateTime", direction: "desc" })
  const setSort: typeof setSortState = (update) =>
    setSortState((current) => {
      const next = typeof update === "function" ? update(current) : update
      const nextSortKey =
        next.key === "date" || next.key === "time" ? "dateTime" : next.key
      const currentSortKey =
        current.key === "date" || current.key === "time"
          ? "dateTime"
          : current.key
      return {
        key: nextSortKey,
        direction:
          currentSortKey === "dateTime" && nextSortKey === "dateTime"
            ? current.direction === "asc"
              ? "desc"
              : "asc"
            : next.direction,
      }
    })
  const [isTransactionTableScrolled, setIsTransactionTableScrolled] =
    useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<TransactionRow | null>(
    null,
  )
  const [isEmailInvoiceOpen, setIsEmailInvoiceOpen] = useState(false)
  const [isInvoicePdfPreviewOpen, setIsInvoicePdfPreviewOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const bulkActionsRef = useRef<HTMLDivElement>(null)
  const transactionTableRef = useRef<HTMLDivElement>(null)
  useDropdownClose(bulkActionsRef, () => setIsBulkActionsOpen(false))
  useDropdownClose(statusRef, () => {
    if (openFilter === "status") setOpenFilter(null)
  })

  useEffect(() => {
    window.localStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify({ savedViews, defaultView } satisfies TransactionsStorage),
    )
  }, [savedViews, defaultView])

  useEffect(() => {
    window.localStorage.setItem(
      TRANSACTION_COLUMNS_STORAGE_KEY,
      JSON.stringify(visibleColumnKeys),
    )
  }, [visibleColumnKeys])

  useEffect(() => {
    window.localStorage.setItem(
      TRANSACTION_COLUMN_ORDER_STORAGE_KEY,
      JSON.stringify(columnOrder),
    )
  }, [columnOrder])

  useEffect(() => {
    if (initialDefault) {
      const sites = SITE_OPTIONS.slice(1).filter(
        (site) =>
          (initialDefault.sites.length === 0 ||
            initialDefault.sites.includes(site.id)) &&
          (showDeletedSites || !site.deleted),
      )
      const registers = sites.flatMap((site) =>
        (initialDefault.terminals ?? [])
          .filter((name) => (REGISTERS_BY_SITE[site.id] ?? []).includes(name))
          .map((name) => `${site.id}:${name}`),
      )
      onApplyLocationSnapshot(initialDefault.sites, registers)
      onSelectDate(initialDefault.date.id, initialDefault.date.label)
      setPaymentTypes(initialDefault.paymentTypes ?? [])
      setCustomers(initialDefault.customers ?? [])
      setShowDeletedOptions(shouldShowDeletedOptions(initialDefault))
      setTimeRange(initialDefault.timeRange ?? null)
      setLoyaltyMember(initialDefault.loyaltyMember ?? "All")
      setTerminals([])
      setActiveViewName(initialDefault.name)
    } else {
      onApplyLocationSnapshot([], [])
      onSelectDate("today", "Today")
    }
  }, [])

  useEffect(() => {
    if (!requestedSavedViewName) return
    const view = savedViews.find(
      (savedView) => savedView.name === requestedSavedViewName,
    )
    setOriginalSavedView(view ?? null)
    if (view && !isViewingSharedReport) {
      applyView(view)
    } else resetFilters()
  }, [requestedSavedViewName, isViewingSharedReport])

  const filterSnapshot = (): TransactionView => ({
    name: "",
    sites: selectedSiteIds,
    date: dateSelected,
    customDateRange,
    paymentTypes,
    customers,
    deletedOptions: showDeletedOptions ? "Show" : "Hide",
    timeRange,
    loyaltyMember,
    visibleFilters,
    terminals:
      selectedRegisters.length > 0
        ? [
            ...new Set(
              selectedRegisters.map((key) => key.split(":").slice(1).join(":")),
            ),
          ]
        : terminals,
    orderTypes,
    sources,
  })
  const applyView = (view: TransactionView) => {
    const sites = SITE_OPTIONS.slice(1).filter(
      (site) =>
        (view.sites.length === 0 || view.sites.includes(site.id)) &&
        (showDeletedSites || !site.deleted),
    )
    const registers = sites.flatMap((site) =>
      (view.terminals ?? [])
        .filter((name) => (REGISTERS_BY_SITE[site.id] ?? []).includes(name))
        .map((name) => `${site.id}:${name}`),
    )
    onApplyLocationSnapshot(view.sites, registers)
    onSelectDate(view.date.id, view.date.label)
    setCustomDateRange(view.customDateRange ?? null)
    setPaymentTypes(view.paymentTypes ?? [])
    setCustomers(view.customers ?? [])
    setShowDeletedOptions(shouldShowDeletedOptions(view))
    setTimeRange(view.timeRange ?? null)
    setLoyaltyMember(view.loyaltyMember ?? "All")
    setVisibleFilters([
      ...(view.visibleFilters ?? []),
      ...(view.paymentTypes?.length ? ["Payment type"] : []),
    ])
    setTerminals([])
    setOrderTypes(view.orderTypes ?? [])
    setSources(view.sources ?? [])
    setActiveViewName(view.name)
    setCurrentPage(1)
  }
  const resetFilters = () => {
    onApplyLocationSnapshot([], [])
    onSelectDate("today", "Today")
    setPaymentTypes([])
    setCustomers([])
    setShowDeletedOptions(false)
    setTimeRange(null)
    setLoyaltyMember("All")
    setVisibleFilters([])
    setTerminals([])
    setOrderTypes([])
    setSources([])
    setCustomDateRange(null)
    setActiveViewName(null)
    setOpenFilter(null)
    setCurrentPage(1)
  }
  const isFiltered =
    selectedSiteIds.length > 0 ||
    selectedRegisters.length > 0 ||
    dateSelected.id !== "today" ||
    paymentTypes.length > 0 ||
    customers.length > 0 ||
    showDeletedOptions ||
    timeRange !== null ||
    loyaltyMember !== "All" ||
    visibleFilters.length > 0 ||
    terminals.length > 0 ||
    orderTypes.length > 0 ||
    sources.length > 0
  const hasChangedSavedView = requestedSavedViewName
    ? isViewingSharedReport || !originalSavedView
      ? isFiltered
      : JSON.stringify({
          sites: originalSavedView.sites ?? [],
          date: originalSavedView.date,
          customDateRange: originalSavedView.customDateRange ?? null,
          paymentTypes: originalSavedView.paymentTypes ?? [],
          customers: originalSavedView.customers ?? [],
          deletedOptions: shouldShowDeletedOptions(originalSavedView)
            ? "Show"
            : "Hide",
          timeRange: originalSavedView.timeRange ?? null,
          loyaltyMember: originalSavedView.loyaltyMember ?? "All",
          visibleFilters: [
            ...(originalSavedView.visibleFilters ?? []),
            ...(originalSavedView.paymentTypes?.length ? ["Payment type"] : []),
          ],
          terminals: originalSavedView.terminals ?? [],
          orderTypes: originalSavedView.orderTypes ?? [],
          sources: originalSavedView.sources ?? [],
        }) !==
        JSON.stringify({
          sites: selectedSiteIds,
          date: dateSelected,
          customDateRange,
          paymentTypes,
          customers,
          deletedOptions: showDeletedOptions ? "Show" : "Hide",
          timeRange,
          loyaltyMember,
          visibleFilters,
          terminals:
            selectedRegisters.length > 0
              ? [
                  ...new Set(
                    selectedRegisters.map((key) =>
                      key.split(":").slice(1).join(":"),
                    ),
                  ),
                ]
              : terminals,
          orderTypes,
          sources,
        })
    : isFiltered
  const rangeEnd =
    dateSelected.id === "custom" && customDateRange
      ? (parseDateInputValue(customDateRange.to) ?? new Date(_today))
      : new Date(_today)
  const rangeStart =
    dateSelected.id === "custom" && customDateRange
      ? (parseDateInputValue(customDateRange.from) ?? new Date(_today))
      : new Date(_today)
  if (dateSelected.id === "custom" && customDateRange) {
    const customStart = parseDateInputValue(customDateRange.from)
    const customEnd = parseDateInputValue(customDateRange.to)
    if (customStart) rangeStart.setTime(customStart.getTime())
    if (customEnd) {
      rangeEnd.setTime(customEnd.getTime())
      rangeEnd.setHours(23, 59, 59, 999)
    }
  }
  switch (dateSelected.id) {
    case "yesterday":
      rangeStart.setDate(rangeStart.getDate() - 1)
      rangeEnd.setDate(rangeEnd.getDate() - 1)
      break
    case "past-week":
      rangeStart.setDate(rangeStart.getDate() - 6)
      break
    case "week-to-date":
      rangeStart.setTime(startOfWeek(rangeEnd).getTime())
      break
    case "past-4-weeks":
      rangeStart.setDate(rangeStart.getDate() - 27)
      break
    case "month-to-date":
      rangeStart.setTime(
        Math.max(
          new Date(
            rangeStart.getFullYear(),
            rangeStart.getMonth(),
            1,
          ).getTime(),
          addDays(rangeEnd, -29).getTime(),
        ),
      )
      break
  }
  const customRangeIsValid = (() => {
    if (dateSelected.id !== "custom") return true
    if (!customDateRange) return false
    const start = parseDateInputValue(customDateRange.from)
    const end = parseDateInputValue(customDateRange.to)
    if (!start || !end || end > _today) return false
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
    return days >= 1 && days <= 30
  })()
  const activeRows = TRANSACTION_ROWS.filter(
    (row) =>
      customRangeIsValid &&
      (() => {
        const transactionDate = parseTransactionDate(row.dateTime)
        return (
          transactionDate !== null &&
          transactionDate >= rangeStart &&
          transactionDate <= rangeEnd
        )
      })() &&
      (selectedSiteIds.length === 0 || selectedSiteIds.includes(row.siteId)) &&
      (!visibleFilters.includes("Payment type") ||
        paymentTypes.length === 0 ||
        paymentTypes.includes(row.payments)) &&
      (showDeletedOptions ||
        (!DELETED_SITE_IDS.has(row.siteId) &&
          !DELETED_TERMINAL_OPTION_SET.has(row.terminal) &&
          !DELETED_CUSTOMER_OPTIONS.includes(row.customer))) &&
      (customers.length === 0 || customers.includes(row.customer)) &&
      (showDeletedOptions ||
        includeDeletedPaymentTypes ||
        !DELETED_PAYMENT_OPTION_SET.has(row.payments)) &&
      (showDeletedOptions ||
        includeDeletedOrderTypes ||
        !DELETED_ORDER_TYPE_OPTION_SET.has(row.orderType ?? "Takeaway")) &&
      (showDeletedOptions ||
        includeDeletedSources ||
        !DELETED_SOURCE_OPTION_SET.has(row.source ?? "POS")) &&
      (selectedRegisters.length === 0 ||
        selectedRegisters.includes(`${row.siteId}:${row.terminal}`)) &&
      (terminals.length === 0 || terminals.includes(row.terminal)) &&
      (orderTypes.length === 0 ||
        orderTypes.includes(row.orderType ?? "Takeaway")) &&
      (sources.length === 0 || sources.includes(row.source ?? "POS")) &&
      (loyaltyMember === "All" ||
        !visibleFilters.includes("Loyalty member") ||
        (loyaltyMember === "Yes") ===
          (row.loyaltyMember ?? row.customer !== "Walk-in")) &&
      (!timeRange ||
        (() => {
          const minutes = getTransactionTimeMinutes(row.dateTime)
          if (minutes === null) return false
          const from =
            Number(timeRange.from.slice(0, 2)) * 60 +
            Number(timeRange.from.slice(3))
          const to =
            Number(timeRange.to.slice(0, 2)) * 60 +
            Number(timeRange.to.slice(3))
          return from <= to
            ? minutes >= from && minutes <= to
            : minutes >= from || minutes <= to
        })()) &&
      (searchQuery.trim() === "" ||
        Object.values(row).some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
        )),
  ).map((row) => {
    const [date, time = ""] = row.dateTime.split(",")
    return { ...row, date, time: time.trim() }
  })
  const sortedRows = [...activeRows].sort((left, right) => {
    const sortKey =
      sort.key === "date" || sort.key === "time"
        ? "dateTime"
        : sort.key as keyof TransactionRow
    const leftValue = left[sortKey]
    const rightValue = right[sortKey]
    let comparison: number
    if (
      ["tipAmount", "netAmount", "taxAmount", "total", "surcharge"].includes(
        sortKey,
      )
    ) {
      comparison =
        Number(String(leftValue).replace(/[$,]/g, "")) -
        Number(String(rightValue).replace(/[$,]/g, ""))
    } else if (sortKey === "dateTime") {
      comparison =
        Date.parse(String(leftValue)) - Date.parse(String(rightValue))
    } else if (
      typeof leftValue === "boolean" &&
      typeof rightValue === "boolean"
    ) {
      comparison = Number(leftValue) - Number(rightValue)
    } else {
      comparison = String(leftValue).localeCompare(String(rightValue))
    }
    return sort.direction === "asc" ? comparison : -comparison
  })
  const pageSize = 20
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const page = Math.min(currentPage, pageCount)
  const pageRows = sortedRows.slice((page - 1) * pageSize, page * pageSize)
  const pageNumbers: Array<number | "ellipsis-start" | "ellipsis-end"> =
    pageCount <= 9
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : page <= 5
        ? [1, 2, 3, 4, 5, 6, 7, "ellipsis-end", pageCount]
        : page >= pageCount - 4
          ? [
              1,
              "ellipsis-start",
              ...Array.from({ length: 7 }, (_, index) => pageCount - 6 + index),
            ]
          : [
              1,
              "ellipsis-start",
              page - 2,
              page - 1,
              page,
              page + 1,
              page + 2,
              "ellipsis-end",
              pageCount,
            ]
  const selectedRows = activeRows.filter((row) =>
    selectedSaleNumbers.has(row.saleNumber),
  )
  const allRowsSelected =
    activeRows.length > 0 && selectedRows.length === activeRows.length
  const toggleAllRows = () =>
    setSelectedSaleNumbers((current) => {
      const next = new Set(current)
      if (allRowsSelected)
        activeRows.forEach((row) => next.delete(row.saleNumber))
      else activeRows.forEach((row) => next.add(row.saleNumber))
      return next
    })
  const toggleRow = (saleNumber: string) =>
    setSelectedSaleNumbers((current) => {
      const next = new Set(current)
      if (next.has(saleNumber)) next.delete(saleNumber)
      else next.add(saleNumber)
      return next
    })
  const totals = {
    tipAmount: activeRows.reduce(
      (sum, row) => sum + Number(row.tipAmount.replace(/[$,]/g, "")),
      0,
    ),
    netAmount: activeRows.reduce(
      (sum, row) => sum + Number(row.netAmount.replace(/[$,]/g, "")),
      0,
    ),
    taxAmount: activeRows.reduce(
      (sum, row) => sum + Number(row.taxAmount.replace(/[$,]/g, "")),
      0,
    ),
    total: activeRows.reduce(
      (sum, row) => sum + Number(row.total.replace(/[$,]/g, "")),
      0,
    ),
    surcharge: activeRows.reduce(
      (sum, row) => sum + Number(row.surcharge.replace(/[$,]/g, "")),
      0,
    ),
  }
  const formatTotal = (amount: number) =>
    `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const allColumns: Array<{
    key: string
    sortKey: string
    label: string
    width: string
    align?: string
  }> = [
    {
      key: "saleNumber",
      sortKey: "saleNumber",
      label: "Sale #",
      width: "w-[180px]",
    },
    { key: "date", sortKey: "dateTime", label: "Date", width: "w-[130px]" },
    { key: "time", sortKey: "dateTime", label: "Time", width: "w-[100px]" },
    { key: "site", sortKey: "site", label: "Site", width: "w-[140px]" },
    {
      key: "terminal",
      sortKey: "terminal",
      label: "Register",
      width: "w-[140px]",
    },
    {
      key: "operator",
      sortKey: "operator",
      label: "Operator",
      width: "w-[150px]",
    },
    {
      key: "customer",
      sortKey: "customer",
      label: "Customer",
      width: "w-[150px]",
    },
    {
      key: "loyaltyMember",
      sortKey: "loyaltyMember",
      label: "Loyalty",
      width: "w-[100px]",
    },
    {
      key: "tipAmount",
      sortKey: "tipAmount",
      label: "Tip",
      width: "w-[120px]",
    },
    {
      key: "taxAmount",
      sortKey: "taxAmount",
      label: "Tax",
      width: "w-[120px]",
    },
    {
      key: "netAmount",
      sortKey: "netAmount",
      label: "Total ex. tax",
      width: "w-[130px]",
    },
    {
      key: "total",
      sortKey: "total",
      label: "Total inc. tax",
      width: "w-[120px]",
    },
    {
      key: "payments",
      sortKey: "payments",
      label: "Payments",
      width: "w-[140px]",
    },
    {
      key: "surcharge",
      sortKey: "surcharge",
      label: "Surcharge",
      width: "w-[130px]",
    },
  ]
  const orderedColumns = columnOrder
    .map((key) => allColumns.find((column) => column.key === key))
    .filter(
      (column): column is typeof allColumns[number] => column !== undefined,
    )
  const columns = orderedColumns.filter((column) =>
    visibleColumnKeys.includes(column.key),
  )
  const toggleColumn = (key: string) =>
    setVisibleColumnKeys((current) => {
      if (current.length === 1 && current.includes(key)) return current
      const next = current.includes(key)
        ? current.filter((columnKey) => columnKey !== key)
        : [...current, key]
      return TRANSACTION_COLUMN_KEYS.filter((columnKey) =>
        next.includes(columnKey),
      )
    })
  const reorderColumns = (sourceKey: string, targetKey: string) =>
    setColumnOrder((current) => {
      const sourceIndex = current.indexOf(sourceKey)
      const targetIndex = current.indexOf(targetKey)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const next = [...current]
      next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, sourceKey)
      return next
    })
  const paymentOptions = [
    "Account credit",
    "Bopple",
    "Cash",
    "Gift cards",
    "Lightspeed Payments",
    "Loyalty credit",
    "UberEats",
  ]
  const availableFilters = [
    "Loyalty member",
    "Payment type",
    "Terminal",
    "Order type",
    "Source",
  ].filter((filter) => !visibleFilters.includes(filter))
  const transactionFilterOptions: Record<string, string[]> = {
    "Loyalty member": ["Yes", "No"],
    "Payment type": paymentOptions,
    Terminal: [
      ...new Set(
        TRANSACTION_ROWS.filter(
          (row) => !DELETED_TERMINAL_OPTION_SET.has(row.terminal),
        ).map((row) => row.terminal),
      ),
    ],
    "Order type": [
      ...new Set(
        TRANSACTION_ROWS.filter(
          (row) =>
            !DELETED_ORDER_TYPE_OPTION_SET.has(row.orderType ?? "Takeaway"),
        ).map((row) => row.orderType ?? "Takeaway"),
      ),
    ],
    Source: [
      ...new Set(
        TRANSACTION_ROWS.filter(
          (row) => !DELETED_SOURCE_OPTION_SET.has(row.source ?? "POS"),
        ).map((row) => row.source ?? "POS"),
      ),
    ],
  }
  const deletedTransactionFilterOptions: Record<string, string[]> = {
    "Payment type": DELETED_PAYMENT_OPTIONS,
    Terminal: DELETED_TERMINAL_OPTIONS,
    "Order type": DELETED_ORDER_TYPE_OPTIONS,
    Source: DELETED_SOURCE_OPTIONS,
  }

  function saveView(
    name: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    const savedView = {
      ...filterSnapshot(),
      name,
      description,
      createdBy: CURRENT_CREATOR,
      createdAt: Date.now(),
      sharedWithTeam,
    }
    setSavedViews((current) => [...current, savedView])
    setActiveViewName(name)
    setToast({
      message: "New report saved.",
      actionLabel: "See report",
      onAction: () => applyView(savedView),
    })
  }
  function saveExistingView(name: string, sharedWithTeam: boolean) {
    setSavedViews((current) =>
      current.map((view) =>
        view.name === name
          ? {
              ...filterSnapshot(),
              name,
              description: view.description,
              createdBy: view.createdBy ?? CURRENT_CREATOR,
              createdAt: view.createdAt ?? Date.now(),
              sharedWithTeam,
            }
          : view,
      ),
    )
    setActiveViewName(name)
    setShowSaveModal(false)
  }
  function updateSavedViewDetails(
    oldName: string,
    newName: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    setSavedViews((current) =>
      current.map((view) =>
        view.name === oldName
          ? { ...view, name: newName, description, sharedWithTeam }
          : view,
      ),
    )
    setOriginalSavedView((current) =>
      current?.name === oldName
        ? { ...current, name: newName, description }
        : current,
    )
    if (defaultView === oldName) setDefaultView(newName)
    if (activeViewName === oldName) setActiveViewName(newName)
    onSavedViewRenamed(oldName, newName)
    onSavedViewUpdated(oldName, newName, description, sharedWithTeam)
    setEditingSavedViewName(null)
  }
  function deleteView(name: string) {
    const remainingViews = savedViews.filter((view) => view.name !== name)
    const nextDefaultView = defaultView === name ? "__system__" : defaultView
    setSavedViews(remainingViews)
    window.localStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify({
        savedViews: remainingViews,
        defaultView: nextDefaultView,
      } satisfies TransactionsStorage),
    )
    if (defaultView === name) {
      setDefaultView("__system__")
      resetFilters()
    }
    if (activeViewName === name) setActiveViewName(null)
  }
  useEffect(() => {
    onRegisterSavedViewHeaderActions({
      rename: () => {
        if (requestedSavedViewName)
          setEditingSavedViewName(requestedSavedViewName)
      },
      delete: () => {
        if (requestedSavedViewName) deleteView(requestedSavedViewName)
      },
      export: () => setToast("CSV file downloaded"),
      save: () => setShowSaveModal(true),
      reset: () =>
        originalSavedView && !isViewingSharedReport
          ? applyView(originalSavedView)
          : resetFilters(),
      customiseColumns: () => setIsCustomiseColumnsOpen(true),
      backFromInvoice: () => setSelectedInvoice(null),
      showSaveReport: hasChangedSavedView,
    })
  }, [
    requestedSavedViewName,
    savedViews,
    originalSavedView,
    isViewingSharedReport,
    defaultView,
    activeViewName,
    hasChangedSavedView,
  ])
  const suggestedViewName =
    selectedSites.length === 1
      ? selectedSites[0].name.split(" – ")[0]
      : selectedSites.length > 1
        ? `${selectedSites.length} sites`
        : "Transactions"
  const paymentTypeLabel =
    paymentTypes.length === 0
      ? "All"
      : paymentTypes.length === 1
        ? paymentTypes[0]
        : `${paymentTypes.length} selected`
  const timeRangeLabel = timeRange
    ? `${formatTransactionTime(timeRange.from)} - ${formatTransactionTime(timeRange.to)}`
    : "All day"
  const customerLabel =
    customers.length === 0
      ? "All"
      : customers.length === 1
        ? customers[0]
        : `${customers.length} selected`
  const suggestedDescription = buildSmartReportDescription("Transactions", [
    `sites: ${siteLabel}`,
    `date: ${dateSelected.label}`,
    `payment types: ${paymentTypeLabel}`,
    `time: ${timeRangeLabel}`,
    `loyalty member: ${loyaltyMember}`,
    `customers: ${customerLabel}`,
    `deleted options: ${showDeletedOptions ? "shown" : "hidden"}`,
  ])
  function toggleTransactionFilter(filter: string) {
    setOpenFilter((current) => (current === filter ? null : filter))
  }

  function removeTransactionFilter(filter: string) {
    setVisibleFilters((current) => current.filter((item) => item !== filter))
    if (filter === "Loyalty member") setLoyaltyMember("All")
    if (filter === "Payment type") setPaymentTypes([])
    if (filter === "Terminal") setTerminals([])
    if (filter === "Terminal") onToggleRegister("all")
    if (filter === "Order type") setOrderTypes([])
    if (filter === "Source") setSources([])
    setActiveViewName(null)
    setOpenFilter(null)
  }

  function togglePaymentType(paymentType: string) {
    if (paymentType !== "all") setIncludeDeletedPaymentTypes(false)
    setPaymentTypes((current) =>
      paymentType === "all"
        ? []
        : current.includes(paymentType)
          ? current.filter((value) => value !== paymentType)
          : [...current, paymentType],
    )
    setVisibleFilters((current) =>
      current.includes("Payment type") ? current : [...current, "Payment type"],
    )
    setActiveViewName(null)
    setCurrentPage(1)
  }

  function toggleTransactionOption(
    filter: "Order type" | "Source",
    value: string,
  ) {
    if (value !== "all") {
      if (filter === "Order type") setIncludeDeletedOrderTypes(false)
      else setIncludeDeletedSources(false)
    }
    const setValues = filter === "Order type" ? setOrderTypes : setSources
    setValues((current) =>
      value === "all"
        ? []
        : current.includes(value)
          ? current.filter((option) => option !== value)
          : [...current, value],
    )
    setVisibleFilters((current) =>
      current.includes(filter) ? current : [...current, filter],
    )
    setActiveViewName(null)
  }

  function transactionFilterValues(filter: string) {
    if (filter === "Loyalty member")
      return loyaltyMember === "All" ? [] : [loyaltyMember]
    if (filter === "Payment type") return paymentTypes
    if (filter === "Terminal")
      return selectedRegisters.length > 0
        ? [
            ...new Set(
              selectedRegisters.map((key) => key.split(":").slice(1).join(":")),
            ),
          ]
        : terminals
    if (filter === "Order type") return orderTypes
    return sources
  }

  function transactionFilterLabel(filter: string) {
    const values = transactionFilterValues(filter)
    if (values.length === 0) return "All"
    return values.length === 1 ? values[0] : `${values.length} selected`
  }

  function applyTransactionFilter(filter: string, values: string[]) {
    if (filter === "Loyalty member")
      setLoyaltyMember(values.length === 1 ? values[0] as "Yes" | "No" : "All")
    if (filter === "Payment type") setPaymentTypes(values)
    if (filter === "Terminal") {
      setTerminals([])
      if (values.length === 0) onToggleRegister("all")
      else {
        const currentNames = new Set(
          selectedRegisters.map((key) => key.split(":").slice(1).join(":")),
        )
        const nextNames = new Set(values)
        selectedRegisters
          .filter((key) => !nextNames.has(key.split(":").slice(1).join(":")))
          .forEach((key) => onToggleRegister(key))
        const sites =
          selectedSites.length > 0 ? selectedSites : SITE_OPTIONS.slice(1)
        sites
          .flatMap((site) =>
            (REGISTERS_BY_SITE[site.id] ?? [])
              .filter((name) => nextNames.has(name) && !currentNames.has(name))
              .map((name) => `${site.id}:${name}`),
          )
          .forEach((key) => onToggleRegister(key))
      }
    }
    if (filter === "Order type") setOrderTypes(values)
    if (filter === "Source") setSources(values)
    setVisibleFilters((current) =>
      current.includes(filter) ? current : [...current, filter],
    )
    setActiveViewName(null)
  }

  function sendTaxInvoice({
    customerName,
    email,
    cc,
  }: {
    customerName: string
    email: string
    cc: string
  }) {
    if (!selectedInvoice) return
    setIsEmailInvoiceOpen(false)
    setToast(
      `Tax invoice sent to ${
        customerName ? `${customerName} at ` : ""
      }${email}${cc ? ` (CC: ${cc})` : ""}`,
    )
  }

  function openInvoice(row: TransactionRow) {
    setSelectedInvoice(row)
    onInvoiceViewChange(true)
  }

  function renderTransactionFilter(filter: string) {
    const filterId = filter.toLowerCase().replace(/ /g, "-")
    return (
      <div key={filter} className="relative order-5 flex items-center">
        <DefaultFilterChip
          label={filter === "Terminal" ? "Register" : filter}
          value={transactionFilterLabel(filter)}
          chipClassName="pr-[36px]"
          onClick={() => toggleTransactionFilter(filterId)}
        />
        <button
          type="button"
          aria-label={`Remove ${filter} filter`}
          onClick={() => removeTransactionFilter(filter)}
          className="absolute right-[8px] flex size-[20px] shrink-0 items-center justify-center rounded-full text-[#85837e] hover:bg-[#f2f0ea] hover:text-[#22201f]"
        >
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="m3 3 6 6m0-6L3 9"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {openFilter === filterId &&
          (filter === "Payment type" ? (
            <TransactionOptionDropdown
              label="Payment type"
              allLabel="All payment types"
              includeDeletedLabel="Include deleted payment types"
              options={transactionFilterOptions[filter]}
              deletedOptions={deletedTransactionFilterOptions[filter]}
              selected={paymentTypes}
              onToggle={togglePaymentType}
              includeDeletedOptions={includeDeletedPaymentTypes}
              onToggleIncludeDeletedOptions={() =>
                setIncludeDeletedPaymentTypes((include) => !include)
              }
              onClose={() => setOpenFilter(null)}
            />
          ) : filter === "Order type" || filter === "Source" ? (
            <TransactionOptionDropdown
              label={filter}
              allLabel={
                filter === "Order type" ? "All order types" : "All sources"
              }
              includeDeletedLabel={
                filter === "Order type"
                  ? "Include deleted order types"
                  : "Include deleted sources"
              }
              options={transactionFilterOptions[filter]}
              deletedOptions={deletedTransactionFilterOptions[filter]}
              selected={filter === "Order type" ? orderTypes : sources}
              onToggle={(value) => toggleTransactionOption(filter, value)}
              includeDeletedOptions={
                filter === "Order type"
                  ? includeDeletedOrderTypes
                  : includeDeletedSources
              }
              onToggleIncludeDeletedOptions={() => {
                if (filter === "Order type")
                  setIncludeDeletedOrderTypes((include) => !include)
                else setIncludeDeletedSources((include) => !include)
              }}
              onClose={() => setOpenFilter(null)}
            />
          ) : filter === "Terminal" ? (
            <RegisterDropdown
              selectedSites={
                selectedSites.length > 0
                  ? selectedSites
                  : SITE_OPTIONS.slice(1).filter(
                      (site) => showDeletedSites || !site.deleted,
                    )
              }
              selectedRegisters={selectedRegisters}
              onToggle={(key) => {
                onToggleRegister(key)
                setTerminals([])
                setActiveViewName(null)
              }}
              onClose={() => setOpenFilter(null)}
              searchable
              includeDeletedRegisters={includeDeletedRegisters}
              onToggleIncludeDeletedRegisters={onToggleIncludeDeletedRegisters}
            />
          ) : (
            <MultiSelectDropdown
              title={filter}
              options={transactionFilterOptions[filter]}
              selected={transactionFilterValues(filter)}
              onApply={(values) => applyTransactionFilter(filter, values)}
              onClose={() => setOpenFilter(null)}
              singleSelect={filter === "Loyalty member"}
              deletedOptions={deletedTransactionFilterOptions[filter]}
            />
          ))}
      </div>
    )
  }

  if (selectedInvoice) {
    return (
      <>
        <TransactionInvoicePage
          row={selectedInvoice}
          onPreviewPdf={() => setIsInvoicePdfPreviewOpen(true)}
          onEmailInvoice={() => setIsEmailInvoiceOpen(true)}
        />
        {isInvoicePdfPreviewOpen && (
          <InvoicePdfPreview
            row={selectedInvoice}
            onClose={() => setIsInvoicePdfPreviewOpen(false)}
          />
        )}
        {isEmailInvoiceOpen && (
          <EmailTaxInvoiceModal
            row={selectedInvoice}
            onClose={() => setIsEmailInvoiceOpen(false)}
            onSend={sendTaxInvoice}
          />
        )}
        {toast && (
          <Toast
            message={typeof toast === "string" ? toast : toast.message}
            actionLabel={
              typeof toast === "string" ? undefined : toast.actionLabel
            }
            onAction={typeof toast === "string" ? undefined : toast.onAction}
            onDone={() => setToast(null)}
          />
        )}
      </>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px] px-[24px] pt-[24px] pb-[24px]">
      <div className="flex w-full flex-wrap items-start gap-[8px]">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
          <label
            className={`flex h-[32px] w-[180px] shrink-0 items-center gap-[8px] rounded-[8px] border bg-white px-[10px] transition-shadow ${
              isSearchFocused
                ? "border-[#3390e0] shadow-[0_0_0_4px_#edf6ff]"
                : "border-[#bbbab6]"
            }`}
          >
            <svg
              aria-hidden="true"
              className="size-[16px] shrink-0 text-[#22201f]"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m10.5 10.5 3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              aria-label="Search sales feed"
              placeholder="Sale #, people..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] outline-none placeholder:text-[#22201f]"
            />
            {isSearchFocused && (
              <button
                type="button"
                aria-label="Clear search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setSearchQuery("")}
                className="flex size-[20px] shrink-0 items-center justify-center text-[#22201f]"
              >
                <svg
                  aria-hidden="true"
                  className="size-[16px]"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.25"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="m6.5 6.5 3 3m0-3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </label>
          <div className="relative order-1">
            <DefaultFilterChip
              label="Site"
              value={siteLabel}
              valueClassName={selectedSites.length === 1 ? "max-w-[145px]" : ""}
              onClick={() => setOpenFilter("site")}
            />
            {openFilter === "site" && (
              <SiteDropdown
                selectedIds={selectedSiteIds}
                onToggle={onToggleSite}
                onClose={() => setOpenFilter(null)}
                showDeletedSites={showDeletedSites}
                onToggleShowDeletedSites={onToggleShowDeletedSites}
              />
            )}
          </div>
          <div className="relative order-1">
            <DefaultFilterChip
              label="Date"
              value={dateSelected.label}
              onClick={() => setOpenFilter("date")}
            />
            {openFilter === "date" && (
              <TransactionDateDropdown
                selected={dateSelected.id}
                selectedRange={customDateRange}
                onSelect={(id, label, range) => {
                  onSelectDate(id, label)
                  setCustomDateRange(id === "custom" ? (range ?? null) : null)
                  setActiveViewName(null)
                  setCurrentPage(1)
                }}
                onClose={() => setOpenFilter(null)}
              />
            )}
          </div>
          <div className="relative order-2">
            <DefaultFilterChip
              label="Time"
              value={timeRangeLabel}
              onClick={() =>
                setOpenFilter((current) => (current === "time" ? null : "time"))
              }
            />
            {openFilter === "time" && (
              <TransactionTimeDropdown
                selected={timeRange}
                onApply={(value) => {
                  setTimeRange(value)
                  setActiveViewName(null)
                }}
                onClose={() => setOpenFilter(null)}
              />
            )}
          </div>
          {visibleFilters.map(renderTransactionFilter)}
          <div className="relative order-6">
            <button
              type="button"
              aria-label="Add filter"
              title="Add filter"
              onClick={() => toggleTransactionFilter("add-filter")}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#e3e2dd] bg-white text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {openFilter === "add-filter" && (
              <AddFilterDropdown
                filters={availableFilters}
                filterOptions={transactionFilterOptions}
                showAllOption={false}
                registerSites={
                  selectedSites.length > 0
                    ? selectedSites
                    : SITE_OPTIONS.slice(1).filter(
                        (site) => showDeletedSites || !site.deleted,
                      )
                }
                selectedRegisterKeys={selectedRegisters}
                onToggleRegister={(key) => {
                  onToggleRegister(key)
                  setTerminals([])
                  setVisibleFilters((current) =>
                    current.includes("Terminal")
                      ? current
                      : [...current, "Terminal"],
                  )
                  setActiveViewName(null)
                }}
                includeDeletedRegisters={includeDeletedRegisters}
                onToggleIncludeDeletedRegisters={
                  onToggleIncludeDeletedRegisters
                }
                selectedValues={{
                  "Loyalty member":
                    loyaltyMember === "All" ? [] : [loyaltyMember],
                  "Payment type": paymentTypes,
                  Terminal: terminals,
                  "Order type": orderTypes,
                  Source: sources,
                }}
                deletedOptions={deletedTransactionFilterOptions}
                includeDeletedPaymentTypes={includeDeletedPaymentTypes}
                onToggleIncludeDeletedPaymentTypes={() =>
                  setIncludeDeletedPaymentTypes((include) => !include)
                }
                onTogglePaymentType={togglePaymentType}
                includeDeletedOrderTypes={includeDeletedOrderTypes}
                onToggleIncludeDeletedOrderTypes={() =>
                  setIncludeDeletedOrderTypes((include) => !include)
                }
                onToggleOrderType={(value) =>
                  toggleTransactionOption("Order type", value)
                }
                includeDeletedSources={includeDeletedSources}
                onToggleIncludeDeletedSources={() =>
                  setIncludeDeletedSources((include) => !include)
                }
                onToggleSource={(value) =>
                  toggleTransactionOption("Source", value)
                }
                onApply={applyTransactionFilter}
                onClose={() => setOpenFilter(null)}
              />
            )}
          </div>
          {hasChangedSavedView && (
            <ActionButton
              variant="text"
              size="slim"
              className="order-7 !h-auto !px-0 hover:!bg-transparent"
              onClick={() =>
                originalSavedView && !isViewingSharedReport
                  ? applyView(originalSavedView)
                  : resetFilters()
              }
            >
              Reset
            </ActionButton>
          )}
        </div>
      </div>
      <div
        ref={transactionTableRef}
        onScroll={(event) =>
          setIsTransactionTableScrolled(event.currentTarget.scrollLeft > 0)
        }
        className="w-full min-w-0 overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white"
      >
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[1858px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[48px]" />
              {columns.map((column) => (
                <col key={column.key} className={column.width} />
              ))}
              <col className="w-[100px]" />
            </colgroup>
            <thead className="font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
              {selectedRows.length > 0 ? (
                <tr className="h-[40px] border-b border-[#e3e2dd] bg-[#eeece6]">
                  <th className="sticky left-0 z-30 w-[48px] min-w-[48px] max-w-[48px] bg-[#eeece6] px-[14px] py-[4px]">
                    <TransactionCheckbox
                      checked={allRowsSelected}
                      mixed={!allRowsSelected}
                      label="Select all sales"
                      onClick={toggleAllRows}
                    />
                  </th>
                  <th
                    colSpan={columns.length + 1}
                    className="px-[12px] py-0 text-left font-medium"
                  >
                    <div className="flex h-[40px] items-center gap-[12px]">
                      <span className="font-['Inter:Semibold'] text-[14px]">
                        {selectedRows.length} selected
                      </span>
                      <div ref={bulkActionsRef} className="relative">
                        <button
                          type="button"
                          aria-expanded={isBulkActionsOpen}
                          onClick={() => setIsBulkActionsOpen((open) => !open)}
                          className="flex h-[32px] items-center gap-[6px] rounded-[8px] bg-white px-[10px] font-['Inter:Semibold'] text-[14px] transition-colors hover:bg-[#f9f8f4]"
                        >
                          <svg
                            aria-hidden="true"
                            className="size-[16px]"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="m10 2 8 4-8 4-8-4 8-4Zm-8 8 8 4 8-4M2 14l8 4 8-4"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Bulk actions
                        </button>
                        {isBulkActionsOpen && (
                          <div className="absolute left-0 top-[36px] z-50 w-[220px] overflow-hidden rounded-[8px] border border-[#e3e2dd] bg-white p-[4px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.05),0px_2px_2px_0px_rgba(18,18,18,0.11)]">
                            <button
                              type="button"
                              onClick={() => {
                                setToast(
                                  `Invoice export requested for ${selectedRows.length} sales`,
                                )
                                setIsBulkActionsOpen(false)
                              }}
                              className="flex w-full items-center rounded-[6px] px-[12px] py-[8px] text-left font-['Inter:Medium'] text-[14px] leading-[20px] hover:bg-[#f9f8f4]"
                            >
                              Export invoice
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setToast(
                                  `Invoice email prepared for ${selectedRows.length} sales`,
                                )
                                setIsBulkActionsOpen(false)
                              }}
                              className="flex w-full items-center rounded-[6px] px-[12px] py-[8px] text-left font-['Inter:Medium'] text-[14px] leading-[20px] hover:bg-[#f9f8f4]"
                            >
                              Email invoice
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                </tr>
              ) : (
                <tr className="h-[40px] border-b border-[#e3e2dd] bg-[#f9f8f4]">
                  <th className="sticky left-0 z-30 w-[48px] min-w-[48px] max-w-[48px] bg-[#f9f8f4] px-[14px] py-[6px]">
                    <TransactionCheckbox
                      checked={allRowsSelected}
                      mixed={selectedRows.length > 0}
                      label="Select all sales"
                      onClick={toggleAllRows}
                    />
                  </th>
                  {columns.map((column, index) => (
                    <th
                      key={column.key}
                      className={`${column.width} ${
                        index === 0
                          ? "sticky left-[48px] z-30 pl-[16px] pr-[8px]"
                          : "px-[4px]"
                      } whitespace-nowrap py-[6px] font-medium ${
                        index === 0
                          ? `bg-[#f9f8f4] after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${
                              isTransactionTableScrolled
                                ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100"
                                : "after:opacity-0"
                            }`
                          : ""
                      } ${column.align ?? ""}`}
                    >
                      <button
                        type="button"
                        aria-label={`Sort by ${column.label}${
                          sort.key === column.sortKey
                            ? `, ${
                                sort.direction === "asc"
                                  ? "ascending"
                                  : "descending"
                              }`
                            : ""
                        }`}
                        onClick={() =>
                          setSort((current) => ({
                            key: column.sortKey,
                            direction:
                              current.key === column.sortKey &&
                              current.direction === "asc"
                                ? "desc"
                                : "asc",
                          }))
                        }
                        className={`inline-flex min-w-0 items-center gap-[4px] whitespace-nowrap ${
                          column.align
                            ? "w-full justify-end text-right"
                            : "text-left"
                        }`}
                      >
                        <span>{column.label}</span>
                        <SortIcon
                          isSorted={sort.key === column.sortKey}
                          direction={sort.direction}
                        />
                      </button>
                    </th>
                  ))}
                  <th className="w-[100px] px-[12px] py-[6px] text-left font-medium">
                    View
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">
              {pageRows.map((row) => (
                <tr
                  key={row.saleNumber}
                  tabIndex={0}
                  aria-label={`Open invoice for sale ${row.saleNumber}`}
                  onClick={() => openInvoice(row)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openInvoice(row)
                    }
                  }}
                  className="group h-[48px] cursor-pointer border-b border-[#e3e2dd] last:border-b-0 hover:bg-[#f9f8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3390e0]"
                >
                  <td
                    onClick={(event) => event.stopPropagation()}
                    className="sticky left-0 z-30 w-[48px] border-r border-[#e3e2dd] bg-white px-[14px] py-[6px] transition-colors group-hover:bg-[#f9f8f4]"
                  >
                    <TransactionCheckbox
                      checked={selectedSaleNumbers.has(row.saleNumber)}
                      label={`Select sale ${row.saleNumber}`}
                      onClick={() => toggleRow(row.saleNumber)}
                    />
                  </td>
                  {columns.map((column, index) => (
                    <td
                      key={column.key}
                      className={`${column.width} ${
                        index === 0
                          ? "sticky left-[48px] z-20 pl-[16px] pr-[8px]"
                          : "px-[4px]"
                      } whitespace-nowrap py-[6px] ${
                        index === 0
                          ? `after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${
                              isTransactionTableScrolled
                                ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100"
                                : "after:opacity-0"
                            } bg-white transition-colors group-hover:bg-[#f9f8f4]`
                          : ""
                      } ${column.align ?? ""}`}
                    >
                      {isRefreshing ? (
                        <Sk w="w-full" />
                      ) : column.key === "date" || column.key === "time" ? (
                        String(row[(column.key as "date" | "time")])
                      ) : column.key === "loyaltyMember" ? (
                        (row.loyaltyMember ?? row.customer !== "Walk-in") ? (
                          "Yes"
                        ) : (
                          "No"
                        )
                      ) : (
                        String(row[(column.key as keyof TransactionRow)])
                      )}
                    </td>
                  ))}
                  <td
                    onClick={(event) => event.stopPropagation()}
                    className="w-[100px] px-[8px] py-[6px]"
                  >
                    <button
                      type="button"
                      onClick={() => openInvoice(row)}
                      className="flex h-[32px] items-center rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] font-['Inter:Medium'] text-[14px] leading-[20px] text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#f9f8f4] font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">
              <tr className="h-[48px]">
                <td className="sticky left-0 z-30 w-[48px] border-r border-[#e3e2dd] bg-[#f9f8f4]" />
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`${column.width} ${
                      index === 0
                        ? "sticky left-[48px] z-30 pl-[16px] pr-[8px]"
                        : "px-[4px]"
                    } z-10 whitespace-nowrap border-t border-[#e3e2dd] bg-[#f9f8f4] py-[6px] ${
                      index === 0
                        ? `after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${
                            isTransactionTableScrolled
                              ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100"
                              : "after:opacity-0"
                          }`
                        : ""
                    } ${column.align ?? ""}`}
                  >
                    {index === 0
                      ? "Totals"
                      : column.key === "tipAmount"
                        ? formatTotal(totals.tipAmount)
                        : column.key === "netAmount"
                          ? formatTotal(totals.netAmount)
                          : column.key === "taxAmount"
                            ? formatTotal(totals.taxAmount)
                            : column.key === "total"
                              ? formatTotal(totals.total)
                              : column.key === "surcharge"
                                ? formatTotal(totals.surcharge)
                                : ""}
                  </td>
                ))}
                <td className="w-[100px] border-t border-[#e3e2dd] bg-[#f9f8f4]" />
              </tr>
            </tfoot>
          </table>
          {!isRefreshing && activeRows.length === 0 && (
            <p className="px-[16px] py-[24px] text-center font-['Inter:Regular'] text-[#62615d] text-[14px]">
              No transactions match these filters.
            </p>
          )}
        </div>
      </div>
      <div className="flex min-h-[40px] items-center justify-between gap-[16px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#22201f] max-sm:flex-wrap max-sm:justify-center">
        <span className="px-[12px] text-[#62615d]">
          {sortedRows.length === 0
            ? "0 results"
            : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, sortedRows.length)} of ${sortedRows.length}`}
        </span>
        <nav
          aria-label="Sales feed pages"
          className="flex items-center gap-[4px]"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setCurrentPage(page - 1)}
            className="flex size-[40px] items-center justify-center rounded-[8px] transition-colors hover:bg-[#f9f8f4] disabled:cursor-not-allowed disabled:text-[#bbbab6] max-sm:size-[32px]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-[16px]"
              fill="none"
            >
              <path
                d="m10 3-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {pageNumbers.map((number) =>
            typeof number !== "number" ? (
              <span
                key={number}
                aria-hidden="true"
                className="flex size-[40px] items-center justify-center text-[#62615d] max-sm:size-[32px]"
              >
                ...
              </span>
            ) : (
              <button
                key={number}
                type="button"
                aria-label={`Go to page ${number}`}
                aria-current={page === number ? "page" : undefined}
                onClick={() => setCurrentPage(number)}
                className={`flex size-[40px] items-center justify-center rounded-[8px] border transition-colors max-sm:size-[32px] ${
                  page === number
                    ? "border-[#e3e2dd] bg-[#f9f8f4]"
                    : "border-transparent hover:bg-[#f9f8f4]"
                }`}
              >
                {number}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Next page"
            disabled={page === pageCount}
            onClick={() => setCurrentPage(page + 1)}
            className="flex size-[40px] items-center justify-center rounded-[8px] transition-colors hover:bg-[#f9f8f4] disabled:cursor-not-allowed disabled:text-[#bbbab6] max-sm:size-[32px]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-[16px]"
              fill="none"
            >
              <path
                d="m6 3 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </div>
      {isCustomiseColumnsOpen && (
        <CustomiseColumnsDrawer
          columns={orderedColumns.map(({ key, label }) => ({ key, label }))}
          visibleKeys={visibleColumnKeys}
          onToggle={toggleColumn}
          onReorder={reorderColumns}
          onClose={() => setIsCustomiseColumnsOpen(false)}
        />
      )}
      {showSaveModal && (
        <SaveViewModal
          onClose={() => setShowSaveModal(false)}
          onSave={saveView}
          onUpdate={saveExistingView}
          existingFilters={savedViews.map((view) => view.name)}
          hasExisting={savedViews.length > 0}
          suggestedName={suggestedViewName}
          suggestedDescription={suggestedDescription}
          initialMode={requestedSavedViewName ? "existing" : "new"}
          initialExistingName={requestedSavedViewName}
          initialSharedWithTeam={
            savedViews.find((view) => view.name === requestedSavedViewName)
              ?.sharedWithTeam ?? false
          }
          sharedExistingFilters={savedViews
            .filter((view) => view.sharedWithTeam)
            .map((view) => view.name)}
        />
      )}
      {editingSavedViewName && (
        <EditSavedViewModal
          name={editingSavedViewName}
          description={
            savedViews.find((view) => view.name === editingSavedViewName)
              ?.description ?? ""
          }
          sharedWithTeam={
            savedViews.find((view) => view.name === editingSavedViewName)
              ?.sharedWithTeam ?? false
          }
          existingNames={savedViews.map((view) => view.name)}
          onClose={() => setEditingSavedViewName(null)}
          onSave={(name, description, sharedWithTeam) =>
            updateSavedViewDetails(
              editingSavedViewName,
              name,
              description,
              sharedWithTeam,
            )
          }
        />
      )}
      {toast && (
        <Toast
          message={typeof toast === "string" ? toast : toast.message}
          actionLabel={
            typeof toast === "string" ? undefined : toast.actionLabel
          }
          onAction={typeof toast === "string" ? undefined : toast.onAction}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}

function ProductSalesPage({
  requestedSavedViewName,
  isViewingSharedReport,
  onRegisterSavedViewHeaderActions,
  onSavedViewRenamed,
  onSavedViewUpdated,
  initialSalesBy,
  selectedSiteIds,
  selectedSites,
  siteLabel,
  showDeletedSites,
  onToggleShowDeletedSites,
  selectedRegisters,
  dateSelected,
  compareSelected,
  taxSelected,
  isRefreshing,
  minutesSinceUpdate,
  onRefresh,
  onToggleSite,
  onToggleRegister,
  includeDeletedRegisters,
  onToggleIncludeDeletedRegisters,
  onApplyRegisters,
  onApplyLocationSnapshot,
  onSelectDate,
  onSelectCompare,
  onSelectTax,
}: {
  requestedSavedViewName: string | null
  isViewingSharedReport: boolean
  onRegisterSavedViewHeaderActions: (actions: SavedViewHeaderActions) => void
  onSavedViewRenamed: (oldName: string, newName: string) => void
  onSavedViewUpdated: (
    oldName: string,
    name: string,
    description: string,
    sharedWithTeam: boolean,
  ) => void
  initialSalesBy: string | null
  selectedSiteIds: string[]
  selectedSites: SiteOption[]
  siteLabel: string
  showDeletedSites: boolean
  onToggleShowDeletedSites: () => void
  selectedRegisters: string[]
  dateSelected: { id: string label: string }
  compareSelected: { id: string label: string }
  taxSelected: string
  isRefreshing: boolean
  minutesSinceUpdate: number
  onRefresh: () => void
  onToggleSite: (id: string) => void
  onToggleRegister: (key: string) => void
  includeDeletedRegisters: boolean
  onToggleIncludeDeletedRegisters: () => void
  onApplyRegisters: (names: string[]) => void
  onApplyLocationSnapshot: (sites: string[], registers: string[]) => void
  onSelectDate: (id: string, label: string) => void
  onSelectCompare: (id: string, label: string) => void
  onSelectTax: (value: string) => void
}) {
  const initialProductStorage = loadStoredValue<ProductSalesStorage>(
    PRODUCT_SALES_STORAGE_KEY,
    { savedViews: [], defaultView: "__system__" },
  )
  const initialProductDefault = initialProductStorage.savedViews.find(
    (view) => view.name === initialProductStorage.defaultView,
  )
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [isProductTableScrolled, setIsProductTableScrolled] = useState(false)
  const [productTableScrollLeft, setProductTableScrollLeft] = useState(0)
  const normalizeSalesBy = (value: string) =>
    value === "User" ? "Staff" : value
  const [salesBy, setSalesBy] = useState(
    normalizeSalesBy(
      initialSalesBy ?? initialProductDefault?.salesBy ?? "Product",
    ),
  )
  const [sale, setSale] = useState(initialProductDefault?.sale ?? "Closed")
  const [product, setProduct] = useState<string[]>(
    initialProductDefault?.products ?? [],
  )
  const [category, setCategory] = useState<string[]>(
    initialProductDefault?.categories ?? [],
  )
  const [reportingGroup, setReportingGroup] = useState<string[]>(
    initialProductDefault?.reportingGroups ?? [],
  )
  const [tags, setTags] = useState<string[]>(initialProductDefault?.tags ?? [])
  const [includeDeletedOptionFilters, setIncludeDeletedOptionFilters] =
    useState<Record<string, boolean>>({
      Product: true,
      Category: true,
      "Reporting group": true,
    })
  const [visibleFilters, setVisibleFilters] = useState<string[]>(
    initialProductDefault?.visibleFilters ?? [],
  )
  const [savedViews, setSavedViews] = useState<ProductSalesView[]>(
    initialProductStorage.savedViews.map((view) => ({
      ...view,
      salesBy: normalizeSalesBy(view.salesBy),
    })),
  )
  const [activeViewName, setActiveViewName] = useState<string | null>(
    initialProductDefault?.name ?? null,
  )
  const [defaultView, setDefaultView] = useState<string | null>(
    initialProductStorage.defaultView,
  )
  type SortKey = keyof ProductSalesRow
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingSavedViewName, setEditingSavedViewName] =
    useState<string | null>(null)
  const [toast, setToast] = useState<ToastContent | null>(null)
  const [isCustomiseColumnsOpen, setIsCustomiseColumnsOpen] = useState(false)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<SortKey[]>(() => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem(
          "reports-bo:version-5:product-sales-columns",
        ) ?? "null",
      )
      return Array.isArray(stored) ? stored as SortKey[] : []
    } catch {
      return []
    }
  })
  const [columnOrder, setColumnOrder] = useState<SortKey[]>(() => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem(
          "reports-bo:version-5:product-sales-column-order",
        ) ?? "null",
      )
      return Array.isArray(stored) ? stored as SortKey[] : []
    } catch {
      return []
    }
  })
  const [sort, setSort] = useState<{ key: SortKey direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  })

  useEffect(() => {
    window.localStorage.setItem(
      PRODUCT_SALES_STORAGE_KEY,
      JSON.stringify({ savedViews, defaultView } satisfies ProductSalesStorage),
    )
  }, [savedViews, defaultView])

  useEffect(() => {
    if (initialSalesBy !== null) return
    if (initialProductDefault) {
      onApplyLocationSnapshot(
        initialProductDefault.sites,
        initialProductDefault.registers,
      )
      onSelectDate(
        initialProductDefault.date.id,
        initialProductDefault.date.label,
      )
      onSelectCompare(
        initialProductDefault.compare.id,
        initialProductDefault.compare.label,
      )
      onSelectTax(initialProductDefault.tax)
    } else {
      onApplyLocationSnapshot([], [])
      onSelectDate("today", "Today")
      onSelectCompare("last-same-day", `Last ${TODAY_NAME}`)
      onSelectTax("Inclusive")
    }
  }, [])

  useEffect(() => {
    if (!requestedSavedViewName) return
    const view = savedViews.find(
      (savedView) => savedView.name === requestedSavedViewName,
    )
    if (view && !isViewingSharedReport) applyView(view)
    else resetProductSalesFilters()
  }, [requestedSavedViewName, isViewingSharedReport])
  const dimensionLabel = salesBy === "Staff" ? "Staff member" : salesBy
  const productRows: ProductSalesRow[] = PRODUCT_SALES_ROWS.map((row) => ({
    ...row,
    tags: PRODUCT_SALES_TAGS[row.name] ?? [],
    products: "1",
    orders: String(Math.max(1, Math.round(Number(row.quantity) * 0.8))),
    averageSale: `$${(Number(row.sales.replace(/[$,]/g, "")) / Math.max(1, Math.round(Number(row.quantity) * 0.8))).toFixed(2)}`,
  }))
  const baseRows: ProductSalesRow[] =
    salesBy === "Product"
      ? productRows
      : (PRODUCT_SALES_BREAKDOWNS[salesBy] ?? productRows)
  const selectedBreakdownValues =
    salesBy === "Site"
      ? selectedSites.length > 0
        ? selectedSites.map((site) => site.name.split(" – ")[0])
        : []
      : salesBy === "Category"
        ? category
        : salesBy === "Reporting group"
          ? reportingGroup
          : salesBy === "Product"
            ? product
            : []
  const reportRows = (
    selectedBreakdownValues.length > 0
      ? baseRows.filter((row) => selectedBreakdownValues.includes(row.name))
      : baseRows
  )
    .filter(
      (row) =>
        salesBy !== "Product" ||
        ((tags.length === 0 ||
          tags.some((tag) => (row.tags ?? []).includes(tag))) &&
          (!visibleFilters.includes("Tax") ||
            (taxSelected === "Exclusive"
              ? Number(row.tax.replace(/[$,]/g, "")) === 0
              : Number(row.tax.replace(/[$,]/g, "")) > 0))),
    )
    .map((row) => {
      const sales = Number(row.sales.replace(/[$,]/g, ""))
      const tax = Number(row.tax.replace(/[$,]/g, ""))
      const totalIncTax = salesBy === "Product" ? sales : sales + tax
      const totalExTax = salesBy === "Product" ? sales - tax : sales
      return {
        ...row,
        sales: `$${totalIncTax.toFixed(2)}`,
        exTax: `$${totalExTax.toFixed(2)}`,
      }
    })
  const metricDimension =
    salesBy === "Staff" ? "staff member" : salesBy.toLowerCase()
  const topSellingRow = [...reportRows].sort(
    (left, right) => Number(right.quantity) - Number(left.quantity),
  )[0]
  const lowestSellingRow = [...reportRows].sort(
    (left, right) => Number(left.quantity) - Number(right.quantity),
  )[0]
  const topProfitRow = [...reportRows].sort(
    (left, right) =>
      Number(right.sales.replace(/[$,]/g, "")) -
      Number(left.sales.replace(/[$,]/g, "")),
  )[0]
  const topAverageSaleRow = [...reportRows].sort(
    (left, right) =>
      Number(String(right.averageSale ?? "0").replace(/[^\d.-]/g, "")) -
      Number(String(left.averageSale ?? "0").replace(/[^\d.-]/g, "")),
  )[0]
  const topProductValue =
    salesBy === "Product"
      ? "Salmon Fillet"
      : ((salesBy === "Staff" ? topProfitRow?.name : topSellingRow?.name) ??
        "—")
  const lowestProductValue =
    salesBy === "Product"
      ? "Extra Eggs"
      : ((salesBy === "Staff"
          ? topAverageSaleRow?.name
          : lowestSellingRow?.name) ?? "—")
  const topProfitValue =
    salesBy === "Product" ? "Cold Brew Coffee" : (topProfitRow?.name ?? "—")
  const sortedRows = [...reportRows].sort((a, b) => {
    const left = a[sort.key]
    const right = b[sort.key]
    const comparison =
      sort.key === "name"
        ? String(left).localeCompare(String(right))
        : Number(String(left).replace(/[^\d.-]/g, "")) -
          Number(String(right).replace(/[^\d.-]/g, ""))
    return sort.direction === "asc" ? comparison : -comparison
  })
  const productTotals = reportRows.reduce(
    (totals, row) => {
      totals.quantity += Number(row.quantity)
      for (const key of ["sales", "exTax", "tax", "cost"] as const) {
        totals[key] += Number(String(row[key] ?? "0").replace(/[$,]/g, ""))
      }
      return totals
    },
    { quantity: 0, sales: 0, exTax: 0, tax: 0, cost: 0 },
  )
  const formatProductTotal = (value: number) =>
    `$${value.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const showComparison = compareSelected.id !== "none"
  const columns: Array<{ key: SortKey label: string className: string }> =
    salesBy === "Product"
      ? [
          { key: "name", label: "Product", className: "w-[18%]" },
          { key: "quantity", label: "Quantity", className: "w-[10%]" },
          { key: "tax", label: "Tax", className: "w-[9%]" },
          { key: "sales", label: "Total inc. tax", className: "w-[12%]" },
          { key: "exTax", label: "Total ex. tax", className: "w-[12%]" },
          { key: "cost", label: "Cost", className: "w-[8%]" },
          {
            key: "quantityShare",
            label: "% of quantity",
            className: "w-[11%]",
          },
          {
            key: "salesShare",
            label: "% of sale amount",
            className: "w-[12%]",
          },
          { key: "profitShare", label: "Gross profit %", className: "w-[8%]" },
        ]
      : [
          { key: "name", label: dimensionLabel, className: "w-[18%]" },
          { key: "products", label: "Products", className: "w-[9%]" },
          { key: "quantity", label: "Quantity", className: "w-[9%]" },
          { key: "sales", label: "Total inc. tax", className: "w-[12%]" },
          { key: "exTax", label: "Total ex. tax", className: "w-[12%]" },
          { key: "tax", label: "Total tax", className: "w-[10%]" },
          { key: "cost", label: "Cost", className: "w-[9%]" },
          {
            key: "averageSale",
            label: "Average sale",
            className: "w-[10%]",
          },
          {
            key: "salesShare",
            label: "% of sale amount",
            className: "w-[11%]",
          },
        ]

  const orderedColumns = columnOrder
    .map((key) => columns.find((column) => column.key === key))
    .filter((column): column is typeof columns[number] => column !== undefined)
  const arrangedColumns =
    salesBy === "Product"
      ? ["name", "quantity", "tax", "sales", "exTax"]
          .map((key) => orderedColumns.find((column) => column.key === key))
          .filter(
            (column): column is typeof columns[number] => column !== undefined,
          )
          .concat(
            orderedColumns.filter(
              (column) =>
                !["name", "quantity", "tax", "sales", "exTax"].includes(
                  column.key,
                ),
            ),
          )
      : orderedColumns
  const visibleColumns = arrangedColumns.filter((column) =>
    visibleColumnKeys.includes(column.key),
  )

  useEffect(() => {
    setColumnOrder((current) => {
      const keys = columns.map((column) => column.key)
      const next = [
        ...current.filter((key) => keys.includes(key)),
        ...keys.filter((key) => !current.includes(key)),
      ]
      return JSON.stringify(current) === JSON.stringify(next) ? current : next
    })
    setVisibleColumnKeys((current) => {
      const keys = columns.map((column) => column.key)
      const next =
        current.length === 0 || !current.some((key) => keys.includes(key))
          ? keys
          : keys.filter((key) => current.includes(key) || key === "exTax")
      return JSON.stringify(current) === JSON.stringify(next) ? current : next
    })
  }, [salesBy])

  useEffect(() => {
    if (visibleColumnKeys.length > 0) {
      window.localStorage.setItem(
        "reports-bo:version-5:product-sales-columns",
        JSON.stringify(visibleColumnKeys),
      )
    }
  }, [visibleColumnKeys])

  useEffect(() => {
    if (columnOrder.length > 0) {
      window.localStorage.setItem(
        "reports-bo:version-5:product-sales-column-order",
        JSON.stringify(columnOrder),
      )
    }
  }, [columnOrder])

  const toggleProductSalesColumn = (key: string) =>
    setVisibleColumnKeys((current) => {
      const columnKey = key as SortKey
      if (current.length === 1 && current.includes(columnKey)) return current
      return current.includes(columnKey)
        ? current.filter((currentKey) => currentKey !== columnKey)
        : [...current, columnKey]
    })
  const reorderProductSalesColumns = (sourceKey: string, targetKey: string) =>
    setColumnOrder((current) => {
      const sourceIndex = current.indexOf(sourceKey as SortKey)
      const targetIndex = current.indexOf(targetKey as SortKey)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const next = [...current]
      next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, sourceKey as SortKey)
      return next
    })

  function toggleFilter(id: string) {
    setOpenFilter((current) => (current === id ? null : id))
  }

  const optionalFilters = [
    "Product",
    "Category",
    "Reporting group",
    "Register",
    "Tax",
    "Tags",
  ]
  const restrictedFilters =
    salesBy === "Reporting group"
      ? ["Product", "Category", "Register", "Tax", "Tags"]
      : salesBy === "Category"
        ? ["Product", "Reporting group", "Register", "Tax", "Tags"]
        : []
  const availableOptionalFilters = optionalFilters.filter(
    (filter) => !restrictedFilters.includes(filter),
  )
  const availableFilters = availableOptionalFilters.filter(
    (filter) => !visibleFilters.includes(filter),
  )
  const isFilteredFromDefault =
    selectedSiteIds.length > 0 ||
    selectedRegisters.length > 0 ||
    dateSelected.id !== "today" ||
    compareSelected.id !== "last-same-day" ||
    salesBy !== "Product" ||
    product.length > 0 ||
    category.length > 0 ||
    reportingGroup.length > 0 ||
    tags.length > 0 ||
    sale !== "Closed" ||
    taxSelected !== "Inclusive" ||
    visibleFilters.length > 0
  const requestedSavedView = savedViews.find(
    (view) => view.name === requestedSavedViewName,
  )
  const hasChangedSavedView = requestedSavedViewName
    ? isViewingSharedReport || !requestedSavedView
      ? isFilteredFromDefault
      : JSON.stringify({
          salesBy: normalizeSalesBy(requestedSavedView.salesBy),
          sites: requestedSavedView.sites ?? [],
          registers: requestedSavedView.registers ?? [],
          date: requestedSavedView.date,
          compare: requestedSavedView.compare,
          products: requestedSavedView.products ?? [],
          categories: requestedSavedView.categories ?? [],
          reportingGroups: requestedSavedView.reportingGroups ?? [],
          tags: requestedSavedView.tags ?? [],
          sale: requestedSavedView.sale ?? "Closed",
          tax: requestedSavedView.tax,
          visibleFilters: requestedSavedView.visibleFilters ?? [],
        }) !==
        JSON.stringify({
          salesBy,
          sites: selectedSiteIds,
          registers: selectedRegisters,
          date: dateSelected,
          compare: compareSelected,
          products: product,
          categories: category,
          reportingGroups: reportingGroup,
          tags,
          sale,
          tax: taxSelected,
          visibleFilters,
        })
    : isFilteredFromDefault

  function resetProductSalesFilters() {
    setSalesBy("Product")
    setProduct([])
    setCategory([])
    setReportingGroup([])
    setTags([])
    setSale("Closed")
    setVisibleFilters([])
    setOpenFilter(null)
    setActiveViewName(null)
    onToggleSite("all")
    onApplyRegisters([])
    onSelectDate("today", "Today")
    onSelectCompare("last-same-day", `Last ${TODAY_NAME}`)
    onSelectTax("Inclusive")
  }

  function applyView(view: ProductSalesView) {
    setSalesBy(normalizeSalesBy(view.salesBy))
    setProduct(view.products)
    setCategory(view.categories)
    setReportingGroup(view.reportingGroups)
    setTags(view.tags ?? [])
    setSale(view.sale ?? "Closed")
    setVisibleFilters(view.visibleFilters)
    setActiveViewName(view.name)
    onApplyLocationSnapshot(view.sites, view.registers)
    onSelectDate(view.date.id, view.date.label)
    onSelectCompare(view.compare.id, view.compare.label)
    onSelectTax(view.tax ?? "Inclusive")
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
      tags,
      sale,
      tax: taxSelected,
      visibleFilters,
    }
  }

  function saveView(
    name: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    const view = {
      ...captureView(name),
      description,
      createdBy: CURRENT_CREATOR,
      createdAt: Date.now(),
      sharedWithTeam,
    }
    setSavedViews((current) => [...current, view])
    setActiveViewName(name)
    setToast({
      message: "New report saved.",
      actionLabel: "See report",
      onAction: () => applyView(view),
    })
  }

  function updateSavedView(name: string, sharedWithTeam: boolean) {
    setSavedViews((current) =>
      current.map((view) =>
        view.name === name
          ? {
              ...captureView(name),
              description: view.description,
              createdBy: view.createdBy ?? CURRENT_CREATOR,
              createdAt: view.createdAt ?? Date.now(),
              sharedWithTeam,
            }
          : view,
      ),
    )
    setActiveViewName(name)
    setShowSaveModal(false)
  }

  const suggestedViewName = [
    salesBy === "Category"
      ? "Categories"
      : salesBy === "Reporting group"
        ? "Reporting groups"
        : salesBy === "Staff"
          ? "Staff sales"
          : salesBy === "Site"
            ? "Site sales"
            : visibleFilters.includes("Category")
              ? "Categories"
              : "Products",
    salesBy !== "Category" &&
    salesBy !== "Reporting group" &&
    salesBy !== "Site" &&
    selectedSites.length === 1
      ? selectedSites[0].name.split(" – ")[0]
      : "",
    selectedSites.length > 1 ? `${selectedSites.length} sites` : "",
    dateSelected.id === "today"
      ? ""
      : dateSelected.id === "past-week"
        ? "Last week"
        : dateSelected.label,
  ]
    .filter(Boolean)
    .join(" - ")
  const registerLabel =
    selectedRegisters.length === 0
      ? "All"
      : `${selectedRegisters.length} selected`
  const selectedSiteDescription =
    selectedSites.length === 0
      ? "all sites"
      : `sites: ${selectedSites.map((site) => site.name.split(" – ")[0]).join(", ")}`
  const activeProductFilters = [
    ...product.map((value) => `products: ${value}`),
    ...category.map((value) => `categories: ${value}`),
    ...reportingGroup.map((value) => `reporting groups: ${value}`),
    ...tags.map((value) => `tags: ${value}`),
  ]
  const suggestedDescription = buildSmartReportDescription("Product sales", [
    `by ${dimensionLabel.toLowerCase()}`,
    selectedSiteDescription,
    `registers: ${registerLabel}`,
    `date: ${dateSelected.label}`,
    `comparison: ${compareSelected.label}`,
    ...activeProductFilters,
    `tax: ${taxSelected}`,
  ])

  function deleteSavedView(name: string) {
    const remainingViews = savedViews.filter((view) => view.name !== name)
    const nextDefaultView = defaultView === name ? "__system__" : defaultView
    setSavedViews(remainingViews)
    window.localStorage.setItem(
      PRODUCT_SALES_STORAGE_KEY,
      JSON.stringify({
        savedViews: remainingViews,
        defaultView: nextDefaultView,
      } satisfies ProductSalesStorage),
    )
    if (defaultView === name) {
      setDefaultView("__system__")
      resetProductSalesFilters()
    }
    if (activeViewName === name) setActiveViewName(null)
  }

  function updateSavedViewDetails(
    oldName: string,
    newName: string,
    description: string,
    sharedWithTeam: boolean,
  ) {
    setSavedViews((current) =>
      current.map((view) =>
        view.name === oldName
          ? { ...view, name: newName, description, sharedWithTeam }
          : view,
      ),
    )
    if (defaultView === oldName) setDefaultView(newName)
    if (activeViewName === oldName) setActiveViewName(newName)
    onSavedViewRenamed(oldName, newName)
    onSavedViewUpdated(oldName, newName, description, sharedWithTeam)
    setEditingSavedViewName(null)
  }

  useEffect(() => {
    onRegisterSavedViewHeaderActions({
      rename: () => {
        if (requestedSavedViewName)
          setEditingSavedViewName(requestedSavedViewName)
      },
      delete: () => {
        if (requestedSavedViewName) deleteSavedView(requestedSavedViewName)
      },
      export: () => setToast("CSV file downloaded"),
      save: () => setShowSaveModal(true),
      reset: () =>
        requestedSavedView && !isViewingSharedReport
          ? applyView(requestedSavedView)
          : resetProductSalesFilters(),
      customiseColumns: () => setIsCustomiseColumnsOpen(true),
      showSaveReport: hasChangedSavedView,
    })
  }, [
    requestedSavedViewName,
    savedViews,
    isViewingSharedReport,
    defaultView,
    activeViewName,
    hasChangedSavedView,
  ])

  function showFilter(filter: string) {
    setVisibleFilters((current) => [...current, filter])
    setActiveViewName(null)
  }

  function hideFilter(filter: string) {
    setVisibleFilters((current) => current.filter((item) => item !== filter))
    setActiveViewName(null)
    setOpenFilter(null)
  }

  function toggleProductSalesOption(filter: string, value: string) {
    if (value !== "all") {
      setIncludeDeletedOptionFilters((current) => ({
        ...current,
        [filter]: false,
      }))
    }
    const setters: Record<string, React.Dispatch<React.SetStateAction<string[]>>> =
      {
        Product: setProduct,
        Category: setCategory,
        "Reporting group": setReportingGroup,
      }
    const setValues = setters[filter]
    if (!setValues) return
    setValues((current) =>
      value === "all"
        ? []
        : current.includes(value)
          ? current.filter((option) => option !== value)
          : [...current, value],
    )
    setVisibleFilters((current) =>
      current.includes(filter) ? current : [...current, filter],
    )
    setActiveViewName(null)
  }

  function toggleIncludeDeletedProductFilter(filter: string) {
    setIncludeDeletedOptionFilters((current) => ({
      ...current,
      [filter]: !(current[filter] ?? true),
    }))
  }

  function selectedFilterLabel(values: string[], pluralLabel: string) {
    if (values.length === 0) return "All"
    return values.length === 1 ? values[0] : `${values.length} ${pluralLabel}`
  }

  function renderOptionalFilter(filter: string) {
    const value =
      filter === "Product"
        ? selectedFilterLabel(product, "products")
        : filter === "Category"
          ? selectedFilterLabel(category, "categories")
          : filter === "Reporting group"
            ? selectedFilterLabel(reportingGroup, "reporting groups")
            : filter === "Register"
              ? selectedFilterLabel(
                  [
                    ...new Set(
                      selectedRegisters.map((register) =>
                        register.split(":").slice(1).join(":"),
                      ),
                    ),
                  ],
                  "registers",
                )
              : filter === "Tags"
                ? selectedFilterLabel(tags, "tags")
                : filter === "Tax"
                  ? getProductTaxLabel(taxSelected)
                  : taxSelected
    const filterId = filter.toLowerCase().replace(/ /g, "-")

    return (
      <div key={filter} className="relative order-4 flex items-center">
        <DefaultFilterChip
          label={filter}
          value={value}
          chipClassName="pr-[36px]"
          onClick={() => toggleFilter(filterId)}
        />
        <button
          type="button"
          aria-label={`Remove ${filter} filter`}
          onClick={() => hideFilter(filter)}
          className="absolute right-[8px] flex size-[20px] shrink-0 items-center justify-center rounded-full text-[#85837e] hover:bg-[#f2f0ea] hover:text-[#22201f]"
        >
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="m3 3 6 6m0-6L3 9"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {openFilter === filterId &&
          (filter === "Product" ||
          filter === "Category" ||
          filter === "Reporting group" ? (
            <ProductSalesOptionDropdown
              label={filter}
              options={
                filter === "Product"
                  ? PRODUCT_SALES_ROWS.map((row) => row.name)
                  : filter === "Category"
                    ? ["Coffee", "Pastries", "Mains", "Sides", "Drinks"]
                    : ["Beverages", "Brunch", "Bakery"]
              }
              selected={
                filter === "Product"
                  ? product
                  : filter === "Category"
                    ? category
                    : reportingGroup
              }
              onToggle={(value) => toggleProductSalesOption(filter, value)}
              includeDeleted={includeDeletedOptionFilters[filter] ?? true}
              onToggleIncludeDeleted={() =>
                toggleIncludeDeletedProductFilter(filter)
              }
              onClose={() => setOpenFilter(null)}
            />
          ) : filter === "Register" ? (
            <RegisterDropdown
              selectedSites={
                selectedSites.length > 0
                  ? selectedSites
                  : SITE_OPTIONS.slice(1).filter(
                      (site) => showDeletedSites || !site.deleted,
                    )
              }
              selectedRegisters={selectedRegisters}
              onToggle={(key) => {
                onToggleRegister(key)
                setActiveViewName(null)
              }}
              onClose={() => setOpenFilter(null)}
              searchable
              includeDeletedRegisters={includeDeletedRegisters}
              onToggleIncludeDeletedRegisters={onToggleIncludeDeletedRegisters}
            />
          ) : filter === "Tags" ? (
            <MultiSelectDropdown
              title="Tags"
              options={PRODUCT_TAG_OPTIONS}
              selected={tags}
              onApply={(values) => {
                setTags(values)
                setActiveViewName(null)
              }}
              onClose={() => setOpenFilter(null)}
            />
          ) : (
            <TaxDropdown
              selected={getProductTaxLabel(taxSelected)}
              options={PRODUCT_TAX_OPTIONS}
              onSelect={(value) => {
                onSelectTax(getProductTaxValue(value))
                setActiveViewName(null)
              }}
              onClose={() => setOpenFilter(null)}
            />
          ))}
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px] p-[24px]">
      <div className="flex w-full flex-wrap items-start gap-[8px]">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
          <div className="relative order-1">
            <DefaultFilterChip
              label="Sales by"
              value={salesBy}
              onClick={() => toggleFilter("sales-by")}
            />
            {openFilter === "sales-by" && (
              <OptionsDropdown
                options={["Product", "Reporting group", "Category", "Staff"]}
                selected={salesBy}
                onSelect={(value) => {
                  setSalesBy(value)
                  setActiveViewName(null)
                }}
                onClose={() => setOpenFilter(null)}
                width={180}
              />
            )}
          </div>
          {salesBy === "Staff" && (
            <div className="relative order-4">
              <DefaultFilterChip
                label="Sale"
                value={sale}
                onClick={() => toggleFilter("sale")}
              />
              {openFilter === "sale" && (
                <OptionsDropdown
                  options={["Closed", "Opened", "Added to"]}
                  selected={sale}
                  onSelect={(value) => {
                    setSale(value)
                    setActiveViewName(null)
                  }}
                  onClose={() => setOpenFilter(null)}
                  width={180}
                />
              )}
            </div>
          )}
          <div className="relative order-3">
            <DefaultFilterChip
              label="Site"
              value={siteLabel}
              valueClassName={selectedSites.length === 1 ? "max-w-[145px]" : ""}
              onClick={() => toggleFilter("site")}
            />
            {openFilter === "site" && (
              <SiteDropdown
                selectedIds={selectedSiteIds}
                onToggle={(id) => {
                  setActiveViewName(null)
                  onToggleSite(id)
                }}
                onClose={() => setOpenFilter(null)}
                showDeletedSites={showDeletedSites}
                onToggleShowDeletedSites={onToggleShowDeletedSites}
              />
            )}
          </div>
          <div className="relative order-2">
            <button
              type="button"
              onClick={() => toggleFilter("date")}
              className="flex h-[32px] max-w-full items-center gap-[8px] rounded-[8px] border border-[#e3e2dd] bg-white px-[12px] text-left shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
            >
              <span className="shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                Date
              </span>
              <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">
                {dateSelected.label}
              </span>
              <span className="-mx-[4px] shrink-0 font-['Inter:Regular'] text-[#62615d] text-[14px] leading-[20px]">
                vs
              </span>
              <span className="min-w-0 truncate font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">
                {compareSelected.label}
              </span>
            </button>
            {openFilter === "date" && (
              <DateComparisonDropdown
                dateId={dateSelected.id}
                compareId={compareSelected.id}
                onSelectDate={(id, label) => {
                  setActiveViewName(null)
                  onSelectDate(id, label)
                  const options =
                    COMPARE_TO_OPTIONS[id] ?? COMPARE_TO_OPTIONS.today
                  if (
                    compareSelected.id !== "none" &&
                    compareSelected.id !== "custom-date" &&
                    !options.some((option) => option.id === compareSelected.id)
                  ) {
                    onSelectCompare(options[0].id, options[0].label)
                  }
                }}
                onSelectCompare={(id, label) => {
                  setActiveViewName(null)
                  onSelectCompare(id, label)
                }}
                onClose={() => setOpenFilter(null)}
              />
            )}
          </div>
          {visibleFilters
            .filter((filter) => availableOptionalFilters.includes(filter))
            .map(renderOptionalFilter)}
          <div className="relative order-6">
            <button
              type="button"
              aria-label="Add filter"
              title="Add filter"
              onClick={() => toggleFilter("add-filter")}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#e3e2dd] bg-white text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f9f8f4]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {openFilter === "add-filter" && (
              <AddFilterDropdown
                filters={availableFilters}
                filterOptions={{
                  Product: [
                    "All",
                    ...PRODUCT_SALES_ROWS.map((row) => row.name),
                  ],
                  Category: [
                    "All",
                    "Coffee",
                    "Pastries",
                    "Mains",
                    "Sides",
                    "Drinks",
                  ],
                  "Reporting group": ["All", "Beverages", "Brunch", "Bakery"],
                  Register: ["POS A", "Front POS", "Back POS"],
                  Tax: PRODUCT_TAX_OPTIONS,
                  Tags: PRODUCT_TAG_OPTIONS,
                }}
                selectedValues={{
                  Product: product,
                  Category: category,
                  "Reporting group": reportingGroup,
                  Tax: [getProductTaxLabel(taxSelected)],
                  Tags: tags,
                  Register: [
                    ...new Set(
                      selectedRegisters.map((register) =>
                        register.split(":").slice(1).join(":"),
                      ),
                    ),
                  ],
                }}
                immediateFilters={["Product", "Category", "Reporting group"]}
                onToggleImmediateFilter={toggleProductSalesOption}
                includeDeletedImmediateFilters={includeDeletedOptionFilters}
                onToggleIncludeDeletedImmediateFilter={
                  toggleIncludeDeletedProductFilter
                }
                registerSites={
                  selectedSites.length > 0
                    ? selectedSites
                    : SITE_OPTIONS.slice(1).filter(
                        (site) => showDeletedSites || !site.deleted,
                      )
                }
                selectedRegisterKeys={selectedRegisters}
                onToggleRegister={(key) => {
                  onToggleRegister(key)
                  setVisibleFilters((current) =>
                    current.includes("Register")
                      ? current
                      : [...current, "Register"],
                  )
                  setActiveViewName(null)
                }}
                includeDeletedRegisters={includeDeletedRegisters}
                onToggleIncludeDeletedRegisters={
                  onToggleIncludeDeletedRegisters
                }
                onApply={(filter, values) => {
                  setActiveViewName(null)
                  if (filter === "Product") setProduct(values)
                  if (filter === "Category") setCategory(values)
                  if (filter === "Reporting group") setReportingGroup(values)
                  if (filter === "Tags") setTags(values)
                  if (filter === "Register") onApplyRegisters(values)
                  if (filter === "Tax")
                    onSelectTax(
                      getProductTaxValue(values[0] ?? PRODUCT_TAX_OPTIONS[0]),
                    )
                  setVisibleFilters((current) =>
                    current.includes(filter) ? current : [...current, filter],
                  )
                }}
                onClose={() => setOpenFilter(null)}
              />
            )}
          </div>
          {hasChangedSavedView && (
            <ActionButton
              variant="text"
              size="slim"
              className="!h-auto !px-0 hover:!bg-transparent"
              onClick={() =>
                requestedSavedView && !isViewingSharedReport
                  ? applyView(requestedSavedView)
                  : resetProductSalesFilters()
              }
            >
              Reset
            </ActionButton>
          )}
        </div>
      </div>

      <div className="flex w-full flex-wrap items-stretch gap-[16px]">
        <KpiCard
          label={
            salesBy === "Staff"
              ? "Top selling staff by revenue"
              : `Top selling ${metricDimension}`
          }
          value={topProductValue}
          change="+7.8%"
          changeColor="text-[#008e13]"
          compareLabel="Last Tuesday"
          showComparison
          isRefreshing={isRefreshing}
          compact
          infoIconRight
        />
        <KpiCard
          label={
            salesBy === "Staff"
              ? "Top staff by average sale"
              : `Lowest selling ${metricDimension}`
          }
          value={lowestProductValue}
          change="+1.3%"
          changeColor="text-[#008e13]"
          compareLabel="Last Tuesday"
          showComparison
          isRefreshing={isRefreshing}
          compact
          infoIconRight
        />
        <KpiCard
          label="Top profit contributor"
          value={topProfitValue}
          change="−3.2%"
          changeColor="text-[#8e1311]"
          compareLabel="Last Tuesday"
          showComparison
          isRefreshing={isRefreshing}
          compact
          infoIconRight
        />
      </div>

      {salesBy === "Category" && (
        <div className="flex min-h-[52px] w-full items-center rounded-[8px] bg-[#ffedd4] px-[17px] py-[12px] font-['Inter:Regular'] text-[14px] leading-[20px] text-[#4d2000]">
          Products may belong to multiple categories, so some totals may include
          them more than once.
        </div>
      )}

      <div
        onScroll={(event) => {
          const scrollLeft = event.currentTarget.scrollLeft
          setProductTableScrollLeft(scrollLeft)
          setIsProductTableScrolled(scrollLeft > 0)
        }}
        className="w-full min-w-0 overflow-x-auto overflow-y-hidden rounded-[8px] border border-[#e3e2dd] bg-white [&>table]:min-w-[1440px]"
      >
        <table className="w-full min-w-[1440px] table-fixed border-collapse text-left">
          <thead className="bg-[#f9f8f4] font-['Inter:Medium'] text-[#22201f] text-[14px] leading-[20px]">
            <tr className="h-[40px] border-b border-[#e3e2dd]">
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.className} ${
                    column.key === "name" ? "pl-[16px] pr-[8px]" : "px-[4px]"
                  } sticky top-0 z-20 py-[6px] font-medium ${
                    salesBy === "Product" && column.key === "name"
                      ? `sticky left-0 z-30 bg-[#f9f8f4] after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${
                          isProductTableScrolled
                            ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100"
                            : "after:opacity-0"
                        }`
                      : "bg-[#f9f8f4]"
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Sort by ${column.label}${
                      sort.key === column.key
                        ? `, ${
                            sort.direction === "asc"
                              ? "ascending"
                              : "descending"
                          }`
                        : ""
                    }`}
                    onClick={() =>
                      setSort((current) => ({
                        key: column.key,
                        direction:
                          current.key === column.key &&
                          current.direction === "asc"
                            ? "desc"
                            : "asc",
                      }))
                    }
                    className="inline-flex min-w-0 items-center gap-[4px] whitespace-nowrap text-left"
                  >
                    <span className="min-w-0">{column.label}</span>
                    <SortIcon
                      isSorted={sort.key === column.key}
                      direction={sort.direction}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-['Inter:Regular'] text-[#22201f] text-[14px] leading-[20px]">
            {sortedRows.map((product) => (
              <tr
                key={product.name}
                className="h-[48px] border-b border-[#e3e2dd] last:border-b-0"
              >
                {visibleColumns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`break-all px-[4px] py-[6px] text-left ${
                      index === 0 ? "pl-[16px] pr-[8px]" : ""
                    } ${
                      salesBy === "Product" && column.key === "name"
                        ? `sticky left-0 z-20 bg-white after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${
                            isProductTableScrolled
                              ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100"
                              : "after:opacity-0"
                          }`
                        : ""
                    }`}
                  >
                    {isRefreshing ? (
                      <Sk w="w-full" />
                    ) : (
                      (product[column.key] ?? "—")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {(salesBy === "Product" || salesBy === "Reporting group") && (
            <tfoot className="sticky bottom-0 z-10 bg-[#f9f8f4] font-['Inter:Semibold'] text-[#22201f] text-[14px] leading-[20px]">
              <tr className="h-[48px]">
                {visibleColumns.map((column) => (
                  <td
                    key={column.key}
                    className={`${column.className} ${
                      column.key === "name" ? "pl-[16px] pr-[8px]" : "px-[4px]"
                    } sticky bottom-0 z-10 whitespace-nowrap bg-[#f9f8f4] py-[6px] text-left shadow-[0_-1px_0_0_#e3e2dd] ${
                      column.key === "name"
                        ? `sticky left-0 z-30 after:absolute after:bottom-0 after:right-[-1px] after:top-0 after:w-px after:transition-opacity after:content-[''] ${
                            isProductTableScrolled
                              ? "after:bg-[#e3e2dd] after:shadow-[2px_0_3px_rgba(34,32,31,0.08)] after:opacity-100"
                              : "after:opacity-0"
                          }`
                        : ""
                    }`}
                  >
                    {column.key === "name"
                      ? "Totals"
                      : column.key === "quantity"
                        ? productTotals.quantity.toLocaleString("en-AU")
                        : column.key === "sales"
                          ? formatProductTotal(productTotals.sales)
                          : column.key === "exTax"
                            ? formatProductTotal(productTotals.exTax)
                            : column.key === "tax"
                              ? formatProductTotal(productTotals.tax)
                              : column.key === "cost"
                                ? formatProductTotal(productTotals.cost)
                                : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {isCustomiseColumnsOpen && (
        <CustomiseColumnsDrawer
          columns={orderedColumns.map(({ key, label }) => ({ key, label }))}
          visibleKeys={visibleColumnKeys}
          onToggle={toggleProductSalesColumn}
          onReorder={reorderProductSalesColumns}
          onClose={() => setIsCustomiseColumnsOpen(false)}
        />
      )}

      {showSaveModal && (
        <SaveViewModal
          onClose={() => setShowSaveModal(false)}
          onSave={saveView}
          onUpdate={updateSavedView}
          existingFilters={savedViews.map((view) => view.name)}
          hasExisting={savedViews.length > 0}
          suggestedName={suggestedViewName}
          suggestedDescription={suggestedDescription}
          initialMode={requestedSavedViewName ? "existing" : "new"}
          initialExistingName={requestedSavedViewName}
          initialSharedWithTeam={
            savedViews.find((view) => view.name === requestedSavedViewName)
              ?.sharedWithTeam ?? false
          }
          sharedExistingFilters={savedViews
            .filter((view) => view.sharedWithTeam)
            .map((view) => view.name)}
        />
      )}
      {editingSavedViewName && (
        <EditSavedViewModal
          name={editingSavedViewName}
          description={
            savedViews.find((view) => view.name === editingSavedViewName)
              ?.description ?? ""
          }
          sharedWithTeam={
            savedViews.find((view) => view.name === editingSavedViewName)
              ?.sharedWithTeam ?? false
          }
          existingNames={savedViews.map((view) => view.name)}
          onClose={() => setEditingSavedViewName(null)}
          onSave={(name, description, sharedWithTeam) =>
            updateSavedViewDetails(
              editingSavedViewName,
              name,
              description,
              sharedWithTeam,
            )
          }
        />
      )}
      {toast && (
        <Toast
          message={typeof toast === "string" ? toast : toast.message}
          actionLabel={
            typeof toast === "string" ? undefined : toast.actionLabel
          }
          onAction={typeof toast === "string" ? undefined : toast.onAction}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}
