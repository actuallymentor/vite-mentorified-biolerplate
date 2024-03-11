import styled from 'styled-components'
import { passable_props } from '../component_base'

export default styled.section`
	padding:  0 min( 4rem, max( 1rem, calc( 30vw - 8rem ) ) );
	margin: 1rem 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	max-width: 100%;
	flex-wrap: wrap;
	${ props => passable_props( props ) }
`