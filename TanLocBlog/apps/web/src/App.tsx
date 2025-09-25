import { BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ThemeSwitch from "./components/ThemeSwitch/ThemeSwitch";
import PostManagementPage from "./pages/PostManagementPage"
import UserInformationPage from "./pages/UserInformationPage"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import PrivacyPage from "./pages/PrivacyPage"
import { Analytics } from "@vercel/analytics/react"
import PostDetailPage from "./pages/DetailPage"
import BlogPage from "./pages/BlogPage";
import OurStoryPage from "./pages/OurStoryPage";
function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors flex flex-col">
      <ThemeSwitch />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/post-management" element={<PostManagementPage />} />
          <Route path="/user-info" element={<UserInformationPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </div>
  )
}

export default App
