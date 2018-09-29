import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { InputField } from './components';

class WorkspaceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workSpace: ''
        };
    }

    onWorkspaceChanged(workSpace) {
        this.setState({ workSpace });
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
                        Name="Workspace"
                        onChangeText={this.onWorkspaceChanged.bind(this)}
                        style={styles.inputFieldStyle} 
                        value={this.state.workSpace} />
                    <Button 
                        title='Weiter' 
                        rounded
                        backgroundColor='#00235b'
                        textStyle={{ fontWeight: 'bold' }}
                        onPress={() => this.props.navigation.navigate('LoginForm')} />
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

export default WorkspaceForm;

