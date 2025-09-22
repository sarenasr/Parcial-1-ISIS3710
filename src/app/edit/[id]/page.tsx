'use client';
import { useParams } from 'next/navigation';
import AuthorForm from "@/components/AuthorForm";

export default function EditAuthor() {
  const params = useParams();
  const authorId = Number(params.id);

  return <AuthorForm authorId={authorId} />;
}