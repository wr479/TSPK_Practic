const DEFAULT_API_URL = "http://localhost:3000/api";

export function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) {
    return DEFAULT_API_URL;
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
}
