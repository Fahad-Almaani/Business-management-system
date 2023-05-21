import React, { useState,useEffect,useContext } from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import AuthContext from "../utils/AuthContext";
import axios from 'axios'

export default function BarChart({charData}){
    console.log(charData)
    let [Data , setData] = useState()
    useEffect(() => {
        setData(
            {
                labels: Object.keys(charData).map((data)=> charData[data].date_enterd),
                datasets:[{
                  label: "Profit",
                  data: Object.keys(charData).map((data)=> charData[data].amount),
                  backgroundColor:["rgba(65, 241, 182, 0.5)"],
                  borderColor : "balck",
                  borderWidth: 2,
                },
                // {
                //   label:"Expence",
                //   data: Object.keys(charData).map((data)=> charData[data].amount),
                //   backgroundColor:["#ff7782"],
                //   borderColor : "balck",
                //   borderWidth:2,
                // }
                ],
              }
        )
      
    }, [charData])
    
    // options={{ maintainAspectRatio:false}}

  return Data? <Bar data={Data}  options={{maintainAspectRatio:false,responsive:true}}/>:"Data no found"
    
  
}


export function NavBar(){
  let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
  return(
      <aside>
            <div className="top">
                <div className='logo'>
                    <img className="logo" src="../static/images/logo.png" alt="logo"/>
                    <h2>BMS<span className="danger">ystem</span></h2>
                </div>
                <div className="close" id="close-btn">
                    <span className="material-symbols-sharp" onClick={SideMenu}>close</span>
                </div>
            </div>
            <div className="sidebar">
                <a href="/dashboard"><span className="material-symbols-sharp">grid_view</span>
                    <h2>Dashboard</h2>
                </a>
                <a href="/branches" ><span className="material-symbols-sharp">store</span>
                    <h2>Branches</h2>
                </a>
                <a href="/employees"><span className="material-symbols-sharp">badge</span>
                    <h2>Employees</h2>
                </a>
                <a href="/sms-manager"><span className="material-symbols-sharp">sms</span>
                    <h2>Messages</h2>
                </a>
                <a href="/settings"><span className="material-symbols-sharp">settings</span>
                    <h2>Settings</h2>
                </a>
                <a href="" onClick={logoutUser}><span className="material-symbols-sharp">logout</span>
                    <h2>Logout</h2>
                </a>
            </div>
        </aside>
        )
}

export function NavBar2(){
    let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
    return(
        <aside>
        <div className="top">
            <div className='logo'>
            
                <h2>BM<span className="danger">System</span></h2>
            </div>
            <div className="close" id="close-btn">
                <span className="material-symbols-sharp" onClick={SideMenu}>close</span>
            </div>
        </div>
        <div className="sidebar">
            <a href="/income-entry/"><span className="material-symbols-sharp">border_color</span>
                <h2>Income</h2>
            </a>
            <a href="/sms/"><span className="material-symbols-sharp">sms</span>
                <h2>Messages</h2>
            </a>
            <a href="#"><span className="material-symbols-sharp">settings</span>
                <h2>Settings</h2>
            </a>
            <a href="" onClick={logoutUser}><span className="material-symbols-sharp">logout</span>
                <h2>Logout</h2>
            </a>
        </div>
    </aside>
    )
}


