import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Fab, Icon } from 'native-base';
import { SearchTextInput, FilteredList, GroupModal } from './components';
import { GroupExpl } from './other';

const defaultSelectedItem = {
    id: null,
    name: '',
    members: [],
    role: { name: 'Gruppe', value: 'group', id: 5 }
};

class GroupList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            groupList: [],
            selectedItem: Object.assign({}, defaultSelectedItem),
            selectedIndex: null,
            searchText: ''
        };
    }

    componentDidMount() {
        this.setState({ groupList: GroupExpl });
    }

    onDelete() {
        const { groupList, selectedIndex } = this.state;
        groupList.splice(selectedIndex, 1);

        this.setState({
            groupList,
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false,
            selectedIndex: null
        });
    }

    onSave(newItem) {
        const { selectedItem, groupList, selectedIndex } = this.state;

        if (selectedItem.id) {
            groupList[selectedIndex] = newItem;
        } else {
            groupList.push(newItem);
        }

        this.setState({
            groupList,
            selectedItem: Object.assign({}, defaultSelectedItem),
            modalVisible: false,
            selectedIndex: null
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
                            renderedItems={this.state.groupList}
                            onItemPressed={(item, index) =>
                                this.setState({
                                    selectedItem: item,
                                    selectedIndex: index,
                                    modalVisible: true
                                })
                            }
                            searchText={this.state.searchText} />
                    </ScrollView>

                    <GroupModal
                        modalVisible={this.state.modalVisible}
                        selectedItem={this.state.selectedItem}
                        onSave={(item) => this.onSave(item)}
                        onDelete={() => this.onDelete()}
                        onCancel={() => this.setState({
                            modalVisible: false,
                            selectedIndex: null,
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

export default GroupList;
