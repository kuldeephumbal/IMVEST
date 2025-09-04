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
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    Analytics,
    TrendingUp,
    TrendingDown,
    Assessment,
    PieChart,
    BarChart,
    Search,
    FilterList,
    MoreVert,
    Visibility,
    Download,
    DateRange,
    Person,
    AccountBalance,
    MonetizationOn,
    Timeline,
    ShowChart,
    Insights,
    CalendarToday,
    AttachMoney,
    CompareArrows,
    Print,
    FileDownload,
} from '@mui/icons-material';

const FinancialReports = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('monthly');
    const [filterPlanType, setFilterPlanType] = useState('all');

    // Dialog states
    const [reportDialogOpen, setReportDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Mock data for real-time performance
    const [performanceData] = useState({
        totalPortfolioValue: 2485000,
        totalInvestments: 1950000,
        totalReturns: 535000,
        returnPercentage: 27.44,
        monthlyGrowth: 3.2,
        yearlyGrowth: 24.8,
        activeClients: 45,
        avgInvestmentPerClient: 55222
    });

    // Mock data for interest accrual tracking
    const [interestAccruals] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            planType: 'Premium Growth',
            principalAmount: 50000,
            interestRate: 12.5,
            accruedInterest: 6250,
            lastAccrual: '2024-03-15',
            nextAccrual: '2024-04-15',
            totalEarnings: 18750,
            status: 'active'
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            planType: 'Standard Plan',
            principalAmount: 75000,
            interestRate: 10.0,
            accruedInterest: 7500,
            lastAccrual: '2024-03-10',
            nextAccrual: '2024-04-10',
            totalEarnings: 22500,
            status: 'active'
        },
        {
            id: 3,
            clientId: 3,
            clientName: 'Michael Brown',
            planType: 'High Yield',
            principalAmount: 100000,
            interestRate: 15.0,
            accruedInterest: 15000,
            lastAccrual: '2024-03-12',
            nextAccrual: '2024-04-12',
            totalEarnings: 45000,
            status: 'active'
        },
        {
            id: 4,
            clientId: 4,
            clientName: 'Emily Davis',
            planType: 'Conservative',
            principalAmount: 30000,
            interestRate: 8.0,
            accruedInterest: 2400,
            lastAccrual: '2024-03-08',
            nextAccrual: '2024-04-08',
            totalEarnings: 7200,
            status: 'active'
        }
    ]);

    // Mock data for profitability analysis
    const [profitabilityData] = useState({
        byPlanType: [
            {
                planType: 'Premium Growth',
                totalInvestments: 450000,
                totalReturns: 135000,
                profitMargin: 30.0,
                clientCount: 12,
                avgROI: 30.0
            },
            {
                planType: 'High Yield',
                totalInvestments: 620000,
                totalReturns: 186000,
                profitMargin: 30.0,
                clientCount: 8,
                avgROI: 30.0
            },
            {
                planType: 'Standard Plan',
                totalInvestments: 580000,
                totalReturns: 145000,
                profitMargin: 25.0,
                clientCount: 18,
                avgROI: 25.0
            },
            {
                planType: 'Conservative',
                totalInvestments: 300000,
                totalReturns: 69000,
                profitMargin: 23.0,
                clientCount: 7,
                avgROI: 23.0
            }
        ],
        byClientSegment: [
            {
                segment: 'High Net Worth',
                totalInvestments: 800000,
                totalReturns: 240000,
                clientCount: 8,
                avgInvestment: 100000,
                profitability: 30.0
            },
            {
                segment: 'Mid-tier',
                totalInvestments: 750000,
                totalReturns: 187500,
                clientCount: 20,
                avgInvestment: 37500,
                profitability: 25.0
            },
            {
                segment: 'Entry Level',
                totalInvestments: 400000,
                totalReturns: 92000,
                clientCount: 17,
                avgInvestment: 23529,
                profitability: 23.0
            }
        ]
    });

    // Mock data for historical reports
    const [historicalReports] = useState([
        {
            id: 1,
            period: 'March 2024',
            type: 'monthly',
            totalInvestments: 1950000,
            totalReturns: 535000,
            newClients: 3,
            clientRetention: 96.7,
            profitMargin: 27.4,
            generatedDate: '2024-03-31'
        },
        {
            id: 2,
            period: 'Q1 2024',
            type: 'quarterly',
            totalInvestments: 5400000,
            totalReturns: 1458000,
            newClients: 12,
            clientRetention: 94.2,
            profitMargin: 27.0,
            generatedDate: '2024-03-31'
        },
        {
            id: 3,
            period: '2023',
            type: 'annual',
            totalInvestments: 18500000,
            totalReturns: 4625000,
            newClients: 38,
            clientRetention: 91.8,
            profitMargin: 25.0,
            generatedDate: '2023-12-31'
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatPercentage = (value) => {
        return `${value.toFixed(2)}%`;
    };

    const getPerformanceColor = (value) => {
        if (value >= 25) return '#10b981';
        if (value >= 15) return '#f59e0b';
        return '#ef4444';
    };

    const getPlanTypeColor = (planType) => {
        switch (planType) {
            case 'Premium Growth':
                return '#8b5cf6';
            case 'High Yield':
                return '#10b981';
            case 'Standard Plan':
                return '#3b82f6';
            case 'Conservative':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    };

    // Filter functions
    const filteredInterestAccruals = interestAccruals.filter(accrual => {
        const matchesSearch = accrual.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            accrual.planType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlanType = filterPlanType === 'all' || accrual.planType === filterPlanType;
        return matchesSearch && matchesPlanType;
    });

    const filteredHistoricalReports = historicalReports.filter(report => {
        const matchesPeriod = filterPeriod === 'all' || report.type === filterPeriod;
        return matchesPeriod;
    });

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Financial Reports & Analytics
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Performance Summary Cards */}
            <div className="container-fluid mb-4">
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
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {formatCurrency(performanceData.totalPortfolioValue)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Portfolio Value
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
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {formatPercentage(performanceData.returnPercentage)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Return Rate
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
                                <MonetizationOn sx={{ fontSize: 40, color: '#a855f7', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {formatCurrency(performanceData.totalReturns)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Returns
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
                                <Person sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {performanceData.activeClients}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Active Clients
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
                        <Tab icon={<Analytics />} label="Real-time Performance" iconPosition="start" />
                        <Tab icon={<Timeline />} label="Interest Accrual" iconPosition="start" />
                        <Tab icon={<Assessment />} label="Profitability Analysis" iconPosition="start" />
                        <Tab icon={<BarChart />} label="Historical Reports" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search reports, clients, or plan types..."
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

                        {(activeTab === 1 || activeTab === 2) && (
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Plan Type</InputLabel>
                                <Select
                                    value={filterPlanType}
                                    label="Plan Type"
                                    onChange={(e) => setFilterPlanType(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                    }}
                                >
                                    <MenuItem value="all">All Plans</MenuItem>
                                    <MenuItem value="Premium Growth">Premium Growth</MenuItem>
                                    <MenuItem value="High Yield">High Yield</MenuItem>
                                    <MenuItem value="Standard Plan">Standard Plan</MenuItem>
                                    <MenuItem value="Conservative">Conservative</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {activeTab === 3 && (
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
                                    <MenuItem value="all">All Periods</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                    <MenuItem value="annual">Annual</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            variant="contained"
                            startIcon={<Print />}
                            sx={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                                }
                            }}
                        >
                            Print Report
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<FileDownload />}
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
                    {/* REAL-TIME PERFORMANCE TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Real-time Investment Performance
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
                                                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                                    Monthly Growth Trend
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <TrendingUp sx={{ color: '#10b981' }} />
                                                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                        {formatPercentage(performanceData.monthlyGrowth)}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={performanceData.monthlyGrowth * 10}
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#10b981'
                                                        }
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                                                    vs previous month
                                                </Typography>
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
                                                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                                    Annual Performance
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <ShowChart sx={{ color: '#60a5fa' }} />
                                                    <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                        {formatPercentage(performanceData.yearlyGrowth)}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={performanceData.yearlyGrowth}
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#60a5fa'
                                                        }
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                                                    year-to-date performance
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* INTEREST ACCRUAL TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Interest Accrual Tracking
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client & Plan
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Principal Amount
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Interest Rate
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Accrued Interest
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Total Earnings
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Next Accrual
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredInterestAccruals.map((accrual) => (
                                            <TableRow key={accrual.id}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {accrual.clientName}
                                                        </Typography>
                                                        <Chip
                                                            label={accrual.planType}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: `${getPlanTypeColor(accrual.planType)}20`,
                                                                color: getPlanTypeColor(accrual.planType),
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {formatCurrency(accrual.principalAmount)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                        {formatPercentage(accrual.interestRate)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                        {formatCurrency(accrual.accruedInterest)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#a855f7', fontWeight: 'bold' }}>
                                                        {formatCurrency(accrual.totalEarnings)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(accrual.nextAccrual).toLocaleDateString()}
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

                    {/* PROFITABILITY ANALYSIS TAB */}
                    {activeTab === 2 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Profitability Analysis
                            </Typography>

                            <div className="container-fluid">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                            Performance by Plan Type
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Plan Type
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Total Investments
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Total Returns
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            ROI
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Client Count
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Performance
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {profitabilityData.byPlanType.map((plan, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <Chip
                                                                    label={plan.planType}
                                                                    sx={{
                                                                        backgroundColor: `${getPlanTypeColor(plan.planType)}20`,
                                                                        color: getPlanTypeColor(plan.planType),
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {formatCurrency(plan.totalInvestments)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                                    {formatCurrency(plan.totalReturns)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: getPerformanceColor(plan.avgROI), fontWeight: 'bold' }}>
                                                                    {formatPercentage(plan.avgROI)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                    {plan.clientCount}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={plan.avgROI}
                                                                    sx={{
                                                                        height: 8,
                                                                        borderRadius: 4,
                                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            backgroundColor: getPerformanceColor(plan.avgROI)
                                                                        }
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                            Performance by Client Segment
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Client Segment
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Total Investments
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Total Returns
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Client Count
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Avg Investment
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                            Profitability
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {profitabilityData.byClientSegment.map((segment, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {segment.segment}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {formatCurrency(segment.totalInvestments)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                                    {formatCurrency(segment.totalReturns)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                    {segment.clientCount}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                                    {formatCurrency(segment.avgInvestment)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <Typography sx={{ color: getPerformanceColor(segment.profitability), fontWeight: 'bold' }}>
                                                                        {formatPercentage(segment.profitability)}
                                                                    </Typography>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={segment.profitability}
                                                                        sx={{
                                                                            width: 60,
                                                                            height: 6,
                                                                            borderRadius: 3,
                                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                backgroundColor: getPerformanceColor(segment.profitability)
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* HISTORICAL REPORTS TAB */}
                    {activeTab === 3 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Historical Financial Reports
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Period
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Total Investments
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Total Returns
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Profit Margin
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                New Clients
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Retention Rate
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredHistoricalReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {report.period}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={report.type}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: report.type === 'monthly' ? 'rgba(59, 130, 246, 0.2)' :
                                                                report.type === 'quarterly' ? 'rgba(34, 197, 94, 0.2)' :
                                                                    'rgba(139, 92, 246, 0.2)',
                                                            color: report.type === 'monthly' ? '#60a5fa' :
                                                                report.type === 'quarterly' ? '#10b981' : '#a855f7',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {formatCurrency(report.totalInvestments)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                        {formatCurrency(report.totalReturns)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: getPerformanceColor(report.profitMargin), fontWeight: 'bold' }}>
                                                        {formatPercentage(report.profitMargin)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                        {report.newClients}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: '#a855f7', fontWeight: 'bold' }}>
                                                        {formatPercentage(report.clientRetention)}
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
                <MenuItem onClick={handleCloseActionMenu}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1 }} />
                    Download Report
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Print sx={{ mr: 1 }} />
                    Print Report
                </MenuItem>
            </Menu>

            {/* Report Generation Dialog */}
            <Dialog
                open={reportDialogOpen}
                onClose={() => setReportDialogOpen(false)}
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
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Custom report generation functionality will be implemented here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setReportDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FileDownload />}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
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

export default FinancialReports;
