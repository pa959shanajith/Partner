import APPCONFIG from 'constants/appConfig';
import * as types from '../constants/actionTypes';

const initialSettings = APPCONFIG.settings;

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case types.CHANGE_LAYOUT:
      return {
        ...state,
        layout: action.layoutOption
      };
    case types.TOGGLE_BOXED_LAYOUT:
      return {
        ...state,
        boxedLayout: action.isBoxedLayout
      };
    case types.TOGGLE_FIXED_SIDENAV:
      return {
        ...state,
        fixedSidenav: action.isFixedSidenav
      };
    case types.TOGGLE_FIXED_HEADER:
      return {
        ...state,
        fixedHeader: action.isFixedHeader
      };
    case types.TOGGLE_COLLAPSED_NAV:
      return {
        ...state,
        collapsedNav: action.isCollapsedNav
      };
    case types.TOGGLE_OFFCANVAS_NAV:
      return {
        ...state,
        offCanvasNav: action.isOffCanvasNav
      };
    case types.CHANGE_SIDENAV_WIDTH:
      return {
        ...state,
        sidenavWidth: action.sidenavWidth
      };
    case types.TOGGLE_OFFCANVAS_MOBILE_NAV:
      return {
        ...state,
        offCanvasMobileNav: action.isOffCanvasMobileNav
      };
    case types.CHANGE_COLOR_OPTION:
      return {
        ...state,
        colorOption: action.colorOption
      };
    case types.MULTIPLE_FILES:
      return {
        ...state,
        listOfFiles: action.listOfFiles
      };
    case types.CLEAR_MULTIPLE_FILES:
      return {
        ...state,
        listOfFiles: []
      };
    case types.BUTTON_VALUE:
      return {
        ...state,
        value: action.value
      };
    case types.TABLE_FILELIST:
      return {
        ...state,
        tablefiles: action.tablefiles
      };
    case types.UPDATE_FILE_STATUS:
      return {
        ...state,
        tablefiles: state.tablefiles.map((item, index) => {
          if (item.name === action.fileObj.name && item.status !== action.fileObj.status) {
            return Object.assign({}, item, {
              status: action.fileObj.status
            })
          }
          return item;
        })
      }
    case types.FILE_LIST:
      return {
        ...state,
        filelist: action.filelist
      };

    default:
      return state;
  }
}

export default settings;
