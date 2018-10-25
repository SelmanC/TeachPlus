import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { SubjectPopup } from './components';
import { LocaleConfigDE, createTimeString, createBeginTimeString, createEndTimeString } from './other';
import { addTimeSheetTimeDataColumn, addTimeSheetTimeDataRow, retriveTeacher, deleteStundenplanData } from './actions';

const minColumns = 9;
const dataWidth = 90;
const dataHeight = 60;
const defaultLengthPerSubject = 45;

const defaultValueCelectedCourse = {
    id: null,
    subject: '',
    teacher: {
        id: null,
        name: ''
    },
    room: '',
    color: 'white'
};

const defaultSelectedColumn = {
    id: null,
    timesheetColumn: null,
    startTime: '',
    endTime: ''
};

const defaultSelectedRow = {
    id: null,
    timesheetRow: null
};

class TimeSheet extends Component {
    constructor(props) {
        super(props);
        const days = [' ', ...LocaleConfigDE.dayNamesShort];
        const headWidthArr = [];
        days.forEach(() => headWidthArr.push(dataWidth));

        this.state = {
            selectedColumn: Object.assign({}, defaultSelectedColumn),
            selectedRow: Object.assign({}, defaultSelectedRow),
            selectedCourse: Object.assign({}, defaultValueCelectedCourse),
            days,
            headWidthArr,
            isDateTimePickerVisible: false,
            isDateTimePickerForBegin: true,
        };
    }

    componentDidMount() {
        this.props.retriveTeacher();
    }

    onColumnTimeChanged(date) {
        const { isDateTimePickerForBegin, selectedColumn } = this.state;
        const timeString = createTimeString(date.getHours(), date.getMinutes());
        let startTime = '';
        let endTime = '';

        if (isDateTimePickerForBegin) {
            startTime = timeString;
            endTime = selectedColumn.endTime ? selectedColumn.endTime : createEndTimeString(date, defaultLengthPerSubject);
        } else {
            endTime = timeString;
            startTime = selectedColumn.startTime ? selectedColumn.startTime : createBeginTimeString(date, defaultLengthPerSubject);
        }
        selectedColumn.startTime = startTime;
        selectedColumn.endTime = endTime;

        this.props.addTimeSheetTimeDataColumn(this.props.currTimeSheet, this.props.timeSheetList, selectedColumn);

        this.setState({
            isDateTimePickerForBegin: true,
            isDateTimePickerVisible: false,
            selectedColumn: Object.assign({}, defaultSelectedColumn)
        });
    }

    getFirstRowName(subjectData) {
        if (subjectData.startTime || subjectData.endTime) {
            return `${subjectData.startTime}\n - \n${subjectData.endTime}`;
        }

        return `${subjectData.timesheetColumn + 1}`;
    }

    getTimePickerDateValue() {
        const { selectedColumn, isDateTimePickerForBegin } = this.state;
        let returnDate = new Date();

        if (selectedColumn) {
            const currDate = new Date();
            const time = isDateTimePickerForBegin ? selectedColumn.startTime : selectedColumn.endTime;
            if (time) {
                const splitTime = time.split(':');

                returnDate = new Date(
                    currDate.getFullYear(),
                    currDate.getMonth(),
                    currDate.getDate(),
                    splitTime[0],
                    splitTime[1]
                );
            }
        }
        return returnDate;
    }

    isTeacherOrAdmin() {
        return this.props.user.role === 'teacher' || this.props.user.role === 'admin';
    }

    saveSubject(subjectData) {
        const { selectedColumn, selectedRow } = this.state;

        selectedRow.subjectData = [subjectData];
        this.props.addTimeSheetTimeDataRow(this.props.currTimeSheet, this.props.timeSheetList, selectedColumn, selectedRow);
        this.setState({
            selectedCourse: Object.assign({}, defaultValueCelectedCourse),
            selectedColumn: Object.assign({}, defaultSelectedColumn),
            selectedRow: Object.assign({}, defaultSelectedRow)
        });

        this.popupDialog.dismiss();
    }

    deleteSubject() {
        const { selectedColumn, selectedRow, selectedCourse } = this.state;
        this.props.deleteStundenplanData(this.props.currTimeSheet, this.props.timeSheetList, selectedColumn, selectedRow, selectedCourse);
        this.popupDialog.dismiss();
    }

