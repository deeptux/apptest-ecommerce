/** Sub-path under handrian.space where this demo is mounted. */
export const BASE_PATH = "/demo/point-of-sale-resto";

/** Prefix a root-relative path with the app base path (for assets and full-page navigations). */
export function withBasePath(path: string): string {
  if (path.startsWith(BASE_PATH)) {
    return path;
  }

  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
