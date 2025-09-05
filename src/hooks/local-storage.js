import { useState, useEffect, useRef } from 'react'
import { log } from 'mentie'

// Custom event name for same-tab localStorage change notifications
const STORAGE_EVENT = 'localstorage-change'

// Helper to notify current tab listeners of a change to a specific key.
// We use a CustomEvent with detail so handlers can filter by key and value,
// avoiding reliance on the generic 'storage' event, which doesn't fire in the same tab.
const notify = ( key, valueString ) => {
    try {
        const detail = { key, value: valueString }
        window.dispatchEvent( new CustomEvent( STORAGE_EVENT, { detail } ) )
    } catch ( e ) {
        log.warn( 'Failed to dispatch localstorage-change event:', e )
    }
}

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
        let valueString = typeof content === 'string' ? content : JSON.stringify( content )
        store.setItem( key, valueString )
        try {
            log.info( `Successfully set ${ key } to:`, JSON.parse( valueString ) )
        } catch ( e ) {
            log.info( `Successfully set ${ key } to:`, valueString )
        }
        // Notify same-tab listeners with the serialized value
        notify( key, valueString )
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

        const raw = store.getItem( name )
        let content = null
        if( raw === null ) {
            content = null
        } else if( format === 'json' ) {
            try {
                content = JSON.parse( raw )
            } catch ( e ) {
                content = null
            }
        } else {
            content = `${ raw }`
        }

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
        notify( key, null )
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
    const valueRef = useRef( value )
    const serializedRef = useRef( undefined )

    // Keep refs in sync with state
    useEffect( () => {
        valueRef.current = value
        try {
            serializedRef.current = typeof value === 'string' ? value : JSON.stringify( value )
        } catch ( e ) {
            serializedRef.current = undefined
        }
    }, [ value ] )

    // Updater function for the localstorage state
    const set = value => {
        // Set in storage (also notifies same-tab)
        set_item( key, value )
        // Update local state immediately
        setValue( value )
        // Update refs proactively to avoid reacting to our own echo event
        try {
            serializedRef.current = typeof value === 'string' ? value : JSON.stringify( value )
        } catch ( e ) {
            log.info( 'Failed to serialize value for localstorage ref sync' )
        }
        valueRef.current = value
    }

    // Get the value from localstorage on mount if requested
    // note: not adding default_value to the dependency array, as this would cause an infinite loop
    useEffect( () => {

        if( !get_on_mount ) return

        const { content, error } = get_item( key, format )
        if( error ) return log.warn( `Error getting item from localstorage: `, error )
        log.info( `Got item from localstorage: `, content )
        const next = content === null || content === undefined ? default_value : content
        setValue( next )
        try {
            serializedRef.current = typeof next === 'string' ? next : JSON.stringify( next )
        } catch ( e ) {
            log.info( 'Failed to serialize next value for localstorage mount sync' )
        }
        valueRef.current = next

    }, [ key, format, get_on_mount ] )

    // Listen to localstorage events
    useEffect( () => {

        const parseByFormat = ( raw ) => {
            if( raw === null || raw === undefined ) return null
            if( format === 'json' ) {
                try {
                    return JSON.parse( raw )
                } catch ( e ) {
                    return null
                }
            }
            return `${ raw }`
        }

        const handleCustom = ( event ) => {
            const { detail } = event
            if( !detail || detail.key !== key ) return
            const newRaw = detail.value
            const newSerialized = newRaw == null ? null : `${ newRaw }`

            // Compare serialized form to avoid duplicate same-tab updates
            if( serializedRef.current === newSerialized ) return

            const next = newRaw == null ? default_value : parseByFormat( newRaw )
            log.info( `Value changed (custom): `, key, { old: valueRef.current, new: next } )
            setValue( next )
        }

        const handleStorage = ( event ) => {
            // Only react to our key and ignore unrelated storage changes
            if( event.key !== key ) return
            const newRaw = event.newValue
            const newSerialized = newRaw == null ? null : `${ newRaw }`
            if( serializedRef.current === newSerialized ) return

            const next = newRaw == null ? default_value : parseByFormat( newRaw )
            log.info( `Value changed (storage): `, key, { old: valueRef.current, new: next } )
            setValue( next )
        }

        window.addEventListener( STORAGE_EVENT, handleCustom )
        window.addEventListener( 'storage', handleStorage )
        return () => {
            window.removeEventListener( STORAGE_EVENT, handleCustom )
            window.removeEventListener( 'storage', handleStorage )
        }

    }, [ key, format, default_value ] )

    return [ value, set ]

}