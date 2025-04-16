"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface MunicipalityElevationChartProps {
  lowestAltitude: number;
  highestAltitude: number;
}

export function MunicipalityElevationChart({ 
  lowestAltitude, 
  highestAltitude 
}: MunicipalityElevationChartProps) {
  const t = useTranslations();
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const container = chartRef.current;
    container.innerHTML = '';
    
    // Create a basic elevation profile visualization
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 1000 300");
    svg.setAttribute("preserveAspectRatio", "none");
    
    // Define gradient
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.id = "elevation-gradient";
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#4F46E5");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "50%");
    stop2.setAttribute("stop-color", "#818CF8");
    
    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "#C7D2FE");
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Create a mountainous path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    // Generate a semi-random mountain profile
    const points = [];
    points.push([0, 300]); // Start at the bottom left
    
    // Use a sine wave to simulate mountains
    const numPoints = 20;
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * 1000;
      
      // Base sine wave
      let y = Math.sin((i / numPoints) * Math.PI * 4) * 80;
      
      // Add some randomness
      y += Math.sin((i / numPoints) * Math.PI * 8) * 20;
      y += Math.sin((i / numPoints) * Math.PI * 16) * 10;
      
      // Flip it (since SVG coordinates have 0,0 at top left)
      // and scale it to match our viewBox
      y = 270 - (y + 90);
      
      points.push([x, y]);
    }
    
    points.push([1000, 300]); // End at the bottom right
    
    // Convert to SVG path format
    const d = points.map((point, i) => {
      return (i === 0 ? "M" : "L") + point[0] + "," + point[1];
    }).join(" ") + " Z"; // Z closes the path
    
    path.setAttribute("d", d);
    path.setAttribute("fill", "url(#elevation-gradient)");
    svg.appendChild(path);
    
    // Add labels for altitudes
    const addLabel = (x: number, y: number, text: string) => {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x.toString());
      label.setAttribute("y", y.toString());
      label.setAttribute("fill", "#1E293B");
      label.setAttribute("font-size", "14");
      label.setAttribute("text-anchor", "middle");
      label.textContent = text;
      svg.appendChild(label);
    };
    
    // Label the highest and lowest points
    addLabel(100, 40, `${highestAltitude.toLocaleString()} m`);
    addLabel(900, 260, `${lowestAltitude.toLocaleString()} m`);
    
    // Add the elevation difference
    addLabel(500, 150, `↕ ${(highestAltitude - lowestAltitude).toLocaleString()} m`);
    
    // Add the SVG to container
    container.appendChild(svg);
    
  }, [lowestAltitude, highestAltitude]);
  
  return (
    <div 
      ref={chartRef} 
      className="w-full h-60 border rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800/30"
      aria-label={t("municipality.elevation.ariaLabel")}
    />
  );
}
