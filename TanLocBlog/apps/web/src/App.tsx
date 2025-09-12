import { BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ThemeSwitch from "./components/ThemeSwitch/ThemeSwitch";
import PostManagementPage from "./pages/PostManagementPage"
// import { Analytics } from "@vercel/analytics/react"
function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors flex flex-col">
      <ThemeSwitch />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/post-management" element={<PostManagementPage />} />
        </Routes>
        {/* <Analytics/> */}
      </BrowserRouter>
    </div>
  )
}

export default App
