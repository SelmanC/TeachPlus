
import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { Fab, Icon } from 'native-base';
import { VertretungsModal } from './components';
import { VertretungsplanExpl, createDateStringWithDay, createDataString, isSameDay } from './other';

const defaultSelectedItem = {
    class: {
        name: '',
        id: null
    },
    title: '',
    substitute: {
        name: ''
    },
    subject: {
        name: '',
        row: null,
        id: null
    },
    room: '',
    comment: '',
    delay: null,
    date: new Date(),
    id: null
};

class VertretungsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vertetungsData: {},
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        };
    }

    componentDidMount() {
        this.setState({
            vertetungsData: Object.assign({}, VertretungsplanExpl)
        });
    }

    onDelete() {
        const { selectedItem, vertetungsData } = this.state;
        this.setState({
            vertetungsData: this.deleteFromVertretungsData(vertetungsData, selectedItem),
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    onSave(newSelectedItem) {
        const { selectedItem } = this.state;
        let newVertretungsData = this.state.vertetungsData;

        if (selectedItem.id && !isSameDay(selectedItem.date, newSelectedItem.date)) {
            newVertretungsData = this.deleteFromVertretungsData(newVertretungsData, selectedItem);
        }

        const dateString = createDataString(
            newSelectedItem.date.getDate(),
            newSelectedItem.date.getMonth() + 1,
            newSelectedItem.date.getFullYear()
        );

        if (!newVertretungsData[dateString]) {
            newVertretungsData[dateString] = [{
                [newSelectedItem.class.name]: [
                    { ...newSelectedItem }
                ]
            }];
        } else {
            const classIndex = newVertretungsData[dateString].findIndex(d => Object.keys(d)[0] === selectedItem.class.name);

            if (classIndex < 0) {
                newVertretungsData[dateString][newSelectedItem.class.name] = { ...newSelectedItem };
            } else if (!selectedItem.id || !isSameDay(selectedItem.date, newSelectedItem.date)) {
                newVertretungsData[dateString][classIndex][selectedItem.class.name].push({ ...newSelectedItem });
            } else {
                const itemIndex = newVertretungsData[dateString][classIndex][selectedItem.class.name].findIndex(c => c.id === selectedItem.id);
                newVertretungsData[dateString][classIndex][selectedItem.class.name][itemIndex] = { ...newSelectedItem };
            }
        }

        this.setState({ 
            vertetungsData: newVertretungsData, 
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    getVertretungsDescription(vertretung) {
        const subjectName = vertretung.subject.name;
        const teacherString = vertretung.substitute.name ? ` bei ${vertretung.substitute.name}` : '';
        const roomString = vertretung.room ? ` in ${vertretung.room}` : '';

        return `${subjectName}${teacherString}${roomString}`;
    }

    deleteFromVertretungsData(vertetungsData, selectedItem) {
        const dateString = createDataString(
            selectedItem.date.getDate(),
            selectedItem.date.getMonth() + 1,
            selectedItem.date.getFullYear()
        );
        const dateIndex = vertetungsData[dateString].findIndex(d => Object.keys(d)[0] === selectedItem.class.name);
        const classIndex = vertetungsData[dateString][dateIndex][selectedItem.class.name].findIndex(c => c.id === selectedItem.id);
        vertetungsData[dateString][dateIndex][selectedItem.class.name].splice(classIndex, 1);

        return vertetungsData;
    }

    renderVertretungsObject(vertretung, className, date) {
        return vertretung[className].map((data, keyData) => (
            <TouchableOpacity
                key={keyData}
                onPress={() => this.setState({
                    modalVisible: true,
                    selectedItem: { ...data, date }
                })}>
                <Card containerStyle={{ padding: 0, backgroundColor: '#3F51B5', marginLeft: 0, marginRight: 0 }} key={keyData}>
                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginRight: 10 }}>
                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>
                                {data.subject.row + 1}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: 16 }}>{data.title}</Text>
                            <Text style={{ color: 'white', fontSize: 14 }}>{this.getVertretungsDescription(data)}</Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        ));
    }

    renderVertretungsplanList() {
        const { vertetungsData } = this.state;
        if (Object.values(vertetungsData).length <= 0) return;

        return Object.keys(vertetungsData).map((date, key) => {
            const dateObj = new Date(date);
            return (
                <View key={key} style={{ margin: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>{createDateStringWithDay(dateObj)}</Text>
                    {
                        vertetungsData[date].map(vertretung => {
                            return Object.keys(vertretung).map((className, keyClas) => (
                                <View key={keyClas} style={{ marginTop: 10 }}>
                                    <Text style={{ color: '#9E9E9E' }} >{className}</Text>
                                    <View style={{ justifyContent: 'space-between' }} >
                                        {
                                            this.renderVertretungsObject(vertretung, className, dateObj)
                                        }
                                    </View>
                                </View>
                            ));
                        })
                    }
                </View>
            );
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <ScrollView>
                    {
                        this.renderVertretungsplanList()
                    }
                </ScrollView>

                <VertretungsModal
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

export default VertretungsList;
