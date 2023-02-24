import { BrowserRouter as Router } from 'react-router-dom'
import Theme from './components/atoms/Theme'
import Routes from './routes/Routes'

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

    return <Theme>

        <Router>

            <Routes />

        </Router>

    </Theme>

}