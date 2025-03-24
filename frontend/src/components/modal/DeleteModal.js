import React, { useState } from 'react'
import "./DeleteModal.css"
import Modal from './Modal'


function DeleteModal({onDelete, onClose}) {

  return (
    <div>
        <Modal title="Confirmation before Action !" onClose={() => onClose()}>
            <div>
              <p className='deletemodal_message'>Are you sure do you want to delete this Item !</p>

              <div className='deletemodal_button_container'>
                <button className='deletemodal_delete_button' onClick={onDelete}>
                  Delete
                  </button>
                <button className='deletemodal_close_button' onClick={() => onClose()}>Cancel</button>
              </div>

            </div>
        </Modal>
    </div>
  )
}

export default DeleteModal