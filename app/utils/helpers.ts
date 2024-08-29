/**
 * Helpers
 */
export function extractIdFromUrl(url: string) {
  // Extract ID from the planet URL, assuming the URL is in the format: https://swapi.dev/api/planets/{id}/
  const match = url.match(/\/(\d+)\/$/);
  const id = match ? match[1] : null;

  return id;
}
