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
    Alert,
    LinearProgress,
    Divider,
    Paper,
    InputAdornment,
    Autocomplete
} from '@mui/material';
import {
    Add,
    Upload,
    Edit,
    Delete,
    Visibility,
    Download,
    MoreVert,
    Search,
    FilterList,
    Description,
    Assignment,
    AccountBalance,
    CheckCircle,
    Cancel,
    Schedule,
    Warning,
    Notifications,
    CloudUpload,
    Send,
    FilePresent,
    Refresh,
    Print
} from '@mui/icons-material';

const ContractAndDocuments = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Dialog states
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [contractDialogOpen, setContractDialogOpen] = useState(false);
    const [editContractDialogOpen, setEditContractDialogOpen] = useState(false);
    const [depositApprovalOpen, setDepositApprovalOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Form states
    const [newContract, setNewContract] = useState({
        clientId: '',
        type: 'investment',
        investmentAmount: '',
        terms: '12',
        interestRate: '',
        startDate: '',
        endDate: ''
    });

    const [editContract, setEditContract] = useState({
        id: '',
        clientId: '',
        type: 'investment',
        investmentAmount: '',
        terms: '12',
        interestRate: '',
        startDate: '',
        endDate: ''
    });

    const [uploadData, setUploadData] = useState({
        file: null,
        clientId: '',
        documentType: 'contract',
        notes: ''
    });

    // Mock data
    const [clients] = useState([
        { id: 1, name: 'John Smith', email: 'john@example.com', avatar: '' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', avatar: '' },
        { id: 3, name: 'Michael Brown', email: 'michael@example.com', avatar: '' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', avatar: '' },
        { id: 5, name: 'David Wilson', email: 'david@example.com', avatar: '' }
    ]);

    const [contracts, setContracts] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            type: 'Investment Contract',
            amount: '$50,000',
            status: 'signed',
            createdDate: '2024-01-15',
            expiryDate: '2025-01-15',
            signaturesNeeded: 0,
            totalSignatures: 2,
            version: '1.2',
            lastUpdated: '2024-01-20'
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            type: 'Service Agreement',
            amount: '$25,000',
            status: 'pending',
            createdDate: '2024-02-01',
            expiryDate: '2025-02-01',
            signaturesNeeded: 1,
            totalSignatures: 2,
            version: '1.0',
            lastUpdated: '2024-02-01'
        },
        {
            id: 3,
            clientId: 3,
            clientName: 'Michael Brown',
            type: 'Investment Contract',
            amount: '$100,000',
            status: 'expired',
            createdDate: '2023-06-01',
            expiryDate: '2024-06-01',
            signaturesNeeded: 0,
            totalSignatures: 2,
            version: '1.1',
            lastUpdated: '2023-06-15'
        }
    ]);

    const [deposits, setDeposits] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            amount: '$10,000',
            type: 'Initial Deposit',
            status: 'pending',
            submittedDate: '2024-03-01',
            documents: ['bank_statement.pdf', 'deposit_slip.pdf'],
            notes: 'First investment deposit'
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            amount: '$5,000',
            type: 'Additional Deposit',
            status: 'approved',
            submittedDate: '2024-02-28',
            approvedDate: '2024-03-02',
            documents: ['transfer_receipt.pdf'],
            notes: 'Monthly investment increase'
        },
        {
            id: 3,
            clientId: 4,
            clientName: 'Emily Davis',
            amount: '$15,000',
            type: 'Initial Deposit',
            status: 'denied',
            submittedDate: '2024-02-25',
            deniedDate: '2024-02-26',
            documents: ['incomplete_form.pdf'],
            notes: 'Incomplete documentation',
            denialReason: 'Missing required documentation'
        }
    ]);

    const [renewals] = useState([
        {
            id: 1,
            contractId: 3,
            clientName: 'Michael Brown',
            originalAmount: '$100,000',
            expiryDate: '2024-06-01',
            daysUntilExpiry: -60,
            status: 'overdue',
            remindersSent: 3
        },
        {
            id: 2,
            contractId: 1,
            clientName: 'John Smith',
            originalAmount: '$50,000',
            expiryDate: '2025-01-15',
            daysUntilExpiry: 292,
            status: 'upcoming',
            remindersSent: 0
        }
    ]);

    // Tab content rendering
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleActionMenu = (event, document) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedDocument(document);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
        setSelectedDocument(null);
    };

    const handleEditContract = () => {
        if (selectedDocument) {
            // Populate edit form with selected contract data
            setEditContract({
                id: selectedDocument.id,
                clientId: selectedDocument.clientId.toString(),
                type: selectedDocument.type.toLowerCase().includes('investment') ? 'investment' : 'service',
                investmentAmount: selectedDocument.amount.replace('$', '').replace(',', ''),
                terms: '12', // Default or extract from existing data
                interestRate: '', // Extract from existing data if available
                startDate: selectedDocument.createdDate,
                endDate: selectedDocument.expiryDate
            });
            setEditContractDialogOpen(true);
        }
        handleCloseActionMenu();
    };

    const handleUpdateContract = () => {
        // Update the contract in the contracts array
        setContracts(prevContracts =>
            prevContracts.map(contract =>
                contract.id === parseInt(editContract.id)
                    ? {
                        ...contract,
                        clientId: parseInt(editContract.clientId),
                        clientName: clients.find(c => c.id === parseInt(editContract.clientId))?.name || contract.clientName,
                        type: editContract.type === 'investment' ? 'Investment Contract' : 'Service Agreement',
                        amount: `$${editContract.investmentAmount}`,
                        createdDate: editContract.startDate,
                        expiryDate: editContract.endDate,
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : contract
            )
        );
        setEditContractDialogOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'signed':
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'expired':
            case 'denied':
            case 'overdue':
                return 'error';
            case 'upcoming':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'signed':
            case 'approved':
                return <CheckCircle />;
            case 'pending':
                return <Schedule />;
            case 'expired':
            case 'denied':
            case 'overdue':
                return <Cancel />;
            case 'upcoming':
                return <Notifications />;
            default:
                return <Description />;
        }
    };

    const handleGenerateContract = () => {
        // Contract generation logic
        const contract = {
            id: contracts.length + 1,
            clientId: parseInt(newContract.clientId),
            clientName: clients.find(c => c.id === parseInt(newContract.clientId))?.name || '',
            type: newContract.type === 'investment' ? 'Investment Contract' : 'Service Agreement',
            amount: `$${parseFloat(newContract.investmentAmount).toLocaleString()}`,
            status: 'pending',
            createdDate: new Date().toISOString().split('T')[0],
            expiryDate: newContract.endDate,
            signaturesNeeded: 2,
            totalSignatures: 2,
            version: '1.0',
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        setContracts([...contracts, contract]);
        setContractDialogOpen(false);
        setNewContract({
            clientId: '',
            type: 'investment',
            investmentAmount: '',
            terms: '12',
            interestRate: '',
            startDate: '',
            endDate: ''
        });
    };

    const handleDepositAction = (depositId, action, reason = '') => {
        setDeposits(deposits.map(deposit => {
            if (deposit.id === depositId) {
                return {
                    ...deposit,
                    status: action,
                    [`${action}Date`]: new Date().toISOString().split('T')[0],
                    ...(action === 'denied' && reason && { denialReason: reason })
                };
            }
            return deposit;
        }));
        setDepositApprovalOpen(false);
    };

    const filteredContracts = contracts.filter(contract => {
        const matchesSearch = contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const filteredDeposits = deposits.filter(deposit => {
        const matchesSearch = deposit.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deposit.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || deposit.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Home / Contract & Documents
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Contract & Documents Management
            </Typography>

            {/* Summary Cards */}
            <div className="container-fluid mb-4 ">
                <div className="row">
                    <div className="col-12 col-md-3 mb-3">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '15px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Assignment sx={{ fontSize: 40, color: '#60a5fa', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {contracts.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total Contracts
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '15px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Schedule sx={{ fontSize: 40, color: '#fbbf24', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {contracts.filter(c => c.status === 'pending').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Pending Signatures
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '15px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <AccountBalance sx={{ fontSize: 40, color: '#34d399', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {deposits.filter(d => d.status === 'pending').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Pending Deposits
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '15px'
                        }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Warning sx={{ fontSize: 40, color: '#f87171', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {renewals.filter(r => r.status === 'overdue').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Overdue Renewals
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
            }}
            >
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
                        <Tab icon={<Assignment />} label="Contracts" iconPosition="start" />
                        <Tab icon={<AccountBalance />} label="Deposit Approvals" iconPosition="start" />
                        <Tab icon={<Refresh />} label="Contract Renewals" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search contracts, clients..."
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
                                <MenuItem value="signed">Signed</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="expired">Expired</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="denied">Denied</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ flexGrow: 1 }} />

                        {activeTab === 0 && (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<Upload />}
                                    onClick={() => setUploadDialogOpen(true)}
                                    sx={{
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            background: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Upload Document
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => setContractDialogOpen(true)}
                                    sx={{
                                        background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                        }
                                    }}
                                >
                                    Generate Contract
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Tab Content */}
                    {activeTab === 0 && (
                        // Contracts Tab
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Client
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Contract Type
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Amount
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Signatures
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Expiry Date
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredContracts.map((contract) => (
                                        <TableRow key={contract.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#60a5fa' }}>
                                                        {contract.clientName.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ color: 'white' }}>
                                                        {contract.clientName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {contract.type}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                    v{contract.version}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                    {contract.amount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(contract.status)}
                                                    label={contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                                    size="small"
                                                    color={getStatusColor(contract.status)}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(contract.totalSignatures - contract.signaturesNeeded) / contract.totalSignatures * 100}
                                                        sx={{
                                                            width: 60,
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: contract.signaturesNeeded === 0 ? '#4ade80' : '#fbbf24'
                                                            }
                                                        }}
                                                    />
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                        {contract.totalSignatures - contract.signaturesNeeded}/{contract.totalSignatures}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {new Date(contract.expiryDate).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    onClick={(e) => handleActionMenu(e, contract)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {activeTab === 1 && (
                        // Deposit Approvals Tab
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Client
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Amount
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Type
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Documents
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Submitted
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredDeposits.map((deposit) => (
                                        <TableRow key={deposit.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#34d399' }}>
                                                        {deposit.clientName.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ color: 'white' }}>
                                                        {deposit.clientName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {deposit.amount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {deposit.type}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(deposit.status)}
                                                    label={deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                                                    size="small"
                                                    color={getStatusColor(deposit.status)}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <FilePresent sx={{ color: '#60a5fa', fontSize: 20 }} />
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                        {deposit.documents.length} file(s)
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {new Date(deposit.submittedDate).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {deposit.status === 'pending' && (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: '#4ade80' }}
                                                            onClick={() => handleDepositAction(deposit.id, 'approved')}
                                                            title="Approve"
                                                        >
                                                            <CheckCircle />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: '#f87171' }}
                                                            onClick={() => {
                                                                setSelectedDocument(deposit);
                                                                setDepositApprovalOpen(true);
                                                            }}
                                                            title="Deny"
                                                        >
                                                            <Cancel />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    title="View Details"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {activeTab === 2 && (
                        // Contract Renewals Tab
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Client
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Original Amount
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Expiry Date
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Days Until Expiry
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Reminders Sent
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renewals.map((renewal) => (
                                        <TableRow key={renewal.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#f59e0b' }}>
                                                        {renewal.clientName.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ color: 'white' }}>
                                                        {renewal.clientName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                    {renewal.originalAmount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {new Date(renewal.expiryDate).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{
                                                    color: renewal.daysUntilExpiry < 0 ? '#f87171' :
                                                        renewal.daysUntilExpiry < 30 ? '#fbbf24' : '#4ade80',
                                                    fontWeight: 'medium'
                                                }}>
                                                    {renewal.daysUntilExpiry < 0 ?
                                                        `${Math.abs(renewal.daysUntilExpiry)} days overdue` :
                                                        `${renewal.daysUntilExpiry} days`
                                                    }
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(renewal.status)}
                                                    label={renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}
                                                    size="small"
                                                    color={getStatusColor(renewal.status)}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Notifications sx={{ color: '#60a5fa', fontSize: 16 }} />
                                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {renewal.remindersSent}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#60a5fa' }}
                                                        title="Send Reminder"
                                                    >
                                                        <Send />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#34d399' }}
                                                        onClick={() => console.log('Renew contract for:', renewal.clientName)}
                                                        title="Renew Contract"
                                                    >
                                                        <Refresh />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleCloseActionMenu}>
                    <Visibility sx={{ mr: 1, fontSize: 18 }} />
                    View Contract
                </MenuItem>
                <MenuItem onClick={handleEditContract}>
                    <Edit sx={{ mr: 1, fontSize: 18 }} />
                    Edit Contract
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Download sx={{ mr: 1, fontSize: 18 }} />
                    Download PDF
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Send sx={{ mr: 1, fontSize: 18 }} />
                    Send for Signature
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Print sx={{ mr: 1, fontSize: 18 }} />
                    Print Contract
                </MenuItem>
            </Menu>

            {/* Upload Document Dialog */}
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
                        Upload Document
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Autocomplete
                                        options={clients}
                                        getOptionLabel={(option) => option.name}
                                        value={clients.find(c => c.id === uploadData.clientId) || null}
                                        onChange={(event, newValue) => {
                                            setUploadData({ ...uploadData, clientId: newValue?.id || '' });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Client"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        '&.Mui-focused': { color: '#60a5fa' }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Document Type</InputLabel>
                                        <Select
                                            value={uploadData.documentType}
                                            label="Document Type"
                                            onChange={(e) => setUploadData({ ...uploadData, documentType: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="contract">Contract</MenuItem>
                                            <MenuItem value="amendment">Amendment</MenuItem>
                                            <MenuItem value="addendum">Addendum</MenuItem>
                                            <MenuItem value="termination">Termination</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <Box
                                        sx={{
                                            border: '2px dashed rgba(255, 255, 255, 0.3)',
                                            borderRadius: '10px',
                                            p: 4,
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        <CloudUpload sx={{ fontSize: 48, color: '#60a5fa', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                                            Drag & drop files here
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            or click to browse files
                                        </Typography>
                                    </Box>
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        label="Notes (Optional)"
                                        multiline
                                        rows={3}
                                        value={uploadData.notes}
                                        onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                    />
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
                        startIcon={<Upload />}
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

            {/* Generate Contract Dialog */}
            <Dialog
                open={contractDialogOpen}
                onClose={() => setContractDialogOpen(false)}
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
                        Generate New Contract
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Autocomplete
                                        options={clients}
                                        getOptionLabel={(option) => option.name}
                                        value={clients.find(c => c.id === parseInt(newContract.clientId)) || null}
                                        onChange={(event, newValue) => {
                                            setNewContract({ ...newContract, clientId: newValue?.id?.toString() || '' });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Client"
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        '&.Mui-focused': { color: '#60a5fa' }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Contract Type</InputLabel>
                                        <Select
                                            value={newContract.type}
                                            label="Contract Type"
                                            onChange={(e) => setNewContract({ ...newContract, type: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="investment">Investment Contract</MenuItem>
                                            <MenuItem value="service">Service Agreement</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Investment Amount"
                                        type="number"
                                        required
                                        value={newContract.investmentAmount}
                                        onChange={(e) => setNewContract({ ...newContract, investmentAmount: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                                        }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Contract Terms (Months)</InputLabel>
                                        <Select
                                            value={newContract.terms}
                                            label="Contract Terms (Months)"
                                            onChange={(e) => setNewContract({ ...newContract, terms: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="6">6 Months</MenuItem>
                                            <MenuItem value="12">12 Months</MenuItem>
                                            <MenuItem value="24">24 Months</MenuItem>
                                            <MenuItem value="36">36 Months</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Interest Rate"
                                        type="number"
                                        value={newContract.interestRate}
                                        onChange={(e) => setNewContract({ ...newContract, interestRate: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        type="date"
                                        value={newContract.startDate}
                                        onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setContractDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Assignment />}
                        onClick={handleGenerateContract}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Generate Contract
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Contract Dialog */}
            <Dialog
                open={editContractDialogOpen}
                onClose={() => setEditContractDialogOpen(false)}
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
                        Edit Contract
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Autocomplete
                                        options={clients}
                                        getOptionLabel={(option) => option.name}
                                        value={clients.find(c => c.id === parseInt(editContract.clientId)) || null}
                                        onChange={(event, newValue) => {
                                            setEditContract({ ...editContract, clientId: newValue?.id?.toString() || '' });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Client"
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        '&.Mui-focused': { color: '#60a5fa' }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Contract Type</InputLabel>
                                        <Select
                                            value={editContract.type}
                                            label="Contract Type"
                                            onChange={(e) => setEditContract({ ...editContract, type: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="investment">Investment Contract</MenuItem>
                                            <MenuItem value="service">Service Agreement</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Investment Amount"
                                        type="number"
                                        required
                                        value={editContract.investmentAmount}
                                        onChange={(e) => setEditContract({ ...editContract, investmentAmount: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                                        }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Contract Terms (Months)</InputLabel>
                                        <Select
                                            value={editContract.terms}
                                            label="Contract Terms (Months)"
                                            onChange={(e) => setEditContract({ ...editContract, terms: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="6">6 Months</MenuItem>
                                            <MenuItem value="12">12 Months</MenuItem>
                                            <MenuItem value="24">24 Months</MenuItem>
                                            <MenuItem value="36">36 Months</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Interest Rate"
                                        type="number"
                                        value={editContract.interestRate}
                                        onChange={(e) => setEditContract({ ...editContract, interestRate: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        type="date"
                                        value={editContract.startDate}
                                        onChange={(e) => setEditContract({ ...editContract, startDate: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': { color: '#60a5fa' }
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setEditContractDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleUpdateContract}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Contract
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Deposit Approval Dialog */}
            <Dialog
                open={depositApprovalOpen}
                onClose={() => setDepositApprovalOpen(false)}
                maxWidth="sm"
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
                        Deny Deposit Request
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 3, backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}>
                        Are you sure you want to deny this deposit request?
                    </Alert>
                    <TextField
                        fullWidth
                        label="Reason for Denial"
                        multiline
                        rows={4}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': { color: '#60a5fa' }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setDepositApprovalOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleDepositAction(selectedDocument?.id, 'denied', 'Reason provided')}
                    >
                        Deny Request
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ContractAndDocuments;
