import {
    ABSENCELIST_RETRIEVED,
    RETRIEVE_DATA,
    ERROR_RETRIEVED,
    ABSENCELIST_SELECTED,
    ALL_ABSENCES_RETRIEVED,
    NEW_ABSENCELIST,
    NEW_ABSENCEDATA,
    ERROR_SHOWN
} from './types';
import { getMethod, postMethod } from './FetchAPI';

const absenceListSelected = (absenceList) => {
    return {
        type: ABSENCELIST_SELECTED,
        payload: absenceList
    };
};

export const removeError = () => {
    return {
        type: ERROR_SHOWN
    };
};

export const retrieveAllAbsenceLists = (userId) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `absences/teacher/${userId}`,
            'Fehler beim Abrufen der Anwesenheitslisten',
            data => dispatch({ type: ALL_ABSENCES_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addAbsenceList = (currUser, absenceList, absenceData) => {
    return (dispatch) => {
        postMethod(
            'absences',
            'Fehler beim Speichern des Vertreungsplans',
            data => {
                if (!absenceList.id) {
                    postMethod(
                        `absences/${data.id}/teacher/${currUser.id}`,
                        'Fehler beim Speichern des Vertreungsplans mit dem Lehrer',
                        () => {
                            data.teacher = [currUser];
                            onAbsenceListSaved(absenceList, data, absenceData, dispatch);
                        },
                        error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
                } else {
                    onAbsenceListSaved(absenceList, data, absenceData, dispatch);
                }
            },
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            absenceList);
    };
};

export const retrieveAbsenceList = (absenceList, selectedDate, daysInMonth, navigation) => {
    return (dispatch) => {
        dispatch(absenceListSelected(absenceList));
        getMethod(
            `absences/${absenceList.id}/data?month=${selectedDate.getMonth() + 1}`,
            'Fehler beim Abrufen der Anwesenheitsliste',
            data => {
                updateTableData(absenceList, data, selectedDate, daysInMonth, dispatch);
                if (navigation) navigation.navigate('AbsenceForm');
            },
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const updateAbsenceData = (absenceList, absenceData, newAbsence, indexStudent, indexDay) => {
    newAbsence.absenceList = absenceList;
    return (dispatch) => {
        postMethod(
            'absences/data',
            'Fehler beim Speichern der Änderung',
            data => updateTableWithNewValue(absenceData, data, indexStudent, indexDay, dispatch),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            newAbsence);
    };
};

function onAbsenceListSaved(absenceList, savedAbsenceList, absenceData, dispatch) {
    if (absenceList.id) {
        const noteIndex = absenceData.findIndex(e => e.id === absenceList.id);
        absenceData[noteIndex] = savedAbsenceList;
    } else {
        absenceData.push(savedAbsenceList);
    }
    dispatch({ type: NEW_ABSENCELIST, payload: absenceData });
}

function updateTableWithNewValue(absenceData, newData, indexStudent, indexDay, dispatch) {
    absenceData[indexStudent][indexDay] = newData;
    dispatch({ type: NEW_ABSENCEDATA, payload: absenceData });
}


function updateTableData(absenceList, tableData, selectedDate, daysInMonth, dispatch) {
    const actualMonth = new Date().getMonth();
    const absence = [];
    const students = absenceList.groupClass.groupOwner.filter(e => e.userMember.role === 'student').map(e => e.userMember);

    for (let i = 0; i < students.length; i++) {
        absence.push([]);

        for (let y = 0; y < daysInMonth; y++) {
            const type = (y < selectedDate.getDate() && selectedDate.getMonth() === actualMonth) || selectedDate.getMonth() < actualMonth ?
                'A' : '/';
            absence[i].push({ type });
        }

        const studentData = tableData.filter(e => e.student.id === students[i].id);
        for (let y = 0; y < studentData.length; y++) {
            absence[i][studentData[y].day - 1] = studentData[y];
        }
    }

    dispatch({ type: ABSENCELIST_RETRIEVED, payload: { absence, students } });
}
