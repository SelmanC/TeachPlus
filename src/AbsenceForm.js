import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Col, Cell } from 'react-native-table-component';
import { Picker, Icon, Item } from 'native-base';
import { AbsencePopup } from './components';
import { getDaysInMonth, getDateObjectByMonth, segmentMap, segmentOptions, months, absenceData } from './other';

const titleWidth = 120;
const dataWidth = 50;
const dataHeight = 50;

const defaultSelectedCellValue = {
    studentIndex: null,
    dayIndex: null,
    selectedOption: 0,
    absenceValue: '',
    minutes: '',
    comment: '',
};

class AbsenceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            students: [],
            month: null,
            days: [],
            absence: [],
            absenceData: {},
            headWidthArr: [],
            headerHeightArr: [],
            selectedCell: defaultSelectedCellValue
        };
    }

    componentDidMount() {
        const students = absenceData.students.map(student => student.name);
        const currMonth = new Date();

        this.setState({ ...this.updateTableData(currMonth, absenceData), students: [' ', ...students], absenceData });
        this.scrollToToday();
    }

    setNewAbsenceValue(newData) {
        const { absence, selectedCell } = this.state;

        absence[selectedCell.studentIndex][selectedCell.dayIndex] = newData;
        this.setState({ absence, selectedCell: defaultSelectedCellValue });
        this.popupDialog.dismiss();
    }

    getSelectedStudentName() {
        return this.state.students[this.state.selectedCell.studentIndex + 1];
    }

    getSelectedDay() {
        return this.state.days[this.state.selectedCell.dayIndex];
    }

    updateMonthAndTableData(monthOption) {
        const monthIndex = months.findIndex(e => e.label === monthOption);
        const date = getDateObjectByMonth(monthIndex);
        this.setState({ ...this.updateTableData(date, this.state.absenceData) });
    }

    updateTableData(currMonth, tableData) {
        const actualMonth = new Date().getMonth();
        const currday = currMonth.getDate();
        const daysInMonth = getDaysInMonth(currMonth.getMonth(), currMonth.getFullYear());
        const headWidthArr = [];
        const absence = [];
        const daysArr = [];
        const headerHeightArr = [];

        for (let i = 1; i <= daysInMonth; i++) {
            daysArr.push(`${i}`);
            headWidthArr.push(dataWidth);
        }

        tableData.students.forEach((student, index) => {
            absence.push([]);
            headerHeightArr.push(dataHeight);

            for (let i = 0; i < daysInMonth; i++) {
                const type = (i < currday && currMonth.getMonth() === actualMonth) || currMonth.getMonth() < actualMonth ?
                    'A' : '/';
                absence[index].push({ type });
            }

            for (let i = 0; i < student.absences.length; i++) {
                if (currMonth.getMonth() !== student.absences[i].month - 1) continue;
                absence[index][student.absences[i].day - 1] = student.absences[i];
            }
        });

        return {
            month: months[currMonth.getMonth()].label,
            days: daysArr,
            absence,
            headWidthArr,
            headerHeightArr,
            selectedCell: defaultSelectedCellValue
        };
    }

    scrollToToday() {
        const today = new Date().getDate() - 1;
        this.scroller.scrollTo({ x: today * dataWidth, y: 0 });
    }

    showPopupDialog(cellData, studentIndex, dayIndex) {
        const type = cellData.type === '/' ? 'A' : cellData.type;

        let segmentLabel = '';

        for (let i = 0; i < segmentMap.length; i++) {
            if (segmentMap[i].val === type) {
                segmentLabel = segmentMap[i].label;
                break;
            }
        }

        const absenceIndex = segmentOptions.indexOf(segmentLabel);
        const selectedCell = {
            studentIndex,
            dayIndex,
            absenceValue: cellData.type,
            selectedOption: absenceIndex,
            minutes: cellData['minutes'],
            comment: cellData['comment']
        };
        this.setState({ selectedCell });
        this.popupDialog.show();
    }

    renderCells() {
        const date = new Date();
        const today = date.getDate();
        return this.state.absence.map((rowData, index) => (
            <TableWrapper
                key={index}
                style={styles.wrapper}
            >
                {
                    rowData.map((cellData, cellIndex) => (
                        <TouchableOpacity
                            key={cellIndex}
                            onPress={() => { this.showPopupDialog(cellData, index, cellIndex); }}>
                            <Cell
                                key={cellIndex}
                                data={cellData.type}
                                textStyle={
                                    [styles.textStyle, { color: 'grey' },
                                    (today <= (cellIndex + 1) &&
                                        months[date.getMonth()].label === this.state.month) && { color: 'black' },
                                    cellData.type === 'F' && styles.absenceTextStyle,
                                    cellData.type === 'VP' && styles.lateTextStyle,
                                    cellData.type === 'E' && styles.lateEntschuldigtStyle]
                                }
                                style={styles.cellStyle} />
                        </TouchableOpacity>
                    ))
                }
            </TableWrapper>
        ));
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>

                <View style={styles.selectorContainer} >
                    <Text style={styles.selectorText}>
                        Monat:
                    </Text>

                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        iosHeader="Fächer"
                        mode="dropdown"
                        style={styles.subjectPickerStyle}
                        selectedValue={this.state.month}
                        onValueChange={this.updateMonthAndTableData.bind(this)}>
                        {
                            months.map((month, key) => (
                                <Item label={month.label} value={month.label} key={key + 1} />
                            ))
                        }
                    </Picker>
                </View>

                <AbsencePopup
                    selectedCell={this.state.selectedCell}
                    student={this.getSelectedStudentName()}
                    selectedDay={this.getSelectedDay()}
                    selectedMonth={this.state.month}
                    onAbsenceChanged={this.setNewAbsenceValue.bind(this)}
                    onRef={(popupDialog) => { this.popupDialog = popupDialog; }}
                    onCancelPressed={() => this.popupDialog.dismiss()} />


                <ScrollView bounces={false} style={{ flex: 1 }} >
                    <View style={styles.wrapper}>
                        <Table borderStyle={{ borderColor: 'black' }} style={{ alignItems: 'center' }} >
                            <Col
                                data={this.state.students}
                                style={styles.titleStyle}
                                textStyle={[styles.textStyle, { color: 'white' }]}
                                heightArr={this.state.headerHeightArr} />
                        </Table>
                        <View style={{ flex: 1 }}>
                            <ScrollView horizontal bounces={false} ref={(scroller) => { this.scroller = scroller; }} >
                                <Table borderStyle={{ borderColor: 'black' }} style={{ flex: 1 }} >
                                    <TableWrapper style={{ flexDirection: 'column' }}>
                                        <Row
                                            data={this.state.days}
                                            widthArr={this.state.headWidthArr}
                                            style={styles.headerStyle}
                                            textStyle={[styles.textStyle, { color: 'white' }]} />
                                        {
                                            this.renderCells()
                                        }
                                    </TableWrapper>
                                </Table>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    selectorContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'black',
        height: 50
    },
    selectorText: {
        fontSize: 18,
        paddingRight: 10,
    },
    subjectPickerStyle: {
        borderWidth: 1,
        borderColor: '#b7b7b7',
        backgroundColor: '#f9f9f9',
        width: 200
    },
    selectorStyle: {
        flex: 3,
    },
    textStyle: {
        textAlign: 'center',
        fontWeight: '100',
        fontSize: 18
    },
    absenceTextStyle: {
        color: 'red',
        fontWeight: 'bold'
    },
    lateTextStyle: {
        color: '#ff9c56',
        fontWeight: 'bold'
    },
    lateEntschuldigtStyle: {
        color: '#25626d',
        fontWeight: 'bold'
    },
    headerStyle: {
        height: dataHeight,
        backgroundColor: '#4C3E54'
    },
    wrapper: {
        flexDirection: 'row',
        flex: 1
    },
    titleStyle: {
        minWidth: titleWidth,
        backgroundColor: '#4C3E54',
        height: dataHeight,
    },
    cellStyle: {
        height: dataHeight,
        backgroundColor: 'white',
        minWidth: dataWidth
    }
});

export default AbsenceForm;
