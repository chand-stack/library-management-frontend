import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const libraryApi = createApi({
    reducerPath:"libraryApi",
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:5000/api"}),
    tagTypes:["books","borrows"],
    endpoints:(builder)=>({
        getBooks:builder.query({
            query:()=>"/books",
            providesTags:["books"]
        })
    })
})

export const {useGetBooksQuery} = libraryApi