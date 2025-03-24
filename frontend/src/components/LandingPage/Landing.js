import React, { useEffect, useState } from 'react'
import './Landing.css'
import { useNavigate } from 'react-router-dom'




function Landing() {
    const navigate = useNavigate()

    const handleNavigation = () => {
        // USER: 
        navigate("/u/activity")

        // No User: LOGIN


    }



  return (
    <div>
        <div className='landing_container'>
            <div className='landing_comments'>
                <p className='landing_tagline'>Take Control of Your Finances with Ease!</p>
                <p className='landing_message'>💰 Track, Manage, and Save Smarter!</p>
                <button className='landing_button' onClick={handleNavigation}>Get Started</button>
            </div>


            
        </div>

        <div className='landing_description'>
            <span>"</span>"Stay on top of your expenses effortlessly! 
                This app helps you record and categorize your spending, giving you clear insights 
                into where your money goes. With an intuitive interface and smart analytics, budgeting has never been easier. Spend wisely, save better—it’s that simple!"
            <span>"</span>
        </div>
    </div>
  )
}

export default Landing