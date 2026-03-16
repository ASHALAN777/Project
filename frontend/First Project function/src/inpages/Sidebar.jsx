import React from "react";
import "../inpages-src/sidebar.css";
import { NavLink } from "react-router-dom";




const Sidebar = () => {
  return (
    <div className="Sidecon">
      {/* <h3>Admin Dashboard</h3> */}

      <div className="Sidemenu">
        <div  > < NavLink
          to="/admin"
          end
          className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
        >
          Dashboard
        </  NavLink> </div>

        <div > < NavLink
          to="/admin/crud"
          className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
        >
          Employee
        </NavLink> </div>
        {/* <div> < NavLink
          to="/admin/ai-bot"
          className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
        >   
          Ai-bot
        </NavLink> </div> */}

          <div> < NavLink
          to="/admin/userprofile"
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

export default Sidebar;
