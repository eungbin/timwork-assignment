import type { Revision, Transform } from '../types/drawing'

const DRAWING_BASE_PATH = '/timwork/data/drawings'
const TRANSFORM_BASE_X = 2481
const TRANSFORM_BASE_Y = 1754

export function byLatestRevision(a: Revision, b: Revision) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

export function normalizeRevisions(revisions: Revision[]) {
  return [...revisions].sort(byLatestRevision)
}

export function toDrawingUrl(fileName: string) {
  return `${DRAWING_BASE_PATH}/${encodeURIComponent(fileName)}`
}

export function getOverlayTransform(transform?: Transform) {
  if (!transform) return undefined

  // 원본 좌표의 절대값이 커서 프로토타입에서는 기준점 대비 오프셋만 반영합니다.
  const xOffset = (transform.x - TRANSFORM_BASE_X) / 40
  const yOffset = (transform.y - TRANSFORM_BASE_Y) / 40
  return `translate(${xOffset}px, ${yOffset}px) scale(${transform.scale}) rotate(${transform.rotation}rad)`
}
