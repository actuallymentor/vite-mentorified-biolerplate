import { useEffect, useState } from "react"
import { write_document } from "../modules/firebase"
import { useDebounce } from "use-debounce"
import { log } from "mentie"


/**
 * Custom hook for autosaving a document to Firestore.
 * 
 * @param {Object} options - The options for the hook.
 * @param {string} options.collection - The Firestore collection to save the document to.
 * @param {string} options.document - The document ID to save.
 * @param {Object} [options.content={}] - The content of the document to save.
 * @param {boolean} [options.log.info=false] - Whether to log log.info output.
 * @param {number} [options.debounce_interval=1000] - The debounce interval in milliseconds.
 * 
 * @returns {Object} - The data object and the updated timestamp.
 */
export const useAutosavedDocument = ( { collection, document, content={}, debounce_interval=1000, active=true } ) => {

    const [ updated, set_updated ] = useState( 0 )
    const [ data ] = useDebounce( content, debounce_interval, {
        equalityFn: ( prev, next ) => {

            // Which keys to ignore dufing comparisson
            const ignore = [ `updated`, `updated_human` ]

            // Compute the keys of both objects, but remove the ones to ignore
            const prev_keys = Object.keys( prev ).filter( key => !ignore.includes( key ) )
            const next_keys = Object.keys( next ).filter( key => !ignore.includes( key ) )

            // If the lengths are not equal, return false
            if( prev_keys.length !== next_keys.length ) {
                log.info( `Lengths are not equal` )
                return false
            }
            
            // Find the first key whose value differs
            const first_key = prev_keys.find( key => prev[ key ] !== next[ key ] )
            if( first_key ) {
                log.info( `First key that differs is ${ first_key }` )
                return false
            }

            // If no key differs, return true
            log.info( `No key differs, returning true` )
            return true
        }
    } )

    // Update the document when the debounced data changes
    useEffect( () => {

        // If the hook is not active, exit
        log.info( `Autosave active: `, active )
        if( !active ) return

        // Log the change
        log.info( `Debounced document changed to: `, data )

        // If the data is not an object, don't save it
        if( typeof data !== `object` ) return

        // If the user did not type anything yet, do not save
        if( Object.keys( data ).length === 0 ) return log.info( `Data has no properties: `, data )

        // Write the document to firestore, this is an async operation
        write_document( { collection, document, data } )
            .then( f => {
                log.info( `Document saved at ${ Date.now().toString() }` )
                set_updated( Date.now() )
            } )
            .catch( e => log.warn( `Error saving document: `, e ) )

    }, [ data ] )

    return {
        ...data,
        updated
    }

}