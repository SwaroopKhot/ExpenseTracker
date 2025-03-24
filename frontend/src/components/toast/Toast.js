import React, { useEffect } from 'react'
import "./Toast.css"
import { useStateValue } from "../../provider/StateProvider";
import { RxCross2 } from "react-icons/rx";


function Toast() {

    const [{toast}, dispatch] = useStateValue()

    useEffect(() => {
        setTimeout(() => {
            handleCloseToast()
        }, 10000);
    }, [toast])

    const handleCloseToast = () => {
        dispatch({
            type: "TOAST_MESSAGE",
            toast: "",
          });
    }


  return (
    <>
        {toast && 
            <div className='toast_container'>
                <div className='toast_content'>
                    {/* <p>{toast}</p> */}
                    {toast}
                    <p onClick={() => handleCloseToast()} style={{cursor: "pointer", marginLeft: "20px"}}><RxCross2 /></p>
                </div>
            </div>
        }
    </>
  )
}

export default Toast