import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { Fab, Icon } from 'native-base';
import { messageListExpl } from './other';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: []
        };
    }

    componentDidMount() {
        this.setState({ messageList: messageListExpl });
    }

    renderList() {
        return this.state.messageList.map((item, key) => (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    this.props.navigation.navigate('MessageForm', { messageItem: item });
                }}>
                <ListItem
                    roundAvatar
                    avatar={require('../assets/images/TeachPlus_Logo.png')}
                    title={item.to}
                    rightTitle={item.messages[0].sentOn}
                    subtitle={item.messages[0].message}
                />
            </TouchableOpacity>
        ));
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <List containerStyle={{ marginTop: 0 }}>
                    {
                        this.renderList()
                    }
                </List>

                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#8BC34A' }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('MessageableList')}>
                        <Icon name="message" type='Entypo' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            </View>
        );
    }
}

export default MessageList;
