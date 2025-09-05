import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../modules/firebase"
import { log } from 'mentie'
import { get_item, remove_item, set_item } from "../hooks/local-storage"


// Create the user store with Zustand
export const useUserStore = create(
    subscribeWithSelector( ( set, get ) => ( {
        // Initial state
        user: { ...auth().currentUser, source: undefined },
        
        // Actions
        setUser: ( userData ) => {
            log.info( 'Setting user to store:', userData )
            set( { user: userData } )
        },
        
        // Initialize user from cache and set up Firebase listener
        initializeUser: () => {
            const { user } = get()
            
            // Get the last known user from localStorage
            const { content: lastKnownUser } = get_item( 'user' )
            
            // If firebase state is still loading, and localStorage has a user, set it to state
            if( !user.source && lastKnownUser ) {
                log.info( 'Setting recovered user to state:', lastKnownUser )
                set( { user: { ...lastKnownUser, source: 'cache' } } )
            }
            
            // Set up Firebase auth listener
            const unsubscribe = onAuthStateChanged( auth(), ( firebaseUser={} ) => {
                set( { user: { source: 'firebase', ...firebaseUser } } )
            } )
            
            // Return cleanup function
            return unsubscribe
        },
        
        // Clear user data
        clearUser: () => {
            remove_item( 'user' )
            set( { user: { source: 'firebase' } } )
        }
    } ) )
)

// Initialize the store and set up localStorage persistence
let isInitialized = false
let authUnsubscribe = null

export const initializeUser = () => {
    if( isInitialized ) return
    
    isInitialized = true
    
    // Initialize user from cache and Firebase
    authUnsubscribe = useUserStore.getState().initializeUser()
    
    // Subscribe to user changes and persist to localStorage
    useUserStore.subscribe(
        ( state ) => state.user,
        ( user ) => {
            log.info( 'User changed in store:', user )
            
            // If no user source is set, exit
            if( !user.source ) return
            
            // If no user id is known, remove the user key
            if( !user.uid ) return remove_item( 'user' )
            
            // Save the user to localStorage
            set_item( 'user', user )
        },
        { fireImmediately: false }
    )
}

// Cleanup function for when the app unmounts
export const cleanupUserStore = () => {
    if( authUnsubscribe ) {
        authUnsubscribe()
        authUnsubscribe = null
    }
    isInitialized = false
}

// Hook to use the user store
export const useUser = () => {
    // Initialize the store if not already done
    if( !isInitialized ) {
        initializeUser()
    }
    
    return useUserStore( ( state ) => state.user )
}
