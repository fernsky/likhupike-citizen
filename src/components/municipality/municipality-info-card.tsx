import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Municipality } from "@/domains/profile/location/types";
import { Map, Mountain, Ruler } from "lucide-react";

interface MunicipalityInfoCardProps {
  municipality: Municipality;
}

export function MunicipalityInfoCard({ municipality }: MunicipalityInfoCardProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Area Information */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full h-12 w-12 flex items-center justify-center">
              <Map className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{t("municipality.area.title")}</h3>
              <p className="text-2xl font-bold">{municipality.areaInSquareKilometers.toLocaleString()} km²</p>
              <p className="text-sm text-muted-foreground">
                {t("municipality.area.description")}
              </p>
            </div>
          </div>

          {/* Elevation Range */}
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full h-12 w-12 flex items-center justify-center">
              <Mountain className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{t("municipality.elevation.range")}</h3>
              <p className="text-2xl font-bold">{municipality.lowestAltitude.toLocaleString()} - {municipality.highestAltitude.toLocaleString()} m</p>
              <p className="text-sm text-muted-foreground">
                {t("municipality.elevation.difference")}: {(municipality.highestAltitude - municipality.lowestAltitude).toLocaleString()} m
              </p>
            </div>
          </div>

          {/* Geographic Span */}
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full h-12 w-12 flex items-center justify-center">
              <Ruler className="h-6 w-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{t("municipality.coordinates.span")}</h3>
              <p className="text-sm mt-1">
                <span className="font-medium">{t("municipality.coordinates.latitude")}:</span>{" "}
                {municipality.bottommostLongitude.toFixed(2)}° - {municipality.topmostLongitude.toFixed(2)}°
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">{t("municipality.coordinates.longitude")}:</span>{" "}
                {municipality.leftmostLatitude.toFixed(2)}° - {municipality.rightmostLatitude.toFixed(2)}°
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
