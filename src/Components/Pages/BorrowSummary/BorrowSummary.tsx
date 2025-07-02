import { useGetBorrowQuery } from "../../../Redux/Api/baseApi";
interface IBorrow{
   book: { title: string; isbn: string; };
totalQuantity: number,

}
const BorrowSummary = () => {
    const{data,isLoading}=useGetBorrowQuery(undefined)
    if(isLoading){
        return <p>loading.......</p>
    }

    console.log(data?.data);
    
    return (
        <div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Book Title</th>
        <th>ISBN</th>
        <th>Total Quantity Borrowed</th>
      </tr>
    </thead>
    <tbody>
      {
        data?.data?.map((borrow:IBorrow,index:number)=><tr key={borrow?.book?.title}>
        <th>{index + 1}</th>
        <td>{borrow?.book?.title}</td>
        <td>{borrow?.book?.isbn}</td>
        <td>{borrow?.totalQuantity}</td>
      </tr>)
      }
      
    </tbody>
  </table>
</div>
        </div>
    );
};

export default BorrowSummary;