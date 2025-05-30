import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


import WidgetsDropdown from '../widgets/WidgetsDropdown'

export default function Dashboard() {
  
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);


  return (
    <>
      <WidgetsDropdown className="mb-4" />
     
      
    </>
  )
}


