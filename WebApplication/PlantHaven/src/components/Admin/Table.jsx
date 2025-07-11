import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const columns = [
  { id: "name", label: "Name", minWidth: "2em" },
  { id: "email", label: "Email", minWidth: "2em" },
];

function createData(name, email) {
  return { name, email };
}

// eslint-disable-next-line react/prop-types
export default function ColumnGroupingTable({ type }) {
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`http://localhost:5000/admin/${type}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const result = response.data;
      setData(result.users);  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [type]);


  React.useEffect(() => {
    const newRows = data.map((user) => createData(user.name, user.email));
    setRows(newRows);
  }, [data]);

  return (
    <Paper
      sx={{
        width: "80vw",
        backgroundColor: "gray",
        color: "white",
        overflow: "hidden",
        borderRadius: "10px",
        marginLeft: "20px",
        '@media (max-width: 400px)': {
          width: '95vw',
          marginLeft: '2.5vw',
        },
      }}
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <>
          <TableContainer
            sx={{
              maxHeight: 500,
              maxWidth: "100%",
              margin: "auto",
              borderRadius: "10px",
              backgroundColor: "gray",
              overflowX: "auto",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableRow
                sx={{
                  backgroundColor: "black",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      top: 57,
                      minWidth: column.minWidth,
                      textAlign: "center",
                      color: "white",
                      fontSize: "1rem",
                    }}
                    sx={{
                      '@media (max-width: 400px)': {
                        fontSize: "0.75rem",
                        padding: "6px",
                      },
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>

              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{ color: "black", textAlign: "center" }}
                            sx={{
                              fontSize: "0.95rem",
                              '@media (max-width: 400px)': {
                                fontSize: "0.7rem",
                                padding: "4px",
                              },
                            }}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
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
            sx={{
              color: "white",
              backgroundColor: "gray",
              fontSize: "0.9rem",
              '& .MuiTablePagination-toolbar': {
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                '@media (max-width: 500px)': {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.5em',
                },
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '0.8rem',
                '@media (max-width: 500px)': {
                  fontSize: '0.7rem',
                },
              },
              '& .MuiTablePagination-actions': {
                display: 'flex',
                alignItems: 'center',
                '@media (max-width: 500px)': {
                  alignSelf: 'flex-end',
                  marginTop: '0.5em',
                },
              },
            }}
          />
        </>
      )}
    </Paper>
  );
}
