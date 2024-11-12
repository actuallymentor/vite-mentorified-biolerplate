import styled from 'styled-components'
import { passable_props } from '../component_base'
import Menu from '../molecules/Menu'
import Footer from '../molecules/Footer'

const Wrapper = styled.div`
	position: relative;
	overflow: hidden;
	background: ${ ( { theme } ) => theme.colors.backdrop };
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	width: 100%;
	box-sizing: border-box;

	main {

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
		min-height: 100%;
		max-width: 100%;

		// Implement generic passable props
		${ passable_props };

	}

	// Implement generic passable props
	${ passable_props };

	& * {
		box-sizing: border-box;
		max-width: 100%;
	}
`

export default function Container( { menu=true, $footer=true, children, ...props } ) {

    return <Wrapper { ...props } $footer={ $footer }>

        { menu && <Menu /> }

        <main>
            { children }
        </main>

        { $footer && <Footer /> }


    </Wrapper>
}