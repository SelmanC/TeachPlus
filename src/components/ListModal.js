import React, { Component } from 'react';
import { View } from 'react-native';
import { FilteredList } from './FilteredList';
import { SearchTextInput } from './SearchTextInput';
import { ModalWithHeader } from './ModalWithHeader';

class ListModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: ''
        };
    }

    render() {
        const { isVisible, onCancel, headerText, onSave, renderedItems } = this.props;
        return (
            <ModalWithHeader
                isVisible={isVisible}
                onDismiss={() => this.setState({ searchText: '' })}
                onCancel={() => onCancel()}
                onSave={() => onSave()}
                headerText={headerText}
                renderHeaderRighItem={false} >
                <View style={{ flex: 1 }}>

                    <SearchTextInput
                        onChangeText={(text) => this.setState({ searchText: text })}
                        onClearText={() => this.setState({ searchText: '' })} />

                    <FilteredList
                        renderedItems={renderedItems}
                        onItemPressed={(item) => onSave(item)}
                        searchText={this.state.searchText} />
                </View>
            </ModalWithHeader>
        );
    }

}

export { ListModal };
