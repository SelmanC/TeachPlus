import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchTextInput, FilteredList } from './components';
import { GroupExpl } from './other';

class GroupList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupList: [],
            searchText: ''
        };
    }

    componentDidMount() {
        this.setState({ groupList: GroupExpl });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    <SearchTextInput
                        onChangeText={(text) => this.setState({ searchText: text })}
                        onClearText={() => this.setState({ searchText: '' })} />


                    <ScrollView>
                        <FilteredList
                            renderedItems={this.state.groupList}
                            onItemPressed={item => this.props.navigation.navigate('AbsenceForm', { group: item })}
                            searchText={this.state.searchText} />
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default GroupList;
