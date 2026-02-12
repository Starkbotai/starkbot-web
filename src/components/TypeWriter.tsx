import { useState, useEffect, useCallback } from 'react'

interface TypeWriterProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function TypeWriter({
  phrases,
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const currentPhrase = phrases[currentPhraseIndex]

  const tick = useCallback(() => {
    if (!isDeleting) {
      // Typing
      if (displayText.length < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1))
      } else {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseDuration)
        return
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        setIsDeleting(false)
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
      }
    }
  }, [displayText, isDeleting, currentPhrase, phrases.length, pauseDuration])

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting, deletingSpeed, typingSpeed])

  // Parse bold markers **text** to styled spans
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="accent-gradient-text font-bold">
            {part.slice(2, -2)}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <span className="inline">
      {renderText(displayText)}
      <span className="typewriter-cursor" />
    </span>
  )
}
