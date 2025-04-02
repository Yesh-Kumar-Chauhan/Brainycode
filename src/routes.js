// import React from 'react'
import React, {Fragment} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './component/auth/Signin';
import Generate from './component/code/Generate';
import RequestSubmitted from './component/code/RequestSubmitted';
import ReviewRequest from './component/code/ReviewRequest';
import Thread from './component/code/Thread';
// import PurchaseCredits from './pages/credits/PurchaseCredits';
import CustomBoard from './pages/customboard/CustomBoard';
import CustomBoardOrder from './pages/customboard/CustomBoardOrder';
import SignupPage from './pages/auth/signup/SignupPage';
import OrderConfirm from './pages/credits/OrderConfirm';
import BuyCreditPage from './pages/credits/BuyCredit';
import ForgotPasswordPage from './pages/auth/forgotPassword/forgotPasswordPage';
import VerificationCodePage from './pages/auth/forgotPassword/verificationCodePage';
import ResetPasswordPage from './pages/auth/forgotPassword/resetPasswordPage';
import SuccessPage from './pages/auth/forgotPassword/successPage';
import ProfilePage from './pages/profile/Profile';
import ProtectedRoute from './ProtectedRoute';
const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute Component={Home} allowWithoutAuth/>} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="code" element={<ProtectedRoute Component={Generate} />} />
            <Route path="review" element={<ProtectedRoute Component={ReviewRequest} />} />
            <Route path="success" element={<ProtectedRoute Component={RequestSubmitted} /> }/>
            <Route path="thread" element={<ProtectedRoute Component={Thread} />} />
            <Route path="custom-board/:id" element={<ProtectedRoute Component={CustomBoard} />} />
            <Route path="custom-board-order" element={<ProtectedRoute Component={CustomBoardOrder} />} />
            <Route path="verification-code" element={<ProtectedRoute Component={VerificationCodePage} allowWithoutAuth/>} />
            <Route path="order-confirm" element={<ProtectedRoute Component={OrderConfirm} />} />
            <Route path="buy-credit" element={<ProtectedRoute Component={BuyCreditPage} />} />
            <Route path="forgot-password" element={<ProtectedRoute Component={ForgotPasswordPage} allowWithoutAuth />} />
            <Route path="reset-password" element={<ProtectedRoute Component={ResetPasswordPage} allowWithoutAuth/>} />
            <Route path="success-password" element={<ProtectedRoute Component={SuccessPage} allowWithoutAuth/>} />
            <Route path="profile" element={<ProtectedRoute Component={ProfilePage} />} />
        </Routes>

    )
}
  
export default Routing;