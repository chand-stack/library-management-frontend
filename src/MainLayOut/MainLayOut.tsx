import { Outlet } from "react-router";
import Navbar from "../Components/Shared/Navbar/Navbar";
import Footer from "../Components/Shared/Footer/Footer";

const MainLayOut = () => {
    return (
        <div data-theme="light">
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default MainLayOut;