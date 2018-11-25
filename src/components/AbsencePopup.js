import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Card, Button, ButtonGroup, FormInput, CheckBox } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { segmentOptions, segmentMap } from '../other';
import { GlobalStyles } from '../styles';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const defaultValue = {
    selectedOption: null,
    minutes: '',
    comment: '',
    type: '',
    id: null
};

class AbsencePopup extends Component {
    constructor(props) {
        super(props);
        this.state = { ...defaultValue };
    }

    getPopupTitle() {
        const { student, selectedDay, selectedMonth } = this.props;
        const name = student ? `${student.name} ${student.lastname}` : '';
        return `${name} - ${selectedDay}.${selectedMonth}`;
    }

    setPopupSelectedOption(selectedOption) {
        this.setState({ selectedOption });
    }

    setPopupMinuteOption(minutes) {
        this.setState({ minutes });
    }

    setPopupCommentOption(comment) {
        this.setState({ comment });
    }

    setPopupEntschuldigtOption() {
        this.setState({ type: this.state.type === 'E' ? '' : 'E' });
    }

    setNewTypeValue() {
        const { minutes, selectedOption, type, comment, id } = this.state;
        const data = { type: segmentMap[selectedOption].val, comment, id };
        if (segmentMap[selectedOption].val === 'VP') {
            data['minutes'] = minutes;
        } else if (segmentMap[selectedOption].val === 'F' && type === 'E') {
            data['type'] = 'E';
        }
        this.props.onAbsenceChanged(data);


        this.setState({ ...defaultValue });
    }

    renderPopupFields() {
        const { selectedOption, minutes, type } = this.state;

        if (segmentOptions[selectedOption] === 'Verspätung') {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <FormInput
                        onChangeText={this.setPopupMinuteOption.bind(this)}
                        containerStyle={{ width: 50, marginRight: 0 }}
                        value={minutes}
                        maxLength={3}
                        textAlign={'center'}
                        inputStyle={{ color: 'black', width: 50 }} 
                        underlineColorAndroid='#a09f9f' />
                    <Text>Minuten</Text>
                </View>
            );
        } else if (segmentOptions[selectedOption] === 'Fehlend') {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <CheckBox
                        center
                        title='Entschuldigt'
                        checked={type === 'E'}
                        onPress={this.setPopupEntschuldigtOption.bind(this)}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            <PopupDialog
                dialogTitle={<DialogTitle title={this.getPopupTitle()} />}
                ref={(popupDialog) => this.props.onRef(popupDialog)}
                dialogAnimation={slideAnimation}
                dismissOnTouchOutside={false}
                onDismissed={() => this.setState({ ...defaultValue })}
                height={0.7}
                onShown={() => this.setState({
                    selectedOption: this.props.selectedCell.selectedOption,
                    comment: this.props.selectedCell.comment,
                    type: this.props.selectedCell.type,
                    subject: this.props.selectedCell.subject,
                    minutes: this.props.selectedCell.minutes,
                    id: this.props.selectedCell.id
                })}
            >
                <View style={{ paddingTop: 10, paddingBottom: 10, flex: 1 }}>
                    <ButtonGroup
                        selectedIndex={this.state.selectedOption}
                        onPress={this.setPopupSelectedOption.bind(this)}
                        buttons={segmentOptions}
                        innerBorderStyle={{ color: 'white' }}
                        containerStyle={{ borderColor: '#4C3E54' }}
                        buttonStyle={{ backgroundColor: '#4C3E54' }}
                        selectedButtonStyle={{ backgroundColor: 'white' }}
                        textStyle={{ color: 'white' }}
                        selectedTextStyle={{ color: '#4C3E54' }}
                        underlayColor='white' />
                    <Card containerStyle={{ marginTop: 0, padding: 10, alignItems: 'center', flex: 1 }}>
                        {
                            this.renderPopupFields()
                        }
                        <View style={{ justifyContent: 'space-around', flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Notiz</Text>
                            <TextInput
                                multiline
                                numberOfLines={5}
                                value={this.state.comment}
                                placeholder='Geben Sie ihre Nachricht ein'
                                onChangeText={this.setPopupCommentOption.bind(this)}
                                style={GlobalStyles.textAreaStyle}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button
                                title='Speichern'
                                rounded
                                backgroundColor='#4C3E54'
                                color='white'
                                textStyle={{ fontWeight: 'bold', fontSize: 14 }}
                                onPress={this.setNewTypeValue.bind(this)} />
                            <Button
                                title='Abbrechen'
                                rounded
                                backgroundColor='#4C3E54'
                                color='white'
                                textStyle={{ fontWeight: 'bold', fontSize: 14 }}
                                onPress={() => {
                                    this.props.onCancelPressed();
                                    this.setState({ ...defaultValue });
                                }} />
                        </View>
                    </Card>
                </View>
            </PopupDialog>
        );
    }
}

export { AbsencePopup };
