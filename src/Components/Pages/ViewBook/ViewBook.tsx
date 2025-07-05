// import { useParams, useNavigate } from "react-router-dom";
import {
  useGetBookByIdQuery,
  useDeleteBookMutation,
  useBorrowBookMutation,
} from "../../../Redux/Api/baseApi";
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaBookOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import type { IBook, TBorrow } from "../../../Types/book.type";
import UpdateBookModal from "../AllBooks/UpdateBookModal";
import { useForm } from "react-hook-form";

const ViewBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const { data, isLoading } = useGetBookByIdQuery(id as string);
  const [deleteBook] = useDeleteBookMutation();
  const [createBorrow] = useBorrowBookMutation();
  const { register, handleSubmit, reset } = useForm<TBorrow>();
  const [borrowId, setBorrowId] = useState<string | undefined>(undefined);
  const [borrowCopies, setBorrowCopies] = useState<number>(0);

  const book = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }

  // delete handler
  const handleDelete = async (id:string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteBook(id);
        Swal.fire("Deleted!", "The book has been deleted.", "success");
        navigate("/books"); // change route as needed
      }
    });
  };

  // borrow handler
   const onSubmit = async (data: TBorrow) => {
    if (!borrowId) return;

    if (Number(data?.quantity) > borrowCopies) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: `You cannot borrow more than ${borrowCopies} copies of this book.`,
        footer: "Please reduce the quantity and try again.",
      });
      const modal = document.getElementById("borrow_modal") as HTMLDialogElement | null;
      modal?.close();
      reset();
      return;
    }

    try {
       await createBorrow({
        ...data,
        book: borrowId,
        quantity: Number(data?.quantity),
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Book Borrowed",
        text: "Your borrow request has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      const modal = document.getElementById("borrow_modal") as HTMLDialogElement | null;
      modal?.close();
      reset();
      navigate("/borrow-summary");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        "status" in error
      ) {
        const err = error as {
          status: number;
          data: {
            name: string;
            errors: Record<string, { message: string }>;
          };
        };

        if (err.status === 400 && err.data.name === "ValidationError") {
          const errorMessages = Object.values(err.data.errors)
            .map((e) => e.message)
            .join(", ");

          Swal.fire({
            icon: "error",
            title: "Validation Failed",
            text: errorMessages,
          });
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
    <div className="min-h-[80vh] flex justify-center items-center">
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Book Cover */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-[#1BBC9B] to-[#16A085] text-white p-6 rounded-lg shadow relative">
          <FaBookOpen className="text-5xl mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-center">{book?.title}</h2>
          <p className="text-center italic">{book?.author}</p>
          {book?.genre && (
            <div className="absolute top-4 right-4 bg-white text-[#1BBC9B] text-xs font-semibold px-2 py-1 rounded shadow">
              {book.genre}
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{book?.title}</h1>
          <p className="text-gray-600">{book?.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p><span className="font-semibold">Author:</span> {book?.author}</p>
            <p><span className="font-semibold">Genre:</span> {book?.genre}</p>
            <p><span className="font-semibold">ISBN:</span> {book?.isbn}</p>
            <p><span className="font-semibold">Copies:</span> {book?.copies}</p>
            <p><span className="font-semibold">Available:</span> {book?.available ? "Yes" : "No"}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="btn btn-sm btn-error flex items-center gap-1"
              onClick={()=>handleDelete(book?._id)}
            >
              <RiDeleteBin5Fill /> Delete
            </button>
            {book?.available ? <button
              className="btn btn-sm btn-accent flex items-center gap-1"
              onClick={() => {
                      setBorrowId(book?._id as string);
                      setBorrowCopies(book?.copies);
                      setTimeout(() => {
                        const modal = document.getElementById("borrow_modal") as HTMLDialogElement | null;
                        modal?.showModal();
                      }, 0);
                    }}
            >
              📖 Borrow
            </button> : <button className="btn btn-sm">Unavailable</button>}
            <button
              className="btn btn-sm btn-info flex items-center gap-1"
               onClick={() => {
                      setSelectedBook(book);
                      setTimeout(() => {
                        const modal = document.getElementById("my_modal_1") as HTMLDialogElement | null;
                        modal?.showModal();
                      }, 0);
                    }}
            >
              <MdEditSquare /> Edit
            </button>
          </div>
        </div>
      </div>

      <UpdateBookModal bookData={selectedBook} />

      {/* Optional: Borrow Modal */}
        <dialog id="borrow_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Borrow Book</h3>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto w-full max-w-2xl space-y-4"
            >
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Quantity</legend>
                <input
                  {...register("quantity")}
                  required
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Type here"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Due Date</legend>
                              <input
  {...register("dueDate")}
  required
  type="date"
  className="input input-bordered w-full"
  placeholder="Select a date"
  min={new Date().toISOString().split("T")[0]} // disables past dates
/>
              </fieldset>
              <div>
                <button className="btn bg-[#1BBC9B] hover:bg-[#16A086] text-white w-full">Borrow Now</button>
              </div>
            </form>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn text-white bg-red-600">Close</button>
              </form>
            </div>
          </div>
        </dialog>
    </div>
    </div>
  );
};

export default ViewBook;
