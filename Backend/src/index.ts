import express from "express";
import cors from "cors";
import { getAllBooks, getBookById, addBook, updateBookReadStatus, updateBookReview, deleteBook } from "./readwritebooks";
import { Book } from "./types";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

// Hämta alla böcker
app.get('/books', async (req, res) => {
    const books = await getAllBooks();
    res.json(books);
});

// Hämta en bok baserat på ID
app.get('/books/:id', async (req, res) => {
    const book = await getBookById(req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Lägg till en ny bok
app.post('/books', async (req, res) => {
    const { title, writer, read }: Book = req.body;
    const message = await addBook({ title, writer, read });
    res.json({ message });
});

// Uppdatera läst-status
app.patch('/books/:id/read', async (req, res) => {
    const { read } = req.body;
    const message = await updateBookReadStatus(req.params.id, read);
    res.json({ message });
});

// Uppdatera recension
app.patch('/books/:id/review', async (req, res) => {
    const { review } = req.body;
    const message = await updateBookReview(req.params.id, review);
    res.json({ message });
});

// Ta bort en bok
app.delete('/books/:id', async (req, res) => {
    const message = await deleteBook(req.params.id);
    res.json({ message });
});

app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
