import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements';
import { loginUser } from './actions';
import { InputField } from './components';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    onEmailChange(email) {
        this.setState({ email });
    }

    onPasswordChange(password) {
        this.setState({ password });
    }

    onButtonPressed() {
        const { email, password } = this.state;
        this.props.loginUser(email, password, this.props.workSpaceId, this.props.navigation);
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
                        onChangeText={this.onEmailChange.bind(this)}
                        value={this.state.email} />
                        
                    <InputField
                        Name="Password"
                        onChangeText={this.onPasswordChange.bind(this)}
                        value={this.state.password} 
                        error={this.props.error} 
                        secureTextEntry />
                    <Button
                        title='Login'
                        rounded
                        backgroundColor='#00235b'
                        style={{ marginTop: 10 }}
                        textStyle={{ fontWeight: 'bold' }}
                        onPress={this.onButtonPressed.bind(this)} />
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
    }
});

const mapStateToProps = state => {
    return {
        showSpinner: state.auth.showSpinner,
        workSpaceId: state.auth.workSpace.id,
        error: state.auth.error,
        email: state.auth.email,
        password: state.auth.password
    };
};

export default connect(mapStateToProps, { loginUser })(LoginForm);
