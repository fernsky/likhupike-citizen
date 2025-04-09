import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
}

export function QuickActionCard({
  title,
  description,
  href,
}: QuickActionCardProps) {
  const t = useTranslations();

  return (
    <Link href={href} className="block">
      <Card className="h-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400"
          >
            {t("common.button.learnMore")}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
