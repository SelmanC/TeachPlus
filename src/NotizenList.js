
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem, Avatar, Divider } from 'react-native-elements';
import { Fab, Icon } from 'native-base';
import { NotizModal } from './components';
import { retrieveNotes, addNotes, deleteNotes } from './actions';

const defaultSelectedItem = {
    id: null,
    title: '',
    subject: '',
    note: '',
    finished: false
};

class NotizenList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        };
    }

    componentDidMount() {
        this.props.retrieveNotes(this.props.user.id);
    }

    onDelete() {
        this.props.deleteNotes(this.state.selectedItem, this.props.notesData);

        this.setState({
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    onSave(newSelectedItem) {
        this.props.addNotes(newSelectedItem, this.props.notesData, this.props.user);

        this.setState({
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    renderNotesList(finished, avatarColor) {
        return this.props.notesData.filter(e => e.finished === finished).map((note, key) => (
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
                            title={note.subject ? note.subject.substring(0, 2).toUpperCase() : '/'}
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
                    this.props.notesData.filter(e => e.finished).length > 0 &&
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

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        showSpinner: state.home.showSpinner,
        notesData: state.home.notesData
    };
};

export default connect(mapStateToProps, {
    retrieveNotes,
    addNotes,
    deleteNotes
})(NotizenList);
