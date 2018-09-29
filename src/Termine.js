import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Fab, Icon } from 'native-base';
import { Agenda } from 'react-native-calendars';
import { TerminModalPopup } from './components';
import { setLocaleConfig, terminDataExpl, isSameDay, createDataString, createTimeString, getStringFromArray } from './other';

const defaultSelectedItemValue = {
    id: null,
    teacher: '',
    partners: [],
    title: '',
    description: '',
    date: new Date(),
    endTime: new Date(new Date().getTime() + (30 * 60 * 1000)),
    subject: '',
    location: '',
    whole_day: false
};

class Termine extends Component {
    constructor(props) {
        super(props);
        setLocaleConfig();

        this.state = {
            modalVisible: false,
            termine: [],
            shownItems: {},
            shownItemsCache: {},
            selectedItem: Object.assign({}, defaultSelectedItemValue),
        };
    }

    componentDidMount() {
        this.setState({ termine: terminDataExpl });
        this.updateAgendaForThreeMonths(new Date(), terminDataExpl);
    }

    setItemsForCurrentMonth(currMonth) {
        this.updateAgendaForThreeMonths(new Date(currMonth.timestamp), this.state.termine);
    }

    deleteSelectedItem() {
        const { selectedItem, termine, shownItems } = this.state;
        const date = selectedItem.oldDate ? selectedItem.oldDate : selectedItem.date;
        const terminString = createDataString(date.getDate(), date.getMonth() + 1, date.getFullYear());

        const terminIndex = termine.findIndex(t => t.id === selectedItem.id);
        termine.splice(terminIndex, 1);

        const shownItemIndex = shownItems[terminString].findIndex(t => t.id === selectedItem.id);
        shownItems[terminString].splice(shownItemIndex, 1);

        this.setState({ termine, shownItems, modalVisible: false, selectedItem: Object.assign({}, defaultSelectedItemValue) });
    }

    upsertSelectedItem(newSelectedItem) {
        const { termine, selectedItem } = this.state;
        if (newSelectedItem.id === null) {
            const terminIndex = termine.findIndex(t => t.date > selectedItem.date) + 1;
            termine.splice(terminIndex, 0, newSelectedItem);
        } else {
            const terminIndex = termine.findIndex(t => t.id === selectedItem.id);
            if (isSameDay(newSelectedItem.date, selectedItem.date)) {
                termine[terminIndex] = newSelectedItem;
            } else {
                const newTerminIndex = termine.findIndex(t => t.date > selectedItem.date) + 1;
                termine.splice(terminIndex, 1);
                termine.splice(newTerminIndex, 0, newSelectedItem);
            }
        }
        this.updateAgendaItem(newSelectedItem, termine);
    }

    updateAgendaItem(newSelectedItem, termine) {
        const { shownItems, selectedItem, shownItemsCache } = this.state;

        const terminString = createDataString(newSelectedItem.date.getDate(), newSelectedItem.date.getMonth() + 1, newSelectedItem.date.getFullYear());
        let terminIndex = -1;

        if (isSameDay(newSelectedItem.date, selectedItem.date)) {
            terminIndex = shownItems[terminString].findIndex(t => t.id === selectedItem.id);
        } else {
            const oldTerminString = createDataString(selectedItem.date.getDate(), selectedItem.date.getMonth() + 1, selectedItem.date.getFullYear());
            const oldTerminIndex = shownItems[oldTerminString].findIndex(t => t.id === selectedItem.id);

            if (oldTerminIndex >= 0) shownItems[oldTerminString].splice(oldTerminIndex, 1);
        }

        if (terminIndex >= 0) shownItems[terminString][terminIndex] = newSelectedItem;
        else if (terminString in shownItems) shownItems[terminString].push(newSelectedItem);
        else {
            const data = terminString in shownItemsCache ? [...shownItemsCache[terminString], newSelectedItem] : [newSelectedItem];
            shownItems[terminString] = data;
            shownItemsCache[terminString] = data;
        }
        this.setState({ shownItems, shownItemsCache, termine, modalVisible: false, selectedItem: Object.assign({}, defaultSelectedItemValue) });
    }

