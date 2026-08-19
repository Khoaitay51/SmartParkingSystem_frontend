import { createBrowserRouter, Navigate } from "react-router";
import { AppProvider } from "../context/AppContext";
import DriverLayout from "./DriverLayout";
import OwnerLayout  from "./OwnerLayout";

import SplashPage           from "../pages/SplashPage";
import LoginPage            from "../pages/LoginPage";
import OTPPage              from "../pages/OTPPage";
import RoleSelectPage       from "../pages/RoleSelectPage";

import HomePage             from "../pages/home/HomePage";
import SearchPage           from "../pages/SearchPage";
import ParkingDetailPage    from "../pages/ParkingDetailPage";
import ActiveParkingPage    from "../pages/ActiveParkingPage";
import WalletPage           from "../pages/WalletPage";
import TopupPage            from "../pages/TopupPage";
import HistoryPage          from "../pages/HistoryPage";
import VehiclesPage         from "../pages/VehiclesPage";
import AddVehiclePage       from "../pages/AddVehiclePage";
import ProfilePage          from "../pages/ProfilePage";
import NotificationsPage    from "../pages/NotificationsPage";

import OwnerHomePage        from "../pages/owner/OwnerHomePage";
import OwnerLotsPage        from "../pages/owner/OwnerLotsPage";
import OwnerLotDetailPage   from "../pages/owner/OwnerLotDetailPage";
import OwnerRegisterLotPage from "../pages/owner/OwnerRegisterLotPage";
import OwnerEarningsPage    from "../pages/owner/OwnerEarningsPage";
import OwnerWithdrawPage    from "../pages/owner/OwnerWithdrawPage";
import OwnerGatePage        from "../pages/owner/OwnerGatePage";
import OwnerProfilePage     from "../pages/owner/OwnerProfilePage";

function Root({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="phone-frame">{children}</div>
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root><Navigate to="/splash" replace /></Root>,
  },
  {
    path: "/splash",
    element: <Root><SplashPage /></Root>,
  },
  {
    path: "/login",
    element: <Root><LoginPage /></Root>,
  },
  {
    path: "/otp",
    element: <Root><OTPPage /></Root>,
  },
  {
    path: "/role",
    element: <Root><RoleSelectPage /></Root>,
  },
  {
    path: "/driver",
    element: <Root><DriverLayout /></Root>,
    children: [
      { index: true, element: <Navigate to="/driver/home" replace /> },
      { path: "home",              element: <HomePage /> },
      { path: "search",            element: <SearchPage /> },
      { path: "lot/:id",           element: <ParkingDetailPage /> },
      { path: "parking",           element: <ActiveParkingPage /> },
      { path: "wallet",            element: <WalletPage /> },
      { path: "topup",             element: <TopupPage /> },
      { path: "history",           element: <HistoryPage /> },
      { path: "vehicles",          element: <VehiclesPage /> },
      { path: "vehicles/add",      element: <AddVehiclePage /> },
      { path: "profile",           element: <ProfilePage /> },
      { path: "notifications",     element: <NotificationsPage /> },
    ],
  },
  {
    path: "/owner",
    element: <Root><OwnerLayout /></Root>,
    children: [
      { index: true, element: <Navigate to="/owner/home" replace /> },
      { path: "home",              element: <OwnerHomePage /> },
      { path: "lots",              element: <OwnerLotsPage /> },
      { path: "lots/register",     element: <OwnerRegisterLotPage /> },
      { path: "lots/:id",          element: <OwnerLotDetailPage /> },
      { path: "earnings",          element: <OwnerEarningsPage /> },
      { path: "withdraw",          element: <OwnerWithdrawPage /> },
      { path: "gate",              element: <OwnerGatePage /> },
      { path: "profile",           element: <OwnerProfilePage /> },
    ],
  },
]);
