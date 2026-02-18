import type { Revision, Transform } from '../types/drawing'

const DRAWING_BASE_PATH = '/timwork/data/drawings'
const TRANSFORM_BASE_X = 2481
const TRANSFORM_BASE_Y = 1754

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

export function getOverlayTransform(transform?: Transform) {
  if (!transform) return undefined

  // 원본 좌표의 절대값이 커서 프로토타입에서는 기준점 대비 오프셋만 반영
  const xOffset = (transform.x - TRANSFORM_BASE_X) / 40
  const yOffset = (transform.y - TRANSFORM_BASE_Y) / 40
  return `translate(${xOffset}px, ${yOffset}px) scale(${transform.scale}) rotate(${transform.rotation}rad)`
}
