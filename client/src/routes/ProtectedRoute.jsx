import {Navigate, Outlet, useLocation} from "react-router-dom"
import useAuth from "../hooks/useAuth.js"
import Spinner from "../components/common/Spinner.jsx"

function ProtectedRoute({allowedRoles}) {

    const {isAuthenticated, isLoading, role} = useAuth()
    const location = useLocation()

    if(isLoading){
        return(
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner size={16}/>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to="/login" state={{from: location}} replace/>
    }

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/" replace/>
    }

  return <Outlet/>
}

export default ProtectedRoute
