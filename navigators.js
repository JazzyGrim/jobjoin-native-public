/*
*
*   Organizacija različitih navigatora kroz aplikaciju
*   Osigurava pravilnu navigaciju kroz stranicu
*   Dodaje doljnju alatnu traku te postavlja redoslijed otvaranja novih stranica
*
*/

import Icon from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

// Boost in performance
import { enableScreens } from 'react-native-screens';

import { connect } from 'react-redux';
import WelcomeScreen from './app/components/Login/WelcomeScreen';
import Login from './app/components/Login/Login';
import LoginForm from './app/components/Login/LoginForm';
import LoginLoading from './app/components/Login/LoginLoading';
import LoginRecruiter from './app/components/Login/LoginRecruiter';
import LoginReset from './app/components/Login/LoginReset';
import SignupForm from './app/components/Login/SignupForm';
import SignupFormLocation from './app/components/Login/SignupFormLocation';
import Applications from './app/components/Tabs/Applications/';
import Jobs from './app/components/Tabs/Jobs/';
import JobScreen from './app/components/Tabs/Jobs/JobScreen';
import RecruiterJobs from './app/components/Tabs/Jobs/RecruiterJobs';
import ReportRecruiter from './app/components/Tabs/Jobs/ReportRecruiter';
import QuizScreen from './app/components/Tabs/Jobs/Quiz/QuizScreen';
import Messages from './app/components/Tabs/Messages/';
import MessagesScreen from './app/components/Tabs/Messages/MessagesScreen';
import Profile from './app/components/Tabs/Profile/';
import EditEducation from './app/components/Tabs/Profile/EditEducation';
import EditExperience from './app/components/Tabs/Profile/EditExperience';
import EditLocation from './app/components/Tabs/Profile/EditLocation';
import EditJobType from './app/components/Tabs/Profile/EditJobType';
import EditLanguages from './app/components/Tabs/Profile/EditLanguages';
import EditSettings from './app/components/Tabs/Profile/EditSettings';
import EditProfile from './app/components/Tabs/Profile/EditProfile';
import ReportBug from './app/components/Tabs/Profile/ReportBug';
import { signOut } from './auth'; // Get the signOut method to save the user details to secure storage
import { disableGetMessage, getMessage } from './utils/socket';

enableScreens( );

const LoginNavigator = createStackNavigator( );

const LoginComponent = ( ) => {
    return (
        <LoginNavigator.Navigator initialRouteName="LoginStack"  screenOptions={ {
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyleInterpolator: HeaderStyleInterpolators.forHorizontalIOS
        } }>
            <LoginNavigator.Screen name="LoginStack" component={Login} options={ { headerShown: false } } />
            <LoginNavigator.Screen name="LoginForm" component={LoginForm} options={ {
                headerTitleAlign: 'center',
                headerTitle: "Prijava" } } />
            <LoginNavigator.Screen name="LoginReset" component={LoginReset} options={ {
                headerTitleAlign: 'center',
                headerTitle: "Zaboravljena lozinka" } } />
            <LoginNavigator.Screen name="LoginRecruiter" component={LoginRecruiter} options={ {
                headerTitleAlign: 'center',
                headerTitle: "Prijava za poslodavce" } } />
            <LoginNavigator.Screen name="SignupForm" component={SignupForm} options={ {
                headerTitleAlign: 'center',
                headerTitle: "Registracija" } } />
            <LoginNavigator.Screen name="SignupFormLocation" component={SignupFormLocation} options={ {
                headerTitleAlign: 'center',
                headerTitle: "Kućna adresa" } } />
        </LoginNavigator.Navigator>
    )
}

const ApplicationsNavigator = createStackNavigator( );

const ApplicationsComponent = ( ) => {
    return (
        <ApplicationsNavigator.Navigator>
            <ApplicationsNavigator.Screen name="ApplicationsStack" component={Applications} options={ { headerShown: false } } />
        </ApplicationsNavigator.Navigator>
    )
}

const MessagesNavigator = createStackNavigator( );

const MessagesComponent = ( ) => {
    return (
        <MessagesNavigator.Navigator screenOptions={ {
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyleInterpolator: HeaderStyleInterpolators.forHorizontalIOS
        } }>
            <MessagesNavigator.Screen name="Messages" component={Messages} options={ { headerShown: false } } />
            <MessagesNavigator.Screen name="MessagesScreen" component={MessagesScreen} options={ {
                headerTitleAlign: 'center',
                headerTitle: ''
            } } />
        </MessagesNavigator.Navigator>
    )
}

