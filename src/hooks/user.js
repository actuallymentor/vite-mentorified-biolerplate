import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "../modules/firebase"
import { get_item, remove_item, set_item } from "./local-storage"
import { log } from "mentie"


/**
 * Custom hook for managing user state and authentication.
 * @returns {Object} user - The user state and related functions.
 * @returns {undefined|'cache'|'firebase'} user.source - The source of the user state. Either undefined, 'firebase' or 'cache'.
 * @returns {String} user.uid - The user's unique id.
 * @returns {String} user.displayName - The user's name
 */
export const useUser = () => {

    const [ user, set_user ] = useState( { ...auth().currentUser, source: undefined } )

    // On mount, check if there is a user in localstorage
    useEffect( () => {

        // Get the last known user from localstorage
        const { content: last_known_user } = get_item( 'user' )

        // If firebase state is still loading, and localstorage has a user, set it to state
        if( !user.source && last_known_user ) {
            log.info( `Setting recovered user to state: `, last_known_user )
            set_user( { ...last_known_user, source: 'cache' } )
        }

    }, [] )

    // When the user changes, save it to localstorage
    useEffect( () => {

        // Log the user change
        log.info( `User changed: `, user )

        // If no user is logged in, exit
        if( !user.source ) return

        // If no user id is known, remove the user key
        if( !user.uid ) return remove_item( 'user' )

        // Save the user to localstorage
        set_item( 'user', user )

    }, [ user ] )

    // Listen to the firebase authentication state
    useEffect( () => {

        let unsubscribe = onAuthStateChanged( auth(), user => {

            // If the user is logged in, set the user object
            if( user ) return set_user( { source: 'firebase', ...user } )

            // If not, set the user to empty
            set_user( { source: 'firebase' } )

        } )

        return () => unsubscribe?.()

    }, [] )

    // if the user uid changed, log it out
    useEffect( () => log.info( `User changed: `, user ), [ user.uid ] )

    // Return user
    return user

}