"use client";

import { useEffect, useRef } from "react";
import maplibregl, {
  type Map as MapLibreMap,
  type GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, FeatureCollection, Point } from "geojson";
import type { GeoPoint } from "@/lib/schemas/common";

export interface MapEntry {
  id: string;
  kind: "provider" | "organization";
  name: string;
  href: string;
  categoryLabel: string;
  geo: GeoPoint;
}

const SOURCE_ID = "directory-entries";
const LAYER_ID = "directory-entries-points";

/** Free, no-API-key MapLibre style — see https://openfreemap.org */
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const UK_CENTER: [number, number] = [-1.5, 52.6];

function toFeatureCollection(entries: MapEntry[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: entries.map((entry): Feature<Point> => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [entry.geo.lng, entry.geo.lat] },
      properties: {
        id: entry.id,
        kind: entry.kind,
        name: entry.name,
        href: entry.href,
        categoryLabel: entry.categoryLabel,
      },
    })),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function NetworkMap({
  entries,
  className,
  height = "h-[70vh] min-h-100",
}: {
  entries: MapEntry[];
  className?: string;
  height?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const entriesRef = useRef(entries);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: UK_CENTER,
      zoom: 5.2,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    map.addControl(
      new maplibregl.GeolocateControl({ trackUserLocation: true }),
      "top-right",
    );

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(entriesRef.current),
      });

      map.addLayer({
        id: LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-color": [
            "match",
            ["get", "kind"],
            "provider",
            "#2563eb",
            "organization",
            "#059669",
            "#6b7280",
          ],
        },
      });

      map.on("mouseenter", LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("click", LAYER_ID, (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const { name, href, categoryLabel } = feature.properties as {
          name: string;
          href: string;
          categoryLabel: string;
        };
        const coordinates = feature.geometry.coordinates.slice() as [
          number,
          number,
        ];

        new maplibregl.Popup({ closeButton: true })
          .setLngLat(coordinates)
          .setHTML(
            `<div style="font: 500 14px system-ui, sans-serif;">
               <p style="margin:0 0 2px;color:#6b7280;font-weight:400;font-size:12px;">${escapeHtml(categoryLabel)}</p>
               <a href="${encodeURI(href)}" style="color:#2563eb;text-decoration:underline;">${escapeHtml(name)}</a>
             </div>`,
          )
          .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSource = () => {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      source?.setData(toFeatureCollection(entries));
    };

    if (map.isStyleLoaded() && map.getSource(SOURCE_ID)) {
      updateSource();
    } else {
      map.once("load", updateSource);
    }
  }, [entries]);

  return (
    <div
      ref={containerRef}
      className={className ?? height}
      role="application"
      aria-label="Map of Turkish Health Network providers and organizations"
    />
  );
}
