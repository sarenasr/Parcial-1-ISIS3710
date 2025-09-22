'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Author{
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch('http://127.0.0.1:8080/api/authors'); // Example API endpoint
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setAuthors(result);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, [])

const handleDelete = async (authorId: number) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this author?');
    
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/authors/${authorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete author');
      }

      // Remove the deleted author from the state
      setAuthors(authors.filter(author => author.id !== authorId));
      
      alert('Author deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Failed to delete author. Please try again.');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return(
    <div className="flex justify-start items-center min-h-screen bg-gray-100">
     <ul>
      {authors.map((author) => (
        <li key={author.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img
              alt=""
              src={author.image}
              className="size-18 flex-none rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
            />
            <div className="min-w-0 flex-auto">
              <p className="text-lg font-semibold">{author.name}</p>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{author.description}</p>
            </div>
            </div>
            <div className ="hidden sm:flex sm:flex-col sm:items-end">
                <Link href={`/edit/${author.id}`}>
                    <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit</button>
                </Link>
            </div>
            <div className ="hidden sm:flex sm:flex-col sm:items-end">
                <button
                onClick = {() => handleDelete(author.id)}
                className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                Delete
                </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
    </div>
  )

}