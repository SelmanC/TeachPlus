import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Fab, Icon } from 'native-base';
import { UserSearchList, UserModal } from './components';
import { retriveAllUsers, addUser, deleteUser } from './actions';


const defaultSelectedItem = {
    id: null,
    name: '',
    age: null,
    strasse: '',
    ort: '',
    land: '',
    email: '',
    role: '',
    children: []
};

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        };
    }

    componentDidMount() {
        this.props.retriveAllUsers();
    }

    onDelete() {
        this.props.deleteUser(this.state.selectedItem, this.props.userData);

        this.setState({
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false
        });
    }

    onSave(newItem) {
        this.props.addUser(newItem, this.props.userData);

        this.setState({
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <UserSearchList
                    personList={this.props.userData}
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
                    selectedItem={this.state.selectedItem} 
                    childrenData={this.props.userData.filter(e => e.role === 'student')} />

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

const mapStateToProps = state => {
    return {
        userData: state.home.userData,
    };
};

export default connect(mapStateToProps, {
    retriveAllUsers,
    addUser,
    deleteUser
})(UserList);
