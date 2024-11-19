import { Route, Routes as DOMRoutes } from "react-router-dom"
import { Suspense } from "react"
import { LoadingOverlay } from '@mantine/core'


// Statically loaded pages
import Homepage from "../components/pages/Homepage"

// Lazy loaded pages
// const Homepage = lazy( () => import( '../components/pages/Homepage' ) )

export default function Routes() {
    
    return <Suspense fallback={ <LoadingOverlay visible={ true } zIndex={ 1000 } /> }>
        
        <DOMRoutes>

            <Route exact path='/' element={ <Homepage /> } />

        </DOMRoutes>

    </Suspense>
}