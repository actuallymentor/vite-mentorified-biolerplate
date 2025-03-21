import styled from 'styled-components'
import Section from '../atoms/Section'
import { passable_props } from '../component_base'

const HeroBase =  styled( Section )`
	position: relative;
	width: 100%;
	min-height: 600px;
	margin-top: 0;

	// Drop a small shadow that gives the impression of this element popping into the foreground
	box-shadow: ${ ( { theme } ) => theme.shadows[1] };

	${ passable_props }
`

const HeroContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 max( 1rem, calc( 25vw - 8rem ) );

	${ ( { $freeform } ) => {
        if( $freeform ) return ''
        return `
		& h1 {
			margin-bottom: .5rem;
			text-align: left;
		}
		& h2 {
			max-width: 400px;
		}
		& > p {
			margin: 0 0 4rem;
			max-width: 600px;
		}
		`
    } }


	// If there is a $background_image, apply a background color to the child h1 and h2
	${ ( { $background_image, theme } ) => $background_image && `
		& h1, & h2 {
			color: ${ theme.colors.text };
			padding: .5rem;
			text-shadow: 2px 2px 4px ${ theme.colors.backdrop };
		}
	` }

	& img.background {
		position: absolute;
		top: 0;
		left: 0;
		min-width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: .5;
	}

	${ passable_props }

`

export default function Hero( { children, ...props } ) {

    const { $background_image } = props

    return <HeroBase { ...props }>

        { $background_image && <HeroContainer { ...props }>
            <img className="background" src={ $background_image } alt="Hero background image" />
        </HeroContainer> }
        <HeroContainer { ...props }>{ children }</HeroContainer>
		
    </HeroBase>
}