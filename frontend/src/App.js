import React from 'react';
import './App.css';
import { Route, Routes, Navigate} from 'react-router-dom';
// import httpInstance from './httpUtility';
import Home from './components/Home';
import Landing from './components/LandingPage/Landing';
import Toast from './components/toast/Toast'
import Header from './components/header/Header'
import Login from './components/Login/Login';
import ExpenseCharts from './components/Analytics/ExpenseCharts';

function App() {
  const paths = [
    {path: "/", element : <Landing /> , authRequired : false},
    {path: "/login", element : <Login /> , authRequired : false},
    {path: "/u/activity", element : <Home /> , authRequired : false},
    {path: "/u/dashboard", element : <ExpenseCharts /> , authRequired : false},

    // Navigate all unknown pages to Home Page:
    {path: "*", element : <Navigate to="/" />, authRequired : false}
  ]

  return (
    <div className="App">
      <Header /> 
      <Toast />
      <Routes>
        {paths && 
          paths.map((routes, index) => (
            <Route path={routes.path} element={routes.element} key={`Route_dir_${index}`}/>
          ))
        }
      </Routes>
    </div>
  );
}

export default App;
