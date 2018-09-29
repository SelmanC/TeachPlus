import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createDrawerNavigator, DrawerItems, createMaterialTopTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { GlobalStyles } from './styles';
import LoginForm from './LoginForm';
import WorkspaceForm from './WorkspaceForm';
import VertretungsList from './VertretungsList';
import NotizenList from './NotizenList';
import AbsenceList from './AbsenceList';
import AbsenceForm from './AbsenceForm';
import TimeSheetList from './TimeSheetList';
import TimeSheet from './TimeSheet';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import MessageableList from './MessageableList';
import Termine from './Termine';
import DokumentList from './DokumentList';
import UserList from './UserList';
import GroupList from './GroupList';
import ProfilForm from './ProfilForm';
import { CurrUser } from './other';

const getDefaultHeaderOptions = (props) => {
    return ({ navigation }) => ({
        headerLeft: (
            <TouchableOpacity
                onPress={() => navigation.toggleDrawer()}>
                <Icon
                    name='menu'
                    iconStyle={{ paddingLeft: 10 }}
                    size={30}
                    color='white'
                />
            </TouchableOpacity>
        ),
        ...GlobalStyles.headerStyle,
        ...props
    });
};

const getHeaderOptionsWithBackButton = (props, goTwoBack = false) => {
    return ({ navigation }) => ({
        headerLeft: (
            <TouchableOpacity
                onPress={() => {
                    if (!goTwoBack) navigation.goBack();
                    else navigation.pop(2);
                }}>
                <Icon
                    name={'chevron-left'}
                    size={30}
                    color='white'
                />
            </TouchableOpacity>
        ),
        ...GlobalStyles.headerStyle,
        ...props
    });
};

const getHeaderOptionsWithBackButtonAndRightIcon = (props, rightIcon, goTwoBack = false) => {
    return ({ navigation }) => ({
        headerLeft: (
            <TouchableOpacity
                onPress={() => {
                    if (!goTwoBack) navigation.goBack();
                    else navigation.pop(2);
                }}>
                <Icon
                    name={'chevron-left'}
                    size={30}
                    color='white'
                />
            </TouchableOpacity>
        ),
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    rightIcon.onPress(navigation);
                }}>
                <Icon
                    size={30}
                    name={rightIcon.name}
                    type={rightIcon.typ}
                    color='white'
                    containerStyle={{ marginRight: 5 }} />
            </TouchableOpacity>
        ),
        ...GlobalStyles.headerStyle,
        ...props
    });
};

const getDefaultDrawerNavigationOptions = (title, iconName, iconType) => {
    return {
        title,
        drawerIcon: ({ tintColor }) => (
            <Icon
                name={iconName}
                size={25}
                type={iconType}
                color={tintColor}
            />
        )
    };
};

const DrawerContent = (props) => (
    <View>
        <View
            style={{
                backgroundColor: '#4C3E54',
                height: 140,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <TouchableOpacity
                onPress={() => props.navigation.navigate('ProfilRouter', { user: CurrUser })}>
                <View style={{ borderColor: 'white', height: 100, width: 100, borderWidth: 2, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon
                        name={'person'}
                        size={90}
                        color='white'
                    />
                </View>
            </TouchableOpacity>
        </View>
        <DrawerItems {...props} />

        <TouchableOpacity
            onPress={() => props.navigation.navigate('Auth', { user: CurrUser })}
        >
            <View style={[{ flexDirection: 'row', alignItems: 'center' }, {}]}>
                <View style={[{ marginHorizontal: 16, width: 24, alignItems: 'center' }, { opacity: 0.62 }, {}]}>
                    <Icon name='log-out' type='entypo' size={25} />
                </View>
                <Text style={[{ margin: 16, fontWeight: 'bold' }, { color: DrawerItems.defaultProps.inactiveTintColor }]}>Ausloggen</Text>
            </View>
        </TouchableOpacity>
    </View>
);

const AuthRouter = createStackNavigator({
    WorkspaceForm: {
        screen: WorkspaceForm,
        navigationOptions: {
            title: 'Workspace',
            ...GlobalStyles.headerStyle,
        }
    },
    LoginForm: {
        screen: LoginForm,
        navigationOptions: getHeaderOptionsWithBackButton({ title: 'Login' })
    }
});

const HomeTabNavigation = createMaterialTopTabNavigator({
    VertretungsList: {
        screen: VertretungsList,
        navigationOptions: {
            tabBarLabel: 'Vertretungsplan',
            tabBarIcon: ({ tintColor }) => <Icon name="clipboard" type='entypo' size={25} color={tintColor} />
        },
    },
    NotizenList: {
        screen: NotizenList,
        navigationOptions: {
            tabBarLabel: 'Notizen',
            tabBarIcon: ({ tintColor }) => <Icon name="sticky-note" type='font-awesome' size={25} color={tintColor} />
        },
    }
},
    {
        tabBarOptions: {
            activeTintColor: 'white',
            labelStyle: {
                fontSize: 12,
            },
            style: {
                backgroundColor: '#4C3E54'
            },
            swipeEnabled: true,
            animationEnabled: true,
            showIcon: false,
            showLabel: true,
            tabStyle: {
                tabBarPosition: 'bottom'
            }
        }
    }
);

const HomeRouter = createStackNavigator({
    Home: {
        screen: HomeTabNavigation,
        navigationOptions: getDefaultHeaderOptions({ title: 'TeachPlus' })
    }
});

const AbsenceRouter = createStackNavigator({
    AbsenceList: {
        screen: AbsenceList,
        navigationOptions: getDefaultHeaderOptions({ title: 'Anwesenheit' })
    },
    AbsenceForm: {
        screen: AbsenceForm,
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon
                        name={'chevron-left'}
                        onPress={() => {
                            navigation.goBack();
                        }}
                        size={30}
                        color='white'
                    />
                </TouchableOpacity>
            ),
            ...GlobalStyles.headerStyle,
            title: navigation.getParam('group', { name: '' }).name
        })
    }
});

const TimeSheetRouter = createStackNavigator({
    TimeSheetList: {
        screen: TimeSheetList,
        navigationOptions: getDefaultHeaderOptions({ title: 'Stundenlisten' })
    },
    TimeSheet: {
        screen: TimeSheet,
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon
                        name={'chevron-left'}
                        size={30}
                        color='white'
                    />
                </TouchableOpacity>
            ),
            ...GlobalStyles.headerStyle,
            title: navigation.getParam('timeSheet', { name: '' }).Name
        })
    }
});

