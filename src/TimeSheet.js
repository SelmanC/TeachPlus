import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { SubjectPopup } from './components';
import { LocaleConfigDE, createTimeString, createBeginTimeString, createEndTimeString } from './other';

const minColumns = 9;
const dataWidth = 90;
const dataHeight = 60;
const defaultLengthPerSubject = 45;

const defaultValueCelectedCourse = {
    selected: false,
    selectedColumn: null,
    selectedRow: null,
    selectedIndex: null,
    subject: '',
    teacher: '',
    location: '',
    startTime: '',
    endTime: ''
};

class TimeSheet extends Component {
    constructor(props) {
        super(props);
        const days = [' ', ...LocaleConfigDE.dayNamesShort];
        const headWidthArr = [];
        const timesheetData = this.props.navigation.getParam('timeSheet');

        days.forEach(() => headWidthArr.push(dataWidth));

        this.state = {
            selectedCourse: { ...defaultValueCelectedCourse },
            days,
            headWidthArr,
            timesheetData,
            isDateTimePickerVisible: false,
            isDateTimePickerForBegin: true,
            dataTimePickerColumn: null,
        };
    }

    onColumnTimeChanged(date) {
        const { isDateTimePickerForBegin, dataTimePickerColumn } = this.state;
        const data = this.state.timesheetData;
        const timeString = createTimeString(date.getHours(), date.getMinutes());
        const columnIndex = data.timeSheet.columns.findIndex(e => e.column === dataTimePickerColumn);
        if (columnIndex < 0) {
            const newColumn = {
                column: dataTimePickerColumn,
                startTime: isDateTimePickerForBegin ? timeString : createBeginTimeString(date, defaultLengthPerSubject),
                endTime: isDateTimePickerForBegin ? createEndTimeString(date, defaultLengthPerSubject) : timeString,
                rows: []
            };
            data.timeSheet.columns.push(newColumn);
        } else {
            data.timeSheet.columns[columnIndex][isDateTimePickerForBegin ? 'startTime' : 'endTime'] = timeString;
        }

        this.setState({
            isDateTimePickerForBegin: true,
            isDateTimePickerVisible: false,
            dataTimePickerColumn: null,
            timesheetData: data,
        });
    }

    getSelectedCourseObject(subjectData, startTime, endTime, column, row, index) {
        if (subjectData.pause) {
            return {
                ...defaultValueCelectedCourse,
                selected: true,
                pause: true,
                selectedColumn: column,
                selectedRow: row,
                selectedIndex: index,
                subject: subjectData.subject,
                color: subjectData.color ? subjectData.color : 'white',
                startTime,
                endTime
            };
        }
        return {
            ...defaultValueCelectedCourse,
            selected: true,
            pause: false,
            selectedColumn: column,
            selectedRow: row,
            selectedIndex: index,
            subject: subjectData.subject,
            teacher: subjectData.teacher,
            location: subjectData.room,
            color: subjectData.color ? subjectData.color : 'white',
            startTime,
            endTime
        };
    }

    getFirstRowName(subjectData) {
        if (subjectData.startTime || subjectData.endTime) {
            return `${subjectData.startTime}\n - \n${subjectData.endTime}`;
        }

        return `${subjectData.column + 1}`;
    }

