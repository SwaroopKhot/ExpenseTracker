import React, { useState } from 'react'
import Modal from './Modal'
import ModalButton from './ModalButton'
import api from '../../api/apiUtility'
import httpInstance from '../../httpUtility'
import { useStateValue } from '../../provider/StateProvider'
import { useNavigate } from 'react-router-dom'

function AddExpenseModal({handleClose}) {
    const [{user}, dispatch] = useStateValue()
    const navigate = useNavigate()
    
    const [amount, setAmount] = useState(0)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("Miscellaneous")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [payment, setPayment] = useState("UPI")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    
    const categoryList = ["Miscellaneous", "Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Education"]
    const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'];

    const clearForm = () => {
        setTitle("")
        setCategory("Miscellaneous")
        setDate(new Date().toISOString().split('T')[0])
        setPayment("UPI")
        setLoading(false)
        setErrorMsg("")
    }

    // Submit Expenses:
    const handleSubmit = async () => {
        if (!user){
            navigate("/login")
            return
        }

        if (title.length < 3){
            setErrorMsg("Expense title is invalid !")
            return
        }

        if (amount <= 0){
            setErrorMsg("Amount must be Valid !")
            return
        }
        
        const selectedDate = new Date(date);
        const today = new Date();

        // Get only the date portion (ignoring time)
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (selectedDateOnly > todayOnly) {
            setErrorMsg("Date cannot be greater than today's date!");
            return;
        }

        setLoading(true)
        setErrorMsg("")

        // Make API Call:
        const payload = {
            email: user.email,
            amount: amount,
            title: title,
            category: category,
            date: date,
            payment: payment
        }

        // addExpense
        const response = await httpInstance.post(api.addExpense(), payload)
            .then((res) => {
                setLoading(false)
                // cleanup:
                clearForm()
                // Close Form:
                handleClose()
            })
            .catch((err) => {
                setErrorMsg(`Error: ${err?.response?.data?.message}`)
                setLoading(false)
            })

    }
    
  return (
    <div>
        <Modal  title="Add Expenses" onClose={handleClose}>
            <div>
                <div className='form_section'>
                    <label>Expense Title: <span>(required)</span></label>
                    <input type="text" placeholder='Enter the name as description' value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div className='form_section'>
                    <label>Amount: <span>(required)</span></label>
                    <input type="number" placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)}/>
                </div>

                <div className='form_section'>
                    <label>Category:</label>
                    <select name="category" value={category.category} onChange={(e) => setCategory(e.target.value)}>
                        {categoryList && categoryList.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className='form_section'>
                    <label>Date of Transaction:</label>
                    <input type="date" name="date" id="date" pattern="\d{4}-\d{2}-\d{2}" value={date} onChange={(e) => setDate(e.target.value)}/>
                </div>

                <div className='form_section'>
                        <label>Event Type:</label>

                        <div className='round_tag_div'>
                            {paymentMethods && 
                                paymentMethods.map(event => (
                                    <div className='round_tag' onClick={() => setPayment(event)}
                                        style={payment === event ? {backgroundColor: "#bbb"} : {}}
                                    >
                                        <p>{event}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <ModalButton onSubmit={() => handleSubmit()} onClose={() => handleClose()} isLoading={loading} errorMsg={errorMsg && errorMsg}></ModalButton>
            </div>

        </Modal>
    </div>
  )
}

export default AddExpenseModal