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
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    Security,
    VerifiedUser,
    Flag,
    Search,
    MoreVert,
    Visibility,
    Edit,
    Download,
    CheckCircle,
    Cancel,
    Pending,
    Assignment,
    CloudUpload,
    Description,
    Image,
    PictureAsPdf,
    RemoveRedEye,
    Check,
    Block,
    Person,
} from '@mui/icons-material';

const Monitoring = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterVerificationType, setFilterVerificationType] = useState('all');

    // Dialog states
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Mock data for verification status
    const [verificationStatuses] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            email: 'john@example.com',
            kycStatus: 'verified',
            identityVerification: 'verified',
            addressVerification: 'pending',
            phoneVerification: 'verified',
            documentsSubmitted: 4,
            documentsVerified: 3,
            lastUpdate: '2024-03-15',
            riskLevel: 'low',
            complianceScore: 92
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            email: 'sarah@example.com',
            kycStatus: 'pending',
            identityVerification: 'verified',
            addressVerification: 'verified',
            phoneVerification: 'pending',
            documentsSubmitted: 3,
            documentsVerified: 2,
            lastUpdate: '2024-03-12',
            riskLevel: 'medium',
            complianceScore: 78
        },
        {
            id: 3,
            clientId: 3,
            clientName: 'Michael Brown',
            email: 'michael@example.com',
            kycStatus: 'incomplete',
            identityVerification: 'rejected',
            addressVerification: 'not_submitted',
            phoneVerification: 'verified',
            documentsSubmitted: 1,
            documentsVerified: 0,
            lastUpdate: '2024-03-10',
            riskLevel: 'high',
            complianceScore: 45
        },
        {
            id: 4,
            clientId: 4,
            clientName: 'Emily Davis',
            email: 'emily@example.com',
            kycStatus: 'verified',
            identityVerification: 'verified',
            addressVerification: 'verified',
            phoneVerification: 'verified',
            documentsSubmitted: 5,
            documentsVerified: 5,
            lastUpdate: '2024-03-08',
            riskLevel: 'low',
            complianceScore: 98
        }
    ]);

    // Mock data for flagged accounts
    const [flaggedAccounts] = useState([
        {
            id: 1,
            clientId: 3,
            clientName: 'Michael Brown',
            flagReason: 'Suspicious Transaction Pattern',
            flagType: 'transaction',
            severity: 'high',
            flaggedDate: '2024-03-10',
            flaggedBy: 'System Auto-Detection',
            status: 'under_review',
            description: 'Multiple large transactions in short timeframe',
            transactionCount: 15,
            totalAmount: 250000,
            reviewNotes: 'Pending manual review by compliance team'
        },
        {
            id: 2,
            clientId: 5,
            clientName: 'David Wilson',
            flagReason: 'Document Inconsistency',
            flagType: 'kyc',
            severity: 'medium',
            flaggedDate: '2024-03-08',
            flaggedBy: 'KYC Review Team',
            status: 'resolved',
            description: 'Address mismatch between documents',
            transactionCount: 0,
            totalAmount: 0,
            reviewNotes: 'Resolved after client provided updated documents'
        },
        {
            id: 3,
            clientId: 6,
            clientName: 'Lisa Anderson',
            flagReason: 'Unusual Login Activity',
            flagType: 'security',
            severity: 'low',
            flaggedDate: '2024-03-12',
            flaggedBy: 'Security System',
            status: 'pending',
            description: 'Login attempts from multiple locations',
            transactionCount: 0,
            totalAmount: 0,
            reviewNotes: ''
        }
    ]);

    // Mock data for ID documents
    const [idDocuments] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            documentType: 'passport',
            documentNumber: 'P123456789',
            fileName: 'john_passport.pdf',
            uploadDate: '2024-03-01',
            status: 'verified',
            reviewedBy: 'Admin User',
            reviewDate: '2024-03-02',
            expiryDate: '2026-05-15',
            fileSize: '2.1 MB',
            notes: 'Document verified successfully'
        },
        {
            id: 2,
            clientId: 1,
            clientName: 'John Smith',
            documentType: 'utility_bill',
            documentNumber: 'N/A',
            fileName: 'john_utility_bill.jpg',
            uploadDate: '2024-03-01',
            status: 'pending',
            reviewedBy: null,
            reviewDate: null,
            expiryDate: null,
            fileSize: '1.8 MB',
            notes: ''
        },
        {
            id: 3,
            clientId: 2,
            clientName: 'Sarah Johnson',
            documentType: 'drivers_license',
            documentNumber: 'DL987654321',
            fileName: 'sarah_license.png',
            uploadDate: '2024-03-05',
            status: 'rejected',
            reviewedBy: 'KYC Officer',
            reviewDate: '2024-03-06',
            expiryDate: '2027-08-20',
            fileSize: '3.2 MB',
            notes: 'Image quality too poor, please resubmit'
        },
        {
            id: 4,
            clientId: 3,
            clientName: 'Michael Brown',
            documentType: 'national_id',
            documentNumber: 'ID555444333',
            fileName: 'michael_id.pdf',
            uploadDate: '2024-03-10',
            status: 'under_review',
            reviewedBy: 'Compliance Team',
            reviewDate: null,
            expiryDate: '2025-12-31',
            fileSize: '1.5 MB',
            notes: 'Additional verification required'
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
            case 'verified':
            case 'resolved':
                return '#10b981';
            case 'pending':
            case 'under_review':
                return '#f59e0b';
            case 'rejected':
            case 'incomplete':
                return '#ef4444';
            case 'not_submitted':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
            case 'resolved':
                return <CheckCircle />;
            case 'pending':
            case 'under_review':
                return <Pending />;
            case 'rejected':
            case 'incomplete':
                return <Cancel />;
            case 'not_submitted':
                return <Assignment />;
            default:
                return <Assignment />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel) {
            case 'low':
                return '#10b981';
            case 'medium':
                return '#f59e0b';
            case 'high':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getDocumentTypeIcon = (documentType) => {
        switch (documentType) {
            case 'passport':
            case 'drivers_license':
            case 'national_id':
                return <Description />;
            case 'utility_bill':
            case 'bank_statement':
                return <PictureAsPdf />;
            default:
                return <Image />;
        }
    };

    const handleViewDocument = () => {
        // View document functionality would be implemented here
        handleCloseActionMenu();
    };

    const handleReviewDocument = () => {
        setReviewDialogOpen(true);
        handleCloseActionMenu();
    };

    const handleUploadDocument = () => {
        setUploadDialogOpen(true);
    };

    // Filter functions
    const filteredVerificationStatuses = verificationStatuses.filter(status => {
        const matchesSearch = status.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            status.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || status.kycStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredFlaggedAccounts = flaggedAccounts.filter(account => {
        const matchesSearch = account.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.flagReason.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredIdDocuments = idDocuments.filter(document => {
        const matchesSearch = document.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            document.documentType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || document.status === filterStatus;
        const matchesType = filterVerificationType === 'all' || document.documentType === filterVerificationType;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Client Monitoring & Verification
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
                                    {verificationStatuses.filter(s => s.kycStatus === 'verified').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Verified Clients
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
                                <Pending sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {verificationStatuses.filter(s => s.kycStatus === 'pending').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Pending Review
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
                                <Flag sx={{ fontSize: 40, color: '#f87171', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {flaggedAccounts.filter(a => a.status !== 'resolved').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Flagged Accounts
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
                                <Description sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {idDocuments.filter(d => d.status === 'pending' || d.status === 'under_review').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Documents to Review
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
                        <Tab icon={<Security />} label="Verification Status" iconPosition="start" />
                        <Tab icon={<Flag />} label="Flagged Accounts" iconPosition="start" />
                        <Tab icon={<Description />} label="ID Documents" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search clients, documents, or reasons..."
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
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="verified">Verified</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                                <MenuItem value="incomplete">Incomplete</MenuItem>
                                <MenuItem value="under_review">Under Review</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                            </Select>
                        </FormControl>

                        {activeTab === 2 && (
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Document Type</InputLabel>
                                <Select
                                    value={filterVerificationType}
                                    label="Document Type"
                                    onChange={(e) => setFilterVerificationType(e.target.value)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                    }}
                                >
                                    <MenuItem value="all">All Types</MenuItem>
                                    <MenuItem value="passport">Passport</MenuItem>
                                    <MenuItem value="drivers_license">Driver's License</MenuItem>
                                    <MenuItem value="national_id">National ID</MenuItem>
                                    <MenuItem value="utility_bill">Utility Bill</MenuItem>
                                    <MenuItem value="bank_statement">Bank Statement</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Box sx={{ flexGrow: 1 }} />

                        {activeTab === 2 && (
                            <Button
                                variant="contained"
                                startIcon={<CloudUpload />}
                                onClick={handleUploadDocument}
                                sx={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    }
                                }}
                            >
                                Upload Document
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
                    {/* VERIFICATION STATUS TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Client Verification Status
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                KYC Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Verification Progress
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Documents
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Risk Level
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Compliance Score
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Last Update
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredVerificationStatuses.map((status) => (
                                            <TableRow key={status.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: '#60a5fa', width: 40, height: 40 }}>
                                                            {status.clientName.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {status.clientName}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {status.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(status.kycStatus)}
                                                        label={status.kycStatus}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(status.kycStatus)}20`,
                                                            color: getStatusColor(status.kycStatus),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                            <Chip label="ID" size="small" sx={{ backgroundColor: `${getStatusColor(status.identityVerification)}20`, color: getStatusColor(status.identityVerification) }} />
                                                            <Chip label="Address" size="small" sx={{ backgroundColor: `${getStatusColor(status.addressVerification)}20`, color: getStatusColor(status.addressVerification) }} />
                                                            <Chip label="Phone" size="small" sx={{ backgroundColor: `${getStatusColor(status.phoneVerification)}20`, color: getStatusColor(status.phoneVerification) }} />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {status.documentsVerified}/{status.documentsSubmitted}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(status.documentsVerified / status.documentsSubmitted) * 100}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: '#10b981'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={status.riskLevel}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getRiskLevelColor(status.riskLevel)}20`,
                                                            color: getRiskLevelColor(status.riskLevel),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {status.complianceScore}%
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={status.complianceScore}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: status.complianceScore >= 80 ? '#10b981' : status.complianceScore >= 60 ? '#f59e0b' : '#ef4444'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(status.lastUpdate).toLocaleDateString()}
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

                    {/* FLAGGED ACCOUNTS TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Flagged Accounts for Review
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client & Flag Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Flag Reason
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Severity
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Transaction Info
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Flagged Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredFlaggedAccounts.map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {account.clientName}
                                                        </Typography>
                                                        <Chip
                                                            label={account.flagType}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: account.flagType === 'transaction' ? 'rgba(59, 130, 246, 0.2)' :
                                                                    account.flagType === 'kyc' ? 'rgba(139, 92, 246, 0.2)' :
                                                                        'rgba(239, 68, 68, 0.2)',
                                                                color: account.flagType === 'transaction' ? '#60a5fa' :
                                                                    account.flagType === 'kyc' ? '#a855f7' : '#ef4444',
                                                                textTransform: 'capitalize',
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {account.flagReason}
                                                        </Typography>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                            {account.description}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={account.severity}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getSeverityColor(account.severity)}20`,
                                                            color: getSeverityColor(account.severity),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={account.status.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(account.status)}20`,
                                                            color: getStatusColor(account.status),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {account.transactionCount > 0 ? (
                                                        <Box>
                                                            <Typography sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
                                                                {account.transactionCount} transactions
                                                            </Typography>
                                                            <Typography sx={{ color: '#10b981', fontSize: '0.875rem' }}>
                                                                ${account.totalAmount.toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            N/A
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(account.flaggedDate).toLocaleDateString()}
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

                    {/* ID DOCUMENTS TAB */}
                    {activeTab === 2 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                ID Documents Review
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Document & Client
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Document Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Upload Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Review Info
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                File Info
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredIdDocuments.map((document) => (
                                            <TableRow key={document.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                                            color: '#60a5fa'
                                                        }}>
                                                            {getDocumentTypeIcon(document.documentType)}
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {document.clientName}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                                                {document.fileName}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'white', textTransform: 'capitalize' }}>
                                                        {document.documentType.replace('_', ' ')}
                                                    </Typography>
                                                    {document.documentNumber !== 'N/A' && (
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                                                            {document.documentNumber}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(document.status)}
                                                        label={document.status.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(document.status)}20`,
                                                            color: getStatusColor(document.status),
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {new Date(document.uploadDate).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {document.reviewedBy ? (
                                                        <Box>
                                                            <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                                                                By: {document.reviewedBy}
                                                            </Typography>
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                                                                {new Date(document.reviewDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            Not reviewed
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                                            {document.fileSize}
                                                        </Typography>
                                                        {document.expiryDate && (
                                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                                                                Expires: {new Date(document.expiryDate).toLocaleDateString()}
                                                            </Typography>
                                                        )}
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
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
            >
                <MenuItem onClick={handleViewDocument}>
                    <RemoveRedEye sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleReviewDocument}>
                    <Edit sx={{ mr: 1 }} />
                    Review/Update
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Check sx={{ mr: 1 }} />
                    Approve
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Block sx={{ mr: 1 }} />
                    Reject
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1 }} />
                    Download
                </MenuItem>
            </Menu>

            {/* Document Upload Dialog */}
            <Dialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
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
                        Upload ID Document
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Document upload functionality will be implemented here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setUploadDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Upload Document
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Document Review Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
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
                        Document Review
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Document review interface will be implemented here.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setReviewDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Block />}
                        sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                            }
                        }}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Check />}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            }
                        }}
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Monitoring;
