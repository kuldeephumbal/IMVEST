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
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    InputAdornment
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import BaseTable from '../components/BaseTable';
import {
    Send,
    Campaign,
    Edit,
    Visibility,
    MoreVert,
    Search,
    Group
} from '@mui/icons-material';

const CommunicationSystem = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Dialog states
    const [massCommDialogOpen, setMassCommDialogOpen] = useState(false);

    // Form states
    const [massComm, setMassComm] = useState({
        type: 'newsletter',
        subject: '',
        content: '',
        recipients: 'all',
        scheduleDate: '',
        attachments: []
    });

    // Mock data
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
        },
        {
            id: 4,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 5,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 6,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 7,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 8,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 9,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 10,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 11,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 12,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 13,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 14,
            type: 'Update',
            subject: 'Important Policy Changes - Action Required',
            content: 'We are implementing new security measures to protect your investments...',
            recipients: 'premium',
            recipientCount: 45,
            status: 'draft',
            createdDate: '2024-02-28',
            createdBy: 'Admin'
        },
        {
            id: 15,
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

    const filteredMassComms = massComms.filter(comm => {
        const matchesSearch = comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comm.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
        return matchesSearch && matchesStatus;
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
                    </Box>

                    {/* Mass Communication Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'type', headerName: 'Type', minWidth: '120px', renderCell: (row) => (
                                    <Chip
                                        label={row.type}
                                        size="small"
                                        sx={{
                                            backgroundColor: row.type === 'Monthly Report' ? 'rgba(59, 130, 246, 0.2)' :
                                                row.type === 'Newsletter' ? 'rgba(34, 197, 94, 0.2)' :
                                                    'rgba(245, 158, 11, 0.2)',
                                            color: row.type === 'Monthly Report' ? '#60a5fa' :
                                                row.type === 'Newsletter' ? '#4ade80' :
                                                    '#f59e0b'
                                        }}
                                    />
                                )
                            },
                            {
                                field: 'subject', headerName: 'Subject', minWidth: '250px', renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 'medium', fontSize: '0.875rem' }}>
                                            {row.subject}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {row.content.substring(0, 50)}...
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'recipientCount', headerName: 'Recipients', minWidth: '120px', renderCell: (row) => (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Group sx={{ color: '#60a5fa', fontSize: 20 }} />
                                        <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                                            {row.recipientCount} clients
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'status', headerName: 'Status', type: 'status', minWidth: '120px', statusColors: {
                                    'sent': 'success',
                                    'delivered': 'info',
                                    'read': 'primary',
                                    'scheduled': 'warning',
                                    'pending': 'default',
                                    'draft': 'default'
                                }
                            },
                            {
                                field: 'sentDate', headerName: 'Date', minWidth: '120px', renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {row.sentDate || row.scheduleDate}
                                    </Typography>
                                )
                            },
                            {
                                field: 'openRate', headerName: 'Performance', minWidth: '120px', renderCell: (row) => (
                                    row.openRate ? (
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                Open: {row.openRate}
                                            </Typography>
                                            {row.clickRate && (
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                                    Click: {row.clickRate}
                                                </Typography>
                                            )}
                                        </Box>
                                    ) : '-'
                                )
                            }
                        ]}
                        data={filteredMassComms}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => console.log('View', row)}
                                >
                                    <Visibility fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => console.log('Edit', row)}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

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
        </>
    );
};

export default CommunicationSystem;
