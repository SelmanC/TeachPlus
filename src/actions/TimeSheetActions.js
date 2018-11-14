import {
    TIMESHEET_SELCTED,
    ALL_TIMESHEETS_RETRIEVED,
    NEW_TIMESHEET,
    RETRIEVE_DATA,
    ERROR_RETRIEVED,
    TIMESHEET_DATA_SAVED
} from './types';
import { getMethod, postMethod, deleteMethod } from './FetchAPI';

export const selectTimeSheet = (timeSheet) => {
    return {
        type: TIMESHEET_SELCTED,
        payload: timeSheet
    };
};

export const retrieveAllTimesheets = (groupIds) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `timesheets/?${getGroupIdParam(groupIds)}`,
            'Fehler beim Abrufen der Stundenplaene',
            data => dispatch({ type: ALL_TIMESHEETS_RETRIEVED, payload: data }),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addTimeSheet = (timeSheet, timeSheetList) => {
    return (dispatch) => {
        postMethod(
            'timesheets',
            'Fehler beim Speichern des Stundenplans',
            data => {
                if (timeSheet.id) {
                    copyTimeSheet(data, timeSheetList, timeSheet.timeColumns, dispatch);
                }
                onTimesheetSaved(data, timeSheetList, dispatch);
            },
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            { ...timeSheet, id: null, timeColumns: [] });
    };
};

