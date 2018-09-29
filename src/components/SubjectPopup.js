import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Picker, Item, Icon, Form, Label, Fab, Input, Button } from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { ColorPicker } from 'react-native-color-picker';
import { courses, Teachers, colors } from '../other';


const defaultValue = {
    subject: '',
    teacher: '',
    location: '',
    color: 'white',
    modalVisible: false,
    active: false
};

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class SubjectPopup extends Component {
    constructor(props) {
        super(props);
        this.state = { ...defaultValue };
    }

    setNewAbsenceValue(addSubjectToArray) {
        const { location, teacher, subject, color } = this.state;

        if (this.didValueChange(location, teacher, subject, color)) {
            this.props.onSavePressed({ location, teacher, subject, color, addSubjectToArray });
        } else {
            this.props.onCancelPressed();
        }
    }

    didValueChange(location, teacher, subject, color) {
        return (
            (subject && !this.props.selectedCourse.subject) ||
            location !== this.props.selectedCourse.location ||
            teacher !== this.props.selectedCourse.teacher ||
            subject !== this.props.selectedCourse.subject ||
            color !== this.props.selectedCourse.color);
    }

    subjectChange(subject) {
        this.setState({ subject });
    }

    teacherChange(teacher) {
        this.setState({ teacher });
    }

    locationChange(location) {
        this.setState({ location });
    }

    renderSaveFabItem() {
        if (!this.state.active) return;

        return (
            <Button
                style={{ backgroundColor: '#34A34F' }}
                onPress={() => { this.setNewAbsenceValue(false); }}>
                <Icon name="save" type='MaterialIcons' style={{ color: 'white' }} />
            </Button>
        );
    }

    renderAddNewFabItem() {
        if (!this.state.active) return;

        return (
            <Button
                style={{ backgroundColor: '#009688' }}
                onPress={() => { this.setNewAbsenceValue(true); }}>
                <Icon name="add" type='MaterialIcons' style={{ color: 'white' }} />
            </Button>
        );
    }

    renderFabs() {
        if (this.props.selectedCourse.subject === '') {
            return (
                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#ff8935', marginBottom: 10 }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => { this.setNewAbsenceValue(false); }}>
                        <Icon name="save" type='MaterialIcons' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            );
        }

        return (
            <View style={{ flex: 1 }}>

                <Fab
                    active={this.state.active}
                    key={0}
                    direction="up"
                    style={{ backgroundColor: '#ff8935', marginBottom: 10 }}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="edit" type='MaterialIcons' style={{ color: 'white' }} />
                    {
                        this.renderSaveFabItem()
                    }
                    {
                        this.renderAddNewFabItem()
                    }
                </Fab>

                <Fab
                    active
                    key={1}
                    direction="up"
                    containerStyle={{ marginRight: 60 }}
                    style={{ backgroundColor: '#E91E63', marginBottom: 10 }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => { this.setState(defaultValue); this.props.onDelteSubject(); }}>
                        <Icon name="delete" type='MaterialIcons' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            </View>
        );
    }

    renderColors() {
        return colors.map((color, key) => (
            <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false, color })}
                key={key}>
                <View key={key} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: color, marginRight: 5 }} />
            </TouchableOpacity>
        ));
    }

    renderForm() {
        if (this.state.subject !== 'Pause') {
            return (
                <View style={{ margin: 10, flexDirection: 'row' }} >
                    <View style={{ flexDirection: 'column' }} >
                        <View style={[styles.fieldContainerStyle]} >
                            <Icon name="md-person" />
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                iosHeader="Lehrer"
                                mode="dropdown"
                                style={styles.subjectPickerStyle}
                                selectedValue={this.state.teacher}
                                onValueChange={this.teacherChange.bind(this)}
                                placeholder='Lehrer'>
                                {
                                    Teachers.map((teacher, key) => (
                                        <Item label={teacher} value={teacher} key={key} />
                                    ))
                                }
                            </Picker>
                        </View>


                        <View style={styles.fieldContainerStyle} >
                            <Icon name="location-pin" type='Entypo' />
                            <Item style={{ width: 200 }}>
                                <Input placeholder='Raum' style={{ width: 200 }} />
                            </Item>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

                        <TouchableOpacity
                            onPress={() => { this.setState({ modalVisible: true }); }}>
                            <View style={[styles.roundIconContainerStyle, { backgroundColor: this.state.color !== 'white' ? this.state.color : '#efefef' }]}>
                                <Icon
                                    name="md-color-filter"
                                    style={{ color: this.state.color !== 'white' ? 'white' : 'black' }} />
                            </View>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisible}>
                            <View style={{ flex: 1 }}>

                                <ColorPicker
                                    onColorSelected={color => { this.setState({ modalVisible: false, color }); }}
                                    style={{ flex: 3, marginBottom: 10 }}
                                />

                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <View>
                                        <Text style={{ fontSize: 18, marginBottom: 5 }}>Standardfarben</Text>
                                        <ScrollView horizontal>
                                            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                                {
                                                    this.renderColors()
                                                }
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>

                            </View>
                        </Modal>
                    </View>
                </View>
            );
        }
    }

    render() {
        return (
            <PopupDialog
                ref={(popupDialog) => this.props.onRef(popupDialog)}
                dialogAnimation={slideAnimation}
                height={0.5}
                containerStyle={{ justifyContent: 'flex-end' }}
                onDismissed={() => this.setState(defaultValue)}
                onShown={() => this.setState({
                    teacher: this.props.selectedCourse.teacher,
                    location: this.props.selectedCourse.location,
                    color: this.props.selectedCourse.color ? this.props.selectedCourse.color : 'white',
                    subject: this.props.selectedCourse.subject,
                })}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ height: 75, backgroundColor: '#4C3E54', flexDirection: 'row' }}>
                        <Item stackedLabel style={{ width: 200, marginLeft: 10 }}>
                            <Label style={{ color: 'white' }}>Fach</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                iosHeader="Fächer"
                                mode="dropdown"
                                style={styles.subjectPickerStyle}
                                selectedValue={this.state.subject}
                                onValueChange={this.subjectChange.bind(this)}>
                                {
                                    courses.map((course, key) => (
                                        <Item label={course} value={course} key={key} />
                                    ))
                                }
                            </Picker>
                        </Item>

                        {
                            this.renderFabs()
                        }

                    </View>
                    <Form>
                        {
                            this.renderForm()
                        }
                    </Form>
                </View>

            </PopupDialog>
        );
    }
}

const styles = StyleSheet.create({
    rootContainerStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1
    },
    cardStyle: {
        marginTop: 0,
        padding: 10,
        alignItems: 'center',
        flex: 1
    },
    fieldContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'space-around'
    },
    subjectPickerStyle: {
        borderWidth: 1,
        borderColor: '#b7b7b7',
        backgroundColor: '#f9f9f9',
        width: 200
    },
    textStyle: {
        fontSize: 18,
        textAlign: 'center'
    },
    roundIconContainerStyle: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export { SubjectPopup };
