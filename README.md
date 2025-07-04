# 📚 Minimal Library Management System (BookNest)

A fully functional, minimal library management system built with **React**, **TypeScript**, and **Redux Toolkit Query (RTK Query)**. This project is designed as part of an assignment to demonstrate clean UI, proper state management, and interaction with a RESTful API — all without the need for authentication or complex filters.

---

## 🚀 Features

### ✅ Public Routes
- All routes are accessible without authentication.
- Focused purely on book management and borrowing logic.

### 📘 Book Management
- **Book List Table** displays all books with the following columns:
  - `Title`, `Author`, `Genre`, `ISBN`, `Copies`, `Availability`, and `Actions`
- **Actions include**:
  - ✏️ **Edit Book**: Opens a pre-filled form; updates book info via API.
    - If copies are set to `0`, the book is marked **unavailable**.
  - ❌ **Delete Book**: Confirmation modal before deletion.
  - 📥 **Borrow Book**: Opens a borrow form to request a book.

- **Add New Book**:
  - Opens a modal/form with fields: Title, Author, Genre, ISBN, Description, Copies.
  - `Available` is optional and defaults to `true`.
  - After submission, the UI updates and redirects to the main book list.

### 📗 Borrow Book Logic
- Quantity must not exceed available copies.
- If available copies become `0`, the book is marked **unavailable**.
- Successful borrow redirects user to **Borrow Summary** page and shows success message.

### 📊 Borrow Summary
- Shows a list of all borrowed books with aggregated data.
- Columns:
  - `Book Title`, `ISBN`, `Total Quantity Borrowed`
- Retrieved using an aggregation API.

---

## 🧩 Technologies Used

- **React** with **Vite**
- **TypeScript**
- **Redux Toolkit & RTK Query**
- **TailwindCSS**
- **SweetAlert2** for alerts and confirmation dialogs
- **REST API** (backend deployed separately)
- **Vercel** for deployment

---

## 🔗 Live Demo

🌐 [View Live Site](https://book-nest-nu-lake.vercel.app/)  
📡 [API Base URL](https://book-nest-nu-lake.vercel.app/api)

---

## 📁 Project Structure

```
src/
├── Components/ # UI components like BookTable, Modal, Form, etc.
├── Redux/ # Redux slices & API endpoints (books, borrow)
├── Components/Pages/ # Route components: AllBooks, AddBook, BorrowSummary
├── Types/ # TypeScript types and interfaces
├── App.tsx # Route config and layout
├── main.tsx # App root
```

<!-- ---

## 📸 Screenshots

| Book List | Borrow Summary |
|-----------|----------------|
| ![Book List](https://your-screenshot-url.com) | ![Borrow Summary](https://your-screenshot-url.com) |

--- -->

## 📦 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/chand-stack/library-management-frontend.git
cd library-management-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev

✅ Completed Tasks (Assignment Scope)
 View books in a table with actions

 Add, update, delete books

 Borrow books with validation

 Mark availability based on copies

 Borrow summary with aggregated data

 All logic handled with RTK Query & proper state management

📚 Assignment Info
Project Goal: Build a minimal library system with clean UX and API integration
Key Focus: CRUD, borrow logic, UI updates, and API handling
Exclusions: No login/auth, filters, or payment

📌 Credits
Developed by [Chand Rahman]