import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileCompletionItemProps {
  icon: React.ReactNode;
  title: string;
  status: "complete" | "incomplete" | "pending";
  details?: string;
  href: string;
}

export function ProfileCompletionItem({
  icon,
  title,
  status,
  details,
  href,
}: ProfileCompletionItemProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <div className="flex items-start">
          <div
            className={cn(
              "mr-3 p-1.5 rounded-full",
              status === "complete" &&
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              status === "incomplete" &&
                "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
              status === "pending" &&
                "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            )}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {details ||
                (status === "complete"
                  ? "Completed"
                  : status === "incomplete"
                  ? "Incomplete"
                  : "Pending")}
            </p>
          </div>
          {status === "complete" && (
            <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
    </Link>
  );
}
