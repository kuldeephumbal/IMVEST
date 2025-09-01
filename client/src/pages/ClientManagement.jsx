import React, { useState } from 'react';
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
    MenuItem
} from '@mui/material';
import {
    Visibility,
    Phone,
    Email,
    Block,
    CheckCircle,
    Search,
    MoreVert,
    TrendingUp,
    TrendingDown,
    Edit
} from '@mui/icons-material';

const ClientManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedClientForAction, setSelectedClientForAction] = useState(null);

    const clients = [
        {
            id: 1,
            name: 'John Doe',
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
            transactions: [
                { id: 1, type: 'Buy', asset: 'VTI', amount: '$2,000', date: '2024-08-22', status: 'Completed' },
                { id: 2, type: 'Buy', asset: 'BND', amount: '$1,500', date: '2024-08-20', status: 'Pending' },
                { id: 3, type: 'Sell', asset: 'QQQ', amount: '$3,000', date: '2024-08-18', status: 'Completed' }
            ]
        },
        {
            id: 3,
            name: 'Mike Johnson',
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
            transactions: [
                { id: 1, type: 'Buy', asset: 'SPY', amount: '$1,000', date: '2024-08-15', status: 'Completed' },
                { id: 2, type: 'Dividend', asset: 'VOO', amount: '$45', date: '2024-08-12', status: 'Completed' }
            ]
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            phone: '+1 (555) 321-0987',
            role: 'Premium',
            status: 'Active',
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
            transactions: [
                { id: 1, type: 'Buy', asset: 'AMZN', amount: '$10,000', date: '2024-08-24', status: 'Completed' },
                { id: 2, type: 'Buy', asset: 'GOOGL', amount: '$15,000', date: '2024-08-22', status: 'Completed' },
                { id: 3, type: 'Sell', asset: 'META', amount: '$8,000', date: '2024-08-20', status: 'Completed' },
                { id: 4, type: 'Buy', asset: 'NFLX', amount: '$5,000', date: '2024-08-18', status: 'Completed' }
            ]
        }
    ];

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