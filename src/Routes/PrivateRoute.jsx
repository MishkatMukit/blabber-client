
import { useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loader/Loading";


const PrivateRoute = ({children}) => {
    const {user,loading} = useAuth()
    const location = useLocation()
    if(loading){
        return <Loading></Loading>
    }
    if(user) return children
    else return <Navigate state={location.pathname} to="/login"></Navigate> 
    
};

export default PrivateRoute;