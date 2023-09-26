"use client";
import React, { useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const MapComponent = () => {
  useEffect(() => {
    // Define the dimensions and margins of the map
    const width = 960;
    const height = 600;

    // Create an SVG container for the map
    const svg = d3
      .select("#mapContainer")
      .select("svg")
      .attr("width", width)
      .attr("height", height);

    // Load the TopoJSON file (replace 'your-topojson-file.json' with your actual file)
    d3.json("/us.json").then((data) => {
      const geojson = topojson.feature(data, data.objects.counties);

      // Create a projection
      const projection = d3.geoMercator().fitSize([width, height], geojson);

      // Create a path generator
      const path = d3.geoPath().projection(projection);

      // Draw the map
      svg
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("a") // Wrap each path in an anchor element
        .attr(
          "xlink:href",
          (d) => `/county/${d.properties.state}/${d.properties.county}`
        ) // Set href attribute to the ID of the polygon
        .append("path")
        .attr("d", path)
        .style("fill", "steelblue")
        .style("stroke", "white")
        .style("stroke-width", 0.5)
        .on("mouseenter", (event, d) => {
          // Handle mouseenter event, e.g., change fill color
          d3.select(event.target).style("fill", "orange");
        })
        .on("mouseleave", (event, d) => {
          // Handle mouseleave event, e.g., revert fill color
          d3.select(event.target).style("fill", "steelblue");
        });
    });
  }, []);

  return (
    <div id="mapContainer">
      <svg></svg>
    </div>
  );
};

export default MapComponent;
