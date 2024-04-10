import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { log, verbose } from "../modules/helpers"
import { set_item, useLocalStorage } from "./local-storage"

/**
 * Custom hook that allows easy manipulation of query parameters in the URL.
 * 
 * @param {string} key_to_set - The key of the query parameter to manipulate.
 * @param {string} [default_value=''] - The default value to use if the query parameter is not present in the URL.
 * @returns {Array} - An array containing the current value of the query parameter, and functions to update and delete the query parameter.
 * @returns {string} [0] - The current value of the query parameter.
 * @returns {function} [1] - The function to update the query parameter.
 */
export const useQuery = ( key_to_set, default_value='' ) => {

    // Get the search params from the URL
    const { 1: setSearchParamsRaw } = useSearchParams()
    const searchParams = new URLSearchParams( window.location.search )
    const [ current_value, set_current_value ] = useState( searchParams.get( key_to_set ) )

    // Listen to the localstorage to see if any other useQuery hooks have updated the url
    const { updated } = useLocalStorage( `useQuery_${ key_to_set }`, {} )
    const touch_localstorage = () => set_item( `useQuery_${ key_to_set }`, { updated: Date.now() }, true )

    // setSearchParams with logging built in
    const setSearchParams = ( newSearchParams ) => {
        verbose( `useQuery is setting the url: `, '?' + newSearchParams.toString() )
        setSearchParamsRaw( newSearchParams )
        set_current_value( newSearchParams.get( key_to_set ) )
    }

    // Helper that replaces the current url state entry with a new one that includes the new urlparams
    const replace_url = ( newSearchParams ) => {
        const new_url = '?' + newSearchParams.toString()
        verbose( `useQuery is replacing the url: `, new_url )
        window.history?.replaceState( null, null, '?' + newSearchParams.toString() )
    }

    // Create a function that updates the current search params with a value
    const setQueryParam = ( value, replace_current_url=false ) => {
        
        verbose( `Old search params: `, searchParams.toString() )
        const newSearchParams = new URLSearchParams( searchParams )
        newSearchParams.delete( key_to_set )
        newSearchParams.set( key_to_set, value )
        verbose( `New search params: `, newSearchParams.toString() )

        // if we don't need to replace the current url, just set the param
        if( !replace_current_url ) {
            setSearchParams( newSearchParams )
        } else {
            // If we need to replace the current url, use the history replacement method instead
            set_current_value( newSearchParams.get( key_to_set ) )
            replace_url( newSearchParams )
        }

        // Update the localstorage to let other useQuery hooks know that the url has been updated
        touch_localstorage()
        

    }

    // Create a function that deletes the current search params
    const deleteQueryParam = ( replace_current_url=false ) => {
        const newSearchParams = new URLSearchParams( searchParams )
        newSearchParams.delete( key_to_set )
        if( !replace_current_url ) return setSearchParams( newSearchParams )
        set_current_value( newSearchParams.get( key_to_set ) )
        replace_url( newSearchParams )
    }

    // Cross-hook url changes require going through an intermediary store, I'm using local storage
    // because react router does not listen to searchparams changes cross-components: https://github.com/remix-run/react-router/issues/9290
    // and js does not have "url changed" evebts
    useEffect( () => {

        verbose( `Checking if the localstorage has been updated` )

        // If updated is empty (which it is set to be on mount) exit
        if( !updated ) return

        // If the current value of the query param is the same as the one in the url, exit
        verbose( `Checking if the current value of ${ key_to_set } is the same as the one in the url` )
        const searchParams = new URLSearchParams( window.location.search )
        const potentially_new_value = searchParams.get( key_to_set )
        if( potentially_new_value == current_value ) return

        // If the current value of the query param is different from the one in the url, update the current value
        set_current_value( searchParams.get( key_to_set ) )

    }, [ updated ] )

    // If there is no current value, set the default value
    useEffect( () => {

        verbose( `Checking if ${ key_to_set } has a value` )

        // If there is a current value, exit
        if( current_value ) return

        // If there is no default value, exit
        if( !default_value ) return

        // Replace the current url with the url that includes the new search params
        verbose( `Key ${ key_to_set } has no value, setting default value ${ default_value }` )
        const newSearchParams = new URLSearchParams( searchParams )
        newSearchParams.set( key_to_set, default_value )
        replace_url( newSearchParams )

    }, [ default_value, current_value ] )

    // If the current value changes, log it out
    useEffect( () => log( `The current value of ${ key_to_set } has changed to: `, current_value ), [ current_value ] )

    // Return the current value and the function to update it
    return [ current_value || default_value, setQueryParam, deleteQueryParam ]

}