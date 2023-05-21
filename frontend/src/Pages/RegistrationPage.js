import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from "../utils/AuthContext";
import axios from 'axios'
// import "../css/login.css"
// import axios from "axios";
const RegistrationPage = () => {
  const baseURL = "http://127.0.0.1:8000/api/"
  const [ErrMsg, setErrMsg] = useState(null)

  let { loginUser } = useContext(AuthContext);
  // function RegisterUser(e) {
  const RegisterUser = (e) => {
    setErrMsg(null)
    // console.log(e.target.username.value);
    e.preventDefault();
    if (e.target.password.value == e.target.password2.value) {

      axios.post(baseURL + "new-user", {
        username: e.target.username.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        email: e.target.email.value,
        password1: e.target.password.value,
        password2: e.target.password2.value,
      }).then(res => {
        loginUser(e)

      }).catch(err => {
        if (err.response.status === 406) {
          setErrMsg("username already exists")
      
        }
        else if (err.response.status === 400) {
          setErrMsg("make sure all details are in correct format")
       
        }
        else if (err.response.status === 422) {
          setErrMsg("Email is not valid")
       
        }
        else if (err.response.status === 405) {
          setErrMsg("this email already used")
       
        }
      })
    } else {
      setErrMsg("Password are not match")
    }

  }


  return (
    <div className="regPage">
      <div className="container-reg">
        <div className="logo-2" >
          <img src="../static/images/logo.png" alt="logo" />
        </div>
        <form action="" onSubmit={RegisterUser}>
          <ul className="reg-form">
            <li><label htmlFor="username">Username :</label></li>
            <input type="text" name="username" id="" placeholder="username" required />
            <li>
              <label htmlFor="first_name" >First name:</label>
              <input type="text" name="first_name" id="" placeholder="First name" pattern="[A-Za-z_-]+" />
            </li>
            <li>
              <label htmlFor="last_name">last name</label>
              <input type="text" name="last_name" id="" placeholder="last name" pattern="[A-Za-z_-]+" />
            </li>
            <input type="text" name="email" id="" placeholder="email" required />
            <li>
              <input type="password" name="password" id="" placeholder="password" required />
            </li>
            <li>
              <input type="password" name="password2" id="" placeholder="repeate password" required />
            </li>
            <h2 className="danger">{ErrMsg ? ErrMsg : ""}</h2>
            <input type="submit" />
          </ul>
        </form>
      </div>
    </div>
  )
}

export default RegistrationPage;

