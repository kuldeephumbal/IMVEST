import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import {
    Edit,
    Save,
    Cancel,
    Person,
    Email,
    Phone,
    Lock,
    Visibility,
    VisibilityOff,
    PhotoCamera
} from '@mui/icons-material';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Profile data state
    const [profileData, setProfileData] = useState({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@cust.com',
        mobileNumber: '+1 234 567 8900',
        avatar: ''
    });

    // Edit form state
    const [editData, setEditData] = useState({ ...profileData });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load profile data from localStorage on component mount
    useEffect(() => {
        const storedProfile = localStorage.getItem('adminProfile');
        if (storedProfile) {
            const parsed = JSON.parse(storedProfile);
            setProfileData(parsed);
            setEditData(parsed);
        }
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData({ ...profileData }); // Reset changes
        }
        setIsEditing(!isEditing);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateProfile = () => {
        if (!editData.firstName.trim()) {
            setErrorMessage('First name is required');
            return false;
        }
        if (!editData.lastName.trim()) {
            setErrorMessage('Last name is required');
            return false;
        }
        if (!editData.email.trim() || !editData.email.includes('@')) {
            setErrorMessage('Valid email is required');
            return false;
        }
        if (!editData.mobileNumber.trim()) {
            setErrorMessage('Mobile number is required');
            return false;
        }
        return true;
    };

    const handleSaveProfile = () => {
        if (!validateProfile()) return;

        // Save to localStorage and update state
        localStorage.setItem('adminProfile', JSON.stringify(editData));
        setProfileData({ ...editData });
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setErrorMessage('');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const validatePasswordChange = () => {
        if (!passwordData.currentPassword) {
            setErrorMessage('Current password is required');
            return false;
        }
        if (!passwordData.newPassword) {
            setErrorMessage('New password is required');
            return false;
        }
        if (passwordData.newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters');
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrorMessage('New passwords do not match');
            return false;
        }
        // In a real app, you'd verify the current password against the server
        if (passwordData.currentPassword !== 'admin123') {
            setErrorMessage('Current password is incorrect');
            return false;
        }
        return true;
    };

    const handlePasswordSave = () => {
        if (!validatePasswordChange()) return;

        // In a real app, you'd send this to your backend
        localStorage.setItem('adminPassword', passwordData.newPassword);
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccessMessage('Password changed successfully!');
        setErrorMessage('');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handlePasswordDialogClose = () => {
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrorMessage('');
    };

    return (
        <>
            <CustomBreadcrumb />

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        background: 'rgba(76, 175, 80, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        borderRadius: '15px',
                        color: '#4caf50'
                    }}
                >
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        background: 'rgba(244, 67, 54, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        borderRadius: '15px',
                        color: '#f44336'
                    }}
                >
                    {errorMessage}
                </Alert>
            )}

            <div className="container-fluid">
                <div className="row justify-content-center">
                    {/* Profile Picture and Actions Card */}
                    <div className="col-12 col-md-4 mb-3">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                                    Profile Picture
                                </Typography>

                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                    <Avatar
                                        src={profileData.avatar || "/api/placeholder/120/120"}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: '4px solid rgba(255, 255, 255, 0.3)',
                                            borderColor: 'rgba(96, 165, 250, 0.8)'
                                        }}
                                    >
                                        {!profileData.avatar && `${profileData.firstName[0]}${profileData.lastName[0]}`}
                                    </Avatar>
                                    {isEditing && (
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                color: 'white',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <PhotoCamera />
                                        </IconButton>
                                    )}
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {profileData.firstName} {profileData.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                                    Administrator
                                </Typography>

                                <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Lock />}
                                    onClick={() => setShowPasswordDialog(true)}
                                    sx={{
                                        mb: 2,
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        color: 'white',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            background: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Change Password
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Information Card */}
                    <div className="col-12 col-md-8 mb-3">
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        Profile Information
                                    </Typography>
                                    <Box>
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Cancel />}
                                                    onClick={handleEditToggle}
                                                    sx={{
                                                        mr: 1,
                                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                                        color: 'white',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        '&:hover': {
                                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                                            background: 'rgba(255, 255, 255, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Save />}
                                                    onClick={handleSaveProfile}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                        }
                                                    }}
                                                >
                                                    Save Changes
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                startIcon={<Edit />}
                                                onClick={handleEditToggle}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                    }
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

                                <div className="row">
                                    <div className="col-12 col-sm-6 mb-3">
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            value={isEditing ? editData.firstName : profileData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    </InputAdornment>
                                                )
                                            }}
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
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: 'rgba(255, 255, 255, 0.6)'
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
                                    <div className="col-12 col-sm-6 mb-3">
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            value={isEditing ? editData.lastName : profileData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    </InputAdornment>
                                                )
                                            }}
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
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: 'rgba(255, 255, 255, 0.6)'
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
                                    <div className="col-12 col-sm-6 mb-3">
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            type="email"
                                            value={isEditing ? editData.email : profileData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    </InputAdornment>
                                                )
                                            }}
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
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: 'rgba(255, 255, 255, 0.6)'
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
                                    <div className="col-12 col-sm-6 mb-3">
                                        <TextField
                                            fullWidth
                                            label="Mobile Number"
                                            value={isEditing ? editData.mobileNumber : profileData.mobileNumber}
                                            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Phone sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    </InputAdornment>
                                                )
                                            }}
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
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: 'rgba(255, 255, 255, 0.6)'
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Password Change Dialog */}
            <Dialog
                open={showPasswordDialog}
                onClose={handlePasswordDialogClose}
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
                        Change Password
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        >
                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
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
                        <TextField
                            fullWidth
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
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
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
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
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handlePasswordDialogClose}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordSave}
                        variant="contained"
                        startIcon={<Save />}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Profile;
