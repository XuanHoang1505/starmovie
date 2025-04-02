import {
  Home,
  Dashboard,
  MovieManagement,
  EpisodeManagement,
  ReviewManagement,
  CommentManagement,
  GenreManagement,
  CategoryManagement,
  UserManagement,
  ActorManagement,
} from "../../pages";

const routes = [
  { path: "/", name: "Trang chủ", element: Home },
  { path: "/dashboard", name: "Bảng điều khiển", element: Dashboard },
  { path: "/movies/movies", name: "Phim", element: MovieManagement },
  { path: "/movies/episodes", name: "Tập phim", element: EpisodeManagement },
  { path: "/comments", name: "Bình luận", element: CommentManagement },
  { path: "/reviews", name: "Đánh giá", element: ReviewManagement },
  { path: "/genres", name: "Thể loại", element: GenreManagement },
  { path: "/categories", name: "Danh mục", element: CategoryManagement },
  { path: "/users", name: "Người dùng", element: UserManagement },
  { path: "/actors", name: "Diễn viên", element: ActorManagement },
];

export default routes;
