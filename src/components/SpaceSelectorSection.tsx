import type { Drawing } from '../types/drawing'
import { useSpaceSelector } from '../hooks/useSpaceSelector'

type SpaceSelectorSectionProps = {
  spaces: Drawing[]
  selectedSpaceId: string | null
  onSelectSpace: (spaceId: string) => void
}

export function SpaceSelectorSection({ spaces, selectedSpaceId, onSelectSpace }: SpaceSelectorSectionProps) {
  const {
    filteredSpaces,
    isSpaceDropdownOpen,
    isSpaceHelpOpen,
    inputValue,
    setIsSpaceHelpOpen,
    handleSpaceInputChange,
    handleSelectSpace,
    handleSpaceInputFocus,
    handleSpaceInputBlur,
    handleSpaceInputKeyDown,
  } = useSpaceSelector({
    spaces,
    selectedSpaceId,
    onSelectSpace,
  })

  return (
    <section className="mb-4.5">
      <div className="mb-2 flex items-center gap-1.5">
        <h2 className="text-sm font-semibold">공간</h2>
        <div className="relative">
          <button
            type="button"
            className="inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold leading-none text-slate-600 hover:bg-slate-100"
            aria-label="공간 검색 도움말"
            aria-expanded={isSpaceHelpOpen}
            onMouseEnter={() => setIsSpaceHelpOpen(true)}
            onMouseLeave={() => setIsSpaceHelpOpen(false)}
            onFocus={() => setIsSpaceHelpOpen(true)}
            onBlur={() => setIsSpaceHelpOpen(false)}
            onClick={() => setIsSpaceHelpOpen((prev) => !prev)}
          >
            ?
          </button>
          {isSpaceHelpOpen && (
            <div className="absolute left-0 top-6 z-30 w-56 rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-md">
              공간명이 많을 때 입력창에 키워드를 입력하면 드롭다운 리스트가 필터링됩니다.
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          placeholder="공간 검색..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          onFocus={handleSpaceInputFocus}
          onBlur={handleSpaceInputBlur}
          onKeyDown={handleSpaceInputKeyDown}
          onChange={(event) => handleSpaceInputChange(event.target.value)}
        />

        {isSpaceDropdownOpen && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-md">
            {filteredSpaces.length === 0 ? (
              <p className="m-0 px-2 py-1.5 text-sm text-slate-500">검색 결과가 없습니다.</p>
            ) : (
              filteredSpaces.map((space) => (
                <button
                  key={space.id}
                  className={`w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm ${
                    selectedSpaceId === space.id ? 'bg-blue-100 text-blue-900' : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleSelectSpace(space)}
                >
                  {space.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
