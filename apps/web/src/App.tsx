import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import CarDetailPage from './pages/CarDetailPage'
import ComparePage from './pages/ComparePage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import QuizPage from './pages/QuizPage'
import ShortlistResultsPage from './pages/ShortlistResultsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="cars/:slug" element={<CarDetailPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="quiz/results" element={<ShortlistResultsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
