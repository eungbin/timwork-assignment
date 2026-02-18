import { useMemo, useReducer } from 'react'
import type { Drawing, Metadata, OverlayLayer, Revision } from '../types/drawing'
import { explorerReducer, initialExplorerSelectionState } from './drawingExplorerReducer'
import {
  getBaseImage,
  getBaseImageUrl,
  getDisciplineNames,
  getEffectiveOverlayDisciplines,
  getEffectiveSelectedDisciplineName,
  getEffectiveSelectedRegionName,
  getEffectiveSelectedRevisionVersion,
  getEffectiveSelectedSpaceId,
  getLatestRevision,
  getOverlayCandidates,
  getOverlayLayers,
  getRegionNames,
  getRevisionCandidates,
  getRootDrawing,
  getSelectedDiscipline,
  getSelectedRevision,
  getSelectedSpace,
  getSpaces,
} from './drawingExplorerSelectors'

type ExplorerResult = {
  rootDrawing: Drawing | null
  spaces: Drawing[]
  selectedSpaceId: string | null
  selectedSpace: Drawing | null
  selectedDisciplineName: string | null
  selectedRegionName: string | null
  selectedRevisionVersion: string | null
  disciplineNames: string[]
  regionNames: string[]
  revisionCandidates: Revision[]
  selectedRevision: Revision | null
  latestRevision: Revision | null
  baseImage: string | null
  baseImageUrl: string | null
  overlayCandidates: string[]
  overlayDisciplines: string[]
  overlayLayers: OverlayLayer[]
  setSelectedSpaceId: (spaceId: string) => void
  setSelectedDisciplineName: (disciplineName: string) => void
  setSelectedRegionName: (regionName: string) => void
  setSelectedRevisionVersion: (version: string) => void
  toggleOverlayDiscipline: (disciplineName: string) => void
}

export function useDrawingExplorer(metadata: Metadata | null): ExplorerResult {
  const [state, dispatch] = useReducer(explorerReducer, initialExplorerSelectionState)

  const rootDrawing = useMemo(() => getRootDrawing(metadata), [metadata])
  const spaces = useMemo(() => getSpaces(metadata, rootDrawing), [metadata, rootDrawing])
  const selectedSpaceId = useMemo(
    () => getEffectiveSelectedSpaceId(spaces, state.selectedSpaceId),
    [spaces, state.selectedSpaceId],
  )
  const selectedSpace = useMemo(() => getSelectedSpace(spaces, selectedSpaceId), [spaces, selectedSpaceId])
  const disciplineNames = useMemo(() => getDisciplineNames(selectedSpace), [selectedSpace])
  const selectedDisciplineName = useMemo(
    () => getEffectiveSelectedDisciplineName(disciplineNames, state.selectedDisciplineName),
    [disciplineNames, state.selectedDisciplineName],
  )
  const selectedDiscipline = useMemo(
    () => getSelectedDiscipline(selectedSpace, selectedDisciplineName),
    [selectedDisciplineName, selectedSpace],
  )
  const regionNames = useMemo(() => getRegionNames(selectedDiscipline), [selectedDiscipline])
  const selectedRegionName = useMemo(
    () => getEffectiveSelectedRegionName(regionNames, state.selectedRegionName),
    [regionNames, state.selectedRegionName],
  )
  const revisionCandidates = useMemo(
    () => getRevisionCandidates(selectedDiscipline, selectedRegionName),
    [selectedDiscipline, selectedRegionName],
  )
  const selectedRevisionVersion = useMemo(
    () => getEffectiveSelectedRevisionVersion(revisionCandidates, state.selectedRevisionVersion),
    [revisionCandidates, state.selectedRevisionVersion],
  )
  const selectedRevision = useMemo(
    () => getSelectedRevision(revisionCandidates, selectedRevisionVersion),
    [revisionCandidates, selectedRevisionVersion],
  )
  const latestRevision = useMemo(() => getLatestRevision(revisionCandidates), [revisionCandidates])
  const baseImage = useMemo(
    () => getBaseImage(selectedRevision, selectedDiscipline, selectedSpace),
    [selectedDiscipline, selectedRevision, selectedSpace],
  )
  const baseImageUrl = useMemo(() => getBaseImageUrl(baseImage), [baseImage])
  const overlayCandidates = useMemo(
    () => getOverlayCandidates(disciplineNames, selectedDisciplineName),
    [disciplineNames, selectedDisciplineName],
  )
  const overlayDisciplines = useMemo(
    () => getEffectiveOverlayDisciplines(state.overlayDisciplines, overlayCandidates),
    [overlayCandidates, state.overlayDisciplines],
  )
  const overlayLayers = useMemo(
    () => getOverlayLayers(selectedSpace, overlayDisciplines, baseImage),
    [baseImage, overlayDisciplines, selectedSpace],
  )

  function handleSelectSpace(spaceId: string) {
    dispatch({ type: 'SPACE_SELECTED', spaceId })
  }

  function handleSelectDiscipline(disciplineName: string) {
    dispatch({ type: 'DISCIPLINE_SELECTED', disciplineName })
  }

  function handleSelectRegion(regionName: string) {
    dispatch({ type: 'REGION_SELECTED', regionName })
  }

  function handleSelectRevision(version: string) {
    dispatch({ type: 'REVISION_SELECTED', version })
  }

  function toggleOverlayDiscipline(disciplineName: string) {
    dispatch({ type: 'OVERLAY_TOGGLED', disciplineName })
  }

  return {
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
    setSelectedSpaceId: handleSelectSpace,
    setSelectedDisciplineName: handleSelectDiscipline,
    setSelectedRegionName: handleSelectRegion,
    setSelectedRevisionVersion: handleSelectRevision,
    toggleOverlayDiscipline,
  }
}
