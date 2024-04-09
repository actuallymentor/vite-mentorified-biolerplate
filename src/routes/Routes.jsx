import { Route, Routes as DOMRoutes } from "react-router-dom"
import { Suspense } from "react"
import Loading from "../components/molecules/Loading"
import Toast from "../components/molecules/ToastContainer"

// Statically loaded pages
import Homepage from "../components/pages/Homepage"

// Lazy loaded pages
// const Homepage = lazy( () => import( '../components/pages/Homepage' ) )

export default function Routes() {
    
    return <Suspense fallback={ <Loading delay="500" message='Loading' /> }>

        <Toast />
        
        <DOMRoutes>

            <Route exact path='/' element={ <Homepage /> } />

        </DOMRoutes>

    </Suspense>
}