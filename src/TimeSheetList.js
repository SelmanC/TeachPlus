import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Container, Content, Text, Fab, Icon, Form, Item, Input, Label } from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { DottedList } from './components';
import { timeSheetsExpl } from './other';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class TimeSheetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            copyTimeSheetCell: null,
            popupTextInputValue: '',
            timeSheets: []
        };
    }

    componentDidMount() {
        this.setState({ timeSheets: timeSheetsExpl });
    }

    createNewTimeSheet() {
        const { copyTimeSheetCell, timeSheets, popupTextInputValue } = this.state;
        let timeSheet = {};
        if (copyTimeSheetCell !== null) {
            timeSheet = Object.assign([], timeSheets[copyTimeSheetCell]);
            timeSheet.Name = popupTextInputValue;
            timeSheet.id = null;
        } else {
            timeSheet = { Name: popupTextInputValue, id: null, timeSheet: { columns: [] } };
        }
        timeSheets.push(timeSheet);
        this.setState({ copyTimeSheetCell: null, timeSheets, popupTextInputValue: '' });

        this.popupDialog.dismiss();
        this.props.navigation.navigate('TimeSheet', { timeSheet: Object.assign({}, timeSheet) });
    }

    renderTimeSheets() {
        return (
            <DottedList
                listData={this.state.timeSheets}
                onListItemPressed={(timeSheet) => this.props.navigation.navigate('TimeSheet', {
                    timeSheet
                })}
                onCopyPressed={(cell) => {
                    this.setState({
                        copyTimeSheetCell: cell
                    });
                    this.popupDialog.show();
                }}
                onDeletePressed={(cell) => {
                    this.state.timeSheets.splice(cell, 1);
                    this.setState({
                        timeSheets: this.state.timeSheets
                    });
                }}
            />
        );
    }

    render() {
        return (
            <Container>
                <Content bounces={false} >

                    {
                        this.renderTimeSheets()
                    }

                    <PopupDialog
                        ref={popupDialog => { this.popupDialog = popupDialog; }}
                        dialogAnimation={slideAnimation}
                        height={0.3}
                        onDismissed={() => this.setState({ popupTextInputValue: '', copyTimeSheetCell: null })}
                    >
                        <View style={{ marginTop: 20, marginLeft: 20, flex: 1 }}>

                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Neuer Stundenplan</Text>

                            <Form style={{ width: 300, alignItems: 'center', justifyContent: 'center' }}>
                                <Item floatingLabel>
                                    <Label>Name</Label>
                                    <Input
                                        value={this.state.popupTextInputValue}
                                        onChangeText={(value) => this.setState({ popupTextInputValue: value })} />
                                </Item>
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

            </Container >
        );
    }
}

export default TimeSheetList;
