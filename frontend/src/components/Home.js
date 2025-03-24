import React, { useEffect, useState } from 'react'
import "./Home.css"
import { IoAddSharp } from "react-icons/io5";
import AddExpenseModal from './modal/AddExpenseModal';
import TransactionView from './TransactionView';
import { useStateValue } from '../provider/StateProvider';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate()

    const [refresh, setRefresh] = useState(false)

    // States:
    const [showAddExpense, setShowAddExpense] = useState(false)
    const optionCard = [{
            name: "Add Expenses",
            onClick: () => setShowAddExpense(true),
            icon: <IoAddSharp size={13} />,
            hint: "Expense that you made"
        },
        {
            name: "Analysis Expenses",
            onClick: () => navigate("/u/dashboard"),
            icon: <IoAddSharp size={13} />,
            hint: "Charts to visualize Expense"
        }
    ]

    useEffect(() => {
        setRefresh(!refresh)
    }, [showAddExpense])

  return (
    <div>
        <div className='home_card_container'>
            {optionCard && optionCard.map(card => (
                <div className='home_card_view' onClick={() => card.onClick()}>
                    <div className='home_card_header'>
                        <p className='home_card_header_text'>{card.name}</p>
                        <p className='home_card_header_icon'>{card.icon}</p>
                    </div>

                    <p className='home_card_header_hint'>{card.hint}</p>
                </div>
                ))   
            }
        </div>

        <TransactionView refresh={refresh}/>

        {/* Modals */}
        {showAddExpense && 
            <AddExpenseModal handleClose={() => setShowAddExpense(false)} />
        }
    </div>
  )
}

export default Home