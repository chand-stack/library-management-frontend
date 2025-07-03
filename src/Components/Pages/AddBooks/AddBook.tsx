import { useForm } from "react-hook-form";
import { useCreateBookMutation } from "../../../Redux/Api/baseApi";
import AddBookBanner from "./AddBookBanner";
import { FaBook } from "react-icons/fa";
import NewsletterSection from "../../Shared/NewsletterSection/NewsletterSection";

const AddBook = () => {
    const[createBook]=useCreateBookMutation();

    const {register,handleSubmit} = useForm()
  const onSubmit = async (data) => {
    const res = await createBook({...data,copies:Number(data.copies),available:true}).unwrap()
    console.log(res)}
    return (
      <div>
        <AddBookBanner/>
        <div className="container mx-auto px-4 py-10">
  <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-xl shadow-lg border border-base-200">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#16A086]">
      <FaBook /> Add New Book
    </h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
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

      {/* Description */}
      <div>
        <label className="label font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          required
          placeholder="Brief summary or content description"
          className="textarea textarea-bordered w-full"
        ></textarea>
      </div>

      {/* Author */}
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

      {/* ISBN */}
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

      {/* Copies */}
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

      {/* Genre */}
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

      {/* Submit Button */}
      <div className="text-end">
        <button type="submit" className="btn text-lg rounded-none h-12 bg-[#1BBC9B] hover:bg-[#16A086] text-white">
          Add Book
        </button>
      </div>
    </form>
  </div>
</div>
<NewsletterSection/>
        </div>
    );
};

export default AddBook;