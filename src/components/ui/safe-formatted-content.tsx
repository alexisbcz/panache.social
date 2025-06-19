import React from 'react'
import { cn } from '@/lib/utils'
import '@/components/ui/minimal-tiptap/styles/index.css'

interface SafeFormattedContentProps {
  content: string
  className?: string
}

// Simple HTML sanitizer (for production, consider using a proper sanitization library)
const sanitizeHTML = (html: string): string => {
  // This is a basic sanitizer. For production use, consider using DOMPurify
  const allowedTags = /<\/?(?:p|br|strong|b|em|i|u|s|strike|h[1-6]|ul|ol|li|blockquote|code|pre|a|img|hr)(?:\s[^>]*)?>|[^<]+/gi
  return html.match(allowedTags)?.join('') || ''
}

export const SafeFormattedContent: React.FC<SafeFormattedContentProps> = ({
  content,
  className
}) => {
  // Basic HTML sanitization
  const sanitizedContent = React.useMemo(() => {
    return sanitizeHTML(content)
  }, [content])

  return (
    <div
      className={cn(
        'minimal-tiptap-editor',
        className
      )}
    >
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  )
}

export default SafeFormattedContent 