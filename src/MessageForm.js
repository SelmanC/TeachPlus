import React, { Component } from 'react';
import { Clipboard, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

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
        this.state.messageItem.messages = GiftedChat.append(this.state.messageItem.messages, messages);
        this.setState({ messageItem: this.state.messageItem });
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
        return (
            <GiftedChat
                messages={this.state.messageItem.messages}
                renderAvatar={null}
                onLongPress={this.onLongPress}
                onSend={(messages) => this.onSend(messages)}
                placeholder='Nachricht angeben'
                user={{
                    _id: 1,
                }}
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

export default MessageForm;
