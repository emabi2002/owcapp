const DEFAULT_OWC_API_BASE_URL = process.env.NEXT_PUBLIC_OWC_API_BASE_URL?.trim() ?? "";

export function isOwcApiConfigured(baseUrl = DEFAULT_OWC_API_BASE_URL) {
  return baseUrl.trim().length > 0;
}

export function buildOwcApiUrl(
  path: string,
  baseUrl = DEFAULT_OWC_API_BASE_URL,
) {
  const normalizedBase = baseUrl.trim().replace(/\/+$/, "");
  const normalizedPath = `/${path.trim().replace(/^\/+/, "")}`;

  if (!normalizedBase) return normalizedPath;
  return `${normalizedBase}${normalizedPath}`;
}
