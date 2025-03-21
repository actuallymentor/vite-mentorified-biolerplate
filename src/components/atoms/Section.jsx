import styled from 'styled-components'
import { passable_props } from '../component_base'

const SectionBase = styled.section`
	padding:  2rem min( 4rem, max( 1rem, calc( 30vw - 8rem ) ) );
	margin: ${ ( { $margin='1rem 0' } ) => $margin };
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	max-width: 100%;
	flex-wrap: wrap;
	${ ( { $shadow, theme } ) => {
        if( $shadow ) return `box-shadow: ${ theme.shadows[1] }; background: ${ theme.colors.backdrop };`
    } }
	${ passable_props };
	`

export default function Section( { ...props } ) {
    return <SectionBase { ...props } />
}