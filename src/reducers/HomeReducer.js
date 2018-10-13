import {
    ERROR_SHOWN,
    RETRIEVE_DATA,
    VERTRETUNGSPLAN_RETRIEVED,
    ERROR_RETRIEVED,
    NEW_VERTRETUNGSDATA,
    NOTES_RETRIEVED,
    NEW_NOTESDATA,
    USERS_RETRIEVED,
    USER_SELECTED,
    CHILDREN_RETRIEVED,
    NEW_USERDATA,
    GROUPS_RETRIEVED,
    NEW_GROUPDATA,
    SINGLE_GROUP_RETRIEVED,
    CLOSE_MODAL,
    TEACHERS_RETRIEVED,
    ABSENCELIST_SELECTED,
    ABSENCELIST_RETRIEVED,
    ALL_ABSENCES_RETRIEVED,
    NEW_ABSENCELIST,
    NEW_ABSENCEDATA
} from '../actions/types';

const defaultUser = {
    id: null,
    name: '',
    lastname: '',
    email: '',
    age: null,
    strasse: '',
    ort: '',
    land: '',
    role: '',
    children: []
};

const defaultAbsenceList = {
    name: '',
    groupClass: {
        id: null,
        name: ''
    },
    subject: '',
    teacher: [],
    id: null
};

const INITIAL_STATE = {
    showSpinner: false,
    vertretungsplanList: {},
    error: '',
    notesData: [],
    userData: [],
    groupData: [],
    selectedItem: {},
    showModal: false,
    currChildren: [],
    currUser: Object.assign({}, defaultUser),
    teachers: [],
    absenceData: [],
    currAbsenceList: Object.assign({}, defaultAbsenceList),
    currAbsence: [],
    students: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ERROR_RETRIEVED:
            return { ...state, showSpinner: false, error: action.payload };
        case ERROR_SHOWN:
            return { ...state, error: '' };
        case RETRIEVE_DATA:
            return { ...state, error: '', showSpinner: true };
        case VERTRETUNGSPLAN_RETRIEVED:
            return { ...state, vertretungsplanList: { ...action.payload }, showSpinner: false };
        case NEW_VERTRETUNGSDATA:
            return { ...state, vertretungsplanList: { ...action.payload } };
        case NOTES_RETRIEVED:
            return { ...state, notesData: [...action.payload], showSpinner: false };
        case NEW_NOTESDATA:
            return { ...state, notesData: [...action.payload] };
        case USERS_RETRIEVED:
            return { ...state, userData: [...action.payload], showSpinner: false };
        case USER_SELECTED:
            return { ...state, currUser: { ...action.payload } };
        case CHILDREN_RETRIEVED:
            return { ...state, currChildren: [...action.payload], showSpinner: false };
        case TEACHERS_RETRIEVED:
            return { ...state, teachers: [...action.payload] };
        case NEW_USERDATA:
            return { ...state, userData: [...action.payload] };
        case GROUPS_RETRIEVED:
            return { ...state, groupData: [...action.payload], showSpinner: false };
        case CLOSE_MODAL:
            return { ...state, showModal: false };
        case SINGLE_GROUP_RETRIEVED:
            return { ...state, selectedItem: { ...action.payload }, showModal: true, showSpinner: false };
        case NEW_GROUPDATA:
            return { ...state, groupData: [...action.payload] };
        case ABSENCELIST_SELECTED:
            return { ...state, currAbsenceList: { ...action.payload } };
        case ABSENCELIST_RETRIEVED:
            return { ...state, currAbsence: [...action.payload.absence], students: [...action.payload.students], showSpinner: false };
        case NEW_ABSENCEDATA:
            return { ...state, currAbsence: [...action.payload] };
        case ALL_ABSENCES_RETRIEVED:
            return { ...state, absenceData: [...action.payload], showSpinner: false };
        case NEW_ABSENCELIST:
            return { ...state, absenceData: [...action.payload] };
        default:
            return state;
    }
};