    getTimePickerDateValue() {
        const { dataTimePickerColumn } = this.state;
        const data = this.state.timesheetData;
        let returnDate = new Date();

        if (dataTimePickerColumn !== null) {
            const column = data.timeSheet.columns.find(e => e.column === dataTimePickerColumn);
            if (column) {
                const currDate = new Date();
                const time = this.state.isDateTimePickerForBegin ? column.startTime : column.endTime;
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
        }
        return returnDate;
    }

    saveSubject(subjectData) {
        const { selectedColumn, selectedRow, selectedIndex } = this.state.selectedCourse;
        const data = this.state.timesheetData;
        const columnIndex = data.timeSheet.columns.findIndex(e => e.column === selectedColumn);

        if (columnIndex < 0) {
            const newColumn = {
                column: selectedColumn,
                startTime: '',
                endTime: '',
                rows: [{
                    row: selectedRow,
                    subjects: [subjectData]
                }]
            };
            data.timeSheet.columns.push(newColumn);
        } else if (selectedIndex !== null) {
            const rowIndex = data.timeSheet.columns[columnIndex].rows.findIndex(e => e.row === selectedRow);

            if (rowIndex < 0) {
                data.timeSheet.columns[columnIndex].rows.push({ row: selectedRow, subjects: [subjectData] });
            } else if (subjectData.addSubjectToArray) {
                data.timeSheet.columns[columnIndex].rows[rowIndex].subjects.push(subjectData);
            } else {
                data.timeSheet.columns[columnIndex].rows[rowIndex].subjects[selectedIndex] = subjectData;
            }
        } else {
            const rowIndex = data.timeSheet.columns[columnIndex].rows.findIndex(e => e.row === selectedRow);
            if (rowIndex < 0) {
                data.timeSheet.columns[columnIndex].rows.push({ row: selectedRow, subjects: [subjectData] });
            } else {
                data.timeSheet.columns[columnIndex].rows[rowIndex].subjects.push(subjectData);
            }
        }
        this.setState({ timesheetData: data });
        this.popupDialog.dismiss();
    }

    deleteSubject() {
        const { selectedColumn, selectedRow, selectedIndex } = this.state.selectedCourse;
        const data = this.state.timesheetData;

        const columnIndex = data.timeSheet.columns.findIndex(e => e.column === selectedColumn);
        const rowIndex = data.timeSheet.columns[columnIndex].rows.findIndex(e => e.row === selectedRow);
        data.timeSheet.columns[columnIndex].rows[rowIndex].subjects.splice(selectedIndex, 1);
        this.setState({ timesheetData: data });
        this.popupDialog.dismiss();
    }

    renderAlertMessageForTime(column) {
        Alert.alert(
            'Uhrzeit',
            'Welche Uhrzeit möchten Sie gerne ändern?',
            [
                {
                    text: 'Beginn',
                    onPress: () =>
                        this.setState({
                            isDateTimePickerVisible: true,
                            isDateTimePickerForBegin: true,
                            dataTimePickerColumn: column
                        })
                },
                {
                    text: 'Ende',
                    onPress: () =>
                        this.setState({
                            isDateTimePickerVisible: true,
                            isDateTimePickerForBegin: false,
                            dataTimePickerColumn: column
                        })
                },
                {
                    text: 'Abrechen',
                    onPress: () =>
                        this.setState({
                            isDateTimePickerVisible: true,
                            isDateTimePickerForBegin: false,
                            dataTimePickerColumn: column
                        }),
                    style: 'cancel'
                },
            ],
            { cancelable: false }
        );
    }

    renderSubjectsAtSameTime(selectedCourse, subjectLengthAtSameTime, key) {
        return (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    this.setState({ selectedCourse });
                    this.popupDialog.show();
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

    renderSubjectCells(subjectData) {
        const renderedData = [];
        let key = 1;
        for (let i = 0; i < this.state.days.length - 1; i++) {
            const row = subjectData.rows.find(r => r.row === i);
            if (row && row.subjects.length > 0) {
                for (let y = 0; y < row.subjects.length; y++) {
                    const selectedCourse = this.getSelectedCourseObject(row.subjects[y], subjectData.startTime, subjectData.endTime, subjectData.column, row.row, y);
                    renderedData.push(this.renderSubjectsAtSameTime(selectedCourse, row.subjects.length, key++));
                }
            } else {
                renderedData.push(this.renderRowWithNoValueForOneDay(subjectData.column, i, key++));
            }
        }
        return renderedData;
    }

    renderSubjectAndTimeRow(subjectData) {
        return (
            <TableWrapper
                key={subjectData.column}
                style={{ flexDirection: 'row' }}
            >
                <TouchableOpacity
                    key={subjectData.column}
                    onPress={() => { this.renderAlertMessageForTime(subjectData.column); }}>
                    <Cell
                        key={0}
                        data={this.getFirstRowName(subjectData)}
                        textStyle={[styles.textStyle]}
                        style={[styles.cellStyle]} />
                </TouchableOpacity>
                {
                    this.renderSubjectCells(subjectData)
                }
            </TableWrapper>
        );
    }

    renderRowWithNoValueForOneDay(column, row, key) {
        return (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    const selectedCourse = {
                        ...defaultValueCelectedCourse,
                        selectedColumn: column,
                        selectedRow: row
                    };
                    this.setState({ selectedCourse });
                    this.popupDialog.show();
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
                    onPress={() => { this.renderAlertMessageForTime(column); }}>
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
        const { columns } = this.state.timesheetData.timeSheet;
        const rowData = [];
        for (let i = minColumns - 1; i >= 0; i--) {
            if (!columns) {
                rowData.push(this.renderRowWithNoValue(i));
                continue;
            }
            const column = columns.find(col => col.column === i);
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
                        selectedCourse={this.state.selectedCourse}
                        onRef={(popupDialog) => { this.popupDialog = popupDialog; }}
                        onSavePressed={(data) => { this.saveSubject(data); }}
                        onDelteSubject={() => { this.deleteSubject(); }}
                        onCancelPressed={() => {
                            this.setState({
                                selectedCourse: { ...defaultValueCelectedCourse }
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
                                dataTimePickerColumn: null
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


export default TimeSheet;
