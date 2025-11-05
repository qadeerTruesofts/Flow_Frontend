/**
 * Converts plain text to formatted HTML
 * Automatically detects headings, paragraphs, lists, etc.
 */

export function formatPlainTextToHTML(text: string): string {
  if (!text || !text.trim()) {
    return ''
  }

  // Split text into lines
  const lines = text.split('\n').map(line => line.trim())
  
  let html = ''
  let inList = false
  let listType: 'ul' | 'ol' = 'ul'
  let inParagraph = false
  let paragraphContent = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const nextLine = i < lines.length - 1 ? lines[i + 1] : ''
    const prevLine = i > 0 ? lines[i - 1] : ''
    
    // Skip empty lines
    if (!line) {
      // Close any open tags
      if (inList) {
        html += `</${listType}>\n`
        inList = false
      }
      if (inParagraph) {
        if (paragraphContent.trim()) {
          html += `<p>${formatInlineText(paragraphContent.trim())}</p>\n`
        }
        paragraphContent = ''
        inParagraph = false
      }
      continue
    }

    // Detect bullet lists (lines starting with -, *, or •)
    if (/^[-*•]\s/.test(line)) {
      if (!inList || listType !== 'ul') {
        if (inList) {
          html += `</${listType}>\n`
        }
        html += '<ul>\n'
        inList = true
        listType = 'ul'
      }
      const listItem = line.replace(/^[-*•]\s/, '').trim()
      if (listItem) {
        html += `  <li>${formatInlineText(escapeHTML(listItem))}</li>\n`
      }
      continue
    }

    // Detect numbered lists (lines starting with number followed by period or parenthesis)
    if (/^\d+[.)]\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) {
          html += `</${listType}>\n`
        }
        html += '<ol>\n'
        inList = true
        listType = 'ol'
      }
      const listItem = line.replace(/^\d+[.)]\s/, '').trim()
      if (listItem) {
        html += `  <li>${formatInlineText(escapeHTML(listItem))}</li>\n`
      }
      continue
    }

    // Close list if we're no longer in one
    if (inList) {
      html += `</${listType}>\n`
      inList = false
    }

    // Detect numbered headings (like "1. Heading", "2. Heading", etc.)
    // Must be: number followed by period/parenthesis, then space, then text (not a list item)
    const numberedHeadingMatch = line.match(/^(\d+)[.)]\s+(.+)$/)
    if (numberedHeadingMatch) {
      const headingNumber = numberedHeadingMatch[1]
      const headingText = numberedHeadingMatch[2].trim()
      
      // Only treat as heading if:
      // 1. The text after the number is substantial (more than 10 chars)
      // 2. It looks like a heading (capital letter, proper sentence structure)
      // 3. It's not too short (likely a list item) and not too long (likely a paragraph)
      const isProperHeading = headingText.length > 10 && 
                             headingText.length < 100 &&
                             /^[A-Z]/.test(headingText) && // Starts with capital letter
                             !headingText.match(/^[a-z]/) // Doesn't start lowercase
      
      if (isProperHeading) {
        // Close any open paragraph
        if (inParagraph) {
          if (paragraphContent.trim()) {
            html += `<p>${formatInlineText(paragraphContent.trim())}</p>\n`
          }
          paragraphContent = ''
          inParagraph = false
        }

        html += `<h2 class="has-number"><span class="heading-number">${headingNumber}.</span> <span class="heading-text">${escapeHTML(headingText)}</span></h2>\n`
        continue
      }
    }

    // Detect headings
    // H2: Short line (less than 80 chars), possibly all caps, ends with colon, or standalone
    const isShortLine = line.length < 80 && line.length > 5
    const isAllCaps = line === line.toUpperCase() && line.length > 5 && line.length < 60
    const endsWithColon = line.endsWith(':') && !line.includes('.') && line.length < 80
    const isStandalone = isShortLine && !prevLine && !nextLine
    const hasNoPunctuation = !line.match(/[.!?]$/) && line.length < 60
    const isCapitalized = /^[A-Z][a-z]+/.test(line) && line.length < 80 && !line.includes('.')
    const isSingleWord = !line.includes(' ') && line.length > 5 && line.length < 40 && /^[A-Z]/.test(line)
    
    // Check if it looks like a heading (but not a numbered list item)
    const looksLikeHeading = (isAllCaps || endsWithColon || isStandalone || hasNoPunctuation || isCapitalized || isSingleWord) && 
                             !line.startsWith('http') && 
                             !line.includes('@') &&
                             !line.match(/^\d+[.)]\s/) && // Not a numbered list
                             !line.includes('email') &&
                             !line.includes('phone') &&
                             !line.includes('www') &&
                             !line.match(/^\d+$/) // Not just a number
    
    if (looksLikeHeading) {
      // Close any open paragraph
      if (inParagraph) {
        if (paragraphContent.trim()) {
          html += `<p>${formatInlineText(paragraphContent.trim())}</p>\n`
        }
        paragraphContent = ''
        inParagraph = false
      }

      // Determine heading level based on length and context
      const headingText = line.replace(':', '').trim()
      if (line.length < 40 && (isAllCaps || endsWithColon || !line.includes(' '))) {
        html += `<h2>${escapeHTML(headingText)}</h2>\n`
      } else if (line.length < 60) {
        html += `<h3>${escapeHTML(headingText)}</h3>\n`
      } else {
        html += `<h3>${escapeHTML(headingText)}</h3>\n`
      }
      continue
    }

    // Regular paragraph content
    if (!inParagraph) {
      inParagraph = true
      paragraphContent = line
    } else {
      paragraphContent += ' ' + line
    }

    // Close paragraph if next line is empty, starts with list marker, or looks like a heading
    const nextIsHeading = nextLine && (
      (nextLine.length < 60 && nextLine === nextLine.toUpperCase() && nextLine.length > 5) ||
      (nextLine.endsWith(':') && !nextLine.includes('.')) ||
      (nextLine.length < 50 && !nextLine.match(/[.!?]$/) && !nextLine.includes('http'))
    )
    
    if (!nextLine || /^[-*•]\s/.test(nextLine) || /^\d+[.)]\s/.test(nextLine) || nextIsHeading) {
      if (inParagraph && paragraphContent.trim()) {
        html += `<p>${formatInlineText(paragraphContent.trim())}</p>\n`
        paragraphContent = ''
        inParagraph = false
      }
    }
  }

  // Close any remaining open tags
  if (inList) {
    html += `</${listType}>\n`
  }
  if (inParagraph && paragraphContent.trim()) {
    html += `<p>${formatInlineText(paragraphContent.trim())}</p>\n`
  }

  return html.trim()
}

