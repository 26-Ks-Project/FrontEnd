import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/dashboard", Component: DashboardPage },
  { path: "/history/:date", Component: HistoryPage },
]);
