// Elegant loading bar that fills to 70% in `duration` seconds, then last 30% over 10x duration
import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import Container from '../atoms/Container'
import { Text } from '../atoms/Text'
import useInterval from 'use-interval'
import { passable_props } from '../component_base'


const BarContainer = styled.div`
    width: 100%;
    max-width: 400px;
    min-width: 200px;
    height: 16px;
    border: 2px solid ${ props => props.theme.colors.primary };
    border-radius: 8px;
    overflow: hidden;
    background: ${ props => props.theme.colors.backdrop || '#fff' };
    margin: 1.5rem auto;
`

const BarFilling = styled.div`
    height: 100%;
    background: ${ props => props.theme.colors.primary };
    border-radius: 6px 0 0 6px;
`

/**
 * LoadingBar component
 * @param {number} duration - Duration in seconds for the first 70% of the bar
 */

export function LoadingBar ( { enabled=true, duration = 2, speed_cutoff_fraction=.7 } ) {


    // Setting initial state
    const [ progress_frac, set_progress_frac ] = useState( 0 )
    const animation_duration_ms = duration * 1_000
    const slowing_factor = .3

    useEffect( ( ) => {

        if( !enabled ) return


        let frame
        const animation_start = performance.now()

        function animate ( now ) {

            const elapsed_ms = now - animation_start
            let new_progress_fraction = elapsed_ms / animation_duration_ms
            const should_slow = new_progress_fraction > speed_cutoff_fraction
            if( should_slow ) {
                const remainder = new_progress_fraction - speed_cutoff_fraction
                new_progress_fraction = speed_cutoff_fraction +  remainder * slowing_factor 
            }

            const is_done = new_progress_fraction >= 1

            if( is_done ) set_progress_frac( 1 )
            if( !is_done ) set_progress_frac( new_progress_fraction )
            if( !is_done ) frame = requestAnimationFrame( animate )

        }

        // Start the animation
        frame = requestAnimationFrame( animate )

        // Cancel animation on cleanup
        return ( ) => cancelAnimationFrame( frame )

    }, [ enabled, duration, speed_cutoff_fraction ] )

    return (
        <BarContainer>
            <BarFilling style={ { width: `${ progress_frac * 100 }%` } } />
        </BarContainer>
    )
}

const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`

export const Spinner = styled.div`
	
	display: inline-block;
    flex: 0 0 auto;
	width: ${ ( { $size=80 } ) => `${ $size }px` };
	height: ${ ( { $size=80 } ) => `${ $size }px` };
	margin: 2rem;
    ${ passable_props }

	&:after {
		content: " ";
		display: block;
        /* Maintain proportions relative to outer $size (default 80px): 64/80, 8/80, 6/80 */
        width: ${ ( { $size=80 } ) => `${ 0.8 * $size }px` };
        height: ${ ( { $size=80 } ) => `${ 0.8 * $size }px` };
        margin: ${ ( { $size=80 } ) => `${ 0.1 * $size }px` };
		border-radius: 50%;
        border: ${ ( { $size=80 } ) => `${ 0.075 * $size }px` } solid ${ ( { theme } ) => theme.colors.primary };
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
export default function Loading( { enabled, delay=200, type='spinner', duration=10, message, children, ...props } ) {

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

    return <Container menu={ false } $align='center' $justify="center" { ...props }>
	
        { should_render && <>
            { type === 'spinner' && <Spinner /> }
            { type === 'bar' && <LoadingBar enabled={ enabled  } duration={ duration } /> }
            { message && <Text id='loading_text' $align="center">{ message }</Text> }
            { children }
        </> }

    </Container>
}