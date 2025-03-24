import React, { useEffect, useState } from 'react'
import "./ExpensesCardView.css"
import { MdModeEdit, MdDelete} from "react-icons/md";
import EditEvent from '../modal/EditEvent';
import DeleteModal from '../modal/DeleteModal';
import { useStateValue } from '../../provider/StateProvider';
import httpInstance from '../../httpUtility';
import api from '../../api/apiUtility';
import { useNavigate } from 'react-router-dom';
import LoadingIcon from "../Loader/LoadingIcon"

function ExpensesCardView({refresh}) {
    const [{user}, dispatch] = useStateValue()
    const [editRefresh, setEditRefresh] = useState(false)

    const navigate = useNavigate()
    const [expenses, setExpenses] = useState()
    const [isLoadingExpense, setIsLoadingExpense] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editExpense, setEditExpense] = useState("")
    const [deleteExpense, setDeleteExpense] = useState("")

    useEffect(() => {
        const fetchExpenses = async () => {

            if(user){
                setIsLoadingExpense(true)
                const payload = {
                    email: user.email
                }

                const getExpense = await httpInstance.post(api.getExpense(), payload)
                    .then((res) => {
                        setExpenses(res.data.data)
                        setIsLoadingExpense(false)
                    })
                    .catch((err) => {
                        if(err.response){
                            dispatch({
                                type: "TOAST_MESSAGE",
                                toast: err?.response?.data?.message
                            });
                            setIsLoadingExpense(false)
                        }
                    })
                } else {
                    navigate("/login")
                  }
            }

        fetchExpenses();
    }, [user, refresh, editRefresh])

    const colorMap = {"Food": "orange", "Travel": "red", "Bills": "purple", "Shopping": "rgb(29, 29, 185) ", "Entertainment": "rgb(195, 37, 127)", "Health": "green", "Education": "brown", "Miscellaneous": "rgb(49, 174, 174)"}

    const handleEditClick = (data) => {
        setShowEditModal(true)
        setEditExpense([{...data}])
    }

    
    const onHandleDelete = (data) => {
        setShowDeleteModal(true)
        setDeleteExpense([{...data}])
    }

    // Edit Function:
    const onHandleEdit = async (updatedExpenses) => {
        if(user){
            const payload = {
                "email" : user.email,
                "update_expense" : updatedExpenses
            }

            const edit = await httpInstance.post(api.editExpense(), payload)
                .then((res) => {
                    setEditRefresh(!editRefresh)
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: res?.data?.message
                    })
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
    }

    // Delete Function:
    const confirmDeletion = async() => {
        setIsDeleting(true)
        const deleteList = []

        if(deleteExpense){
            deleteExpense.map(item => {
                deleteList.push(item.id)
            })
        }
        if(user){
            const payload = {
                "email" : user.email,
                "id" : deleteList
                // "update_expense" : updatedExpenses
            }

            const deleteExp = await httpInstance.delete(api.deleteExpense(), {data: payload})
                .then((res) => {
                    setEditRefresh(!editRefresh)
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: res?.data?.message
                    })
                    setShowDeleteModal(false)
                })
                .catch((err) => {
                    if(err.response){
                        dispatch({
                            type: "TOAST_MESSAGE",
                            toast: err?.response?.data?.message
                        });
                    }

                    setShowDeleteModal(false)
                })
        }
    }


  return (
    <div className='expense_cardview_container'>

        {/* <div style={{marginLeft: "6px"}}>
            <input className='expense_cardview_search_div' type="text" placeholder='Search Transactions' />
        </div> */}

        <div className='expense_card_body'>
            {isLoadingExpense &&  <LoadingIcon loader={true} />}
            {!isLoadingExpense && expenses && expenses.map((transaction, index) => (
                <div className='expense_cardview_div' style={{borderLeft: `3px solid ${colorMap[transaction.category]}`}}>
                    <div className='expense_cardview_header'>
                        <p>{transaction.title}</p>

                        <div className='expense_cardview_options'>
                            <p className='expense_cardview_tag'>{transaction.payment}</p>
                            <p className='expense_cardview_tag'>{transaction.date}</p>  

                            <div className='icon-container expense_cardview_option_icon' style={{color: "orange"}} onClick={() => handleEditClick(transaction)}>
                                <MdModeEdit size={14} />
                            </div>

                            <div className='icon-container expense_cardview_option_icon'  style={{color: "rgb(255, 50, 50)"}} onClick={() => onHandleDelete(transaction)}>
                                <MdDelete size={14}/>
                            </div>
                        </div>
                    </div>

                    <div className='expense_cardview_label'>
                        <p>You spent <b>₹{transaction.amount}</b> on {transaction.category}</p>
                    </div>
                </div>
            ))
            }

            {expenses && expenses.length === 0 && <p style={{width: "100%", textAlign: "center", marginTop: "10px", fontSize: "12px" , fontWeight: 500}}>No Data !</p>}
        </div>

        {showEditModal && <EditEvent expensesList={editExpense} onHandleEdit={(updatedExpenses) => onHandleEdit(updatedExpenses) } onClose={() => setShowEditModal(false)}/>}
        {showDeleteModal && <DeleteModal onDelete={confirmDeletion} onClose={() => setShowDeleteModal(false)} />} 
    </div>
  )
}

export default ExpensesCardView