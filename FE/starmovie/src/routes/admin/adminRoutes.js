import {
    Home, 
    Dashboard, 
    MovieManagement, 
    ReviewManagement, 
    CommentManagement,
    GenreManagement 
} from "../../pages" 

const routes  = [
    { path: '/', name: 'Home', element: Home },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/movies', name: 'MovieManagement', element: MovieManagement },
    { path: '/comments', name: 'CommentManagement', element: CommentManagement },
    { path: '/reviews', name: 'ReviewManagement', element: ReviewManagement },
    { path: '/genres', name: 'GenreManagement', element: GenreManagement },
]

export default routes