/**
 * Formats inline text (bold, italic, links)
 */
function formatInlineText(text: string): string {
  // Convert **text** to <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Convert *text* to <em>text</em> (but not if it's **bold**)
  text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
  
  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s]+)/g
  text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
  
  return text
}

/**
 * Formats content that may contain both HTML tags and plain text
 * Preserves existing HTML tags but formats plain text sections
 */
export function formatMixedContent(text: string): string {
  if (!text || !text.trim()) {
    return ''
  }

  // First, fix malformed HTML tags (like </h2>4. Text</h2>)
  text = text.replace(/<\/(h[1-6])>(\d+[.)]\s+[^<\n]+)<\/\1>/gi, (match, tag, content) => {
    const numMatch = content.trim().match(/^(\d+)[.)]\s+(.+)$/)
    if (numMatch) {
      const num = numMatch[1]
      const text = numMatch[2].trim()
      return `<${tag} class="has-number"><span class="heading-number">${num}.</span> <span class="heading-text">${escapeHTML(text)}</span></${tag}>`
    }
    return `<${tag}>${content.trim()}</${tag}>`
  })

  // Fix tags with numbered headings inside (like <h2> 2. Text </h2>)
  text = text.replace(/<(h[1-6])>\s*(\d+[.)]\s+[^<\n]+?)\s*<\/\1>/gi, (match, tag, content) => {
    const numMatch = content.trim().match(/^(\d+)[.)]\s+(.+)$/)
    if (numMatch) {
      const num = numMatch[1]
      const text = numMatch[2].trim()
      return `<${tag} class="has-number"><span class="heading-number">${num}.</span> <span class="heading-text">${escapeHTML(text)}</span></${tag}>`
    }
    return match
  })

  // Split into lines and process
  const lines = text.split('\n')
  let result = ''
  let plainTextBuffer = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if line contains HTML tags (opening and closing tags)
    const hasHTMLTags = /<(h[1-6]|p|div|ul|ol|li|strong|em|a|span|br|img|blockquote|code|pre)[^>]*>.*?<\/\1>|<(h[1-6]|p|div|ul|ol|li|strong|em|a|span|br|img|blockquote|code|pre|hr)[^>]*\/?>/gi.test(line)
    
    if (hasHTMLTags) {
      // First, flush any accumulated plain text
      if (plainTextBuffer.trim()) {
        result += formatPlainTextToHTML(plainTextBuffer.trim())
        plainTextBuffer = ''
      }
      
      // Add the HTML line as-is (already fixed above)
      result += line + '\n'
    } else {
      // Plain text line - accumulate it
      if (plainTextBuffer) {
        plainTextBuffer += '\n' + line
      } else {
        plainTextBuffer = line
      }
    }
  }
  
  // Flush any remaining plain text
  if (plainTextBuffer.trim()) {
    result += formatPlainTextToHTML(plainTextBuffer.trim())
  }
  
  return result.trim()
}

/**
 * Escapes HTML special characters
 */
function escapeHTML(text: string): string {
  if (typeof document === 'undefined') {
    // Server-side: manual escaping
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  // Client-side: use DOM
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

