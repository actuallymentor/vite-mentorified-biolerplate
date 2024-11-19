import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes/Routes'
import '@mantine/core/styles.css'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

    return <MantineProvider>

        <Router>

            <Routes />

        </Router>

    </MantineProvider>

}