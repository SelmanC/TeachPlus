import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Item, Icon, Form, Label, Fab, Button } from 'native-base';
import { FormInput } from 'react-native-elements';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { ColorPicker } from 'react-native-color-picker';
import { ListModal } from './ListModal';
import { colors } from '../other';


const defaultValue = {
    id: null,
    subject: '',
    teacher: {
        id: null,
        name: ''
    },
    room: '',
    color: 'white'
};

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class SubjectPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: Object.assign({}, defaultValue),
            modalShown: false,
            modalVisible: false,
            active: false,
            isTeacherChooserModalVisible: false
        };
    }

    setNewAbsenceValue(addSubjectToArray) {
        this.props.onSavePressed(this.state.selectedItem, addSubjectToArray);
        this.setState({
            selectedItem: Object.assign({}, defaultValue),
            modalShown: false,
            modalVisible: false
        });
    }

    subjectChange(subject) {
        this.setState({
            selectedItem: {
                ...this.state.selectedItem,
                subject
            }
        });
    }

    teacherChange(teacher) {
        this.setState({
            selectedItem: {
                ...this.state.selectedItem,
                teacher
            }
        });
    }

    locationChange(room) {
        this.setState({
            selectedItem: {
                ...this.state.selectedItem,
                room
            }
        });
    }

    renderSaveFabItem() {
        if (!this.state.active) return;

        return (
            <Button
                style={{ backgroundColor: '#34A34F' }}
                onPress={() => { this.setNewAbsenceValue(); }}>
                <Icon name="save" type='MaterialIcons' style={{ color: 'white' }} />
            </Button>
        );
    }

    renderAddNewFabItem(selectedItem) {
        /*
        if (!this.state.active || !selectedItem.id) return;

        return (
            <Button
                style={{ backgroundColor: '#009688' }}
                onPress={() => { this.setNewAbsenceValue(); }}>
                <Icon name="add" type='MaterialIcons' style={{ color: 'white' }} />
            </Button>
        );*/
    }

    renderFabs(selectedItem) {
        if (selectedItem.subject === '') {
            return (
                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#ff8935', marginBottom: 10 }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => { this.setNewAbsenceValue(); }}>
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
                        this.renderAddNewFabItem(selectedItem)
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
                        onPress={() => {
                            this.setState({
                                selectedItem: Object.assign({}, defaultValue),
                                modalVisible: false,
                                active: false
                            });
                            this.props.onDelteSubject();
                        }}>
                        <Icon name="delete" type='MaterialIcons' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            </View>
        );
    }

    renderColors() {
        return colors.map((color, key) => (
            <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false, selectedItem: { ...this.state.selectedItem, color } })}
                key={key}>
                <View key={key} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: color, marginRight: 5 }} />
            </TouchableOpacity>
        ));
    }

    renderForm(selectedItem) {
        if (selectedItem.subject !== 'Pause') {
            return (
                <View style={{ margin: 10, flexDirection: 'row' }} >
                    <View style={{ flexDirection: 'column' }} >
                        <View style={[styles.fieldContainerStyle]} >
                            <Icon name="md-person" />

                            <TouchableOpacity
                                onPress={() => this.setState({ isTeacherChooserModalVisible: true })}
                                style={{ flex: 1 }}>
                                <FormInput
                                    placeholder='Lehrer'
                                    value={this.state.selectedItem.teacher.name}
                                    editable={false}
                                    pointerEvents="none"
                                    placeholderTextColor='#333333'
                                    containerStyle={{ width: 200 }}
                                    inputStyle={styles.formInputFieldStyle} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.fieldContainerStyle} >
                            <Icon name="location-pin" type='Entypo' />
                            <FormInput
                                placeholder='Raum'
                                onChangeText={this.locationChange.bind(this)}
                                value={this.state.selectedItem.room}
                                placeholderTextColor='#333333'
                                containerStyle={{ width: 200 }}
                                inputStyle={styles.formInputFieldStyle} />
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

                        <TouchableOpacity
                            onPress={() => { this.setState({ modalVisible: true }); }}>
                            <View style={[styles.roundIconContainerStyle, { backgroundColor: selectedItem.color !== 'white' ? selectedItem.color : '#efefef' }]}>
                                <Icon
                                    name="md-color-filter"
                                    style={{ color: selectedItem.color !== 'white' ? 'white' : 'black' }} />
                            </View>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisible}>
                            <View style={{ flex: 1 }}>

                                <ColorPicker
                                    onColorSelected={color => {
                                        this.setState({
                                            selectedItem: {
                                                ...this.state.selectedItem,
                                                color
                                            },
                                            modalVisible: false
                                        });
                                    }}
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
        const selectedItem = this.state.modalShown ? this.state.selectedItem : this.props.selectedItem;
        return (
            <PopupDialog
                ref={(popupDialog) => this.props.onRef(popupDialog)}
                dialogAnimation={slideAnimation}
                height={0.5}
                containerStyle={{ justifyContent: 'flex-end' }}
                onDismissed={() =>
                    this.setState({
                        selectedItem: Object.assign({}, defaultValue),
                        modalShown: false,
                        modalVisible: false,
                        active: false
                    })
                }
                onShown={() => this.setState({
                    selectedItem: Object.assign({}, this.props.selectedItem),
                    modalShown: true
                })}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ height: 75, backgroundColor: '#4C3E54', flexDirection: 'row' }}>
                        <Item stackedLabel style={{ width: 200, marginLeft: 10 }}>
                            <Label style={{ color: 'white' }}>Fach</Label>
                            <FormInput
                                onChangeText={(subject) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        subject
                                    }
                                })}
                                value={selectedItem.subject}
                                containerStyle={styles.subjectPickerStyle}
                                inputStyle={styles.formInputFieldStyle} />
                        </Item>

                        {
                            this.renderFabs(selectedItem)
                        }

                    </View>
                    <Form>
                        {
                            this.renderForm(selectedItem)
                        }
                    </Form>
                </View>

                <ListModal
                    isVisible={this.state.isTeacherChooserModalVisible}
                    renderedItems={this.props.teachers}
                    headerText='Lehrer wählen'
                    onCancel={() => this.setState({ isTeacherChooserModalVisible: false })}
                    onSave={(teacherData) => this.setState({
                        selectedItem: {
                            ...this.state.selectedItem,
                            teacher: teacherData
                        },
                        isTeacherChooserModalVisible: false
                    })} />

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
    },
    formInputFieldStyle: {
        color: 'black'
    }
});

export { SubjectPopup };
