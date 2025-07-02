import { useForm } from "react-hook-form";
import type { IBook } from "../../../Types/book.type";
import { useEffect } from "react";
import { useUpdateBookMutation } from "../../../Redux/Api/baseApi";

const UpdateBookModal = ({ bookData }: { bookData: IBook | null }) => {
  const { register, handleSubmit, reset } = useForm<IBook>();
  const [updateBook, { isLoading, isSuccess, error }]=useUpdateBookMutation()

  // 🧠 Reset form values when bookData changes
  useEffect(() => {
    if (bookData) {
      reset(bookData);
    }
  }, [bookData, reset]);

  const onSubmit = async (data: IBook) => {
     try {
      const res = await updateBook(data).unwrap();
      console.log("Book updated:", res);

      const modal = document.getElementById("my_modal_1") as HTMLDialogElement | null;
      modal?.close();

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Book</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-2xl">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input {...register("title")} required type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <textarea {...register("description")} required className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Author</legend>
            <input {...register("author")} required type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">ISBN</legend>
            <input {...register("isbn")} required type="text" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Copies</legend>
            <input {...register("copies")} required type="number" className="input" placeholder="Type here" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Genre</legend>
            <select {...register("genre")} required className="select">
              <option value="FICTION">Fiction</option>
              <option value="NON_FICTION">Non Fiction</option>
              <option value="SCIENCE">Science</option>
              <option value="HISTORY">History</option>
              <option value="BIOGRAPHY">Biography</option>
              <option value="FANTASY">Fantasy</option>
            </select>
          </fieldset>
          <button className="btn mt-4">Update Book</button>
        </form>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default UpdateBookModal;
