
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { List, ListItem, Avatar, Divider } from 'react-native-elements';
import { Fab, Icon } from 'native-base';
import { NotizModal } from './components';
import { NotesDataExpl } from './other';

const defaultSelectedItem = {
    id: null,
    title: '',
    subject: {
        name: '',
        id: null
    },
    note: '',
    finished: false
};

class NotizenList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notesData: [],
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        };
    }

    componentDidMount() {
        this.setState({
            notesData: NotesDataExpl
        });
    }

    onDelete() {
        const { selectedItem, notesData } = this.state;
        const noteIndex = notesData.findIndex(e => e.id === selectedItem.id);
        notesData.splice(noteIndex, 1);
        this.setState({
            notesData,
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    onSave(newSelectedItem) {
        const { selectedItem, notesData } = this.state;

        if (selectedItem.id) {
            const noteIndex = notesData.findIndex(e => e.id === selectedItem.id);
            notesData[noteIndex] = newSelectedItem;
        } else {
            notesData.push(newSelectedItem);
        }

        this.setState({
            notesData,
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    renderNotesList(finished, avatarColor) {
        const { notesData } = this.state;

        return notesData.filter(e => e.finished === finished).map((note, key) => (
            <TouchableOpacity
                key={key}
                onPress={() => this.setState({
                    modalVisible: true,
                    selectedItem: note
                })}>
                <ListItem
                    avatar={
                        <Avatar
                            medium
                            title={note.subject.name ? note.subject.name.substring(0, 2).toUpperCase() : '/'}
                            overlayContainerStyle={{ backgroundColor: avatarColor }}
                            activeOpacity={0.7}
                        />
                    }
                    title={note.title}
                    subtitle={note.note} />
            </TouchableOpacity>
        ));
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <List containerStyle={{ marginTop: 0, borderBottomWidth: 0 }}>
                    {
                        this.renderNotesList(false, '#FF9800')
                    }
                </List>
                {
                    this.state.notesData.filter(e => e.finished).length > 0 &&
                    <View>
                        <Text style={{ fontWeight: 'bold', marginLeft: 5, marginTop: 10, fontSize: 15 }}>Erledigt</Text>

                        <Divider style={{ backgroundColor: '#e5e5e5', marginTop: 10 }} />
                        <List containerStyle={{ marginTop: 0, borderTopWidth: 0 }}>
                            {
                                this.renderNotesList(true, '#9E9E9E')
                            }
                        </List>
                    </ View>
                }

                <NotizModal
                    modalVisible={this.state.modalVisible}
                    onCancel={() => this.setState({
                        modalVisible: false,
                        selectedItem: Object.assign({}, defaultSelectedItem)
                    })}
                    onDelete={() => { this.onDelete(); }}
                    onSave={(selectedItem) => { this.onSave(selectedItem); }}
                    selectedItem={this.state.selectedItem} />

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

export default NotizenList;
