import fs from "fs/promises";
import { Book } from "./types";

const path = './src/books.json';

export async function getAllBooks(): Promise<Book[]> {
    const rawBooks = await fs.readFile(path, 'utf-8');
    return JSON.parse(rawBooks);
}

export async function getBookById(id: string): Promise<Book | undefined> {
    const books = await getAllBooks();
    return books.find(book => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<string> {
    const books = await getAllBooks();
    const newBook = { ...book, id: generateId() };
    books.push(newBook);
    await fs.writeFile(path, JSON.stringify(books, null, 2));
    return `${book.title} added.`;
}

export async function updateBookReadStatus(id: string, read: boolean): Promise<string> {
    const books = await getAllBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books[bookIndex].read = read;
        if (!read) books[bookIndex].review = undefined;
        await fs.writeFile(path, JSON.stringify(books, null, 2));
        return `Book status updated.`;
    }
    return `Book not found.`;
}

export async function updateBookReview(id: string, review: 'liked' | 'disliked'): Promise<string> {
    const books = await getAllBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1 && books[bookIndex].read) {
        books[bookIndex].review = review;
        await fs.writeFile(path, JSON.stringify(books, null, 2));
        return `Review updated.`;
    }
    return `Book not found or not marked as read.`;
}

export async function deleteBook(id: string): Promise<string> {
    const books = await getAllBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    await fs.writeFile(path, JSON.stringify(filteredBooks, null, 2));
    return `Book deleted.`;
}

function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}
