"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGetMunicipalityQuery } from "@/store/services/locationApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MunicipalityInfoCard } from "./municipality-info-card";
import { MunicipalityMap } from "./municipality-map";
import { MunicipalityElevationChart } from "./municipality-elevation-chart";
import { MunicipalityProfileSkeleton } from "./skeletons";
import { AlertCircle, MapPin, Mountain, Ruler } from "lucide-react";

export default function MunicipalityProfileView() {
  const t = useTranslations();
  const { data: municipality, error, isLoading, refetch } = useGetMunicipalityQuery();

  useEffect(() => {
    // Fetch municipality data when component mounts
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <MunicipalityProfileSkeleton />;
  }

  if (error || !municipality) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("common.error")}</AlertTitle>
        <AlertDescription>
          {t("municipality.error.failed")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {municipality.name}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span>
                {municipality.district}, {municipality.province}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Municipality Overview */}
      <MunicipalityInfoCard municipality={municipality} />

      {/* Tabs for different data visualizations */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            {t("municipality.tabs.map")}
          </TabsTrigger>
          <TabsTrigger value="elevation">
            <Mountain className="h-4 w-4 mr-2" />
            {t("municipality.tabs.elevation")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("municipality.map.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <MunicipalityMap 
                leftLong={municipality.leftmostLatitude} 
                rightLong={municipality.rightmostLatitude}
                topLat={municipality.topmostLongitude}
                bottomLat={municipality.bottommostLongitude}
                name={municipality.name}
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center border rounded-md p-3 bg-slate-50 dark:bg-slate-800/50">
                  <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">{t("municipality.coordinates.longitude")}</p>
                    <p className="text-muted-foreground">
                      {municipality.leftmostLatitude.toFixed(2)}° - {municipality.rightmostLatitude.toFixed(2)}°
                    </p>
                  </div>
                </div>
                <div className="flex items-center border rounded-md p-3 bg-slate-50 dark:bg-slate-800/50">
                  <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">{t("municipality.coordinates.latitude")}</p>
                    <p className="text-muted-foreground">
                      {municipality.bottommostLongitude.toFixed(2)}° - {municipality.topmostLongitude.toFixed(2)}°
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="elevation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("municipality.elevation.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <MunicipalityElevationChart 
                lowestAltitude={municipality.lowestAltitude}
                highestAltitude={municipality.highestAltitude}
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center border rounded-md p-3 bg-slate-50 dark:bg-slate-800/50">
                  <Mountain className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <p className="font-medium">{t("municipality.elevation.lowest")}</p>
                    <p className="text-muted-foreground">
                      {municipality.lowestAltitude.toLocaleString()} m
                    </p>
                  </div>
                </div>
                <div className="flex items-center border rounded-md p-3 bg-slate-50 dark:bg-slate-800/50">
                  <Mountain className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <p className="font-medium">{t("municipality.elevation.highest")}</p>
                    <p className="text-muted-foreground">
                      {municipality.highestAltitude.toLocaleString()} m
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
