import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import ModalButton from './ModalButton'

function EditEvent({expensesList=[], onClose, onHandleEdit}) {
    const [currentExpense, setCurrentExpense] = useState(0)

    const [id, setID] = useState(expensesList[currentExpense].id)
    const [amount, setAmount] = useState(expensesList[currentExpense].amount)
    const [title, setTitle] = useState(expensesList[currentExpense].title)
    const [category, setCategory] = useState(expensesList[currentExpense].category)
    const [date, setDate] = useState(expensesList[currentExpense].date)
    const [payment, setPayment] = useState(expensesList[currentExpense].payment)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    // Updated Expenses:
    const [updateExpenses, setUpdatedExpenses] = useState([])
    
    const categoryList = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Education", "Miscellaneous"]
    const paymentMethods = ['UPI','Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'];

    useEffect(() => {
        if (expensesList[currentExpense]) {
            setID(expensesList[currentExpense].id)
            setAmount(expensesList[currentExpense].amount);
            setTitle(expensesList[currentExpense].title);
            setCategory(expensesList[currentExpense].category);
            setDate(expensesList[currentExpense].date);
            setPayment(expensesList[currentExpense].payment);
        }
    }, [currentExpense])

    const handleSubmit = () => {
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
            id: id,
            amount: amount,
            title: title,
            category: category,
            date: date,
            payment: payment
        }

        updateExpenses.push(payload)
        onHandleEdit(updateExpenses)
        onClose()
    }

    const handleNextUpdate = () => {
        if(currentExpense <= expensesList.length){

            if (title.length < 3){
                setErrorMsg("Expense title is invalid !")
                return
            }

            if (amount <= 0){
                setErrorMsg("Amount must be Valid !")
                return
            }

            setErrorMsg("")

            // Make API Call:
            const payload = {
                id: id,
                amount: amount,
                title: title,
                category: category,
                date: date,
                payment: payment,
                loading: loading
            }

            setUpdatedExpenses((prevList) => [...prevList, {...payload} ])
            setCurrentExpense((prevState) => prevState+1)
        } 
    }

    const handleClose = () => {
        onClose()
    }
    
  return (
    <div>
        <Modal title="Update Expenses" onClose={handleClose}>
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

                    {expensesList && expensesList.length > 1 && currentExpense < expensesList.length - 1 &&
                        <button className='modal_button modal_submit_btn' onClick={handleNextUpdate}>Next Expense</button>
                    }

                    {expensesList && expensesList.length === currentExpense+1 &&
                        <ModalButton onSubmit={() => handleSubmit()} onClose={() => handleClose()} isLoading={loading} errorMsg={errorMsg && errorMsg}></ModalButton>
                    }
            </div>

        </Modal>
    </div>
  )
}

export default EditEvent