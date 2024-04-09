// Import React and necessary styled-components
import React, { Suspense, lazy } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

// Lazy load ToastContainer and Slide
const LazyToastContainer = lazy( () => import( 'react-toastify' ).then( module => ( { default: module.ToastContainer } ) ) )
const Slide = lazy( () => import( 'react-toastify' ).then( module => ( { default: module.Slide } ) ) )

// Styled component
const StyledToast = styled( LazyToastContainer )`

    .Toastify__toast {
        background: ${ ( { theme } ) => theme.colors.backdrop };
        color: ${ ( { theme } ) => theme.colors.text };
        box-shadow: ${ ( { theme } ) => theme.shadows[0] };
    }

    .Toastify__progress-bar {
        background: ${ ( { theme } ) => theme.colors.primary };
    }

    .Toastify__toast-icon svg {
        fill: ${ ( { theme } ) => theme.colors.accent };
    }

    .Toastify__close-button {
        color: ${ ( { theme } ) => theme.colors.text };
        align-self: center;
    }

`

// Component using Suspense for lazy loading
export default function Toast( props ) {
    return (
        <Suspense fallback={ null }>
            <StyledToast
                { ...props }
                position='top-center'
                autoClose={ 5000 }
                transition={ Slide }
            />
        </Suspense>
    )
}
