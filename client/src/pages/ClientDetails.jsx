import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider
} from '@mui/material';
import {
    ArrowBack,
    Email,
    Phone,
    AccountBalance,
    TrendingUp,
    TrendingDown,
    History,
    Edit,
    Block,
    CheckCircle
} from '@mui/icons-material';

const ClientDetails = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();

    // Sample client data - in real app, this would come from API
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
                { id: 4, type: 'Dividend', asset: 'MSFT', amount: '$125', date: '2024-08-10', status: 'Completed' },
                { id: 5, type: 'Buy', asset: 'GOOGL', amount: '$7,000', date: '2024-08-08', status: 'Completed' },
                { id: 6, type: 'Sell', asset: 'AMZN', amount: '$4,500', date: '2024-08-05', status: 'Completed' }
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
                { id: 3, type: 'Sell', asset: 'QQQ', amount: '$3,000', date: '2024-08-18', status: 'Completed' },
                { id: 4, type: 'Buy', asset: 'SPY', amount: '$2,500', date: '2024-08-15', status: 'Completed' }
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
                { id: 2, type: 'Dividend', asset: 'VOO', amount: '$45', date: '2024-08-12', status: 'Completed' },
                { id: 3, type: 'Buy', asset: 'BND', amount: '$800', date: '2024-08-10', status: 'Completed' }
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
                { id: 4, type: 'Buy', asset: 'NFLX', amount: '$5,000', date: '2024-08-18', status: 'Completed' },
                { id: 5, type: 'Buy', asset: 'TSLA', amount: '$12,000', date: '2024-08-16', status: 'Completed' }
            ]
        }
    ];

    const client = clients.find(c => c.id === parseInt(clientId));

    if (!client) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" color="error">
                    Client not found
                </Typography>
                <Button onClick={() => navigate('/client-management')} sx={{ mt: 2 }}>
                    Back to Client Management
                </Button>
            </Box>
        );
    }

    const handleContactClient = () => {
        window.open(`mailto:${client.email}?subject=Investment Account Inquiry`);
    };

    const handleSuspendAccount = () => {
        console.log('Suspending account for:', client.name);
        // Handle suspend logic here
    };

    const handleActivateAccount = () => {
        console.log('Activating account for:', client.name);
        // Handle activate logic here
    };

    return (
        <>
            {/* Breadcrumb */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Home / Client Management / Client Details
                </Typography>
            </Box>

            {/* Back Button and Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <IconButton
                    onClick={() => navigate('/client-management')}
                    sx={{
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)'
                        }
                    }}
                >
                    <ArrowBack />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={client.avatar} sx={{ width: 60, height: 60 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {client.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {client.role} Plan • Member since {client.joinDate}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                    variant="contained"
                    startIcon={<Email />}
                    onClick={handleContactClient}
                    sx={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        }
                    }}
                >
                    Contact Client
                </Button>
                {client.status === 'Active' ? (
                    <Button
                        variant="outlined"
                        startIcon={<Block />}
                        onClick={handleSuspendAccount}
                        color="error"
                        sx={{
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: '#f87171',
                            '&:hover': {
                                borderColor: '#f87171',
                                background: 'rgba(248, 113, 113, 0.1)'
                            }
                        }}
                    >
                        Suspend Account
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        startIcon={<CheckCircle />}
                        onClick={handleActivateAccount}
                        color="success"
                        sx={{
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: '#4ade80',
                            '&:hover': {
                                borderColor: '#4ade80',
                                background: 'rgba(74, 222, 128, 0.1)'
                            }
                        }}
                    >
                        Activate Account
                    </Button>
                )}
                <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            background: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    Edit Client
                </Button>
            </Box>

            <div className="container-fluid">
                <div className="row">
                    {/* Contact Information */}
                    <div className="col-12 col-lg-4 mb-4">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px',
                            height: 'fit-content'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>
                                    Contact Information
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Email sx={{ color: '#60a5fa', fontSize: 24 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                Email Address
                                            </Typography>
                                            <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {client.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Phone sx={{ color: '#34d399', fontSize: 24 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                Phone Number
                                            </Typography>
                                            <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {client.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <AccountBalance sx={{ color: '#fbbf24', fontSize: 24, mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                Address
                                            </Typography>
                                            <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                {client.address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Account Status
                                        </Typography>
                                        <Chip
                                            label={client.status}
                                            color={client.status === 'Active' ? 'success' : 'error'}
                                            variant="filled"
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Last Activity
                                        </Typography>
                                        <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                            {client.lastActivity}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Investment Overview */}
                    <div className="col-12 col-lg-4 mb-4">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px',
                            height: 'fit-content'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>
                                    Investment Overview
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Portfolio Type
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                            {client.investmentStatus}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Total Investment
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                                            {client.totalInvestment}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Current Value
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                {client.currentValue}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                            {client.gainType === 'profit' ? (
                                                <TrendingUp sx={{ color: '#4ade80', fontSize: 20 }} />
                                            ) : (
                                                <TrendingDown sx={{ color: '#f87171', fontSize: 20 }} />
                                            )}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: client.gainType === 'profit' ? '#4ade80' : '#f87171',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {client.gain}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Risk Profile
                                        </Typography>
                                        <Chip
                                            label={client.riskProfile}
                                            color={
                                                client.riskProfile === 'Aggressive' ? 'error' :
                                                    client.riskProfile === 'Moderate' ? 'warning' : 'success'
                                            }
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transaction History */}
                    <div className="col-12 col-lg-4 mb-4">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <History sx={{ color: '#60a5fa' }} />
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                        Transaction History
                                    </Typography>
                                </Box>
                                <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                                    {client.transactions.map((transaction) => (
                                        <ListItem
                                            key={transaction.id}
                                            sx={{
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                mb: 2,
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                p: 2
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {transaction.type} {transaction.asset}
                                                        </Typography>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                            {transaction.amount}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            {transaction.date}
                                                        </Typography>
                                                        <Chip
                                                            label={transaction.status}
                                                            size="small"
                                                            color={transaction.status === 'Completed' ? 'success' : 'warning'}
                                                            variant="filled"
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientDetails;
