import React, { Component } from 'react';
import { View } from 'react-native';
import { Tab, Tabs } from 'native-base';
import { SearchTextInput } from './SearchTextInput';
import { FilteredList } from './FilteredList';

class UserSearchList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: ''
        };
    }

    filterList(item, option) {
        const onFilter = this.props.onFilterList ? this.props.onFilterList(item, option) : true;
        return item.role.value === option && onFilter;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SearchTextInput
                    onChangeText={(text) => this.setState({ searchText: text })}
                    onClearText={() => this.setState({ searchText: '' })} />

                <Tabs>
                    {
                        this.props.searchGroup !== false &&
                        <Tab heading="Gruppe">
                            <FilteredList
                                renderedItems={this.props.personList}
                                onItemPressed={(item, index) => this.props.onUserClicked(item, index)}
                                searchText={this.state.searchText}
                                onFilterList={(item) => this.filterList(item, 'group')} />
                        </Tab>
                    }
                    <Tab heading="Lehrer">
                        <FilteredList
                            renderedItems={this.props.personList}
                            onItemPressed={(item, index) => this.props.onUserClicked(item, index)}
                            searchText={this.state.searchText}
                            onFilterList={(item) => this.filterList(item, 'teacher')} />
                    </Tab>
                    <Tab heading="Eltern">
                        <FilteredList
                            renderedItems={this.props.personList}
                            onItemPressed={(item, index) => this.props.onUserClicked(item, index)}
                            searchText={this.state.searchText}
                            onFilterList={(item) => this.filterList(item, 'parent')} />
                    </Tab>
                    <Tab heading="Schüler">
                        <FilteredList
                            renderedItems={this.props.personList}
                            onItemPressed={(item, index) => this.props.onUserClicked(item, index)}
                            searchText={this.state.searchText}
                            onFilterList={(item) => this.filterList(item, 'student')} />
                    </Tab>
                </Tabs>
            </View>
        );
    }
}

export { UserSearchList };
