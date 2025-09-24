'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  id: number;
  name: string;
  image: string;
  description: string;
  publishingDate: string;
  isbn: string;
  editorial: {
    id: number;
    name: string;
  };
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:8080/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const result = await response.json();
        setBooks(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold p-6">Books</h1>
      <div className="flex justify-start items-center">
        <ul>
          {books.map((book) => (
            <li key={book.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <img
                  alt=""
                  src={book.image}
                  className="size-18 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-lg font-semibold">{book.name}</p>
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">{book.description}</p>
                    <p className="text-sm leading-6 text-gray-500">{new Date(book.publishingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className ="hidden sm:flex sm:flex-col sm:items-end">
                  <Link href={`/books/${book.id}`}>
                    <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View</button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}