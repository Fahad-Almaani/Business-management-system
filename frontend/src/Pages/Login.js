import React from 'react'
import {useState,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import AuthContext from "../utils/AuthContext";
// import "../css/login.css"
// import axios from "axios";
const LoginPage = () => {
  

  let {loginUser} = useContext(AuthContext);

  

  return (
    <div className="loginPage">
      <div className="container-login">
      <div className="logo-2" >
                    <img src="../static/images/logo.png" alt="logo"/>
                </div>
      {/* <h1>Business Managment</h1> */}
        <form action="" onSubmit={loginUser}> 
          <label htmlFor="username">Username :</label>
          <input type="text" name="username" id="" />
          <label htmlFor="password">Password :</label>
          <input type="password" name="password" id="" />
          <a href="#">forgot password</a>
          <input type="submit" />
        </form>
      <p>Income Managment System</p>
      </div>
    </div>
    
  )
}

export default LoginPage;

