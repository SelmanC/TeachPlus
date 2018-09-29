import React from 'react';
import { SearchBar } from 'react-native-elements';

export const SearchTextInput = ({ onChangeText, onClearText }) => {
    return (
        <SearchBar
            clearIcon={null}
            searchIcon={{ color: 'white' }}
            placeholder='Suchen...'
            containerStyle={{ backgroundColor: '#4C3E54' }}
            inputStyle={{ backgroundColor: '#4C3E54', color: 'white' }}
            placeholderTextColor='white'
            onChangeText={(text) => { onChangeText(text); }}
            onClearText={() => { onClearText(); }} />
    );
};
