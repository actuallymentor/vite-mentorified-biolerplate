import React from 'react'
import { ThemeProvider } from 'styled-components'

const theme = {
	colors: {
		primary: 'black',
		text: 'black',
		accent: 'orange',
		hint: 'grey',
		backdrop: 'rgba( 0, 0, 0, .05 )'
	}
}

export default props => <ThemeProvider { ...props } theme={ theme } />