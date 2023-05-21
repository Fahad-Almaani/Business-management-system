
import React,{useContext,useState,useEffect} from 'react'
import AuthContext from "../utils/AuthContext";
import axios from 'axios'
import { NavBar2  } from './MainComponents';
const IncomeEntryPage = ()=>{
    // const baseURL = "http://127.0.0.1:8000/api/"
  // ===================================Link with Auth context data===================================//
    let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
    const [BranchName, setBranchName] = useState(null);
    const [TypeOfRecored, setTypeOfRecored] = useState(true)
    
    axios.get(baseURL+"employee/me",{headers:{'Authorization':`JWT ${localStorage.getItem("access_token")}`
    }}).then(res=>{
        setBranchName(res.data.branch)
    }).catch(err=>{
        console.log(err);
    })

    

      let RegisterProfit = (e)=>{
        e.preventDefault();
        if (TypeOfRecored == true){
            axios.post(baseURL+"profits/",{
                amount:e.target.amount.value,
                },{
                headers:{
                    'Authorization':`JWT ${localStorage.getItem("access_token")}`
                }
                }
            ).then(res=>{
                console.log(res);
                e.target.amount.value = null
               
            }).catch(err=>{
                console.log(err);
            })
            
        }else{
            axios.post(baseURL+"expences/",{
                amount:e.target.amount.value,
                },{
                headers:{
                    'Authorization':`JWT ${localStorage.getItem("access_token")}`
                }
                }
            ).then(res=>{
                console.log(res);
                e.target.amount.value = null
               
            }).catch(err=>{
                console.log(err);
            })

        }
      }
      
      function ChangeTypeOfRecored(){
        const button = document.querySelector('.submit-new-income')
        const amountTag = document.querySelector('.amount-tag')
        const amountLable = document.querySelector('.amount-type-lable')
        const swapLable = document.querySelector('.swap-label')
        if (button.style.backgroundColor =="var(--color-danger)"){
            button.style.backgroundColor = "var(--color-primary)"
            amountTag.style.backgroundColor = "var(--color-primary)"
            

        }else{
            button.style.backgroundColor = "var(--color-danger)"
            amountTag.style.backgroundColor = "var(--color-danger)"
        }
        if (TypeOfRecored == true){
            setTypeOfRecored(false)
            amountLable.textContent = "Expenses amount"
            swapLable.textContent = "Change to Profits"
            
        }else{
            setTypeOfRecored(true)
            amountLable.textContent = "Profits amount"
            swapLable.textContent = "Change to Expenses"
        }
      }

    return (
        <div>
        <div className="container">
            <NavBar2/>
            {/* <!----------------------END of ASIDE ----------------------> */}
            <main>
               <div className="income-entry-container">
                <div>
                    <form action="" onSubmit={RegisterProfit}>
                    {/* <h2>branch</h2> */}
                        <br />
                        <br />
                        
                        <div className='expence-button'>

                        {/* <span className="material-symbols-sharp swap_horizontal_circle">swap_horiz</span> */}
                        <label className="switch">
                        <input type="checkbox" name='type' onClick={ChangeTypeOfRecored}/>
                        <span className="slider round"></span>
                        </label>
                        <p className='swap-label'>Change to Expence</p>
                        </div>
                        <br />
                        <br />
                        <span className="material-symbols-sharp payments amount-tag">payments</span>
                        <label htmlFor="amount" className='amount-type-lable'>Profit amount</label>
                        <input type="number" name="amount" placeholder="OMR"/>    
                        {/* <span className="material-symbols-sharp notes">notes</span> */}
                        
                        <input type="submit" className='submit-new-income'/>   
                    </form>                    
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
                
            
            {/* <!-- ENd of recent updates --> */}
    
            
                
                
               
                    
                </div>
            </div>
        </div>
        
    )
    

}

export default IncomeEntryPage;