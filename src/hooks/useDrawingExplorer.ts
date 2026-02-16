import { useEffect, useMemo, useState } from 'react'
import type { DisciplineData, Drawing, Metadata, OverlayLayer, Revision } from '../types/drawing'
import { getOverlayTransform, normalizeRevisions, toDrawingUrl } from '../utils/drawing'

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

function getLatestRevisionFromDiscipline(discipline: DisciplineData) {
  return normalizeRevisions(discipline.revisions)[0]
}

export function useDrawingExplorer(metadata: Metadata | null): ExplorerResult {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [selectedDisciplineName, setSelectedDisciplineName] = useState<string | null>(null)
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null)
  const [selectedRevisionVersion, setSelectedRevisionVersion] = useState<string | null>(null)
  const [overlayDisciplines, setOverlayDisciplines] = useState<string[]>([])

  const rootDrawing = useMemo(() => {
    if (!metadata) return null
    return Object.values(metadata.drawings).find((drawing) => drawing.parent === null) ?? null
  }, [metadata])

  const spaces = useMemo(() => {
    if (!metadata || !rootDrawing) return []
    return Object.values(metadata.drawings)
      .filter((drawing) => drawing.parent === rootDrawing.id)
      .sort((a, b) => a.id.localeCompare(b.id))
  }, [metadata, rootDrawing])

  const selectedSpace = useMemo(
    () => spaces.find((space) => space.id === selectedSpaceId) ?? null,
    [spaces, selectedSpaceId],
  )

  const disciplineNames = useMemo(
    () => (selectedSpace?.disciplines ? Object.keys(selectedSpace.disciplines) : []),
    [selectedSpace],
  )

  const selectedDiscipline = useMemo(() => {
    if (!selectedSpace?.disciplines || !selectedDisciplineName) return null
    return selectedSpace.disciplines[selectedDisciplineName] ?? null
  }, [selectedDisciplineName, selectedSpace])

  const regionNames = useMemo(
    () => (selectedDiscipline?.regions ? Object.keys(selectedDiscipline.regions) : []),
    [selectedDiscipline],
  )

  const revisionCandidates = useMemo(() => {
    if (!selectedDiscipline) return []
    if (selectedRegionName && selectedDiscipline.regions?.[selectedRegionName]) {
      return normalizeRevisions(selectedDiscipline.regions[selectedRegionName].revisions)
    }
    return normalizeRevisions(selectedDiscipline.revisions)
  }, [selectedDiscipline, selectedRegionName])

  const selectedRevision = useMemo(
    () =>
      revisionCandidates.find((revision) => revision.version === selectedRevisionVersion) ??
      revisionCandidates[0] ??
      null,
    [revisionCandidates, selectedRevisionVersion],
  )

  const latestRevision = revisionCandidates[0] ?? null
  const baseImage = selectedRevision?.image ?? selectedDiscipline?.image ?? selectedSpace?.image ?? null
  const baseImageUrl = baseImage ? toDrawingUrl(baseImage) : null

  const overlayCandidates = useMemo(
    () => disciplineNames.filter((name) => name !== selectedDisciplineName),
    [disciplineNames, selectedDisciplineName],
  )

  const overlayLayers = useMemo(() => {
    if (!selectedSpace?.disciplines || !baseImage) return []

    return overlayDisciplines
      .map((disciplineName) => {
        const discipline = selectedSpace.disciplines?.[disciplineName]
        if (!discipline) return null

        const latestOverlayRevision = getLatestRevisionFromDiscipline(discipline)
        const image = latestOverlayRevision?.image ?? discipline.image
        if (!image || image === baseImage) return null

        const imageTransform = latestOverlayRevision?.imageTransform ?? discipline.imageTransform
        return {
          disciplineName,
          imageUrl: toDrawingUrl(image),
          transform: getOverlayTransform(imageTransform),
        }
      })
      .filter((layer): layer is OverlayLayer => layer !== null)
  }, [baseImage, overlayDisciplines, selectedSpace])

  useEffect(() => {
    if (!spaces.length) return
    if (!selectedSpaceId || !spaces.some((space) => space.id === selectedSpaceId)) {
      setSelectedSpaceId(spaces[0].id)
    }
  }, [selectedSpaceId, spaces])

  useEffect(() => {
    if (!disciplineNames.length) return
    if (!selectedDisciplineName || !disciplineNames.includes(selectedDisciplineName)) {
      setSelectedDisciplineName(disciplineNames[0])
      setOverlayDisciplines([])
    }
  }, [disciplineNames, selectedDisciplineName])

  useEffect(() => {
    if (!regionNames.length) {
      setSelectedRegionName(null)
      return
    }
    if (!selectedRegionName || !regionNames.includes(selectedRegionName)) {
      setSelectedRegionName(regionNames[0])
    }
  }, [regionNames, selectedRegionName])

  useEffect(() => {
    if (!revisionCandidates.length) {
      setSelectedRevisionVersion(null)
      return
    }
    if (!selectedRevisionVersion || !revisionCandidates.some((revision) => revision.version === selectedRevisionVersion)) {
      setSelectedRevisionVersion(revisionCandidates[0].version)
    }
  }, [revisionCandidates, selectedRevisionVersion])

  function handleSelectSpace(spaceId: string) {
    setSelectedSpaceId(spaceId)
    setOverlayDisciplines([])
  }

  function handleSelectDiscipline(disciplineName: string) {
    setSelectedDisciplineName(disciplineName)
    setOverlayDisciplines([])
  }

  function handleSelectRegion(regionName: string) {
    setSelectedRegionName(regionName)
  }

  function handleSelectRevision(version: string) {
    setSelectedRevisionVersion(version)
  }

  function toggleOverlayDiscipline(disciplineName: string) {
    setOverlayDisciplines((prev) => {
      if (prev.includes(disciplineName)) {
        return prev.filter((name) => name !== disciplineName)
      }
      return [...prev, disciplineName]
    })
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
