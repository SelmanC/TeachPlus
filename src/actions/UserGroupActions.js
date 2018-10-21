/* global fetch:false */
import { getMethod, postMethod, deleteMethod } from './FetchAPI';
import {
    RETRIEVE_DATA,
    ERROR_RETRIEVED,
    USERS_RETRIEVED,
    NEW_USERDATA,
    GROUPS_RETRIEVED,
    NEW_GROUPDATA,
    SINGLE_GROUP_RETRIEVED,
    CLOSE_MODAL,
    CHILDREN_RETRIEVED,
    USER_SELECTED,
    TEACHERS_RETRIEVED
} from './types';

export const closeModal = () => {
    return {
        type: CLOSE_MODAL
    };
};

// BEGIN: User
export const userSelected = (user) => {
    return {
        type: USER_SELECTED,
        payload: user
    };
};

export const retriveAllUsers = () => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            'users',
            'Fehler beim Abrufen der Benutzer',
            data => dispatch({ type: USERS_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};


export const retriveChildren = (userId) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `users/${userId}/children`,
            'Fehler beim Abrufen der Kinder',
            data => dispatch({ type: CHILDREN_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const retriveTeacher = () => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            'users/teachers',
            'Fehler beim Abrufen der Lehrer',
            data => dispatch({ type: TEACHERS_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addUser = (user, userData) => {
    return (dispatch) => {
        postMethod(
            'users',
            'Fehler beim Speichern des Benutzers',
            data => {
                if (user.role === 'parent') {
                    postMethod(
                        `users/${user.id ? user.id : data.id}/children`,
                        'Fehler beim Speichern der Kinder',
                        () => onUserSave(user, data, userData, dispatch),
                        error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
                        user.children);
                } else {
                    onUserSave(user, data, userData, dispatch);
                }
            },
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            user);
    };
};

export const deleteUser = (user, userData) => {
    return (dispatch) => {
        deleteMethod(
            `vertretung/${user.id}`,
            'Fehler beim Löschen des Vertreungsplans',
            () => {
                const noteIndex = userData.findIndex(e => e.id === user.id);
                userData.splice(noteIndex, 1);
                dispatch({ type: NEW_USERDATA, payload: userData });
            },
            error => {
                dispatch({ type: ERROR_RETRIEVED, payload: error.message });
            });
    };
};

// BEGIN: Group
export const retriveAllGroups = () => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            'groups',
            'Fehler beim Abrufen der Gruppen',
            data => dispatch({ type: GROUPS_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const retrieveGroup = (groupId) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `groups/${groupId}`,
            'Fehler beim Abrufen der Gruppe',
            data => dispatch({ type: SINGLE_GROUP_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addGroup = (group, groupData) => {
    return (dispatch) => {
        postMethod(
            'groups',
            'Fehler beim Speichern der Gruppe',
            data => {
                onGroupSave(group, data, groupData, dispatch);
                postMethod(
                    `groups/${group.id ? group.id : data.id}/members`,
                    'Fehler beim Speichern der Gruppenmitglieder',
                    memberData => onGroupMemberSaved(group, memberData, groupData, dispatch),
                    error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
                    group.groupOwner);
            },
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            group);
    };
};

export const deleteGroup = (group, groupData) => {
    return (dispatch) => {
        deleteMethod(
            `groups/${group.id}`,
            'Fehler beim Löschen des Vertreungsplans',
            () => {
                const noteIndex = groupData.findIndex(e => e.id === group.id);
                groupData.splice(noteIndex, 1);
                dispatch({ type: NEW_GROUPDATA, payload: groupData });
            },
            error => {
                dispatch({ type: ERROR_RETRIEVED, payload: error.message });
            });
    };
};

//Helpferfunctions

function onUserSave(user, savedUser, userData, dispatch) {
    savedUser.children = user.children;
    if (user.id) {
        const noteIndex = userData.findIndex(e => e.id === user.id);
        userData[noteIndex] = savedUser;
    } else {
        userData.push(savedUser);
    }
    dispatch({ type: NEW_USERDATA, payload: userData });
}

function onGroupSave(group, savedGroup, groupData, dispatch) {
    if (group.id) {
        const groupIndex = groupData.findIndex(e => e.id === group.id);
        groupData[groupIndex] = savedGroup;
    } else {
        groupData.push(savedGroup);
    }
    dispatch({ type: NEW_GROUPDATA, payload: groupData });
}

function onGroupMemberSaved(group, savedGroupMember, groupData, dispatch) {
    const groupIndex = groupData.findIndex(e => e.id === group.id);
    groupData[groupIndex].groupOwner = savedGroupMember;
    dispatch({ type: NEW_GROUPDATA, payload: groupData });
}

