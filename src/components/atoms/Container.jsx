import styled from 'styled-components'
import { passable_props } from '../component_base'

export default styled.div`
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	min-height: 100vh;
	width: 100%;
	box-sizing: border-box;
	background-color: ${ ( { theme } ) => theme.colors.backdrop };
	& * {
		box-sizing: border-box;
	}

	// Implement generic passable props
	${ props => passable_props( props ) }

`