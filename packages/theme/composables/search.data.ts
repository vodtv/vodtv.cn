import { createContentLoader } from 'vitepress'

const loader = createContentLoader('**/*.md', {
  includeSrc: true,
  render: true,
  excerpt: false,
  transform(rawData) {
    return rawData
      .map((page, index) => {
        const content = page.src || ''

        const headingMatch = content?.match(/^#{1,4}\s+(.+)$/m)
        const title = headingMatch 
          ? headingMatch[1].trim() : undefined

        const urlParts = page.url.split('/')
        const section = urlParts[1] || ''

        return {
          id: `doc-${index}`,
          title,
          text: content,
          url: page.url,
          section: section.charAt(0).toUpperCase() + section.slice(1)
        }
      })
      .filter(doc => doc.title)
  }
})

export default loader
export const data = loader
