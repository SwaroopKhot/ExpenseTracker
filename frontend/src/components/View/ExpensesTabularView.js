import React, { useEffect, useState } from 'react';
import './ExpensesTabularView.css';
import { MdModeEdit, MdDelete} from "react-icons/md";
import EditEvent from '../modal/EditEvent';
import DeleteModal from '../modal/DeleteModal';
import { useStateValue } from '../../provider/StateProvider';
import httpInstance from '../../httpUtility';
import api from '../../api/apiUtility';
import { useNavigate } from 'react-router-dom';
import LoadingIcon from '../Loader/LoadingIcon';


function ExpensesTabularView({refresh}) {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate()

  const [isLoadingExpense, setIsLoadingExpense] = useState(false)
  const [editRefresh, setEditRefresh] = useState(false)

  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filterParent, setFilterParent] = useState('');
  const [filterChild, setFilterChild] = useState('');

  // Modal States:
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const filterOptions = {
    Category: ["Miscellaneous", "Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Education"],
    Payments: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer']
  };

  const [expenses, setExpenses] = useState();


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
                      setIsLoadingExpense(false)
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

    fetchExpenses();
}, [user, refresh, editRefresh])

  const handleCheckboxChange = (txn) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(txn)
        ? prevSelected.filter((item) => item !== txn)
        : [...prevSelected, txn]
    );
  };

  const handleParentChange = (e) => {
    setFilterParent(e.target.value);
    setFilterChild('');
  };

  const handleChildChange = (e) => {
    setFilterChild(e.target.value);
  };

  const filteredExpenses = expenses?.filter((txn) => {
    if (!filterParent || !filterChild) return true;
    return txn[filterParent.toLowerCase()] === filterChild;
  });

  const handleEditCondition = () => {
    if(selectedTransactions && selectedTransactions.length > 0){
      setShowEditModal(true)
    } else {
      dispatch({
        type: "TOAST_MESSAGE",
        toast: "Please select the Expense to Edit !",
      });
    }
  }

  const handleDeleteCondition = () => {
    if(selectedTransactions && selectedTransactions.length > 0){
      setShowDeleteModal(true)
    } else {
      dispatch({
        type: "TOAST_MESSAGE",
        toast: "Please select the Expense to Delete !",
      });
    }
  }

  // Edit Function:
  const onHandleEdit = async(updatedExpenses) => {
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

  // Edit Function:
  const onHandleDelete =async () => {
    setIsDeleting(true)
    const deleteList = []

    if(selectedTransactions){
        selectedTransactions.map(item => {
            deleteList.push(item.id)
        })
    }

    if(user){
      const payload = {
          "email" : user.email,
          "id" : deleteList
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
    <div>
      <div className='tabular_view_filter'>
        <h3 style={{marginRight: "10px"}}>Filter By:</h3>

        <select className='tabular_view_filter_select_option' value={filterParent} onChange={handleParentChange}>
          <option value="">Select Filter Category</option>

          {Object.keys(filterOptions).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select> &nbsp;

        {filterParent && (
          <select className='tabular_view_filter_select_option'  value={filterChild} onChange={handleChildChange}>
            <option value="">Select {filterParent}</option>

            {filterOptions[filterParent].map((child) => (
                <option key={child} value={child}>
                    {child}
                </option>
            ))}
          </select>
        )}

        <button className='icon-container tabular_view_filter_edit_btn' onClick={() => handleEditCondition()}>
            <MdModeEdit size={12} style={{marginRight: "10px"}}/> Edit
        </button>

        <button className='icon-container tabular_view_filter_delete_btn' onClick={() => handleDeleteCondition()}>
            <MdDelete size={12} style={{marginRight: "10px"}}/> Delete
        </button>
      </div>


      <div className="expense_table_body">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
          {isLoadingExpense &&  <div style={{width: "100%", textAlign: "center"}}><LoadingIcon loader={true} /></div>}
          {!isLoadingExpense && filteredExpenses && filteredExpenses.map((txn, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(txn)}
                    checked={selectedTransactions.includes(txn)}
                  />
                </td>
                <td>{txn.title}</td>
                <td>{txn.amount}</td>
                <td>{txn.category}</td>
                <td>{txn.date}</td>
                <td>{txn.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses && filteredExpenses.length === 0 && <p style={{width: "100%", textAlign: "center", marginTop: "10px", fontSize: "12px" , fontWeight: 500}}>No Data !</p>}
      </div>

      
      {showEditModal && <EditEvent expensesList={selectedTransactions} onHandleEdit={(updatedExpenses) => onHandleEdit(updatedExpenses) } onClose={() => setShowEditModal(false)}/>}
      {showDeleteModal && <DeleteModal onDelete={onHandleDelete} onClose={() => setShowDeleteModal(false)} isLoading={isDeleting}/>} 
    </div>
  );
}

export default ExpensesTabularView;
