import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Box,
    Badge,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    Settings,
    Person,
    Logout,
    AdminPanelSettings,
    SupervisedUserCircle
} from '@mui/icons-material';

const Header = ({ onMenuClick, sidebarOpen }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const [adminData, setAdminData] = useState(null);

    // Load admin data from localStorage
    useEffect(() => {
        const storedAdminData = localStorage.getItem('adminData');
        if (storedAdminData) {
            try {
                setAdminData(JSON.parse(storedAdminData));
            } catch (error) {
                console.error('Error parsing admin data:', error);
            }
        }
    }, []);

    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    const handleLogout = async () => {
        handleProfileMenuClose();

        // TODO: Add API call here
        // Clear all stored data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');

        // Navigate to login
        navigate('/login');
    };

    const handleProfile = () => {
        handleProfileMenuClose();
        // Navigate to profile page
        navigate('/profile');
    };

    const handleSettings = () => {
        handleProfileMenuClose();
        // Navigate to settings page
        navigate('/settings');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'rgba(30, 41, 59, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderTop: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                zIndex: theme.zIndex.drawer + 1,
                // Responsive behavior: full width on mobile, adjust for sidebar on desktop
                left: isMobile ? 0 : (sidebarOpen ? '280px' : '0px'),
                width: isMobile ? '100%' : (sidebarOpen ? 'calc(100% - 280px)' : '100%'),
                transition: 'left 0.3s ease, width 0.3s ease',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(30, 41, 59, 0.2)',
                    zIndex: -1
                }
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onMenuClick}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* User Info Display */}
                    {adminData && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {adminData.firstName} {adminData.lastName}
                            </Typography>
                            <Chip
                                icon={
                                    adminData.role === 'super_admin' ? <AdminPanelSettings /> :
                                        adminData.role === 'manager' ? <SupervisedUserCircle /> :
                                            <Person />
                                }
                                label={
                                    adminData.role === 'super_admin' ? 'Super Admin' :
                                        adminData.role === 'admin' ? 'Admin' :
                                            adminData.role === 'manager' ? 'Manager' :
                                                adminData.role.charAt(0).toUpperCase() + adminData.role.slice(1)
                                }
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '& .MuiChip-icon': {
                                        color: 'rgba(255, 255, 255, 0.7)'
                                    }
                                }}
                            />
                        </Box>
                    )}

                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        color="inherit"
                        onClick={handleProfileMenuOpen}
                        sx={{ p: 0.5 }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: adminData?.role === 'super_admin' ? '#d32f2f' :
                                    adminData?.role === 'manager' ? '#388e3c' : '#1976d2'
                            }}
                        >
                            <Person fontSize="small" />
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={handleProfileMenuClose}
                        onClick={handleProfileMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        sx={{
                            '& .MuiPaper-root': {
                                minWidth: 200,
                                mt: 1.5,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                borderRadius: 2
                            }
                        }}
                    >
                        <MenuItem onClick={handleProfile}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Profile"
                                secondary={adminData ? `${adminData.firstName} ${adminData.lastName}` : ''}
                            />
                        </MenuItem>

                        <MenuItem onClick={handleSettings}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;