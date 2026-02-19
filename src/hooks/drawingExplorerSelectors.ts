import type { DisciplineData, Drawing, Metadata, OverlayLayer, Revision } from '../types/drawing'
import { normalizeRevisions, toDrawingUrl } from '../utils/drawing'

function getLatestRevisionFromDiscipline(discipline: DisciplineData) {
  return normalizeRevisions(discipline.revisions)[0]
}

export function getRootDrawing(metadata: Metadata | null): Drawing | null {
  if (!metadata) return null
  return Object.values(metadata.drawings).find((drawing) => drawing.parent === null) ?? null
}

export function getSpaces(metadata: Metadata | null, rootDrawing: Drawing | null): Drawing[] {
  if (!metadata || !rootDrawing) return []
  return Object.values(metadata.drawings)
    .filter((drawing) => drawing.parent === rootDrawing.id)
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function getEffectiveSelectedSpaceId(spaces: Drawing[], requestedSpaceId: string | null): string | null {
  if (!spaces.length) return null
  if (requestedSpaceId && spaces.some((space) => space.id === requestedSpaceId)) {
    return requestedSpaceId
  }
  return spaces[0].id
}

export function getSelectedSpace(spaces: Drawing[], selectedSpaceId: string | null): Drawing | null {
  return spaces.find((space) => space.id === selectedSpaceId) ?? null
}

export function getDisciplineNames(selectedSpace: Drawing | null): string[] {
  return selectedSpace?.disciplines ? Object.keys(selectedSpace.disciplines) : []
}

export function getEffectiveSelectedDisciplineName(
  disciplineNames: string[],
  requestedDisciplineName: string | null,
): string | null {
  if (!disciplineNames.length) return null
  if (requestedDisciplineName && disciplineNames.includes(requestedDisciplineName)) {
    return requestedDisciplineName
  }
  return disciplineNames[0]
}

export function getSelectedDiscipline(
  selectedSpace: Drawing | null,
  selectedDisciplineName: string | null,
): DisciplineData | null {
  if (!selectedSpace?.disciplines || !selectedDisciplineName) return null
  return selectedSpace.disciplines[selectedDisciplineName] ?? null
}

export function getRegionNames(selectedDiscipline: DisciplineData | null): string[] {
  return selectedDiscipline?.regions ? Object.keys(selectedDiscipline.regions) : []
}

export function getEffectiveSelectedRegionName(
  regionNames: string[],
  requestedRegionName: string | null,
): string | null {
  if (!regionNames.length) return null
  if (requestedRegionName && regionNames.includes(requestedRegionName)) {
    return requestedRegionName
  }
  return regionNames[0]
}

export function getRevisionCandidates(
  selectedDiscipline: DisciplineData | null,
  selectedRegionName: string | null,
): Revision[] {
  if (!selectedDiscipline) return []
  if (selectedRegionName && selectedDiscipline.regions?.[selectedRegionName]) {
    return normalizeRevisions(selectedDiscipline.regions[selectedRegionName].revisions)
  }
  return normalizeRevisions(selectedDiscipline.revisions)
}

export function getEffectiveSelectedRevisionVersion(
  revisionCandidates: Revision[],
  requestedRevisionVersion: string | null,
): string | null {
  if (!revisionCandidates.length) return null
  if (requestedRevisionVersion && revisionCandidates.some((revision) => revision.version === requestedRevisionVersion)) {
    return requestedRevisionVersion
  }
  return revisionCandidates[0].version
}

export function getSelectedRevision(
  revisionCandidates: Revision[],
  selectedRevisionVersion: string | null,
): Revision | null {
  if (!selectedRevisionVersion) return revisionCandidates[0] ?? null
  return revisionCandidates.find((revision) => revision.version === selectedRevisionVersion) ?? revisionCandidates[0] ?? null
}

export function getLatestRevision(revisionCandidates: Revision[]): Revision | null {
  return revisionCandidates[0] ?? null
}

export function getBaseImage(
  selectedRevision: Revision | null,
  selectedDiscipline: DisciplineData | null,
  selectedSpace: Drawing | null,
): string | null {
  if (selectedDiscipline?.regions && selectedDiscipline.image) {
    return selectedDiscipline.image
  }
  return selectedRevision?.image ?? selectedDiscipline?.image ?? selectedSpace?.image ?? null
}

export function getBaseImageUrl(baseImage: string | null): string | null {
  return baseImage ? toDrawingUrl(baseImage) : null
}

export function getOverlayCandidates(
  disciplineNames: string[],
  selectedDisciplineName: string | null,
): string[] {
  return disciplineNames.filter((name) => name !== selectedDisciplineName)
}

export function getEffectiveOverlayDisciplines(
  requestedOverlayDisciplines: string[],
  overlayCandidates: string[],
): string[] {
  return requestedOverlayDisciplines.filter((disciplineName) => overlayCandidates.includes(disciplineName))
}

export function getOverlayLayers(
  selectedSpace: Drawing | null,
  overlayDisciplines: string[],
  baseImage: string | null,
): OverlayLayer[] {
  if (!selectedSpace?.disciplines || !baseImage) return []

  return overlayDisciplines
    .map((disciplineName): OverlayLayer | null => {
      const discipline = selectedSpace.disciplines?.[disciplineName]
      if (!discipline) return null

      const latestOverlayRevision = getLatestRevisionFromDiscipline(discipline)
      const image = latestOverlayRevision?.image ?? discipline.image
      if (!image || image === baseImage) return null

      const imageTransform = latestOverlayRevision?.imageTransform ?? discipline.imageTransform
      return {
        disciplineName,
        imageName: image,
        imageUrl: toDrawingUrl(image),
        transform: undefined,
        imageTransform,
        opacity: 0.45,
        blendMode: 'multiply',
      }
    })
    .filter((layer): layer is OverlayLayer => layer !== null)
}

export function getDefaultRegionOverlayLayer(
  selectedDisciplineName: string | null,
  selectedRegionName: string | null,
  selectedDiscipline: DisciplineData | null,
  selectedRevision: Revision | null,
  baseImage: string | null,
): OverlayLayer | null {
  if (!selectedDisciplineName || !selectedRegionName) return null
  if (!selectedDiscipline?.regions?.[selectedRegionName]) return null
  if (!selectedRevision?.image || !baseImage) return null

  const revisionTransform = selectedRevision.imageTransform
  const isTransformCompatible =
    !!revisionTransform && (revisionTransform.relativeTo ? revisionTransform.relativeTo === baseImage : true)

  return {
    disciplineName: `${selectedDisciplineName} Region ${selectedRegionName}`,
    imageName: selectedRevision.image,
    imageUrl: toDrawingUrl(selectedRevision.image),
    transform: undefined,
    imageTransform: isTransformCompatible ? revisionTransform : undefined,
    opacity: 1,
    blendMode: 'normal',
  }
}
