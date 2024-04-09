// Firebase functionality
import { initializeApp } from "firebase/app"
import { getFirestore, collection as firestore_collection, setDoc, doc, onSnapshot, connectFirestoreEmulator } from "firebase/firestore"
import { getAnalytics, logEvent } from "firebase/analytics"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

import { log, verbose, localhost } from './helpers'
import { connectAuthEmulator, getAuth } from "firebase/auth"

// ///////////////////////////////
// Initialisation
// ///////////////////////////////

// Firebase config
const { VITE_apiKey, VITE_authDomain, VITE_projectId, VITE_storageBucket, VITE_messagingSenderId, VITE_appId, VITE_measurementId, VITE_recaptcha_site_key, VITE_APPCHECK_DEBUG_TOKEN, VITE_useEmulator } = import.meta.env
const config = {
    apiKey: VITE_apiKey,
    authDomain: VITE_authDomain,
    projectId: VITE_projectId,
    storageBucket: VITE_storageBucket,
    messagingSenderId: VITE_messagingSenderId,
    appId: VITE_appId,
    measurementId: VITE_measurementId
}

verbose( 'Init firebase with ', config )

// Init app components
const app = initializeApp( config )
const analytics = getAnalytics( app )
export const db = getFirestore( app )
const functions = getFunctions( app )
export const auth = getAuth( app )

// App check config
if( import.meta.env.NODE_ENV === 'development' || VITE_APPCHECK_DEBUG_TOKEN ) self.FIREBASE_APPCHECK_DEBUG_TOKEN = VITE_APPCHECK_DEBUG_TOKEN || true
verbose( 'Initialising app check with ', VITE_APPCHECK_DEBUG_TOKEN )
const appcheck = localhost ? 'disabled ' : initializeAppCheck( app, {
    provider: new ReCaptchaV3Provider( VITE_recaptcha_site_key ),
    isTokenAutoRefreshEnabled: true
} )

// Remote functions
export const function_name = httpsCallable( functions, 'function_name' )


// Connect to emulators is in dev
const emulator_host = '127.0.0.1' || 'localhost'
const ports = { functions: 5001, firestore: 8080, auth: 9099 }
if( VITE_useEmulator ) {
    log( `🤡 Using firebase emulators` )
    connectFunctionsEmulator( functions, emulator_host, ports.functions )
    connectFirestoreEmulator( db, emulator_host, ports.firestore )
    connectAuthEmulator( auth, `http://${ emulator_host }:${ ports.auth }` )
}
export const get_emulator_function_call_url = name => `http://${ emulator_host }:${ ports.functions }/${ VITE_projectId }/us-central1/${ name }`



/**
 * Listens to changes in a specific document in a collection and invokes a callback function with the updated data.
 * @param {Object} options - The options for listening to the document.
 * @param {string} options.collection - The name of the collection.
 * @param {string} options.document - The ID of the document.
 * @param {Function} options.callback - The callback function to be invoked with the updated data.
 * @returns {function} - The unsubscribe function to stop listening to the document changes.
 */
export function listen_to_document( { collection, document, callback } ) {

    const d = doc( db, collection, document )

    return onSnapshot( d, snap => {

        const data = snap.data()
        verbose( `Retreived document ${ collection }/${ document }: `, data )
        callback( data )

    } )

}

/**
 * Writes a document to a Firestore collection.
 * 
 * @param {Object} options - The options for writing the document.
 * @param {string} options.collection - The name of the collection to write the document to.
 * @param {string} options.document - The ID of the document to write. If not provided, a new document will be created.
 * @param {Object} options.data - The data to be written to the document.
 * @param {boolean} [options.add_timestamp=true] - Whether to add timestamp fields to the data. Default is true.
 * @param {boolean} [options.merge=true] - Whether to merge the data with existing document fields. Default is true.
 * @returns {Promise<Object>} - A promise that resolves to a document reference in the format { id: 'document_id' }.
 */
export async function write_document( { collection, document, data, add_timestamp=true, merge=true } ) {

    // Create a document reference. If no document is passed, a new one will be created
    let doc_reference = undefined
    if( document ) doc_reference = doc( db, collection, document )
    else doc_reference = doc( firestore_collection( db, collection ) )

    // Add timestamp fields
    if( add_timestamp ) {
        data.updated = Date.now()
        data.updated_human = new Date().toString()
    }

    // If this is a document creation, add the created timestamp
    if( !document ) {
        data.created = Date.now()
        data.created_human = new Date().toString()
    }

    // Returnd a document reference, returns the format { id: 'document_id' }
    const written_reference = await setDoc( doc_reference, data, { merge } ) || {}
    return { id: written_reference?.id || doc_reference?.id }

}


// ///////////////////////////////
// Analytics actions
// ///////////////////////////////
export function track_event( name ) {
    if( !name ) return
    if( import.meta.env.NODE_ENV == 'development' ) return verbose( 'Dummy analytics event: ', name )
    logEvent( analytics, name )
}