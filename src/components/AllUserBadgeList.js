import React, { Component } from 'react';
import { UserSearchList } from './UserSearchList';
import { ModalWithHeader } from './ModalWithHeader';
import { BadgeListView } from './BadgeListView';


class AllUserBadgeList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isContactModalShown: false,
            selectedItems: []
        };
    }

    onSave() {
        this.props.onSave(this.state.selectedItems);

        this.setState({
            isContactModalShown: false,
            selectedItems: []
        });
    }

    render() {
        const selectedItems = this.state.isContactModalShown ? this.state.selectedItems : this.props.selectedItems;
        return (
            <ModalWithHeader
                headerText={this.props.title}
                isVisible={this.props.isVisible}
                onShow={() => this.setState({
                    selectedItems: [...this.props.selectedItems],
                    isContactModalShown: true
                })}
                onCancel={() => {
                    this.setState({
                        selectedItems: [],
                        isContactModalShown: false
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

                <UserSearchList
                    personList={this.props.personList}
                    onFilterList={(item) => selectedItems.findIndex(p => p.id === item.id) < 0}
                    onUserClicked={(item) => this.setState({
                        selectedItems: [...this.state.selectedItems, item]
                    })} />

            </ModalWithHeader>
        );
    }
}

export { AllUserBadgeList };
