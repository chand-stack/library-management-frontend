import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const libraryApi = createApi({
    reducerPath:"libraryApi",
    baseQuery: fetchBaseQuery({baseUrl:"http://localhost:5000/api"}),
    tagTypes:["books","borrows"],
    endpoints:(builder)=>({
        getBooks:builder.query({
            query:()=>"/books",
            providesTags:["books"]
        }),
        createBook:builder.mutation({
            query:(bookData)=>({
                url:"/create-book",
                method:"POST",
                body:bookData
            }),
            invalidatesTags:["books"]
        }),
        getBookById:builder.query({
            query:(id:string)=>({
                url:`/books/${id}`,
                method:"Get"
            }),
            providesTags:["books"]
        }),
        deleteBook: builder.mutation({
            query:(id: string)=>({
                url:`/books/${id}`,
                method:"Delete",
            }),
            invalidatesTags: ["books"]
        }),
        BorrowBook:builder.mutation({
            query:(borrowData)=>({
                url:"/borrow",
                method:"POST",
                body:borrowData
            }),
            invalidatesTags:["borrows"]
        }),
        getBorrow:builder.query({
            query:()=>"/borrow",
            providesTags:["borrows"]
        })
    })
})

export const {useGetBooksQuery, useCreateBookMutation,useDeleteBookMutation, useGetBookByIdQuery, useBorrowBookMutation, useGetBorrowQuery} = libraryApi