import { MdEditSquare } from "react-icons/md";
import { useBorrowBookMutation, useDeleteBookMutation, useGetBooksQuery } from "../../../Redux/Api/baseApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import type { IBook } from "../../../Types/book.type";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UpdateBookModal from "../AllBooks/UpdateBookModal";



const BooksCard = () => {
       const{data,isLoading}=useGetBooksQuery(undefined)
       const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
       const [deleteBook] = useDeleteBookMutation()
       const [createBorrow] = useBorrowBookMutation()
       const [borrowId,setBorrowId]= useState<string>()
         const {register,handleSubmit} = useForm()

    if(isLoading){
        return <p>loading.......</p>
    }
    console.log(data.data);
    console.log(borrowId);
    


//     const editBookController = (book:IBook) => {
//   const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
//   if (modal) {
//     modal.showModal();
//   } else {
//     console.warn('Modal element not found');
//   }
//   console.log(book, "from view");
// };

const deleteHandler = async (id:string)=>{
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then( async(result) => {
    const res = await deleteBook(id)
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

 const onSubmit = async (data) => {
    const res = await createBorrow({...data,book:borrowId, quantity:Number(data?.quantity)}).unwrap()
    console.log(res)}
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
     <button
  onClick={() => {
    const modal = document.getElementById('borrow_modal') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal(); // ✅ This is the missing part
    }
    setBorrowId(book?._id as string);
  }}
  className="btn btn-primary"
>
  Borrow Now
</button>
      <Link to={`/books/${book?._id}`} className="btn btn-primary">View</Link>
     <MdEditSquare
  onClick={() => {
    setSelectedBook(book); // ✅ Set selected book
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
    if (modal) modal.showModal(); // ✅ Open modal
  }}
  className="cursor-pointer"
/>
      <RiDeleteBin5Fill onClick={()=>deleteHandler(book?._id)} />
    </div>
  </div>
</div>)
            }

            <UpdateBookModal bookData={selectedBook}/>
          

{/* borrow modal */}
            <dialog id="borrow_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-2xl">
                <fieldset className="fieldset">
  <legend className="fieldset-legend">Quantity</legend>
  <input {...register("quantity")} required type="number" className="input" placeholder="Type here" />
</fieldset>
                <fieldset className="fieldset">
  <legend className="fieldset-legend">Due Date</legend>
   <input {...register("dueDate")} required type="date" className="input" placeholder="Type here" />
</fieldset>
<div>

<button className="btn">Borrow Now</button>
</div>
            </form>
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

export default BooksCard;