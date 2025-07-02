import { createBrowserRouter } from "react-router";
import MainLayOut from "../MainLayOut/MainLayOut";
import Home from "../Components/Pages/Home/Home";

const routes = createBrowserRouter([
    {
        path:"/",
        element:<MainLayOut/>,
        children:[
            {
                path:"/",
                element:<Home/>
            }
        ]
    }
])

export default routes;