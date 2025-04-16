import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TelecallerPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [leads, setLeads] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editAddress, setEditAddress] = useState('');
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await axios.get('https://crm-telecaller.onrender.com/api/leads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, [token]);

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Phone number must be exactly 10 digits and contain only numbers');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateEmail = (email) => {
    // Basic email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleAddLead = async () => {
    if (!validatePhone(newLead.phone) || !validateEmail(newLead.email)) return;
    try {
      const { data } = await axios.post('https://crm-telecaller.onrender.com/api/leads', {
        ...newLead,
        telecaller: user.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads([...leads, data]);
      setOpenAddDialog(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };


  const handleUpdateAddress = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/leads/${selectedLead._id}/address`,
        { address: editAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(leads.map(lead => 
        lead._id === data._id ? data : lead
      ));
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      // Validate required fields
      if (!status) {
        console.error('Status is required');
        return;
      }
      
      // Only require response for connected/not_connected statuses
      if ((status === 'connected' || status === 'not_connected') && !response) {
        console.error('Response is required for this status');
        return;
      }

      const { data: updatedLead } = await axios.put(
        `http://localhost:5000/api/leads/${selectedLead._id}/status`,
        { 
          status, 
          response: status === 'new' ? null : response 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the leads list with the new data from backend
      setLeads(leads.map(lead => 
        lead._id === updatedLead._id ? updatedLead : lead
      ));
      
      setOpenStatusDialog(false);
      setStatus('');
      setResponse('');
    } catch (error) {
      console.error('Error updating status:', error.response?.data?.message || error.message);
    }
  };

  const handleDeleteLead = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/leads/${selectedLead._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(leads.filter(lead => lead._id !== selectedLead._id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return 'New';
      case 'connected': return 'Connected';
      case 'not_connected': return 'Not Connected';
      default: return status;
    }
  };

  const getResponseLabel = (response) => {
    if (!response) return 'N/A';
    switch (response) {
      case 'discussed': return 'Discussed';
      case 'callback': return 'Callback';
      case 'interested': return 'Interested';
      case 'busy': return 'Busy';
      case 'rnr': return 'RNR';
      case 'switched_off': return 'Switched Off';
      default: return response;
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, marginRight: 3, marginTop: 1.7 }}>
        <Typography variant="h4">Customer Leads</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Response</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.address}</TableCell>
                <TableCell>{getStatusLabel(lead.status)}</TableCell>
                <TableCell>{getResponseLabel(lead.response)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setSelectedLead(lead);
                    setEditAddress(lead.address);
                    setOpenEditDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedLead(lead);
                    setStatus(lead.status);
                    setResponse(lead.response || '');
                    setOpenStatusDialog(true);
                  }}>
                    <Typography variant="body2" sx={{ color: '#C71585' }}>Update Status</Typography>
                  </IconButton>
                  <IconButton onClick={() => {
                    
                    setSelectedLead(lead);
                    setOpenDeleteDialog(true);
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Lead Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Customer Lead</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            required
            value={newLead.name}
            onChange={(e) => setNewLead({...newLead, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            required
            type="email"
            value={newLead.email}
            onChange={(e) => setNewLead({...newLead, email: e.target.value})}
            error={Boolean(emailError)} // Highlight error if email is invalid
            helperText={emailError}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            required
            value={newLead.phone}
            onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
            error={Boolean(phoneError)} // Highlight error if phone is invalid
            helperText={phoneError}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            required
            value={newLead.address}
            onChange={(e) => setNewLead({...newLead, address: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddLead}
            disabled={!newLead.name || !newLead.email || !newLead.phone || !newLead.address}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateAddress}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Update Call Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant={status === 'new' ? 'contained' : 'outlined'}
              onClick={() => {
                setStatus('new');
                setResponse('');
              }}
            >
              New
            </Button>
            <Button
              variant={status === 'connected' ? 'contained' : 'outlined'}
              onClick={() => {
                setStatus('connected');
                setResponse(selectedLead.status === 'connected' ? selectedLead.response : '');
              }}
            >
              Connected
            </Button>
            <Button
              variant={status === 'not_connected' ? 'contained' : 'outlined'}
              onClick={() => {
                setStatus('not_connected');
                setResponse(selectedLead.status === 'not_connected' ? selectedLead.response : '');
              }}
            >
              Not Connected
            </Button>
          </Box>
          
          {status === 'connected' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Response</InputLabel>
              <Select
                value={response}
                label="Response"
                onChange={(e) => setResponse(e.target.value)}
              >
                <MenuItem value="discussed">Discussed</MenuItem>
                <MenuItem value="callback">Callback</MenuItem>
                <MenuItem value="interested">Interested</MenuItem>
              </Select>
            </FormControl>
          )}
          
          {status === 'not_connected' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Response</InputLabel>
              <Select
                value={response}
                label="Response"
                onChange={(e) => setResponse(e.target.value)}
              >
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="rnr">RNR (Ring No Response)</MenuItem>
                <MenuItem value="switched_off">Switched Off</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus}
            disabled={!status || ((status === 'connected' || status === 'not_connected') && !response)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this lead?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteLead} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TelecallerPage;
