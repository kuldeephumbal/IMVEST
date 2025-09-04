import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    Tabs,
    Tab,
    InputAdornment,
    Autocomplete,
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    TrendingUp,
    TrendingDown,
    AccountBalance,
    History,
    Search,
    FilterList,
    MoreVert,
    Visibility,
    Edit,
    Download,
    Receipt,
    MonetizationOn,
    SwapHoriz,
    DateRange,
    Person,
    AccountBalanceWallet,
} from '@mui/icons-material';

const Operations = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterClient, setFilterClient] = useState('');
    const [filterDateRange] = useState({ start: '', end: '' });
    const [filterAmountRange] = useState({ min: '', max: '' });

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Dialog states
    const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

    // Mock data for clients
    const [clients] = useState([
        { id: 1, name: 'John Smith', email: 'john@example.com', totalInvested: 25000, totalWithdrawn: 8000 },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', totalInvested: 50000, totalWithdrawn: 15000 },
        { id: 3, name: 'Michael Brown', email: 'michael@example.com', totalInvested: 75000, totalWithdrawn: 20000 },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', totalInvested: 30000, totalWithdrawn: 5000 },
        { id: 5, name: 'David Wilson', email: 'david@example.com', totalInvested: 100000, totalWithdrawn: 35000 },
    ]);

    // Mock data for transactions
    const [transactions] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            type: 'withdrawal',
            amount: 5000,
            description: 'Quarterly withdrawal',
            status: 'completed',
            date: '2024-03-15',
            processedBy: 'Admin User',
            reference: 'WD-2024-001',
            bankAccount: '**** 4532',
            fees: 25,
            netAmount: 4975
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            type: 'deposit',
            amount: 10000,
            description: 'Monthly investment increase',
            status: 'completed',
            date: '2024-03-10',
            processedBy: 'Manager Smith',
            reference: 'DP-2024-015',
            bankAccount: '**** 7891',
            fees: 0,
            netAmount: 10000
        },
        {
            id: 3,
            clientId: 3,
            clientName: 'Michael Brown',
            type: 'withdrawal',
            amount: 15000,
            description: 'Annual profit withdrawal',
            status: 'pending',
            date: '2024-03-20',
            processedBy: 'Agent Johnson',
            reference: 'WD-2024-002',
            bankAccount: '**** 2156',
            fees: 75,
            netAmount: 14925
        },
        {
            id: 4,
            clientId: 4,
            clientName: 'Emily Davis',
            type: 'deposit',
            amount: 5000,
            description: 'Initial investment top-up',
            status: 'completed',
            date: '2024-03-08',
            processedBy: 'Admin User',
            reference: 'DP-2024-012',
            bankAccount: '**** 9834',
            fees: 0,
            netAmount: 5000
        },
        {
            id: 5,
            clientId: 5,
            clientName: 'David Wilson',
            type: 'withdrawal',
            amount: 25000,
            description: 'Emergency withdrawal',
            status: 'processing',
            date: '2024-03-18',
            processedBy: 'Manager Smith',
            reference: 'WD-2024-003',
            bankAccount: '**** 5647',
            fees: 125,
            netAmount: 24875
        },
        {
            id: 6,
            clientId: 1,
            clientName: 'John Smith',
            type: 'deposit',
            amount: 8000,
            description: 'Portfolio expansion',
            status: 'completed',
            date: '2024-02-28',
            processedBy: 'Admin User',
            reference: 'DP-2024-008',
            bankAccount: '**** 4532',
            fees: 0,
            netAmount: 8000
        }
    ]);

    // Client summaries
    const [clientSummaries] = useState([
        {
            id: 1,
            clientName: 'John Smith',
            totalInvested: 25000,
            totalWithdrawn: 8000,
            currentBalance: 17000,
            lastTransaction: '2024-03-15',
            transactionCount: 8,
            avgMonthlyActivity: 2500
        },
        {
            id: 2,
            clientName: 'Sarah Johnson',
            totalInvested: 50000,
            totalWithdrawn: 15000,
            currentBalance: 35000,
            lastTransaction: '2024-03-10',
            transactionCount: 12,
            avgMonthlyActivity: 4500
        },
        {
            id: 3,
            clientName: 'Michael Brown',
            totalInvested: 75000,
            totalWithdrawn: 20000,
            currentBalance: 55000,
            lastTransaction: '2024-03-20',
            transactionCount: 15,
            avgMonthlyActivity: 6200
        },
        {
            id: 4,
            clientName: 'Emily Davis',
            totalInvested: 30000,
            totalWithdrawn: 5000,
            currentBalance: 25000,
            lastTransaction: '2024-03-08',
            transactionCount: 6,
            avgMonthlyActivity: 1800
        },
        {
            id: 5,
            clientName: 'David Wilson',
            totalInvested: 100000,
            totalWithdrawn: 35000,
            currentBalance: 65000,
            lastTransaction: '2024-03-18',
            transactionCount: 20,
            avgMonthlyActivity: 8500
        }
    ]);

    // Handlers
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleActionMenu = (event) => {
        setActionMenuAnchor(event.currentTarget);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'processing':
                return '#3b82f6';
            case 'failed':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'deposit' ? <TrendingUp /> : <TrendingDown />;
    };

    const getTypeColor = (type) => {
        return type === 'deposit' ? '#10b981' : '#ef4444';
    };

    const handleViewTransaction = () => {
        setTransactionDialogOpen(true);
        handleCloseActionMenu();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Filter functions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        const matchesClient = !filterClient || transaction.clientId === filterClient;

        const matchesDateRange = (!filterDateRange.start || transaction.date >= filterDateRange.start) &&
            (!filterDateRange.end || transaction.date <= filterDateRange.end);

        const matchesAmountRange = (!filterAmountRange.min || transaction.amount >= parseFloat(filterAmountRange.min)) &&
            (!filterAmountRange.max || transaction.amount <= parseFloat(filterAmountRange.max));

        return matchesSearch && matchesStatus && matchesClient && matchesDateRange && matchesAmountRange;
    });

    const filteredClientSummaries = clientSummaries.filter(client => {
        const matchesSearch = client.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Operations Management
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="container-fluid mb-4">
                <div className="row g-4">
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <AccountBalance sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {transactions.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Transactions
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TrendingUp sx={{ fontSize: 40, color: '#4ade80', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {transactions.filter(t => t.type === 'deposit').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Deposits
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TrendingDown sx={{ fontSize: 40, color: '#f87171', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {transactions.filter(t => t.type === 'withdrawal').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Withdrawals
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <SwapHoriz sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {transactions.filter(t => t.status === 'pending' || t.status === 'processing').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Pending
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div> */}

            {/* Main Content */}
            <Card sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                <CardContent>
                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-selected': {
                                    color: '#60a5fa'
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#60a5fa'
                            }
                        }}
                    >
                        <Tab icon={<History />} label="Transaction History" iconPosition="start" />
                        <Tab icon={<Person />} label="Client Summaries" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search transactions, clients, or references..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                minWidth: 250,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                label="Status"
                                onChange={(e) => setFilterStatus(e.target.value)}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                }}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Client</InputLabel>
                            <Select
                                value={filterClient}
                                label="Client"
                                onChange={(e) => setFilterClient(e.target.value)}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                }}
                            >
                                <MenuItem value="">All Clients</MenuItem>
                                {clients.map(client => (
                                    <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                }
                            }}
                        >
                            Export Data
                        </Button>
                    </Box>

                    {/* Tab Content */}
                    {/* TRANSACTION HISTORY TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Transaction History
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client & Description
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Amount
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Reference
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTransactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            backgroundColor: `${getTypeColor(transaction.type)}20`,
                                                            color: getTypeColor(transaction.type)
                                                        }}>
                                                            {getTypeIcon(transaction.type)}
                                                        </Box>
                                                        <Typography sx={{
                                                            color: 'white',
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'medium'
                                                        }}>
                                                            {transaction.type}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {transaction.clientName}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                            {transaction.description}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{
                                                            color: getTypeColor(transaction.type),
                                                            fontWeight: 'bold',
                                                            fontSize: '1rem'
                                                        }}>
                                                            {transaction.type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                                                        </Typography>
                                                        {transaction.fees > 0 && (
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                                                                Fee: {formatCurrency(transaction.fees)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={transaction.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(transaction.status)}20`,
                                                            color: getStatusColor(transaction.status),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                        {transaction.reference}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleActionMenu(e)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {/* CLIENT SUMMARIES TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Client Transaction Summaries
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Total Invested
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Total Withdrawn
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Current Balance
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Transactions
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Last Activity
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredClientSummaries.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{
                                                            bgcolor: '#60a5fa',
                                                            width: 40,
                                                            height: 40
                                                        }}>
                                                            {client.clientName.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {client.clientName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                        {formatCurrency(client.totalInvested)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                        {formatCurrency(client.totalWithdrawn)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                        {formatCurrency(client.currentBalance)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {client.transactionCount}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                                                            Avg: {formatCurrency(client.avgMonthlyActivity)}/mo
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(client.lastTransaction).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleActionMenu(e)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
            >
                <MenuItem onClick={handleViewTransaction}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Edit sx={{ mr: 1 }} />
                    Edit Transaction
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Receipt sx={{ mr: 1 }} />
                    Generate Receipt
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1 }} />
                    Download Record
                </MenuItem>
            </Menu>

            {/* Transaction Details Dialog */}
            <Dialog
                open={transactionDialogOpen}
                onClose={() => setTransactionDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        Transaction Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Transaction details will be displayed here when implemented.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setTransactionDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Download Receipt
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Operations;
