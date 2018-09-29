import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FormInput, Icon, Avatar } from 'react-native-elements';
import { ListModal } from './ListModal';
import { ModalWithHeader } from './ModalWithHeader';
import { FilteredBadgeList } from './FilteredBadgeList';
import { UserRoles, UsersExpl, getStringFromArray } from '../other';

const defaultSelectedHeader = {
    id: null,
    name: '',
    lastname: '',
    email: '',
    age: null,
    strasse: '',
    ort: '',
    land: '',
    role: { name: '', value: '', id: null },
    children: []
};

class UserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShown: false,
            isRoleModalVisible: false,
            isChildModalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedHeader),
            children: []
        };
    }

    componentDidMount() {
        this.setState({ children: UsersExpl.filter(e => e.role.value === 'student') });
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
                headerText='Benutzer'
                isVisible={this.props.modalVisible}
                renderHeaderDeleteButton={this.props.renderHeaderDeleteButton !== false && selectedItem.id}
                onShow={() => this.setState({
                    selectedItem: Object.assign({}, this.props.selectedItem),
                    modalShown: true
                })}
                onCancel={() => this.onCancel()}
                onSave={() => this.onSave()}
                onDelete={() => this.onDelete()}>

                <View style={{ flex: 1, margin: 10 }}>

                    <View style={styles.modalFormFieldContainerStyle}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                            <Avatar
                                height={40}
                                title='ABC'
                                avatarStyle={{ color: '#a09f9f' }}
                                activeOpacity={0.7}
                            />
                            <Icon name='star' type='entypo' size={10} color='red' />
                        </View>

                        <View style={{ flex: 1, height: 90 }}>
                            <FormInput
                                placeholder='Vorname'
                                value={selectedItem.name}
                                onChangeText={(name) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        name
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />

                            <FormInput
                                placeholder='Nachname'
                                value={selectedItem.lastname}
                                onChangeText={(lastname) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        lastname
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />

                        </View>

                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='email' type='entypo' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <FormInput
                            placeholder='Email'
                            value={selectedItem.email}
                            onChangeText={(email) => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    email
                                }
                            })}
                            containerStyle={styles.containerFormInputStyle}
                            placeholderTextColor='#828080'
                            inputStyle={styles.formInputFieldStyle} />
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                            
                        <Icon name="location-pin" type='entypo' size={40} color='#a09f9f' containerStyle={{ alignSelf: 'flex-start' }} />
                        <View style={{ flex: 1, height: 130, marginLeft: 10 }}>
                            <FormInput
                                placeholder='Straße'
                                value={selectedItem.strasse}
                                onChangeText={(strasse) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        strasse
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />

                            <FormInput
                                placeholder='Ort'
                                value={selectedItem.ort}
                                onChangeText={(ort) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        ort
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />

                            <FormInput
                                placeholder='Bundesland'
                                value={selectedItem.land}
                                onChangeText={(land) => this.setState({
                                    selectedItem: {
                                        ...this.state.selectedItem,
                                        land
                                    }
                                })}
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </View>
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='group' type='font-awesome' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <TouchableOpacity
                            onPress={() => this.setState({ isRoleModalVisible: true })}
                            style={{ flex: 1 }}>
                            <FormInput
                                placeholder='Rolle'
                                value={selectedItem.role.name}
                                editable={false}
                                pointerEvents="none"
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </TouchableOpacity>
                    </View>
                    {
                        selectedItem.role.value === 'parent' &&

                        <View style={styles.modalFormFieldContainerStyle}>
                            <Icon name='child' type='font-awesome' size={50} color='#a09f9f' />
                            <Icon name='star' type='entypo' size={10} color='red' />
                            <TouchableOpacity
                                onPress={() => this.setState({ isChildModalVisible: true })}
                                style={{ flex: 1 }}>
                                <FormInput
                                    placeholder='Kinder'
                                    value={getStringFromArray(selectedItem.children, 'name', ',')}
                                    editable={false}
                                    pointerEvents="none"
                                    containerStyle={styles.containerFormInputStyle}
                                    placeholderTextColor='#828080'
                                    inputStyle={styles.formInputFieldStyle} />
                            </TouchableOpacity>
                        </View>
                    }

                </View>

                <ListModal
                    isVisible={this.state.isRoleModalVisible}
                    renderedItems={UserRoles}
                    headerText='Rolle wählen'
                    onCancel={() => this.setState({ isRoleModalVisible: false })}
                    onSave={(roleData) => this.setState({
                        selectedItem: {
                            ...this.state.selectedItem, role: roleData
                        },
                        isRoleModalVisible: false
                    })} />

                <FilteredBadgeList
                    isVisible={this.state.isChildModalVisible}
                    renderedItems={this.state.children}
                    selectedItems={this.state.selectedItem.children}
                    title='Kinder auswählen'
                    onCancel={() => this.setState({
                        isChildModalVisible: false
                    })}
                    onSave={(children) => this.setState({
                        isChildModalVisible: false,
                        selectedItem: { ...selectedItem, children }
                    })} />

            </ModalWithHeader>
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

export { UserModal };
