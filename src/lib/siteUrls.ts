const LOCAL_ORIGIN = "http://localhost:3000";
const APP_ROUTE_PREFIXES = ["/app", "/billing", "/login", "/signup", "/start"] as const;

function normalizePath(pathWithQuery: string): string {
  return pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
}

function removeTrailingSlash(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

function parseUrl(rawUrl: string | undefined): URL | null {
  if (!rawUrl) {
    return null;
  }

  try {
    return new URL(rawUrl);
  } catch {
    return null;
  }
}

function normalizeHost(rawHost: string): string {
  const firstHost = rawHost.split(",")[0]?.trim() ?? rawHost;
  return firstHost.split(":")[0]?.toLowerCase() ?? "";
}

function deriveMarketingOriginFromAppOrigin(appOrigin: URL): string {
  if (!appOrigin.hostname.startsWith("app.")) {
    return removeTrailingSlash(appOrigin.origin);
  }

  const baseHostname = appOrigin.hostname.replace(/^app\./, "");
  const hostWithPort = appOrigin.port ? `${baseHostname}:${appOrigin.port}` : baseHostname;

  return `${appOrigin.protocol}//${hostWithPort}`;
}

export function getAppOrigin(): string {
  const appUrl = parseUrl(process.env.NEXT_PUBLIC_APP_URL);
  return appUrl ? removeTrailingSlash(appUrl.origin) : LOCAL_ORIGIN;
}

export function getMarketingOrigin(): string {
  const marketingUrl = parseUrl(process.env.NEXT_PUBLIC_MARKETING_URL);
  if (marketingUrl) {
    return removeTrailingSlash(marketingUrl.origin);
  }

  const appUrl = parseUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (!appUrl) {
    return LOCAL_ORIGIN;
  }

  return deriveMarketingOriginFromAppOrigin(appUrl);
}

export function appUrl(pathWithQuery: string): string {
  return `${getAppOrigin()}${normalizePath(pathWithQuery)}`;
}

export function marketingUrl(pathWithQuery: string): string {
  return `${getMarketingOrigin()}${normalizePath(pathWithQuery)}`;
}

export function isAppRoutePath(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function shouldRedirectToAppOrigin({
  requestPathname,
  requestHost,
}: {
  requestPathname: string;
  requestHost: string | null;
}): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  if (!isAppRoutePath(requestPathname) || !requestHost) {
    return false;
  }

  const appHost = normalizeHost(new URL(getAppOrigin()).host);
  const incomingHost = normalizeHost(requestHost);

  return appHost !== incomingHost;
}

export function isRequestOnAppOrigin(requestHost: string | null): boolean {
  if (!requestHost) {
    return false;
  }

  const appHost = normalizeHost(new URL(getAppOrigin()).host);
  const incomingHost = normalizeHost(requestHost);

  return appHost === incomingHost;
}
