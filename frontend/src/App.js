import React from 'react'
import PrivateRoutes from './utils/PrivateRoutes'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import HomePage from "./Pages/HomePage"
import RegistrationPage from "./Pages/RegistrationPage"
import CreateBusineesPage from "./Pages/CreateBusineesPage"
import EmpDash from './Pages/EmpDash'
import Branches from './Pages/Branches'
import EmployeesPage from './Pages/EmployeesPage'
import Messages from './Pages/Messages'
import AdminSmsPage from './Pages/AdminSmsPage'


import {AuthProvider} from "./utils/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div className="container-div">
    <Router>
      
    <AuthProvider>

        <Routes>
          <Route element={<HomePage />} path="/" exact />  
          <Route element={<Login />} path="/login" exact />  
          <Route element={<RegistrationPage />} path="/signup" exact />  
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/dashboard" exact />  
            <Route element={<CreateBusineesPage />} path="/new-business" exact />  
            <Route element={<Branches />} path="/branches" exact />
            <Route element={<EmpDash />} path="/income-entry" exact />
            <Route element={<EmployeesPage />} path="/employees" exact />
            <Route element={<Messages />} path="/sms" exact />
            <Route element={<AdminSmsPage />} path="/sms-manager" exact />
          </Route>
        </Routes>
      
    </AuthProvider>
      
    </Router>
  </div>
  )
}
