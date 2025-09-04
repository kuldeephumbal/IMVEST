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
    Alert,
    LinearProgress,
    Divider,
    Switch,
    FormControlLabel,
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    Add,
    Schedule,
    NotificationsActive,
    Autorenew,
    Assignment,
    AccountBalance,
    CheckCircle,
    Cancel,
    Edit,
    Delete,
    Visibility,
    MoreVert,
    Search,
    FilterList,
    Alarm,
    Today,
    CalendarToday,
    AccessTime,
    TrendingUp,
    Warning,
    Person,
    Description,
    Money,
    Settings,
    Refresh,
    EventNote,
    TaskAlt
} from '@mui/icons-material';

const SchedulingAutomation = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Dialog states
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [automationDialogOpen, setAutomationDialogOpen] = useState(false);

    // Menu states
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

    // Form states
    const [newReminder, setNewReminder] = useState({
        clientId: '',
        type: 'withdrawal',
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        autoSend: true,
        frequency: 'once'
    });

    const [newTask, setNewTask] = useState({
        clientId: '',
        type: 'contract_renewal',
        title: '',
        description: '',
        dueDate: '',
        assignedTo: '',
        priority: 'medium',
        autoReminder: true,
        reminderBefore: '7'
    });

    const [automationSettings, setAutomationSettings] = useState({
        withdrawalReminders: true,
        depositReminders: true,
        contractRenewals: true,
        documentReminders: true,
        clientCheckIns: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderDaysBefore: '7',
        autoAssignTasks: true
    });

    // Mock data
    const [clients] = useState([
        { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1234567890' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891' },
        { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1234567892' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1234567893' },
        { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '+1234567894' }
    ]);

    const [staff] = useState([
        { id: 1, name: 'Admin User', email: 'admin@imvest.com', role: 'admin' },
        { id: 2, name: 'Manager Smith', email: 'manager@imvest.com', role: 'manager' },
        { id: 3, name: 'Agent Johnson', email: 'agent@imvest.com', role: 'agent' }
    ]);

    const [automatedReminders] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            type: 'withdrawal',
            title: 'Scheduled Withdrawal Reminder',
            description: 'Quarterly withdrawal of $5,000 due on March 15th',
            amount: '$5,000',
            dueDate: '2024-03-15',
            status: 'pending',
            priority: 'high',
            autoSent: true,
            frequency: 'quarterly',
            lastSent: '2024-03-01',
            nextSend: '2024-03-10'
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            type: 'deposit',
            title: 'Monthly Deposit Reminder',
            description: 'Monthly investment deposit of $2,000',
            amount: '$2,000',
            dueDate: '2024-03-01',
            status: 'completed',
            priority: 'medium',
            autoSent: true,
            frequency: 'monthly',
            lastSent: '2024-02-25',
            nextSend: '2024-03-25'
        },
        {
            id: 3,
            clientId: 3,
            clientName: 'Michael Brown',
            type: 'deposit',
            title: 'Annual Investment Increase',
            description: 'Annual portfolio increase of $10,000',
            amount: '$10,000',
            dueDate: '2024-06-01',
            status: 'overdue',
            priority: 'high',
            autoSent: true,
            frequency: 'yearly',
            lastSent: '2024-05-25',
            nextSend: '2024-05-25'
        }
    ]);

    const [taskReminders] = useState([
        {
            id: 1,
            clientId: 1,
            clientName: 'John Smith',
            type: 'contract_renewal',
            title: 'Investment Contract Renewal',
            description: 'Review and renew investment contract for John Smith',
            dueDate: '2024-03-20',
            assignedTo: 'Admin User',
            assignedToId: 1,
            status: 'pending',
            priority: 'high',
            autoReminder: true,
            reminderBefore: '7',
            createdDate: '2024-02-20',
            completedDate: null,
            notes: ''
        },
        {
            id: 2,
            clientId: 2,
            clientName: 'Sarah Johnson',
            type: 'client_checkin',
            title: 'Quarterly Client Check-in',
            description: 'Schedule quarterly review meeting with Sarah Johnson',
            dueDate: '2024-03-15',
            assignedTo: 'Manager Smith',
            assignedToId: 2,
            status: 'in_progress',
            priority: 'medium',
            autoReminder: true,
            reminderBefore: '3',
            createdDate: '2024-02-15',
            completedDate: null,
            notes: 'Client requested earlier meeting'
        },
        {
            id: 3,
            clientId: 4,
            clientName: 'Emily Davis',
            type: 'documentation',
            title: 'Missing KYC Documents',
            description: 'Follow up on missing KYC documentation from Emily Davis',
            dueDate: '2024-03-10',
            assignedTo: 'Agent Johnson',
            assignedToId: 3,
            status: 'completed',
            priority: 'urgent',
            autoReminder: true,
            reminderBefore: '1',
            createdDate: '2024-02-10',
            completedDate: '2024-03-08',
            notes: 'Documents received and verified'
        }
    ]);

    const [automationRules] = useState([
        {
            id: 1,
            name: 'Withdrawal Reminders',
            description: 'Send automatic reminders for scheduled withdrawals',
            type: 'withdrawal',
            enabled: true,
            trigger: '7_days_before',
            action: 'send_email',
            frequency: 'once',
            lastTriggered: '2024-03-01',
            nextTrigger: '2024-03-08'
        },
        {
            id: 2,
            name: 'Contract Renewal Tasks',
            description: 'Create tasks for upcoming contract renewals',
            type: 'contract_renewal',
            enabled: true,
            trigger: '30_days_before',
            action: 'create_task',
            frequency: 'once',
            lastTriggered: '2024-02-20',
            nextTrigger: '2024-03-20'
        },
        {
            id: 3,
            name: 'Monthly Client Check-ins',
            description: 'Schedule monthly client check-in tasks',
            type: 'client_checkin',
            enabled: false,
            trigger: 'monthly',
            action: 'create_task',
            frequency: 'recurring',
            lastTriggered: '2024-02-01',
            nextTrigger: '2024-04-01'
        }
    ]);

    // Handlers
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleActionMenu = (event, item) => {
        setActionMenuAnchor(event.currentTarget);
        console.log('Selected item:', item);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'overdue':
                return 'error';
            case 'in_progress':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle />;
            case 'pending':
                return <Schedule />;
            case 'overdue':
                return <Warning />;
            case 'in_progress':
                return <Refresh />;
            default:
                return <Schedule />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'error';
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'withdrawal':
                return <TrendingUp color="error" />;
            case 'deposit':
                return <AccountBalance color="success" />;
            case 'contract_renewal':
                return <Description color="warning" />;
            case 'client_checkin':
                return <Person color="info" />;
            case 'documentation':
                return <Assignment color="primary" />;
            default:
                return <EventNote />;
        }
    };

    const handleCreateReminder = () => {
        console.log('Creating reminder:', newReminder);
        setReminderDialogOpen(false);
        setNewReminder({
            clientId: '',
            type: 'withdrawal',
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            autoSend: true,
            frequency: 'once'
        });
    };

    const handleCreateTask = () => {
        console.log('Creating task:', newTask);
        setTaskDialogOpen(false);
        setNewTask({
            clientId: '',
            type: 'contract_renewal',
            title: '',
            description: '',
            dueDate: '',
            assignedTo: '',
            priority: 'medium',
            autoReminder: true,
            reminderBefore: '7'
        });
    };

    const handleSaveAutomation = () => {
        console.log('Saving automation settings:', automationSettings);
        setAutomationDialogOpen(false);
    };

    const filteredReminders = automatedReminders.filter(reminder => {
        const matchesSearch = reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reminder.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || reminder.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredTasks = taskReminders.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredRules = automationRules.filter(rule => {
        const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rule.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                            Scheduling & Automation
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
                                <NotificationsActive sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {automatedReminders.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Active Reminders
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
                                <Assignment sx={{ fontSize: 40, color: '#4ade80', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {taskReminders.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Task Reminders
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
                                <CheckCircle sx={{ fontSize: 40, color: '#a855f7', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {[...automatedReminders, ...taskReminders].filter(item => item.status === 'completed').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Completed Tasks
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
                                <Autorenew sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {automationRules.filter(rule => rule.enabled).length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Active Rules
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
                        <Tab
                            icon={<NotificationsActive />}
                            label="Automated Reminders"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<Assignment />}
                            label="Task Reminders"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<Settings />}
                            label="Automation Rules"
                            iconPosition="start"
                        />
                    </Tabs>

                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search reminders, tasks, or clients..."
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
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="overdue">Overdue</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ flexGrow: 1 }} />

                        {activeTab === 0 && (
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setReminderDialogOpen(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    }
                                }}
                            >
                                Create Reminder
                            </Button>
                        )}

                        {activeTab === 1 && (
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setTaskDialogOpen(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    }
                                }}
                            >
                                Create Task
                            </Button>
                        )}

                        {activeTab === 2 && (
                            <Button
                                variant="contained"
                                startIcon={<Settings />}
                                onClick={() => setAutomationDialogOpen(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                                    }
                                }}
                            >
                                Automation Settings
                            </Button>
                        )}
                    </Box>

                    {/* Tab Content */}
                    {/* AUTOMATED REMINDERS TAB */}
                    {activeTab === 0 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Automated Client Reminders
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Client & Title
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Amount
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Due Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Priority
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Next Send
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredReminders.map((reminder) => (
                                            <TableRow key={reminder.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getTypeIcon(reminder.type)}
                                                        <Typography variant="body2" sx={{ color: 'white', textTransform: 'capitalize' }}>
                                                            {reminder.type.replace('_', ' ')}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {reminder.clientName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            {reminder.title}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        {reminder.amount}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                                        {reminder.dueDate}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(reminder.status)}
                                                        label={reminder.status.replace('_', ' ').toUpperCase()}
                                                        color={getStatusColor(reminder.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={reminder.priority.toUpperCase()}
                                                        color={getPriorityColor(reminder.priority)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                        {reminder.nextSend}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleActionMenu(e, reminder)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
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

                    {/* TASK REMINDERS TAB */}
                    {activeTab === 1 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Task Reminders & Management
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Task & Client
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Assigned To
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Due Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Priority
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Progress
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTasks.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getTypeIcon(task.type)}
                                                        <Typography variant="body2" sx={{ color: 'white', textTransform: 'capitalize' }}>
                                                            {task.type.replace('_', ' ')}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {task.title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            Client: {task.clientName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                            {task.assignedTo.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                                            {task.assignedTo}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                                        {task.dueDate}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(task.status)}
                                                        label={task.status.replace('_', ' ').toUpperCase()}
                                                        color={getStatusColor(task.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={task.priority.toUpperCase()}
                                                        color={getPriorityColor(task.priority)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={task.status === 'completed' ? 100 : task.status === 'in_progress' ? 60 : 0}
                                                            sx={{
                                                                width: 60,
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor: task.status === 'completed' ? '#10b981' :
                                                                        task.status === 'in_progress' ? '#3b82f6' : '#6b7280'
                                                                }
                                                            }}
                                                        />
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            {task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '60%' : '0%'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleActionMenu(e, task)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
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

                    {/* AUTOMATION RULES TAB */}
                    {activeTab === 2 && (
                        <>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                                Automation Rules & Settings
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Rule Name
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Type
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Trigger
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Action
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Last Triggered
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Next Trigger
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredRules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {rule.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            {rule.description}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getTypeIcon(rule.type)}
                                                        <Typography variant="body2" sx={{ color: 'white', textTransform: 'capitalize' }}>
                                                            {rule.type.replace('_', ' ')}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={rule.trigger.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                                            color: '#60a5fa',
                                                            border: '1px solid rgba(59, 130, 246, 0.3)'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={rule.action.replace('_', ' ')}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                                            color: '#10b981',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={rule.enabled ? 'ENABLED' : 'DISABLED'}
                                                        color={rule.enabled ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                        {rule.lastTriggered}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                                        {rule.nextTrigger}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleActionMenu(e, rule)}
                                                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
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
                    <Edit sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleCloseActionMenu}>
                    <Delete sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Create Reminder Dialog */}
            <Dialog
                open={reminderDialogOpen}
                onClose={() => setReminderDialogOpen(false)}
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
                        Create Automated Reminder
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
                                        value={clients.find(c => c.id === newReminder.clientId) || null}
                                        onChange={(event, newValue) => {
                                            setNewReminder({ ...newReminder, clientId: newValue ? newValue.id : '' });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Client"
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Reminder Type</InputLabel>
                                        <Select
                                            value={newReminder.type}
                                            label="Reminder Type"
                                            onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="withdrawal">Withdrawal</MenuItem>
                                            <MenuItem value="deposit">Deposit</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={newReminder.title}
                                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                                        required
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description"
                                        value={newReminder.description}
                                        onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Due Date"
                                        value={newReminder.dueDate}
                                        onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Priority</InputLabel>
                                        <Select
                                            value={newReminder.priority}
                                            label="Priority"
                                            onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="low">Low</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="urgent">Urgent</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-4">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Frequency</InputLabel>
                                        <Select
                                            value={newReminder.frequency}
                                            label="Frequency"
                                            onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="once">Once</MenuItem>
                                            <MenuItem value="weekly">Weekly</MenuItem>
                                            <MenuItem value="monthly">Monthly</MenuItem>
                                            <MenuItem value="quarterly">Quarterly</MenuItem>
                                            <MenuItem value="yearly">Yearly</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={newReminder.autoSend}
                                                onChange={(e) => setNewReminder({ ...newReminder, autoSend: e.target.checked })}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#60a5fa',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                        },
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#60a5fa',
                                                    },
                                                }}
                                            />
                                        }
                                        label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Auto-send reminders</Typography>}
                                    />
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setReminderDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateReminder}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Create Reminder
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Task Dialog */}
            <Dialog
                open={taskDialogOpen}
                onClose={() => setTaskDialogOpen(false)}
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
                        Create Task Reminder
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
                                        value={clients.find(c => c.id === newTask.clientId) || null}
                                        onChange={(event, newValue) => {
                                            setNewTask({ ...newTask, clientId: newValue ? newValue.id : '' });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Client"
                                                fullWidth
                                                required
                                                sx={{
                                                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Task Type</InputLabel>
                                        <Select
                                            value={newTask.type}
                                            label="Task Type"
                                            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="contract_renewal">Contract Renewal</MenuItem>
                                            <MenuItem value="client_checkin">Client Check-in</MenuItem>
                                            <MenuItem value="documentation">Documentation</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        label="Task Title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-12">
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Due Date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        sx={{
                                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Autocomplete
                                        options={staff}
                                        getOptionLabel={(option) => option.name}
                                        value={staff.find(s => s.name === newTask.assignedTo) || null}
                                        onChange={(event, newValue) => {
                                            setNewTask({ ...newTask, assignedTo: newValue ? newValue.name : '' });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Assign To"
                                                fullWidth
                                                sx={{
                                                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                                    '& .MuiOutlinedInput-root': {
                                                        color: 'white',
                                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Priority</InputLabel>
                                        <Select
                                            value={newTask.priority}
                                            label="Priority"
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="low">Low</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="urgent">Urgent</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={newTask.autoReminder}
                                                onChange={(e) => setNewTask({ ...newTask, autoReminder: e.target.checked })}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#60a5fa',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                        },
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#60a5fa',
                                                    },
                                                }}
                                            />
                                        }
                                        label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Auto-reminder enabled</Typography>}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Reminder Days Before</InputLabel>
                                        <Select
                                            value={newTask.reminderBefore}
                                            label="Reminder Days Before"
                                            onChange={(e) => setNewTask({ ...newTask, reminderBefore: e.target.value })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="1">1 Day</MenuItem>
                                            <MenuItem value="3">3 Days</MenuItem>
                                            <MenuItem value="7">7 Days</MenuItem>
                                            <MenuItem value="14">14 Days</MenuItem>
                                            <MenuItem value="30">30 Days</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setTaskDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Assignment />}
                        onClick={handleCreateTask}
                        sx={{
                            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            }
                        }}
                    >
                        Create Task
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Automation Settings Dialog */}
            <Dialog
                open={automationDialogOpen}
                onClose={() => setAutomationDialogOpen(false)}
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
                        Automation Settings
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <div className="container-fluid">
                            <div className="row g-3">
                                <div className="col-12">
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                                        Automated Reminders
                                    </Typography>
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.withdrawalReminders}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            withdrawalReminders: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Withdrawal Reminders</Typography>}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.depositReminders}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            depositReminders: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Deposit Reminders</Typography>}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.contractRenewals}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            contractRenewals: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Contract Renewal Tasks</Typography>}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.documentReminders}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            documentReminders: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Document Reminders</Typography>}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.clientCheckIns}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            clientCheckIns: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Client Check-in Tasks</Typography>}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                                        Notification Settings
                                    </Typography>
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.emailNotifications}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            emailNotifications: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Email Notifications</Typography>}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={automationSettings.smsNotifications}
                                                        onChange={(e) => setAutomationSettings({
                                                            ...automationSettings,
                                                            smsNotifications: e.target.checked
                                                        })}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#60a5fa',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                                },
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#60a5fa',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>SMS Notifications</Typography>}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Default Reminder Days Before</InputLabel>
                                        <Select
                                            value={automationSettings.reminderDaysBefore}
                                            label="Default Reminder Days Before"
                                            onChange={(e) => setAutomationSettings({
                                                ...automationSettings,
                                                reminderDaysBefore: e.target.value
                                            })}
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#60a5fa' }
                                            }}
                                        >
                                            <MenuItem value="1">1 Day</MenuItem>
                                            <MenuItem value="3">3 Days</MenuItem>
                                            <MenuItem value="7">7 Days</MenuItem>
                                            <MenuItem value="14">14 Days</MenuItem>
                                            <MenuItem value="30">30 Days</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="col-md-6">
                                    <div style={{ paddingTop: '16px' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={automationSettings.autoAssignTasks}
                                                    onChange={(e) => setAutomationSettings({
                                                        ...automationSettings,
                                                        autoAssignTasks: e.target.checked
                                                    })}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#60a5fa',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(96, 165, 250, 0.08)',
                                                            },
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#60a5fa',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={<Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Auto-assign Tasks</Typography>}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setAutomationDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Settings />}
                        onClick={handleSaveAutomation}
                        sx={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                            }
                        }}
                    >
                        Save Settings
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SchedulingAutomation;
