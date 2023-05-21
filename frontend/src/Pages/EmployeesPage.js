import React,{useContext,useState,useEffect} from 'react'
import AuthContext from "../utils/AuthContext";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {NavBar} from "./MainComponents";

export default function EmployeesPage(){
    let navigate = useNavigate();
    // const baseURL = "http://127.0.0.1:8000/api/"
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const date = new Date();
    let month = months[date.getMonth()];
    let thisYear = date.getFullYear()
    let {logoutUser,User,ThemeMode,SideMenu,baseURL} = useContext(AuthContext);
    const [ErrMsg, setErrMsg] = useState(null)

    const [UsersList, setUsersList] = useState("")
    let getUsers= ()=>{
        axios.get(baseURL+"users-list",{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            } 
        }).then(res=>{
            setUsersList(res.data)
        }).catch(err=>{
            console.log(err);   
        })
    }

    const [EmployeesList, setEmployeesList] = useState()
      let getEmployees = ()=>{
        axios.get(baseURL+"employees",{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            }}).then(res=>{
                setEmployeesList(
                    res.data
                )
            }).catch(err=>{
                if (err.response.status == 401){                
                    navigate('/login')
                }else{
                console.log(err);
                }
            })
      }
    const [BranchesNames, setBranchesNames] = useState("")
    let getBranches = ()=>{
        axios.get(baseURL+"branch",{headers:{'Authorization':`JWT ${localStorage.getItem("access_token")}`
      }}).then(res=>{
        setBranchesNames(res.data)
        console.log(res.data)
      }).catch(err=>{
          console.log(err);
      })
    }



    function NewForm(){
        console.log("clikced")
        const form = document.querySelector(".new-employee-form")
        if (form.style.display == 'block'){form.style.display = 'none'}else{form.style.display = 'block';}
    }
    
    
    
    useEffect(() => {
    getEmployees();
    getBranches();
    getUsers();
    }, [])




    // deActivate Employe
    function UserStatusEdit(User_name) {
        axios.post(baseURL+"user-status-edit",{
            username:User_name
        },{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            }
        }).then(res=>{
            window.location.reload(false);
            console.log(res);
        }).catch(err=>{
            if (err.status = 406) {
                alert("This user is staff")
            }else{
                alert("Somthing went wrong!!")
            }
        })
    }

    const RegisterUser = (e)=>{
        console.log(e.target.username.value);
        e.preventDefault();
        if (e.target.password.value == e.target.password2.value){
    
          axios.post(baseURL +"employees",{
            branch:e.target.branch.value,
            username:e.target.username.value,
            first_name:e.target.first_name.value,
            last_name:e.target.last_name.value,
            email:e.target.email.value,
            password1:e.target.password.value,
            password2:e.target.password2.value,
            salary:e.target.salary.value,
          },{
            headers:{
                'Authorization':`JWT ${localStorage.getItem("access_token")}`
            } 
          }
          ).then(res=>{
            setErrMsg(null);
            window.location.reload(false);
       
          }).catch(err=>{
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
        }else{
          setErrMsg("Password are not match")
        }
    
      }

 

      return (
        <div>
            <div>
            <div className="container">
                <NavBar/>
                {/* <!----------------------END of ASIDE ----------------------> */}
                <main>
                    <h1>Employees</h1>
                
                    {/* <!----------------------END of insigt ----------------------> */}
                    
                    <div className="recent-income">
                        <h2></h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Branch</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                           {EmployeesList?.map((employee,id)=>(
                            <tr key={id}>
                                <td>{employee.user}</td>
                                <td>{employee.branch}</td>
                                
                                { employee.status =="Active" ?    
                                <td onClick={()=>{UserStatusEdit(employee.user)}} className="active-user">{employee.status}</td>
                                :
                                <td onClick={()=>{UserStatusEdit(employee.user)}} className="danger deactivate">{employee.status}</td>
                                }

                            
                            </tr>
                           ))}
                           
                                
                            </tbody>
                        </table>
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
                                    <h3>Add Employee</h3>
                            </div>
                        </div>
                        <div className="add-right-side">
                        <form action="" className='new-employee-form' onSubmit={RegisterUser}> 
                            <ul className="reg-form">
                            <li>
                                <select name="branch" id="">
                                    {Object.keys(BranchesNames)?.map((branch)=>(
                                        <option value={BranchesNames[branch].id}>{BranchesNames[branch].name}</option>
                                    ))}
                                    
                                </select>
                            </li>
                            <li><label htmlFor="username">Username :</label></li>
                            <input type="text" name="username" id="" placeholder="username" required/>
                            <li>
                            <label htmlFor="first_name">First name:</label>
                            <input type="text" name="first_name" id="" placeholder="First name" pattern="[A-Za-z_-]+"/>
                            </li>
                            <li>
                            <label htmlFor="last_name">last name</label>
                            <input type="text" name="last_name" id="" placeholder="last name" pattern="[A-Za-z_-]+"/>
                            </li>
                            {/* <li> */}
                            {/* <label htmlFor="email">email</label> */}
                            <input type="text" name="email" id="" placeholder="email" required/>
                            {/* </li> */}
                            <li>
                            {/* <label htmlFor="password1">Password :</label> */}
                            <input type="password" name="password" id="" placeholder="password" required/>
                            </li>
                            <li>
                          
                            <input type="password" name="password2" id="" placeholder="repeate password" required/>
                            </li>
                            <li>
                          
                            <input type="number" name="salary" id="" placeholder="salary"/>
                            </li>
                            <h2 className="danger">{ErrMsg ? ErrMsg : ""}</h2>
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
