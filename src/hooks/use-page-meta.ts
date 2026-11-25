import { useEffect } from "react"

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "")
const DEFAULT_TITLE = "Rompecoco · Juegos para romperte el coco"

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  document.querySelector(selector)?.setAttribute(attribute, value)
}

/**
 * Actualiza título, descripción, canonical y Open Graph de la página actual.
 *
 * Las etiquetas base están en index.html (lo que ven WhatsApp, Facebook, etc.,
 * que no ejecutan JS). Este hook las ajusta por ruta para Google y la pestaña.
 */
export function usePageMeta({
  title,
  description,
  path,
  noindex = false,
}: {
  title?: string
  description?: string
  path: string
  noindex?: boolean
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} · Rompecoco` : DEFAULT_TITLE
    const url = `${SITE_URL}${path}`

    document.title = fullTitle
    setMeta('meta[property="og:title"]', "content", fullTitle)
    setMeta('meta[name="twitter:title"]', "content", fullTitle)
    setMeta('meta[property="og:url"]', "content", url)
    setMeta('link[rel="canonical"]', "href", url)
    if (description) {
      setMeta('meta[name="description"]', "content", description)
      setMeta('meta[property="og:description"]', "content", description)
      setMeta('meta[name="twitter:description"]', "content", description)
    }

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (noindex) {
      if (!robots) {
        robots = document.createElement("meta")
        robots.name = "robots"
        document.head.append(robots)
      }
      robots.content = "noindex"
    } else {
      robots?.remove()
    }
  }, [title, description, path, noindex])
}