    renderAlertMessageForTime(column) {
        Alert.alert(
            'Uhrzeit',
            'Welche Uhrzeit möchten Sie gerne ändern?',
            [
                {
                    text: 'Beginn',
                    onPress: () => {
                        const selCol = this.props.currTimeSheet.timeColumns.find(e => e.timesheetColumn === column);

                        this.setState({
                            isDateTimePickerVisible: true,
                            isDateTimePickerForBegin: true,
                            selectedColumn: !selCol ? { ...defaultSelectedColumn, timesheetColumn: column } : selCol
                        });
                    }
                },
                {
                    text: 'Ende',
                    onPress: () => {
                        const selCol = this.props.currTimeSheet.timeColumns.find(e => e.timesheetColumn === column);
                        this.setState({
                            isDateTimePickerVisible: true,
                            isDateTimePickerForBegin: false,
                            selectedColumn: !selCol ? { ...defaultSelectedColumn, timesheetColumn: column } : selCol
                        });
                    }
                },
                {
                    text: 'Abrechen',
                    onPress: () => { },
                    style: 'cancel'
                },
            ],
            { cancelable: false }
        );
    }

    renderSubjectsAtSameTime(selectedColumn, selectedRow, selectedCourse, subjectLengthAtSameTime, key) {
        return (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    if (this.isTeacherOrAdmin()) {
                        this.setState({
                            selectedCourse,
                            selectedColumn,
                            selectedRow
                        });
                        this.popupDialog.show();
                    }
                }}>
                <Cell
                    key={key}
                    data={selectedCourse.subject}
                    textStyle={[
                        styles.textStyle,
                        {
                            fontWeight: 'bold',
                            color: selectedCourse['color'] !== 'white' ? 'white' : 'black'
                        }
                    ]}
                    style={[
                        styles.cellStyle,
                        {
                            width: dataWidth / subjectLengthAtSameTime,
                            backgroundColor: selectedCourse['color']
                        }
                    ]} />
            </TouchableOpacity>
        );
    }

    renderSubjectCells(column) {
        const renderedData = [];
        let key = 1;
        for (let i = 0; i < this.state.days.length - 1; i++) {
            const row = column.rows.find(r => r.timesheetRow === i);
            if (row && row.subjectData.length > 0) {
                for (let y = 0; y < row.subjectData.length; y++) {
                    renderedData.push(this.renderSubjectsAtSameTime(column, row, row.subjectData[y], row.subjectData.length, key++));
                }
            } else if (row) {
                renderedData.push(this.renderSubjectsAtSameTime(column, row, Object.assign({}, defaultValueCelectedCourse), 1, key++));
            } else {
                renderedData.push(this.renderSubjectsAtSameTime(column, { ...defaultSelectedRow, timesheetRow: i }, Object.assign({}, defaultValueCelectedCourse), 1, key++));
            }
        }
        return renderedData;
    }

    renderSubjectAndTimeRow(column) {
        return (
            <TableWrapper
                key={column.timesheetColumn}
                style={{ flexDirection: 'row' }}
            >
                <TouchableOpacity
                    key={column.timesheetColumn}
                    onPress={() => {
                        if (this.isTeacherOrAdmin()) {
                            this.renderAlertMessageForTime(column.timesheetColumn);
                        }
                    }}>
                    <Cell
                        key={0}
                        data={this.getFirstRowName(column)}
                        textStyle={[styles.textStyle]}
                        style={[styles.cellStyle]} />
                </TouchableOpacity>
                {
                    this.renderSubjectCells(column)
                }
            </TableWrapper>
        );
    }

    renderRowWithNoValueForOneDay(column, row, key) {
        return (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    if (this.isTeacherOrAdmin()) {
                        this.setState({
                            selectedCourse: Object.assign({}, defaultValueCelectedCourse),
                            selectedColumn: { ...this.state.selectedColumn, timesheetColumn: column },
                            selectedRow: { ...this.state.selectedRow, timesheetRow: row }
                        });
                        this.popupDialog.show();
                    }
                }}>
                <Cell
                    key={key}
                    data=' '
                    textStyle={[styles.textStyle]}
                    style={styles.cellStyle} />
            </TouchableOpacity>
        );
    }

    renderRowWithNoValueForAllDays(column) {
        const rows = [];
        for (let i = 0; i < this.state.days.length - 1; i++) {
            rows.push(this.renderRowWithNoValueForOneDay(column, i, i + 1));
        }
        return rows;
    }

    renderRowWithNoValue(column) {
        return (
            <TableWrapper
                key={column}
                style={{ flexDirection: 'row' }}
            >
                <TouchableOpacity
                    key={column}
                    onPress={() => {
                        if (this.isTeacherOrAdmin()) {
                            this.renderAlertMessageForTime(column);
                        }
                    }}>
                    <Cell
                        key={0}
                        data={`${column + 1}`}
                        textStyle={[styles.textStyle]}
                        style={[styles.cellStyle]} />
                </TouchableOpacity>
                {
                    this.renderRowWithNoValueForAllDays(column)
                }
            </TableWrapper>
        );
    }

    renderRows() {
        const { timeColumns } = this.props.currTimeSheet;
        const rowData = [];
        for (let i = minColumns - 1; i >= 0; i--) {
            const column = timeColumns.find(col => col.timesheetColumn === i);
            if (column) {
                rowData.push(this.renderSubjectAndTimeRow(column));
            } else {
                rowData.push(this.renderRowWithNoValue(i));
            }
        }
        return rowData;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView
                    bounces={false}
                    style={{ flex: 1 }}
                    ref={ref => { this.scrollView = ref; }}
                    onContentSizeChange={() => {
                        this.scrollView.scrollToEnd({ animated: false });
                    }}>

                    <SubjectPopup
                        selectedItem={this.state.selectedCourse}
                        onRef={(popupDialog) => { this.popupDialog = popupDialog; }}
                        onSavePressed={(data) => { this.saveSubject(data); }}
                        onDelteSubject={() => { this.deleteSubject(); }}
                        teachers={this.props.teachers}
                        onCancelPressed={() => {
                            this.setState({
                                selectedCourse: Object.assign({}, defaultValueCelectedCourse),
                                selectedColumn: Object.assign({}, defaultSelectedColumn),
                                selectedRow: Object.assign({}, defaultSelectedRow)
                            });
                            this.popupDialog.dismiss();
                        }} />

                    {this.state.isDateTimePickerVisible &&
                        <DateTimePicker
                            mode='time'
                            cancelTextIOS='Abbrechen'
                            confirmTextIOS='OK'
                            is24Hour
                            minuteInterval={5}
                            titleIOS={this.state.isDateTimePickerForBegin ? 'Beginnzeit' : 'Endzeit'}
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.onColumnTimeChanged.bind(this)}
                            date={this.getTimePickerDateValue()}
                            onCancel={() => this.setState({
                                isDateTimePickerForBegin: true,
                                isDateTimePickerVisible: false,
                                selectedColumn: Object.assign({}, defaultSelectedColumn)
                            })}
                        />}

                    <View style={{ flex: 1 }}>
                        <ScrollView horizontal bounces={false} ref={(scroller) => { this.scroller = scroller; }} >
                            <Table borderStyle={{ borderColor: 'black', borderWidth: 1 }} style={{ flex: 1 }} >
                                <TableWrapper style={{ flexDirection: 'column' }}>
                                    {
                                        this.renderRows()
                                    }
                                    <Row
                                        data={this.state.days}
                                        widthArr={this.state.headWidthArr}
                                        style={styles.headerStyle}
                                        textStyle={[styles.titleTextStyle, { color: 'white' }]} />
                                </TableWrapper>
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        fontWeight: '100',
        fontSize: 14
    },
    titleTextStyle: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold'
    },
    titleTableStyle: {
        alignItems: 'center'
    },
    headerStyle: {
        height: dataHeight,
        backgroundColor: '#4C3E54',
        borderBottomWidth: 0
    },
    wrapper: {
        flexDirection: 'row',
        flex: 1
    },
    titleStyle: {
        width: dataWidth,
        height: dataHeight,
        backgroundColor: 'white',
    },
    cellStyle: {
        height: dataHeight,
        backgroundColor: 'white',
        width: dataWidth
    }
});

const mapStateToProps = state => {
    return {
        currTimeSheet: state.home.currTimeSheet,
        timeSheetList: state.home.timeSheetList,
        error: state.home.error,
        teachers: state.home.teachers,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    addTimeSheetTimeDataColumn,
    addTimeSheetTimeDataRow,
    retriveTeacher,
    deleteStundenplanData
})(TimeSheet);

