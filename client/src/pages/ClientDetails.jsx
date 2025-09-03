import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Chip,
    Button,
    IconButton,
    Divider,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import {
    ArrowBack,
    AccountCircle,
    Phone,
    Email,
    LocationOn,
    CalendarToday,
    AttachMoney,
    MoreVert,
    Edit,
    Delete,
    CheckCircle,
    Cancel,
    DocumentScanner,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';
import { clientAPI } from '../services/api';

// Helper function to format currency
const formatCurrency = (value) => {
    if (!value) return '$0';
    // Remove any non-numeric characters except decimal point
    const numericValue = String(value).replace(/[^0-9.]/g, '');
    return `$${parseFloat(numericValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const ClientDetails = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [documents, setDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    
    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    
    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success'
    });

    // Fetch client details on component mount
    useEffect(() => {
        fetchClientDetails();
    }, [clientId]);

    // Function to fetch client details
    const fetchClientDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await clientAPI.getClientDetails(clientId);
            console.log('Client details:', response);
            
            if (response.client) {
                setClient(response.client);
                setBalance(response.balance);
                setTransactions(response.recentTransactions || []);
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching client details:', err);
            setError('Failed to load client details. Please try again.');
            setLoading(false);
            
            // If API fails, use mock data for development
            // (This would be removed in production)
            setClient({
                _id: clientId,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                dateOfBirth: '1985-05-15',
                ssn: '123-45-6789',
                address: {
                    street: '123 Wall Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10005',
                    country: 'USA'
                },
                status: 'approved',
                kycStatus: 'verified',
                investmentPlan: '8%_compounded',
                initialInvestment: 125000,
                totalInvested: 125000,
                totalEarned: 20230,
                currentBalance: 145230,
                startDate: '2023-01-15',
                maturityDate: '2024-01-15',
                documents: {
                    driverLicense: '/uploads/documents/driver-license.jpg',
                    ssnCard: '/uploads/documents/ssn-card.jpg',
                    proofOfAddress: '/uploads/documents/proof-address.jpg'
                },
                createdAt: '2023-01-15T12:00:00.000Z',
                updatedAt: '2023-08-25T12:00:00.000Z'
            });
            
            setBalance({
                available: 145230,
                pending: 0,
                total: 145230
            });
            
            setTransactions([
                { 
                    _id: '1', 
                    type: 'deposit', 
                    amount: 125000, 
                    status: 'completed', 
                    description: 'Initial investment - 8% Compounded', 
                    createdAt: '2023-01-15T12:00:00.000Z' 
                },
                { 
                    _id: '2', 
                    type: 'interest', 
                    amount: 10000, 
                    status: 'completed', 
                    description: 'Q1 Interest Payment', 
                    createdAt: '2023-04-15T12:00:00.000Z' 
                },
                { 
                    _id: '3', 
                    type: 'interest', 
                    amount: 10230, 
                    status: 'completed', 
                    description: 'Q2 Interest Payment', 
                    createdAt: '2023-07-15T12:00:00.000Z' 
                }
            ]);
        }
    };

    // Function to fetch client documents
    const fetchClientDocuments = async () => {
        try {
            setLoadingDocuments(true);
            const response = await clientAPI.getClientDocuments(clientId);
            setDocuments(response.documents || []);
            setLoadingDocuments(false);
        } catch (err) {
            console.error('Error fetching client documents:', err);
            setLoadingDocuments(false);
            
            // Mock data for development
            setDocuments([
                { type: 'driverLicense', path: '/uploads/documents/driver-license.jpg', uploadedAt: '2023-01-15T12:00:00.000Z' },
                { type: 'ssnCard', path: '/uploads/documents/ssn-card.jpg', uploadedAt: '2023-01-15T12:00:00.000Z' },
                { type: 'proofOfAddress', path: '/uploads/documents/proof-address.jpg', uploadedAt: '2023-01-15T12:00:00.000Z' }
            ]);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        
        // Load documents when Documents tab is selected
        if (newValue === 2 && documents.length === 0) {
            fetchClientDocuments();
        }
    };

    // Open edit dialog with current client data
    const handleEditClick = () => {
        if (!client) return;
        
        setEditFormData({
            firstName: client.firstName || '',
            lastName: client.lastName || '',
            email: client.email || '',
            phone: client.phone || '',
            status: client.status || 'pending',
            investmentPlan: client.investmentPlan || '8%_compounded',
            street: client.address?.street || '',
            city: client.address?.city || '',
            state: client.address?.state || '',
            zipCode: client.address?.zipCode || '',
            country: client.address?.country || 'USA'
        });
        
        setEditDialogOpen(true);
    };

    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit edit form
    const handleEditSubmit = async () => {
        try {
            setSubmitting(true);
            
            // Prepare data for API
            const updateData = {
                firstName: editFormData.firstName,
                lastName: editFormData.lastName,
                email: editFormData.email,
                phone: editFormData.phone,
                status: editFormData.status,
                investmentPlan: editFormData.investmentPlan,
                address: {
                    street: editFormData.street,
                    city: editFormData.city,
                    state: editFormData.state,
                    zipCode: editFormData.zipCode,
                    country: editFormData.country
                }
            };
            
            // API call would go here
            // await clientAPI.updateClient(clientId, updateData);
            
            // For now, just update the local state
            setClient(prev => ({
                ...prev,
                ...updateData
            }));
            
            setSubmitting(false);
            setEditDialogOpen(false);
            setNotification({
                open: true,
                message: 'Client updated successfully',
                type: 'success'
            });
            
            // Refresh client data
            fetchClientDetails();
            
        } catch (err) {
            console.error('Error updating client:', err);
            setSubmitting(false);
            setNotification({
                open: true,
                message: 'Failed to update client: ' + (err.message || 'Unknown error'),
                type: 'error'
            });
        }
    };

    // Delete client
    const handleDeleteConfirm = async () => {
        try {
            setSubmitting(true);
            
            // API call would go here
            // await clientAPI.deleteClient(clientId);
            
            setSubmitting(false);
            setDeleteDialogOpen(false);
            setNotification({
                open: true,
                message: 'Client deleted successfully',
                type: 'success'
            });
            
            // Navigate back to client management
            setTimeout(() => {
                navigate('/client-management');
            }, 1500);
            
        } catch (err) {
            console.error('Error deleting client:', err);
            setSubmitting(false);
            setNotification({
                open: true,
                message: 'Failed to delete client: ' + (err.message || 'Unknown error'),
                type: 'error'
            });
        }
    };

    // If loading
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress size={40} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Loading client details...
                </Typography>
            </Box>
        );
    }

    // If error
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/client-management')}
                >
                    Back to Client Management
                </Button>
            </Box>
        );
    }

    // If no client data
    if (!client) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Client not found
                </Alert>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/client-management')}
                >
                    Back to Client Management
                </Button>
            </Box>
        );
    }

    // Determine status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
            case 'active':
                return 'success';
            case 'pending':
                return 'warning';
            case 'declined':
            case 'suspended':
                return 'error';
            default:
                return 'default';
        }
    };

    // Format investment plan for display
    const formatInvestmentPlan = (plan) => {
        if (!plan) return '';
        
        // Remove underscores and capitalize
        return plan
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace('Compounded', 'Compounded Interest')
            .replace('Simple', 'Simple Interest')
            .replace('Futures', 'Futures Trading');
    };

    return (
        <>
            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({...notification, open: false})}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    severity={notification.type} 
                    onClose={() => setNotification({...notification, open: false})}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Page Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                        <Box component="span" sx={{ cursor: 'pointer' }} onClick={() => navigate('/client-management')}>
                            Home / Client Management
                        </Box> / Client Details
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Client Profile
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="outlined" 
                        color="primary"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/client-management')}
                    >
                        Back to Clients
                    </Button>
                    
                    <Button 
                        variant="outlined" 
                        color="primary"
                        startIcon={<Edit />}
                        onClick={handleEditClick}
                    >
                        Edit Client
                    </Button>
                    
                    <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Delete Client
                    </Button>
                </Box>
            </Box>

            {/* Client Profile Summary */}
            <Paper
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    mb: 4
                }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar 
                            sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                        >
                            {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                        </Avatar>
                        
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                {client.firstName} {client.lastName}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Chip 
                                    label={client.status === 'approved' ? 'Active' : 
                                          client.status === 'declined' ? 'Declined' : 
                                          client.status === 'suspended' ? 'Suspended' : 'Pending'}
                                    color={getStatusColor(client.status)}
                                    size="small"
                                    sx={{ fontWeight: 'medium' }}
                                />
                                
                                <Chip 
                                    label={formatInvestmentPlan(client.investmentPlan)}
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: 'medium' }}
                                />
                                
                                <Chip 
                                    label={client.kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                                    color={client.kycStatus === 'verified' ? 'success' : 'warning'}
                                    size="small"
                                    sx={{ fontWeight: 'medium' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                            Client Since
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'medium' }}>
                            {formatDate(client.createdAt)}
                        </Typography>
                    </Box>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Email color="primary" />
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Email Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {client.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Phone color="primary" />
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Phone Number
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {client.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CalendarToday color="primary" />
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Date of Birth
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {formatDate(client.dateOfBirth)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LocationOn color="primary" />
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Residential Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {client.address?.street}, {client.address?.city}, {client.address?.state} {client.address?.zipCode}, {client.address?.country}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                    Initial Investment
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {formatCurrency(client.initialInvestment)}
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                    Current Balance
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {formatCurrency(client.currentBalance)}
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                    Investment Term
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {formatDate(client.startDate)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        to
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {formatDate(client.maturityDate)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Tabs for Transactions, Account Details, Documents */}
            <Paper
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange} 
                        sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' }, '& .Mui-selected': { color: 'white' } }}
                    >
                        <Tab label="Transactions" />
                        <Tab label="Account Details" />
                        <Tab label="Documents" />
                    </Tabs>
                </Box>
                
                {/* Transactions Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                            Recent Transactions
                        </Typography>
                        
                        {transactions.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Date</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Type</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Amount</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((transaction) => (
                                            <TableRow key={transaction._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                                                <TableCell sx={{ color: 'white' }}>
                                                    {formatDate(transaction.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                        color={transaction.type === 'deposit' ? 'primary' : 
                                                              transaction.type === 'withdrawal' ? 'warning' : 
                                                              transaction.type === 'interest' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }}>
                                                    {formatCurrency(transaction.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                        color={transaction.status === 'completed' ? 'success' : 
                                                              transaction.status === 'pending' ? 'warning' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }}>
                                                    {transaction.description}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    No transactions found
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
                
                {/* Account Details Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
                            Investment Details
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                                            Investment Summary
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Investment Plan:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {formatInvestmentPlan(client.investmentPlan)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Initial Investment:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {formatCurrency(client.initialInvestment)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Total Invested:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {formatCurrency(client.totalInvested)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Total Earned:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {formatCurrency(client.totalEarned)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Current Balance:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {formatCurrency(client.currentBalance)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Investment Start:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {formatDate(client.startDate)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Maturity Date:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {formatDate(client.maturityDate)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                                            Account Information
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Account Status:
                                            </Typography>
                                            <Chip 
                                                label={client.status === 'approved' ? 'Active' : 
                                                      client.status === 'declined' ? 'Declined' : 
                                                      client.status === 'suspended' ? 'Suspended' : 'Pending'}
                                                color={getStatusColor(client.status)}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                KYC Status:
                                            </Typography>
                                            <Chip 
                                                label={client.kycStatus === 'verified' ? 'Verified' : 'Pending'}
                                                color={client.kycStatus === 'verified' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                SSN:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {client.ssn}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Account Created:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {formatDate(client.createdAt)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Last Updated:
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {formatDate(client.updatedAt)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                
                {/* Documents Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
                            Submitted Documents
                        </Typography>
                        
                        {loadingDocuments ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress size={30} />
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {client.documents?.driverLicense && (
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>
                                                        Driver's License
                                                    </Typography>
                                                    <DocumentScanner color="primary" />
                                                </Box>
                                                <Button 
                                                    variant="outlined" 
                                                    fullWidth
                                                    onClick={() => window.open(`/api/documents/${client.documents.driverLicense}`, '_blank')}
                                                >
                                                    View Document
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                                
                                {client.documents?.ssnCard && (
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>
                                                        SSN Card
                                                    </Typography>
                                                    <DocumentScanner color="primary" />
                                                </Box>
                                                <Button 
                                                    variant="outlined" 
                                                    fullWidth
                                                    onClick={() => window.open(`/api/documents/${client.documents.ssnCard}`, '_blank')}
                                                >
                                                    View Document
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                                
                                {client.documents?.proofOfAddress && (
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>
                                                        Proof of Address
                                                    </Typography>
                                                    <DocumentScanner color="primary" />
                                                </Box>
                                                <Button 
                                                    variant="outlined" 
                                                    fullWidth
                                                    onClick={() => window.open(`/api/documents/${client.documents.proofOfAddress}`, '_blank')}
                                                >
                                                    View Document
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                                
                                {(!client.documents?.driverLicense && !client.documents?.ssnCard && !client.documents?.proofOfAddress) && (
                                    <Grid item xs={12}>
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                No documents found
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Edit Client Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Client Information</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="firstName"
                                label="First Name"
                                value={editFormData.firstName || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="lastName"
                                label="Last Name"
                                value={editFormData.lastName || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="email"
                                label="Email Address"
                                value={editFormData.email || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="phone"
                                label="Phone Number"
                                value={editFormData.phone || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={editFormData.status || 'pending'}
                                    onChange={handleFormChange}
                                    label="Status"
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="declined">Declined</MenuItem>
                                    <MenuItem value="suspended">Suspended</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Investment Plan</InputLabel>
                                <Select
                                    name="investmentPlan"
                                    value={editFormData.investmentPlan || '8%_compounded'}
                                    onChange={handleFormChange}
                                    label="Investment Plan"
                                >
                                    <MenuItem value="8%_compounded">8% Compounded Interest</MenuItem>
                                    <MenuItem value="6%_simple">6% Simple Interest</MenuItem>
                                    <MenuItem value="12%_futures">12% Futures Trading</MenuItem>
                                    <MenuItem value="14%_futures">14% Futures Trading</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                Address Information
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="street"
                                label="Street Address"
                                value={editFormData.street || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="city"
                                label="City"
                                value={editFormData.city || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="state"
                                label="State"
                                value={editFormData.state || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="zipCode"
                                label="Zip Code"
                                value={editFormData.zipCode || ''}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="country"
                                label="Country"
                                value={editFormData.country || 'USA'}
                                onChange={handleFormChange}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleEditSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Client Deletion</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete client <strong>{client.firstName} {client.lastName}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        variant="contained" 
                        color="error"
                        disabled={submitting}
                    >
                        {submitting ? 'Deleting...' : 'Delete Client'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ClientDetails;
