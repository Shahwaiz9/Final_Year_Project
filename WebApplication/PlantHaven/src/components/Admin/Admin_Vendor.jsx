import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorTable from './VedorTable.jsx';
function AdminCustomers()  {  

    return (<div style={{color:"white", display:"flex", alignItems:"center",justifyContent:"center"}}>
        <VendorTable type='vendor'/>
    </div>)
}
export default AdminCustomers