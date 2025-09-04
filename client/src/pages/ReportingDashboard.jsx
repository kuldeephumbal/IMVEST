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
    LinearProgress,
    Grid,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    FormLabel,
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    Dashboard,
    TrendingUp,
    TrendingDown,
    PersonAdd,
    AccountBalance,
    Warning,
    Description,
    Search,
    MoreVert,
    Download,
    DateRange,
    Assessment,
    PictureAsPdf,
    TableChart,
    FilterList,
    Refresh,
    Schedule,
    CheckCircle,
    Cancel,
    Pending,
    AttachMoney,
    SwapVert,
    Flag,
    Assignment,
    Group,
    Today,
    CalendarMonth,
    Analytics,
    GetApp,
    Settings,
    Visibility
} from '@mui/icons-material';

const ReportingDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('today');

    // Dialog states
    const [customReportDialogOpen, setCustomReportDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Custom report form states
    const [reportConfig, setReportConfig] = useState({
        reportType: 'summary',
        dateFrom: '',
        dateTo: '',
        clients: [],
        metrics: ['signups', 'deposits', 'withdrawals'],
        format: 'pdf',
        groupBy: 'day'
    });

    // Mock data for daily activity
    const [dailyActivity] = useState({
        date: '2024-03-15',
        newSignups: 12,
        totalDeposits: 145000,
        totalWithdrawals: 38000,
        netFlow: 107000,
        activeUsers: 234,
        pendingActions: 8,
        contractsSigned: 15,
        documentsVerified: 22,
        loginSessions: 89
    });

    // Mock data for new signups
    const [newSignups] = useState([
        {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            signupDate: '2024-03-15 14:30',
            status: 'pending_kyc',
            initialDeposit: 25000,
            referralSource: 'website',
            accountType: 'premium'
        },
        {
            id: 2,
            name: 'Robert Chen',
            email: 'robert@example.com',
            signupDate: '2024-03-15 11:20',
            status: 'active',
            initialDeposit: 50000,
            referralSource: 'referral',
            accountType: 'vip'
        },
        {
            id: 3,
            name: 'Maria Garcia',
            email: 'maria@example.com',
            signupDate: '2024-03-15 09:45',
            status: 'pending_documents',
            initialDeposit: 15000,
            referralSource: 'social_media',
            accountType: 'standard'
        },
        {
            id: 4,
            name: 'David Wilson',
            email: 'david@example.com',
            signupDate: '2024-03-15 08:15',
            status: 'active',
            initialDeposit: 75000,
            referralSource: 'partner',
            accountType: 'vip'
        }
    ]);

    // Mock data for financial transactions
    const [transactions] = useState([
        {
            id: 1,
            clientName: 'John Smith',
            type: 'deposit',
            amount: 50000,
            timestamp: '2024-03-15 13:45',
            status: 'completed',
            method: 'bank_transfer',
            reference: 'DEP001'
        },
        {
            id: 2,
            clientName: 'Sarah Johnson',
            type: 'withdrawal',
            amount: 15000,
            timestamp: '2024-03-15 12:30',
            status: 'pending',
            method: 'bank_transfer',
            reference: 'WTH001'
        },
        {
            id: 3,
            clientName: 'Mike Davis',
            type: 'deposit',
            amount: 25000,
            timestamp: '2024-03-15 11:20',
            status: 'completed',
            method: 'wire_transfer',
            reference: 'DEP002'
        },
        {
            id: 4,
            clientName: 'Lisa Chen',
            type: 'withdrawal',
            amount: 8000,
            timestamp: '2024-03-15 10:15',
            status: 'completed',
            method: 'bank_transfer',
            reference: 'WTH002'
        }
    ]);

    // Mock data for pending actions
    const [pendingActions] = useState([
        {
            id: 1,
            type: 'unsigned_contract',
            clientName: 'Tom Anderson',
            description: 'Investment contract awaiting signature',
            priority: 'high',
            dueDate: '2024-03-16',
            amount: 100000,
            assignedTo: 'Manager Smith'
        },
        {
            id: 2,
            type: 'flagged_account',
            clientName: 'Emma Wilson',
            description: 'Account flagged for unusual activity',
            priority: 'critical',
            dueDate: '2024-03-15',
            amount: 250000,
            assignedTo: 'Security Team'
        },
        {
            id: 3,
            type: 'kyc_review',
            clientName: 'James Brown',
            description: 'KYC documents pending review',
            priority: 'medium',
            dueDate: '2024-03-17',
            amount: 45000,
            assignedTo: 'Compliance Officer'
        },
        {
            id: 4,
            type: 'document_verification',
            clientName: 'Anna Taylor',
            description: 'Identity documents require verification',
            priority: 'medium',
            dueDate: '2024-03-18',
            amount: 30000,
            assignedTo: 'Verification Team'
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
            case 'active':
                return '#10b981';
            case 'pending':
            case 'pending_kyc':
            case 'pending_documents':
                return '#f59e0b';
            case 'failed':
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return '#ef4444';
            case 'high':
                return '#f59e0b';
            case 'medium':
                return '#3b82f6';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getActionTypeIcon = (type) => {
        switch (type) {
            case 'unsigned_contract':
                return <Assignment />;
            case 'flagged_account':
                return <Flag />;
            case 'kyc_review':
                return <Group />;
            case 'document_verification':
                return <Description />;
            default:
                return <Warning />;
        }
    };

    const handleCustomReport = () => {
        setCustomReportDialogOpen(true);
        handleCloseActionMenu();
    };

    const handleViewDetails = () => {
        // View details functionality would be implemented here
        handleCloseActionMenu();
    };

    // Filter functions
    const filteredSignups = newSignups.filter(signup => {
        const matchesSearch = signup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            signup.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const filteredPendingActions = pendingActions.filter(action => {
        const matchesSearch = action.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            action.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                            Reporting & Metrics Dashboard
                        </Typography>
                    </div>
                    <div className="col-auto">
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={() => window.location.reload()}
                            sx={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                }
                            }}
                        >
                            Refresh Data
                        </Button>
                    </div>
                </div>
            </div>

            {/* Daily Activity Summary Cards */}
            <div className="container-fluid mb-4">
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
                    Today's Activity Summary - {new Date(dailyActivity.date).toLocaleDateString()}
                </Typography>
                <div className="row g-4">
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PersonAdd sx={{ fontSize: 40, color: '#4ade80', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {dailyActivity.newSignups}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    New Signups
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TrendingUp sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    ${dailyActivity.totalDeposits.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Deposits
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
                                <TrendingDown sx={{ fontSize: 40, color: '#fbbf24', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    ${dailyActivity.totalWithdrawals.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Withdrawals
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
                                <Warning sx={{ fontSize: 40, color: '#f87171', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {dailyActivity.pendingActions}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Pending Actions
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="container-fluid mb-4">
                <div className="row g-4">
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <AttachMoney sx={{ fontSize: 30, color: '#a855f7', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    ${dailyActivity.netFlow.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Net Cash Flow
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Group sx={{ fontSize: 30, color: '#10b981', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {dailyActivity.activeUsers}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Active Users
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CheckCircle sx={{ fontSize: 30, color: '#06b6d4', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {dailyActivity.contractsSigned}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Contracts Signed
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(168, 85, 247, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(168, 85, 247, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Assessment sx={{ fontSize: 30, color: '#a855f7', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {dailyActivity.loginSessions}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Login Sessions
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
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
                        <Tab icon={<PersonAdd />} label="New Signups" iconPosition="start" />
                        <Tab icon={<SwapVert />} label="Deposits & Withdrawals" iconPosition="start" />
                        <Tab icon={<Warning />} label="Pending Actions" iconPosition="start" />
                        <Tab icon={<GetApp />} label="Custom Reports" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search records..."
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
                            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Period</InputLabel>
                            <Select
                                value={filterPeriod}
                                label="Period"
                                onChange={(e) => setFilterPeriod(e.target.value)}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                }}
                            >
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="week">This Week</MenuItem>
                                <MenuItem value="month">This Month</MenuItem>
                                <MenuItem value="quarter">This Quarter</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            variant="contained"
                            startIcon={<GetApp />}
                            onClick={handleCustomReport}
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                }
                            }}
                        >
                            Custom Report
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
                            Export Data
                        </Button>
                    </Box>

                    {/* Tab Content */}
                    {/* NEW SIGNUPS TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                New User Signups - Today
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                User Details
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Signup Time
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Initial Deposit
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Source & Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSignups.map((signup) => (
                                            <TableRow key={signup.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: '#60a5fa', width: 40, height: 40 }}>
                                                            {signup.name.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {signup.name}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {signup.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                        {new Date(signup.signupDate).toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={signup.status.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(signup.status)}20`,
                                                            color: getStatusColor(signup.status),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                        ${signup.initialDeposit.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Chip
                                                            label={signup.referralSource.replace('_', ' ')}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                                                color: '#a855f7',
                                                                textTransform: 'capitalize',
                                                                mb: 0.5
                                                            }}
                                                        />
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                            {signup.accountType} account
                                                        </Typography>
                                                    </Box>
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

                    {/* DEPOSITS & WITHDRAWALS TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Financial Transactions - Today
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Transaction Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Amount
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Timestamp
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Method & Reference
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
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {transaction.clientName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={transaction.type === 'deposit' ? <TrendingUp /> : <TrendingDown />}
                                                        label={transaction.type}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: transaction.type === 'deposit' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                            color: transaction.type === 'deposit' ? '#10b981' : '#f59e0b',
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{
                                                        color: transaction.type === 'deposit' ? '#10b981' : '#f59e0b',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                        {new Date(transaction.timestamp).toLocaleString()}
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
                                                    <Box>
                                                        <Typography sx={{ color: 'white' }}>
                                                            {transaction.method.replace('_', ' ')}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                                                            {transaction.reference}
                                                        </Typography>
                                                    </Box>
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

                    {/* PENDING ACTIONS TAB */}
                    {activeTab === 2 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Pending Actions & Flagged Items
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Action Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Description
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Priority
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Amount
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Due Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Assigned To
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredPendingActions.map((action) => (
                                            <TableRow key={action.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getActionTypeIcon(action.type)}
                                                        <Typography sx={{ color: 'white', textTransform: 'capitalize' }}>
                                                            {action.type.replace('_', ' ')}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {action.clientName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {action.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={action.priority}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getPriorityColor(action.priority)}20`,
                                                            color: getPriorityColor(action.priority),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        ${action.amount.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(action.dueDate).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {action.assignedTo}
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

                    {/* CUSTOM REPORTS TAB */}
                    {activeTab === 3 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Custom Report Generator
                            </Typography>

                            <div className="container-fluid">
                                <div className="row g-4">
                                    <div className="col-lg-6">
                                        <Card sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '15px'
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                                    Quick Report Templates
                                                </Typography>

                                                <List>
                                                    <ListItem sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                        <ListItemIcon>
                                                            <Today sx={{ color: '#60a5fa' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Daily Activity Report"
                                                            secondary="Signups, transactions, and key metrics for today"
                                                            primaryTypographyProps={{ color: 'white' }}
                                                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                        />
                                                        <Button size="small" startIcon={<Download />}>Generate</Button>
                                                    </ListItem>

                                                    <ListItem sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                        <ListItemIcon>
                                                            <CalendarMonth sx={{ color: '#10b981' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Monthly Summary Report"
                                                            secondary="Complete monthly performance overview"
                                                            primaryTypographyProps={{ color: 'white' }}
                                                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                        />
                                                        <Button size="small" startIcon={<Download />}>Generate</Button>
                                                    </ListItem>

                                                    <ListItem sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                        <ListItemIcon>
                                                            <Group sx={{ color: '#a855f7' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Client Analytics Report"
                                                            secondary="Client segmentation and behavior analysis"
                                                            primaryTypographyProps={{ color: 'white' }}
                                                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                        />
                                                        <Button size="small" startIcon={<Download />}>Generate</Button>
                                                    </ListItem>

                                                    <ListItem sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                        <ListItemIcon>
                                                            <Warning sx={{ color: '#f59e0b' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Compliance Report"
                                                            secondary="KYC status, pending documents, and compliance metrics"
                                                            primaryTypographyProps={{ color: 'white' }}
                                                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                        />
                                                        <Button size="small" startIcon={<Download />}>Generate</Button>
                                                    </ListItem>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="col-lg-6">
                                        <Card sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '15px'
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                                    Export Options
                                                </Typography>

                                                <Box sx={{ mb: 3 }}>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                                                        Available Formats
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<PictureAsPdf />}
                                                            sx={{
                                                                borderColor: '#ef4444',
                                                                color: '#ef4444',
                                                                '&:hover': {
                                                                    borderColor: '#dc2626',
                                                                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            PDF Report
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<TableChart />}
                                                            sx={{
                                                                borderColor: '#10b981',
                                                                color: '#10b981',
                                                                '&:hover': {
                                                                    borderColor: '#059669',
                                                                    backgroundColor: 'rgba(16, 185, 129, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            CSV Export
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Assessment />}
                                                            sx={{
                                                                borderColor: '#60a5fa',
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    borderColor: '#3b82f6',
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            Excel Report
                                                        </Button>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

                                                <Box>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                                                        Report Statistics
                                                    </Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ color: '#60a5fa', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                                            47 reports generated this month
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={78}
                                                            sx={{
                                                                mt: 1,
                                                                height: 6,
                                                                borderRadius: 3,
                                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                                '& .MuiLinearProgress-bar': { backgroundColor: '#60a5fa' }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                        Most popular: Daily Activity Reports (65%)
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
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
                <MenuItem onClick={handleViewDetails}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1 }} />
                    Export Record
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Settings sx={{ mr: 1 }} />
                    Manage Item
                </MenuItem>
            </Menu>

            {/* Custom Report Dialog */}
            <Dialog
                open={customReportDialogOpen}
                onClose={() => setCustomReportDialogOpen(false)}
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
                        Generate Custom Report
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                            Report Type
                                        </FormLabel>
                                        <RadioGroup
                                            value={reportConfig.reportType}
                                            onChange={(e) => setReportConfig({ ...reportConfig, reportType: e.target.value })}
                                        >
                                            <FormControlLabel
                                                value="summary"
                                                control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                                label="Summary Report"
                                                sx={{ color: 'white' }}
                                            />
                                            <FormControlLabel
                                                value="detailed"
                                                control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                                label="Detailed Report"
                                                sx={{ color: 'white' }}
                                            />
                                            <FormControlLabel
                                                value="analytics"
                                                control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                                label="Analytics Report"
                                                sx={{ color: 'white' }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                            Export Format
                                        </FormLabel>
                                        <RadioGroup
                                            value={reportConfig.format}
                                            onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                                        >
                                            <FormControlLabel
                                                value="pdf"
                                                control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                                label="PDF Document"
                                                sx={{ color: 'white' }}
                                            />
                                            <FormControlLabel
                                                value="csv"
                                                control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                                label="CSV File"
                                                sx={{ color: 'white' }}
                                            />
                                            <FormControlLabel
                                                value="excel"
                                                control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                                label="Excel Workbook"
                                                sx={{ color: 'white' }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                                        Include Metrics
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                            label="New Signups"
                                            sx={{ color: 'white' }}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                            label="Deposits"
                                            sx={{ color: 'white' }}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                            label="Withdrawals"
                                            sx={{ color: 'white' }}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                            label="Pending Actions"
                                            sx={{ color: 'white' }}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />}
                                            label="Client Analytics"
                                            sx={{ color: 'white' }}
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setCustomReportDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<GetApp />}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            }
                        }}
                    >
                        Generate Report
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReportingDashboard;
