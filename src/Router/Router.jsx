import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Components/AuthComponents/Login"
import Register from "../Components/AuthComponents/Register";
import AddBlabs from "../Pages/AddBlabs/AddBlabs"
import PrivateRoute from "../Routes/PrivateRoute";
import AllBlubs from "../Pages/AllBlabs/AllBlabs";
import Dashboard from "../Pages/Dashboard/Dashboard";
import BlabDetails from "../Pages/BlabDetails/BlabDetails";
import UserDashboard from "../Pages/UserDashboard/UserDashboard";
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
                path: "/blabdetails/:id",
                element: <PrivateRoute><BlabDetails></BlabDetails></PrivateRoute>
            },
            {
                path: "/addBlabs",
                element: <PrivateRoute><AddBlabs></AddBlabs></PrivateRoute>
            },
            {
                path: "/dashboard",
                element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>
            },
            {
                path: "/UserDashboard/:id",
                element: <PrivateRoute><UserDashboard></UserDashboard></PrivateRoute>
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