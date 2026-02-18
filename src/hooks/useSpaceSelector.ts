import { useMemo, useState, type KeyboardEvent } from 'react'
import type { Drawing } from '../types/drawing'

type UseSpaceSelectorParams = {
  spaces: Drawing[]
  selectedSpaceId: string | null
  onSelectSpace: (spaceId: string) => void
}

export function useSpaceSelector({ spaces, selectedSpaceId, onSelectSpace }: UseSpaceSelectorParams) {
  const [spaceQuery, setSpaceQuery] = useState('')
  const [isSpaceDropdownOpen, setIsSpaceDropdownOpen] = useState(false)
  const [isSpaceInputEditing, setIsSpaceInputEditing] = useState(false)
  const [isSpaceHelpOpen, setIsSpaceHelpOpen] = useState(false)

  const selectedSpace = useMemo(
    () => spaces.find((space) => space.id === selectedSpaceId) ?? null,
    [selectedSpaceId, spaces],
  )

  const filteredSpaces = useMemo(() => {
    const query = (isSpaceInputEditing ? spaceQuery : selectedSpace?.name ?? '').trim().toLowerCase()
    if (!query) return spaces
    return spaces.filter((space) => space.name.toLowerCase().includes(query))
  }, [isSpaceInputEditing, selectedSpace, spaceQuery, spaces])

  function handleSpaceInputChange(value: string) {
    setSpaceQuery(value)
    setIsSpaceInputEditing(true)
    setIsSpaceDropdownOpen(true)
  }

  function handleSelectSpace(space: Drawing) {
    onSelectSpace(space.id)
    setSpaceQuery(space.name)
    setIsSpaceInputEditing(false)
    setIsSpaceDropdownOpen(false)
  }

  function handleSpaceInputFocus() {
    setIsSpaceInputEditing(true)
    setSpaceQuery(selectedSpace?.name ?? '')
    setIsSpaceDropdownOpen(true)
  }

  function handleSpaceInputBlur() {
    setTimeout(() => {
      setIsSpaceDropdownOpen(false)
      setIsSpaceInputEditing(false)
      setSpaceQuery('')
    }, 100)
  }

  function handleSpaceInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Escape') return
    event.preventDefault()
    setIsSpaceDropdownOpen(false)
    setIsSpaceInputEditing(false)
    setSpaceQuery('')
    event.currentTarget.blur()
  }

  return {
    selectedSpaceId,
    selectedSpace,
    filteredSpaces,
    isSpaceDropdownOpen,
    isSpaceHelpOpen,
    inputValue: isSpaceInputEditing ? spaceQuery : (selectedSpace?.name ?? ''),
    setIsSpaceHelpOpen,
    handleSpaceInputChange,
    handleSelectSpace,
    handleSpaceInputFocus,
    handleSpaceInputBlur,
    handleSpaceInputKeyDown,
  }
}
