import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Components/AuthComponents/Login"
import Register from "../Components/AuthComponents/Register";
import AddBlubs from "../Pages/AddBlubs/AddBlubs"
import PrivateRoute from "../Routes/PrivateRoute";
import AllBlubs from "../Pages/AllBlabs/AllBlubs";
import Loading from "../Components/Loader/Loading";
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/register",
                element: <Register></Register>
            },
            {
                path: "/allBlabs",
                element: <AllBlubs></AllBlubs>
            
            },
            {
                path: "/addBlubs",
                element: <PrivateRoute><AddBlubs></AddBlubs></PrivateRoute>
            },
            {
                path: "/*",
                element: <Error></Error>
            }
        ]
    },
    {
        path: "*",
        element: <Error></Error>
    }
])

export default router