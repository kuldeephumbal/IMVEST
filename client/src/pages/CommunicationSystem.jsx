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
    Send,
    Email,
    Message,
    Campaign,
    History,
    Edit,
    Visibility,
    MoreVert,
    Search,
    Schedule,
    Group,
    Cancel,
    Drafts,
    MarkEmailRead,
    Forward,
    Reply,
    Archive
} from '@mui/icons-material';

const CommunicationSystem = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Dialog states
    const [massCommDialogOpen, setMassCommDialogOpen] = useState(false);
    const [individualCommDialogOpen, setIndividualCommDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedCommunication, setSelectedCommunication] = useState(null);

    // Form states
    const [massComm, setMassComm] = useState({
        type: 'newsletter',
        subject: '',
        content: '',
        recipients: 'all',
        scheduleDate: '',
        attachments: []
    });

    const [individualComm, setIndividualComm] = useState({
        clientId: '',
        type: 'email',
        subject: '',
        content: '',
        priority: 'normal',
        scheduleDate: '',
        attachments: []
    });

    // Mock data
    const [clients] = useState([
        { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1234567890' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891' },
        { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1234567892' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1234567893' },
        { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '+1234567894' }
    ]);

    const [massComms, setMassComms] = useState([
        {
            id: 1,
            type: 'Monthly Report',
            subject: 'Investment Performance Report - February 2024',
            content: 'Dear valued clients, please find attached your monthly investment performance report...',
            recipients: 'all',
            recipientCount: 150,
            status: 'sent',
            sentDate: '2024-03-01',
            openRate: '78%',
            clickRate: '23%',
            createdBy: 'Admin'
        },
        {
            id: 2,
            type: 'Newsletter',
            subject: 'Market Update & Investment Opportunities',
            content: 'This month brings exciting new opportunities in the tech sector...',
            recipients: 'active',
            recipientCount: 125,
            status: 'scheduled',
            scheduleDate: '2024-03-15',
            createdBy: 'Manager'
        },
        {
            id: 3,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        }
    ]);

    const [individualComms, setIndividualComms] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            type: 'email',
            subject: 'Investment Portfolio Review Scheduled',
            content: 'Hi John, I have scheduled your quarterly portfolio review for next week...',
            status: 'sent',
            priority: 'high',
            sentDate: '2024-03-02',
            readStatus: true,
            responseReceived: false
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            type: 'message',
            subject: 'Contract Renewal Reminder',
            content: 'Your investment contract is due for renewal in 30 days...',
            status: 'delivered',
            priority: 'normal',
            sentDate: '2024-03-01',
            readStatus: true,
            responseReceived: true
        },
        {
            id: 3,
            clientId: 3,
            clientName: 'Michael Brown',
            type: 'email',
            subject: 'Market Volatility Update',
            content: 'Due to recent market conditions, I wanted to personally reach out...',
            status: 'pending',
            priority: 'urgent',
            scheduleDate: '2024-03-05'
        }
    ]);

    const [commLogs] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            type: 'email',
            direction: 'outbound',
            subject: 'Portfolio Performance',
            timestamp: '2024-03-02 10:30 AM',
            status: 'read',
            responseTime: '2 hours'
        },
        {
            id: 2,
            clientId: 1,
            clientName: 'John Smith',
            type: 'email',
            direction: 'inbound',
            subject: 'Re: Portfolio Performance',
            timestamp: '2024-03-02 12:30 PM',
            status: 'read'
        },
        {
            id: 3,
            clientId: 2,
            clientName: 'Sarah Johnson',
            type: 'message',
            direction: 'outbound',
            subject: 'Contract Update',
            timestamp: '2024-03-01 02:15 PM',
            status: 'delivered',
            responseTime: 'No response'
        }
    ]);

    // Handlers
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleActionMenu = (event, communication) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedCommunication(communication);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
        setSelectedCommunication(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
            case 'delivered':
            case 'read':
                return 'success';
            case 'scheduled':
            case 'pending':
                return 'warning';
            case 'failed':
            case 'error':
                return 'error';
            case 'draft':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
            case 'delivered':
                return <Send sx={{ fontSize: 16 }} />;
            case 'read':
                return <MarkEmailRead sx={{ fontSize: 16 }} />;
            case 'scheduled':
            case 'pending':
                return <Schedule sx={{ fontSize: 16 }} />;
            case 'draft':
                return <Drafts sx={{ fontSize: 16 }} />;
            case 'failed':
            case 'error':
                return <Cancel sx={{ fontSize: 16 }} />;
            default:
                return <Email sx={{ fontSize: 16 }} />;
        }
    };

    const handleSendMassComm = () => {
        // Add new mass communication
        const newMassComm = {
            id: massComms.length + 1,
            type: massComm.type.charAt(0).toUpperCase() + massComm.type.slice(1),
            subject: massComm.subject,
            content: massComm.content,
            recipients: massComm.recipients,
            recipientCount: massComm.recipients === 'all' ? 150 : massComm.recipients === 'active' ? 125 : 45,
            status: massComm.scheduleDate ? 'scheduled' : 'sent',
            sentDate: massComm.scheduleDate || new Date().toISOString().split('T')[0],
            scheduleDate: massComm.scheduleDate,
            createdBy: 'Admin'
        };

        setMassComms([...massComms, newMassComm]);
        setMassCommDialogOpen(false);
        setMassComm({
            type: 'newsletter',
            subject: '',
            content: '',
            recipients: 'all',
            scheduleDate: '',
            attachments: []
        });
    };

    const handleSendIndividualComm = () => {
        // Add new individual communication
        const selectedClient = clients.find(c => c.id === parseInt(individualComm.clientId));
        const newIndividualComm = {
            id: individualComms.length + 1,
            clientId: parseInt(individualComm.clientId),
            clientName: selectedClient?.name || '',
            type: individualComm.type,
            subject: individualComm.subject,
            content: individualComm.content,
            status: individualComm.scheduleDate ? 'pending' : 'sent',
            priority: individualComm.priority,
            sentDate: individualComm.scheduleDate || new Date().toISOString().split('T')[0],
            scheduleDate: individualComm.scheduleDate,
            readStatus: false,
            responseReceived: false
        };

        setIndividualComms([...individualComms, newIndividualComm]);
        setIndividualCommDialogOpen(false);
        setIndividualComm({
            clientId: '',
            type: 'email',
            subject: '',
            content: '',
            priority: 'normal',
            scheduleDate: '',
            attachments: []
        });
    };

    const filteredMassComms = massComms.filter(comm => {
        const matchesSearch = comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comm.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredIndividualComms = individualComms.filter(comm => {
        const matchesSearch = comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comm.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredCommLogs = commLogs.filter(log => {
        const matchesSearch = log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.clientName.toLowerCase().includes(searchQuery.toLowerCase());
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
                            Communication System
                        </Typography>
                        {/* <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage mass communications, individual client messages, and track communication history
                        </Typography> */}
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
                                <Campaign sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {massComms.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Mass Communications
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
                                <Message sx={{ fontSize: 40, color: '#4ade80', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {individualComms.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Individual Messages
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
                                <MarkEmailRead sx={{ fontSize: 40, color: '#a855f7', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {commLogs.filter(log => log.status === 'read').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Messages Read
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
                                <Schedule sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {[...massComms, ...individualComms].filter(comm => comm.status === 'scheduled' || comm.status === 'pending').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Scheduled Messages
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
                        <Tab icon={<Campaign />} label="Mass Communication" iconPosition="start" />
                        <Tab icon={<Message />} label="Individual Messages" iconPosition="start" />
                        <Tab icon={<History />} label="Communication Log" iconPosition="start" />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search communications..."
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
                                <MenuItem value="sent">Sent</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="read">Read</MenuItem>
                                <MenuItem value="scheduled">Scheduled</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ flexGrow: 1 }} />

                        {activeTab === 0 && (
                            <Button
                                variant="contained"
                                startIcon={<Campaign />}
                                onClick={() => setMassCommDialogOpen(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    }
                                }}
                            >
                                New Mass Communication
                            </Button>
                        )}

                        {activeTab === 1 && (
                            <Button
                                variant="contained"
                                startIcon={<Send />}
                                onClick={() => setIndividualCommDialogOpen(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    }
                                }}
                            >
                                Send Message
                            </Button>
                        )}
                    </Box>

                    {/* Tab Content - Mass Communication */}
                    {activeTab === 0 && (
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Type
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Subject
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Recipients
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Date
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Performance
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMassComms.map((comm) => (
                                        <TableRow key={comm.id}>
                                            <TableCell>
                                                <Chip
                                                    label={comm.type}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: comm.type === 'Monthly Report' ? 'rgba(59, 130, 246, 0.2)' :
                                                            comm.type === 'Newsletter' ? 'rgba(34, 197, 94, 0.2)' :
                                                                'rgba(245, 158, 11, 0.2)',
                                                        color: comm.type === 'Monthly Report' ? '#60a5fa' :
                                                            comm.type === 'Newsletter' ? '#4ade80' :
                                                                '#f59e0b'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                    {comm.subject}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                    {comm.content.substring(0, 50)}...
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Group sx={{ color: '#60a5fa', fontSize: 20 }} />
                                                    <Typography sx={{ color: 'white' }}>
                                                        {comm.recipientCount} clients
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(comm.status)}
                                                    label={comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                                                    size="small"
                                                    color={getStatusColor(comm.status)}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {comm.sentDate || comm.scheduleDate}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {comm.openRate && (
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                            Open: {comm.openRate}
                                                        </Typography>
                                                        {comm.clickRate && (
                                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                                                Click: {comm.clickRate}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    onClick={(e) => handleActionMenu(e, comm)}
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

                    {/* Tab Content - Individual Messages */}
                    {activeTab === 1 && (
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Client
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Subject
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Type
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Priority
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Date
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredIndividualComms.map((comm) => (
                                        <TableRow key={comm.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#34d399' }}>
                                                        {comm.clientName.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ color: 'white' }}>
                                                        {comm.clientName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                    {comm.subject}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                    {comm.content.substring(0, 40)}...
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={comm.type === 'email' ? <Email sx={{ fontSize: 16 }} /> : <Message sx={{ fontSize: 16 }} />}
                                                    label={comm.type}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: comm.type === 'email' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                        color: comm.type === 'email' ? '#60a5fa' : '#4ade80'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={comm.priority}
                                                    size="small"
                                                    color={comm.priority === 'urgent' ? 'error' : comm.priority === 'high' ? 'warning' : 'info'}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(comm.status)}
                                                    label={comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                                                    size="small"
                                                    color={getStatusColor(comm.status)}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {comm.sentDate || comm.scheduleDate}
                                                </Typography>
                                                {comm.readStatus && (
                                                    <Typography variant="caption" sx={{ color: '#4ade80', display: 'block' }}>
                                                        Read
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    onClick={(e) => handleActionMenu(e, comm)}
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

                    {/* Tab Content - Communication Log */}
                    {activeTab === 2 && (
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Client
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Subject
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Type
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Direction
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Timestamp
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', fontWeight: 'bold' }}>
                                            Response Time
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCommLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#a855f7' }}>
                                                        {log.clientName.charAt(0)}
                                                    </Avatar>
                                                    <Typography sx={{ color: 'white' }}>
                                                        {log.clientName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                                                    {log.subject}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={log.type === 'email' ? <Email sx={{ fontSize: 16 }} /> : <Message sx={{ fontSize: 16 }} />}
                                                    label={log.type}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: log.type === 'email' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                        color: log.type === 'email' ? '#60a5fa' : '#4ade80'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.direction}
                                                    size="small"
                                                    color={log.direction === 'outbound' ? 'primary' : 'secondary'}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {log.timestamp}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(log.status)}
                                                    label={log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                                    size="small"
                                                    color={getStatusColor(log.status)}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                    {log.responseTime || '-'}
                                                </Typography>
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
                <MenuItem onClick={() => {
                    console.log('Viewing details for:', selectedCommunication);
                    handleCloseActionMenu();
                }}>
                    <Visibility sx={{ mr: 1, fontSize: 18 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => {
                    console.log('Editing communication:', selectedCommunication);
                    handleCloseActionMenu();
                }}>
                    <Edit sx={{ mr: 1, fontSize: 18 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    console.log('Replying to:', selectedCommunication);
                    handleCloseActionMenu();
                }}>
                    <Reply sx={{ mr: 1, fontSize: 18 }} />
                    Reply
                </MenuItem>
                <MenuItem onClick={() => {
                    console.log('Forwarding:', selectedCommunication);
                    handleCloseActionMenu();
                }}>
                    <Forward sx={{ mr: 1, fontSize: 18 }} />
                    Forward
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Archive sx={{ mr: 1, fontSize: 18 }} />
                    Archive
                </MenuItem>
            </Menu>

            {/* Mass Communication Dialog */}
            <Dialog
                open={massCommDialogOpen}
                onClose={() => setMassCommDialogOpen(false)}
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
                        Create Mass Communication
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Communication Type</InputLabel>
                                        <Select
                                            value={massComm.type}
                                            label="Communication Type"
                                            onChange={(e) => setMassComm({ ...massComm, type: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="newsletter">Newsletter</MenuItem>
                                            <MenuItem value="monthly_report">Monthly Report</MenuItem>
                                            <MenuItem value="update">Update</MenuItem>
                                            <MenuItem value="announcement">Announcement</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Recipients</InputLabel>
                                        <Select
                                            value={massComm.recipients}
                                            label="Recipients"
                                            onChange={(e) => setMassComm({ ...massComm, recipients: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="all">All Clients</MenuItem>
                                            <MenuItem value="active">Active Clients</MenuItem>
                                            <MenuItem value="premium">Premium Clients</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        required
                                        value={massComm.subject}
                                        onChange={(e) => setMassComm({ ...massComm, subject: e.target.value })}
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
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        label="Content"
                                        multiline
                                        rows={6}
                                        required
                                        value={massComm.content}
                                        onChange={(e) => setMassComm({ ...massComm, content: e.target.value })}
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
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Schedule Date (Optional)"
                                        type="datetime-local"
                                        value={massComm.scheduleDate}
                                        onChange={(e) => setMassComm({ ...massComm, scheduleDate: e.target.value })}
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
                        onClick={() => setMassCommDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={handleSendMassComm}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        {massComm.scheduleDate ? 'Schedule' : 'Send Now'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Individual Communication Dialog */}
            <Dialog
                open={individualCommDialogOpen}
                onClose={() => setIndividualCommDialogOpen(false)}
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
                        Send Individual Message
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
                                        value={clients.find(c => c.id === parseInt(individualComm.clientId)) || null}
                                        onChange={(event, newValue) => {
                                            setIndividualComm({ ...individualComm, clientId: newValue?.id?.toString() || '' });
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
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Communication Type</InputLabel>
                                        <Select
                                            value={individualComm.type}
                                            label="Communication Type"
                                            onChange={(e) => setIndividualComm({ ...individualComm, type: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="email">Email</MenuItem>
                                            <MenuItem value="message">Direct Message</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-8">
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        required
                                        value={individualComm.subject}
                                        onChange={(e) => setIndividualComm({ ...individualComm, subject: e.target.value })}
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
                                <div className="col-md-4">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Priority</InputLabel>
                                        <Select
                                            value={individualComm.priority}
                                            label="Priority"
                                            onChange={(e) => setIndividualComm({ ...individualComm, priority: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="normal">Normal</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="urgent">Urgent</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        label="Message Content"
                                        multiline
                                        rows={6}
                                        required
                                        value={individualComm.content}
                                        onChange={(e) => setIndividualComm({ ...individualComm, content: e.target.value })}
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
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        label="Schedule Date (Optional)"
                                        type="datetime-local"
                                        value={individualComm.scheduleDate}
                                        onChange={(e) => setIndividualComm({ ...individualComm, scheduleDate: e.target.value })}
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
                        onClick={() => setIndividualCommDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={handleSendIndividualComm}
                        sx={{
                            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            }
                        }}
                    >
                        {individualComm.scheduleDate ? 'Schedule' : 'Send Now'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CommunicationSystem;
