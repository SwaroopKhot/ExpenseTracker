import React from 'react'
import "./Modal.css"
import { RxCross2 } from "react-icons/rx";


function Modal(props) {
  return (
    <div className='modal_wrapper'>
        <div className='modal_container'>
            <div className='modal_content'>
                <div className='modal_header'>
                    <p className='modal_title'>{props.title}</p>

                    <p className='modal_close' onClick={() => props.onClose()}><RxCross2 size={15}/></p>
                </div>


                <div className='modal_children'>
                    {props.children}
                </div>


                

            </div>
        </div>
    </div>
  )
}

export default Modal