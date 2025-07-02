import { useParams } from "react-router";
import { useGetBookByIdQuery } from "../../../Redux/Api/baseApi";

const ViewBook = () => {
    const {id} = useParams()
    const {data,isLoading}= useGetBookByIdQuery(id as string)
    if(isLoading){
        return <p>loading.......</p>
    }
    console.log(data.data);
    
    return (
        <div>
            <h1>{data?.data?.title}</h1>
        </div>
    );
};

export default ViewBook;