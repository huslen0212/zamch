import { BlogPost } from '../../../features/pages/BlogPost';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return <BlogPost postId={Number.isFinite(id) ? id : 1} />;
}
