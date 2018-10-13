import React, { Component } from 'react';
import { Image, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements';
import { InputField } from './components';
import { checkWorkSpace, workspaceChanged } from './actions';
import { GlobalStyles } from './styles';

class WorkspaceForm extends Component {
    onWorkspaceChanged(workSpace) {
        this.props.workspaceChanged(workSpace);
    }

    onButtonPressed() {
        this.props.checkWorkSpace(this.props.workSpace.name, this.props.navigation);
    }

    render() {
        return (
            <View style={styles.viewStyle} >
                {
                    this.props.showSpinner &&
                    <View style={GlobalStyles.loadingContainerStyle}>
                        <ActivityIndicator size="large" />
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '300' }}>Überpüft</Text>
                    </View>
                }
                <Card>
                    <Image
                        resizeMode="cover"
                        source={require('../assets/images/TeachPlus_Logo.png')}
                        style={styles.imageStyle}
                    />
                    <InputField
                        Name="Workspace"
                        onChangeText={this.onWorkspaceChanged.bind(this)}
                        value={this.props.workSpace.name} 
                        error={this.props.error} />
                    <Button
                        title='Weiter'
                        rounded
                        style={{ marginTop: 10 }}
                        backgroundColor='#00235b'
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
        workSpace: state.auth.workSpace,
        error: state.auth.error
    };
};

export default connect(mapStateToProps, {
    workspaceChanged,
    checkWorkSpace
})(WorkspaceForm);

