"use client"

import { useState, useEffect } from "react"
import { Typography, CircularProgress, Alert, Paper, Grid } from "@mui/material"

const MonthlyReport = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://localhost:5000/admin/monthly-report", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      const data = await res.json()
      if (data.success) {
        setReport(data)
      } else {
        setError(data.message || "Failed to fetch monthly report")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const metricCard = (label, value, color) => (
    <Paper
      style={{
        backgroundColor: "#2b2f3e",
        color: "#fff",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        minWidth: "200px",
      }}
    >
      <Typography
        variant="subtitle1"
        style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography variant="h4" style={{ color, fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
        <CircularProgress size={60} style={{ color: "#2196f3" }} />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity="error" style={{ backgroundColor: "#d50000", color: "white" }}>
        {error}
      </Alert>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", width: "80vw", height: "100vh" }}>
      <Typography
        variant="h4"
        component="h1"
        className="mb-6 font-bold"
        style={{ color: "rgba(255, 255, 255, 0.95)", fontFamily: "Montserrat, sans-serif" }}
      >
        Monthly Summary Report
      </Typography>

      <Grid container spacing={4} justifyContent="center" style={{ marginTop: "30px", width: "100%" }}>
        <Grid item xs={12} sm={6} md={3}>
          {metricCard("Total Orders", report.totalOrders, "#2196f3")}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {metricCard("New Users", report.newUsers, "#ff9800")}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {metricCard("Total Sales", `Rs. ${report.totalSales.toFixed(2)}`, "#4caf50")}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {metricCard("Pending Orders", report.pendingOrders, "#f44336")}
        </Grid>
      </Grid>
    </div>
  )
}

export default MonthlyReport
