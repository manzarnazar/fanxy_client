import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiCreatorPackageResult } from "@/types/api/creator-dashboard.types";
import type { CreatorPackage, PackagePeriod } from "@/features/packages/types/packages.types";

const VALID_PERIODS: PackagePeriod[] = ["Day", "Week", "Month", "Year"];
const PERIOD_UNIT_LABEL: Record<PackagePeriod, string> = { Day: "day", Week: "week", Month: "month", Year: "year" };

function normalizePeriod(type: string | null): PackagePeriod {
  return VALID_PERIODS.includes(type as PackagePeriod) ? (type as PackagePeriod) : "Month";
}

function buildBillingLabel(period: PackagePeriod, periodCount: number): string {
  const unit = PERIOD_UNIT_LABEL[period];
  return periodCount > 1 ? `every ${periodCount} ${unit}s` : `per ${unit}`;
}

export function mapApiPackage(row: ApiCreatorPackageResult, now: Date = new Date()): CreatorPackage {
  const period = normalizePeriod(row.type);
  const periodCount = row.time > 0 ? row.time : 1;

  return {
    id: String(row.id),
    name: row.name,
    price: row.price,
    period,
    periodCount,
    billingLabel: buildBillingLabel(period, periodCount),
    imageUrl: sanitizeMediaUrl(row.image),
    createdAt: row.created_at,
    createdLabel: formatRelativeTime(row.created_at, now),
  };
}
