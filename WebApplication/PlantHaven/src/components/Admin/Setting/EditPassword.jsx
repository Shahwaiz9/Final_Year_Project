"use client"

import { useState } from "react"
import {
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material"

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChangePassword = async () => {
    setLoading(true)
    setSuccess("")
    setError("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://localhost:5000/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Password updated successfully.")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(data.message || "Failed to update password.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
      <Paper
        elevation={4}
        style={{
          padding: "30px",
          width: "500px",
          backgroundColor: "#2b2f3e",
          color: "#fff",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h5" gutterBottom style={{ fontFamily: "Montserrat", color: "#fff" }}>
          Update Admin Password
        </Typography>

        {success && <Alert severity="success" style={{ marginBottom: "20px" }}>{success}</Alert>}
        {error && <Alert severity="error" style={{ marginBottom: "20px" }}>{error}</Alert>}

        <TextField
          label="Current Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{ style: { color: "#fff" } }}
          InputLabelProps={{ style: { color: "#aaa" } }}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{ style: { color: "#fff" } }}
          InputLabelProps={{ style: { color: "#aaa" } }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{ style: { color: "#fff" } }}
          InputLabelProps={{ style: { color: "#aaa" } }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px", fontWeight: 600 }}
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "Update Password"}
        </Button>
      </Paper>
    </div>
  )
}

export default SettingsPage
