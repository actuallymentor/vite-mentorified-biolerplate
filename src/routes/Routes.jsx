import { Route, Routes as DOMRoutes } from "react-router-dom"
import Homepage from "../components/pages/Homepage"

export default function Routes() {
    
    return <DOMRoutes>

        <Route exact path='/' element={ <Homepage /> } />

    </DOMRoutes>
}