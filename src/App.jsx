import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionItemDetail from './pages/AuctionItemDetail';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="auction/:auctionItemId" element={<AuctionItemDetail />} />
            <Route path="mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App
