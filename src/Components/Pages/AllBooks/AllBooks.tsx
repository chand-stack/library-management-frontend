import { MdEditSquare } from "react-icons/md";
import { FiBookOpen } from "react-icons/fi";
import { useBorrowBookMutation, useDeleteBookMutation, useGetBooksQuery } from "../../../Redux/Api/baseApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import type { IBook, TBorrow } from "../../../Types/book.type";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UpdateBookModal from "./UpdateBookModal";
import AllBooksBanner from "./AllBooksBanner";
import NewsletterSection from "../../Shared/NewsletterSection/NewsletterSection";

const AllBooks = () => {
  const { data, isLoading } = useGetBooksQuery(undefined);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [deleteBook] = useDeleteBookMutation();
  const [createBorrow] = useBorrowBookMutation();
  const [borrowId, setBorrowId] = useState<string>();
  const [borrowCopies, setBorrowCopies] = useState<number>(0);
  const { register, handleSubmit, reset } = useForm<TBorrow>();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);



  useEffect(() => {
    if (showEditModal) {
      const modal = document.getElementById("my_modal_1") as HTMLDialogElement | null;
      modal?.showModal();
      setShowEditModal(false);
    }
  }, [showEditModal]);

  useEffect(() => {
    if (showBorrowModal) {
      const modal = document.getElementById("borrow_modal") as HTMLDialogElement | null;
      modal?.showModal();
      setShowBorrowModal(false);
    }
  }, [showBorrowModal]);

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
          text: "Your Book has been deleted.",
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
    <div>
      <AllBooksBanner />
      <div className="container mx-auto px-5 overflow-x-auto my-10">
        <table className="table w-full min-w-[700px]">
          <thead>
            <tr className="bg-[#1BBC9B] text-white">
              <th></th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Copies</th>
              <th>Availability</th>
              <th>View</th>
              <th>Edit Book</th>
              <th>Delete Book</th>
              <th>Borrow Book</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((book: IBook, index: number) => (
              <tr key={book?._id} className="hover:bg-gray-100 transition-colors">
                <th>{index + 1}</th>
                <td>{book?.title}</td>
                <td>{book?.author}</td>
                <td>{book?.genre}</td>
                <td>{book?.isbn}</td>
                <td className="text-center">{book?.copies}</td>
                <td>{book?.available ? "Available" : "Unavailable"}</td>
                <td>
                  <Link to={`/books/${book?._id}`} className="btn btn-sm btn-primary">
                    View
                  </Link>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setShowEditModal(true);
                    }}
                    className="btn btn-sm btn-warning"
                    title="Edit Book"
                  >
                    <MdEditSquare />
                  </button>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => deleteHandler(book?._id)}
                    className="btn btn-sm btn-error"
                    title="Delete Book"
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </td>
                <td className="text-center">
                  {book?.available ? (
                    <button
                      onClick={() => {
                        setBorrowId(book._id as string);
                        setBorrowCopies(book.copies);
                        setShowBorrowModal(true);
                      }}
                      className="btn btn-sm btn-success"
                      title="Borrow Book"
                    >
                      <FiBookOpen />
                    </button>
                  ) : (
                    <button className="btn btn-sm">Unavailable</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      

        <UpdateBookModal bookData={selectedBook} />

        {/* Borrow Modal */}
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
      <NewsletterSection />
    </div>
  );
};

export default AllBooks;
