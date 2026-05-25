import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../app/App.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';
import { ChatLayout } from '../components/layout/ChatLayout.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../features/auth/pages/RegisterPage.jsx';
import { ChatPage } from '../features/chat/pages/ChatPage.jsx';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/chat" replace />,
      },
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <ChatLayout />,
            children: [{ path: '/chat', element: <ChatPage /> }],
          },
        ],
      },
    ],
  },
]);
