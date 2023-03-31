// Firebase functionality
import { initializeApp } from "firebase/app"
import { getFirestore, collection, setDoc, doc, onSnapshot, query, where, limit, orderBy } from "firebase/firestore"
import { getAnalytics, logEvent } from "firebase/analytics"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

import { log, dev } from './helpers'

// ///////////////////////////////
// Initialisation
// ///////////////////////////////

// Firebase config
const { VITE_apiKey, VITE_authDomain, VITE_projectId, VITE_storageBucket, VITE_messagingSenderId, VITE_appId, VITE_measurementId, VITE_recaptcha_site_key, VITE_APPCHECK_DEBUG_TOKEN } = process.env
const config = {
    apiKey: VITE_apiKey,
    authDomain: VITE_authDomain,
    projectId: VITE_projectId,
    storageBucket: VITE_storageBucket,
    messagingSenderId: VITE_messagingSenderId,
    appId: VITE_appId,
    measurementId: VITE_measurementId
}

log( 'Init firebase with ', config )

// Init app components
const app = initializeApp( config )
const analytics = getAnalytics( app )
const db = getFirestore( app )
const functions = getFunctions( app )

// App check config
// if( process.env.NODE_ENV === 'development' || VITE_APPCHECK_DEBUG_TOKEN ) self.FIREBASE_APPCHECK_DEBUG_TOKEN = VITE_APPCHECK_DEBUG_TOKEN || true
// log( 'Initialising app check with ', VITE_APPCHECK_DEBUG_TOKEN )
// const appcheck = initializeAppCheck( app, {
// 	provider: new ReCaptchaV3Provider( VITE_recaptcha_site_key ),
// 	isTokenAutoRefreshEnabled: true
// } )

// Remote functions
// const function_name = httpsCallable( functions, 'function_name' )


// Offline functions emulator
// Connect to functions emulator
if( process.env.VITE_useEmulator ) {
    connectFunctionsEmulator( functions, 'localhost', 5001 )
    log( `Using firebase functions emulator` )
}


/**
* Listen to a firestore document path
* @param {String} collection - The name of the collection
* @param {String} document - The path of the document within the given collection
* @param {Function} callback - The callback that receives the changed value of the document
* @returns {Function} Unsubscribe listener 
*/
export function listen_to_document( collection, document, callback ) {

    const d = doc( db, collection, document )

    return onSnapshot( d, snap => {

        const data = snap.data()
        log( `Retreived document ${ collection }/${ document }: `, data )
        callback( data )

    } )

}

// ///////////////////////////////
// Analytics actions
// ///////////////////////////////
export function track_event( name ) {
    if( !name ) return
    if( process.env.NODE_ENV == 'development' ) return log( 'Dummy analytics event: ', name )
    logEvent( analytics, name )
}