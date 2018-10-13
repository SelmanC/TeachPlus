import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FormInput, Icon, Avatar } from 'react-native-elements';
import { ModalWithHeader } from './ModalWithHeader';
import { AllUserBadgeList } from './AllUserBadgeList';
import { getStringFromArray } from '../other';

const defaultSelectedHeader = {
    id: null,
    name: '',
    role: 'group',
    groupOwner: [],
};

class GroupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShown: false,
            isMemberModalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedHeader),
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

    onSelectedBadgeChanged(selectedItem, members) {
        selectedItem.groupOwner = [];
        for (let i = 0; i < members.length; i++) {
            delete members[i].groupMembers;
            selectedItem.groupOwner.push({
                userMember: members[i]
            });
        }

        this.setState({
            isMemberModalVisible: false,
            selectedItem: { ...selectedItem }
        });
    }

    render() {
        const selectedItem = this.state.modalShown ? this.state.selectedItem : this.props.selectedItem;
        const members = selectedItem.groupOwner.length > 0 ? selectedItem.groupOwner.map(e => e.userMember) : [];
        return (
            <ModalWithHeader
                headerText='Gruppe'
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
                        <Avatar
                            height={40}
                            title='ABC'
                            avatarStyle={{ color: '#a09f9f' }}
                            activeOpacity={0.7}
                        />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <FormInput
                            placeholder='Name'
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
                    </View>

                    <View style={styles.modalFormFieldContainerStyle}>
                        <Icon name='group' type='font-awesome' size={40} color='#a09f9f' />
                        <Icon name='star' type='entypo' size={10} color='red' />
                        <TouchableOpacity
                            onPress={() => this.setState({ isMemberModalVisible: true })}
                            style={{ flex: 1 }}>
                            <FormInput
                                placeholder='Mitglieder'
                                value={getStringFromArray(members, 'name', ',')}
                                editable={false}
                                pointerEvents="none"
                                containerStyle={styles.containerFormInputStyle}
                                placeholderTextColor='#828080'
                                inputStyle={styles.formInputFieldStyle} />
                        </TouchableOpacity>
                    </View>

                </View>

                <AllUserBadgeList
                    isVisible={this.state.isMemberModalVisible}
                    personList={this.props.users}
                    selectedItems={members}
                    title='Mitglieder auswählen'
                    onCancel={() => this.setState({
                        isMemberModalVisible: false
                    })}
                    onSave={(newMembers) => this.onSelectedBadgeChanged(selectedItem, newMembers)} />

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

export { GroupModal };
