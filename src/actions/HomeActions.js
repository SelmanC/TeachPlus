/* global fetch:false */
import { getMethod, postMethod, deleteMethod } from './FetchAPI';
import { RETRIEVE_DATA, VERTRETUNGSPLAN_RETRIEVED, ERROR_RETRIEVED, NEW_VERTRETUNGSDATA, NOTES_RETRIEVED, NEW_NOTESDATA } from './types';
import { createDataString, isSameDay } from '../other';


// BEGIN: Vertretungsplan
export const retrieveVertretungsplan = (groupIds) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `vertretung?${getGroupIdParam(groupIds)}`,
            'Fehler beim Abrufen der Vertreungsplans',
            data => dispatch({ type: VERTRETUNGSPLAN_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addVertretungsplan = (vertretungsplan, newVertretungsplan, vertretungsplanList) => {
    return (dispatch) => {
        postMethod(
            'vertretung',
            'Fehler beim Speichern des Vertreungsplans',
            data => onVertretungSave(vertretungsplan, data, vertretungsplanList, dispatch),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            newVertretungsplan);
    };
};

export const deleteVertretungsplan = (vertretungsplan, vertretungsplanList) => {
    return (dispatch) => {
        deleteMethod(
            `vertretung/${vertretungsplan.id}`,
            'Fehler beim Löschen des Vertreungsplans',
            () => {
                const newVertretungsData = deleteFromVertretungsData(vertretungsplanList, vertretungsplan);
                dispatch({ type: NEW_VERTRETUNGSDATA, payload: newVertretungsData });
            },
            error => {
                dispatch({ type: ERROR_RETRIEVED, payload: error.message });
            });
    };
};

// BEGIN: Notes

export const retrieveNotes = (userId) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `notes?ownerId=${userId}`,
            'Fehler beim Abrufen der Notizen',
            data => dispatch({ type: NOTES_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addNotes = (note, notesData, user) => {
    note.owner = user;
    return (dispatch) => {
        postMethod(
            'notes',
            'Fehler beim Speichern der Notiz',
            data => onNoteSaved(note, data, notesData, dispatch),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            note);
    };
};

export const deleteNotes = (note, notesData) => {
    return (dispatch) => {
        deleteMethod(
            `notes/${note.id}`,
            'Fehler beim Löschen des Vertreungsplans',
            () => {
                const noteIndex = notesData.findIndex(e => e.id === note.id);
                notesData.splice(noteIndex, 1);
                dispatch({ type: NEW_NOTESDATA, payload: notesData });
            },
            error => {
                dispatch({ type: ERROR_RETRIEVED, payload: error.message });
            });
    };
};

function getGroupIdParam(groupIdArr) {
    let groupIds = '';
    for (let i = 0; i < groupIdArr.length; i++) {
        if (i !== 0) groupIds += '&';
        groupIds += `groupId=${groupIdArr[i]}`;
    }
    return groupIds;
}

function onVertretungSave(vertretungsplan, savedVertretungsplan, vertetungsData, dispatch) {
    savedVertretungsplan.date = new Date(savedVertretungsplan.date);
    if (vertretungsplan.id && !isSameDay(vertretungsplan.date, savedVertretungsplan.date)) {
        vertetungsData = deleteFromVertretungsData(vertetungsData, vertretungsplan);
    }

    const dateString = createDataString(
        savedVertretungsplan.date.getDate(),
        savedVertretungsplan.date.getMonth() + 1,
        savedVertretungsplan.date.getFullYear()
    );

    if (!vertetungsData[dateString]) {
        vertetungsData[dateString] = {
            [savedVertretungsplan.groupClass.name]: [
                { ...savedVertretungsplan }
            ]
        };
    } else if (!vertetungsData[dateString][savedVertretungsplan.groupClass.name]) {
        vertetungsData[dateString][savedVertretungsplan.groupClass.name] = savedVertretungsplan;
    } else if (!vertretungsplan.id || !isSameDay(vertretungsplan.date, savedVertretungsplan.date)) {
        vertetungsData[dateString][vertretungsplan.groupClass.name].push(savedVertretungsplan);
    } else {
        const itemIndex = vertetungsData[dateString][vertretungsplan.groupClass.name].findIndex(c => c.id === vertretungsplan.id);
        vertetungsData[dateString][vertretungsplan.groupClass.name][itemIndex] = savedVertretungsplan;
    }

    dispatch({ type: NEW_VERTRETUNGSDATA, payload: vertetungsData });
}

function deleteFromVertretungsData(vertetungsData, vertretungsplan) {
    const dateString = createDataString(
        vertretungsplan.date.getDate(),
        vertretungsplan.date.getMonth() + 1,
        vertretungsplan.date.getFullYear()
    );
    const classIndex = vertetungsData[dateString][vertretungsplan.groupClass.name].findIndex(c => c.id === vertretungsplan.id);
    vertetungsData[dateString][vertretungsplan.groupClass.name].splice(classIndex, 1);
    if (vertetungsData[dateString][vertretungsplan.groupClass.name].length <= 0) {
        delete vertetungsData[dateString][vertretungsplan.groupClass.name];
        if (Object.keys(vertetungsData[dateString]).length <= 0) {
            delete vertetungsData[dateString];
        }
    }

    return vertetungsData;
}


function onNoteSaved(oldNote, savedNote, notesData, dispatch) {
    if (oldNote.id) {
        const noteIndex = notesData.findIndex(e => e.id === oldNote.id);
        notesData[noteIndex] = savedNote;
    } else {
        notesData.push(savedNote);
    }
    dispatch({ type: NEW_NOTESDATA, payload: notesData });
}
