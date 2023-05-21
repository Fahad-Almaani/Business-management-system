
import React,{useContext,useState,useEffect} from 'react'
import AuthContext from "../utils/AuthContext";
import axios from 'axios'
export default function IncomeEntryForAdmin() {
    // const baseURL = "http://127.0.0.1:8000/api/"
    // ===================================Link with Auth context data===================================//
      let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
      const [BranchesNames, setBranchesNames] = useState("");
    
      useEffect(() => {
        axios.get(baseURL+"branches-details",{headers:{'Authorization':`JWT ${localStorage.getItem("access_token")}`
      }}).then(res=>{
        setBranchesNames(res.data)
      }).catch(err=>{
          console.log(err);
      })
      }, [])
      
      
  
      // ===================================Theme Mode func===================================//
    //   let ThemeMode = ()=>{
    //       const themeToggler = document.querySelector(".theme-toggler")
    //       document.body.classList.toggle('dark-theme-variables')
    //       themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    //       themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    //     }
        // ===================================Side nav func on responsive screen===================================//
        // let SideMenu = ()=>{
          
        //   const sideMenu = document.querySelector("aside");
        //   const menuBtn = document.querySelector("#menu-btn");
        //   const closeBtn = document.querySelector("#close-btn");
        //   if (sideMenu.style.display == 'block'){sideMenu.style.display = 'none'}else{sideMenu.style.display = 'block';}
        // }
  
  
        let RegisterIncome = (e)=>{
          e.preventDefault();
        //   console.log(e.target.branch.value);
          axios.post(baseURL+"income-entry/",{
              visa:e.target.visa.value,
              cash:e.target.cash.value,
              note:e.target.note.value?e.target.note.value:null ,
              branch:e.target.branch.value,
              employe:User.user_name,
              },{
              headers:{
                  'Authorization':`JWT ${localStorage.getItem("access_token")}`
              }
              }
          ).then(res=>{
              console.log(res);
              e.target.visa.value = null
              e.target.cash.value = null
              e.target.note.value = ""
          }).catch(err=>{
              console.log(err);
          })
          
        }
      return (
          <div>
          <div className="container">
              <aside>
                  <div className="top">
                      <div className='logo'>
                          <img className="profile-photo" src="../static/images/profile.jpg" alt="profile"/>
                          <h2>Libr<span className="danger">aries</span></h2>
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
                        <a href="/income"><span className="material-symbols-sharp">payments</span>
                            <h2>Income</h2>
                        </a>
                        <a href="/withdraw"><span className="material-symbols-sharp">request_quote</span>
                            <h2>Withdraw</h2>
                        </a>
                        <a href="/employees"><span className="material-symbols-sharp">badge</span>
                            <h2>Employees</h2>
                        </a>
                        <a href="/settings"><span className="material-symbols-sharp">settings</span>
                            <h2>Settings</h2>
                        </a>
                        <a href="" onClick={logoutUser}><span className="material-symbols-sharp">logout</span>
                            <h2>Logout</h2>
                        </a>
            </div>
              </aside>
              {/* <!----------------------END of ASIDE ----------------------> */}
              <main>
                 <div className="income-entry-container">
                  <div>
                      <form action="" onSubmit={RegisterIncome}>
                        <h2>
                        <select name="branch" id="">
                            {Object.keys(BranchesNames).map((branch,id)=>(
                                <option value={BranchesNames[branch].branch} key={id}>{BranchesNames[branch].branch}</option>
                            ))}
                        </select>
                        </h2>
                      {/* <h2>{BranchName ? BranchName : <p>لايوجد مكتبه مرتبطه</p>}</h2> */}
                          <span className="material-symbols-sharp payments">payments</span>
                          <label htmlFor="cash">Cash</label>
                          <input type="number" name="cash" placeholder="أدخل الكاش هنا"/>    
                          <span className="material-symbols-sharp credit_card">credit_card</span>
                          <label htmlFor="visa">Visa</label>
                          <input type="number" name="visa" placeholder="أدخل مبلغ التحويل الاسلكي هنا"/>    
                          <span className="material-symbols-sharp notes">notes</span>
                          <label htmlFor="note">Notes</label>
                          <textarea type="text" name="note" placeholder="خانة الملاحظات"/> 
                          <input type="submit" />   
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