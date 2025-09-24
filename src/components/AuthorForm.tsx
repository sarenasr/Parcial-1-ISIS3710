'use client';
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  name: string
  birthDate: string
  description: string
  image: string
  book: string
  prize: string
}

interface AuthorFormProps {
  authorId?: number; // Optional - if provided, it's edit mode
  onSuccess?: () => void; // Callback for successful submission
}

export default function AuthorForm({ authorId, onSuccess }: AuthorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const isEditMode = !!authorId;

  // Fetch author data if editing
  useEffect(() => {
    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId]);

  const fetchAuthorData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/authors/${authorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch author');
      }
      const author = await response.json();
      
      // Populate form with existing data
      setValue('name', author.name);
      setValue('birthDate', author.birthDate);
      setValue('description', author.description);
      setValue('image', author.image);
      setValue('book', author.book || '');
      setValue('prize', author.prize || '');
      
    } catch (error) {
      console.error('Error fetching author:', error);
      alert('Failed to load author data.');
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/authors/${authorId}` 
        : 'http://localhost:8080/api/authors';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} author`);
      }

      const result = await response.json();
      console.log(`Author ${isEditMode ? 'updated' : 'created'} successfully:`, result);
      
      // Reset form after successful submission (only for create)
      if (!isEditMode) {
        reset();
      }
      
      alert(`Author ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} author:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} author. Please try again.`);
    }
  }

  console.log(watch("name"));

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Author' : 'Create New Author'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Name *</label>
          <input 
            {...register("name", { required: "Name is required" })} 
            className="border border-gray-300 p-2 rounded" 
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Date of Birth *</label>
          <input 
            type="date" 
            {...register("birthDate", { required: "Date of birth is required" })} 
            className="border border-gray-300 p-2 rounded"
          />
          {errors.birthDate && <span className="text-red-500 text-sm">{errors.birthDate.message}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description *</label>
          <input 
            {...register("description", { required: "Description is required" })} 
            className="border border-gray-300 p-2 rounded" 
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Image URL *</label>
          <input 
            {...register("image", { required: "Image URL is required" })} 
            className="border border-gray-300 p-2 rounded" 
          />
          {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Book *</label>
          <input 
            {...register("book", { required: "Book is required" })} 
            className="border border-gray-300 p-2 rounded" 
          />
          {errors.book && <span className="text-red-500 text-sm">{errors.book.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Prize *</label>
          <input 
            {...register("prize", { required: "Prize is required" })} 
            className="border border-gray-300 p-2 rounded" 
          />
          {errors.prize && <span className="text-red-500 text-sm">{errors.prize.message}</span>}
        </div>


        <input 
          type="submit" 
          value={isEditMode ? 'Update Author' : 'Create Author'}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
        />
      </form>
    </div>
  )
}