import React from 'react';
import { useNavigate } from 'react-router-dom';

function VendorHomePage({ setIsAuthenticated }) {
    const navigate = useNavigate(); 

    const logout = () => {
        console.log("clicked");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);  
        navigate("/"); 
    };

    return (
        <>
            <div>
                This is the vendor homepage
            </div>
            <button onClick={logout}>Logout</button>
        </>
    );
}

export default VendorHomePage;
