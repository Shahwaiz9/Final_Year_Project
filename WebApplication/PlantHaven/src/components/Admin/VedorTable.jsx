import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
const columns = [
//   { id: 'name', label: 'Name', minWidth: 170 },
  {id:'email', label:'Email',minWidth:170},
  {id:'CompanyName',label:'Company Name',minWidth:170},
    {id:'CompanyAddress',label:'Company Address',minWidth:170},
    {id:'contact',label:'Contact',minWidth:170},

];

function createData( email,CompanyName,CompanyAddress,contact) {
 
  return {  email,CompanyName,CompanyAddress,contact };
}



export default function ColumnGroupingTable({type}) {
  const [data,setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows,setRows] = React.useState([]); 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/${type}`);
        const result = response.data;
        setData(result.vendors);
        console.log(result.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    
  },[]);
  // Separate effect to update rows whenever data changes
React.useEffect(() => {
  const newRows = data.map(user => createData( user.email,user.CompanyName,user.CompanyAddress,user.contact));
  setRows(newRows);
}, [data]); // this depends on data

  return (
<Paper sx={{ width: '80vw', backgroundColor: 'gray', color: 'white', overflow: 'hidden', borderRadius: '10px',marginLeft:'20px' }}>
<TableContainer sx={{ maxHeight: 500 ,maxWidth: '100%', margin: 'auto', borderRadius: '10px',backgroundColor: 'gray'}}>
        <Table stickyHeader aria-label="sticky table">
          
            <TableRow  sx={{ backgroundColor: 'black',position: 'sticky', top: 0, zIndex: 1  }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth,textAlign:'center', color:'white' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} style={{ color: 'black',textAlign:'center' }}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ color: 'white', backgroundColor: 'gray' }}
      />
    </Paper>
  );
}
