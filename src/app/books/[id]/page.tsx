'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Review {
  id: number;
  stars: number;
  description: string;
}

interface Author {
  id: number;
  name: string;
  image: string;
  description: string;
  birthDate: string;
}

interface Editorial {
  id: number;
  name: string;
}

interface Book {
  id: number;
  name: string;
  image: string;
  description: string;
  publishingDate: string;
  isbn: string;
  editorial: Editorial;
  authors?: Author[];
  reviews?: Review[];
}

export default function BookDetail() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      if (!bookId) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Book not found');
          }
          throw new Error('Failed to fetch book details');
        }
        const result = await response.json();
        setBook(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [bookId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return(
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold p-6">Book Details</h1>
      <div className="p-6">
        <Link href="/books">
          <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 mb-4">Back to Books</button>
        </Link>
        
        <div className="flex gap-x-6 py-5">
          <img
            alt=""
            src={book.image}
            className="size-18 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
          />
          <div className="min-w-0 flex-auto">
            <p className="text-lg font-semibold">{book.name}</p>
            <p className="text-sm leading-6 text-gray-900">{book.description}</p>
            <p className="text-sm leading-6 text-gray-500">ISBN: {book.isbn}</p>
            <p className="text-sm leading-6 text-gray-500">Published: {new Date(book.publishingDate).toLocaleDateString()}</p>
            {book.editorial && (
              <p className="text-sm leading-6 text-gray-500">Editorial: {book.editorial.name}</p>
            )}
          </div>
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Reviews</h2>
            <ul>
              {book.reviews.map((review) => (
                <li key={review.id} className="py-3 border-b border-gray-200">
                  <p className="text-sm font-medium">{review.stars}/5 stars</p>
                  <p className="text-sm text-gray-600">{review.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}