import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const TextLink = ({ onPress, title }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            hitSlop={{ top: 5, bottom: 5, left: 15, right: 15 }}
            style={{ marginTop: 10 }}
        >
            <Text style={styles.textStyle}>
                    {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textStyle: { 
        alignSelf: 'center',
        color: 'blue'
    }
});

export { TextLink };
