import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert
} from '@mui/material';
import {
    Save,
    Notifications,
    Security,
    Palette
} from '@mui/icons-material';

const Settings = () => {
    const [settings, setSettings] = useState({
        companyName: 'IMVEST',
        email: 'admin@imvest.com',
        notifications: true,
        darkMode: true,
        autoSave: false,
        twoFactor: true
    });

    const handleChange = (field) => (event) => {
        setSettings({
            ...settings,
            [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });
    };

    const handleSave = () => {
        // Handle save logic here
        console.log('Settings saved:', settings);
    };

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="primary">
                    Home / Settings
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Settings
            </Typography>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-8">
                        <Paper
                            sx={{
                                p: 3,
                                backgroundColor: 'background.paper',
                                borderRadius: 2,
                                mb: 3
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Security sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    General Settings
                                </Typography>
                            </Box>

                            <div className="row">
                                <div className="col-12 col-sm-6">
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        value={settings.companyName}
                                        onChange={handleChange('companyName')}
                                        variant="outlined"
                                    />
                                </div>
                                <div className="col-12 col-sm-6">
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={settings.email}
                                        onChange={handleChange('email')}
                                        variant="outlined"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                                sx={{ mt: 3 }}
                            >
                                Save Changes
                            </Button>
                        </Paper>

                        <Paper
                            sx={{
                                p: 3,
                                backgroundColor: 'background.paper',
                                borderRadius: 2
                            }}
                        >
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
                                            checked={settings.notifications}
                                            onChange={handleChange('notifications')}
                                            color="primary"
                                        />
                                    }
                                    label="Email Notifications"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.darkMode}
                                            onChange={handleChange('darkMode')}
                                            color="primary"
                                        />
                                    }
                                    label="Dark Mode"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.autoSave}
                                            onChange={handleChange('autoSave')}
                                            color="primary"
                                        />
                                    }
                                    label="Auto Save"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.twoFactor}
                                            onChange={handleChange('twoFactor')}
                                            color="primary"
                                        />
                                    }
                                    label="Two-Factor Authentication"
                                />
                            </Box>
                        </Paper>
                    </div>

                    <div className="col-12 col-md-4">
                        <Paper
                            sx={{
                                p: 3,
                                backgroundColor: 'background.paper',
                                borderRadius: 2,
                                mb: 3
                            }}
                        >
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

                        <Paper
                            sx={{
                                p: 3,
                                backgroundColor: 'background.paper',
                                borderRadius: 2
                            }}
                        >
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
        </>
    );
};

export default Settings;
