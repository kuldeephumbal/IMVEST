import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Edit,
    Delete,
    Visibility,
    CheckCircle,
    Cancel,
    Search,
    VerifiedUser,
    PendingActions,
    Close,
    DocumentScanner
} from '@mui/icons-material';
import { clientAPI } from '../services/api';

const Users = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [changeStatusMode, setChangeStatusMode] = useState(false);

    // Fetch all clients on component mount
    useEffect(() => {
        fetchClients();
    }, []);

    // Function to fetch all clients
    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await clientAPI.getAllClients();
            console.log('Clients data:', response);
            setClients(response.clients || response || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients. Please try again.');
            setLoading(false);
            
            // If API fails, use mock data for development
            setClients([
                {
                    _id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    documents: ['driverLicense', 'proofOfAddress']
                },
                {
                    _id: '2',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane@example.com',
                    status: 'approved',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    documents: ['driverLicense', 'ssnCard', 'proofOfAddress']
                },
                {
                    _id: '3',
                    firstName: 'Mike',
                    lastName: 'Johnson',
                    email: 'mike@example.com',
                    status: 'rejected',
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                    documents: ['driverLicense']
                },
                {
                    _id: '4',
                    firstName: 'Sarah',
                    lastName: 'Wilson',
                    email: 'sarah@example.com',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 259200000).toISOString(),
                    documents: ['ssnCard', 'proofOfAddress']
                }
            ]);
        }
    };

    // Function to fetch client documents
    const fetchClientDocuments = async (clientId) => {
        try {
            setLoadingDocuments(true);
            const response = await clientAPI.getClientDocuments(clientId);
            console.log('Client documents:', response);
            
            // Properly parse and format the document data
            let formattedDocs = [];
            if (response && response.documents && Array.isArray(response.documents)) {
                formattedDocs = response.documents;
            } else if (response && Array.isArray(response)) {
                formattedDocs = response;
            }
            
            setDocuments(formattedDocs);
            setLoadingDocuments(false);
        } catch (err) {
            console.error('Error fetching client documents:', err);
            setLoadingDocuments(false);
            
            // Mock documents data for development
            const mockDocs = [
                { type: 'driverLicense', url: 'https://via.placeholder.com/300x200?text=Driver+License', name: 'Driver License' },
                { type: 'ssnCard', url: 'https://via.placeholder.com/300x200?text=SSN+Card', name: 'SSN Card' },
                { type: 'proofOfAddress', url: 'https://via.placeholder.com/300x200?text=Proof+of+Address', name: 'Proof of Address' }
            ];
            setDocuments(mockDocs);
        }
    };

    // Function to open client details dialog
    const handleViewDetails = async (client, changeStatus = false) => {
        // Set selected client
        setSelectedClient(client);
        setDetailsOpen(true);
        setChangeStatusMode(changeStatus);
        
        // Reset documents and set active tab to first tab
        setDocuments([]);
        setActiveTab(0);
        
        console.log('Viewing client details:', client);
        
        // Fetch client documents if ID is available
        if (client && client._id) {
            await fetchClientDocuments(client._id);
        } else {
            console.warn('No client ID available for fetching documents');
            
            // Use mock document data based on client's document list
            if (client && client.documents && Array.isArray(client.documents)) {
                const mockDocs = client.documents.map(docType => {
                    return {
                        type: docType,
                        url: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                            docType === 'driverLicense' ? 'Driver License' : 
                            docType === 'ssnCard' ? 'SSN Card' : 
                            docType === 'proofOfAddress' ? 'Proof of Address' : docType
                        )}`,
                        name: docType === 'driverLicense' ? 'Driver License' : 
                              docType === 'ssnCard' ? 'SSN Card' : 
                              docType === 'proofOfAddress' ? 'Proof of Address' : 
                              'Document'
                    };
                });
                setDocuments(mockDocs);
            }
        }
    };

    // Function to close client details dialog
    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setSelectedClient(null);
        setDocuments([]);
        setActiveTab(0);
        setChangeStatusMode(false);
    };

    // Function to handle tab change in client details dialog
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Function to handle editing a client
    const handleEditClient = (client) => {
        // In a real app, you would navigate to an edit form or open an edit dialog
        // For this example, we'll just show a notification
        setNotification({
            open: true,
            message: `Edit functionality would open for ${client.firstName} ${client.lastName}`,
            type: 'info'
        });
    };

    // Function to handle deleting a client
    const handleDeleteClient = (clientId) => {
        const client = clients.find(c => c._id === clientId);
        setClientToDelete(client);
        setDeleteDialogOpen(true);
    };

    // Function to confirm client deletion
    const confirmDeleteClient = async () => {
        if (!clientToDelete) return;
        
        try {
            setDeleteLoading(true);
            // In a real app, you would call an API endpoint like:
            // await clientAPI.deleteClient(clientToDelete._id);
            console.log('Deleting client:', clientToDelete);
            
            // Update the client list
            setClients(clients.filter(client => client._id !== clientToDelete._id));
            
            setNotification({
                open: true,
                message: `Client ${clientToDelete.firstName} ${clientToDelete.lastName} deleted successfully`,
                type: 'success'
            });
            
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setClientToDelete(null);
        } catch (err) {
            console.error('Error deleting client:', err);
            setNotification({
                open: true,
                message: 'Failed to delete client',
                type: 'error'
            });
            setDeleteLoading(false);
        }
    };

    // Function to update client status (approve/reject)
    const handleUpdateStatus = async (clientId, status) => {
        try {
            setStatusUpdateLoading(true);
            const response = await clientAPI.updateClientStatus(clientId, status);
            console.log('Status update response:', response);
            
            // Update the client in the list
            setClients(clients.map(client => 
                client._id === clientId ? { ...client, status } : client
            ));
            
            setNotification({
                open: true,
                message: `Client ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
                type: 'success'
            });
            
            // Close dialog if open
            if (detailsOpen && selectedClient && selectedClient._id === clientId) {
                setSelectedClient({ ...selectedClient, status });
            }
            
            setStatusUpdateLoading(false);
        } catch (err) {
            console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} client:`, err);
            setNotification({
                open: true,
                message: `Failed to ${status === 'approved' ? 'approve' : 'reject'} client`,
                type: 'error'
            });
            setStatusUpdateLoading(false);
        }
    };

    // Function to handle search
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter clients based on search term
    const filteredClients = clients.filter(client => {
        const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase();
        const email = (client.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || email.includes(searchLower);
    });

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            {/* Notification snackbar */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={() => setNotification({...notification, open: false})}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    severity={notification.type}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setNotification({...notification, open: false})}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="primary">
                    Home / Users
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Users Management
            </Typography>

            <Paper
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 4
                }}
            >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            All Users
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your users and their permissions
                        </Typography>
                    </div>

                    <TextField
                        placeholder="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="error">{error}</Typography>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            sx={{ mt: 2 }}
                            onClick={fetchClients}
                        >
                            Retry
                        </Button>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Date Registered</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Documents</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1">No users found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClients.map((client) => (
                                        <TableRow key={client._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                                        {client.firstName?.charAt(0) || ''}
                                                        {client.lastName?.charAt(0) || ''}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {client.firstName} {client.lastName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {client.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(client.createdAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={client.status === 'approved' ? 'Approved' : 
                                                           client.status === 'rejected' ? 'Rejected' : 'Pending'}
                                                    size="small"
                                                    color={client.status === 'approved' ? 'success' : 
                                                           client.status === 'rejected' ? 'error' : 'warning'}
                                                    icon={client.status === 'approved' ? <CheckCircle fontSize="small" /> : 
                                                          client.status === 'rejected' ? <Cancel fontSize="small" /> : 
                                                          <PendingActions fontSize="small" />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${client.documents?.length || 0} docs`}
                                                    size="small"
                                                    variant="outlined"
                                                    icon={<DocumentScanner fontSize="small" />}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => handleViewDetails(client)}
                                                    title="View Details"
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                                
                                                {client.status === 'pending' && (
                                                    <>
                                                        <IconButton 
                                                            size="small" 
                                                            color="success"
                                                            onClick={() => handleUpdateStatus(client._id, 'approved')}
                                                            disabled={statusUpdateLoading}
                                                            title="Approve"
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            color="error"
                                                            onClick={() => handleUpdateStatus(client._id, 'rejected')}
                                                            disabled={statusUpdateLoading}
                                                            title="Reject"
                                                        >
                                                            <Cancel fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                )}
                                                
                                                {client.status !== 'pending' && (
                                                    <IconButton 
                                                        size="small" 
                                                        color="primary"
                                                        onClick={() => handleViewDetails(client, true)}
                                                        title="Change Status"
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                )}
                                                
                                                {client.status === 'approved' && (
                                                    <>
                                                        <IconButton 
                                                            size="small" 
                                                            color="primary"
                                                            onClick={() => handleEditClient(client)}
                                                            title="Edit User"
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            color="error"
                                                            onClick={() => handleDeleteClient(client._id)}
                                                            title="Delete User"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Client Details Dialog */}
            <Dialog 
                open={detailsOpen} 
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                {selectedClient && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    User Details
                                    <Chip
                                        label={selectedClient.status === 'approved' ? 'Approved' : 
                                               selectedClient.status === 'rejected' ? 'Rejected' : 'Pending'}
                                        size="small"
                                        color={selectedClient.status === 'approved' ? 'success' : 
                                               selectedClient.status === 'rejected' ? 'error' : 'warning'}
                                        sx={{ ml: 2 }}
                                    />
                                </Typography>
                                <IconButton onClick={handleCloseDetails}>
                                    <Close />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            {/* Error boundary with fallback UI */}
                            <Box sx={{ position: 'relative' }}>
                                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                                    <Tab label="Profile" />
                                    <Tab label="Documents" />
                                </Tabs>
</Box>
                                {/* Profile Tab */}
                                {activeTab === 0 && (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="First Name" value={selectedClient.firstName || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Last Name" value={selectedClient.lastName || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Email" value={selectedClient.email || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Phone" value={selectedClient.phone || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Date of Birth" value={selectedClient.dateOfBirth ? formatDate(selectedClient.dateOfBirth) : ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="SSN" value={selectedClient.ssn || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label="Address" value={selectedClient.address ? `${selectedClient.address.street}, ${selectedClient.address.city}, ${selectedClient.address.state}, ${selectedClient.address.zipCode}, ${selectedClient.address.country}` : ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Status" value={selectedClient.status} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="KYC Status" value={selectedClient.kycStatus || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Investment Plan" value={selectedClient.investmentPlan || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Initial Investment" value={selectedClient.initialInvestment || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField label="Total Invested" value={selectedClient.totalInvested || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField label="Total Earned" value={selectedClient.totalEarned || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField label="Current Balance" value={selectedClient.currentBalance || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Start Date" value={selectedClient.startDate ? formatDate(selectedClient.startDate) : ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Maturity Date" value={selectedClient.maturityDate ? formatDate(selectedClient.maturityDate) : ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Referral Code" value={selectedClient.referralCode || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Two Factor Enabled" value={selectedClient.twoFactorEnabled ? 'Yes' : 'No'} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Last Login" value={selectedClient.lastLogin ? formatDate(selectedClient.lastLogin) : ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Bank Name" value={selectedClient.bankAccount?.bankName || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Account Number" value={selectedClient.bankAccount?.accountNumber || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Routing Number" value={selectedClient.bankAccount?.routingNumber || ''} fullWidth InputProps={{readOnly: true}} variant="outlined" margin="normal" />
                                        </Grid>
                                    </Grid>
                                )}

                            {/* Documents Tab */}
                            {activeTab === 1 && (
                                (() => {
                                    console.log('Rendering documents tab, documents:', documents);
                                    return loadingDocuments ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : documents.length === 0 ? (
                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="body1">No documents found</Typography>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={3}>
                                            {documents.map((doc, index) => {
                                                console.log('Rendering document:', doc);
                                                
                                                // Create a safe image URL with fallback
                                                const imageUrl = doc.url || 
                                                    `https://via.placeholder.com/300x200?text=${encodeURIComponent(doc.name || doc.type || 'Document')}`;
                                                
                                                const documentName = doc.name || 
                                                    (doc.type === 'driverLicense' ? 'Driver License' : 
                                                    doc.type === 'ssnCard' ? 'SSN Card' : 
                                                    doc.type === 'proofOfAddress' ? 'Proof of Address' : 
                                                    'Document');
                                                
                                                return (
                                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                                        <Card elevation={3}>
                                                            <Box sx={{ position: 'relative', height: 200, bgcolor: '#f5f5f5' }}>
                                                                <CardMedia
                                                                    component="img"
                                                                    height="200"
                                                                    image={imageUrl}
                                                                    alt={documentName}
                                                                    sx={{ 
                                                                        objectFit: 'contain',
                                                                        p: 1
                                                                    }}
                                                                    onError={(e) => {
                                                                        console.log('Image load error, using fallback');
                                                                        // Handle image loading errors
                                                                        e.target.onerror = null;
                                                                        e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(documentName)}`;
                                                                    }}
                                                                />
                                                            </Box>
                                                            <CardContent>
                                                                <Typography variant="subtitle1" component="div" gutterBottom>
                                                                    {documentName}
                                                                </Typography>
                                                                <Button 
                                                                    variant="outlined" 
                                                                    size="small" 
                                                                    fullWidth
                                                                    sx={{ mt: 1 }}
                                                                    onClick={() => window.open(imageUrl, '_blank')}
                                                                    startIcon={<Visibility />}
                                                                >
                                                                    View
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    );
                                })()
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails} color="primary">
                                Close
                            </Button>
                            
                            {/* Show approve/reject buttons for pending clients */}
                            {selectedClient.status === 'pending' && !changeStatusMode && (
                                <>
                                    <Button 
                                        onClick={() => handleUpdateStatus(selectedClient._id, 'rejected')}
                                        color="error"
                                        variant="contained"
                                        disabled={statusUpdateLoading}
                                        startIcon={statusUpdateLoading ? <CircularProgress size={20} /> : <Cancel />}
                                    >
                                        Reject
                                    </Button>
                                    <Button 
                                        onClick={() => handleUpdateStatus(selectedClient._id, 'approved')}
                                        color="success"
                                        variant="contained"
                                        disabled={statusUpdateLoading}
                                        startIcon={statusUpdateLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                                    >
                                        Approve
                                    </Button>
                                </>
                            )}
                            
                            {/* Status change options for approved/rejected clients */}
                            {changeStatusMode && selectedClient.status === 'approved' && (
                                <Button 
                                    onClick={() => handleUpdateStatus(selectedClient._id, 'rejected')}
                                    color="error"
                                    variant="contained"
                                    disabled={statusUpdateLoading}
                                    startIcon={statusUpdateLoading ? <CircularProgress size={20} /> : <Cancel />}
                                >
                                    Change to Rejected
                                </Button>
                            )}
                            
                            {changeStatusMode && selectedClient.status === 'rejected' && (
                                <Button 
                                    onClick={() => handleUpdateStatus(selectedClient._id, 'approved')}
                                    color="success"
                                    variant="contained"
                                    disabled={statusUpdateLoading}
                                    startIcon={statusUpdateLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                                >
                                    Change to Approved
                                </Button>
                            )}
                            
                            {/* Edit button for approved clients */}
                            {selectedClient.status === 'approved' && !changeStatusMode && (
                                <Button 
                                    onClick={() => handleEditClient(selectedClient)}
                                    color="primary"
                                    variant="contained"
                                    startIcon={<Edit />}
                                >
                                    Edit Client
                                </Button>
                            )}
                        </DialogActions>

                    </>
                )}
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    {clientToDelete && (
                        <Typography>
                            Are you sure you want to delete {clientToDelete.firstName} {clientToDelete.lastName}? This action cannot be undone.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDeleteClient} 
                        color="error" 
                        variant="contained"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : <Delete />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Users;
