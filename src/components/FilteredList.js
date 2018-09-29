import React, { Component } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';

class FilteredList extends Component {
    filterList(item) {
        const { searchText } = this.props;
        const onFilter = this.props.onFilterList ? this.props.onFilterList(item) : true;
        return (!searchText || item.name.toUpperCase().includes(searchText.toUpperCase())) &&
            onFilter;
    }

    renderListItem(item) {
        if (this.props.showSubtitle !== false && item.email) {
            return (
                <ListItem
                    roundAvatar
                    avatar={require('../../assets/images/TeachPlus_Logo.png')}
                    title={item.name}
                    subtitle={this.props.showSubtitle !== false && item.email ? item.email : ''}
                />
            );
        }

        return (
            <ListItem
                roundAvatar
                avatar={require('../../assets/images/TeachPlus_Logo.png')}
                title={item.name}
            />
        );
    }

    render() {
        return (
            <ScrollView>
                <List containerStyle={{ marginTop: 0 }}>
                    {
                        this.props.renderedItems.map((item, key) => {
                            if (this.filterList(item)) {
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => this.props.onItemPressed(item, key)}>
                                        {
                                            this.renderListItem(item)
                                        }
                                    </TouchableOpacity>
                                );
                            }
                            return null;
                        })
                    }
                </List>
            </ScrollView>
        );
    }
}

export { FilteredList };
