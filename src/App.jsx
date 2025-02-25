import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/main/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionItemDetail from './pages/main/AuctionItemDetail';
import Layout from './components/Layout';
import AuctionRegistrationList from './pages/item_manage/AuctionRegistrationList';
import AuctionItemEdit from './pages/item_manage/AuctionItemEdit';
import AuctionItemCreate from './pages/item_manage/AuctionItemCreate';
import BidHistory from './pages/bid_history/BidHistory';
import BidDetail from './pages/bid_history/BidDetail';
import PaymentSuccess from "./pages/bid_history/PaymentSuccess";
import PaymentFail from "./pages/bid_history/PaymentFail";
import Wishlist from './pages/bid_history/Wishlist';
import Notices from './pages/bid_history/Notices';
import Admin from './pages/auth/Admin';
import AuctionBid from './pages/main/AuctionBid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
            <Route path="auction/:auctionItemId" element={<AuctionItemDetail />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path="registrations" element={<ProtectedRoute><AuctionRegistrationList /></ProtectedRoute>} />
            <Route path="auction/:auctionItemId/bid" element={<ProtectedRoute><AuctionBid /></ProtectedRoute>} />
            <Route path="auction/:auctionItemId/edit" element={<ProtectedRoute><AuctionItemEdit /></ProtectedRoute>} />
            <Route path="auction/create" element={<ProtectedRoute><AuctionItemCreate /></ProtectedRoute>} />
            <Route path="bids" element={<ProtectedRoute><BidHistory /></ProtectedRoute>} />
            <Route path="bids/:bidId" element={<ProtectedRoute><BidDetail /></ProtectedRoute>} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-fail" element={<PaymentFail />} />
            <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
