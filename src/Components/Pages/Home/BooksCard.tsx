import { MdEditSquare } from "react-icons/md";
import { useBorrowBookMutation, useDeleteBookMutation, useGetBooksQuery } from "../../../Redux/Api/baseApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import type { IBook, TBorrow } from "../../../Types/book.type";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UpdateBookModal from "../AllBooks/UpdateBookModal";
import { FiBookOpen } from "react-icons/fi";

const BooksCard = () => {
  const { data, isLoading } = useGetBooksQuery(undefined);
  // const [bookQuantity, setBookQuantity] = useState(5);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [deleteBook] = useDeleteBookMutation();
  const [createBorrow] = useBorrowBookMutation();
  const [borrowId, setBorrowId] = useState<string | undefined>(undefined);
  const [borrowCopies, setBorrowCopies] = useState<number>(0);
  const { register, handleSubmit, reset } = useForm<TBorrow>();
  const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5;
  
    const books = data?.data || [];
    const totalPages = Math.ceil(books.length / booksPerPage);
  
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-bars loading-xl text-[#1BBC9B]"></span>
      </div>
    );
  }

  const deleteHandler = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteBook(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

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
    <div className="py-10">
      <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {currentBooks?.map((book: IBook) => (
          <div
            key={book?._id}
            className="card bg-base-100 w-full max-w-xs mx-auto shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <figure className="w-full bg-gradient-to-br from-[#34495E] to-[#16A085] text-white relative">
              <div className="h-60 w-full flex flex-col justify-center items-center p-4 relative">
                <FiBookOpen className="text-5xl mb-3 text-white/80" />
                <div className="text-center space-y-1">
                  <h1 className="text-lg font-bold font-serif drop-shadow-md">{book?.title}</h1>
                  <p className="text-sm italic text-white/90">{book?.author}</p>
                </div>
                <div className="absolute top-0 left-0 h-full w-2 bg-white/20 rounded-r"></div>
                {book?.genre && (
                  <div className="absolute top-2 right-2 bg-white text-[#1BBC9B] text-xs font-semibold px-2 py-0.5 rounded shadow">
                    {book.genre}
                  </div>
                )}
              </div>
            </figure>

            <div className="card-body space-y-2 p-4">
              <h2 className="text-base font-semibold line-clamp-1 text-gray-800">{book?.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{book?.description}</p>
 <p className="text-sm font-medium text-green-600">
    Available Copies: {book?.copies}
  </p>
              <div className="card-actions justify-between items-center pt-2">
                {book?.available ? (
                  <button
                    onClick={() => {
                      setBorrowId(book?._id as string);
                      setBorrowCopies(book?.copies);
                      setTimeout(() => {
                        const modal = document.getElementById("borrow_modal") as HTMLDialogElement | null;
                        modal?.showModal();
                      }, 0);
                    }}
                    className="btn btn-sm bg-[#1BBC9B] hover:bg-[#169c85] text-white"
                  >
                    Borrow
                  </button>
                ) : (
                  <button className="btn btn-sm">Unavailable</button>
                )}

                <Link
                  to={`/books/${book?._id}`}
                  className="btn btn-sm btn-outline text-sm text-[#1BBC9B] hover:border-[#1BBC9B]"
                >
                  View
                </Link>

                <div className="flex gap-2 items-center text-lg">
                  <MdEditSquare
                    onClick={() => {
                      setSelectedBook(book);
                      setTimeout(() => {
                        const modal = document.getElementById("my_modal_1") as HTMLDialogElement | null;
                        modal?.showModal();
                      }, 0);
                    }}
                    className="cursor-pointer text-blue-500 hover:text-blue-600"
                  />
                  <RiDeleteBin5Fill
                    onClick={() => deleteHandler(book?._id)}
                    className="cursor-pointer text-red-500 hover:text-red-600"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

     

        <UpdateBookModal bookData={selectedBook} />

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
      <div className="text-center my-10">
             {/* Pagination */}
                <div className="flex justify-center my-10 gap-2 flex-wrap">
                  <button
                    className="btn btn-sm bg-[#1BBC9B] text-white"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
        
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`btn btn-sm ${currentPage === i + 1 ? "btn-active text-white bg-[#1BBC9B]" : ""}`}
                    >
                      {i + 1}
                    </button>
                  ))}
        
                  <button
                    className="btn btn-sm bg-[#1BBC9B] text-white"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
      </div>
    </div>
  );
};

export default BooksCard;
