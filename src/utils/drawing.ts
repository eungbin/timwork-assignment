import type { Revision, Transform } from '../types/drawing'

const DRAWING_BASE_PATH = '/timwork/data/drawings'
const TRANSFORM_BASE_X = 2481
const TRANSFORM_BASE_Y = 1754

type OverlayTransformContext = {
  baseNaturalWidth: number
  baseNaturalHeight: number
  baseRenderedWidth: number
  baseRenderedHeight: number
}

export function byLatestRevision(a: Revision, b: Revision) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

function isRevision(value: unknown): value is Revision {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<Revision>
  return (
    typeof candidate.version === 'string' &&
    typeof candidate.image === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.description === 'string'
  )
}

export function normalizeRevisions(revisions: unknown): Revision[] {
  const revisionList = Array.isArray(revisions)
    ? revisions
    : revisions && typeof revisions === 'object'
      ? Object.values(revisions as Record<string, unknown>)
      : []

  return revisionList
    .filter(isRevision)
    .map((revision) => ({
      ...revision,
      changes: Array.isArray(revision.changes) ? revision.changes : [],
    }))
    .sort(byLatestRevision)
}

export function toDrawingUrl(fileName: string) {
  return `${DRAWING_BASE_PATH}/${encodeURIComponent(fileName)}`
}

export function getOverlayTransform(transform?: Transform, context?: OverlayTransformContext) {
  if (!transform) return undefined

  const centerX = context ? context.baseNaturalWidth / 2 : TRANSFORM_BASE_X
  const centerY = context ? context.baseNaturalHeight / 2 : TRANSFORM_BASE_Y
  const xScale = context ? context.baseRenderedWidth / context.baseNaturalWidth : 1 / 40
  const yScale = context ? context.baseRenderedHeight / context.baseNaturalHeight : 1 / 40

  const xOffset = (transform.x - centerX) * xScale
  const yOffset = (transform.y - centerY) * yScale
  return `translate(${xOffset}px, ${yOffset}px) scale(${transform.scale}) rotate(${transform.rotation}rad)`
}
