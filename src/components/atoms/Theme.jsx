import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { log } from '../../modules/helpers'

const shared_colors = {
    accent: 'lightgreen',
    success: 'green',
    error: 'red',
    shadow: {
        light: 'rgba( 0, 0, 0, .2 )',
        dark: 'rgba( 255, 255, 255, .4 )'
    }
}

const theme = {
    colors: {
        primary: 'black',
        text: 'black',
        hint: 'grey',
        backdrop: 'white',
        ...shared_colors
    },
    shadows: {
        0: `0 0 5px 0px ${ shared_colors.shadow.light }`,
        1: `0 0 10px 1px ${ shared_colors.shadow.light }`,
        2: `0 0 10px 5px ${ shared_colors.shadow.light }`,
        color: shared_colors.shadow.light
    }
}

const theme_dark = {
    colors: {
        primary: 'white',
        text: 'white',
        hint: 'lightgrey',
        backdrop: '#000000',
        ...shared_colors
    },
    shadows: {
        0: `0 0 10px 2px ${ shared_colors.shadow.dark }`,
        1: `0 0 10px 5px ${ shared_colors.shadow.dark }`,
        2: `0 0 10px 10px ${ shared_colors.shadow.dark }`,
        color: shared_colors.shadow.dark
    }
}

export default props => {

    const [ dark, setDark ] = useState( false )

    useEffect( f => {

        // If API is not available, assume light
        if( !window.matchMedia ) {
            log( 'No darkmode detection support' )
            return setDark( false )
        }

        // Check with API
        const prefers_dark = window.matchMedia( '(prefers-color-scheme: dark)' ).matches
        setDark( prefers_dark )
        log( `User prefers ${ prefers_dark ? 'dark' : 'light' } theme` )

        // Enable a listener
        window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', event => {
            log( 'Darkmode setting changed to ', event.matches )
            setDark( event.matches )
        } )

    }, [] )

    return <ThemeProvider { ...props } theme={ dark ? theme_dark : theme } />
}