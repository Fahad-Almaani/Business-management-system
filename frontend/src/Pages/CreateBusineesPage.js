import React from 'react'
import {useState,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import AuthContext from "../utils/AuthContext";
// import "../css/login.css"
// import axios from "axios";
const CreateBusineesPage = () => {
  

//   let {loginUser} = useContext(AuthContext);



  return (
    <div className="create-businees">
      <div className="container-login">
      {/* <h1>Business Managment</h1> */}
        <form action="" onSubmit={RegsiterBuseiness}> 
          <label htmlFor="username">Give a Name for youre Business</label>
          <input type="text" name="name" id="" />
          
          <input type="submit" />
        </form>
   
      </div>
      
    </div>
    
  )
}

export default CreateBusineesPage;

