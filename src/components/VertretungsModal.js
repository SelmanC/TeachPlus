import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { FormInput, Icon } from 'react-native-elements';
import { Picker, Item } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { ListModal } from './ListModal';
import { ModalWithHeader } from './ModalWithHeader';
import { createTerminString } from '../other';

const titles = [
    'Vertretung',
    'Verspätung',
    'Ausfall',
    'Raumänderung'
];

const defaultSelectedHeader = {
    groupClass: {
        name: '',
        id: null
    },
    title: '',
    substitute: {
        name: ''
    },
    subject: '',
    room: '',
    comment: '',
    delay: null,
    date: new Date(),
    id: null,
    hour: ''
};

class VertretungsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShown: false,
            isDelayTimerVisible: false,
            isClassChooserModalVisible: false,
            isTeacherChooserModalVisible: false,
            isDatePickerVisible: false,
            selectedItem: Object.assign({}, defaultSelectedHeader)
        };
    }

    onDelete() {
        this.props.onDelete({ id: this.state.selectedItem.id });
        this.setState({
            selectedItem: Object.assign({}, defaultSelectedHeader),
            modalShown: false
        });
    }

    onSave() {
        this.props.onSave({ ...this.state.selectedItem });
        this.setState({
            selectedItem: Object.assign({}, defaultSelectedHeader),
            modalShown: false
        });
    }

    onCancel() {
        this.setState({
            selectedItem: Object.assign({}, defaultSelectedHeader),
            modalShown: false
        });
        this.props.onCancel();
    }

    renderFields(selectedItem) {
        if (selectedItem.title &&
            selectedItem.title !== 'Ausfall' &&
            selectedItem.groupClass.id &&
            selectedItem.subject) {
            return (
                <View style={{ flex: 1 }}>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='user' type='entypo' size={40} color='#a09f9f' />
                        {
                            selectedItem.title === 'Vertretung' &&
                            <Icon name='star' type='entypo' size={10} color='red' />
                        }
                        <TouchableOpacity
                            onPress={() => this.setState({ isTeacherChooserModalVisible: true })}
                            style={{ flex: 1 }}>
                            <FormInput
                                placeholder='Vertetung'
                                value={selectedItem.substitute.name}
                                editable={false}
                                pointerEvents="none"
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='hour-glass' type='entypo' size={40} color='#a09f9f' containerStyle={{ marginTop: 10 }} />
                        {
                            selectedItem.title === 'Verspätung' &&
                            <Icon name='star' type='entypo' size={10} color='red' />
                        }
                        <FormInput
                            placeholder='Verspätung'
                            onChangeText={(delay) => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    delay
                                }
                            })}
                            value={selectedItem.delay}
                            containerStyle={styles.containerFormInputStyle}
                            placeholderTextColor='#828080'
                            inputStyle={styles.formInputFieldStyle} />
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name="location-pin" type='entypo' size={40} color='#a09f9f' />
                        {
                            selectedItem.title === 'Raumänderung' &&
                            <Icon name='star' type='entypo' size={10} color='red' />
                        }
                        <FormInput
                            placeholder='Ort'
                            onChangeText={(room) => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    room
                                }
                            })}
                            value={selectedItem.room}
                            containerStyle={styles.containerFormInputStyle}
                            placeholderTextColor='#828080'
                            inputStyle={styles.formInputFieldStyle} />
                    </View>

                    <View style={[styles.modalFormFieldContainerStyle, { flex: 1, alignItems: 'flex-start', marginTop: 20 }]}>
                        <Icon name="description" size={30} color='#a09f9f' />
                        <View style={{ marginLeft: 20, marginRight: 10, flex: 1 }}>
                            <TextInput
                                multiline
                                numberOfLines={5}
                                value={selectedItem.comment}
                                onChangeText={(comment) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        comment
                                    }
                                })}
                                placeholder='Geben Sie eine Beschreibung ein'
                                placeholderTextColor='#828080'
                                style={styles.formInputTextAreaFieldStyle}
                            />
                        </View>
                    </View>

                </View>
            );
        }
    }

    render() {
        const selectedItem = this.state.modalShown ? this.state.selectedItem : this.props.selectedItem;
        return (
            <ModalWithHeader
                headerText='Vertretungsplan'
                isVisible={this.props.modalVisible}
                renderHeaderDeleteButton={selectedItem.id}
                onShow={() => this.setState({
                    selectedItem: Object.assign({}, this.props.selectedItem),
                    modalShown: true
                })}
                onCancel={() => this.onCancel()}
                onSave={() => this.onSave()}
                onDelete={() => this.onDelete()}>
                <View style={{ flex: 1, margin: 10 }}>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='title' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <Picker
                            iosIcon={<Icon type='ionicon' name="ios-arrow-down-outline" />}
                            iosHeader="Title"
                            mode="dropdown"
                            placeholder='Title'
                            placeholderStyle={{ color: '#828080' }}
                            textStyle={styles.formInputFieldStyle}
                            style={styles.subjectPickerStyle}
                            selectedValue={selectedItem.title}
                            onValueChange={(title) => this.setState({
                                selectedItem: { ...selectedItem, title }
                            })}>
                            {
                                titles.map((title, key) => (
                                    <Item label={title} value={title} key={key + 1} />
                                ))
                            }
                        </Picker>
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='group' type='font-awesome' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <TouchableOpacity
                            onPress={() => this.setState({ isClassChooserModalVisible: true })}
                            style={{ flex: 1 }}>
                            <FormInput
                                placeholder='Klasse'
                                value={selectedItem.groupClass.name}
                                editable={false}
                                pointerEvents="none"
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='calendar' type='entypo' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <TouchableOpacity
                            onPress={() => this.setState({ isDatePickerVisible: true })}
                            style={{ flex: 1 }}>
                            <FormInput
                                placeholder='Datum'
                                value={createTerminString(selectedItem.date)}
                                editable={false}
                                pointerEvents="none"
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='book' type='material-community' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <FormInput
                            placeholder='Fach'
                            onChangeText={(subject) => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    subject
                                }
                            })}
                            value={selectedItem.subject}
                            containerStyle={styles.containerFormInputStyle}
                            placeholderTextColor='#828080'
                            inputStyle={styles.formInputFieldStyle} />
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='clock' type='evilicon' size={40} color='#a09f9f' />
                        <FormInput
                            placeholder='Unterrichtsstunde'
                            onChangeText={(hour) => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    hour
                                }
                            })}
                            value={selectedItem.hour}
                            containerStyle={styles.containerFormInputStyle}
                            placeholderTextColor='#828080'
                            inputStyle={styles.formInputFieldStyle} />
                    </View>

                    {
                        this.renderFields(selectedItem)
                    }

                </View>

                <DateTimePicker
                    cancelTextIOS='Abbrechen'
                    confirmTextIOS='OK'
                    is24Hour
                    titleIOS={'Datum'}
                    isVisible={this.state.isDatePickerVisible}
                    onConfirm={(date) => {
                        this.setState({
                            selectedItem: {
                                ...this.state.selectedItem,
                                date
                            },
                            isDatePickerVisible: false
                        });
                    }}
                    date={selectedItem.date}
                    onCancel={() => this.setState({ isDatePickerVisible: false })}
                />


                <ListModal
                    isVisible={this.state.isClassChooserModalVisible}
                    renderedItems={this.props.groups}
                    headerText='Klasse wählen'
                    onCancel={() => this.setState({ isClassChooserModalVisible: false })}
                    onSave={(classData) => this.setState({
                        selectedItem: {
                            ...this.state.selectedItem, groupClass: classData
                        },
                        isClassChooserModalVisible: false
                    })} />

                <ListModal
                    isVisible={this.state.isTeacherChooserModalVisible}
                    renderedItems={this.props.teachers}
                    headerText='Lehrer wählen'
                    onCancel={() => this.setState({ isTeacherChooserModalVisible: false })}
                    onSave={(teacherData) => this.setState({
                        selectedItem: {
                            ...this.state.selectedItem, substitute: teacherData
                        },
                        isTeacherChooserModalVisible: false
                    })} />
            </ModalWithHeader >
        );
    }
}

const styles = StyleSheet.create({
    containerFormInputStyle: {
        height: 50,
        justifyContent: 'center',
        marginRight: 10,
        flex: 1
    },
    formInputFieldStyle: {
        fontSize: 22,
        color: 'black'
    },
    formInputTextAreaFieldStyle: {
        borderWidth: 1,
        borderColor: '#c9c9c9',
        fontSize: 16,
        padding: 10,
        marginBottom: 15,
        marginTop: 5,
        flex: 1
    },
    modalFormFieldContainerStyle: {
        flexDirection: 'row',
        marginTop: 10
    },
    modalTimeTextContainerStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomColor: '#c9c9c9',
        borderBottomWidth: 1,
        marginRight: 10
    },
    modalTimeTitleStyle: {
        fontSize: 13,
        marginTop: 5,
        color: '#a09f9f'
    },
    modalTimeTextStyle: {
        fontSize: 16,
        marginTop: 5,
        marginBottom: 10
    },

    subjectPickerStyle: {
        borderWidth: 1,
        height: 50,
        marginLeft: 15,
        marginRight: 20,
        flex: 1,
        borderColor: '#b7b7b7',
        backgroundColor: '#f9f9f9',
        width: '68%'
    }
});

export { VertretungsModal };
