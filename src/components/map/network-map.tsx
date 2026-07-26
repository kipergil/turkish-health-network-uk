"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type Map as MapLibreMap,
  type GeoJSONSource,
  type Marker,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, FeatureCollection, Point } from "geojson";
import { LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

/** Plain DOM element for the "my location" dot — kept outside Tailwind/JSX
 * since MapLibre markers render outside the React tree, same as the popup
 * HTML above. */
function createUserLocationMarkerElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.style.width = "16px";
  el.style.height = "16px";
  el.style.borderRadius = "9999px";
  el.style.background = "#2563eb";
  el.style.border = "3px solid #ffffff";
  el.style.boxShadow =
    "0 0 0 2px rgba(37, 99, 235, 0.35), 0 1px 4px rgba(0, 0, 0, 0.35)";
  return el;
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
  const userMarkerRef = useRef<Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [showMyLocation, setShowMyLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  // Shows/hides a "my location" dot without ever moving the camera — the
  // user only wants visibility toggled, not a fly-to/zoom.
  useEffect(() => {
    if (!showMyLocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const map = mapRef.current;
        if (!map) return;
        const lngLat: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat(lngLat);
        } else {
          userMarkerRef.current = new maplibregl.Marker({
            element: createUserLocationMarkerElement(),
          })
            .setLngLat(lngLat)
            .addTo(map);
        }
      },
      () => {
        setLocationError(
          "Couldn't access your location. Check your browser's location permission.",
        );
        setShowMyLocation(false);
      },
      { enableHighAccuracy: true },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [showMyLocation]);

  function handleToggleMyLocation() {
    if (showMyLocation) {
      setShowMyLocation(false);
      return;
    }
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setLocationError("Geolocation isn't supported by this browser.");
      return;
    }
    setLocationError(null);
    setShowMyLocation(true);
  }

  return (
    <div className={cn("relative overflow-hidden", className ?? height)}>
      <div
        ref={containerRef}
        className="size-full"
        role="application"
        aria-label="Map of Turkish Health Network providers and organizations"
      />
      <Button
        type="button"
        variant={showMyLocation ? "default" : "outline"}
        size="sm"
        aria-pressed={showMyLocation}
        onClick={handleToggleMyLocation}
        className="absolute top-3 left-3 z-10 gap-1.5 shadow-sm"
      >
        <LocateFixed className="size-3.5" aria-hidden="true" />
        My location
      </Button>
      {locationError ? (
        <p
          role="alert"
          className="bg-background/95 text-destructive border-border absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] rounded-md border px-2.5 py-1.5 text-xs shadow-sm"
        >
          {locationError}
        </p>
      ) : null}
    </div>
  );
}
