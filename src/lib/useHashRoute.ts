import { useCallback, useSyncExternalStore } from "react"

/**
 * Minimal hash router.
 *
 * The site deploys to GitHub Pages under a project subpath, where the server
 * performs no rewrites: `/explore` would 404 on a deep link, while `#/explore`
 * always resolves. Two routes and a query string do not justify a router
 * dependency, so this subscribes to `hashchange` through `useSyncExternalStore`.
 */

export type RoutePath = "/" | "/explore" | "/services" | "/car-rental" | "/tour"

export type Route = {
  /** Normalised path, always one of the known routes. */
  path: RoutePath
  /** Query string portion of the hash, without the leading `?`. */
  query: string
  /** Landing-page anchor target, present only for legacy `#section` hashes. */
  anchor: string | null
}

const KNOWN_PATHS: readonly RoutePath[] = [
  "/",
  "/explore",
  "/services",
  "/car-rental",
  "/tour",
]

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

function getHashSnapshot(): string {
  return typeof window === "undefined" ? "" : window.location.hash
}

function getServerSnapshot(): string {
  return ""
}

/**
 * Parse a raw `window.location.hash` into a route.
 *
 * Recognises three shapes:
 * - `#/`, `#/explore`, and `#/tour`, optionally with `?a=b`, as routes
 * - `#experiences` and other bare fragments, as landing-page anchors
 * - anything unknown, which falls back to the landing page
 */
export function parseHash(rawHash: string): Route {
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash

  if (hash === "" || hash === "/") {
    return { path: "/", query: "", anchor: null }
  }

  if (!hash.startsWith("/")) {
    // Legacy landing-page anchor such as `#experiences`.
    return { path: "/", query: "", anchor: hash }
  }

  const queryIndex = hash.indexOf("?")
  const rawPath = queryIndex === -1 ? hash : hash.slice(0, queryIndex)
  const query = queryIndex === -1 ? "" : hash.slice(queryIndex + 1)
  const trimmedPath =
    rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath
  const path = (KNOWN_PATHS as readonly string[]).includes(trimmedPath)
    ? trimmedPath as RoutePath
    : "/"

  return { path, query, anchor: null }
}

/** Build a hash string from a path and an optional query. */
export function buildHash(path: RoutePath, query = ""): string {
  return query ? `#${path}?${query}` : `#${path}`
}

/**
 * Subscribe to the current route. Re-renders on every `hashchange`, including
 * browser back and forward, which is what makes filter history work.
 */
export function useHashRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    getHashSnapshot,
    getServerSnapshot,
  )
  return parseHash(hash)
}

export type NavigateOptions = {
  /**
   * Landing-page element id to scroll to after navigation, for links such as
   * "Hành trình" that must return to `#/` and then move to a section.
   */
  scrollTo?: string
  /** Replace the history entry instead of pushing a new one. */
  replace?: boolean
}

/**
 * Scroll to a landing-page section once it exists.
 *
 * Setting `location.hash` dispatches `hashchange` as a separate task, so the
 * destination page may not have committed yet on the next frame. Retry across a
 * short window rather than guessing a single delay.
 */
function scrollToTarget(elementId: string) {
  let framesLeft = 30

  const attempt = () => {
    const target = document.getElementById(elementId)
    if (target) {
      target.scrollIntoView({ block: "start" })
      return
    }
    if (framesLeft-- > 0) {
      requestAnimationFrame(attempt)
    } else {
      window.scrollTo({ top: 0 })
    }
  }

  requestAnimationFrame(attempt)
}

/**
 * Navigate to a route. Writing to `location.hash` is what drives the store, so
 * every caller ends up going through the same `hashchange` path.
 */
export function navigateTo(
  path: RoutePath,
  query = "",
  options: NavigateOptions = {},
): void {
  const nextHash = buildHash(path, query)
  const current = window.location.hash || "#/"

  if (current !== nextHash) {
    if (options.replace) {
      window.history.replaceState(null, "", nextHash)
      window.dispatchEvent(new HashChangeEvent("hashchange"))
    } else {
      window.location.hash = nextHash
    }
  }

  if (options.scrollTo) {
    scrollToTarget(options.scrollTo)
  } else if (current !== nextHash) {
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }
}

/** Hook form of {@link navigateTo}, stable across renders. */
export function useNavigate() {
  return useCallback(
    (path: RoutePath, query = "", options: NavigateOptions = {}) =>
      navigateTo(path, query, options),
    [],
  )
}
