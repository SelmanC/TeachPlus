import { LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, WORKSPACE_CHANGED, WORKSPACE_CHECK, WORKSPACE_CHECK_SUCCESS, WORKSPACE_CHECK_FAIL, CURR_USER_UPDATED } from '../actions/types';

const INITIAL_STATE = {
    showSpinner: false,
    workSpace: {
        name: '',
        id: null
    },
    error: '',
    user: {},
    groups: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case WORKSPACE_CHANGED:
            return { ...state, workSpace: { ...state.workSpace, name: action.payload } };
        case WORKSPACE_CHECK:
            return { ...state, showSpinner: true, error: '' };
        case WORKSPACE_CHECK_SUCCESS:
            return { ...state, showSpinner: false, workSpace: action.payload };
        case WORKSPACE_CHECK_FAIL:
            return { ...state, showSpinner: false, error: action.payload };
        case LOGIN:
            return { ...state, showSpinner: true, error: '' };
        case LOGIN_SUCCESS:
            return { ...state, showSpinner: false, ...action.payload };
        case CURR_USER_UPDATED:
            return { ...state, user: { ...action.payload } };
        case LOGIN_FAIL:
            return { ...state, showSpinner: false, error: action.payload };
        default:
            return state;
    }
};
