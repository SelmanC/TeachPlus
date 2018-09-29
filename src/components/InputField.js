import React, { Component } from 'react';
import { View } from 'react-native';
import {
    FormLabel,
    FormInput,
    FormValidationMessage
} from 'react-native-elements';

class InputField extends Component {
    showValidationMessage() {
        if (this.props.error) {
            return <FormValidationMessage>{this.props.error}</FormValidationMessage>;
        }
    }

    render() {
        const { Name, onChangeText, style, value } = this.props;

        return (
            <View >
                <FormLabel>{Name}</FormLabel>
                <FormInput onChangeText={onChangeText} containerStyle={style} value={value} />
                {this.showValidationMessage()}
            </View>
        );
    }
}

export { InputField }; 
