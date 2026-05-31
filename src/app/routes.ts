import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import QuestPage from "./pages/QuestPage";
import SystemStatusPage from "./pages/SystemStatusPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/dashboard", Component: DashboardPage },
  { path: "/history/:date", Component: HistoryPage },
  { path: "/quest", Component: QuestPage },
  { path: "/system-status", Component: SystemStatusPage },
]);
