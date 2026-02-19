import type { Revision } from '../types/drawing'

type ContextPanelProps = {
  rootDrawingName: string
  selectedSpaceName: string | null
  selectedDisciplineName: string | null
  selectedRegionName: string | null
  selectedRevision: Revision | null
  latestRevision: Revision | null
}

export function ContextPanel({
  rootDrawingName,
  selectedSpaceName,
  selectedDisciplineName,
  selectedRegionName,
  selectedRevision,
  latestRevision,
}: ContextPanelProps) {
  return (
    <aside className="overflow-auto rounded-[10px] border border-slate-200 bg-white p-3.5 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">컨텍스트</h2>

      <section className="mb-4.5">
        <h3 className="mb-2 text-sm font-semibold">현재 경로</h3>
        <p>
          {rootDrawingName} {'>'} {selectedSpaceName ?? '-'} {'>'} {selectedDisciplineName ?? '-'} {'>'}{' '}
          {selectedRegionName ? `Region ${selectedRegionName} > ` : ''}
          {selectedRevision?.version ?? '-'}
        </p>
      </section>

      <section className="mb-4.5">
        <h3 className="mb-2 text-sm font-semibold">리비전 상세</h3>
        {selectedRevision ? (
          <div>
            <p className="my-1.5 text-sm">
              <strong>발행일:</strong> {selectedRevision.date}
            </p>
            <p className="my-1.5 text-sm">
              <strong>설명:</strong> {selectedRevision.description}
            </p>
            <p className="my-1.5 text-sm">
              <strong>최신 여부:</strong>{' '}
              {latestRevision?.version === selectedRevision.version ? '최신 리비전' : `최신은 ${latestRevision?.version}`}
            </p>
            <div>
              <strong>변경점</strong>
              {selectedRevision.changes.length === 0 ? (
                <p className="m-0 text-slate-500">초기 설계(변경 내역 없음)</p>
              ) : (
                <ul className="mt-1 pl-[18px]">
                  {selectedRevision.changes.map((change) => (
                    <li key={change} className="mb-1">
                      {change}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="m-0 text-slate-500">리비전 정보가 없습니다.</p>
        )}
      </section>

    </aside>
  )
}
