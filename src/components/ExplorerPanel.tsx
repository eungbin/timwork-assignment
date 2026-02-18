import type { Drawing, Revision } from '../types/drawing'
import { SpaceSelectorSection } from './SpaceSelectorSection'

type ExplorerPanelProps = {
  spaces: Drawing[]
  selectedSpaceId: string | null
  disciplineNames: string[]
  selectedDisciplineName: string | null
  regionNames: string[]
  selectedRegionName: string | null
  revisionCandidates: Revision[]
  selectedRevisionVersion: string | null
  overlayCandidates: string[]
  overlayDisciplines: string[]
  onSelectSpace: (spaceId: string) => void
  onSelectDiscipline: (disciplineName: string) => void
  onSelectRegion: (regionName: string) => void
  onSelectRevision: (version: string) => void
  onToggleOverlay: (disciplineName: string) => void
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[13px] ${
        active ? 'border-blue-600 bg-blue-100 text-blue-900' : 'border-slate-300 bg-slate-50'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export function ExplorerPanel({
  spaces,
  selectedSpaceId,
  disciplineNames,
  selectedDisciplineName,
  regionNames,
  selectedRegionName,
  revisionCandidates,
  selectedRevisionVersion,
  overlayCandidates,
  overlayDisciplines,
  onSelectSpace,
  onSelectDiscipline,
  onSelectRegion,
  onSelectRevision,
  onToggleOverlay,
}: ExplorerPanelProps) {
  return (
    <aside className="overflow-auto rounded-[10px] border border-slate-200 bg-white p-3.5 shadow-sm">
      <h1 className="mb-3.5 text-lg font-semibold">도면 탐색</h1>

      <SpaceSelectorSection spaces={spaces} selectedSpaceId={selectedSpaceId} onSelectSpace={onSelectSpace} />

      <section className="mb-4.5">
        <h2 className="mb-2 text-sm font-semibold">공종</h2>
        <div className="flex flex-wrap gap-2">
          {disciplineNames.map((disciplineName) => (
            <Chip
              key={disciplineName}
              label={disciplineName}
              active={selectedDisciplineName === disciplineName}
              onClick={() => onSelectDiscipline(disciplineName)}
            />
          ))}
        </div>
      </section>

      {regionNames.length > 0 && (
        <section className="mb-4.5">
          <h2 className="mb-2 text-sm font-semibold">영역(region)</h2>
          <div className="flex flex-wrap gap-2">
            {regionNames.map((regionName) => (
              <Chip
                key={regionName}
                label={`Region ${regionName}`}
                active={selectedRegionName === regionName}
                onClick={() => onSelectRegion(regionName)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mb-4.5">
        <h2 className="mb-2 text-sm font-semibold">리비전</h2>
        <div className="grid gap-2">
          {revisionCandidates.map((revision, index) => (
            <button
              key={`${revision.version}-${revision.date}`}
              className={`grid cursor-pointer grid-cols-[1fr_auto] items-center gap-y-0.5 rounded-lg border p-2 text-left ${
                selectedRevisionVersion === revision.version ? 'border-blue-700 bg-blue-50' : 'border-slate-300 bg-slate-50'
              }`}
              onClick={() => onSelectRevision(revision.version)}
            >
              <span>{revision.version}</span>
              {index === 0 && <strong className="text-[11px] text-blue-700">최신</strong>}
              <small className="col-span-2 text-slate-500">{revision.date}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-4.5">
        <h2 className="mb-2 text-sm font-semibold">비교 오버레이</h2>
        {overlayCandidates.length === 0 ? (
          <p className="m-0 text-slate-500">선택 가능한 비교 공종이 없습니다.</p>
        ) : (
          <div className="grid gap-1.5 text-sm">
            {overlayCandidates.map((disciplineName) => (
              <label key={disciplineName} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={overlayDisciplines.includes(disciplineName)}
                  onChange={() => onToggleOverlay(disciplineName)}
                />
                {disciplineName}
              </label>
            ))}
          </div>
        )}
      </section>
    </aside>
  )
}
