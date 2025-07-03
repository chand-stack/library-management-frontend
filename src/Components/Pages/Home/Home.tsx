import SectionTitle from "../../Shared/SectionTitle/SectionTitle";
import BooksCard from "./BooksCard";
import HomeBanner from "./HomeBanner";


const Home = () => {
 
    
    return (
        <div>
            <HomeBanner/>
            <SectionTitle title={"Discover Your Next Book"}/>
            <BooksCard/>
        </div>
    );
};

export default Home;