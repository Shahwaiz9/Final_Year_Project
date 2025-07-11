import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { Button } from "@mui/material";

const columns = [
  { id: "email", label: "Email" },
  { id: "CompanyName", label: "Company Name" },
  { id: "CompanyAddress", label: "Company Address" },
  { id: "contact", label: "Contact" },
  { id: "accountStatus", label: "Status" },
  { id: "block", label: "Action" },
];

function createData(email, CompanyName, CompanyAddress, contact, accountStatus, block) {
  return { email, CompanyName, CompanyAddress, contact, accountStatus, block };
}

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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:5000/admin/${type}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setData(response.data.vendors);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:5000/admin/vendor/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Failed to block/unblock vendor:", error);
    }
  };

  const blockButton = (id, status) => {
    const isBlocked = status === "Suspended";

    return (
      <Button
        sx={{
          backgroundColor: isBlocked ? "green" : "red",
          color: "white",
          maxHeight: "3em",
          fontSize: "0.8rem",
          "@media (max-width: 1000px)": {
            fontSize: "0.5rem",
          },
          "&:hover": {
            backgroundColor: isBlocked ? "#006400" : "#8B0000",
          },
        }}
        variant="contained"
        onClick={() => handleBlock(id)}
      >
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    );
  };

  React.useEffect(() => {
    fetchData();
  }, [type]);

  React.useEffect(() => {
    const newRows = data.map((vendor) =>
      createData(
        vendor.email,
        vendor.CompanyName,
        vendor.CompanyAddress,
        vendor.contact,
        vendor.accountStatus,
        blockButton(vendor._id, vendor.accountStatus)
      )
    );
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
        "@media (max-width: 400px)": {
          width: "95vw",
          marginLeft: "2.5vw",
        },
      }}
    >
      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
          Loading...
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
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        top: 57,
                        textAlign: "center",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                      sx={{
                        fontSize: "1rem",
                        backgroundColor: "black",
                        color: "white",
                        "@media (max-width: 600px)": {
                          fontSize: "0.7rem",
                          padding: "4px",
                        },
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

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
                            style={{
                              color: "black",
                              textAlign: "center",
                              wordWrap: "break-word",
                              wordBreak: "break-word",
                              maxWidth: "200px",
                            }}
                            sx={{
                              fontSize: "0.95rem",
                              "@media (max-width: 600px)": {
                                fontSize: "0.7rem",
                                padding: "4px",
                                maxWidth: "120px",
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
              "& .MuiTablePagination-toolbar": {
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                "@media (max-width: 500px)": {
                  flexDirection: "column",
                  alignItems: "flex-start",
                },
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: "0.8rem",
                "@media (max-width: 500px)": {
                  fontSize: "0.7rem",
                },
              },
              "& .MuiTablePagination-actions": {
                display: "flex",
                alignItems: "center",
                "@media (max-width: 500px)": {
                  alignSelf: "flex-end",
                },
              },
            }}
          />
        </>
      )}
    </Paper>
  );
}
