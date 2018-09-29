import NAME_CHANGED from '../types';

export const nameChanged = (Name) => {
    return {
        type: NAME_CHANGED,
        payload: Name
    };
};
