export interface BlogPost {
  id: number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzY2MjkzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Далай",
    title: "Диваажин оллоо: Мальдив арлуудыг судлах нь",
    excerpt:
      "Энэхүү халуун орны диваажингийн тунгалаг ус, цэвэр элсэнхэвээндэйгүүдийг нээж мэдээрэй. Оюу шанга нууруудаар болон өнгөлөг шүрэн хадаар аялах аялал.",
    author: "Сарантуяа",
    date: "12-р сар 15, 2024",
    readTime: "5 мин",
    location: { name: "Мальдив", lat: 3.2028, lng: 73.2207 },
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1635351261340-55f437000b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NjYzMzU5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Уул",
    title: "Альпын нарны жаргалт: Швейцарийн адал явдал",
    excerpt:
      "Алтан цагт Швейцарийн Альпын гайхамшигтай үзэсгэлэнг мэдрээрэй. Явган аялалын замаас уулын оргил хүртэл бүх мөч мартагдашгүй.",
    author: "Батбаяр",
    date: "12-р сар 12, 2024",
    readTime: "7 мин",
    location: { name: "Швейцарийн Альп", lat: 46.8182, lng: 8.2275 },
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Соёл",
    title: "Киотогийн сакура цэцэг: Соёлын аялал",
    excerpt:
      "Цэцэглэсэн сакура цэцгээр хүрээлэгдсэн эртний сүмүүдээр алхаарай. Японы соёл, уламжлалд нэвтэрч амьдрал мэдрээрэй.",
    author: "Оюунчимэг",
    date: "12-р сар 10, 2024",
    readTime: "6 мин",
    location: { name: "Киото", lat: 35.0116, lng: 135.7681 },
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NjI1NTI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Хот",
    title: "Романтик Парис: Гэрлийн хотод өнгөрүүлсэн амралт",
    excerpt:
      "Эйфелийн цамхагаас эхлээд дур булаам кофе шопуудаар дамжуулан Парис яагаад дэлхийн хамгийн романтик хот хэвээр байгааг олж мэдээрэй.",
    author: "Болормаа",
    date: "12-р сар 8, 2024",
    readTime: "5 мин",
    location: { name: "Парис", lat: 48.8566, lng: 2.3522 },
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1650911563224-0c843a6d843e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjBkZXNlcnQlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Адал явдал",
    title: "Зэрлэг байгаль руу: Гранд Каньоны экспедиц",
    excerpt:
      "Дэлхийн хамгийн гайхалтай байгалийн гайхамшгуудын нэгээр дамжих адреналин дүүрэн адал явдал. Явган аялал, зуслан, төгсгөлгүй үзэмж.",
    author: "Эрдэнэбат",
    date: "12-р сар 5, 2024",
    readTime: "8 мин",
    location: { name: "Гранд Каньон", lat: 36.1069, lng: -112.1129 },
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGljZWxhbmR8ZW58MXx8fHwxNzY2MjQxMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Байгаль",
    title: "Аврора гэрлийг хөөх нь: Исландын хойд гэрэл",
    excerpt:
      "Исландын гайхалтай байгалийн дунд Хойд гэрлийн ид шидийн бүжгийг гэрчлээрэй. Амьдралдаа нэг удаа тохиолддог туршлага.",
    author: "Номин",
    date: "12-р сар 1, 2024",
    readTime: "6 мин",
    location: { name: "Исланд", lat: 64.9631, lng: -19.0208 },
  },
];