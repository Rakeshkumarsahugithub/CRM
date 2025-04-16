import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalTelecallers: 0,
    totalLeads: 0,
    connectedLeads: 0
  });
  const [trends, setTrends] = useState([]);
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('https://crm-telecaller.onrender.com/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(statsRes.data);

        const trendsRes = await axios.get('https://crm-telecaller.onrender.com/api/dashboard/trends', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTrends(trendsRes.data);

        const callsRes = await axios.get('https://crm-telecaller.onrender.com/api/dashboard/calls', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCalls(callsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [token]);

  const chartData = {
    labels: trends.map(t => t._id),
    datasets: [
      {
        label: 'Calls per Day',
        data: trends.map(t => t.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Call Trends (Last 7 Days)',
      },
    },
  };

  const getResponseLabel = (response) => {
    switch (response) {
      case 'discussed': return 'Discussed';
      case 'callback': return 'Callback';
      case 'interested': return 'Interested';
      case 'busy': return 'Busy';
      case 'rnr': return 'RNR';
      case 'switched_off': return 'Switched Off';
      default: return 'N/A';
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Telecallers</Typography>
            <Typography variant="h4">{stats.totalTelecallers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Leads</Typography>
            <Typography variant="h4">{stats.totalLeads}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Connected Leads</Typography>
            <Typography variant="h4">{stats.connectedLeads}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Call Trends</Typography>
          <Box sx={{ height: '300px' }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Connected Calls</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Telecaller</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call._id}>
                  <TableCell>{call.name}</TableCell>
                  <TableCell>{call.telecaller?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(call.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>{getResponseLabel(call.response)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
