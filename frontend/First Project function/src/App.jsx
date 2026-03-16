import './App.css'
import {Navigate,Routes,Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import Admin from './Pages/Admin'
import Login from './Pages/Login'
import Employee from './Pages/Employee'
import Profile from './inpages/Profile'
import Editor from './inpages/Crud'
import Mainboard from './inpages/Mainboard'

import RoleRedirect from './Customhooks/RoleRedirect'
import EMMainboard from './inpages/EMMainboard'
import EMProfile from './inpages/Employee Profile'
import ForgotPassword from './Pages/Forgotpassword'
import Otpverify from './Pages/Otpverify'
import ResetPassword from './Pages/resetpassword'
import Task from "./inpages/task"



function App() {
  return (   
          <div className='app'>


            <Routes>
              <Route path='/' element ={< RoleRedirect/>} />
              <Route path='/signup' element={<Signup />}></Route>
              <Route path='/login' element={<Login />} >  </Route>
              <Route path='/forgot-password' element={<ForgotPassword />} >  </Route>
              <Route path='/verify-otp' element={<Otpverify />} >  </Route>
              <Route path='/reset-password' element={<ResetPassword />} >  </Route>
        
              <Route path='/admin' element={<Admin />}>
                 

                  <Route index element={<Mainboard />} />
              
                  <Route path='/admin/userprofile' element={<Profile />}/>
                 <Route path='/admin/crud' element={<Editor />}/>
                
              
              
              
              </Route>  

            
              <Route path='/employee' element={<Employee />}>
                 

                  
              
                    <Route index element={<EMMainboard />} />
              
                  <Route path='/employee/userprofile' element={<EMProfile />}/>
                 <Route path='/employee/task' element={<Task />}/>
                 
              
              
              
              </Route>  
            </Routes>   


          </div>

  )
} 

export default App
