/* global fetch:false */
import { getMethod, postMethod } from './FetchAPI';
import { WORKSPACE_CHANGED, WORKSPACE_CHECK, WORKSPACE_CHECK_SUCCESS, WORKSPACE_CHECK_FAIL, LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from './types';


export const workspaceChanged = (workSpace) => {
    return {
        type: WORKSPACE_CHANGED,
        payload: workSpace
    };
};

export const checkWorkSpace = (workSpace, navigation) => {
    return (dispatch) => {
        if (workSpace) {
            dispatch({ type: WORKSPACE_CHECK });
            getMethod(
                `workspaces?name=${workSpace}`,
                'Workspace existiert nicht',
                data => {
                    dispatch({ type: WORKSPACE_CHECK_SUCCESS, payload: data });
                    navigation.navigate('LoginForm');
                },
                error => dispatch({ type: WORKSPACE_CHECK_FAIL, payload: error.message }));
        } else {
            dispatch({ type: WORKSPACE_CHECK_FAIL, payload: 'Tragen Sie einen Wert ein' });
        }
    };
};


export const loginUser = (email, password, workspaceId, navigation) => {
    return (dispatch) => {
        if (email && password) {
            dispatch({ type: LOGIN });

            postMethod(
                'users/login',
                'Login fehlgeschlagen',
                user => {
                    getMethod(
                        `groups/users/${user.id}`,
                        'Fehler beim Abrufen der Gruppen',
                        groups => {
                            dispatch({ type: LOGIN_SUCCESS, payload: { user, groups } });
                            if (user.role === 'teacher' || user.role === 'admin') {
                                navigation.navigate('MainTeacher');
                            } else if (user.role === 'parent') {
                                navigation.navigate('MainParent');                                
                            } else {
                                navigation.navigate('MainOther');
                            }
                        },
                        error => dispatch({ type: LOGIN_FAIL, payload: error.message }));
                },
                error => dispatch({ type: LOGIN_FAIL, payload: error.message }),
                { email, password, workspace: workspaceId });
        } else {
            dispatch({ type: LOGIN_FAIL, payload: 'Füllen Sie bitte alle Felder aus' });
        }
    };
};
