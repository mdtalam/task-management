import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../Component/Spinner";
import { AuthContext } from "../Providers/AuthProvider";


const PrivateRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext)
    const location = useLocation();
    if(loading){
        return <Spinner></Spinner>
    }
    if(user){
        return children
    }
    return <Navigate to="/" state={{from: location}} replace></Navigate>
};

export default PrivateRoute;