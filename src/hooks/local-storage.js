import { log } from "mentie"
import { useEffect, useState } from "react"

// Helper function that notified the current window that the localstorage has been updated
// for reasons, events are only dispatched to other windows, not the current one: https://stackoverflow.com/questions/35865481/storage-event-not-firing
const notify = () => window.dispatchEvent( new Event( 'storage' ) )

// Get the localstorage object
const { localStorage: store } = window

/**
 * Set an entry to localstorage
 * @param {String} key - The key to set
 * @param {*} content - The content to set, all content will be stringified for storage
 * @returns {Object} { content, error }
*/
export const set_item = ( key, content ) => {

    try {

        // If the content is not a string, stringify it (localstorage only takes strings)
        if( typeof content != 'string' ) content = JSON.stringify( content )
        store.setItem( key, content )
        try {
            log.info( `Successfully set ${ key } to:`, JSON.parse( content ) )
        } catch ( e ) {
            log.info( `Successfully set ${ key } to:`, content )
        }
        notify()
        return { content }

    } catch ( e ) {
        log.warn( `Error storing item in localstorage: `, e )
        return { error: e.message }
    }

}

/**
 * Get an entry from localstorage
 * @param {String} key - The key to get
 * @param {'json'|'string'} format - The format of the content, assumed to be a string unless it is set as json
 * @returns {Object} { content, error }
*/
export const get_item = ( name, format='json' ) => {

    try {

        let content = store.getItem( name )
        if( format == 'json' ) content = JSON.parse( content )
        else content = `${ content }`

        log.info( `Successfully got ${ name }:`, content )
        return { content }

    } catch ( e ) {
        log.warn( `Error retreiving item in localstorage: `, e )
        return { error: e.message }
    }

}

/**
 * Remove an entry from localstorage
 * @param {String} key - The key to delete
 * @returns {Object} { error }
*/
export const remove_item = key => {

    try {
        window.localStorage.removeItem( key )
        notify()
    } catch ( e ) {
        log.warn( `Error removing item from localstorage: `, e )
        return { error: e.message }
    }

}


/**
 * Custom hook for managing data in local storage.
 * @param {Object} options - The options for the hook.
 * @param {string} options.key - The key to use for storing the data in local storage.
 * @param {*} options.default_value - The default value to use if no value is found in local storage.
 * @param {string} [options.format='json'] - The format of the data to be stored in local storage.
 * @param {boolean} [options.get_on_mount=false] - Whether to get the value from local storage on component mount.
 * @returns {Array} - An array containing the current value and a function to update the value.
 */
export const useLocalStorage = ( { key, default_value={}, format='json', get_on_mount=false, report_loading_state=false } ) => {

    const [ value, setValue ] = useState( report_loading_state ? { loading: true } : {} )

    // Updater function for the localstorage state
    const set = value => {
        set_item( key, value )
        setValue( value )
    }

    // Get the value from localstorage on mount if requested
    // note: not adding default_value to the dependency array, as this would cause an infinite loop
    useEffect( () => {

        if( !get_on_mount ) return

        const { content, error } = get_item( key, format )
        if( error ) return log.warn( `Error getting item from localstorage: `, error )
        log.info( `Got item from localstorage: `, content )
        setValue( content || default_value )

    }, [ key, format, get_on_mount ] )

    // Listen to localstorage events
    useEffect( () => {

        const handle_storage_change = event => {

            // // Get the current value of the key, reason for not using event.key is that this does not work cross-tab
            const { content, error } = get_item( key, format )

            // If there was an error, return
            if( error ) return log.warn( `Error getting item from localstorage: `, error )

            // Check (naively) if new content differs from current value
            if( JSON.stringify( content ) == JSON.stringify( value ) ) return log.info( `Value didn't change: `, content, value )

            // If the value changed, update the state
            log.info( `Value changed: `, key, content )
            setValue( content || default_value )

        }

        window.addEventListener( 'storage', handle_storage_change )
        return () => window.removeEventListener( 'storage', handle_storage_change )

    }, [ key ] )

    return [ value, set ]

}