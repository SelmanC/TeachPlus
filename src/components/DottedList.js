import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { List, ListItem, Icon } from 'react-native-elements';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class DottedList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedColumn: null
        };
    }

    renderDotIcon(key) {
        if (this.props.showDots !== false) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ selectedColumn: key });
                        this.popupDialog.show();
                    }}>
                    <Icon
                        name='dots-three-vertical'
                        type='entypo'
                        size={20}
                        color='#a09f9f' />
                </TouchableOpacity>
            );
        }
        return <View />;
    }

    renderListItems() {
        return this.props.listData.map((listIem, key) => (
            <TouchableOpacity
                key={key}
                onPress={() => this.props.onListItemPressed(listIem)}>
                <ListItem
                    title={listIem.name}
                    subtitle={listIem.groupClass ? `Klasse: ${listIem.groupClass.name}` : ''}
                    rightIcon={this.renderDotIcon(key)} />
            </TouchableOpacity>
        ));
    }

    render() {
        return (
            <List containerStyle={{ marginTop: 0, flex: 1 }}>
                {
                    this.renderListItems()
                }
                <PopupDialog
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    onDismissed={() => this.setState({ selectedColumn: null })}
                    height={170}
                    containerStyle={{ justifyContent: 'flex-end' }}
                >
                    <List containerStyle={{ marginTop: 0 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.popupDialog.dismiss();
                                this.props.onCopyPressed(this.state.selectedColumn);
                            }}>
                            <ListItem
                                hideChevron
                                leftIcon={
                                    <Icon active name="copy" type='feather' />
                                }
                                titleContainerStyle={{ marginLeft: 10 }}
                                title='Kopieren' />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.popupDialog.dismiss();
                                this.props.onDeletePressed(this.state.selectedColumn);
                            }}>
                            <ListItem
                                hideChevron
                                leftIcon={
                                    <Icon active name="delete" type='material-icons' />
                                }
                                titleContainerStyle={{ marginLeft: 10 }}
                                title='Löschen' />
                        </TouchableOpacity>
                    </List>
                </PopupDialog>
            </List>

        );
    }
}

export { DottedList };
