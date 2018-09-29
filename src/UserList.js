import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Fab, Icon } from 'native-base';
import { UserSearchList, UserModal } from './components';
import { UsersExpl } from './other';

const defaultSelectedItem = {
    id: null,
    name: '',
    age: null,
    strasse: '',
    ort: '',
    land: '',
    email: '',
    role: { name: '', value: '', id: null },
    children: []
};

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            personList: [],
            selectedItem: Object.assign({}, defaultSelectedItem)
        };
    }

    componentDidMount() {
        this.setState({ personList: UsersExpl });
    }

    onDelete() {
        const { selectedItem, personList } = this.state;
        const itemIndex = personList.findIndex(e => e.id === selectedItem.id);
        personList.splice(itemIndex, 1);

        this.setState({
            personList,
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false
        });
    }

    onSave(newItem) {
        const { selectedItem, personList } = this.state;

        if (selectedItem.id) {
            const itemIndex = personList.findIndex(e => e.id === selectedItem.id);
            personList[itemIndex] = newItem;
        } else {
            personList.push(newItem);
        }

        this.setState({
            personList,
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <UserSearchList
                    personList={this.state.personList}
                    searchGroup={false}
                    onUserClicked={(item) =>
                        this.setState({
                            selectedItem: Object.assign({}, item),
                            modalVisible: true
                        })} />

                <UserModal
                    modalVisible={this.state.modalVisible}
                    onCancel={() => this.setState({
                        modalVisible: false,
                        selectedItem: Object.assign({}, defaultSelectedItem)
                    })}
                    onDelete={() => { this.onDelete(); }}
                    onSave={(selectedItem) => { this.onSave(selectedItem); }}
                    selectedItem={this.state.selectedItem} />

                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#8BC34A' }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => this.setState({ modalVisible: true })}>
                        <Icon name="add" type='MaterialIcons' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            </View>
        );
    }
}

export default UserList;
