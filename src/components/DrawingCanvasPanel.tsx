import { useEffect, useMemo, useRef, useState } from 'react'
import type { OverlayLayer } from '../types/drawing'
import { getOverlayTransform } from '../utils/drawing'

type DrawingCanvasPanelProps = {
  spaceName: string | null
  disciplineName: string | null
  regionName: string | null
  revisionVersion: string | null
  baseImageName: string | null
  baseImageUrl: string | null
  overlayLayers: OverlayLayer[]
  hideBaseImage: boolean
}

export function DrawingCanvasPanel({
  spaceName,
  disciplineName,
  regionName,
  revisionVersion,
  baseImageName,
  baseImageUrl,
  overlayLayers,
  hideBaseImage,
}: DrawingCanvasPanelProps) {
  const baseImageRef = useRef<HTMLImageElement | null>(null)
  const [baseMetrics, setBaseMetrics] = useState<{
    naturalWidth: number
    naturalHeight: number
    renderedWidth: number
    renderedHeight: number
  } | null>(null)

  function updateBaseMetrics() {
    const imageElement = baseImageRef.current
    if (!imageElement || !imageElement.naturalWidth || !imageElement.naturalHeight) return

    const rect = imageElement.getBoundingClientRect()
    setBaseMetrics({
      naturalWidth: imageElement.naturalWidth,
      naturalHeight: imageElement.naturalHeight,
      renderedWidth: rect.width,
      renderedHeight: rect.height,
    })
  }

  useEffect(() => {
    const imageElement = baseImageRef.current
    if (!imageElement) return

    const observer = new ResizeObserver(() => {
      updateBaseMetrics()
    })
    observer.observe(imageElement)
    return () => {
      observer.disconnect()
    }
  }, [baseImageUrl])

  const renderedOverlayLayers = useMemo(
    () =>
      overlayLayers.map((overlay) => ({
        ...overlay,
        computedTransform:
          overlay.imageTransform && baseMetrics
            ? getOverlayTransform(overlay.imageTransform, {
                baseNaturalWidth: baseMetrics.naturalWidth,
                baseNaturalHeight: baseMetrics.naturalHeight,
                baseRenderedWidth: baseMetrics.renderedWidth,
                baseRenderedHeight: baseMetrics.renderedHeight,
              })
            : overlay.transform,
      })),
    [baseMetrics, overlayLayers],
  )

  return (
    <main className="grid min-h-0 grid-rows-[auto_1fr_auto] overflow-auto rounded-[10px] border border-slate-200 bg-white p-3.5 shadow-sm">
      <div>
        <h2 className="m-0 text-lg font-semibold">{spaceName ?? '공간 미선택'}</h2>
        <p className="my-1 mb-2.5 text-slate-600">
          {disciplineName ?? '-'} / {regionName ? `Region ${regionName}` : '전체'} / {revisionVersion ?? '-'}
        </p>
      </div>

      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
        {baseImageUrl ? (
          <>
            <img
              ref={baseImageRef}
              className="relative z-[1] max-h-full max-w-full object-contain"
              src={baseImageUrl}
              alt={baseImageName ?? '기준 도면'}
              onLoad={updateBaseMetrics}
              style={hideBaseImage ? { opacity: 0 } : undefined}
            />
            {renderedOverlayLayers.map((overlay) => (
              <img
                key={`${overlay.disciplineName}-${overlay.imageUrl}`}
                className="pointer-events-none absolute inset-0 z-[2] m-auto max-h-full max-w-full object-contain"
                src={overlay.imageUrl}
                alt={`${overlay.disciplineName} 오버레이`}
                style={{
                  transform: overlay.computedTransform,
                  transformOrigin: 'center center',
                  opacity: overlay.opacity ?? 0.45,
                  mixBlendMode: overlay.blendMode ?? 'multiply',
                }}
              />
            ))}
          </>
        ) : (
          <div className="text-sm text-slate-500">선택한 조건에 표시할 도면이 없습니다.</div>
        )}
      </div>

      <div className="mt-2.5 flex justify-between text-xs text-slate-500">
        <span>기준 도면: {baseImageName ?? '-'}</span>
        <span>오버레이 수: {overlayLayers.length}</span>
      </div>
    </main>
  )
}
