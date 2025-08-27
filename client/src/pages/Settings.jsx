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
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Home / Settings
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Settings
            </Typography>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-8">
                        <Paper
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                mb: 3
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Security sx={{ mr: 2, color: '#60a5fa' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#60a5fa'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#60a5fa'
                                                }
                                            }
                                        }}
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#60a5fa'
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#60a5fa'
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                                sx={{
                                    mt: 3,
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Paper>

                        <Paper
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Notifications sx={{ mr: 2, color: '#60a5fa' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    Preferences
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.notifications}
                                            onChange={handleChange('notifications')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#60a5fa'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#60a5fa'
                                                }
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{ color: 'white' }}>Email Notifications</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.darkMode}
                                            onChange={handleChange('darkMode')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#60a5fa'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#60a5fa'
                                                }
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{ color: 'white' }}>Dark Mode</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.autoSave}
                                            onChange={handleChange('autoSave')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#60a5fa'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#60a5fa'
                                                }
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{ color: 'white' }}>Auto Save</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.twoFactor}
                                            onChange={handleChange('twoFactor')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#60a5fa'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#60a5fa'
                                                }
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{ color: 'white' }}>Two-Factor Authentication</Typography>}
                                />
                            </Box>
                        </Paper>
                    </div>

                    <div className="col-12 col-md-4">
                        <Paper
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                mb: 3
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Palette sx={{ mr: 2, color: '#60a5fa' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    Quick Info
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                Your settings are automatically synced across all devices.
                            </Typography>
                            <Alert
                                severity="info"
                                sx={{
                                    mt: 2,
                                    background: 'rgba(33, 150, 243, 0.1)',
                                    border: '1px solid rgba(33, 150, 243, 0.3)',
                                    color: '#2196f3',
                                    '& .MuiAlert-icon': {
                                        color: '#2196f3'
                                    }
                                }}
                            >
                                Changes will take effect immediately after saving.
                            </Alert>
                        </Paper>

                        <Paper
                            sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                Account Security
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                Last login: Today at 2:30 PM
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                IP Address: 192.168.1.1
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        background: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
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
