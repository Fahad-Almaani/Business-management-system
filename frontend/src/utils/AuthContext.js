import {createContext,useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import jwt_decode from "jwt-decode";

const AuthContext = createContext();
export default AuthContext

export function AuthProvider({children}) {
    const navigate = useNavigate()
    const baseURL = "http://127.0.0.1:8000/api/"
    
    let [AuthTokens, setAuthTokens] = useState(()=>
        localStorage.getItem("AuthTokens") 
            ? JSON.parse(localStorage.getItem("AuthTokens"))
            : null
    );
    
    let [User, setUser] = useState({
        user_name: localStorage.getItem("Username") ?localStorage.getItem("Username"): null,
        access_token: localStorage.getItem("access_token") ? localStorage.getItem("access_token"):null
    })


    let loginUser = async (e) =>{
        e.preventDefault();
        
        let response = await fetch("http://127.0.0.1:8000/api/auth/jwt/create/",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: e.target.username.value,
              password: e.target.password.value,
            }),
         });
        
        let data = await response.json()

        if (response.status === 200){
            setAuthTokens(data);
            // setUser(jwt_decode(data.access))
            // localStorage.setItem("accessToken",data.access)
            localStorage.setItem("AuthTokens",JSON.stringify(data))
            
           
            axios.get(baseURL+"auth/users/me/",{
                headers:{
                    'Authorization':`JWT ${data.access}`
                  }
                  }).then(res=>{
                    setUser({"user_name":res.data.username,"access_token":data.access})
                    
                    localStorage.setItem("Username",res.data.username)
                    localStorage.setItem("access_token",data.access)
                    // navigate('/');

                     // get user type form API if the user is manager or employee
                    axios.get(baseURL+"user-type",{
                        headers:{
                            'Authorization':`JWT ${data.access}`
                          }
                    })
                        .then(res=>{
                            localStorage.setItem("Admin",true)
                            navigate('/dashboard')
                        }).catch(err=>{
                            if(err.response.status == 400){
                                navigate('/income-entry')
                            }
                        })
                  }).catch(err=>{
                    console.log(err);
                  })
            
        
            
        }else{
            alert("Wrong user name or password")

        }
    }

    let logoutUser = () =>{
        setAuthTokens(null);
        setUser(null);
        localStorage.clear()
        
        navigate('/login/')
    }
  
    let updateToken = async () =>{
        console.log(AuthTokens)
        let response = await fetch("http://127.0.0.1:8000/api/auth/jwt/refresh",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },            
              body: JSON.stringify({ refresh: AuthTokens.refresh }),
        });

        let data = await response.json();
        if(response.status === 200){
            
            setAuthTokens({access:data.access,refresh:AuthTokens.refresh});
            setUser(jwt_decode(data.access))
            localStorage.setItem("access_token",data.access)
            
            localStorage.setItem("AuthTokens",JSON.stringify(data))
        }else{
            logoutUser();
        }
    }
  
    let ThemeMode = ()=>{
      
        const themeToggler = document.querySelector(".theme-toggler")
        document.body.classList.toggle('dark-theme-variables')
        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
      }

   
    let SideMenu = ()=>{
    
    const sideMenu = document.querySelector("aside");
    const menuBtn = document.querySelector("#menu-btn");
    const closeBtn = document.querySelector("#close-btn");
    if (sideMenu.style.display == 'block'){sideMenu.style.display = 'none'}else{sideMenu.style.display = 'block';}
    }


    let contextData= {
        User: User,
        loginUser: loginUser,
        logoutUser: logoutUser,
        ThemeMode:ThemeMode,
        SideMenu:SideMenu,
        baseURL:baseURL,
      
        }
    

    useEffect(()=>{
        let fourMin = 1000 * 60 * 20; // 20 minutes in milliseconed
        let interval = setInterval(()=>{
            if (AuthTokens){
                updateToken()
                }
            },fourMin);
            return () => clearInterval(interval)        
        },[AuthTokens])
    
    





    return(
        <AuthContext.Provider value={contextData}>
        {children}
        </AuthContext.Provider>
    )
}
