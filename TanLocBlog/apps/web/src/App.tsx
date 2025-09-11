import { BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
