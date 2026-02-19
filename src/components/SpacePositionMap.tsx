import { useEffect, useMemo, useRef, useState } from 'react'
import type { Drawing } from '../types/drawing'

type SpacePositionMapProps = {
  rootImageUrl: string | null
  spaces: Drawing[]
  selectedSpaceId: string | null
  onSelectSpace: (spaceId: string) => void
}

export function SpacePositionMap({ rootImageUrl, spaces, selectedSpaceId, onSelectSpace }: SpacePositionMapProps) {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [hoveredSpaceId, setHoveredSpaceId] = useState<string | null>(null)
  const [imageMetrics, setImageMetrics] = useState<{
    naturalWidth: number
    naturalHeight: number
    renderedWidth: number
    renderedHeight: number
  } | null>(null)

  const spacesWithPosition = useMemo(
    () => spaces.filter((space) => Array.isArray(space.position?.vertices) && space.position.vertices.length > 2),
    [spaces],
  )

  function updateMetrics() {
    const imageElement = imageRef.current
    if (!imageElement || !imageElement.naturalWidth || !imageElement.naturalHeight) return

    const rect = imageElement.getBoundingClientRect()
    setImageMetrics({
      naturalWidth: imageElement.naturalWidth,
      naturalHeight: imageElement.naturalHeight,
      renderedWidth: rect.width,
      renderedHeight: rect.height,
    })
  }

  useEffect(() => {
    const imageElement = imageRef.current
    if (!imageElement) return

    const observer = new ResizeObserver(() => {
      updateMetrics()
    })
    observer.observe(imageElement)
    return () => {
      observer.disconnect()
    }
  }, [rootImageUrl])

  const renderedPolygons = useMemo(() => {
    if (!imageMetrics) return []

    const scaleX = imageMetrics.renderedWidth / imageMetrics.naturalWidth
    const scaleY = imageMetrics.renderedHeight / imageMetrics.naturalHeight
    return spacesWithPosition.map((space) => {
      const scaledVertices = (space.position?.vertices ?? []).map(([x, y]) => [x * scaleX, y * scaleY] as const)
      const points = scaledVertices.map(([x, y]) => `${x},${y}`).join(' ')
      const centroid =
        scaledVertices.length > 0
          ? scaledVertices.reduce(
              (acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }),
              { x: 0, y: 0 },
            )
          : { x: 0, y: 0 }
      return {
        id: space.id,
        name: space.name,
        points: points ?? '',
        active: selectedSpaceId === space.id,
        centroidX: scaledVertices.length > 0 ? centroid.x / scaledVertices.length : 0,
        centroidY: scaledVertices.length > 0 ? centroid.y / scaledVertices.length : 0,
      }
    })
  }, [imageMetrics, selectedSpaceId, spacesWithPosition])

  const hoveredPolygon = useMemo(
    () => renderedPolygons.find((polygon) => polygon.id === hoveredSpaceId) ?? null,
    [hoveredSpaceId, renderedPolygons],
  )

  if (!rootImageUrl || spacesWithPosition.length === 0) {
    return <p className="m-0 text-slate-500">배치도 기반 공간 위치 데이터가 없습니다.</p>
  }

  return (
    <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-1">
      <img
        ref={imageRef}
        src={rootImageUrl}
        alt="공간 위치 배치도"
        className="block h-auto w-full rounded object-contain"
        onLoad={updateMetrics}
      />
      {imageMetrics && (
        <svg
          className="absolute left-1 top-1 pointer-events-auto"
          width={imageMetrics.renderedWidth}
          height={imageMetrics.renderedHeight}
          viewBox={`0 0 ${imageMetrics.renderedWidth} ${imageMetrics.renderedHeight}`}
          aria-label="공간 위치 오버레이"
        >
          {renderedPolygons.map((polygon) => (
            <polygon
              key={polygon.id}
              points={polygon.points}
              fill={polygon.active ? 'rgba(59, 130, 246, 0.32)' : 'rgba(14, 165, 233, 0.16)'}
              stroke={polygon.active ? 'rgba(29, 78, 216, 0.95)' : 'rgba(2, 132, 199, 0.85)'}
              strokeWidth={polygon.active ? 2.2 : 1.6}
              onMouseEnter={() => setHoveredSpaceId(polygon.id)}
              onMouseLeave={() => setHoveredSpaceId((current) => (current === polygon.id ? null : current))}
              onClick={() => onSelectSpace(polygon.id)}
            >
              <title>{polygon.name}</title>
            </polygon>
          ))}
        </svg>
      )}
      {imageMetrics && hoveredPolygon && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-slate-900/90 px-2 py-1 text-[11px] font-medium text-white shadow-sm"
          style={{
            left: `calc(4px + ${hoveredPolygon.centroidX}px)`,
            top: `calc(4px + ${hoveredPolygon.centroidY}px)`,
            transform: 'translate(-50%, calc(-100% - 8px))',
            whiteSpace: 'nowrap',
          }}
        >
          {hoveredPolygon.name}
        </div>
      )}
    </div>
  )
}
