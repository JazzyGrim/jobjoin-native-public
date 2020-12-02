/*
*
*    Prikazuje modul za potvrdu prijave na oglas
*
*/

import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";

const ApplicationConfirmationModal = ( { visible, quizID, quizRequired, closeModal, apply } ) => {

    return <Modal
        isVisible={ visible }
        onBackButtonPress={ closeModal }
        onBackdropPress={ closeModal }
        onSwipeComplete={ closeModal }
        swipeDirection={ [ 'down' ] }
        style={ styles.modal }
        useNativeDriver={ true }
    >
        <View style={ styles.content }>
            { ( ( ) => {

                if ( quizID ) {

                    if ( quizRequired ) {
                        return <>
                            <Text style={ styles.text }>Poslodavac je za proces prijave postavio obavezni upitnik. Nakon završetka upitnika poslodavac će imati uvid u Vaše rezultate. Želite li krenuti s prijavom?</Text>
                            <View style={ styles.row }>
                                <TouchableOpacity onPress={ ( ) => apply( ) } style={ styles.mainButton }>
                                    <Text style={ styles.mainButtonText }>Kreni</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ closeModal } style={ styles.offButton }>
                                    <Text style={ styles.offButtonText }>Odustani</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    }

                    return <>
                        <Text style={ styles.text }>Poslodavac je za proces prijave postavio opcionalni upitnik. Nakon završetka upitnika poslodavac će imati uvid u Vaše rezultate. Želite li riješiti upitnik? </Text>
                        <View style={ styles.row }>
                            <TouchableOpacity onPress={ ( ) => apply( false ) } style={ [ styles.offButton, styles.noButton ] }>
                                <Text style={ styles.offButtonText }>NE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ ( ) => apply( true ) } style={ [ styles.mainButton, styles.yesButton ] }>
                                <Text style={ styles.mainButtonText }>DA</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={ closeModal } style={ { ...styles.offButton, ...styles.fullWidthButton } }>
                            <Text style={ styles.offButtonText }>Odustani</Text>
                        </TouchableOpacity>
                    </>

                } else {
                    return <>
                        <Text style={ styles.text }>Poslodavac nije postavio upitnik za proces prijave. Želite li se prijaviti na ovaj oglas?</Text>
                        <View style={ styles.row }>
                            <TouchableOpacity onPress={ closeModal } style={ styles.offButton }>
                                <Text style={ styles.offButtonText }>Odustani</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ ( ) => apply( ) } style={ styles.mainButton }>
                                <Text style={ styles.mainButtonText }>Prijavi se</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }

            } ) ( ) }
        </View>
    </Modal>
};

const styles = StyleSheet.create( {
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: "center",
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    text: {
        width: '100%',
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginTop: 10,
        textAlign: "center"
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10
    },
    mainButton: {
        width: '47%',
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#068CDD',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    mainButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'NotoSans'
    },
    offButton: {
        width: '47%',
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    offButtonText: {
        color: '#808080',
        fontSize: 18,
        fontFamily: 'NotoSans',
    },
    fullWidthButton: {
        width: '100%',
        borderWidth: 0
    }
} );

export default ApplicationConfirmationModal;