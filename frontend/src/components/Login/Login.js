import React, {useState} from 'react'
import httpInstance from '../../httpUtility'
import "./Login.css"
import config from "../../config.json"
import { useNavigate } from 'react-router-dom'
import { useStateValue } from "../../provider/StateProvider";
import api from '../../api/apiUtility'
import { LuLoaderCircle } from 'react-icons/lu'
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from 'react-icons/rx'


function Login() {

    const navigate = useNavigate()
    const [{ user }, dispatch] = useStateValue();


    // Form value States:
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")

    const [isNewAccount, setIsNewAccount] = useState(false)




    // Signin Function:
    const handleSignin = async () => {

        if(email===""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Please provide email to login"
            });
            return

        } else if (password === "") {
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Password cannot be empty"
            });
            return
        }

        const payload = {
            email: email,  // Example data you want to send
            password: password,
        };

        const login = await httpInstance.post(api.loginUser(), payload)
            .then((res) => {
                dispatch({
                    type: "ADD_USER",
                    user: {
                        "username" : res.data["username"],
                        "email" : res.data["email"]
                    }
                })
                navigate("/u/activity")
            })
            .catch((err) => {
                if(err.response){
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: err?.response?.data?.message
                      });
                }
            })
    }

    // create new user:
    const createNewAccount = async () => {

        if(userName === ""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Username cannot be empty"
            });
            return
        }
        else if(email===""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Email cannot be empty"
            });
            return
        } else if (password === "") {
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Password cannot be empty"
            });
            return
        }

        const payload = {
            username: userName,
            email: email,  
            password: password
        };
        
        const register = await httpInstance.post(api.registerUser(), payload)
            .then((res) => {
                dispatch({
                    type: "ADD_USER",
                    user: {
                        "username" : res.data["username"],
                        "email" : res.data["email"],
                    }
                })
                navigate("/u/activity")
            })
            .catch((err) => {
                if(err.response){
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: err?.response?.data?.message
                      });
                }
            })
    }

    
  return (
    <div className='login_container'>
        <div className='login_welcome'>Welcome to <span>{config.title}</span></div>
        <p className='login_hint'>We will make sure to keep your data secure and safe, so just dive-in !</p>


        {isNewAccount ? 
            <div className='login_form_div'>

                <div className='login_form_content'>
                    <label for="username" >User Name: </label>
                    <input id="username" type="text" placeholder='Enter what username you want' value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>

                <div className='login_form_content'>
                    <label for="email" >Email: </label>
                    <input id="email" type="text" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className='login_form_content'>
                    <label for="password">Password: </label>
                    <input id="password" type="password" placeholder='Enter accout password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className='login_btn new_account' onClick={createNewAccount}>Create New Account</button>
               
            </div>
        :
            <div className='login_form_div'>
                <div className='login_form_content'>
                    <label for="email" >Email: </label>
                    <input id="email" type="text" placeholder='Enter you email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className='login_form_content'>
                    <label for="password">Password: </label>
                    <input id="password" type="password" placeholder='Enter accout password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className='login_btn' onClick={handleSignin}>Login</button>

                <button className='login_btn new_account' onClick={() => setIsNewAccount(true)}>Create New Account</button>
            </div>
        }

        <p className='login_agreement'>By signing-in you agree our terms and conditions*</p>
    </div>
  )
}

export default Login