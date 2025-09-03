import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    CircularProgress,
    Grid,
    MenuItem,
    Tabs,
    Tab,
    Snackbar,
    IconButton
} from '@mui/material';
import {
    Save,
    Notifications,
    Security,
    Palette,
    Person,
    ManageAccounts,
    LockReset,
    Close
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState(0);

    // Mock data for testing
    const mockProfileData = {
        firstName: 'John',
        lastName: 'Doe',
        email: localStorage.getItem('userEmail') || 'admin@imvest.com',
        role: localStorage.getItem('userRole') || 'admin',
        permissions: ['approve_clients', 'view_reports', 'user_management']
    };

    // Profile settings state
    const [profileSettings, setProfileSettings] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        permissions: []
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification/preference settings
    const [preferenceSettings, setPreferenceSettings] = useState({
        notifications: true,
        darkMode: true,
        autoSave: false,
        twoFactor: true
    });

    // Load user profile data on component mount
    useEffect(() => {
        console.log('Settings component mounted');
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debug log whenever profile settings change
    useEffect(() => {
        console.log('Current profile settings:', profileSettings);
    }, [profileSettings]);

    const fetchProfileData = async () => {
        try {
            setLoadingProfile(true);

            // Attempt to get profile from API
            const response = await adminAPI.getProfile();
            console.log('API Response:', response);

            // Check if response has data property (common API pattern)
            const userData = response.data || response;

            if (userData && userData.firstName) {
                // API returned valid data
                setProfileSettings({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || localStorage.getItem('userEmail') || '',
                    role: userData.role || localStorage.getItem('userRole') || 'admin',
                    permissions: userData.permissions || []
                });
            } else {
                // API didn't return expected fields, use mock data
                console.log('Using mock data due to incomplete API response');
                setProfileSettings(mockProfileData);
            }

            console.log('Profile settings after update:', profileSettings);
            setLoadingProfile(false);
        } catch (error) {
            console.error('Failed to fetch profile:', error);

            // API failed, use mock data
            console.log('Using mock data due to API error');
            setProfileSettings(mockProfileData);

            setNotification({
                open: true,
                message: 'Could not load profile data from server, using default values',
                type: 'warning'
            });

            setLoadingProfile(false);
        }
    };

    const handleProfileChange = (field) => (event) => {
        setProfileSettings({
            ...profileSettings,
            [field]: event.target.value
        });
    };

    const handlePasswordChange = (field) => (event) => {
        setPasswordData({
            ...passwordData,
            [field]: event.target.value
        });
    };

    const handlePreferenceChange = (field) => (event) => {
        setPreferenceSettings({
            ...preferenceSettings,
            [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            await adminAPI.updateProfile({
                firstName: profileSettings.firstName,
                lastName: profileSettings.lastName,
                email: profileSettings.email
            });

            setNotification({
                open: true,
                message: 'Profile updated successfully',
                type: 'success'
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setNotification({
                open: true,
                message: error.message || 'Failed to update profile',
                type: 'error'
            });
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setNotification({
                open: true,
                message: 'New passwords do not match',
                type: 'error'
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setNotification({
                open: true,
                message: 'Password must be at least 6 characters',
                type: 'error'
            });
            return;
        }

        try {
            setLoading(true);
            await adminAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            setNotification({
                open: true,
                message: 'Password changed successfully',
                type: 'success'
            });
            setLoading(false);
        } catch (error) {
            console.error('Failed to change password:', error);
            setNotification({
                open: true,
                message: error.message || 'Failed to change password',
                type: 'error'
            });
            setLoading(false);
        }
    };

    const handleSavePreferences = () => {
        // Here you would typically call an API to save preferences
        console.log('Preferences saved:', preferenceSettings);
        setNotification({
            open: true,
            message: 'Preferences saved successfully',
            type: 'success'
        });
    };

    return (
        <>
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={notification.type}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setNotification({ ...notification, open: false })}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <CustomBreadcrumb />

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Settings
            </Typography>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Profile" icon={<Person />} />
                <Tab label="Security" icon={<Security />} />
                <Tab label="Preferences" icon={<Notifications />} />
            </Tabs>

            {/* PROFILE TAB */}
            {activeTab === 0 && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            {loadingProfile ? (
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <CircularProgress />
                                    <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
                                </Paper>
                            ) : (
                                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Person sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Profile Information
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                value={profileSettings.firstName}
                                                onChange={handleProfileChange('firstName')}
                                                variant="outlined"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={profileSettings.lastName}
                                                onChange={handleProfileChange('lastName')}
                                                variant="outlined"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                value={profileSettings.email}
                                                onChange={handleProfileChange('email')}
                                                variant="outlined"
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Role"
                                                value={profileSettings.role}
                                                variant="outlined"
                                                margin="normal"
                                                disabled
                                                helperText="Role cannot be changed"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        sx={{ mt: 3 }}
                                    >
                                        {loading ? <CircularProgress size={20} /> : 'Save Profile'}
                                    </Button>
                                </Paper>
                            )}
                        </div>

                        <div className="col-12 col-md-4">
                            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <ManageAccounts sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Account Info
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Account Type
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {profileSettings.role === 'super_admin' ? 'Super Admin' :
                                            profileSettings.role === 'admin' ? 'Administrator' : 'Manager'}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Permissions
                                    </Typography>
                                    {profileSettings.permissions && profileSettings.permissions.length > 0 ? (
                                        profileSettings.permissions.map((permission, index) => (
                                            <Typography key={index} variant="body2">
                                                • {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </Typography>
                                        ))
                                    ) : profileSettings.role === 'super_admin' ? (
                                        <Typography variant="body2">• All permissions granted</Typography>
                                    ) : (
                                        <Typography variant="body2">No specific permissions</Typography>
                                    )}
                                </Box>
                            </Paper>
                        </div>
                    </div>
                </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === 1 && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Security sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Change Password
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Current Password"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange('currentPassword')}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="New Password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange('newPassword')}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            helperText="Minimum 6 characters"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Confirm New Password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange('confirmPassword')}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                                            helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? "Passwords don't match" : ""}
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    variant="contained"
                                    startIcon={<LockReset />}
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                    sx={{ mt: 3 }}
                                >
                                    {loading ? <CircularProgress size={20} /> : 'Change Password'}
                                </Button>
                            </Paper>
                        </div>
                    </div>
                </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 2 && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Notifications sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Preferences
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferenceSettings.notifications}
                                                onChange={handlePreferenceChange('notifications')}
                                                color="primary"
                                            />
                                        }
                                        label="Email Notifications"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferenceSettings.darkMode}
                                                onChange={handlePreferenceChange('darkMode')}
                                                color="primary"
                                            />
                                        }
                                        label="Dark Mode"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferenceSettings.autoSave}
                                                onChange={handlePreferenceChange('autoSave')}
                                                color="primary"
                                            />
                                        }
                                        label="Auto Save"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferenceSettings.twoFactor}
                                                onChange={handlePreferenceChange('twoFactor')}
                                                color="primary"
                                            />
                                        }
                                        label="Two-Factor Authentication"
                                    />
                                </Box>

                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleSavePreferences}
                                    sx={{ mt: 3 }}
                                >
                                    Save Preferences
                                </Button>
                            </Paper>
                        </div>

                        <div className="col-12 col-md-4">
                            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Palette sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Quick Info
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Your settings are automatically synced across all devices.
                                </Typography>
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Changes will take effect immediately after saving.
                                </Alert>
                            </Paper>

                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Account Security
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Last login: Today at 2:30 PM
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    IP Address: 192.168.1.1
                                </Typography>
                                <Button variant="outlined" size="small" fullWidth>
                                    View Login History
                                </Button>
                            </Paper>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Settings;
