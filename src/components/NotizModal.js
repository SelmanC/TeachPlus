import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { FormInput, Icon, Divider, CheckBox } from 'react-native-elements';
import { ListModal } from './ListModal';
import { ModalWithHeader } from './ModalWithHeader';
import { SubjectExpl } from '../other';

const defaultSelectedHeader = {
    id: null,
    title: '',
    subject: {
        name: '',
        id: null
    },
    note: '',
    finished: false
};

class NotizModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShown: false,
            isSubjectChooserModalVisible: false,
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

    render() {
        const selectedItem = this.state.modalShown ? this.state.selectedItem : this.props.selectedItem;
        return (
            <ModalWithHeader
                headerText={'Notiz'}
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
                            inputStyle={styles.formInputFieldStyle} />
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='book' type='material-community' size={40} color='#a09f9f' />
                        <TouchableOpacity
                            onPress={() => this.setState({ isSubjectChooserModalVisible: true })}
                            style={{ flex: 1 }}>
                            <FormInput
                                placeholder='Fach'
                                value={selectedItem.subject.name}
                                editable={false}
                                pointerEvents="none"
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </TouchableOpacity>
                    </View>


                    <View style={[styles.modalFormFieldContainerStyle, { flex: 1, alignItems: 'flex-start', marginTop: 20 }]}>
                        <Icon name="description" size={30} color='#a09f9f' />
                        <View style={{ marginLeft: 20, marginRight: 10, flex: 1 }}>
                            <TextInput
                                multiline
                                numberOfLines={5}
                                value={selectedItem.note}
                                onChangeText={(note) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        note
                                    }
                                })}
                                placeholder='Geben Sie eine Beschreibung ein'
                                placeholderTextColor='#828080'
                                style={styles.formInputTextAreaFieldStyle}
                            />
                        </View>
                    </View>

                    <Divider style={{ backgroundColor: '#a09f9f' }} />

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <CheckBox
                            title='Erledigt'
                            iconRight
                            checked={selectedItem.finished}
                            onPress={() => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    finished: !this.state.selectedItem.finished
                                }
                            })}
                            onIconPress={() => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    finished: !this.state.selectedItem.finished
                                }
                            })}
                            containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                            textStyle={{ textAlign: 'left', fontSize: 16 }} />
                    </View>

                </View>

                <ListModal
                    isVisible={this.state.isSubjectChooserModalVisible}
                    renderedItems={SubjectExpl}
                    headerText='Fach wählen'
                    onCancel={() => this.setState({ isSubjectChooserModalVisible: false })}
                    onSave={(subjectData) => this.setState({
                        selectedItem: {
                            ...this.state.selectedItem, subject: subjectData
                        },
                        isSubjectChooserModalVisible: false
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
});

export { NotizModal };
