import React, { Component } from 'react';
import { ModalWithHeader } from './ModalWithHeader';
import { BadgeListView } from './BadgeListView';
import { FilteredList } from './FilteredList';
import { SearchTextInput } from './SearchTextInput';

class FilteredBadgeList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalListShown: false,
            selectedItems: [],
            searchText: ''
        };
    }

    onSave() {
        this.props.onSave(this.state.selectedItems);

        this.setState({
            isModalListShown: false,
            selectedItems: [],
            searchText: ''
        });
    }

    render() {
        const selectedItems = this.state.isModalListShown ? this.state.selectedItems : this.props.selectedItems;
        return (
            <ModalWithHeader
                headerText={this.props.title}
                isVisible={this.props.isVisible}
                onShow={() => this.setState({
                    selectedItems: [...this.props.selectedItems],
                    isModalListShown: true
                })}
                onCancel={() => {
                    this.setState({
                        selectedItems: [],
                        isModalListShown: false,
                        searchText: ''
                    });

                    this.props.onCancel();
                }}
                onSave={() => this.onSave()} >

                <BadgeListView
                    selectedItems={selectedItems}
                    onPressed={(item, index) => {
                        selectedItems.splice(index, 1);
                        this.setState({ selectedItems });
                    }} />

                <SearchTextInput
                    onChangeText={(text) => this.setState({ searchText: text })}
                    onClearText={() => this.setState({ searchText: '' })} />


                <FilteredList
                    renderedItems={this.props.renderedItems}
                    onItemPressed={(item) => this.onSave(item)}
                    searchText={this.state.searchText}
                    onItemPressed={item => {
                        this.state.selectedItems.push(item);
                        this.setState({ selectedItems: this.state.selectedItems });
                    }}
                    onFilterList={item => {
                        const onFilter = this.props.onFilterList ? this.props.onFilterList(item) : true;
                        return onFilter && selectedItems.findIndex(e => e.id === item.id) < 0;
                    }} />

            </ModalWithHeader>
        );
    }
}

export { FilteredBadgeList };
