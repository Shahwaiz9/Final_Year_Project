import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from './Table.jsx'
function AdminCustomers()  {  

    return (<div style={{color:"white", display:"flex", alignItems:"center",justifyContent:"center"}}>
        <Table type='customers'/>
    </div>)
}
export default AdminCustomers