const MessageRouter = createStackNavigator({
    MessageList: {
        screen: MessageList,
        navigationOptions: getDefaultHeaderOptions({ title: 'Nachrichten' })
    },
    MessageForm: {
        screen: MessageForm,
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => { navigation.pop(2); }}>
                    <Icon
                        name={'chevron-left'}
                        size={30}
                        color='white'
                    />
                </TouchableOpacity>
            ),
            ...GlobalStyles.headerStyle,
            title: navigation.getParam('messageItem', { teacher: '' }).to
        })
    },
    MessageableList: {
        screen: MessageableList,
        navigationOptions: getHeaderOptionsWithBackButton({ title: 'Klasse/Lehrer wählen' })
    }
});

const TerminRouter = createStackNavigator({
    Termine: {
        screen: Termine,
        navigationOptions: getDefaultHeaderOptions({ title: 'Termine' })
    }
});

const DokumentListRouter = createStackNavigator({
    DokumentList: {
        screen: DokumentList,
        navigationOptions: getDefaultHeaderOptions({ title: 'Dokumente' })
    }
});

const UsersRouter = createStackNavigator({
    UsersRouter: {
        screen: UserList,
        navigationOptions: getDefaultHeaderOptions({ title: 'Benutzer' })
    }
});

const GroupRouter = createStackNavigator({
    GroupList: {
        screen: GroupList,
        navigationOptions: getDefaultHeaderOptions({ title: 'Gruppen' })
    }
});

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Home', 'home')
    },
    AbsenceRouter: {
        screen: AbsenceRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Anwesenheit', 'open-book', 'entypo')
    },
    TimeSheetRouter: {
        screen: TimeSheetRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Stundenpläne', 'clock-o', 'font-awesome')
    },
    MessageRouter: {
        screen: MessageRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Nachrichten', 'message', 'entypo')
    },
    TerminRouter: {
        screen: TerminRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Termine', 'calendar', 'entypo')
    },
    DokumentListRouter: {
        screen: DokumentListRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Dokumente', 'documents', 'entypo')
    },
    UsersRouter: {
        screen: UsersRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Benutzer', 'person')
    },
    GroupRouter: {
        screen: GroupRouter,
        navigationOptions: getDefaultDrawerNavigationOptions('Gruppen', 'users', 'font-awesome')
    }
},
    { contentComponent: DrawerContent }
);

const MainRouter = createStackNavigator({
    Drawer: {
        screen: MainDrawerNavigator,
        navigationOptions: {
            header: null
        }
    },
    ProfilRouter: {
        screen: ProfilForm,
        navigationOptions: getHeaderOptionsWithBackButtonAndRightIcon({ title: 'Profil' },
            {
                name: 'edit',
                typ: 'MaterialIcons',
                onPress: (navigation) => {
                    navigation.setParams({ modalVisible: true });
                }
            })
    }
});

export const RootRouter = createSwitchNavigator({
    Auth: AuthRouter,
    Main: MainRouter,
});
