import React, { useState } from 'react';
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
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    Settings,
    Mail,
    Brightness4,
    Brightness7,
    Person,
    Logout,
    AccountCircle
} from '@mui/icons-material';

const Header = ({ onMenuClick, isDarkMode, onThemeToggle, sidebarOpen }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const isProfileMenuOpen = Boolean(profileMenuAnchor);
    console.log('Profile menu open:', isProfileMenuOpen);

    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        // Clear login state and redirect to login
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const handleProfile = () => {
        handleProfileMenuClose();
        // Navigate to profile page
        navigate('/profile');
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
                    <IconButton color="inherit" onClick={onThemeToggle}>
                        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

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
                            src="/api/placeholder/32/32"
                            sx={{ width: 32, height: 32 }}
                        />
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
                            <ListItemText>Profile</ListItemText>
                        </MenuItem>

                        <MenuItem onClick={handleProfileMenuClose}>
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