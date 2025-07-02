import { useForm } from "react-hook-form";
import { useCreateBookMutation } from "../../../Redux/Api/baseApi";

const AddBook = () => {
    const[createBook]=useCreateBookMutation();

    const {register,handleSubmit} = useForm()
  const onSubmit = async (data) => {
    const res = await createBook({...data,copies:Number(data.copies),available:true}).unwrap()
    console.log(res)}
    return (
        <div className="container mx-auto p-5">
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
  <legend className="fieldset-legend">author</legend>
  <input type="text" {...register("author")} required className="input" placeholder="Type here" />
</fieldset>
 <fieldset className="fieldset">
  <legend className="fieldset-legend">Isbn</legend>
  <input type="text" {...register("isbn")} required className="input" placeholder="Type here" />
</fieldset>
 <fieldset className="fieldset">
  <legend className="fieldset-legend">Copies</legend>
  <input type="text" {...register("copies")} required className="input" placeholder="Type here" />
</fieldset>
 <fieldset className="fieldset">
  <legend className="fieldset-legend">Genre</legend>
  <select {...register("genre")} required className="select">
  <option value={"FICTION"}>Fiction</option>
  <option value={"NON_FICTION"}>Non Fiction</option>
  <option value={"SCIENCE"}>Science</option>
  <option value={"HISTORY"}>History</option>
  <option value={"BIOGRAPHY"}>Biography</option>
  <option value={"FANTASY"}>Fantasy</option>
</select>
</fieldset>
<div>

<button className="btn">Add Book</button>
</div>
            </form>
        </div>
    );
};

export default AddBook;