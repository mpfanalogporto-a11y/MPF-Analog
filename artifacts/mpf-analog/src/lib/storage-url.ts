/**
 * Converts an object storage entity path (e.g. "/objects/uuid") returned by the
 * upload-url endpoint into a publicly fetchable URL served by the API.
 */
export function toStorageUrl(objectPathOrUrl: string): string {
  if (!objectPathOrUrl) return objectPathOrUrl;
  if (/^https?:\/\//.test(objectPathOrUrl)) return objectPathOrUrl;
  if (objectPathOrUrl.startsWith('/objects/')) {
    return `/api/storage/objects/${objectPathOrUrl.slice('/objects/'.length)}`;
  }
  return objectPathOrUrl;
}
