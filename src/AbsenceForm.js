import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Table, TableWrapper, Row, Col, Cell } from 'react-native-table-component';
import { Picker, Icon, Item } from 'native-base';
import { AbsencePopup } from './components';
import { getDaysInMonth, getDateObjectByMonth, segmentMap, segmentOptions, months } from './other';
import { retrieveAbsenceList, updateAbsenceData } from './actions';

const titleWidth = 120;
const dataWidth = 50;
const dataHeight = 50;

const defaultSelectedCellValue = {
    studentIndex: null,
    day: null,
    selectedOption: 0,
    type: '',
    minutes: '',
    comment: '',
    id: null
};

class AbsenceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currMonthVal: null,
            month: null,
            days: [],
            headWidthArr: [],
            selectedCell: defaultSelectedCellValue
        };
    }

    componentDidMount() {
        const currMonth = new Date();

        this.setState({ ...this.updateTableData(currMonth) });
        this.scrollToToday();
    }

    setNewTypeValue(newData) {
        const { selectedCell, currMonthVal } = this.state;
        newData.student = this.props.students[selectedCell.studentIndex];
        
        newData.month = currMonthVal;
        newData.day = selectedCell.day + 1;
        delete newData.selectedOption;

        this.props.updateAbsenceData(this.props.currAbsenceList, this.props.currAbsence, newData, selectedCell.studentIndex, selectedCell.day);
        this.popupDialog.dismiss();
    }

    getSelectedStudentName() {
        return this.props.students[this.state.selectedCell.studentIndex + 1];
    }

    getSelectedDay() {
        return this.state.days[this.state.selectedCell.day];
    }

    getAllStudentNames() {
        return ['', ...this.props.students.map(e => `${e.name} ${e.lastname}`)];
    }

    updateMonthAndTableData(monthOption) {
        const monthIndex = months.findIndex(e => e.label === monthOption);
        const date = getDateObjectByMonth(monthIndex);

        const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());
        this.props.retrieveAbsenceList(this.props.currAbsenceList, date, daysInMonth);

        this.setState({ ...this.updateTableData(date) });
    }

    updateTableData(currMonth) {
        const daysInMonth = getDaysInMonth(currMonth.getMonth(), currMonth.getFullYear());
        const headWidthArr = [];
        const daysArr = [];

        for (let i = 1; i <= daysInMonth; i++) {
            daysArr.push(`${i}`);
            headWidthArr.push(dataWidth);
        }

        return {
            currMonthVal: currMonth.getMonth() + 1,
            month: months[currMonth.getMonth()].label,
            days: daysArr,
            headWidthArr,
            selectedCell: Object.assign({}, defaultSelectedCellValue)
        };
    }

    scrollToToday() {
        const today = new Date().getDate() - 1;
        this.scroller.scrollTo({ x: today * dataWidth, y: 0 });
    }

    showPopupDialog(cellData, studentIndex, day) {
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
            day,
            type: cellData.type,
            selectedOption: absenceIndex,
            minutes: cellData['minutes'],
            comment: cellData['comment'],
            id: cellData['id']
        };
        this.setState({ selectedCell });
        this.popupDialog.show();
    }

    renderCells() {
        const date = new Date();
        const today = date.getDate();
        return this.props.currAbsence.map((rowData, index) => (
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
                    onAbsenceChanged={this.setNewTypeValue.bind(this)}
                    onRef={(popupDialog) => { this.popupDialog = popupDialog; }}
                    onCancelPressed={() => this.popupDialog.dismiss()} />


                <ScrollView bounces={false} style={{ flex: 1 }} >
                    <View style={styles.wrapper}>
                        <Table borderStyle={{ borderColor: 'black' }} style={{ alignItems: 'center' }} >
                            <Col
                                data={this.getAllStudentNames()}
                                style={styles.titleStyle}
                                textStyle={[styles.textStyle, { color: 'white' }]}
                                heightArr={this.props.headerHeightArr} />
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

const mapStateToProps = state => {
    return {
        currAbsenceList: state.home.currAbsenceList,
        currAbsence: state.home.currAbsence,
        headerHeightArr: [dataHeight, ...state.home.students.map(() => dataHeight)],
        students: state.home.students
    };
};

export default connect(mapStateToProps, {
    retrieveAbsenceList,
    updateAbsenceData
})(AbsenceForm);
