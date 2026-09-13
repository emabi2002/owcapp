type OwcRequestInit = RequestInit & { timeoutMs?: number };

export class OwcApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "OwcApiError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function owcRequest<T>(path: string, init: OwcRequestInit = {}): Promise<T> {
  const baseUrl = process.env.OWC_API_BASE_URL;
  if (!baseUrl) {
    throw new OwcApiError("OWC API is not configured", 503);
  }

  const { timeoutMs = 10000, signal, headers, ...requestInit } = init;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener("abort", abortFromCaller, { once: true });

  const isFormData =
    typeof FormData !== "undefined" && requestInit.body instanceof FormData;

  try {
    const response = await fetch(buildUrl(baseUrl, path), {
      ...requestInit,
      headers: {
        accept: "application/json",
        ...(requestInit.body && !isFormData ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    let payload: unknown;
    const text = await response.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        if (response.ok) {
          throw new OwcApiError("OWC API returned an invalid JSON response", 502);
        }
        payload = text;
      }
    }

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : `OWC API request failed with status ${response.status}`;
      throw new OwcApiError(message, response.status, payload);
    }

    return payload as T;
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new OwcApiError("OWC API request timed out", 504);
    }
    if (error instanceof OwcApiError) throw error;
    throw new OwcApiError("OWC API is unavailable", 503, error);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
