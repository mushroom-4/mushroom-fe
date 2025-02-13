import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionItemDetail from './pages/AuctionItemDetil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auction/:auctionItemId" element={<AuctionItemDetail />} />
        <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App
