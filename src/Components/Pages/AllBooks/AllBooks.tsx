import { MdEditSquare } from "react-icons/md";
import { useDeleteBookMutation, useGetBooksQuery } from "../../../Redux/Api/baseApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import type { IBook } from "../../../Types/book.type";
import Swal from "sweetalert2";



const AllBooks = () => {
       const{data,isLoading}=useGetBooksQuery(undefined)
       const [deleteBook] = useDeleteBookMutation()

    if(isLoading){
        return <p>loading.......</p>
    }
    console.log(data.data);


    const editBookController = (book:IBook) => {
  const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
  if (modal) {
    modal.showModal();
  } else {
    console.warn('Modal element not found');
  }
  console.log(book, "from view");
};

const deleteHandler = async (id:string)=>{


    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
    const res = deleteBook(id)
console.log(res);
  if (result.isConfirmed) {
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});
}
    return (
        <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {
                data?.data?.map((book:IBook)=> <div key={book?._id} className="card bg-base-100 w-full shadow-sm">
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
      <button  className="btn btn-primary">View</button>
      <MdEditSquare onClick={()=>{editBookController(book)}}/>
      <RiDeleteBin5Fill onClick={()=>deleteHandler(book?._id)} />
    </div>
  </div>
</div>)
            }

            <dialog id="my_modal_1" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click the button below to close</p>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
        </div>
    );
};

export default AllBooks;