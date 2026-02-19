# 건설 도면 탐색 인터페이스

## 실행 방법
```bash
npm install
npm run dev

http://localhost:5173 으로 접근 가능합니다.

프로젝트 루트 경로에 과제 안내 시 첨부해 주셨던 압축파일을 해제하여 넣어주셔야 합니다.

해당 폴더 구조
timwork
ㄴ data
   ㄴ drawings
      ㄴ imgs...
   ㄴ metadata.json
ㄴ README.md

위 구조로 되어있는 폴더를 프로젝트 루트 경로에 넣어주시면 됩니다.
```

## 기술 스택
- React 19
- TypeScript
- Vite
- Tailwind CSS
- ESLint

## 구현 기능
- 공간/공종/영역(region)/리비전 기반 도면 탐색
- 공간 검색 가능한 드롭다운 UI
- 리비전 최신순 정렬 및 선택
- 비교 오버레이(다른 공종 체크박스)
- 컨텍스트 패널(현재 경로, 리비전 상세, 최신 여부)
- `position.vertices`를 활용한 배치도 상 공간 위치 시각화

## 미완성 기능
- `polygon.vertices` / `polygonTransform` 기반 영역 폴리곤 렌더링
- 공종 오버레이 시 이미지 위치 및 스케일 정확도 개선 작업
