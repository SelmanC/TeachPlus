export const getStringFromArray = (arr, type, seperator) => {
    let newString = '';
    for (let i = 0; i < arr.length; i++) {
        if (i !== 0) newString += `${seperator} `;
        newString += arr[i][type];
    }
    return newString;
};

export const getDifferentStringsFromArray = (arr, type, seperator) => {
    let newString = '';
    
    for (let i = 0; i < arr.length; i++) {
        if (i !== 0) newString += `${seperator} `;
        for (let y = 0; y < type.length; y++) {
            newString += `${arr[i][type[y]]} `;
        }
    }
    return newString;
};

