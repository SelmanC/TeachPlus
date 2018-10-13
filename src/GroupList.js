import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Fab, Icon } from 'native-base';
import { SearchTextInput, FilteredList, GroupModal } from './components';
import { retriveAllGroups, addGroup, deleteGroup, retriveAllUsers } from './actions';

const defaultSelectedItem = {
    id: null,
    name: '',
    groupOwner: [],
    role: 'group'
};

class GroupList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem),
            searchText: ''
        };
    }

    componentDidMount() {
        this.props.retriveAllGroups();

        if (this.props.userData.length === 0) {
            this.props.retriveAllUsers();
        }
    }

    onDelete() {
        this.props.deleteGroup(this.state.selectedItem, this.props.groupData);

        this.setState({
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false,
        });
    }

    onSave(newItem) {
        this.props.addGroup(newItem, this.props.groupData);

        this.setState({
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false,
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    <SearchTextInput
                        onChangeText={(text) => this.setState({ searchText: text })}
                        onClearText={() => this.setState({ searchText: '' })} />


                    <ScrollView>
                        <FilteredList
                            renderedItems={this.props.groupData}
                            onItemPressed={(item) =>
                                this.setState({
                                    selectedItem: item,
                                    modalVisible: true
                                })
                            }
                            searchText={this.state.searchText} />
                    </ScrollView>

                    <GroupModal
                        modalVisible={this.state.modalVisible}
                        selectedItem={this.state.selectedItem}
                        users={this.props.userData}
                        onSave={(item) => this.onSave(item)}
                        onDelete={() => this.onDelete()}
                        onCancel={() => this.setState({
                            modalVisible: false,
                            selectedItem: Object.assign({}, defaultSelectedItem)
                        })} />
                </View>

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
        groupData: state.home.groupData,
        userData: state.home.userData,
    };
};

export default connect(mapStateToProps, {
    retriveAllGroups,
    addGroup,
    deleteGroup,
    retriveAllUsers
})(GroupList);
