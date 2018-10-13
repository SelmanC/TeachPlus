import React, { Component } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Header, Icon, } from 'react-native-elements';

class ModalWithHeader extends Component {
    renderHeaderRightButtons(renderHeaderDeleteButton, renderHeaderRighItem) {
        if (renderHeaderRighItem !== false) {
            return (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {
                        renderHeaderDeleteButton &&
                        <TouchableOpacity
                            onPress={() => this.props.onDelete()} >
                            <Icon name='delete' size={30} color='white' containerStyle={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity
                        onPress={() => this.props.onSave()} >
                        <Icon name='check' type='entypo' size={30} color='white' />
                    </TouchableOpacity>
                </View>
            );
        }

        return <View />;
    }

    renderLeftIcon(leftIcon) {
        if (leftIcon) {
            return leftIcon;
        }

        return (
            <Icon
                name={'chevron-left'}
                size={30}
                color='white'
                containerStyle={{ marginTop: 10 }} />
        );
    }

    render() {
        const { isVisible, onCancel, headerText, onDismiss, onShow, renderHeaderDeleteButton, renderHeaderRighItem, leftIcon } = this.props;

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={isVisible}
                onDismiss={() => {
                    if (onDismiss) onDismiss();
                }}
                onShow={() => {
                    if (onShow) onShow();
                }}>
                <Header
                    backgroundColor='#4C3E54'
                    leftComponent={(
                        <TouchableOpacity
                            onPress={() => onCancel()}>
                            {
                                this.renderLeftIcon(leftIcon)
                            }
                        </TouchableOpacity>
                    )}
                    centerComponent={{ text: headerText, style: { color: 'white', fontWeight: 'bold', fontSize: 20 } }}
                    rightComponent={this.renderHeaderRightButtons(renderHeaderDeleteButton, renderHeaderRighItem)}
                />
                {this.props.children}
            </Modal>
        );
    }

}

export { ModalWithHeader };
