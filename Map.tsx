import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { SOLAR_PROJECTS } from '../constants';
import { SolarProject } from '../types';

interface MapProps {
  onSelectProject: (project: SolarProject) => void;
  selectedProjectId: string | null;
}

export const Map: React.FC<MapProps> = ({ onSelectProject, selectedProjectId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 600 });

  // 1. Fetch TopoJSON data for the US
  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
        const topology = await response.json();
        const featureCollection = topojson.feature(topology, topology.objects.states);
        setGeoData(featureCollection);
      } catch (error) {
        console.error("Failed to load map topology", error);
      }
    };
    fetchTopology();
  }, []);

  // 2. Handle Responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { width } = wrapperRef.current.getBoundingClientRect();
        // Maintain aspect ratio slightly based on width
        const height = Math.min(600, width * 0.65); 
        setDimensions({ width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Render D3 Map
  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Create Projection
    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale(width * 1.3); // Adjust scale based on container width

    const pathGenerator = d3.geoPath().projection(projection);

    // Identify active states for styling
    const activeStateNames = new Set(SOLAR_PROJECTS.map(p => p.stateCode));

    // Draw States
    svg.append("g")
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", pathGenerator as any)
      .attr("fill", (d: any) => {
        // Match state name logic
        const stateName = d.properties.name;
        return activeStateNames.has(stateName) ? "#1e3a8a" : "#bfdbfe"; // Blue-900 vs Blue-200
      })
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("class", "transition-colors duration-300 ease-in-out cursor-default hover:opacity-90")
      .append("title") // Simple browser tooltip for state name
      .text((d: any) => d.properties.name);

    // Draw Connecting Lines (Optional aesthetic touch from image)
    // We only draw lines if a project is selected to avoid clutter, or static lines for style
    // Let's draw static markers first.

    const markersGroup = svg.append("g");

    SOLAR_PROJECTS.forEach(project => {
      const coords = projection([project.coordinates.long, project.coordinates.lat]);
      
      if (coords) {
        const [x, y] = coords;
        const isSelected = selectedProjectId === project.id;

        const group = markersGroup.append("g")
            .attr("transform", `translate(${x}, ${y})`)
            .style("cursor", "pointer")
            .on("click", (e) => {
                e.stopPropagation();
                onSelectProject(project);
            });

        // Outer Glow / Pulse
        group.append("circle")
            .attr("r", isSelected ? 20 : 0)
            .attr("fill", "rgba(249, 115, 22, 0.3)") // Orange-500 low opacity
            .attr("class", isSelected ? "animate-ping" : "")
            .transition()
            .duration(500)
            .attr("r", isSelected ? 15 : 6);

        // Main Dot
        group.append("circle")
            .attr("r", 6)
            .attr("fill", "#f97316") // Orange-500
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("class", "hover:scale-150 transition-transform duration-200");

        // Label (Only if space permits or selected)
        if (width > 600) {
             group.append("text")
            .attr("x", 12)
            .attr("y", 4)
            .text(project.name)
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", "#1e3a8a")
            .attr("opacity", isSelected ? 1 : 0) // Only show text on selection to reduce clutter
            .style("pointer-events", "none")
            .style("text-shadow", "0px 0px 4px white");
        }
      }
    });

  }, [geoData, dimensions, selectedProjectId, onSelectProject]);

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[400px] flex items-center justify-center relative bg-white rounded-3xl overflow-hidden">
      <svg 
        ref={svgRef} 
        width={dimensions.width} 
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-auto max-w-5xl mx-auto"
      />
      
      {/* Loading State */}
      {!geoData && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-800 font-medium text-sm">Loading Topology...</span>
            </div>
        </div>
      )}
    </div>
  );
};