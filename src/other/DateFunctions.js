import { LocaleConfigDE } from './localconfig';

export const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getDateObjectByMonth = (month) => {
    const currDate = new Date();
    return new Date(
        new Date().getFullYear(),
        month,
        currDate.getMonth() === month ? currDate.getDate() : 1
    );
};

export const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export const timeToString = (date) => {
    return date.toISOString().split('T')[0];
};

export const compareDateYearAndMonth = (date, month, year) => {
    return date && date.getMonth() === month && date.getFullYear() === year;
};

export const createDateStringWithDay = (dateObj) => {
    return `${LocaleConfigDE.dayNames[6 - dateObj.getDay()]}, ${createTerminString(dateObj)}`;
};

export const createTerminString = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dayString = day.toString().length === 1 ? `0${day}` : day;
    const monthString = month.toString().length === 1 ? `0${month}` : month;
    return `${dayString}.${monthString}.${year}`;
};

export const createTimeString = (hour, minute) => {
    const hourString = hour.toString().length === 1 ? `0${hour}` : hour;
    const minuteString = minute.toString().length === 1 ? `0${minute}` : minute;
    return `${hourString}:${minuteString}`;
};

export const createBeginTimeString = (date, defaultTimePerSubject) => {
    const newDate = new Date(date.getTime() - (defaultTimePerSubject * 60000));
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    return createTimeString(hour, minute);
};

export const createEndTimeString = (date, defaultTimePerSubject) => {
    const newDate = new Date(date.getTime() + (defaultTimePerSubject * 60000));
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    return createTimeString(hour, minute);
};

export const createDataString = (day, month, year) => {
    const dayString = day.toString().length === 1 ? `0${day}` : day;
    const monthString = month.toString().length === 1 ? `0${month}` : month;
    return `${year}-${monthString}-${dayString}`;
};

