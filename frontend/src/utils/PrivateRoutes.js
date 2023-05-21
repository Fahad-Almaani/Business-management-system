import React,{useState} from 'react'
import {Outlet,Navigate} from 'react-router-dom'

export default function PrivateRoutes() {

  let user = localStorage.getItem('AuthTokens')
  
  return (
    user ? <Outlet/> : <Navigate to="/"/>
  )
}
