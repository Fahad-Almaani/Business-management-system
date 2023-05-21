import axios from 'axios';
import React, { useEffect } from 'react'
import {useState,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import AuthContext from "../utils/AuthContext";
import { NavBar,SmsPage } from './MainComponents';
export default function AdminSmsPage() {
    let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);

    const [Messages, setMessages] = useState()

    function getSMS(){
        axios.get(baseURL+"message",{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            }
        }).then(res=>{
            setMessages(res.data)
            console.log(res.data)
        })
    }


    function SendSMS(e){
        e.preventDefault();
        axios.post(baseURL+"message",{
            reciver:e.target.to.value,
            content:e.target.content.value
        },
        {
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            }
        }).then(res=>{
            e.target.to.value = null
            e.target.content.value = null
        }).catch(err=>{
            alert("no account with this username")
        })
    }


    useEffect(() => {
        getSMS()
    }, [])
    

  return (
    <div className="container">
    <NavBar/>
    {/* <!----------------------END of ASIDE ----------------------> */}
    <main>
       <div className="income-msg-container">
        <div className='messages'>
               {Messages?.map((sms,id)=>(
                <div className='message' key={id}>
                <h3>{sms.sender}</h3>
                <p>{sms.content}</p>
                <p className='sms-date-time'>{new Date(sms.time_created).toLocaleString()}</p>
                {sms.read_status == false ? <h5>New</h5> :<small >Opend</small>}
            </div>  
               ))}        
        </div>

       </div>
       
    </main>
    {/* <!-- --------------------END of main----------------- --> */}

    <div className="right">
        <div className="top">
            <button id="menu-btn">
                <span className="material-symbols-sharp" onClick={SideMenu}>menu</span>
            </button>
            <a href="#"><span className="material-symbols-sharp">sms</span>
                
            </a>
            <div className="theme-toggler">
                <span className="material-symbols-sharp active" onClick={ThemeMode}>light_mode</span>
                <span className="material-symbols-sharp" onClick={ThemeMode}>dark_mode</span>
            </div>
            <div className="profile">
                <div className="info">
                    <p>Hey, <b>{User.user_name}</b></p>
                    {/* <small className="text-muted">Admin</small> */}
                </div>
                <div className="profile-photo">
                    <img src="../static/images/profile.jpg" alt="profile-img"/>
                </div>
            </div>
            
        </div>

        {/* <!-- end of top --> */}
     
            <div className='form-div' onSubmit={SendSMS}>
                <form action="">
                    <label htmlFor="to">To</label>
                   
                    <br />
                    <input type="text" name='to'/>
                    <br />
                    <label htmlFor="message">Message</label>
                    <br />
                    <textarea name="content" id="" cols="30" rows="10"></textarea>
                    <br />
                    <input type="submit" value="Send" className='send-sms'/>
                </form>
            </div>
          
    {/* <!-- ENd of recent updates --> */}

    
        
        
       
            
        </div>
    </div>
  )
}

