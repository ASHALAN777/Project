import React from "react";
import "../inpages-src/sidebar.css";
import { NavLink } from "react-router-dom";



const EMSidebar = () => {
  return (
    <div className="Sidecon">
     

      <div className="Sidemenu">
        <div  > < NavLink
          to="/employee"
          end
          className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
        >
          Dashboard
        </NavLink> </div>

        <div> < NavLink
          to="/employee/task"
          className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
            >
          Task
        </NavLink> 
        
        </div>

       
        <div> < NavLink
          to="/employee/userprofile"
          className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
            >
          Profile
        </NavLink> </div>


        
      
      </div>
    </div>
  );
};

export default  EMSidebar;
