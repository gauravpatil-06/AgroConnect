import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useSelector } from "react-redux"
import Loader from "./Loader"

const Layout = () => {
  const { loading: authLoading, isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()

  if (authLoading) {
    return <Loader />
  }

  // Paths where footer is always hidden
  const alwaysHideFooter = ["/farmer", "/admin", "/messages", "/profile", "/orders", "/checkout", "/consumer"]
  
  // Paths where footer is hidden ONLY if logged in (Products, Farmers, etc.)
  const hideIfLoggedIn = ["/products", "/farmers"]

  const shouldHideFooter =
    alwaysHideFooter.some((path) => location.pathname.startsWith(path)) ||
    (isAuthenticated && hideIfLoggedIn.some((path) => location.pathname.startsWith(path)))

  const shouldHideNavbar = location.pathname === "/admin/selection";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow dark:text-gray-100">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default Layout
