import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { InputField, TextLink } from './components';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Name: '',
            Password: ''
        };
    }

    onNameChange(Name) {
        this.setState({ Name });
    }

    onPasswordChange(Password) {
        this.setState({ Password });
    }

    render() {
        return (
            <View style={styles.viewStyle} >
                <Card>
                    <Image
                        resizeMode="cover"
                        source={require('../assets/images/TeachPlus_Logo.png')}
                        style={styles.imageStyle}
                    />
                    <InputField
                        Name="Email"
                        onChangeText={this.onNameChange.bind(this)}
                        style={styles.inputFieldStyle} 
                        value={this.state.Name} />
                    <InputField
                        Name="Password"
                        onChangeText={this.onNameChange.bind(this)}
                        style={styles.inputFieldStyle} 
                        value={this.state.Password} />
                    <Button
                        title='Login'
                        rounded
                        backgroundColor='#00235b'
                        textStyle={{ fontWeight: 'bold' }}
                        onPress={() => this.props.navigation.navigate('Main')} />
                   { false &&
                        <TextLink
                        onPress={() => {}}
                        title='Password vergessen?' />}
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
    },
    imageStyle: {
        alignSelf: 'center'
    },
    inputFieldStyle: {
        marginBottom: 10
    }
});

export default LoginForm;
