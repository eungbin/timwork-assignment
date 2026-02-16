import type { OverlayLayer } from '../types/drawing'

type DrawingCanvasPanelProps = {
  spaceName: string | null
  disciplineName: string | null
  regionName: string | null
  revisionVersion: string | null
  baseImageName: string | null
  baseImageUrl: string | null
  overlayLayers: OverlayLayer[]
}

export function DrawingCanvasPanel({
  spaceName,
  disciplineName,
  regionName,
  revisionVersion,
  baseImageName,
  baseImageUrl,
  overlayLayers,
}: DrawingCanvasPanelProps) {
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
            <img className="relative z-[1] max-h-full max-w-full object-contain" src={baseImageUrl} alt={baseImageName ?? '기준 도면'} />
            {overlayLayers.map((overlay) => (
              <img
                key={`${overlay.disciplineName}-${overlay.imageUrl}`}
                className="pointer-events-none absolute inset-0 z-[2] m-auto max-h-full max-w-full object-contain opacity-45 [mix-blend-mode:multiply]"
                src={overlay.imageUrl}
                alt={`${overlay.disciplineName} 오버레이`}
                style={{ transform: overlay.transform, transformOrigin: 'center center' }}
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