const ProfileNavigator = createStackNavigator( );

const ProfileComponent = ( ) => {
    return (
        <ProfileNavigator.Navigator screenOptions={ {
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyleInterpolator: HeaderStyleInterpolators.forHorizontalIOS
        } }>
            <ProfileNavigator.Screen name="ProfileStack" component={Profile} options={ { headerShown: false } } />
            <ProfileNavigator.Screen name="EditProfile" component={EditProfile} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi profil'
            } } />
            <ProfileNavigator.Screen name="EditExperience" component={EditExperience} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi radno iskustvo'
            } } />
            <ProfileNavigator.Screen name="EditEducation" component={EditEducation} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi edukaciju'
            } } />
            <ProfileNavigator.Screen name="EditLocation" component={EditLocation} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi kućnu adresu'
            } } />
            <ProfileNavigator.Screen name="EditLanguages" component={EditLanguages} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi jezike'
            } } />
            <ProfileNavigator.Screen name="EditJobType" component={EditJobType} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi traženi posao'
            } } />
            <ProfileNavigator.Screen name="EditSettings" component={EditSettings} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Uredi postavke aplikacije'
            } } />
            <ProfileNavigator.Screen name="ReportBug" component={ReportBug} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Prijavi grešku'
            } } />
        </ProfileNavigator.Navigator>
    )
}

const TabsNavigator = createBottomTabNavigator( );

const mapHomeStateToProps = ( state ) => {
    return {
        token: state.user.token,
        tokenValid: state.user.tokenValid,
        unreadMessages: state.chat.unreadMessages
    }
}

const mapHomeDispatchToProps = ( dispatch ) => {
    return {
        logout: ( ) => {
            dispatch( { type: 'LOGOUT', payload: { } } )
        },
        resetErrors: ( ) => {
            dispatch( { type: 'RESET_MESSAGES' } );
        },
        addUnreadMessage: ( recruiterID ) => {
            dispatch( { type: 'ADD_UNREAD_MSG', payload: { recruiterID } } )
        },
        removeUnreadMessages: ( ) => {
            dispatch( { type: 'REMOVE_UNREAD_MSG', payload: { } } )
        }
    }
}

