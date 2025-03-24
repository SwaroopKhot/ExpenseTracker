import React from 'react'
import "./LoadingIcon.css"
import { TbLoader2 } from "react-icons/tb";

function LoadingIcon({loader=false, message="loading"}) {
  return (
    <div className='loader_container'>
        <p className='loader_icon'>
            <TbLoader2 size={'16px'}/>
        </p>

        {loader && <p className='loader_message'>{message}...</p>}
    </div>
  )
}

export default LoadingIcon