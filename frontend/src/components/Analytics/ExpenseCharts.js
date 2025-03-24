import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './ExpenseCharts.css';
import { useStateValue } from '../../provider/StateProvider';
import { useNavigate } from 'react-router-dom';
import httpInstance from '../../httpUtility';
import api from '../../api/apiUtility';
import { IoArrowBack } from 'react-icons/io5';

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpenseCharts = ({ data }) => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    // Fetch Budget:
    const fetchBudget = async () => {
      if (user) {
        const payload = {
          email: user.email
        };
        try {
          const res = await httpInstance.post(api.getBudget(), payload);
          setBudget(res.data.budget);
          dispatch({
            type: 'TOAST_MESSAGE',
            toast: res?.data?.message
          });
        } catch (err) {
          if (err.response) {
            dispatch({
              type: 'TOAST_MESSAGE',
              toast: err?.response?.data?.message
            });
          }
        }
      } else {
        navigate('/login');
      }
    };

    // Fetch Expenses:
    const fetchExpenses = async () => {
      if (user) {
        setLoading(true)
        const payload = {
          email: user.email
        };
        try {
          const res = await httpInstance.post(api.getExpense(), payload);
          setExpenses(res.data.data || []);

          setLoading(false)
        } catch (err) {
          console.error('Error fetching expenses:', err);
          setLoading(false)
        }
      }
    };

    fetchBudget();
    fetchExpenses();
  }, [user, navigate, dispatch]);

  
  if (loading) return <div>Loading...</div>;

  if (!expenses.length && budget === 0) return <div>No Data Available</div>;

  const categories = Array.from(new Set(expenses.map(exp => exp.category)));
  const paymentMethods = Array.from(new Set(expenses.map(exp => exp.payment)));
  const months = Array.from(new Set(expenses.map(exp => 
    new Date(exp.date).toLocaleString('default', { month: 'long' })
  )));

  // Aggregate expenses
  const categoryExpense = categories.map(cat => 
    expenses.filter(exp => exp.category === cat)
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  );

  const paymentExpense = paymentMethods.map(method => 
    expenses.filter(exp => exp.payment === method)
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  );

  const monthlyExpense = months.map(month => 
    expenses.filter(exp => new Date(exp.date)
    .toLocaleString('default', { month: 'long' }) === month)
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  );

  const dailyExpense = Array.from(new Set(expenses.map(exp => exp.date)))
    .map(date => expenses.filter(exp => exp.date === date)
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  );

  // Top 5 expense categories
  const top5Categories = categories.map((cat, i) => ({ category: cat, amount: categoryExpense[i] }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Chart Data
  const categoryData = { 
    labels: categories, 
    datasets: [{ 
      data: categoryExpense, 
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] 
    }] 
  };

  const paymentData = { 
    labels: paymentMethods, 
    datasets: [{ 
      data: paymentExpense, 
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] 
    }
  ]};


  const dailyData = { 
    labels: Array.from(new Set(expenses.map(exp => exp.date))),
    datasets: [{ 
      label: 'Daily Expenses', 
      data: dailyExpense, 
      borderColor: '#4BC0C0', 
      fill: false 
    }] 
  };

  const budgetVsExpenseData = { 
    labels: ['Budget', 'Total Expense'], 
    datasets: [{ 
      data: [budget, expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)],
       backgroundColor: ['#36A2EB', '#FF6384'] 
      }
    ] 
  };


  const monthlyExpenseData = { 
    labels: months, 
    datasets: [{ 
      label: 'Monthly Expenses', 
      data: monthlyExpense, 
      backgroundColor: '#4BC0C0' 
    }] 
  };

  const top5CategoryData = { 
    labels: top5Categories.map(c => c.category), 
    datasets: [{ 
      data: top5Categories.map(c => c.amount), 
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] 
    }] 
  };

  return (
    <div style={{backgroundColor: "#f4f4f9"}}>
      <button className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBack /> Back
      </button>

      <div className='expense-chart-container'>
        <div className='chart-wrapper'>
          <h2>Expense Distribution by Category</h2>
          <Pie data={categoryData} />
        </div>

        <div className='chart-wrapper'>
          <h2>Expense Distribution by Payment Method</h2>
          <Pie data={paymentData} />
        </div>

        <div className='chart-wrapper'>
          <h2>Top 5 Expense Categories</h2>
          <Doughnut data={top5CategoryData} />
        </div>

        <div className='chart-wrapper'>
          <h2>Budget vs Total Expense</h2>
          <Bar data={budgetVsExpenseData} />
        </div>

        <div className='chart-wrapper'>
          <h2>Daily Expense Trend</h2>
          <Line data={dailyData} />
        </div>

        <div className='chart-wrapper'>
          <h2>Monthly Expense Trend</h2>
          <Bar data={monthlyExpenseData} />
        </div>
        
      </div>
    </div>
  );
};

export default ExpenseCharts;
