import React, { Component } from 'react';
import { View } from 'react-native';
import { UserSearchList } from './components';
import { UsersExpl, messageListExpl } from './other';

class MessageableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchText: ''
        };
    }

    componentDidMount() {
        this.setState({ users: UsersExpl });
    }

    filterMessageableList(item, option) {
        const { searchText } = this.state;
        return item.type === option && (!searchText || item.name.toUpperCase().includes(searchText.toUpperCase()));
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                 <UserSearchList
                    personList={this.state.users}
                    onUserClicked={(item) => {
                        const msgIndex = messageListExpl.findIndex(e => e.to === item.name);

                        this.props.navigation.navigate('MessageForm', {
                            messageItem: (msgIndex >= 0) ? messageListExpl[msgIndex] : {
                                teacher: 'Ali Ulvi',
                                to: item.name,
                                type: item.type,
                                avatar: '../assets/images/TeachPlus_Logo.png',
                                messages: []
                            }
                        });
                    }} />
            </View>
        );
    }
}

export default MessageableList;
