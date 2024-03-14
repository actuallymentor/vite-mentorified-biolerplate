import styled from 'styled-components'
import { passable_props } from '../component_base'
import Menu from '../molecules/Menu'
import Footer from '../molecules/Footer'

const Wrapper = styled.div`
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	min-height: 100vh;
	min-height: 100dvh;
	width: 100%;
	box-sizing: border-box;
	background-color: ${ ( { theme } ) => theme.colors.backdrop };
	padding-bottom: ${ ( { footer } ) => footer ? '0' : '4rem' };
	& * {
		box-sizing: border-box;
		max-width: 100%;
	}

	// Implement generic passable props
	${ props => passable_props( props ) }

`

export default function Container( { menu=true, footer=true, children, ...props } ) {

    return <Wrapper { ...props } footer={ footer }>

        { menu && <Menu /> }

        { children }

        { footer && <Footer /> }


    </Wrapper>
}