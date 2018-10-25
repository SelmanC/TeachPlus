import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { UserSearchList, FilteredList, SearchTextInput } from './components';
import { retriveAllGroups, retriveAllUsers, retriveTeacher } from './actions';

class MessageableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
    }

    componentDidMount() {
        if (this.props.user.role === 'parent') {
            this.props.retriveTeacher();
        } else {
            this.props.retriveAllGroups();
            if (this.props.userData.length === 0) {
                this.props.retriveAllUsers();
            }
        }
    }

    filterMessageableList(item, option) {
        const { searchText } = this.state;
        return item.type === option && (!searchText || item.name.toUpperCase().includes(searchText.toUpperCase()));
    }

    render() {
        if (this.props.user.role === 'parent') {
            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <SearchTextInput
                        onChangeText={(text) => this.setState({ searchText: text })}
                        onClearText={() => this.setState({ searchText: '' })} />


                    <ScrollView>
                        <FilteredList
                            renderedItems={this.props.teachers}
                            onItemPressed={(item) => {
                                const messageItem = this.props.messageList[item.id] ?
                                    this.props.messageList[item.id] : {
                                        to: item,
                                        from: this.props.user,
                                        messages: []
                                    };

                                this.props.navigation.navigate('MessageForm', { messageItem });
                            }}
                            searchText={this.state.searchText} />
                    </ScrollView>
                </View>
            );
        }
        
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <UserSearchList
                    personList={[...this.props.userData, ...this.props.groupData]}
                    onUserClicked={(item) => {
                        const messageItem = this.props.messageList[item.id] ?
                            this.props.messageList[item.id] : {
                                to: item,
                                from: this.props.user,
                                messages: []
                            };

                        this.props.navigation.navigate('MessageForm', { messageItem });
                    }} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        userData: state.home.userData,
        teachers: state.home.teachers,
        groupData: state.home.groupData,
        user: state.auth.user,
        messageList: state.home.messageList
    };
};

export default connect(mapStateToProps, {
    retriveAllUsers,
    retriveTeacher,
    retriveAllGroups
})(MessageableList);

