import React, { Component } from 'react';
import { View } from 'react-native';
import { Item, Input, Label, Icon } from 'native-base';


class TextInput extends Component {
    showValidationMessage(error) {
        if (error) {
            return <Icon name='checkmark-circle' />;
        }
    }

    render() {
        const { title, onChangeText } = this.props;

        return (
            <View >
                <Item stackedLabel success={this.props.error} >
                    <Label>{title}</Label>
                    <Input onChangeText={onChangeText} />
                </Item>
                {this.showValidationMessage(this.props.error)}
            </View>
        );
    }
}

export { TextInput }; 
