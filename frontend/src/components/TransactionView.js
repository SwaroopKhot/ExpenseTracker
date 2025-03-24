import React, { useEffect, useState } from 'react'
import "./TransactionView.css"
import ExpensesCardView from './View/ExpensesCardView'
import ExpensesTabularView from './View/ExpensesTabularView'

import Modal from './modal/Modal'
import ModalButton from './modal/ModalButton'
import { useStateValue } from '../provider/StateProvider'
import httpInstance from '../httpUtility'
import api from '../api/apiUtility'
import { useNavigate } from 'react-router-dom'

function TransactionView({refresh}) {
    const [{user}, dispatch] = useStateValue()
    const navigate = useNavigate()

    const [refreshPage, setRefreshPage] = useState(false)
    const [activeTab, setActiveTab] = useState("Card View")
    const [tab, setTab] = useState(["Card View", "Tabular View"])

    // Budget Modal:
    const [showBudgetModal, setShowBudgetModal] = useState(false)
    const [budgetError, setBudgetError] = useState("")
    const [budgetAmount, setBudgetAmount] = useState(1000)

    // Data:
    const [currBudget, setCurrBudget] = useState(0)
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        // Fetch Budget:
        const fetchBudget = async () => {
            if(user){
                const payload = {
                    "email" : user.email
                }
                const edit = await httpInstance.post(api.getBudget(), payload)
                    .then((res) => {
                        dispatch({
                            type: "TOAST_MESSAGE",
                            toast: res?.data?.message
                        })
                        setCurrBudget(res.data.budget)
                    })
                    .catch((err) => {
                        if(err.response){
                            dispatch({
                                type: "TOAST_MESSAGE",
                                toast: err?.response?.data?.message
                            });
                        }
                    })
            } else {
                navigate("/login")
            }
        }

        // Fetch Expenses:
        const fetchExpenses = async () => {
            if(user){
                const payload = {
                    email: user.email
                }

                const getExpense = await httpInstance.post(api.getExpense(), payload)
                    .then((res) => {
                        calculateExpenses(res.data.data);
                    })
                    .catch((err) => {
                        if(err.response){
                            //   Purposefully ignoring this:
                        }
                    })
            }
        }

        fetchExpenses();
        fetchBudget()
    }, [refresh, refreshPage])

    const calculateExpenses = (expenses) => {
        const currentMonth = new Date().getMonth();
        let monthlySum = 0;
        let totalSum = 0;
    
        expenses.forEach((expense) => {
          const expenseMonth = new Date(expense.date).getMonth();
          totalSum += parseFloat(expense.amount);
    
          if (expenseMonth === currentMonth) {
            monthlySum += parseFloat(expense.amount);
          }
        });
    
        setMonthlyExpense(monthlySum);
        setTotalExpense(totalSum);
      };


    // Save Budget:
    const handleSaveBudget = async() => {
        if(budgetAmount < 1){
            setBudgetError("Amount must be greater than 0 !")
            return
        }
        setBudgetError("")
        if(user){
            const payload = {
                "email" : user.email,
                "budget" : budgetAmount
            }
            const edit = await httpInstance.post(api.addBudget(), payload)
                .then((res) => {
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: res?.data?.message
                    })
                    setShowBudgetModal(false)
                    setRefreshPage(!refreshPage)
                })
                .catch((err) => {
                    if(err.response){
                        dispatch({
                            type: "TOAST_MESSAGE",
                            toast: err?.response?.data?.message
                        });
                    }
                    setShowBudgetModal(false)
                })
        } else {
            navigate("/login")
        }
    }


  return (
    <div className="transaction_view_container" style={{marginTop: "20px"}}>
        <div className='transaction_view_container_section_1'>
            <div className='expense_tab_view'>
                {tab && tab.map(name => (
                    <div className='expense_tab_name' onClick={() => setActiveTab(name)} style={name === activeTab ? {background: "#eee"} : {}}>
                        {name}
                    </div>
                ))}
            </div>

            <div className='expense_tab_view_container'>
                {activeTab && activeTab === "Card View" && 
                    <ExpensesCardView refresh={refresh} />
                }

                {activeTab && activeTab === "Tabular View" && 
                    <ExpensesTabularView refresh={refresh} />
                }
            </div>
        </div>

        <div className='transaction_view_container_section_2'>
            <div className='blank_space'></div>

            <div className='transaction_view_container_details'>
                <h3 className='transaction_view_container_details_header'>Overview:</h3>

                <div className='transaction_view_container_details_row'>
                    <p><b>Budget:</b> ₹{currBudget && currBudget}  &nbsp;&nbsp;<span style={{color: "green", fontWeight: 500, cursor: "pointer", textDecoration: "underline"}} onClick={() => setShowBudgetModal(true)}>Edit Budget</span></p>
                </div>

                <div className='transaction_view_container_details_row'>
                    <p><b>Monthly Expenses:</b> ₹{monthlyExpense ? monthlyExpense : 0}</p>
                </div>

                <div className='transaction_view_container_details_row'>
                    <p><b>Overall Expenses:</b> ₹{totalExpense ? totalExpense : 0}</p>
                </div>

                <p style={{marginTop: "10px", fontSize: "12px", fontWeight: 500}}>
                    {monthlyExpense && currBudget && currBudget > monthlyExpense ? 
                    `You can spend ₹${currBudget-monthlyExpense} more!` 
                    : `You have over-spend ₹${monthlyExpense-currBudget} from your current budget!`}
                </p>

            </div>
        </div>
        

        {showBudgetModal && 
            <Modal title="Add you Monthly Budget" onClose={() => setShowBudgetModal(false)}>
                <div>
                    <div className='form_section'>
                        <label>Amount: <span>(required)</span></label>
                        <input type="number" placeholder='Enter Amount' value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)}/>
                    </div>

                    <ModalButton onSubmit={() => handleSaveBudget()} onClose={() => setShowBudgetModal(false)} isLoading={false} errorMsg={budgetError && budgetError}></ModalButton>
                </div>
            </Modal>
        }
    </div>
  )
}

export default TransactionView