    updateAgendaForThreeMonths(day, termine) {
        const { shownItemsCache } = this.state;
        const shownItems = {};

        let timeIndex = 0;
        for (let i = -15; i < 85; i++) {
            const timeDate = new Date(new Date(day).setDate(day.getDate() + i));
            const timeDateString = createDataString(timeDate.getDate(), timeDate.getMonth() + 1, timeDate.getFullYear());

            if (timeDateString in shownItemsCache && shownItemsCache[timeDateString].length !== 0) {
                shownItems[timeDateString] = shownItemsCache[timeDateString];
            } else {
                const termineOnSameDate = [];
                for (; timeIndex < termine.length; timeIndex++) {
                    const currTermin = termine[timeIndex];
                    if (isSameDay(timeDate, currTermin.date)) {
                        termineOnSameDate.push({ ...currTermin });
                    } else {
                        break;
                    }
                }
                shownItems[timeDateString] = termineOnSameDate;
                shownItemsCache[timeDateString] = termineOnSameDate;
            }
        }

        this.setState({ shownItems, shownItemsCache });
    }

    renderItemPoints(item) {
        const renderedItemPoints = [];

        if (item['partners'].length > 0) {
            renderedItemPoints.push((
                <View key={1} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Person:</Text>
                    <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.itemPointValueStyle}>{getStringFromArray(item['partners'], 'name', ',')}</Text>
                </View>
            ));
        }
        if (item['subject']) {
            renderedItemPoints.push((
                <View key={2} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Fach:</Text>
                    <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.itemPointValueStyle}>{item['subject']}</Text>
                </View>
            ));
        }
        if (item['location']) {
            renderedItemPoints.push((
                <View key={3} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Ort:</Text>
                    <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.itemPointValueStyle}>{item['location']}</Text>
                </View>
            ));
        }
        if (item['description']) {
            renderedItemPoints.push((
                <View key={4} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Beschreibung:</Text>
                    <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.itemPointValueStyle}>{item['description']}</Text>
                </View>
            ));
        }
        if (item['date']) {
            renderedItemPoints.push((
                <View key={5} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Wann:</Text>
                    <Text style={styles.itemPointValueStyle}>{createTimeString(item['date'].getHours(), item['date'].getMinutes())}</Text>
                </View>
            ));
        }
        if (item['whole_day']) {
            renderedItemPoints.push((
                <View key={6} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Ganztäglich:</Text>
                    <Text style={styles.itemPointValueStyle}>Ja</Text>
                </View>
            ));
        } else if (item['endTime']) {
            renderedItemPoints.push((
                <View key={6} style={styles.itemPointContainerStyle}>
                    <Text style={styles.itemPointKeyStyle}>Bis:</Text>
                    <Text style={styles.itemPointValueStyle}>{createTimeString(item['endTime'].getHours(), item['endTime'].getMinutes())}</Text>
                </View>
            ));
        }
        return renderedItemPoints;
    }

    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => this.setState({ modalVisible: true, selectedItem: { ...item } })}>
                <View style={[styles.item, { height: item.height }]}>
                    <View key={0} style={styles.itemPointContainerStyle}>
                        <Text style={styles.itemPointKeyStyle}>Titel:</Text>
                        <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.itemPointValueStyle}>{item['title']}</Text>
                    </View>
                    {
                        this.renderItemPoints(item)
                    }
                </View>
            </TouchableOpacity>
        );
    }

    renderEmptyDate(date) {
        return (
            <TouchableOpacity
                onPress={() => {
                    const currDate = new Date();
                    this.setState({
                        modalVisible: true,
                        selectedItem: {
                            ...this.state.selectedItem,
                            date: new Date(date[0].setHours(currDate.getHours(), currDate.getMinutes()))
                        }
                    });
                }}
                style={{ flex: 1 }}>
                <View style={styles.emptyDate}>
                    <Text>Kein Ereignis vorhanden</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Agenda
                    items={this.state.shownItems}
                    loadItemsForMonth={this.setItemsForCurrentMonth.bind(this)}
                    selected={new Date()}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={(r1, r2) => r1 !== r2}
                />

                <TerminModalPopup
                    visible={this.state.modalVisible}
                    selectedItem={this.state.selectedItem}
                    onCancel={() => this.setState({ modalVisible: false, selectedItem: Object.assign({}, defaultSelectedItemValue) })}
                    onSave={(newSelectedItem) => { this.upsertSelectedItem(newSelectedItem); }}
                    onDelete={() => { this.deleteSelectedItem(); }} />

                <Fab
                    active
                    direction="up"
                    style={{ backgroundColor: '#8BC34A' }}
                    position="bottomRight">
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                modalVisible: true,
                                selectedItem: { ...this.state.selectedItem, date: new Date() }
                            });
                        }}>
                        <Icon name="add" type='MaterialIcons' style={{ color: 'white' }} />
                    </TouchableOpacity>
                </Fab>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    itemPointContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 5
    },
    itemPointKeyStyle: {
        fontWeight: 'bold',
        marginLeft: 5,
        width: 110
    },
    itemPointValueStyle: {
        marginLeft: 5,
        flex: 1
    },
    emptyDate: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default Termine;
