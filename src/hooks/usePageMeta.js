import { useEffect } from 'react'

const SITE_NAME = 'Saanjh Matrimony'

export function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Where hearts find their home`

    let meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content')
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (description && meta && previousDescription) meta.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
