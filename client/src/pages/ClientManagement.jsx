import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardMedia,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Visibility,
    Phone,
    Email,
    Block,
    CheckCircle,
    Cancel,
    Search,
    MoreVert,
    TrendingUp,
    TrendingDown,
    Edit,
    Close,
    DocumentScanner
} from '@mui/icons-material';
import { clientAPI } from '../services/api';

// Helper function to format currency
const formatCurrency = (value) => {
    if (!value) return '$0';
    // Remove any non-numeric characters except decimal point
    const numericValue = String(value).replace(/[^0-9.]/g, '');
    return `$${parseFloat(numericValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to calculate investment gain/loss
const calculateGain = (current, initial) => {
    if (!current || !initial) return { gain: '0%', gainType: 'neutral' };
    
    // Convert to numeric values
    const currentValue = parseFloat(String(current).replace(/[^0-9.]/g, ''));
    const initialValue = parseFloat(String(initial).replace(/[^0-9.]/g, ''));
    
    if (isNaN(currentValue) || isNaN(initialValue) || initialValue === 0) {
        return { gain: '0%', gainType: 'neutral' };
    }
    
    const gainPercent = ((currentValue - initialValue) / initialValue) * 100;
    return {
        gain: `${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%`,
        gainType: gainPercent >= 0 ? 'profit' : 'loss'
    };
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const ClientManagement = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedClientForAction, setSelectedClientForAction] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    
    // Client detail dialog state
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

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
            
            // Process the client data and add derived fields
            const processedClients = (response.clients || response || []).map(client => {
                // Create a full name from first and last name
                const name = `${client.firstName || ''} ${client.lastName || ''}`.trim();
                
                // Determine risk profile based on investmentPlan or a default
                let riskProfile = 'Moderate';
                if (client.investmentPlan) {
                    if (client.investmentPlan.toLowerCase().includes('aggressive') || 
                        client.investmentPlan.toLowerCase().includes('high')) {
                        riskProfile = 'Aggressive';
                    } else if (client.investmentPlan.toLowerCase().includes('conservative') || 
                               client.investmentPlan.toLowerCase().includes('low')) {
                        riskProfile = 'Conservative';
                    }
                }
                
                // Determine investment status label
                const investmentStatus = client.investmentPlan || 
                                         (riskProfile === 'Aggressive' ? 'High Risk Portfolio' : 
                                          riskProfile === 'Conservative' ? 'Conservative Portfolio' : 
                                          'Balanced Portfolio');
                
                // Format currency values
                const totalInvestment = formatCurrency(client.initialInvestment || client.totalInvested);
                const currentValue = formatCurrency(client.currentBalance);
                
                // Calculate gain/loss
                const { gain, gainType } = calculateGain(
                    client.currentBalance, 
                    client.initialInvestment || client.totalInvested
                );
                
                // Determine client role/plan tier
                const role = client.tier || 'Standard';
                
                // Map status values
                const status = client.status === 'approved' ? 'Active' : 
                               client.status === 'rejected' ? 'Suspended' : 'Pending';
                
                return {
                    ...client,
                    id: client._id,
                    name,
                    role,
                    status,
                    investmentStatus,
                    riskProfile,
                    totalInvestment,
                    currentValue,
                    gain,
                    gainType,
                    joinDate: client.createdAt,
                    lastActivity: client.lastLogin || client.updatedAt,
                    // Use client's address if available, otherwise empty string
                    address: client.address ? 
                        `${client.address.street || ''}, ${client.address.city || ''}, ${client.address.state || ''} ${client.address.zipCode || ''}, ${client.address.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '') : 
                        ''
                };
            });
            
            setClients(processedClients);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients. Please try again.');
            setLoading(false);
            
            // If API fails, use mock data for development
            setClients([
                {
                    id: 1,
                    name: 'John Doe',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 123-4567',
                    role: 'Premium',
                    status: 'Active',
                    avatar: '/api/placeholder/40/40',
                    investmentStatus: 'High Risk Portfolio',
                    totalInvestment: '$125,000',
                    currentValue: '$145,230',
                    gain: '+16.18%',
                    gainType: 'profit',
                    joinDate: '2023-01-15',
                    lastActivity: '2024-08-25',
                    address: '123 Wall Street, New York, NY 10005',
                    riskProfile: 'Aggressive',
                    ssn: '123-45-6789',
                    dateOfBirth: '1985-05-15',
                    documents: ['driverLicense', 'ssnCard', 'proofOfAddress'],
                    transactions: [
                        { id: 1, type: 'Buy', asset: 'AAPL', amount: '$5,000', date: '2024-08-20', status: 'Completed' },
                        { id: 2, type: 'Sell', asset: 'TSLA', amount: '$3,200', date: '2024-08-18', status: 'Completed' },
                        { id: 3, type: 'Buy', asset: 'NVDA', amount: '$8,500', date: '2024-08-15', status: 'Completed' },
                        { id: 4, type: 'Dividend', asset: 'MSFT', amount: '$125', date: '2024-08-10', status: 'Completed' }
                    ]
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '+1 (555) 987-6543',
                    role: 'Standard',
                    status: 'Active',
                    avatar: '/api/placeholder/40/40',
                    investmentStatus: 'Balanced Portfolio',
                    totalInvestment: '$75,000',
                    currentValue: '$68,450',
                    gain: '-8.74%',
                    gainType: 'loss',
                    joinDate: '2023-03-22',
                    lastActivity: '2024-08-24',
                    address: '456 Market Street, San Francisco, CA 94102',
                    riskProfile: 'Moderate',
                    ssn: '987-65-4321',
                    dateOfBirth: '1990-08-25',
                    documents: ['driverLicense', 'ssnCard', 'proofOfAddress'],
                    transactions: [
                        { id: 1, type: 'Buy', asset: 'VTI', amount: '$2,000', date: '2024-08-22', status: 'Completed' },
                        { id: 2, type: 'Buy', asset: 'BND', amount: '$1,500', date: '2024-08-20', status: 'Pending' },
                        { id: 3, type: 'Sell', asset: 'QQQ', amount: '$3,000', date: '2024-08-18', status: 'Completed' }
                    ]
                },
                {
                    id: 3,
                    name: 'Mike Johnson',
                    firstName: 'Mike',
                    lastName: 'Johnson',
                    email: 'mike.johnson@example.com',
                    phone: '+1 (555) 456-7890',
                    role: 'Basic',
                    status: 'Suspended',
                    avatar: '/api/placeholder/40/40',
                    investmentStatus: 'Conservative Portfolio',
                    totalInvestment: '$25,000',
                    currentValue: '$26,125',
                    gain: '+4.5%',
                    gainType: 'profit',
                    joinDate: '2023-06-10',
                    lastActivity: '2024-08-20',
                    address: '789 Oak Avenue, Chicago, IL 60601',
                    riskProfile: 'Conservative',
                    ssn: '456-78-9012',
                    dateOfBirth: '1978-12-10',
                    documents: ['driverLicense'],
                    transactions: [
                        { id: 1, type: 'Buy', asset: 'SPY', amount: '$1,000', date: '2024-08-15', status: 'Completed' },
                        { id: 2, type: 'Dividend', asset: 'VOO', amount: '$45', date: '2024-08-12', status: 'Completed' }
                    ]
                },
                {
                    id: 4,
                    name: 'Sarah Wilson',
                    firstName: 'Sarah',
                    lastName: 'Wilson',
                    email: 'sarah.wilson@example.com',
                    phone: '+1 (555) 321-0987',
                    role: 'Premium',
                    status: 'Pending',
                    avatar: '/api/placeholder/40/40',
                    investmentStatus: 'Growth Portfolio',
                    totalInvestment: '$200,000',
                    currentValue: '$234,560',
                    gain: '+17.28%',
                    gainType: 'profit',
                    joinDate: '2022-11-05',
                    lastActivity: '2024-08-25',
                    address: '321 Pine Street, Seattle, WA 98101',
                    riskProfile: 'Aggressive',
                    ssn: '321-09-8765',
                    dateOfBirth: '1982-03-30',
                    documents: ['driverLicense', 'ssnCard', 'proofOfAddress'],
                    transactions: [
                        { id: 1, type: 'Buy', asset: 'AMZN', amount: '$10,000', date: '2024-08-24', status: 'Completed' },
                        { id: 2, type: 'Buy', asset: 'GOOGL', amount: '$15,000', date: '2024-08-22', status: 'Completed' },
                        { id: 3, type: 'Sell', asset: 'META', amount: '$8,000', date: '2024-08-20', status: 'Completed' },
                        { id: 4, type: 'Buy', asset: 'NFLX', amount: '$5,000', date: '2024-08-18', status: 'Completed' }
                    ]
                }
            ]);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewClient = (client) => {
        navigate(`/client-details/${client.id}`);
    };

    const handleActionMenu = (event, client) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedClientForAction(client);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
        setSelectedClientForAction(null);
    };

    const handleContactClient = (client) => {
        window.open(`mailto:${client.email}?subject=Investment Account Inquiry`);
        handleCloseActionMenu();
    };

    const handleSuspendAccount = (client) => {
        // Handle suspend logic here
        console.log('Suspending account for:', client.name);
        handleCloseActionMenu();
    };

    const handleActivateAccount = (client) => {
        // Handle activate logic here
        console.log('Activating account for:', client.name);
        handleCloseActionMenu();
    };

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="primary">
                    Home / Client Management
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Client Account Management
            </Typography>

            {/* Search and Filter Bar */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search clients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 400 }}
                />
            </Box>

            <Paper
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        All Clients ({filteredClients.length})
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Comprehensive client account management and investment tracking
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Client</TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Contact</TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Investment Status</TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Portfolio Value</TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Quick Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClients.map((client) => (
                                <TableRow key={client.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={client.avatar} sx={{ width: 40, height: 40 }} />
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'white' }}>
                                                    {client.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                    {client.role} Plan
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                {client.email}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                {client.phone}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                {client.investmentStatus}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                {client.riskProfile} Risk
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'white' }}>
                                                {client.currentValue}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {client.gainType === 'profit' ? (
                                                    <TrendingUp sx={{ fontSize: 14, color: '#4ade80' }} />
                                                ) : (
                                                    <TrendingDown sx={{ fontSize: 14, color: '#f87171' }} />
                                                )}
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: client.gainType === 'profit' ? '#4ade80' : '#f87171',
                                                        fontWeight: 'medium'
                                                    }}
                                                >
                                                    {client.gain}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={client.status}
                                            size="small"
                                            color={client.status === 'Active' ? 'success' : 'error'}
                                            variant="filled"
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#60a5fa' }}
                                                onClick={() => handleViewClient(client)}
                                                title="View Full Details"
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#34d399' }}
                                                onClick={() => handleContactClient(client)}
                                                title="Contact Client"
                                            >
                                                <Email fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                onClick={(e) => handleActionMenu(e, client)}
                                                title="More Actions"
                                            >
                                                <MoreVert fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => handleContactClient(selectedClientForAction)}>
                    <Phone sx={{ mr: 1, fontSize: 18 }} />
                    Call Client
                </MenuItem>
                {selectedClientForAction?.status === 'Active' ? (
                    <MenuItem onClick={() => handleSuspendAccount(selectedClientForAction)}>
                        <Block sx={{ mr: 1, fontSize: 18 }} />
                        Suspend Account
                    </MenuItem>
                ) : (
                    <MenuItem onClick={() => handleActivateAccount(selectedClientForAction)}>
                        <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
                        Activate Account
                    </MenuItem>
                )}
                <MenuItem onClick={handleCloseActionMenu}>
                    <Edit sx={{ mr: 1, fontSize: 18 }} />
                    Edit Client
                </MenuItem>
            </Menu>
        </>
    );
};

export default ClientManagement;