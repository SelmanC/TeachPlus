/* global fetch:false */

const serverURL = 'http://localhost:8080/';

export const getMethod = (url, errorMessage, successCallback, errorCallback, options) => {
    fetch(`${serverURL}${url}`, options)
        .then(resp => {
            if (!resp.ok) {
                throw Error(errorMessage);
            } else {
                return resp.json();
            }
        })
        .then(data => successCallback(data))
        .catch(error => errorCallback(error));
};

export const deleteMethod = (url, errorMessage, successCallback, errorCallback) => {
    fetch(`${serverURL}${url}`, {
        method: 'delete'
    })
        .then(resp => {
            if (resp && !resp.ok) {
                throw Error(errorMessage);
            } else if (resp) {
                return resp;
            }
        })
        .then(data => successCallback(data))
        .catch(error => errorCallback(error));
};

export const postMethod = (url, errorMessage, successCallback, errorCallback, body) => {
    fetch(`${serverURL}${url}`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;',
        }
    })
        .then(resp => {
            if (!resp.ok) {
                throw Error(errorMessage);
            } else if (resp.headers.map['content-type'].includes('application/json')) {
                return resp.json();
            } else {
                return resp;
            }
        })
        .then(data => successCallback(data))
        .catch(error => errorCallback(error));
};
