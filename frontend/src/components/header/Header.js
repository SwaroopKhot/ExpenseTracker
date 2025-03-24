import React from 'react'
import config from "../../config.json"
import "./Header.css"
import { Link, useNavigate } from 'react-router-dom'
import { useStateValue } from '../../provider/StateProvider'

function Header() {
  const [{user}, dispatch] = useStateValue()
  const navigate = useNavigate()


  const logout = () => {
    dispatch({
      type: "ADD_USER",
      user: null
    })
  }
    

  return (
    <div className='header_main_div'>
        <div><p className='header_title' onClick={() => navigate("/")}>{config.title}</p></div>

        <div className='header_nav_tabs_div'>
            <Link to="/">Home</Link>
            {user && user.username ? 
              <Link to="/login" onClick={() => logout()}>{user.username}, logout</Link>
            : 
              <Link to="/login">login</Link>
            }
            
        </div>
    </div>
  )
}

export default Header
