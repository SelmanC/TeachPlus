import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Divider } from 'react-native-elements';
import { UserModal } from './components';
import { getDifferentStringsFromArray, getStringFromArray } from './other';
import { updateCurrUser, retriveChildren, retriveAllUsers } from './actions';

class ProfilForm extends Component {
    componentDidMount() {
        if (this.props.user.role === 'parent') {
            this.props.retriveChildren(this.props.user.id);
        }
        this.props.retriveAllUsers();
    }

    onSave(newItem) {
        this.props.navigation.setParams({ modalVisible: false });
        this.props.updateCurrUser(newItem);
    }

    getChildrenOrParentsString(user) {
        return user.role.value === 'student' ? 'Eltern:' : 'Kinder:';
    }

    renderFieldText(field) {
        return !field ? '/' : field;
    }

    renderNameText(user) {
        return `${user.name} ${user.lastname}`;
    }

    renderArrayText() {
        return this.props.groups.length > 0 ?
            getStringFromArray(this.props.groups, 'name', '\n') : '/';
    }

    renderParentText() {
        /* if (role.value === 'student') {
             return parents.length > 0 ?
                 getDifferentStringsFromArray(parents, ['name', 'lastname'], '\n') : '/';
         }*/

        return this.props.children.length > 0 ?
            getDifferentStringsFromArray(this.props.children, ['name', 'lastname'], '\n') : '/';
    }

    renderAdress(user) {
        const { strasse, ort, land } = user;
        return `${strasse}\n${ort}\n${land}`;
    }

    render() {
        const user = this.props.user;
        console.log('user', user)
        const modalVisible = this.props.navigation.getParam('modalVisible', false);
        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 10 }}>
                <ScrollView bounces={false}>
                    <View>
                        <View style={{ height: 160, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.imageContainer}>
                                <Avatar
                                    height={150}
                                    width={150}
                                    source={require('../assets/images/TeachPlus_Logo.png')}
                                    onPress={() => { }}
                                    activeOpacity={0.7}
                                />
                            </View>
                        </View>

                        <Text style={styles.nameTextStyle}>
                            {this.renderNameText(user)}
                        </Text>
                    </View>

                    <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 10, marginTop: 15 }}>
                        Informationen
                </Text>

                    <View style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>

                        <View>
                            <Text style={styles.titleStyle}>Email</Text>
                            <Text style={styles.textStyle}>
                                {this.renderFieldText(user.email)}
                            </Text>
                        </View>

                        <View>
                            <Divider style={styles.dividerStyle} />
                            <Text style={styles.titleStyle}>Alter</Text>
                            <Text style={styles.textStyle}>
                                {this.renderFieldText(user.age)}
                            </Text>
                        </View>

                        <View>
                            <Divider style={styles.dividerStyle} />
                            <Text style={styles.titleStyle}>Adresse</Text>
                            <Text style={styles.textStyle}>
                                {this.renderAdress(user)}
                            </Text>
                        </View>

                        {
                            user.role === 'parent' &&
                            < View >
                                <Divider style={styles.dividerStyle} />
                                <Text style={styles.titleStyle}>{this.getChildrenOrParentsString(user)}</Text>
                                <Text style={styles.textStyle}>
                                    {this.renderParentText(user)}
                                </Text>
                            </View>
                        }

                        <View>
                            <Divider style={styles.dividerStyle} />
                            <Text style={styles.titleStyle}>Gruppen</Text>
                            <Text style={styles.textStyle}>
                                {this.renderArrayText(user)}
                            </Text>
                        </View>

                    </View>

                </ScrollView>

                <UserModal
                    renderHeaderDeleteButton={false}
                    modalVisible={modalVisible}
                    onCancel={() => this.props.navigation.setParams({ modalVisible: false })}
                    onSave={(selectedItem) => { this.onSave(selectedItem); }}
                    selectedItem={user}
                    childrenData={this.props.userData.filter(e => e.role === 'student')} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        position: 'absolute',
        borderColor: '#b7b7b7',
        borderWidth: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameTextStyle: {
        fontSize: 25,
        fontWeight: '300',
        textAlign: 'center',
        marginTop: 5
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#979799',
        marginTop: 10
    },
    textStyle: {
        fontSize: 18,
        marginTop: 5
    },
    dividerStyle: {
        backgroundColor: '#b7b7b7',
        marginTop: 20
    }
});

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        groups: state.auth.groups,
        userData: state.home.userData,
        children: state.home.currChildren
    };
};

export default connect(mapStateToProps, {
    updateCurrUser,
    retriveChildren,
    retriveAllUsers
})(ProfilForm);
