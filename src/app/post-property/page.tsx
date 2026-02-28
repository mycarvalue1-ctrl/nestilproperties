import { Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';
import { PostPropertyFormComponent } from '@/components/post-property-form';

export default function PostPropertyPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin" /></div>}>
      <PostPropertyFormComponent />
    </Suspense>
  )
}
