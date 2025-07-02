import { createBrowserRouter } from "react-router";
import MainLayOut from "../MainLayOut/MainLayOut";
import Home from "../Components/Pages/Home/Home";
import AllBooks from "../Components/Pages/AllBooks/AllBooks";

const routes = createBrowserRouter([
    {
        path:"/",
        element:<MainLayOut/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/all-books",
                element:<AllBooks/>
            }
        ]
    }
])

export default routes;