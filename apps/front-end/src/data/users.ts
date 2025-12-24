export interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  postsCount: number;
  totalLikes: number;
  followers: number;
  countriesVisited: number;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  joinDate: string;
  rating: number;
}

export const leaderboardUsers: LeaderboardUser[] = [
  {
    id: 1,
    name: "Сарантуяа",
    avatar: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 45,
    totalLikes: 12450,
    followers: 5430,
    countriesVisited: 32,
    location: { name: "Улаанбаатар", lat: 47.8864, lng: 106.9057 },
    joinDate: "2023-01-15",
    rating: 98.5,
  },
  {
    id: 2,
    name: "Батбаяр",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 38,
    totalLikes: 10200,
    followers: 4820,
    countriesVisited: 28,
    location: { name: "Сеул", lat: 37.5665, lng: 126.9780 },
    joinDate: "2023-02-20",
    rating: 96.8,
  },
  {
    id: 3,
    name: "Оюунчимэг",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 42,
    totalLikes: 9850,
    followers: 4520,
    countriesVisited: 25,
    location: { name: "Токио", lat: 35.6762, lng: 139.6503 },
    joinDate: "2023-03-10",
    rating: 95.2,
  },
  {
    id: 4,
    name: "Болормаа",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 35,
    totalLikes: 8920,
    followers: 3850,
    countriesVisited: 22,
    location: { name: "Парис", lat: 48.8566, lng: 2.3522 },
    joinDate: "2023-04-05",
    rating: 93.7,
  },
  {
    id: 5,
    name: "Эрдэнэбат",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 30,
    totalLikes: 7650,
    followers: 3420,
    countriesVisited: 20,
    location: { name: "Дубай", lat: 25.2048, lng: 55.2708 },
    joinDate: "2023-05-12",
    rating: 91.5,
  },
  {
    id: 6,
    name: "Номин",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 28,
    totalLikes: 6890,
    followers: 3150,
    countriesVisited: 18,
    location: { name: "Лондон", lat: 51.5074, lng: -0.1278 },
    joinDate: "2023-06-18",
    rating: 89.3,
  },
  {
    id: 7,
    name: "Ганзориг",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 25,
    totalLikes: 6120,
    followers: 2840,
    countriesVisited: 16,
    location: { name: "Сингапур", lat: 1.3521, lng: 103.8198 },
    joinDate: "2023-07-22",
    rating: 87.8,
  },
  {
    id: 8,
    name: "Цэцэгмаа",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    postsCount: 22,
    totalLikes: 5340,
    followers: 2520,
    countriesVisited: 14,
    location: { name: "Нью-Йорк", lat: 40.7128, lng: -74.0060 },
    joinDate: "2023-08-30",
    rating: 85.2,
  },
];
