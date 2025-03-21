import styled, { keyframes } from 'styled-components'
import Container from '../atoms/Container'
import { Text } from '../atoms/Text'
import { useEffect, useState } from 'react'
import useInterval from 'use-interval'

const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`

const Spinner = styled.div`
	
	display: inline-block;
	width: 80px;
	height: 80px;
	margin: 2rem;

	&:after {
		content: " ";
		display: block;
		width: 64px;
		height: 64px;
		margin: 8px;
		border-radius: 50%;
		border: 6px solid ${ ( { theme } ) => theme.colors.primary };
		border-color: ${ ( { theme } ) => theme.colors.primary } transparent ${ ( { theme } ) => theme.colors.primary } transparent;
		animation: ${ rotate } 1.2s linear infinite;
	}

`

/**
 * A component that displays a loading spinner and optional message while content is being loaded.
 * @param {number} delay - The delay in milliseconds before the loading spinner is displayed.
 * @param {string} message - The optional message to display below the loading spinner.
 * @param {ReactNode} children - The optional children to render below the loading spinner and message.
 * @param {object} props - Additional props to pass to the container element.
 * @returns {JSX.Element} The rendered Loading component.
 */
export default function Loading( { delay=200, message, children, ...props } ) {

    const [ mount_time, set_mount_time ] = useState( Date.now() )
    const [ should_render, set_should_render ] = useState( delay ? false : true )
	
    // Record mount time
    useEffect( () => {
        set_mount_time( Date.now() )
    } , [] )

    // Periodically check if the delay has passed
    useInterval( () => {
        set_should_render( Date.now() - mount_time > delay )
    }, should_render ? null : 100 )

    return <Container $align='center' $justify="center" { ...props }>
	
        { should_render && <>
            <Spinner />
            { message && <Text id='loading_text' $align="center">{ message }</Text> }
            { children }
        </> }

    </Container>
}