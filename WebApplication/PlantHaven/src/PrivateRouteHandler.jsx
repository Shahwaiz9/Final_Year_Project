import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

function PrivateRouteHandler({setIsAuth}) {
    const location=useLocation();
    const navigate=useNavigate();
    
    useEffect(()=>{
        if(localStorage.getItem('authToken')){
            setIsAuth(true);
            if(location.pathname==='/login' ||location.pathname==='/signup/user' ||location.pathname==='/login/user'){
                navigate('/',{replace:false})
            }
        }

    },[location,navigate,setIsAuth]);

  return (
    null
  )
}

export default PrivateRouteHandler