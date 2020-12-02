/*
*
*    Prikazuje cijelu stranicu za prijave
*
*/

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { getApplications, refreshApplicationsList, resetApplicationsList } from '../../../actions/application';
import { createErrorMessageSelector, createLoadingSelector } from '../../../actions/selector';
import messageStyles from '../../../styles/messages';
import Empty from '../utils/Empty';
import ApplicationCard from './ApplicationCard';
import AppModal from './ApplicationModal';
import AppTypeModal from './ApplicationTypeModal';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'USER_APPLICATIONS' ] );
const errorSelector = createErrorMessageSelector( [ 'USER_APPLICATIONS' ] );

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        applications: state.user.applications,
        loadingApplications: loadingSelector( state ),
        page: state.user.applicationsPage,
        recruiter: state.recruiter.recruiter,
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getApplications,
    refreshApplicationsList,
    resetApplicationsList
}

const getTypeText = ( type ) => {
    if ( type == 4 ) return 'Sve prijave';
    if ( type == 0 ) return 'Aktivne prijave';
    if ( type == 1 ) return 'Prijave u užem odabiru';
    if ( type == 2 ) return 'Odbijene prijave';
    if ( type == 3 ) return 'Istekle prijave';
}

const Applications = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
            StatusBar.setBarStyle( 'dark-content' );
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff');
        }, [ ] )
    );

    const [ appType, setAppType ] = useState( '4' );
    const [ refreshing, setRefreshing ] = useState( false );
    const [ application, setApplication ] = useState( null );
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ typeModalVisible, setTypeModalVisible ] = useState( false );

    useEffect( ( ) => {
        if ( refreshing && !props.loadingApplications ) setRefreshing( false );
    }, [ props.loadingApplications ] );

    useEffect( ( ) => {
        let status, expired;
        if ( appType != 3 && appType != 4 ) status = appType;

        if ( appType == 3 ) { // If we are getting expired applications
            status = null; // Remove the status filter
            expired = true; // Set the expired filter
        }
        
        props.getApplications( status, expired, props.token, 0 );
        
        return ( ) => {
            props.resetApplicationsList( ); // Reset the applications list, applications page, and set loading to true
        }
    }, [ appType ] );

    const loadMoreApplications = ( ) => {
        if ( props.applications.length % 10 !== 0 ) return; // If there are no more applications to be found
        if ( props.loadingApplications ) return; // Prevent duplicate calls from being made
        props.getApplications( null, null, props.token, props.page );
    }

    const handleRefresh = ( ) => {
        setRefreshing( true );
        props.refreshApplicationsList( );
        props.getApplications( null, null, props.token, 0 );
    }

    const openModal = ( app ) => {
        setApplication( app );
        setModalVisible( true );
    }

    const openJob = ( id ) => {
        setModalVisible( false );
        props.navigation.navigate( 'JobScreen', { id } );
    }

    const changeAppType = ( i ) => {
        setAppType( i );
        setTypeModalVisible( false );
    }

    return <>
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <SafeAreaView style={ { flex: 1, alignItems: "center", justifyContent: "flex-start" }  }>
                <TouchableOpacity style={ styles.filterBar } onPress={ ( ) => setTypeModalVisible( true ) }>
                    <Text style={ styles.filterText }>{ getTypeText( appType ) }</Text>
                </TouchableOpacity>
                <FlatList
                    contentContainerStyle={{
                        width: width,
                        flexGrow: 1
                    }}
                    data={ props.applications }
                    keyExtractor={ item => item.id }
                    renderItem={ ( { item } ) => (
                        <ApplicationCard application={ item } handlePress={ ( ) => openModal( item ) } />
                    ) }
                    onEndReached={ loadMoreApplications }
                    onEndReachedThreshold={0.1}
                    initialNumToRender={10}
                    ListFooterComponent={
                        props.loadingApplications && !refreshing && <ActivityIndicator size="large" color='#068CDD' style={ { marginVertical: 10 } } />
                        // If we are loading applications, render this, if we arent ( for example there are no more applications ) render nothing
                    }
                    onRefresh={ handleRefresh }
                    refreshing={ refreshing }
                    ListEmptyComponent={
                        !props.loadingApplications
                        && <Empty
                            image={ require( '../../../../assets/empty-jobs.png' ) }
                            title="Prazno"
                            subtitle="Nije pronađena niti jedna prijava"
                        />
                    }
                />
                { application && <AppModal application={ application } visible={ modalVisible } openJob={ openJob } closeModal={ ( ) => setModalVisible( false ) } /> }
                <AppTypeModal visible={ typeModalVisible } closeModal={ ( ) => setTypeModalVisible( false ) } type={ appType } setAppType={ changeAppType } />
            </SafeAreaView>
            </>;
};

const styles = StyleSheet.create( {
    filterBar: {
        width: '90%',
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5
    },
    filterText: {
        color: '#0B323C',
        fontSize: 14,
        fontFamily: 'NotoSans-Bold',
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( Applications );