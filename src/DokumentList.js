import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { Icon, List, ListItem, FormInput } from 'react-native-elements';
import { Fab, Button } from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { DirectoryDataExpl } from './other';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const defaultSelectedItemValue = {
    id: null,
    name: '',
    type: '',
    path: null,
    files: []
};

class DokumentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fabActive: false,
            newDir: false,
            parentDirs: [],
            dirStructure: [],
            dirData: [],
            selectedItem: Object.assign({}, defaultSelectedItemValue),
            selectedIndex: null
        };
    }

    componentDidMount() {
        const dirData = DirectoryDataExpl;
        this.setState({ dirData, dirStructure: dirData });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress() {
        const { parentDirs, dirData } = this.state;
        let newDirStructure = [];
        let newParentDirs = [];

        if (parentDirs.length > 1) {
            newDirStructure = parentDirs[parentDirs.length - 2].files;
            parentDirs.splice(parentDirs.length - 1, 1);
            newParentDirs = parentDirs;
        } else {
            newDirStructure = dirData;
        }

        this.setState({
            dirStructure: newDirStructure,
            parentDirs: newParentDirs
        });
    }

    deleteFromTree(tree, element) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === element.id) {
                tree.splice(i, 1);
                return true;
            } else if (tree[i].files.length > 0) {
                const found = this.deleteFromTree(tree[i].files, element);
                if (found) return true;
            }
        }
    }

    renderDirTextStructure() {
        const { parentDirs } = this.state;

        return parentDirs.map((dir, key) => (
            <View key={key} style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        parentDirs.splice(key + 1, parentDirs.length - key);
                        this.setState({
                            dirStructure: dir.files,
                            parentDirs
                        });
                    }}>
                    <Text style={[styles.dirStructureTextStyle, parentDirs.length - 1 === key && styles.activeDirStructureTextStyle]}>{dir.name}</Text>
                </TouchableOpacity>
                <Icon name='chevron-right' type='evilicon' size={15} color='#9E9E9E' containerStyle={{ marginLeft: 10 }} />
            </View>
        ));
    }

    renderListItems() {
        const { dirStructure, parentDirs } = this.state;

        return dirStructure.map((dir, key) => (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    if (dir.type === 'dir') {
                        this.setState({
                            dirStructure: dir.files,
                            parentDirs: [...parentDirs, dir]
                        });
                    }
                }}
                onLongPress={() => {
                    this.setState({ selectedItem: dir, selectedIndex: key });
                    this.popupDialog.show();
                }}>
                <ListItem
                    containerStyle={{ backgroundColor: '#f9f9f9' }}
                    leftIcon={dir.type === 'dir' ?
                        <Icon name='file-directory' type='octicon' color='#FF9800' /> :
                        <Icon name='insert-drive-file' color='#3F51B5' />
                    }
                    title={dir.name}
                />
            </TouchableOpacity>
        ));
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 40, alignItems: 'center' }}>
                    <ScrollView
                        bounces={false}
                        horizontal
                        ref={ref => { this.scrollView = ref; }}
                        onContentSizeChange={() => {
                            this.scrollView.scrollToEnd({ animated: false });
                        }}>
                        <TouchableOpacity
                            onPress={() => this.setState({
                                dirStructure: this.state.dirData,
                                parentDirs: []
                            })}
                            style={{ marginLeft: 5 }} >
                            <Text style={[styles.dirStructureTextStyle, this.state.parentDirs.length === 0 && styles.activeDirStructureTextStyle]} >Home</Text>
                        </TouchableOpacity>
                        <Icon name='chevron-right' type='evilicon' size={15} color='#9E9E9E' containerStyle={{ marginLeft: 10 }} />
                        {
                            this.renderDirTextStructure()
                        }
                    </ScrollView>
                </View>

                <View style={{ flex: 1, marginTop: 0, backgroundColor: '#f9f9f9' }}>
                    <List containerStyle={{ marginTop: 0 }}>
                        {
                            this.renderListItems()
                        }
                    </List>
                </View>

                <Fab
                    active
                    key={0}
                    direction="up"
                    style={{ backgroundColor: '#8BC34A', marginBottom: 10 }}
                    position="bottomRight"
                    onPress={() => this.setState({ fabActive: !this.state.fabActive })}>
                    <Icon name="add" type='MaterialIcons' color='white' size={30} />
                    {
                        this.state.fabActive &&
                        <Button
                            style={{ backgroundColor: '#FF9800' }}
                            onPress={() => {
                                this.setState({ newDir: true, fabActive: false });
                                this.NamePopupDialog.show();
                            }}>
                            <Icon name='file-directory' type='octicon' color='white' />
                        </Button>
                    }
                    {
                        this.state.fabActive &&
                        <Button
                            style={{ backgroundColor: '#3F51B5' }}
                            onPress={() => { }}>
                            <Icon name='insert-drive-file' color='white' />
                        </Button>
                    }
                </Fab>

                <PopupDialog
                    ref={popupDialog => { this.popupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    height={157}
                    containerStyle={{ justifyContent: 'flex-end' }}>

                    <List containerStyle={{ marginTop: 0 }}>

                        <TouchableOpacity
                            onPress={() => {
                                const { selectedIndex, dirData, dirStructure, selectedItem } = this.state;
                                dirStructure.splice(selectedIndex, 1);
                                this.deleteFromTree(dirData, selectedItem);
                                this.setState({
                                    dirStructure,
                                    dirData,
                                    selectedItem: Object.assign({}, defaultSelectedItemValue),
                                    selectedIndex: null
                                });
                                this.popupDialog.dismiss();
                            }}>
                            <ListItem
                                leftIcon={<Icon name="delete" type='MaterialIcons' containerStyle={{ marginRight: 10 }} />}
                                title='Löschen'
                                hideChevron
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.popupDialog.dismiss();
                                this.NamePopupDialog.show();
                            }}>
                            <ListItem
                                leftIcon={<Icon name="edit" type='MaterialIcons' containerStyle={{ marginRight: 10 }} />}
                                title='Umbenennen'
                                hideChevron
                            />
                        </TouchableOpacity>

                    </List>

                </PopupDialog>

                <PopupDialog
                    ref={popupDialog => { this.NamePopupDialog = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    height={0.2}
                    onDismissed={() => this.setState({
                        selectedItem: Object.assign({}, defaultSelectedItemValue),
                        selectedIndex: null
                    })}>
                    <View style={{ marginTop: 20, marginLeft: 20, flex: 1 }}>

                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Ordnername</Text>

                        <FormInput
                            placeholder='Name'
                            value={this.state.selectedItem.name}
                            onChangeText={(name) => this.setState({
                                selectedItem: {
                                    ...this.state.selectedItem,
                                    name
                                }
                            })}
                            containerStyle={styles.containerFormInputStyle}
                            placeholderTextColor='#828080'
                            inputStyle={styles.formInputFieldStyle} 
                            underlineColorAndroid='#a09f9f' />

                        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20, marginRight: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <TouchableOpacity
                                    onPress={() => this.NamePopupDialog.dismiss()}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                    <Text style={{ fontSize: 16, color: '#FFC107', marginRight: 10 }}>Abbrechen</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        const { dirStructure, selectedIndex, selectedItem, newDir } = this.state;

                                        if (newDir) {
                                            dirStructure.push({
                                                name: selectedItem.name,
                                                id: selectedItem.name,
                                                type: 'dir',
                                                path: null,
                                                files: []
                                            });
                                            dirStructure.sort((a, b) => {
                                                return (a.type !== 'dir' && b.type === 'dir') || (a.type === b.type && a.name > b.name);
                                            });
                                        } else dirStructure[selectedIndex] = selectedItem;
                                        this.setState({ dirStructure });
                                        this.NamePopupDialog.dismiss();
                                    }}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                    <Text style={{ fontSize: 16, color: '#FFC107', marginRight: 5 }}>Erstellen</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </PopupDialog>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    dirStructureContainerStyle: {
        flexDirection: 'row',
    },
    dirStructureTextStyle: {
        fontSize: 16,
        color: '#9E9E9E'
    },
    activeDirStructureTextStyle: {
        color: 'black'
    },
    containerFormInputStyle: {
        height: 50,
        justifyContent: 'center',
        marginRight: 10,
        flex: 1
    },
    formInputFieldStyle: {
        fontSize: 22,
        color: 'black'
    }
});

export default DokumentList;
