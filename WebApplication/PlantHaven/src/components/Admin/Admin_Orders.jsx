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

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/admin/orders")
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        setError(data.message || "Failed to fetch orders")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning"
      case "Processing":
        return "info"
      case "Delivered":
        return "success"
      default:
        return "default"
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
    <div  style={{display:"flex", flexDirection:"column", alignItems:"center", padding: "20px", width: "80vw",height:"100vh"}}>
      <Typography
        variant="h4"
        component="h1"
        className="mb-6 font-bold"
        style={{ color: "rgba(255, 255, 255, 0.95)", fontFamily: "Montserrat, sans-serif" }}
      >
        Orders Management
      </Typography>

      <TableContainer
        component={Paper}
        className="overflow-x-auto"
        style={{
          backgroundColor: "#2b2f3e",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "15px",
          marginTop:"20px"
        }}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#263043" }}>
            <TableRow>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Order ID</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Customer</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Product</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Quantity</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Total Amount</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Status</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Payment Method</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Address</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Contact</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Vendor Contact</TableCell>
              <TableCell style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}>Order Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                className="transition-colors duration-200"
                style={{
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <TableCell style={{ color: "rgba(255, 255, 255, 0.8)", fontFamily: "monospace", fontSize: "0.875rem" }}>
                  {order._id.slice(-8)}
                </TableCell>
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
                <TableCell>
                  <div>
                    <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>
                      {order.product?.productname || "N/A"}
                    </Typography>
                    <Typography variant="caption" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Rs. {order.product?.price || "N/A"}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.quantity}
                    size="small"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgba(33, 150, 243, 0.2)",
                      color: "#2196f3",
                      borderColor: "#2196f3",
                    }}
                  />
                </TableCell>
                <TableCell style={{ color: "#4caf50", fontWeight: 600 }}>
                  Rs. {order.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    style={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{ color: "rgba(255, 255, 255, 0.8)", textTransform: "capitalize" }}
                  >
                    {order.paymentMethod}
                  </Typography>
                </TableCell>
                <TableCell>
                  <div style={{ maxWidth: "200px" }}>
                    <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                      {order.address}
                    </Typography>
                    <Typography variant="caption" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      {order.city}, {order.postalCode}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                    {order.contactInfo}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                    {order.product?.vendor?.contact || "N/A"}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
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
            No orders found
          </Typography>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
