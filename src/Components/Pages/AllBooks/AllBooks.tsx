import { MdEditSquare } from "react-icons/md";
import { useGetBooksQuery } from "../../../Redux/Api/baseApi";
import { RiDeleteBin5Fill } from "react-icons/ri";

const AllBooks = () => {
       const{data,isLoading}=useGetBooksQuery(undefined)

    if(isLoading){
        return <p>loading.......</p>
    }
    console.log(data.data);
    return (
        <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {
                data?.data?.map(book=> <div key={book?._id} className="card bg-base-100 w-full shadow-sm">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{book?.title}</h2>
    <p>{book?.description}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
      <MdEditSquare />
      <RiDeleteBin5Fill />
    </div>
  </div>
</div>)
            }
        </div>
    );
};

export default AllBooks;