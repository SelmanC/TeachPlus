import { LocaleConfig } from 'react-native-calendars';

const LocaleConfigDE = {
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthNamesShort: ['Jan.', 'Febr.', 'März', 'April', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
    dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    dayNamesShort: ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.']
};

const setLocaleConfig = () => {
    LocaleConfig.locales['de'] = LocaleConfigDE;
    LocaleConfig.defaultLocale = 'de';
};

const months = [
    { label: 'Januar', key: 1 },
    { label: 'Februar', key: 2 },
    { label: 'März', key: 3 },
    { label: 'April', key: 4 },
    { label: 'Mai', key: 5 },
    { label: 'Juni', key: 6 },
    { label: 'Juli', key: 7 },
    { label: 'August', key: 8 },
    { label: 'Sepember', key: 9 },
    { label: 'Oktober', key: 10 },
    { label: 'November', key: 11 },
    { label: 'Dezember', key: 12 },
];

export { months, setLocaleConfig, LocaleConfigDE };

const courses = [
    '/',
    'Deutsch',
    'Französisch',
    'Englisch',
    'Mathe',
    'Sport',
    'Pause'
];

export { courses };

export const UserRoles = [
    { name: 'Administrator', value: 'admin', id: 1 },
    { name: 'Lehrer', value: 'teacher', id: 2 },
    { name: 'Schüler', value: 'student', id: 3 },
    { name: 'Eltern', value: 'parent', id: 4 },
    { name: 'Gruppe', value: 'group', id: 5 }
];
