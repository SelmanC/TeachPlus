import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FormInput } from 'react-native-elements';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Fab, Icon, Form, Item, Input, Label } from 'native-base';
import { SearchTextInput, FilteredList, ListModal } from './components';
import { getDaysInMonth } from './other';
import { retrieveAbsenceList, retrieveAllAbsenceLists, addAbsenceList, removeError, retriveTeacher } from './actions';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const deafultAbsenceList = {
    id: null,
    name: '',
    groupClass: {
        id: null,
        name: ''
    },
    subject: '',
    teacher: []
};

class GroupList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            newAbsenceList: Object.assign({}, deafultAbsenceList),
            isClassChooserModalVisible: false,
            isTeacherChooserModalVisible: false
        };
    }

    componentDidMount() {
        this.props.retriveTeacher();
        this.props.retrieveAllAbsenceLists(this.props.user.id);
    }

    render() {
        if (this.props.error) {
            Alert.alert(
                'Error',
                this.props.error,
                [
                    { text: 'OK', onPress: () => this.props.removeError() },
                ],
                { cancelable: false }
            );
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    <SearchTextInput
                        onChangeText={(text) => this.setState({ searchText: text })}
                        onClearText={() => this.setState({ searchText: '' })} />


                    <ScrollView>
                        <FilteredList
                            renderedItems={this.props.absenceData}
                            onItemPressed={item => {
                                const currDate = new Date();
                                const daysInMonth = getDaysInMonth(currDate.getMonth(), currDate.getFullYear());
                                this.props.retrieveAbsenceList(item, currDate, daysInMonth, this.props.navigation);
                            }}
                            searchText={this.state.searchText} />
                    </ScrollView>
                </View>

                <PopupDialog
                    ref={popupDialog => { this.popupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    height={0.5}
                    dismissOnTouchOutside={false}
                    onDismissed={() => this.setState({
                        newAbsenceList: Object.assign({}, deafultAbsenceList)
                    })}
                >
                    <View style={{ marginTop: 10, marginLeft: 20, flex: 1 }}>

                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Neuer Vertretungsplan</Text>

                        <Form style={{ width: 300, alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
                            <Item floatingLabel>
                                <Label>Name</Label>
                                <Input
                                    value={this.state.newAbsenceList.name}
                                    onChangeText={(value) => this.setState({
                                        newAbsenceList: { ...this.state.newAbsenceList, name: value }
                                    })} />
                            </Item>

                            <Item floatingLabel>
                                <Label>Fach</Label>
                                <Input
                                    value={this.state.newAbsenceList.subject}
                                    onChangeText={(value) => this.setState({
                                        newAbsenceList: { ...this.state.newAbsenceList, subject: value }
                                    })} />
                            </Item>

                            <TouchableOpacity
                                onPress={() => this.setState({ isClassChooserModalVisible: true })} >
                                <FormInput
                                    placeholder='Klasse'
                                    value={this.state.newAbsenceList.groupClass.name}
                                    containerStyle={styles.containerFormInputStyle}
                                    editable={false}
                                    pointerEvents="none"
                                    placeholderTextColor='#828080'
                                    inputStyle={styles.formInputFieldStyle} />
                            </TouchableOpacity>
                        </Form>

                        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20, marginRight: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <TouchableOpacity
                                    onPress={() => this.popupDialog.dismiss()}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                    <Text style={{ fontSize: 16, color: '#FFC107', marginRight: 10 }}>Abbrechen</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.addAbsenceList(this.props.user, this.state.newAbsenceList, this.props.absenceData);
                                        this.popupDialog.dismiss();
                                    }}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                    <Text style={{ fontSize: 16, color: '#FFC107', marginRight: 5 }}>Erstellen</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </PopupDialog>

                <ListModal
                    isVisible={this.state.isClassChooserModalVisible}
                    renderedItems={this.props.groups}
                    headerText='Klasse wählen'
                    onCancel={() => this.setState({ isClassChooserModalVisible: false })}
                    onSave={(classData) => this.setState({
                        newAbsenceList: {
                            ...this.state.newAbsenceList, groupClass: classData
                        },
                        isClassChooserModalVisible: false
                    })} />

                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#8BC34A' }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => this.popupDialog.show()}>
                        <Icon name="add" type='MaterialIcons' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerFormInputStyle: {
        width: 285,
        marginTop: 20,
        alignSelf: 'center',
        marginLeft: 38
    },
    formInputFieldStyle: {
        fontSize: 18,
        color: 'black'
    },
});

const mapStateToProps = state => {
    return {
        absenceData: state.home.absenceData,
        groups: state.auth.groups,
        teachers: state.home.teachers,
        user: state.auth.user,
        error: state.home.error
    };
};

export default connect(mapStateToProps, {
    retrieveAbsenceList,
    retriveTeacher,
    retrieveAllAbsenceLists,
    addAbsenceList,
    removeError
})(GroupList);
