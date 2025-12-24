import { BlogPost } from '../../../features/pages/BlogPost';

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <BlogPost postId={Number.isFinite(id) ? id : 1} />;
}
