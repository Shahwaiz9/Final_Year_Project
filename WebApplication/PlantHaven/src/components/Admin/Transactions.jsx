"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material"

import MonthlyReport from "./MonthlyReport"

const TransactionsReport = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("authToken")

      const response = await fetch("http://localhost:5000/admin/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        // Apply filtering:
        const filteredOrders = data.orders.filter((order) => {
          if (order.paymentMethod === "cod") {
            return order.status === "Delivered"
          }
          return true
        })

        setOrders(filteredOrders)
      } else {
        setError(data.message || "Failed to fetch transactions")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00"
      case "Processing":
        return "#1976d2"
      case "Delivered":
        return "#388e3c"
      default:
        return "#757575"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
        <CircularProgress size={60} style={{ color: "#2196f3" }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-4">
        <Alert severity="error" style={{ backgroundColor: "#d50000", color: "white" }}>
          {error}
        </Alert>
      </div>
    )
  }

  return (
  <div className="flex flex-col items-center p-6 main-container">
   <MonthlyReport/>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", width: "80vw", height: "100vh" }}>
      <Typography
        variant="h4"
        component="h1"
        className="mb-6 font-bold"
        style={{ color: "rgba(255, 255, 255, 0.95)", fontFamily: "Montserrat, sans-serif" }}
      >
        Transactions Report
      </Typography>

      <TableContainer
        component={Paper}
        className="overflow-x-auto"
        style={{
          backgroundColor: "#2b2f3e",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "15px",
          marginTop: "20px",
        }}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#263043" }}>
            <TableRow>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Customer</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Product</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Total Amount</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Payment Method</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Status</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Vendor Contact</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}>
                {/* Customer */}
                <TableCell>
                  <div>
                    <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>
                      {order.user?.name || "N/A"}
                    </Typography>
                    <Typography variant="caption" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      {order.user?.email || "N/A"}
                    </Typography>
                  </div>
                </TableCell>

                {/* Product */}
                <TableCell>
                  <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>
                    {order.product?.productname || "N/A"}
                  </Typography>
                  <Typography variant="caption" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Rs. {order.product?.price || "N/A"}
                  </Typography>
                </TableCell>

                {/* Total Amount */}
                <TableCell style={{ color: "#4caf50", fontWeight: 600 }}>
                  Rs. {order.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>

                {/* Payment Method */}
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{ color: "rgba(255, 255, 255, 0.8)", textTransform: "capitalize" }}
                  >
                    {order.paymentMethod}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                {/* Vendor Contact */}
                <TableCell>
                  <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {order.product?.vendor?.contact || "N/A"}
                  </Typography>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {formatDate(order.createdAt)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="h6" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            No transactions found
          </Typography>
        </div>
      )}
    </div>
  
  
  </div>
  )
}

export default TransactionsReport
