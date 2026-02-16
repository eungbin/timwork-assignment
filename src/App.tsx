import { ContextPanel } from './components/ContextPanel'
import { DrawingCanvasPanel } from './components/DrawingCanvasPanel'
import { ExplorerPanel } from './components/ExplorerPanel'
import { useDrawingExplorer } from './hooks/useDrawingExplorer'
import { useMetadata } from './hooks/useMetadata'

function App() {
  const { metadata, loading, error } = useMetadata()
  const {
    rootDrawing,
    spaces,
    selectedSpaceId,
    selectedSpace,
    selectedDisciplineName,
    selectedRegionName,
    selectedRevisionVersion,
    disciplineNames,
    regionNames,
    revisionCandidates,
    selectedRevision,
    latestRevision,
    baseImage,
    baseImageUrl,
    overlayCandidates,
    overlayDisciplines,
    overlayLayers,
    setSelectedSpaceId,
    setSelectedDisciplineName,
    setSelectedRegionName,
    setSelectedRevisionVersion,
    toggleOverlayDiscipline,
  } = useDrawingExplorer(metadata)

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-base">메타데이터를 불러오는 중입니다...</div>
  }

  if (error || !metadata || !rootDrawing) {
    return (
      <div className="flex h-screen items-center justify-center text-base text-red-700">
        오류: {error ?? '프로젝트 데이터를 읽지 못했습니다.'}
      </div>
    )
  }

  return (
    <div className="grid h-screen grid-cols-[300px_minmax(0,1fr)_320px] gap-3 box-border p-3 max-[1300px]:h-auto max-[1300px]:min-h-screen max-[1300px]:grid-cols-1">
      <ExplorerPanel
        spaces={spaces}
        selectedSpaceId={selectedSpaceId}
        disciplineNames={disciplineNames}
        selectedDisciplineName={selectedDisciplineName}
        regionNames={regionNames}
        selectedRegionName={selectedRegionName}
        revisionCandidates={revisionCandidates}
        selectedRevisionVersion={selectedRevisionVersion}
        overlayCandidates={overlayCandidates}
        overlayDisciplines={overlayDisciplines}
        onSelectSpace={setSelectedSpaceId}
        onSelectDiscipline={setSelectedDisciplineName}
        onSelectRegion={setSelectedRegionName}
        onSelectRevision={setSelectedRevisionVersion}
        onToggleOverlay={toggleOverlayDiscipline}
      />

      <DrawingCanvasPanel
        spaceName={selectedSpace?.name ?? null}
        disciplineName={selectedDisciplineName}
        regionName={selectedRegionName}
        revisionVersion={selectedRevision?.version ?? null}
        baseImageName={baseImage}
        baseImageUrl={baseImageUrl}
        overlayLayers={overlayLayers}
      />

      <ContextPanel
        rootDrawingName={rootDrawing.name}
        selectedSpaceName={selectedSpace?.name ?? null}
        selectedDisciplineName={selectedDisciplineName}
        selectedRegionName={selectedRegionName}
        selectedRevision={selectedRevision}
        latestRevision={latestRevision}
      />
    </div>
  )
}

export default App
