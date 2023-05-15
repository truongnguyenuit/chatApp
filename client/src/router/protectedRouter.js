// import React from 'react';
// import { Navigate } from 'react-router-dom'
const ProtectedRoute = ({  children }) => {

  // if (authLoading) {
  //   return (
  //     <div>
  //       loading...99%
  //     </div>
  //   )
  // }

  // if (protect && !isAuthenticated) {
  //   alert("Bạn cần đăng nhập để vào trang này")
  //   return <Navigate to="/login" replace />
  // }
  // if (admin && user.role === "user") {
  //   alert("trang này chỉ dành cho admin, bạn không có quyền truy cập")
  //   return <Navigate to="/" replace/>
  // }

  return children;
}

export default ProtectedRoute