// client/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import AddHabit from './pages/AddHabit.jsx'
import CompareHabits from './pages/CompareHabits.jsx'
import Layout from './components/layout/Layout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      { index: true, element: <Dashboard/> },
      { path: 'addHabit', element: <AddHabit/> },
      { path: 'compare', element: <CompareHabits/> },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)