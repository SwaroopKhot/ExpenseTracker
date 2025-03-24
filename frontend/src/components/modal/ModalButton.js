import React, {useState} from 'react'
import { LuLoaderCircle } from "react-icons/lu";


function ModalButton({onSubmit, onClose, isLoading=false, errorMsg}) {
  
  return (
    <div>
      <div className='modal_button_container'>
        <button className='modal_button modal_submit_btn' onClick={onSubmit}>
            {isLoading && <LuLoaderCircle className="loaderAnimation" />} save
        </button>

        <button className='modal_button modal_cancel_btn' onClick={onClose}>
            close
        </button>
      </div>

      {errorMsg && <p className='error_msg' style={{marginBottom: "5px"}}>{errorMsg}</p>}
    </div>
  )
}

export default ModalButton