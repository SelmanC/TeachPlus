import { getMethod, postMethod } from './FetchAPI';
import {
    RETRIEVE_DATA,
    ERROR_RETRIEVED,
    NEW_MESSAGE_DATA,
    ALL_MESSAGES_RETRIEVED,
    MESSAGE_USER_SELECTED
} from './types';

export const messagesSelected = (msgObj) => {
    return {
        type: MESSAGE_USER_SELECTED,
        payload: msgObj
    };
};

export const retrieveAllMessages = (userId, groupIds) => {
    return (dispatch) => {
        dispatch({ type: RETRIEVE_DATA });
        getMethod(
            `messages?userId=${userId}&${getGroupIdParam(groupIds)}`,
            'Fehler beim Abrufen der Nachrichten',
            data => onMessagesRetrieved(data, userId, dispatch),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }));
    };
};

export const addMessage = (message, messageList, to, from) => {
    const isGroup = to.role === 'group';
    const tmpMessage = { ...message, toUser: isGroup ? null : to, toGroup: isGroup ? to : null, from, user: null };
    return (dispatch) => {
        postMethod(
            'messages',
            'Fehler beim Speichern der Notiz',
            data => onMessageSaved(data, messageList, from, dispatch),
            error => dispatch({ type: ERROR_RETRIEVED, payload: error.message }),
            tmpMessage);
    };
};

function onMessagesRetrieved(messages, userId, dispatch) {
    const newMessageStructure = {};
    messages.forEach(e => {
        const toMessage = e.toUser ? e.toUser : e.toGroup;
        const title = toMessage.id === userId ? e.from.name : toMessage.name;

        if (!newMessageStructure[toMessage.id]) {
            newMessageStructure[toMessage.id] = { to: toMessage, from: e.from, title, messages: [{ ...e, _id: e.id, user: { ...e.from, _id: e.from.id } }] };
        } else {
            newMessageStructure[toMessage.id].messages.unshift({ ...e, _id: e.id, user: { ...e.from, _id: e.from.id } });
        }
    });
    dispatch({ type: ALL_MESSAGES_RETRIEVED, payload: newMessageStructure });
}


function getGroupIdParam(groupIdArr) {
    let groupIds = '';
    for (let i = 0; i < groupIdArr.length; i++) {
        if (i !== 0) groupIds += '&';
        groupIds += `groupId=${groupIdArr[i]}`;
    }
    return groupIds;
}

function onMessageSaved(message, messageList, from, dispatch) {
    const toMessage = message.toUser ? message.toUser : message.toGroup;

    if (!messageList[toMessage.id]) {
        messageList[toMessage.id] = { to: toMessage, title: toMessage.name, messages: [{ ...message, _id: message.id, user: { ...from, _id: from.id } }] };
    } else {
        messageList[toMessage.id].messages.unshift({ ...message, _id: message.id, user: { ...from, _id: from.id } });
    }

    dispatch({ type: NEW_MESSAGE_DATA, payload: messageList });
}
