import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MunicipalityProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-slate-200 dark:bg-slate-800">
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
          <Skeleton className="h-10 w-2/3 max-w-md mb-4" />
          <Skeleton className="h-6 w-1/3 max-w-xs" />
        </div>
      </div>
      
      {/* Municipality Overview Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="map">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="map" disabled>
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
          <TabsTrigger value="elevation" disabled>
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-60 md:h-80 w-full" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
