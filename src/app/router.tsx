import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { ChatPage } from "../pages/ChatPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LeadsPage } from "../pages/LeadsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "leads",
        element: <LeadsPage />
      },
      {
        path: "chat",
        element: <ChatPage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);
