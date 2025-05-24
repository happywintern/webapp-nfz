// Role-based route access control
const adminRoutes = ['Dashboard', 'Kasir', 'Penjualan', 'Stock', 'Supplier', 'Staff', 'SelectAddress', 'ViewProduct'];
const cashierRoutes = ['Kasir', 'SelectAddress'];

export function checkRouteAccess(to, from, next) {
  const userRole = localStorage.getItem('role')?.toLowerCase();
  const isAuthenticated = !!localStorage.getItem('token');

  // Allow access to Login and ForgotPassword without authentication
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'ForgotPassword') {
    return next({ name: 'Login' });
  }

  // Redirect authenticated users away from login page
  if (isAuthenticated && to.name === 'Login') {
    return next({ name: userRole === 'cashier' ? 'Kasir' : 'Dashboard' });
  }

  if (isAuthenticated) {
    // Admin can access admin routes
    if (userRole === 'admin') {
      if (adminRoutes.includes(to.name)) {
        next();
      } else {
        next({ name: 'Dashboard' });
      }
    } 
    // Cashier can only access cashier routes
    else if (userRole === 'cashier') {
      if (cashierRoutes.includes(to.name)) {
        next();
      } else {
        next({ name: 'Kasir' });
      }
    } 
    // Unknown role
    else {
      localStorage.clear(); // Clear invalid session
      next({ name: 'Login' });
    }
  } else {
    next();
  }
} 