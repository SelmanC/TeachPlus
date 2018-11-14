import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FormInput } from 'react-native-elements';
import { Container, Content, Text, Fab, Icon, Form, Item, Input, Label } from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { DottedList, ListModal } from './components';
import { addTimeSheet, retrieveAllTimesheets, deleteStundenplan, selectTimeSheet, removeError } from './actions';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const defaultSelectedItem = {
    id: null,
    name: '',
    groupClass: {
        id: null,
        name: ''
    },
    timeColumns: []
};

class TimeSheetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: Object.assign({}, defaultSelectedItem),
            copyTimeSheetCell: null,
            isClassChooserModalVisible: false
        };
    }

    componentDidMount() {
        const groupId = this.props.groups.map(e => e.id);
        this.props.retrieveAllTimesheets(groupId);
    }

    createNewTimeSheet() {
        const { copyTimeSheetCell, selectedItem } = this.state;
        let timeSheet = {};

        if (copyTimeSheetCell !== null) {
            timeSheet = Object.assign([], this.props.timeSheetList[copyTimeSheetCell]);
            timeSheet.name = selectedItem.name;
            timeSheet.groupClass = selectedItem.groupClass;
        } else {
            timeSheet = selectedItem;
        }

        this.props.addTimeSheet(timeSheet, this.props.timeSheetList);

        this.setState({
            copyTimeSheetCell: null,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });

        this.popupDialog.dismiss();
    }

    renderTimeSheets() {
        return (
            <DottedList
                listData={this.props.timeSheetList}
                showDots={this.props.user.role === 'teacher'}
                onListItemPressed={(timeSheet) => {
                    this.props.selectTimeSheet(timeSheet);
                    this.props.navigation.navigate('TimeSheet', { timeSheet });
                }}
                onCopyPressed={(cell) => {
                    this.setState({
                        copyTimeSheetCell: cell
                    });
                    this.popupDialog.show();
                }}
                onDeletePressed={(cell) => {
                    this.props.deleteStundenplan(this.props.timeSheetList[cell], this.props.timeSheetList);
                }}
            />
        );
    }

    renderAddFab() {
        if (this.props.user.role === 'teacher' || this.props.user.role === 'admin') {
            return (
                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#8BC34A' }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => this.popupDialog.show()}>
                        <Icon name="add" type='MaterialIcons' style={{ color: 'white' }} />
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
            <Container>
                <Content bounces={false} >

                    {
                        this.renderTimeSheets()
                    }

                    <PopupDialog
                        ref={popupDialog => { this.popupDialog = popupDialog; }}
                        dialogAnimation={slideAnimation}
                        height={0.4}
                        onDismissed={() => this.setState({
                            selectedItem: Object.assign({}, defaultSelectedItem),
                            copyTimeSheetCell: null
                        })} >
                        <View style={{ marginTop: 20, marginLeft: 20, flex: 1 }}>

                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Neuer Stundenplan</Text>

                            <Form style={{ width: 300, alignItems: 'center', justifyContent: 'center' }}>
                                <Item floatingLabel>
                                    <Label>Name</Label>
                                    <Input
                                        value={this.state.selectedItem.name}
                                        onChangeText={(value) => this.setState({ selectedItem: { ...this.state.selectedItem, name: value } })} />
                                </Item>

                                <TouchableOpacity
                                    onPress={() => this.setState({ isClassChooserModalVisible: true })} >
                                    <FormInput
                                        placeholder='Klasse'
                                        value={this.state.selectedItem.groupClass.name}
                                        containerStyle={styles.containerFormInputStyle}
                                        editable={false}
                                        pointerEvents="none"
                                        placeholderTextColor='#828080'
                                        inputStyle={styles.formInputFieldStyle} />
                                </TouchableOpacity>
                            </Form>

                            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20, marginRight: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                    <TouchableOpacity
                                        onPress={() => this.popupDialog.dismiss()}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                        <Text style={{ fontSize: 16, color: '#FFC107', marginRight: 10 }}>Abbrechen</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => this.createNewTimeSheet()}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                        <Text style={{ fontSize: 16, color: '#FFC107', marginRight: 5 }}>Erstellen</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </PopupDialog>
                </Content>


                <ListModal
                    isVisible={this.state.isClassChooserModalVisible}
                    renderedItems={this.props.groups}
                    headerText='Klasse wählen'
                    onCancel={() => this.setState({ isClassChooserModalVisible: false })}
                    onSave={(classData) => this.setState({
                        selectedItem: {
                            ...this.state.selectedItem, groupClass: classData
                        },
                        isClassChooserModalVisible: false
                    })} />

                {
                    this.renderAddFab()
                }
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    containerFormInputStyle: {
        width: 285,
        marginTop: 20,
        alignSelf: 'center',
        marginLeft: 38
    },
    formInputFieldStyle: {
        fontSize: 18,
        color: 'black'
    },
});

const mapStateToProps = state => {
    return {
        groups: state.auth.groups,
        timeSheetList: state.home.timeSheetList,
        error: state.home.error,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    retrieveAllTimesheets,
    addTimeSheet,
    deleteStundenplan,
    selectTimeSheet,
    removeError
})(TimeSheetList);
