import { CategoryPage } from '../../../features/pages/CategoryPage';

const slugToCategory: Record<string, string> = {
  dalai: 'Далай',
  uul: 'Уул',
  soyl: 'Соёл',
  hot: 'Хот',
  adal: 'Адал явдал',
  baigal: 'Байгаль',
};

export default function Page({ params }: { params: { slug: string } }) {
  const category = slugToCategory[params.slug] || 'Далай';
  return <CategoryPage category={category} />;
}
