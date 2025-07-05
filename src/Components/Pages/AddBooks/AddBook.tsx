import { useForm } from "react-hook-form";
import { useCreateBookMutation } from "../../../Redux/Api/baseApi";
import AddBookBanner from "./AddBookBanner";
import { FaBook, FaPlusCircle } from "react-icons/fa";
import NewsletterSection from "../../Shared/NewsletterSection/NewsletterSection";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

type TBook = {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description: string;
  copies: number;
};

const AddBook = () => {
  const [createBook] = useCreateBookMutation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<TBook>();

  const onSubmit = async (data: TBook) => {
    try {
        await createBook({
        ...data,
        copies: Number(data.copies),
        available: true,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Book Added!",
        text: "The book has been successfully added to the library.",
      });

      reset();
      const modal = document.getElementById("add_book_modal") as HTMLDialogElement | null;
      modal?.close();
      navigate("/books");
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
            name?: string;
            message?: string;
            errors?: Record<string, { message: string }>;
          };
        };

        if (err.status === 400 && err.data?.errors) {
          const errorMessages = Object.values(err.data.errors)
            .map((e) => e.message)
            .join(", ");

          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: errorMessages,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.data?.message || "Something went wrong. Please try again.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: "An unknown error occurred. Please try again later.",
        });
        console.error("Unhandled error:", error);
      }
    }
  };

  return (
    <div>
      <AddBookBanner />

      {/* Feature Section */}
      <div className="container mx-auto px-4 py-10 text-center space-y-4">
        <div className="flex justify-center text-[#16A086] text-4xl">
          <FaBook />
        </div>
        <h1 className="text-3xl font-bold">Add Your Favorite Book 📖</h1>
        <p className="text-gray-600">
          Easily manage your library by adding new books. Click the button below to begin!
        </p>

        {/* Modal Trigger Button */}
        <button
          className="btn bg-[#1BBC9B] hover:bg-[#169c85] text-white text-lg"
          onClick={() => {
            const modal = document.getElementById("add_book_modal") as HTMLDialogElement | null;
            modal?.showModal();
          }}
        >
          <FaPlusCircle className="mr-2" /> Add New Book
        </button>
      </div>

      {/* Add Book Form Modal */}
      <dialog id="add_book_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#16A086]">
            <FaBook /> Add New Book
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label font-medium mb-1">Title</label>
              <input
                {...register("title")}
                type="text"
                required
                placeholder="Enter book title"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium mb-1">Description</label>
              <textarea
                {...register("description")}
                required
                placeholder="Brief summary or content description"
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <div>
              <label className="label font-medium mb-1">Author</label>
              <input
                {...register("author")}
                type="text"
                required
                placeholder="Author name"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium mb-1">ISBN</label>
              <input
                {...register("isbn")}
                type="text"
                required
                placeholder="ISBN number"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium mb-1">Number of Copies</label>
              <input
                {...register("copies")}
                type="number"
                min="1"
                required
                placeholder="How many copies?"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium mb-1">Genre</label>
              <select
                {...register("genre")}
                required
                className="select select-bordered w-full"
              >
                <option value="" disabled selected>
                  Select genre
                </option>
                <option value="FICTION">Fiction</option>
                <option value="NON_FICTION">Non Fiction</option>
                <option value="SCIENCE">Science</option>
                <option value="HISTORY">History</option>
                <option value="BIOGRAPHY">Biography</option>
                <option value="FANTASY">Fantasy</option>
              </select>
            </div>

            <div className="text-end">
              <button
                type="submit"
                className="btn text-lg rounded-none h-12 bg-[#1BBC9B] hover:bg-[#16A086] text-white w-full"
              >
                Add Book
              </button>
            </div>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn text-white bg-red-600">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <NewsletterSection />
    </div>
  );
};

export default AddBook;
