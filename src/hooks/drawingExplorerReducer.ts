export type ExplorerSelectionState = {
  selectedSpaceId: string | null
  selectedDisciplineName: string | null
  selectedRegionName: string | null
  selectedRevisionVersion: string | null
  overlayDisciplines: string[]
}

export type ExplorerAction =
  | { type: 'SPACE_SELECTED'; spaceId: string }
  | { type: 'DISCIPLINE_SELECTED'; disciplineName: string }
  | { type: 'REGION_SELECTED'; regionName: string }
  | { type: 'REVISION_SELECTED'; version: string }
  | { type: 'OVERLAY_TOGGLED'; disciplineName: string }

export const initialExplorerSelectionState: ExplorerSelectionState = {
  selectedSpaceId: null,
  selectedDisciplineName: null,
  selectedRegionName: null,
  selectedRevisionVersion: null,
  overlayDisciplines: [],
}

export function explorerReducer(state: ExplorerSelectionState, action: ExplorerAction): ExplorerSelectionState {
  switch (action.type) {
    case 'SPACE_SELECTED':
      return {
        selectedSpaceId: action.spaceId,
        selectedDisciplineName: null,
        selectedRegionName: null,
        selectedRevisionVersion: null,
        overlayDisciplines: [],
      }
    case 'DISCIPLINE_SELECTED':
      return {
        ...state,
        selectedDisciplineName: action.disciplineName,
        selectedRegionName: null,
        selectedRevisionVersion: null,
        overlayDisciplines: [],
      }
    case 'REGION_SELECTED':
      return {
        ...state,
        selectedRegionName: action.regionName,
        selectedRevisionVersion: null,
      }
    case 'REVISION_SELECTED':
      return {
        ...state,
        selectedRevisionVersion: action.version,
      }
    case 'OVERLAY_TOGGLED':
      return {
        ...state,
        overlayDisciplines: state.overlayDisciplines.includes(action.disciplineName)
          ? state.overlayDisciplines.filter((name) => name !== action.disciplineName)
          : [...state.overlayDisciplines, action.disciplineName],
      }
    default:
      return state
  }
}