const HomeScreen = ( props ) => {

    useEffect( ( ) => {
        if ( props.tokenValid === false ) {
            props.logout( ); // Remove the user's info from the redux state
            signOut( ); // Remove the user's info from SecureStorage
            props.resetErrors( ); // Reset all errors
        }
    }, [ props.tokenValid ] );
    
    useEffect( ( ) => {
        if ( !props.token && props.tokenValid === false ) {
            props.navigation.navigate( 'Login' );
        }
    }, [ props.token ] );

    const handleGetMessage = ( message ) => {
        
        let userID;
        ( message.receiverID == props.id ) ? userID = message.senderID : userID = message.receiverID;

        // .routes[props.route.state.index].name
        if ( !props.route.state || ( props.route.state.index != 2 ) ) props.addUnreadMessage( userID );
    }

    useFocusEffect( ( ) => {
        disableGetMessage( handleGetMessage );
        getMessage( handleGetMessage );

        if ( props.route.state && props.route.state.index == 2 ) props.removeUnreadMessages( );

        return ( ) => disableGetMessage( handleGetMessage );
    } );

    return (
        <TabsNavigator.Navigator
            lazy={ true }
            swipeEnabled={ false }
            tabBarOptions={ {
                upperCaseLabel: false,
                activeTintColor: '#068CDD',
                inactiveTintColor: '#808080',
                style: {
                    height: 50
                },
                tabStyle: {
                    height: 50,
                },
                labelStyle: {
                    fontFamily: 'NotoSans',
                    fontSize: 14,
                    lineHeight: 14,
                    textTransform: "capitalize",
                    padding: 0,
                    margin: 0
                },
                keyboardHidesTabBar: true,
                renderIndicator: ( ) => {}
            } }
        >
            <TabsNavigator.Screen name="JobsTab" component={ Jobs } options={ {
                tabBarIcon: ( { color } ) => <Icon name="briefcase" size={ 24 } color={ color } />,
                tabBarLabel: 'Poslovi',
                headerShown: true
            } } />
            <TabsNavigator.Screen name="ApplicationsTab" component={ ApplicationsComponent } options={ {
                tabBarIcon: ( { color } ) => <Icon name="folder" size={ 24 } color={ color } />,
                tabBarLabel: 'Prijave'
            } } />
            <TabsNavigator.Screen name="MessagesTab" component={ MessagesComponent } options={ {
                tabBarIcon: ( { color, size } ) => {
                    return <View>
                        <Icon name="envelope" size={24} color={ color } />
                        { props.unreadMessages > 0 && (
                            <View
                            style={{
                                position: 'absolute',
                                right: -9,
                                top: -6,
                                backgroundColor: '#ff4a49',
                                borderRadius: 12,
                                minWidth: 18,
                                height: 18,
                                width: props.unreadMessages.toString( ).length * 10,
                                transform: [
                                    { translateX: props.unreadMessages.toString( ).length * 2 }
                                ],
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            >
                            <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold' }}>
                                { props.unreadMessages }
                            </Text>
                            </View>
                        )}
                    </View>
                },
                tabBarLabel: 'Poruke'
            } } />
            <TabsNavigator.Screen name="ProfileTab" component={ ProfileComponent } options={ {
                tabBarIcon: ( { color } ) => <Icon name="user-circle-o" size={ 24 } color={ color } />,
                tabBarLabel: 'Profil'
            } } />
        </TabsNavigator.Navigator>
    )
}


const TabsComponent = connect( mapHomeStateToProps, mapHomeDispatchToProps )( HomeScreen );

const HomeNavigator = createStackNavigator( );

const HomeComponent = ( ) => {
    return (
        <HomeNavigator.Navigator initialRouteName="Tabs" screenOptions={ {
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyleInterpolator: HeaderStyleInterpolators.forHorizontalIOS
        } }>
            <HomeNavigator.Screen name="Tabs" component={TabsComponent} options={ { headerShown: false } } />
            <HomeNavigator.Screen name="JobScreen" component={JobScreen} options={ { headerShown: false } } />
            <HomeNavigator.Screen name="RecruiterJobs" component={RecruiterJobs} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Oglasi poslodavca' } } />
            <HomeNavigator.Screen name="ReportRecruiter" component={ReportRecruiter} options={ {
                headerTitleAlign: 'center',
                headerTitle: 'Prijavi poslodavca' } } />
            <HomeNavigator.Screen name="QuizScreen" component={QuizScreen} options={ { headerShown: false } } />
        </HomeNavigator.Navigator>
    )
}

const getActiveRouteName = state => {
    const route = state.routes[state.index];
    
    if (route.state) {
        return getActiveRouteName(route.state);
    }
  
    return route.name;
};

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        type: state.user.type
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        resetErrors: ( ) => {
            dispatch( { type: 'RESET_MESSAGES' } );
        }
    }
}

const AppNavigator = createStackNavigator( );

const AppContainer = ( props ) => {

    const routeNameRef = useRef( );
    const navigationRef = useRef( );

    return (
        <NavigationContainer
            ref={ navigationRef }
            onStateChange={ state => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = getActiveRouteName( state );
                
                if ( previousRouteName !== currentRouteName ) {

                    routeNameRef.current = currentRouteName;
                    
                    // Reset only for the home stack not login
                    if ( currentRouteName.startsWith( 'Login' ) || currentRouteName.startsWith( 'Signup' ) ) return;
                    props.resetErrors( );

                }
            }
        }>
            <AppNavigator.Navigator initialRouteName="LoginLoading" headerMode="none" >
                { !props.token || props.type === 'recruiter' ? <>
                    <AppNavigator.Screen name="LoginLoading" component={LoginLoading} />
                    <AppNavigator.Screen name="WelcomeScreen" component={WelcomeScreen} />
                    <AppNavigator.Screen name="Login" component={LoginComponent} />
                </> : <>
                    <AppNavigator.Screen name="Home" component={HomeComponent} />
                </> }
            </AppNavigator.Navigator>
        </NavigationContainer>
    )
}

export default connect( mapStateToProps, mapDispatchToProps )( AppContainer );