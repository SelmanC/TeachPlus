import React, { Component } from 'react';
import { Clipboard, Alert, View } from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { addMessage } from './actions';

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageItem: {}
        };
    }

    componentWillMount() {
        const messageItem = this.props.navigation.getParam('messageItem', {});
        this.setState({ messageItem });
    }

    onSend(messages = []) {
        const { messageItem } = this.state;
        messageItem.messages = GiftedChat.append(messageItem.messages, messages);
        this.setState({ messageItem });

        this.props.addMessage(messages[0], this.props.messageList, messageItem.to, this.props.user);
    }

    onLongPress(contect, message) {
        if (message.text) {
            Alert.alert(
                'Nachricht kopieren',
                'Soll Nachricht kopiert werden?',
                [
                    { text: 'OK', onPress: () => Clipboard.setString(message.text) },
                    { text: 'Abbrechen', onPress: () => { }, style: 'cancel' }
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        if (this.props.user.role === 'teacher' || this.props.user.role === 'admin' || (this.props.user.role === 'parent' && this.state.messageItem.to.role === 'teacher')) {
            return (
                <GiftedChat
                    messages={this.state.messageItem.messages}
                    renderAvatar={null}
                    onLongPress={this.onLongPress}
                    onSend={(messages) => this.onSend(messages)}
                    placeholder='Nachricht angeben'
                    user={{ ...this.props.user, _id: this.props.user.id }}
                    parsePatterns={linkStyle => [
                        {
                            pattern: /#(\w+)/,
                            style: { ...linkStyle, color: 'lightgreen' },
                        },
                    ]}
                />
            );
        }
        return (
            <GiftedChat
                messages={this.state.messageItem.messages}
                renderAvatar={null}
                onLongPress={this.onLongPress}
                onSend={(messages) => this.onSend(messages)}
                placeholder='Nachricht angeben'
                user={{ ...this.props.user, _id: this.props.user.id }}
                renderInputToolbar={() => <View />}
                parsePatterns={linkStyle => [
                    {
                        pattern: /#(\w+)/,
                        style: { ...linkStyle, color: 'lightgreen' },
                    },
                ]}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        messageList: state.home.messageList
    };
};

export default connect(mapStateToProps, {
    addMessage
})(MessageForm);
