import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Icon, FormInput, CheckBox } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { AllUserBadgeList } from './AllUserBadgeList';
import { ModalWithHeader } from './ModalWithHeader';
import { createTimeString, createTerminString, messageAbleListExpl, getStringFromArray } from '../other';

const defaultSelectedItemValue = {
    id: null,
    teacher: '',
    partners: [],
    title: '',
    description: '',
    date: new Date(),
    endTime: new Date(new Date().getTime() + (30 * 60 * 1000)),
    subject: '',
    location: '',
    whole_day: false
};


class TerminModalPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShown: false,
            isDatePickerVisible: false,
            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false,
            showContactModal: false,
            selectedItem: Object.assign({}, defaultSelectedItemValue),
            personList: []
        };
    }

    componentDidMount() {
        this.setState({ personList: messageAbleListExpl });
    }

    onCancel() {
        this.setState({ selectedItem: Object.assign({}, defaultSelectedItemValue), isShown: false });
        this.props.onCancel();
    }

    onDelete() {
        this.setState({ selectedItem: Object.assign({}, defaultSelectedItemValue), isShown: false });
        this.props.onDelete();
    }

    onSave() {
        this.props.onSave({ ...this.state.selectedItem });
        this.setState({ selectedItem: Object.assign({}, defaultSelectedItemValue), isShown: false });
    }

    getEndTimeStringFromSelectedItem(startDate, endDate) {
        const currDate = endDate === null ? new Date(startDate.getTime() + (30 * 60 * 1000)) : endDate;
        return createTimeString(currDate.getHours(), currDate.getMinutes());
    }

    render() {
        const selectedItem = this.state.isShown ? this.state.selectedItem : this.props.selectedItem;
        return (
            <ModalWithHeader
                headerText='Termin'
                isVisible={this.props.visible}
                renderHeaderDeleteButton={selectedItem.id}
                onShow={() => this.setState({ 
                    selectedItem: { ...this.props.selectedItem }, 
                    isShown: true 
                })}
                onCancel={() => this.onCancel()}
                onSave={() => this.onSave()}
                onDelete={() => this.onDelete()}>

                    <View style={{ flex: 1, margin: 10 }}>

                        <View style={styles.modalFormFieldContainerStyle}>
                            <Icon name='title' size={40} color='#a09f9f' />
                            <FormInput
                                placeholder='Titel'
                                value={selectedItem.title}
                                onChangeText={(title) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        title
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} 
                                underlineColorAndroid='#a09f9f' />
                        </View>

                        <View style={styles.modalFormFieldContainerStyle}>
                            <Icon name='md-people' type='ionicon' size={40} color='#a09f9f' />
                            <TouchableOpacity
                                onPress={() => this.setState({ showContactModal: true })}>
                                <FormInput
                                    placeholder='Personen'
                                    value={getStringFromArray(selectedItem.partners, 'name', ',')}
                                    editable={false}
                                    pointerEvents="none"
                                    containerStyle={styles.containerFormInputStyle}
                                    placeholderTextColor='#828080'
                                    inputStyle={styles.formInputFieldStyle} 
                                    underlineColorAndroid='#a09f9f' />
                            </TouchableOpacity>
                        </View>


                        <View style={[styles.modalFormFieldContainerStyle, { alignItems: 'flex-start' }]}>
                            <Icon name='clock' type='evilicon' size={40} color='#a09f9f' containerStyle={{ marginTop: 10 }} />
                            <View style={{ marginLeft: 15, flex: 1 }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20 }}>Ganztägig</Text>
                                    <CheckBox
                                        iconRight
                                        right
                                        checked={selectedItem.whole_day}
                                        onIconPress={() => this.setState({
                                            selectedItem: {
                                                ...this.state.selectedItem,
                                                whole_day: !this.state.selectedItem.whole_day
                                            }
                                        })}
                                        containerStyle={{ flex: 1, backgroundColor: 'white', borderWidth: 0 }}
                                        textStyle={{ textAlign: 'left' }} />
                                </View>

                                <View style={styles.modalTimeTextContainerStyle}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ isDatePickerVisible: true })}>
                                        <View>
                                            <Text style={styles.modalTimeTitleStyle}>Datum</Text>
                                            <Text style={styles.modalTimeTextStyle}>{createTerminString(selectedItem.date)}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {!selectedItem.whole_day &&
                                        <View>

                                            <TouchableOpacity
                                                onPress={() => this.setState({ isStartTimePickerVisible: true })}>
                                                <Text style={styles.modalTimeTitleStyle}>Von</Text>
                                                <Text style={styles.modalTimeTextStyle}>
                                                    {createTimeString(selectedItem.date.getHours(), selectedItem.date.getMinutes())}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => this.setState({ isEndTimePickerVisible: true })}>
                                                <Text style={styles.modalTimeTitleStyle}>Bis</Text>
                                                <Text style={styles.modalTimeTextStyle}>
                                                    {this.getEndTimeStringFromSelectedItem(selectedItem.date, selectedItem.endTime)}
                                                </Text>
                                            </TouchableOpacity>

                                        </View>
                                    }

                                </View>

                                <DateTimePicker
                                    cancelTextIOS='Abbrechen'
                                    confirmTextIOS='OK'
                                    is24Hour
                                    titleIOS={'Datum'}
                                    isVisible={this.state.isDatePickerVisible}
                                    onConfirm={(date) => {
                                        date.setHours(this.state.selectedItem.date.getHours(), this.state.selectedItem.date.getMinutes());

                                        this.setState({
                                            selectedItem: {
                                                ...this.state.selectedItem,
                                                date
                                            },
                                            isDatePickerVisible: false
                                        });
                                    }}
                                    date={this.state.selectedItem.date}
                                    onCancel={() => this.setState({ isDatePickerVisible: false })}
                                />


                                <DateTimePicker
                                    mode='time'
                                    cancelTextIOS='Abbrechen'
                                    confirmTextIOS='OK'
                                    is24Hour
                                    titleIOS={'Beginn'}
                                    isVisible={this.state.isStartTimePickerVisible}
                                    onConfirm={(date) => {
                                        this.setState({
                                            selectedItem: {
                                                ...this.state.selectedItem,
                                                date: new Date(this.state.selectedItem.date.setHours(date.getHours(), date.getMinutes()))
                                            },
                                            isStartTimePickerVisible: false
                                        });
                                    }}
                                    date={this.state.selectedItem.date}
                                    onCancel={() => this.setState({ isStartTimePickerVisible: false })}
                                />

                                <DateTimePicker
                                    mode='time'
                                    cancelTextIOS='Abbrechen'
                                    confirmTextIOS='OK'
                                    is24Hour
                                    titleIOS={'Ende'}
                                    isVisible={this.state.isEndTimePickerVisible}
                                    onConfirm={(date) => {
                                        this.setState({
                                            selectedItem: {
                                                ...this.state.selectedItem,
                                                endTime: new Date(this.state.selectedItem.endTime.setHours(date.getHours(), date.getMinutes()))
                                            },
                                            isEndTimePickerVisible: false
                                        });
                                    }}
                                    date={this.state.selectedItem.endTime}
                                    onCancel={() => this.setState({ isEndTimePickerVisible: false })}
                                />

                            </View>
                        </View>

                        <View style={styles.modalFormFieldContainerStyle}>
                            <Icon name="location-pin" type='entypo' size={30} color='#a09f9f' />
                            <FormInput
                                placeholder='Ort'
                                value={selectedItem.location}
                                onChangeText={(location) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        location
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} 
                                underlineColorAndroid='#a09f9f' />
                        </View>

                        <View style={styles.modalFormFieldContainerStyle}>
                            <Icon name="ios-school" type='ionicon' size={30} color='#a09f9f' />
                            <FormInput
                                placeholder='Subject'
                                value={selectedItem.subject}
                                onChangeText={(subject) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        subject
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} 
                                underlineColorAndroid='#a09f9f' />
                        </View>

                        <View style={[styles.modalFormFieldContainerStyle, { flex: 1, alignItems: 'flex-start', marginTop: 20 }]}>
                            <Icon name="description" size={30} color='#a09f9f' />
                            <View style={{ marginLeft: 20, marginRight: 10, flex: 1 }}>
                                <TextInput
                                    multiline
                                    numberOfLines={5}
                                    value={selectedItem.description}
                                    onChangeText={(description) => this.setState({
                                        selectedItem: {
                                            ...this.state.selectedItem,
                                            description
                                        }
                                    })}
                                    placeholder='Geben Sie eine Beschreibung ein'
                                    placeholderTextColor='#828080'
                                    style={styles.formInputTextAreaFieldStyle}
                                />
                            </View>
                        </View>

                    </View>


                <AllUserBadgeList
                    isVisible={this.state.showContactModal}
                    personList={this.state.personList}
                    selectedItems={this.state.selectedItem.partners}
                    title='Kontakte auswählen'
                    onCancel={() => this.setState({
                        showContactModal: false
                    })}
                    onSave={(partners) => this.setState({
                        showContactModal: false,
                        selectedItem: { ...selectedItem, partners }
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
        flex: 1,
        textAlignVertical: 'top'
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
    }
});

export { TerminModalPopup };
