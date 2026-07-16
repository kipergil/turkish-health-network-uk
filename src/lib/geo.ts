import type { GeoPoint } from "@/lib/schemas/common";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance between two points, in kilometres. */
export function distanceInKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_KM * c;
}

export function googleMapsSearchUrl(point: GeoPoint): string {
  return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
}

export function googleMapsDirectionsUrl(point: GeoPoint): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
}

export interface WithGeo {
  geo: GeoPoint;
}

/** Sorts entities by distance from `origin`, nearest first. */
export function sortByDistance<T extends WithGeo>(
  items: readonly T[],
  origin: GeoPoint,
): T[] {
  return [...items].sort(
    (a, b) => distanceInKm(a.geo, origin) - distanceInKm(b.geo, origin),
  );
}
