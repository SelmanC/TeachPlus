
import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Fab, Icon } from 'native-base';
import { VertretungsModal } from './components';
import { createDateStringWithDay } from './other';
import { retrieveVertretungsplan, addVertretungsplan, deleteVertretungsplan, retriveTeacher, retriveAllGroups } from './actions';
import { GlobalStyles } from './styles';

const defaultSelectedItem = {
    groupClass: {
        name: '',
        id: null
    },
    title: '',
    substitute: {
        name: ''
    },
    subject: '',
    room: '',
    comment: '',
    delay: null,
    date: new Date(),
    id: null,
    hour: ''
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
        this.props.retrieveVertretungsplan(this.props.groups);
        this.props.retriveTeacher();
        this.props.retriveAllGroups();
    }

    onDelete() {
        const { selectedItem } = this.state;

        this.props.deleteVertretungsplan(selectedItem, this.props.vertetungsData);
        this.setState({
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    onSave(newSelectedItem) {
        this.props.addVertretungsplan(this.state.selectedItem, newSelectedItem, this.props.vertetungsData);

        this.setState({
            modalVisible: false,
            selectedItem: Object.assign({}, defaultSelectedItem)
        });
    }

    getVertretungsDescription(vertretung) {
        const subjectName = vertretung.subject;
        const teacherString = vertretung.substitute.name ? ` bei ${vertretung.substitute.name}` : '';
        const roomString = vertretung.room ? ` in ${vertretung.room}` : '';

        return `${subjectName}${teacherString}${roomString}`;
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
                                {data.hour}
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
        const { vertetungsData } = this.props;
        if (Object.values(vertetungsData).length <= 0) return;
        return Object.keys(vertetungsData).map((date, key) => {
            const dateObj = new Date(date);
            return (
                <View key={key} style={{ margin: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>{createDateStringWithDay(dateObj)}</Text>
                    {
                        Object.keys(vertetungsData[date]).map((className, keyClas) => (
                            <View key={keyClas} style={{ marginTop: 10 }}>
                                <Text style={{ color: '#9E9E9E' }} >{className}</Text>
                                <View style={{ justifyContent: 'space-between' }} >
                                    {
                                        this.renderVertretungsObject(vertetungsData[date], className, dateObj)
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>
            );
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                {
                    this.props.showSpinner &&
                    <View style={GlobalStyles.loadingContainerStyle}>
                        <ActivityIndicator size="large" />
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '300' }}>Vertretungsplan wird geladen</Text>
                    </View>
                }
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
                    selectedItem={this.state.selectedItem} 
                    teachers={this.props.teachers}
                    groups={this.props.groupData} />

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
    const groups = state.auth.user.groupMembers ? state.auth.user.groupMembers.map(e => e.groupOwner.id) : null;
    return {
        groups,
        showSpinner: state.home.showSpinner,
        vertetungsData: state.home.vertretungsplanList,
        teachers: state.home.teachers,
        groupData: state.home.groupData,
    };
};

export default connect(mapStateToProps, {
    retrieveVertretungsplan,
    retriveTeacher,
    addVertretungsplan,
    deleteVertretungsplan,
    retriveAllGroups
})(VertretungsList);
