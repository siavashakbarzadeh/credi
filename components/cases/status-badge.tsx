import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { t } from "../../lib/i18n";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColorMap: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  SUBMITTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PENDING_DOCUMENTS: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  DOCUMENT_VERIFICATION: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  DISBURSED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  CLOSED: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  RECEIVED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  VERIFIED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(statusColorMap[status] || "bg-gray-100 text-gray-800", className)}>
      {t(`status.${status}`)}
    </Badge>
  );
}
