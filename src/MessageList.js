import React, { Component } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { Fab, Icon } from 'native-base';
import { retrieveAllMessages, messagesSelected } from './actions';

class MessageList extends Component {
    componentDidMount() {
        const groupId = this.props.groups.map(e => e.id);
        this.props.retrieveAllMessages(this.props.user.id, groupId);
    }

    getName(item) {
        return item.to.id === this.props.user.id ? item.from.name : item.to.name;
    }

    renderList() {
        return Object.keys(this.props.messageList).map((item, key) => (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    this.props.navigation.navigate('MessageForm', { messageItem: Object.assign({}, this.props.messageList[item]) });
                }}>
                <ListItem
                    roundAvatar
                    avatar={require('../assets/images/TeachPlus_Logo.png')}
                    title={this.getName(this.props.messageList[item])}
                    rightTitle={this.props.messageList[item].messages[0].createdOn}
                    subtitle={this.props.messageList[item].messages[0].text}
                />
            </TouchableOpacity>
        ));
    }

    renderAddFab() {
        if (this.props.user.role !== 'student') {
            return (
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
            );
        }
    }

    render() {
        if (this.props.error) {
            Alert.alert(
                'Error',
                this.props.error,
                [
                    { text: 'OK', onPress: () => this.props.removeError() },
                ],
                { cancelable: false }
            );
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <List containerStyle={{ marginTop: 0 }}>
                    {
                        this.renderList()
                    }
                </List>

                {
                    this.renderAddFab()
                }
                
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        groups: state.auth.groups,
        user: state.auth.user,
        messageList: state.home.messageList
    };
};

export default connect(mapStateToProps, {
    retrieveAllMessages,
    messagesSelected
})(MessageList);
