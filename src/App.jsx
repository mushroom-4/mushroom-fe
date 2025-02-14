import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionItemDetail from './pages/AuctionItemDetail';
import Layout from './components/Layout';
import AuctionRegistrationList from './pages/AuctionRegistrationList';
import AuctionItemEdit from './pages/AuctionItemEdit';
import AuctionItemCreate from './pages/AuctionItemCreate';
import BidHistory from './pages/BidHistory';
import BidDetail from './pages/BidDetail';

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
            <Route path="registrations" element={<ProtectedRoute><AuctionRegistrationList /></ProtectedRoute>} />
            <Route path="auction/:auctionItemId/edit" element={<ProtectedRoute><AuctionItemEdit /></ProtectedRoute>} />
            <Route path="auction/create" element={<ProtectedRoute><AuctionItemCreate /></ProtectedRoute>} />
            <Route path="bids" element={<ProtectedRoute><BidHistory /></ProtectedRoute>} />
            <Route path="bids/:bidId" element={<ProtectedRoute><BidDetail /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
