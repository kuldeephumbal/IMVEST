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
    Switch,
    FormControlLabel,
    Grid,
    Divider,
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    GroupAdd,
    TrendingUp,
    MonetizationOn,
    Share,
    Search,
    MoreVert,
    Edit,
    Download,
    Person,
    CheckCircle,
    Cancel,
    Pending,
    Analytics,
    CardGiftcard,
    Star,
    EmojiEvents,
    Timeline,
    Assessment,
    AccountCircle,
    Visibility,
    AttachMoney,
    PersonAdd,
    Campaign,
} from '@mui/icons-material';

const ReferralManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRewardType, setFilterRewardType] = useState('all');

    // Dialog states
    const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
    const [referralDetailsDialogOpen, setReferralDetailsDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Mock data for referrals
    const [referrals] = useState([
        {
            id: 1,
            referrerName: 'John Smith',
            referrerId: 1,
            referrerEmail: 'john@example.com',
            refereeName: 'Jane Doe',
            refereeId: 101,
            refereeEmail: 'jane@example.com',
            referralDate: '2024-03-10',
            status: 'completed',
            investmentAmount: 25000,
            rewardAmount: 1250,
            rewardStatus: 'paid',
            commissionRate: 5,
            referralCode: 'REF001',
            conversionDate: '2024-03-12',
            notes: 'Premium referral with high investment'
        },
        {
            id: 2,
            referrerName: 'Sarah Johnson',
            referrerId: 2,
            referrerEmail: 'sarah@example.com',
            refereeName: 'Mike Wilson',
            refereeId: 102,
            refereeEmail: 'mike@example.com',
            referralDate: '2024-03-08',
            status: 'pending',
            investmentAmount: 15000,
            rewardAmount: 750,
            rewardStatus: 'pending',
            commissionRate: 5,
            referralCode: 'REF002',
            conversionDate: null,
            notes: 'Waiting for KYC completion'
        },
        {
            id: 3,
            referrerName: 'David Brown',
            referrerId: 3,
            referrerEmail: 'david@example.com',
            refereeName: 'Lisa Chen',
            refereeId: 103,
            refereeEmail: 'lisa@example.com',
            referralDate: '2024-03-05',
            status: 'completed',
            investmentAmount: 40000,
            rewardAmount: 2000,
            rewardStatus: 'approved',
            commissionRate: 5,
            referralCode: 'REF003',
            conversionDate: '2024-03-07',
            notes: 'High-value referral from VIP client'
        },
        {
            id: 4,
            referrerName: 'Emily Davis',
            referrerId: 4,
            referrerEmail: 'emily@example.com',
            refereeName: 'Tom Anderson',
            refereeId: 104,
            refereeEmail: 'tom@example.com',
            referralDate: '2024-03-01',
            status: 'expired',
            investmentAmount: 0,
            rewardAmount: 0,
            rewardStatus: 'cancelled',
            commissionRate: 5,
            referralCode: 'REF004',
            conversionDate: null,
            notes: 'Referral expired after 30 days'
        }
    ]);

    // Mock data for rewards
    const [rewards] = useState([
        {
            id: 1,
            referralId: 1,
            referrerName: 'John Smith',
            rewardType: 'commission',
            amount: 1250,
            status: 'paid',
            approvedBy: 'Admin User',
            approvedDate: '2024-03-12',
            paidDate: '2024-03-13',
            paymentMethod: 'bank_transfer',
            description: '5% commission on $25,000 investment'
        },
        {
            id: 2,
            referralId: 3,
            referrerName: 'David Brown',
            rewardType: 'commission',
            amount: 2000,
            status: 'approved',
            approvedBy: 'Manager Smith',
            approvedDate: '2024-03-08',
            paidDate: null,
            paymentMethod: 'bank_transfer',
            description: '5% commission on $40,000 investment'
        },
        {
            id: 3,
            referralId: 2,
            referrerName: 'Sarah Johnson',
            rewardType: 'commission',
            amount: 750,
            status: 'pending',
            approvedBy: null,
            approvedDate: null,
            paidDate: null,
            paymentMethod: 'bank_transfer',
            description: '5% commission on $15,000 investment'
        }
    ]);

    // Mock data for analytics
    const [analyticsData] = useState({
        totalReferrals: 15,
        successfulReferrals: 8,
        pendingReferrals: 4,
        expiredReferrals: 3,
        totalRewardsPaid: 15750,
        totalRewardsPending: 2250,
        conversionRate: 53.3,
        averageInvestmentPerReferral: 22500,
        topReferrers: [
            { name: 'John Smith', referrals: 4, totalRewards: 3250 },
            { name: 'David Brown', referrals: 3, totalRewards: 2750 },
            { name: 'Sarah Johnson', referrals: 2, totalRewards: 1500 }
        ],
        monthlyTrends: [
            { month: 'Jan', referrals: 3, conversions: 2, rewards: 2500 },
            { month: 'Feb', referrals: 5, conversions: 3, rewards: 4250 },
            { month: 'Mar', referrals: 7, conversions: 3, rewards: 3500 }
        ]
    });

    // Mock data for referral program settings
    const [programSettings] = useState({
        commissionRate: 5,
        maxRewardAmount: 5000,
        referralValidityDays: 30,
        minimumInvestment: 10000,
        autoApprovalThreshold: 1000,
        programStatus: 'active'
    });

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
            case 'paid':
            case 'approved':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'expired':
            case 'cancelled':
            case 'rejected':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'paid':
            case 'approved':
                return <CheckCircle />;
            case 'pending':
                return <Pending />;
            case 'expired':
            case 'cancelled':
            case 'rejected':
                return <Cancel />;
            default:
                return <Pending />;
        }
    };

    const handleApproveReward = () => {
        setRewardDialogOpen(true);
        handleCloseActionMenu();
    };

    const handleViewDetails = () => {
        setReferralDetailsDialogOpen(true);
        handleCloseActionMenu();
    };

    // Filter functions
    const filteredReferrals = referrals.filter(referral => {
        const matchesSearch = referral.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            referral.refereeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            referral.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || referral.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredRewards = rewards.filter(reward => {
        const matchesSearch = reward.referrerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRewardType = filterRewardType === 'all' || reward.rewardType === filterRewardType;
        return matchesSearch && matchesRewardType;
    });

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Referral Management
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="container-fluid mb-4">
                <div className="row g-4">
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <GroupAdd sx={{ fontSize: 40, color: '#4ade80', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {analyticsData.totalReferrals}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Referrals
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
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {analyticsData.conversionRate}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Conversion Rate
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
                                <MonetizationOn sx={{ fontSize: 40, color: '#fbbf24', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    ${analyticsData.totalRewardsPaid.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Rewards Paid
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <Card sx={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '20px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <AttachMoney sx={{ fontSize: 40, color: '#a855f7', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    ${analyticsData.averageInvestmentPerReferral.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Avg. Investment
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

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
                        <Tab icon={<Share />} label="Referral Tracking" iconPosition="start" />
                        <Tab icon={<CardGiftcard />} label="Reward Management" iconPosition="start" />
                        <Tab icon={<Analytics />} label="Program Analytics" iconPosition="start" />
                        <Tab icon={<Campaign />} label="Program Settings" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search referrals, names, or codes..."
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

                        {activeTab === 0 && (
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
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="expired">Expired</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {activeTab === 1 && (
                            <FormControl sx={{ minWidth: 140 }}>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Reward Type</InputLabel>
                                <Select
                                    value={filterRewardType}
                                    label="Reward Type"
                                    onChange={(e) => setFilterRewardType(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                    }}
                                >
                                    <MenuItem value="all">All Types</MenuItem>
                                    <MenuItem value="commission">Commission</MenuItem>
                                    <MenuItem value="bonus">Bonus</MenuItem>
                                    <MenuItem value="credit">Account Credit</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Box sx={{ flexGrow: 1 }} />

                        {activeTab === 0 && (
                            <Button
                                variant="contained"
                                startIcon={<PersonAdd />}
                                sx={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    }
                                }}
                            >
                                Add Referral
                            </Button>
                        )}

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
                            Export Report
                        </Button>
                    </Box>

                    {/* Tab Content */}
                    {/* REFERRAL TRACKING TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Referral Tracking & Management
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Referrer
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Referee
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Referral Details
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Investment
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Reward
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredReferrals.map((referral) => (
                                            <TableRow key={referral.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: '#60a5fa', width: 35, height: 35 }}>
                                                            {referral.referrerName.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {referral.referrerName}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {referral.referrerEmail}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {referral.refereeName}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                            {referral.refereeEmail}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                            {referral.referralCode}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                            Referred: {new Date(referral.referralDate).toLocaleDateString()}
                                                        </Typography>
                                                        {referral.conversionDate && (
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                Converted: {new Date(referral.conversionDate).toLocaleDateString()}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        ${referral.investmentAmount.toLocaleString()}
                                                    </Typography>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                        {referral.commissionRate}% commission
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(referral.status)}
                                                        label={referral.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(referral.status)}20`,
                                                            color: getStatusColor(referral.status),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            ${referral.rewardAmount.toLocaleString()}
                                                        </Typography>
                                                        <Chip
                                                            label={referral.rewardStatus}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: `${getStatusColor(referral.rewardStatus)}20`,
                                                                color: getStatusColor(referral.rewardStatus),
                                                                textTransform: 'capitalize',
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
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

                    {/* REWARD MANAGEMENT TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Referral Rewards & Incentives
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Referrer
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Reward Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Amount
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Approval Details
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Payment Method
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredRewards.map((reward) => (
                                            <TableRow key={reward.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: '#10b981', width: 35, height: 35 }}>
                                                            {reward.referrerName.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {reward.referrerName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={reward.rewardType === 'commission' ? <MonetizationOn /> : <CardGiftcard />}
                                                        label={reward.rewardType}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: reward.rewardType === 'commission' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                                            color: reward.rewardType === 'commission' ? '#60a5fa' : '#a855f7',
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', mt: 0.5 }}>
                                                        {reward.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                        ${reward.amount.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(reward.status)}
                                                        label={reward.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(reward.status)}20`,
                                                            color: getStatusColor(reward.status),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {reward.approvedBy ? (
                                                        <Box>
                                                            <Typography sx={{ color: 'white' }}>
                                                                Approved by: {reward.approvedBy}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {new Date(reward.approvedDate).toLocaleDateString()}
                                                            </Typography>
                                                            {reward.paidDate && (
                                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                    Paid: {new Date(reward.paidDate).toLocaleDateString()}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            Awaiting approval
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {reward.paymentMethod.replace('_', ' ')}
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

                    {/* PROGRAM ANALYTICS TAB */}
                    {activeTab === 2 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Referral Program Analytics
                            </Typography>

                            <div className="container-fluid">
                                <div className="row g-4">
                                    {/* Conversion Rate */}
                                    <div className="col-lg-6">
                                        <Card sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '15px'
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                                    Program Performance
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ color: '#10b981' }}>Successful Conversions</Typography>
                                                        <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                            {analyticsData.successfulReferrals}/{analyticsData.totalReferrals}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(analyticsData.successfulReferrals / analyticsData.totalReferrals) * 100}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' }
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ color: '#f59e0b' }}>Pending</Typography>
                                                        <Typography sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                                                            {analyticsData.pendingReferrals}/{analyticsData.totalReferrals}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(analyticsData.pendingReferrals / analyticsData.totalReferrals) * 100}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '& .MuiLinearProgress-bar': { backgroundColor: '#f59e0b' }
                                                        }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ color: '#ef4444' }}>Expired</Typography>
                                                        <Typography sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                            {analyticsData.expiredReferrals}/{analyticsData.totalReferrals}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(analyticsData.expiredReferrals / analyticsData.totalReferrals) * 100}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '& .MuiLinearProgress-bar': { backgroundColor: '#ef4444' }
                                                        }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Top Referrers */}
                                    <div className="col-lg-6">
                                        <Card sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '15px'
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                                    Top Referrers
                                                </Typography>
                                                {analyticsData.topReferrers.map((referrer, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: index === 0 ? '#eab308' : index === 1 ? '#94a3b8' : '#cd7f32', mr: 2 }}>
                                                            {index === 0 ? <Star /> : index + 1}
                                                        </Avatar>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {referrer.name}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {referrer.referrals} referrals • ${referrer.totalRewards.toLocaleString()} earned
                                                            </Typography>
                                                        </Box>
                                                        <EmojiEvents sx={{ color: index === 0 ? '#eab308' : 'rgba(255, 255, 255, 0.5)' }} />
                                                    </Box>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* PROGRAM SETTINGS TAB */}
                    {activeTab === 3 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Referral Program Settings
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
                                                    Program Configuration
                                                </Typography>

                                                <Box sx={{ mb: 3 }}>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                                        Program Status
                                                    </Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={programSettings.programStatus === 'active'}
                                                                sx={{
                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                        color: '#10b981',
                                                                        '& + .MuiSwitch-track': {
                                                                            backgroundColor: '#10b981',
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        label={
                                                            <Chip
                                                                label={programSettings.programStatus}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: programSettings.programStatus === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                                    color: programSettings.programStatus === 'active' ? '#10b981' : '#ef4444',
                                                                    textTransform: 'capitalize',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            />
                                                        }
                                                        sx={{ color: 'white' }}
                                                    />
                                                </Box>

                                                <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                                            Commission Rate
                                                        </Typography>
                                                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                            {programSettings.commissionRate}%
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                                            Max Reward Amount
                                                        </Typography>
                                                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                            ${programSettings.maxRewardAmount.toLocaleString()}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                                            Referral Validity
                                                        </Typography>
                                                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                            {programSettings.referralValidityDays} days
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                                            Minimum Investment
                                                        </Typography>
                                                        <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                            ${programSettings.minimumInvestment.toLocaleString()}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
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
                                                    Program Statistics
                                                </Typography>

                                                <Box sx={{ mb: 3 }}>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                                                        Monthly Performance
                                                    </Typography>
                                                    {analyticsData.monthlyTrends.map((month, index) => (
                                                        <Box key={index} sx={{ mb: 2 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {month.month} 2024
                                                                </Typography>
                                                                <Typography sx={{ color: '#60a5fa' }}>
                                                                    ${month.rewards.toLocaleString()}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', mb: 1 }}>
                                                                {month.referrals} referrals • {month.conversions} conversions
                                                            </Typography>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={(month.conversions / month.referrals) * 100}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                                    '& .MuiLinearProgress-bar': { backgroundColor: '#60a5fa' }
                                                                }}
                                                            />
                                                        </Box>
                                                    ))}
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
                <MenuItem onClick={handleApproveReward}>
                    <CheckCircle sx={{ mr: 1 }} />
                    Approve Reward
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Edit sx={{ mr: 1 }} />
                    Edit Referral
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1 }} />
                    Export Details
                </MenuItem>
            </Menu>

            {/* Reward Approval Dialog */}
            <Dialog
                open={rewardDialogOpen}
                onClose={() => setRewardDialogOpen(false)}
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
                        Approve Referral Reward
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Reward approval functionality will be implemented here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setRewardDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckCircle />}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            }
                        }}
                    >
                        Approve Reward
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Referral Details Dialog */}
            <Dialog
                open={referralDetailsDialogOpen}
                onClose={() => setReferralDetailsDialogOpen(false)}
                maxWidth="lg"
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
                        Referral Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Detailed referral information will be displayed here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setReferralDetailsDialogOpen(false)}
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
                        Export Details
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReferralManagement;
