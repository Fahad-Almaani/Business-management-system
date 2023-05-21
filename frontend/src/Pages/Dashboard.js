import React,{useContext,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import AuthContext from "../utils/AuthContext";
import BarChart ,{NavBar} from "./MainComponents";
import axios from 'axios'
import jwt_decode from "jwt-decode";
import {Chart as ChartJS} from 'chart.js/auto';



// import "../css/dashboard.css"
export default function Dashboard() {
    let navigate = useNavigate();
//   const baseURL = "http://127.0.0.1:8000/api/"
  // ===================================Get current Month===================================//
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const date = new Date();
  let month = months[date.getMonth()];
  let thisYear = date.getFullYear()


  // ===================================Link with Auth context data===================================//
  let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
  


  const [ProfitsData, setProfitsData] = useState()
    // console.log(ProfitsData)

    let getThisMonthData= ()=>{
        axios.post(baseURL+"month-profits",{
        date:`${thisYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
    },{
        headers:{
            'Authorization':`JWT ${localStorage.getItem("access_token")}`
        }
    }).then(res=>{
        setProfitsData(res.data)
        
    }).catch(err=>{

    })}
    


// get data for the barchart
  function GetBarData(e){
    console.log(e.target.value)
    // e.preventDefault();
    axios.post(baseURL+"month-profits",{
        date:e.target.value,
    },{
        headers:{
            'Authorization':`JWT ${localStorage.getItem("access_token")}`
        }
    }).then(res=>{
        setProfitsData(res.data)
        
    }).catch(err=>{

    })
    console.log(ProfitsData)
    }


// ===================================get Monthly income => var and api===================================//
  const [BSinsight, setBSinsight] = useState(0)
  const [TopOftheMonth,setTopOftheMonth] = useState(0)
  const [RecentProfits, setRecentProfits] = useState("a")
  
// get month profits , year profits , tax
async function getBusinessInsight() {
   
    axios.get(baseURL+'bsuiness-insight',{
        headers:{
            'Authorization':`JWT ${localStorage.getItem("access_token")}`
        }}).then(res=>{
            // console.log(res.data);
            
            setBSinsight(res.data)
            setTopOftheMonth(res.data.top_of_the_month)
            // setRecentProfits()
            console.log(typeof(res.recent_income))
            
        }).catch(err=>{
            console.log(err);
            }
        )
    }


            




  useEffect(() => {
    getBusinessInsight()
    getThisMonthData()
   }, [])

  
  
   


  return (
    
    <div>
    <div className="container">
        <NavBar/>
        {/* <!----------------------END of ASIDE ----------------------> */}
        <main id="dashboard-main">
            <h1>Dashboard</h1>
            <div className="insights">
                <div className="sales">
                    <ul>
                        <li>
                    <span className="material-symbols-sharp">analytics</span>

                        </li>
                        {/* <li>
                    <span className="material-symbols-sharp trend">trending_up</span>

                        </li> */}

                    </ul>
                    
                    <div className="middle">
                        <div className="left"> 
                            <h3>Total Sales</h3>
                            <h1>{BSinsight?BSinsight.pure_month_profit:"0,000"} OMR</h1>
                        </div>
                    
                        <div className="left">
                            {/* <h3>{MonthlyProfitsDetails.top_branch.branch}</h3> */}
                            {/* <h1>{MonthlyProfitsDetails.top_branch.cash ? (MonthlyProfitsDetails.top_branch.visa +MonthlyProfitsDetails.top_branch.cash).toLocaleString() + " OMR": null}</h1> */}
                           
                        </div>
                        
                    </div>
                    <small className="text-muted">Sales in {month}</small>
                </div>
            
            
                <div className="expenses">
                    <span className="material-symbols-sharp">bar_chart</span>
                    <div className="middle">
                        <div className="left">
                            <h3>This Year Sales</h3>
                            <h1>{BSinsight?BSinsight.pure_year_profit:"0,000"} OMR</h1>
                            <h3 className="text-muted">{thisYear}</h3>
                        </div>
                    
                       
                    </div>
                    <small className="text-muted">This Year</small>
                </div>
                {/* <!----------------------END of Sales ----------------------> */}
                <div className="income">
                    <span className="material-symbols-sharp">stacked_line_chart</span>
                    <div className="middle">
                        <div className="left">
                            <h3>Branch of the Month</h3>
                            <h1>{TopOftheMonth ?TopOftheMonth.amount+" OMR" : "No profits in "+ month}</h1>
                            <h2 className='text-muted'>{TopOftheMonth? TopOftheMonth.name : ""}</h2>
                        </div>
                    
                       
                    </div>
                    {/* <small className="text-muted">This Year</small> */}
                </div>
                {/* <!----------------------END of income ----------------------> */}
            </div>   
        
            {/* <!----------------------END of insigt ----------------------> */}
            
            <div className="recent-income">
                <h2>Profits</h2>
                <div className='bar-cahrt-container'>

                <div className="date">
                <input type="month" onChange={GetBarData} defaultValue={`${thisYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}`}/>
                </div>
                
                {/* {console.log(ProfitsData)+"))))))))))))))))"} */}
                {ProfitsData? <BarChart charData={ProfitsData}/>: (<div> <br /><h3>No Revenues</h3></div>)}
            </div>
                </div>
        </main>
        {/* <!-- --------------------END of dashboard main----------------- --> */}

        <div className="right">
            <div className="top">
                <button id="menu-btn">
                    <span className="material-symbols-sharp" onClick={SideMenu}>menu</span>
                </button>
                <div className="theme-toggler">
                    <span className="material-symbols-sharp" onClick={ThemeMode}>light_mode</span>
                    <span className="material-symbols-sharp active" onClick={ThemeMode}>dark_mode</span>
                </div>
                <div className="profile">
                    <div className="info">
                        <p>Hey, <b>{User.user_name}</b></p>
                        <small className="text-muted">Manager</small>
                    </div>
                    <div className="profile-photo">
                        <img src="../static/images/profile.jpg" alt="profile-img"/>
                    </div>
                </div>
            </div>

            {/* <!-- end of top --> */}
           
        
        {/* <!-- ENd of recent updates --> */}

        <div className="sales-analytics">
            <h2>Profits Taxation</h2>
                <div className="item online">
                    <div className="icon">
                        <span className="material-symbols-sharp">payments</span>
                    </div>
                    <div className="right">
                        <div className="info">
                            <h3>Before Tax</h3>
                            <small className="text-muted">In {month}</small>
                        </div>
                        <h3>{BSinsight.total_of_month} OMR</h3>
                        <h5 className="danger">{BSinsight.tax_pct}%</h5>
                    </div>
                </div>
                <div className="item offline">
                    <div className="icon">
                        <span className="material-symbols-sharp">credit_card</span>
                    </div>
                    <div className="right">
                        <div className="info">
                            <h3>tax paid</h3>
                            <small className="text-muted">In {month}</small>
                        </div>
                        <h3>{BSinsight.total_of_month_tax} OMR</h3>
                        <h5 className="danger"></h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    </div>
  );
}