function copyTimeSheet(timeSheet, timeSheetList, oldColumns, dispatch) {
    const tmpColumns = oldColumns.map(e => {
        return { ...e, id: null, rows: [], timeSheet };
    });

    postMethod(
        'timesheets/data/columns',
        'Fehler beim Kopieren der Columns',
        newColumns => {
            const newRowData = [];
            oldColumns.forEach(e => {
                const currColumn = newColumns.find(d => d.timesheetColumn === e.timesheetColumn);
                e.rows.forEach(r => {
                    newRowData.push({ ...r, id: null, timeColumn: currColumn, subjectData: [] });
                });
            });

            postMethod(
                'timesheets/data/rows',
                'Fehler beim Kopieren der Rows',
                () => {
                    getMethod(
                        `timesheets/${timeSheet.id}`,
                        'Fehler beim Abrufen des Stundenplans',
                        data => {
                            const newSubjectData = [];

                            oldColumns.forEach(e => {
                                const currColumn = data.timeColumns.find(d => e.timesheetColumn === d.timesheetColumn);
                                e.rows.forEach(r => {
                                    const currRow = currColumn.rows.find(d => d.timesheetRow === r.timesheetRow);
                                    r.subjectData.forEach(s => {
                                        newSubjectData.push({ ...s, id: null, timeRow: currRow });
                                    });
                                });
                            });

                            postMethod(
                                'timesheets/data/row/subjects',
                                'Fehler beim Kopieren der Daten',
                                () => onTimeSheetCopied(timeSheet, timeSheetList, dispatch),
                                error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
                                newSubjectData);
                        },
                        error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
                },
                error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
                newRowData);
        },
        error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
        tmpColumns);
}

export const deleteStundenplan = (timeSheet, timeSheetList) => {
    return (dispatch) => {
        deleteMethod(
            `timesheets/${timeSheet.id}`,
            'Fehler beim Löschen des Vertreungsplans',
            () => {
                const index = timeSheetList.findIndex(e => e.id === timeSheet.id);
                timeSheetList.splice(index, 1);
                dispatch({ type: NEW_TIMESHEET, payload: timeSheetList });
            },
            error => {
                dispatch({ type: ERROR_RETRIEVED, payload: error.message });
            });
    };
};

export const addTimeSheetTimeDataColumn = (timeSheet, timeSheetList, newColumn) => {
    newColumn.timeSheet = { ...timeSheet, timeColumns: [] };

    return (dispatch) => {
        postMethod(
            'timesheets/data/column',
            'Fehler beim Speichern des Stundenplans',
            data => onTimeSheetTimeColumnSaved(timeSheet, timeSheetList, data, dispatch),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            newColumn);
    };
};

export const addTimeSheetTimeDataRow = (timeSheet, timeSheetList, column, newRow) => {
    return (dispatch) => {
        if (!column.id) {
            column.timeSheet = { ...timeSheet, timeColumns: [] };
            postMethod(
                'timesheets/data/column',
                'Fehler beim Speichern des Stundenplans',
                dataColumn => {
                    onTimeSheetTimeColumnSaved(timeSheet, timeSheetList, dataColumn, dispatch);
                    newRow.timeColumn = dataColumn;
                    saveDataRow(timeSheet, timeSheetList, newRow, dispatch);
                },
                error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
                column);
        } else {
            newRow.timeColumn = { ...column, rows: [] };
            saveDataRow(timeSheet, timeSheetList, newRow, dispatch);
        }
    };
};

export const deleteStundenplanData = (timeSheet, timeSheetList, column, row, subject) => {
    return (dispatch) => {
        deleteMethod(
            `timesheets/data/row/subjects/${subject.id}`,
            'Fehler beim Löschen des Vertreungsplans',
            () => onTimeSheetDataDeleted(timeSheet, timeSheetList, column, row, subject, dispatch),
            error => {
                dispatch({ type: ERROR_RETRIEVED, payload: error.message });
            });
    };
};

function onTimeSheetCopied(timeSheet, timeSheetList, dispatch) {
    getMethod(
        `timesheets/${timeSheet.id}`,
        'Fehler beim Abrufen des Stundenplans',
        data => {
            const timeSheetIndex = timeSheetList.findIndex(e => e.id === timeSheet.id);
            timeSheetList[timeSheetIndex] = data;

            dispatch({ type: TIMESHEET_DATA_SAVED, payload: { timeSheet: data, timeSheetList } });
        },
        error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
}

function saveDataRow(timeSheet, timeSheetList, newRow, dispatch) {
    postMethod(
        'timesheets/data/row',
        'Fehler beim Speichern des Stundenplans',
        dataRow => {
            onTimeSheetRowSaved(timeSheet, timeSheetList, dataRow, newRow.timeColumn.timesheetColumn, dispatch);
            newRow.subjectData.forEach(e => {
                e.timeRow = dataRow;
            });
            postMethod(
                'timesheets/data/row/subjects',
                'Fehler beim Speichern des Stundenplans',
                dataSubjects => onTimeSheetSubjectSaved(timeSheet, timeSheetList, dataRow, newRow.timeColumn.timesheetColumn, dataSubjects, dispatch),
                error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
                newRow.subjectData);
        },
        error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
        newRow);
}

function getGroupIdParam(groupIdArr) {
    let groupIds = '';
    for (let i = 0; i < groupIdArr.length; i++) {
        if (i !== 0) groupIds += '&';
        groupIds += `groupId=${groupIdArr[i]}`;
    }
    return groupIds;
}

function onTimesheetSaved(timeSheet, timeSheetList, dispatch) {
    timeSheetList.push(timeSheet);
    dispatch({ type: NEW_TIMESHEET, payload: timeSheetList });
}

function onTimeSheetTimeColumnSaved(timeSheet, timeSheetList, newColumn, dispatch) {
    if (!newColumn.rows) newColumn.rows = [];

    const columnIndex = timeSheet.timeColumns.findIndex(e => e.timesheetColumn === newColumn.timesheetColumn);

    if (columnIndex < 0) {
        timeSheet.timeColumns.push(newColumn);
    } else {
        timeSheet.timeColumns[columnIndex] = newColumn;
    }

    const timeSheetIndex = timeSheetList.findIndex(e => e.id === timeSheet.id);
    timeSheetList[timeSheetIndex] = timeSheet;

    dispatch({ type: TIMESHEET_DATA_SAVED, payload: { timeSheet, timeSheetList } });
}

function onTimeSheetRowSaved(timeSheet, timeSheetList, newRow, timesheetColumn, dispatch) {
    const columnIndex = timeSheet.timeColumns.findIndex(e => e.timesheetColumn === timesheetColumn);
    const rowIndex = timeSheet.timeColumns[columnIndex].rows.findIndex(e => e.timesheetRow === newRow.timesheetRow);

    if (rowIndex < 0) {
        timeSheet.timeColumns[columnIndex].rows.push(newRow);
    } else {
        timeSheet.timeColumns[columnIndex].rows[rowIndex] = newRow;
    }

    const timeSheetIndex = timeSheetList.findIndex(e => e.id === timeSheet.id);
    timeSheetList[timeSheetIndex] = timeSheet;

    dispatch({ type: TIMESHEET_DATA_SAVED, payload: { timeSheet, timeSheetList } });
}

function onTimeSheetSubjectSaved(timeSheet, timeSheetList, row, timesheetColumn, subjectData, dispatch) {
    const columnIndex = timeSheet.timeColumns.findIndex(e => e.timesheetColumn === timesheetColumn);
    const rowIndex = timeSheet.timeColumns[columnIndex].rows.findIndex(e => e.timesheetRow === row.timesheetRow);
    timeSheet.timeColumns[columnIndex].rows[rowIndex].subjectData = subjectData;

    const timeSheetIndex = timeSheetList.findIndex(e => e.id === timeSheet.id);
    timeSheetList[timeSheetIndex] = timeSheet;
    dispatch({ type: TIMESHEET_DATA_SAVED, payload: { timeSheet, timeSheetList } });
}

function onTimeSheetDataDeleted(timeSheet, timeSheetList, column, row, subjectData, dispatch) {
    const columnIndex = timeSheet.timeColumns.findIndex(e => e.timesheetColumn === column.timesheetColumn);
    const rowIndex = timeSheet.timeColumns[columnIndex].rows.findIndex(e => e.timesheetRow === row.timesheetRow);
    const subjectIndex = timeSheet.timeColumns[columnIndex].rows[rowIndex].subjectData.findIndex(e => e.id === subjectData.id);

    timeSheet.timeColumns[columnIndex].rows[rowIndex].subjectData.splice(subjectIndex, 1);

    const timeSheetIndex = timeSheetList.findIndex(e => e.id === timeSheet.id);
    timeSheetList[timeSheetIndex] = timeSheet;

    dispatch({ type: TIMESHEET_DATA_SAVED, payload: { timeSheet, timeSheetList } });
}
