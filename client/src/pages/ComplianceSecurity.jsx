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
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    Security,
    Shield,
    Assignment,
    Visibility,
    Search,
    MoreVert,
    Edit,
    Download,
    Lock,
    LockOpen,
    Person,
    Group,
    Login,
    VpnKey,
    Warning,
    CheckCircle,
    Cancel,
    History,
    AdminPanelSettings,
    VerifiedUser,
    Gavel,
    MonitorHeart,
    InsertDriveFile,
} from '@mui/icons-material';

const ComplianceSecurity = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [filterSecurityEvent, setFilterSecurityEvent] = useState('all');

    // Dialog states
    const [accessDialogOpen, setAccessDialogOpen] = useState(false);
    const [logDetailsDialogOpen, setLogDetailsDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Mock data for system logs
    const [systemLogs] = useState([
        {
            id: 1,
            timestamp: '2024-03-15 14:30:25',
            userId: 1,
            userName: 'Admin User',
            userRole: 'admin',
            action: 'client_created',
            actionDescription: 'Created new client account for John Smith',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            severity: 'info',
            module: 'Client Management',
            details: {
                clientId: 5,
                clientName: 'John Smith',
                investmentAmount: 50000
            }
        },
        {
            id: 2,
            timestamp: '2024-03-15 13:45:12',
            userId: 2,
            userName: 'Manager Smith',
            userRole: 'manager',
            action: 'document_approved',
            actionDescription: 'Approved KYC document for Sarah Johnson',
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            severity: 'info',
            module: 'KYC Management',
            details: {
                documentId: 15,
                clientId: 2,
                documentType: 'passport'
            }
        },
        {
            id: 3,
            timestamp: '2024-03-15 12:20:08',
            userId: 1,
            userName: 'Admin User',
            userRole: 'admin',
            action: 'permission_modified',
            actionDescription: 'Modified user permissions for Agent Johnson',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            severity: 'warning',
            module: 'User Management',
            details: {
                targetUserId: 3,
                targetUserName: 'Agent Johnson',
                permissionsAdded: ['view_reports'],
                permissionsRemoved: ['edit_clients']
            }
        },
        {
            id: 4,
            timestamp: '2024-03-15 11:15:33',
            userId: 3,
            userName: 'Agent Johnson',
            userRole: 'agent',
            action: 'failed_access_attempt',
            actionDescription: 'Attempted to access financial reports without permission',
            ipAddress: '192.168.1.102',
            userAgent: 'Mozilla/5.0 (Linux; Android 10)',
            severity: 'error',
            module: 'Security',
            details: {
                attemptedResource: '/financial-reports',
                deniedReason: 'Insufficient permissions'
            }
        }
    ]);

    // Mock data for user access management
    const [userAccess] = useState([
        {
            id: 1,
            userId: 1,
            userName: 'Admin User',
            email: 'admin@imvest.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2024-03-15 14:30:00',
            permissions: ['all'],
            accountCreated: '2023-01-15',
            lastPermissionChange: '2023-01-15',
            loginAttempts: 0,
            accountLocked: false
        },
        {
            id: 2,
            userId: 2,
            userName: 'Manager Smith',
            email: 'manager@imvest.com',
            role: 'manager',
            status: 'active',
            lastLogin: '2024-03-15 13:45:00',
            permissions: ['view_clients', 'edit_clients', 'approve_documents', 'view_reports'],
            accountCreated: '2023-02-01',
            lastPermissionChange: '2024-01-10',
            loginAttempts: 0,
            accountLocked: false
        },
        {
            id: 3,
            userId: 3,
            userName: 'Agent Johnson',
            email: 'agent@imvest.com',
            role: 'agent',
            status: 'active',
            lastLogin: '2024-03-15 11:15:00',
            permissions: ['view_clients', 'view_reports'],
            accountCreated: '2023-03-15',
            lastPermissionChange: '2024-03-15',
            loginAttempts: 2,
            accountLocked: false
        },
        {
            id: 4,
            userId: 4,
            userName: 'Support User',
            email: 'support@imvest.com',
            role: 'support',
            status: 'inactive',
            lastLogin: '2024-02-28 16:20:00',
            permissions: ['view_clients'],
            accountCreated: '2023-06-01',
            lastPermissionChange: '2023-06-01',
            loginAttempts: 0,
            accountLocked: true
        }
    ]);

    // Mock data for compliance monitoring
    const [complianceData] = useState({
        totalClients: 45,
        kycCompleted: 38,
        kycPending: 5,
        kycIncomplete: 2,
        documentsTotal: 180,
        documentsVerified: 165,
        documentsPending: 12,
        documentsRejected: 3,
        complianceScore: 91.5,
        riskDistribution: {
            low: 32,
            medium: 10,
            high: 3
        }
    });

    // Mock data for security monitoring
    const [securityEvents] = useState([
        {
            id: 1,
            eventType: 'login_success',
            timestamp: '2024-03-15 14:30:25',
            userId: 1,
            userName: 'Admin User',
            ipAddress: '192.168.1.100',
            location: 'New York, US',
            severity: 'info',
            description: 'Successful login'
        },
        {
            id: 2,
            eventType: 'login_failed',
            timestamp: '2024-03-15 13:22:18',
            userId: null,
            userName: 'Unknown',
            ipAddress: '203.45.67.89',
            location: 'Unknown Location',
            severity: 'warning',
            description: 'Failed login attempt with email: admin@imvest.com'
        },
        {
            id: 3,
            eventType: 'password_reset',
            timestamp: '2024-03-15 12:15:33',
            userId: 3,
            userName: 'Agent Johnson',
            ipAddress: '192.168.1.102',
            location: 'London, UK',
            severity: 'info',
            description: 'Password reset requested and completed'
        },
        {
            id: 4,
            eventType: 'suspicious_activity',
            timestamp: '2024-03-15 11:45:22',
            userId: null,
            userName: 'Unknown',
            ipAddress: '124.56.78.90',
            location: 'Unknown Location',
            severity: 'error',
            description: 'Multiple failed login attempts detected'
        },
        {
            id: 5,
            eventType: 'account_locked',
            timestamp: '2024-03-15 10:30:15',
            userId: 4,
            userName: 'Support User',
            ipAddress: '192.168.1.105',
            location: 'Berlin, DE',
            severity: 'warning',
            description: 'Account locked due to excessive failed login attempts'
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

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'info':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'error':
                return <Cancel />;
            case 'warning':
                return <Warning />;
            case 'info':
                return <CheckCircle />;
            default:
                return <CheckCircle />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return '#ef4444';
            case 'manager':
                return '#8b5cf6';
            case 'agent':
                return '#3b82f6';
            case 'support':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return '#10b981';
            case 'inactive':
                return '#f59e0b';
            case 'suspended':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const handleGrantAccess = () => {
        setAccessDialogOpen(true);
        handleCloseActionMenu();
    };

    const handleViewDetails = () => {
        setLogDetailsDialogOpen(true);
        handleCloseActionMenu();
    };

    // Filter functions
    const filteredSystemLogs = systemLogs.filter(log => {
        const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.module.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAction = filterAction === 'all' || log.action === filterAction;
        return matchesSearch && matchesAction;
    });

    const filteredUserAccess = userAccess.filter(user => {
        const matchesSearch = user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const filteredSecurityEvents = securityEvents.filter(event => {
        const matchesSearch = event.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.ipAddress.includes(searchQuery);
        const matchesEventType = filterSecurityEvent === 'all' || event.eventType === filterSecurityEvent;
        return matchesSearch && matchesEventType;
    });

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Compliance & Security Management
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
                                <VerifiedUser sx={{ fontSize: 40, color: '#4ade80', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {complianceData.complianceScore}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Compliance Score
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
                                <Shield sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {userAccess.filter(u => u.status === 'active').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Active Users
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
                                <Warning sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {securityEvents.filter(e => e.severity === 'warning' || e.severity === 'error').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Security Alerts
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
                                <InsertDriveFile sx={{ fontSize: 40, color: '#a855f7', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {systemLogs.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    System Logs
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
                        <Tab icon={<History />} label="System Logs" iconPosition="start" />
                        <Tab icon={<AdminPanelSettings />} label="Access Management" iconPosition="start" />
                        <Tab icon={<Gavel />} label="Compliance Monitoring" iconPosition="start" />
                        <Tab icon={<MonitorHeart />} label="Security Monitoring" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search logs, users, or events..."
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
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Action Type</InputLabel>
                                <Select
                                    value={filterAction}
                                    label="Action Type"
                                    onChange={(e) => setFilterAction(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                    }}
                                >
                                    <MenuItem value="all">All Actions</MenuItem>
                                    <MenuItem value="client_created">Client Created</MenuItem>
                                    <MenuItem value="document_approved">Document Approved</MenuItem>
                                    <MenuItem value="permission_modified">Permission Modified</MenuItem>
                                    <MenuItem value="failed_access_attempt">Failed Access</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {activeTab === 1 && (
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Role</InputLabel>
                                <Select
                                    value={filterRole}
                                    label="Role"
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                    }}
                                >
                                    <MenuItem value="all">All Roles</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="manager">Manager</MenuItem>
                                    <MenuItem value="agent">Agent</MenuItem>
                                    <MenuItem value="support">Support</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {activeTab === 3 && (
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Event Type</InputLabel>
                                <Select
                                    value={filterSecurityEvent}
                                    label="Event Type"
                                    onChange={(e) => setFilterSecurityEvent(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                    }}
                                >
                                    <MenuItem value="all">All Events</MenuItem>
                                    <MenuItem value="login_success">Login Success</MenuItem>
                                    <MenuItem value="login_failed">Login Failed</MenuItem>
                                    <MenuItem value="password_reset">Password Reset</MenuItem>
                                    <MenuItem value="suspicious_activity">Suspicious Activity</MenuItem>
                                    <MenuItem value="account_locked">Account Locked</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Box sx={{ flexGrow: 1 }} />

                        {activeTab === 1 && (
                            <Button
                                variant="contained"
                                startIcon={<Person />}
                                onClick={handleGrantAccess}
                                sx={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    }
                                }}
                            >
                                Grant Access
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
                    {/* SYSTEM LOGS TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                System Activity Logs
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Timestamp
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                User & Role
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Action
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Module
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Severity
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                IP Address
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSystemLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                        {log.timestamp}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {log.userName}
                                                        </Typography>
                                                        <Chip
                                                            label={log.userRole}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: `${getRoleColor(log.userRole)}20`,
                                                                color: getRoleColor(log.userRole),
                                                                textTransform: 'capitalize',
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {log.action.replace('_', ' ')}
                                                    </Typography>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                        {log.actionDescription}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {log.module}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getSeverityIcon(log.severity)}
                                                        label={log.severity}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getSeverityColor(log.severity)}20`,
                                                            color: getSeverityColor(log.severity),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                        {log.ipAddress}
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

                    {/* ACCESS MANAGEMENT TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                User Access Management
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                User
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Role & Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Permissions
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Last Login
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Account Security
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUserAccess.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: getRoleColor(user.role), width: 40, height: 40 }}>
                                                            {user.userName.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {user.userName}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        <Chip
                                                            label={user.role}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: `${getRoleColor(user.role)}20`,
                                                                color: getRoleColor(user.role),
                                                                textTransform: 'capitalize',
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                        <Chip
                                                            label={user.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: `${getStatusColor(user.status)}20`,
                                                                color: getStatusColor(user.status),
                                                                textTransform: 'capitalize'
                                                            }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {user.permissions.map((permission, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={permission.replace('_', ' ')}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                                                    color: '#60a5fa',
                                                                    fontSize: '0.75rem'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(user.lastLogin).toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: user.accountLocked ? '#ef4444' : '#10b981' }}>
                                                            {user.accountLocked ? 'Locked' : 'Active'}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                                                            Failed attempts: {user.loginAttempts}
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

                    {/* COMPLIANCE MONITORING TAB */}
                    {activeTab === 2 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Compliance Monitoring Dashboard
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
                                                    KYC Verification Status
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ color: '#10b981' }}>Completed</Typography>
                                                        <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                            {complianceData.kycCompleted}/{complianceData.totalClients}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(complianceData.kycCompleted / complianceData.totalClients) * 100}
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
                                                            {complianceData.kycPending}/{complianceData.totalClients}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(complianceData.kycPending / complianceData.totalClients) * 100}
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
                                                        <Typography sx={{ color: '#ef4444' }}>Incomplete</Typography>
                                                        <Typography sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                            {complianceData.kycIncomplete}/{complianceData.totalClients}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(complianceData.kycIncomplete / complianceData.totalClients) * 100}
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
                                    <div className="col-lg-6">
                                        <Card sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '15px'
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                                                    Document Verification
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ color: '#10b981' }}>Verified</Typography>
                                                        <Typography sx={{ color: '#10b981', fontWeight: 'bold' }}>
                                                            {complianceData.documentsVerified}/{complianceData.documentsTotal}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(complianceData.documentsVerified / complianceData.documentsTotal) * 100}
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
                                                        <Typography sx={{ color: '#f59e0b' }}>Pending Review</Typography>
                                                        <Typography sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                                                            {complianceData.documentsPending}/{complianceData.documentsTotal}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(complianceData.documentsPending / complianceData.documentsTotal) * 100}
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
                                                        <Typography sx={{ color: '#ef4444' }}>Rejected</Typography>
                                                        <Typography sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                                                            {complianceData.documentsRejected}/{complianceData.documentsTotal}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(complianceData.documentsRejected / complianceData.documentsTotal) * 100}
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
                                </div>
                            </div>
                        </>
                    )}

                    {/* SECURITY MONITORING TAB */}
                    {activeTab === 3 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Security Monitoring Dashboard
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Timestamp
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Event Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                User
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                IP Address & Location
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Severity
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Description
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSecurityEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                        {event.timestamp}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={event.eventType === 'login_success' ? <Login /> :
                                                            event.eventType === 'login_failed' ? <Cancel /> :
                                                                event.eventType === 'password_reset' ? <VpnKey /> :
                                                                    event.eventType === 'account_locked' ? <Lock /> : <Warning />}
                                                        label={event.eventType.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: event.eventType === 'login_success' ? 'rgba(16, 185, 129, 0.2)' :
                                                                event.eventType === 'login_failed' ? 'rgba(239, 68, 68, 0.2)' :
                                                                    event.eventType === 'password_reset' ? 'rgba(59, 130, 246, 0.2)' :
                                                                        'rgba(245, 158, 11, 0.2)',
                                                            color: event.eventType === 'login_success' ? '#10b981' :
                                                                event.eventType === 'login_failed' ? '#ef4444' :
                                                                    event.eventType === 'password_reset' ? '#3b82f6' : '#f59e0b',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {event.userName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                                                            {event.ipAddress}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                                                            {event.location}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getSeverityIcon(event.severity)}
                                                        label={event.severity}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getSeverityColor(event.severity)}20`,
                                                            color: getSeverityColor(event.severity),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {event.description}
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
                <MenuItem onClick={handleViewDetails}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Edit sx={{ mr: 1 }} />
                    Edit Permissions
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Lock sx={{ mr: 1 }} />
                    Lock Account
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <LockOpen sx={{ mr: 1 }} />
                    Unlock Account
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1 }} />
                    Export Log
                </MenuItem>
            </Menu>

            {/* Access Management Dialog */}
            <Dialog
                open={accessDialogOpen}
                onClose={() => setAccessDialogOpen(false)}
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
                        Grant/Modify User Access
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        User access management functionality will be implemented here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setAccessDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Security />}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Access
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Log Details Dialog */}
            <Dialog
                open={logDetailsDialogOpen}
                onClose={() => setLogDetailsDialogOpen(false)}
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
                        Log Entry Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Detailed log information will be displayed here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setLogDetailsDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Close
                    </Button>
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
                        Export Details
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ComplianceSecurity;
