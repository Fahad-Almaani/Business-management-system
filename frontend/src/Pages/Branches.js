import React,{useContext,useState,useEffect} from 'react'
import AuthContext from "../utils/AuthContext";
import axios from 'axios'
import {NavBar} from "./MainComponents";
export default function Branches() {
    let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
  

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const date = new Date();
    let month = months[date.getMonth()];
    let lastMonth = months[date.getMonth() -1]
    let thisYear = date.getFullYear()

  

    const [MonthlyIncomeDetails, setMonthlyIncomeDetails] = useState({
        total:0,
        cash:0,
        visa:0,
        top_branch:"",
        
    })
    const [BranchesList, setBranchesList] = useState({
        "":""
    })


    function GetBranches(){
        axios.get(baseURL+'branch',{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            }}).then(res=>{
                // console.log(res.data);
                
                setBranchesList(
                    res.data
                )
            }).catch(err=>{
                if (err.response.status == 401){
                   
                }else{
                
                console.log(err);
                }
            })
    }

    useEffect(() => {
        GetBranches()

    }, [])
    function NewForm(){
        console.log("clikced")
        const form = document.querySelector(".new-employee-form")
        if (form.style.display == 'block'){form.style.display = 'none'}else{form.style.display = 'block';}
    }

    function RegisterNewBranch(e){
        e.preventDefault();
        axios.post(baseURL+"branch",{
        name:e.target.name.value,
        place:e.target.place.value,
        },{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            } 
          }).then(res=>{
            window.location.reload(false);
    }).catch(err=>{
            alert("a branch with this name dose exists")
    })
    } 


    function DownloadReport(branch){
        axios.get(baseURL+`report/${branch}`,{
            
            responseType: 'blob',
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            } 
        }).then(res=>{
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url
                link.setAttribute('download',"report.pdf")
                document.body.appendChild(link)
                link.click()
        }).catch(err=>{
            alert("sorry report generater faild to generate the report")
        })
    }


    return (
    <div>
        <div>
        <div className="container">
        <NavBar/>
            {/* <!----------------------END of ASIDE ----------------------> */}
            <main>
                <h1>Branches</h1>
            
                {/* <!----------------------END of insigt ----------------------> */}
                
                <div className="recent-income">
                    {/* <h2>Recent Income</h2> */}
                    <table>
                        <thead>
                            <tr>
                                <th>Branch</th>
                                <th>{month} Profits</th>
                                <th>{month} Expences</th>
                                <th>{lastMonth} Profits</th>
                                <th>{thisYear} <br/> Profits</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                       
                        {Object.keys(BranchesList)?.map((branch)=>(
                            <tr>
                                <td>{BranchesList[branch].name}</td>
                                <td>{(BranchesList[branch].pure_profits)?.toLocaleString()} OMR</td>
                                <td className='danger'>{(BranchesList[branch].month_expences)?.toLocaleString()} OMR</td>
                                <td>{(BranchesList[branch].last_month_profits)?.toLocaleString()} OMR</td>
                                <td>{(BranchesList[branch].year_profits)?.toLocaleString()} OMR</td>
                                <td><button className='report-btn' onClick={()=>(DownloadReport(BranchesList[branch].name))}><span class="material-symbols-sharp report-download-icon">download</span><p>Report</p></button></td>
                                {/* <td>{BranchesList[branch].place}</td> */}
                            </tr>
                        ))}
                            
                        </tbody>
                    </table>
                    {/* <a href="#">Show All</a> */}
                </div>
            </main>
            {/* <!-- --------------------END of main----------------- --> */}
            <div className="right">
                    <div className="top">
                        <button id="menu-btn">
                            <span className="material-symbols-sharp" onClick={SideMenu}>menu</span>
                        </button>
                    </div>
                    <div className="sales-analytics">
                        
                        <div class="item add-new">
                            <div onClick={NewForm}>
                                <span class="material-symbols-sharp">add</span>
                                    <h3>Add Branch</h3>
                            </div>
                        </div>
                        <div className="add-right-side">
                        <form action="" className='new-employee-form' onSubmit={RegisterNewBranch}> 
                            <ul className="reg-form">
                           
                            <li><label htmlFor="name">Branch name:</label></li>
                            <input type="text" name="name" id="" placeholder="Branch name" required/>
                            <li>
                            <label htmlFor="place">Place:</label>
                            <input type="text" name="place" id="" placeholder="Branch place" required/>
                            </li>
                            
                            {/* <a href="#">forget password</a> */}
                            {/* <h2 className="danger">{ErrMsg ? ErrMsg : ""}</h2> */}
                            <input type="submit" />
                            </ul>
                        </form>
                        </div>
                    </div>
                </div>
                
            
        </div>
        
        </div>
    </div>
  )
}
