import { createBrowserRouter } from "react-router";
import MainLayOut from "../MainLayOut/MainLayOut";
import Home from "../Components/Pages/Home/Home";
import AllBooks from "../Components/Pages/AllBooks/AllBooks";
import AddBook from "../Components/Pages/AddBooks/AddBook";
import ViewBook from "../Components/Pages/ViewBook/ViewBook";
import BorrowSummary from "../Components/Pages/BorrowSummary/BorrowSummary";

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
            },
            {
                path:"/add-book",
                element:<AddBook/>
            },
            {
                path:"/view-book/:id",
                element:<ViewBook/>
            },
            {
                path:"/borrow-summary",
                element:<BorrowSummary/>
            }
        ]
    }
])

export default routes;