
const baseurl = process.env.REACT_APP_BACKEND_URL


const api = { 
    addExpense : () => { return `${baseurl}/api/add/expense`},
    getExpense : () => { return `${baseurl}/api/get/expense`},
    registerUser: () => {return `${baseurl}/api/register`},
    loginUser: () => {return `${baseurl}/api/login`},
    editExpense: () => {return `${baseurl}/api/edit/expense`},
    deleteExpense: () => {return `${baseurl}/api/delete/expense`},
    addBudget: () => {return `${baseurl}/api/set-budget`},
    getBudget: () => {return `${baseurl}/api/get-budget`}
}

export default api