import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Error from "../Pages/Error/Error";
import Login from "../Components/AuthComponents/Login/Login";


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