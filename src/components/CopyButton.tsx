import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  content: string
  className?: string
  disabled?: boolean // New disabled prop
}

const CopyButton: React.FC<CopyButtonProps> = ({
  content,
  className = '',
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false)

  const formatText = (html: string): string => {
    // Create a temporary div
    const temp = document.createElement('div')
    temp.innerHTML = html

    // Replace <br> and <p> tags with line breaks
    const textContent = temp.innerHTML
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<br\/>/g, '\n')
      .replace(/<br \/>/g, '\n')

    // Convert HTML entities and get plain text
    temp.innerHTML = textContent
    let cleanText = temp.textContent || temp.innerText

    // Remove extra line breaks and trim
    cleanText = cleanText
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace triple line breaks with double
      .trim()

    return cleanText
  }

  const handleCopy = async (): Promise<void> => {
    if (disabled) return // Prevent copying if disabled

    try {
      const formattedText = formatText(content)
      await navigator.clipboard.writeText(formattedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-gray-100 ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`} // Change styles if disabled
      title='Copy to clipboard'
      disabled={disabled} // Set the button's disabled state
    >
      {copied ? (
        <Check className='h-4 w-4 text-green-500' />
      ) : (
        <Copy className='h-4 w-4 text-gray-500' />
      )}
    </button>
  )
}

export default CopyButton
