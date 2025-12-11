import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography,
    Divider,
    Box,
    Collapse,
    Chip,
    useTheme,
    useMediaQuery,
    IconButton
} from '@mui/material';
import {
    Dashboard,
    ExpandLess,
    ExpandMore,
    Close,
    Message,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

const drawerWidth = 280;

const Sidebar = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState({});

    // Get active item from current path
    const getActiveItemFromPath = () => {
        const path = location.pathname;
        if (path === '/' || path === '/dashboard') return 'Dashboard';
        if (path === '/contracts') return 'Contracts & Documents';
        if (path === '/communication') return 'Communication System';
        return 'Dashboard';
    };

    const [activeItem, setActiveItem] = useState(getActiveItemFromPath());

    // Update active item when route changes
    useEffect(() => {
        const getActiveFromPath = () => {
            const path = location.pathname;
            if (path === '/' || path === '/dashboard') return 'Dashboard';
            if (path === '/contracts') return 'Contracts & Documents';
            if (path === '/communication') return 'Communication System';
            return 'Dashboard';
        };
        setActiveItem(getActiveFromPath());
    }, [location.pathname]);

    const handleExpandClick = (item) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handleItemClick = (item) => {
        if (item.expandable) {
            handleExpandClick(item.title);
        } else {
            setActiveItem(item.title);
            // Navigate to the appropriate route
            if (item.path) {
                navigate(item.path);
            }
            // Close sidebar on mobile after navigation
            if (isMobile) {
                onClose();
            }
        }
    };

    const handleChildClick = (childName, parentTitle) => {
        setActiveItem(`${parentTitle}-${childName}`);
        // You can add navigation for child items here if needed
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <Dashboard />,
            path: '/dashboard'
        },
        {
            title: 'Communication System',
            icon: <Message />,
            path: '/communication'
        }
    ];

    const renderMenuItem = (item, index) => {
        if (item.divider) {
            return (
                <Box key={index}>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                        variant="caption"
                        sx={{
                            px: 2,
                            py: 1,
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 'bold',
                            display: 'block'
                        }}
                    >
                        {item.title}
                    </Typography>
                </Box>
            );
        }

        const isExpanded = expandedItems[item.title];
        const isActive = activeItem === item.title;

        return (
            <Box key={index}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleItemClick(item)}
                        sx={{
                            borderRadius: 2,
                            mx: 1,
                            my: 0.5,
                            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                            backdropFilter: isActive ? 'blur(10px)' : 'none',
                            '&:hover': {
                                backgroundColor: isActive
                                    ? 'rgba(59, 130, 246, 0.3)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ListItemIcon sx={{
                            color: isActive ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                            minWidth: 40,
                            transition: 'color 0.3s ease'
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.title}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: isActive ? '#60a5fa' : 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: isActive ? '600' : '500',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }}
                        />
                        {item.badge && (
                            <Chip
                                label={item.badge.text}
                                size="small"
                                color={item.badge.color}
                                sx={{ ml: 1, height: 20 }}
                            />
                        )}
                        {item.expandable && (
                            isExpanded ? <ExpandLess /> : <ExpandMore />
                        )}
                    </ListItemButton>
                </ListItem>

                {item.expandable && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children?.map((child, childIndex) => {
                                const childKey = `${item.title}-${child}`;
                                const isChildActive = activeItem === childKey;

                                return (
                                    <ListItem key={childIndex} disablePadding>
                                        <ListItemButton
                                            sx={{
                                                pl: 6,
                                                borderRadius: 2,
                                                mx: 1,
                                                my: 0.25,
                                                backgroundColor: isChildActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                                border: isChildActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                                                backdropFilter: isChildActive ? 'blur(10px)' : 'none',
                                                '&:hover': {
                                                    backgroundColor: isChildActive
                                                        ? 'rgba(59, 130, 246, 0.3)'
                                                        : 'rgba(255, 255, 255, 0.1)',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    backdropFilter: 'blur(10px)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => handleChildClick(child, item.title)}
                                        >
                                            <ListItemText
                                                primary={child}
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        color: isChildActive ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                                                        fontWeight: isChildActive ? '600' : '500',
                                                        fontSize: '0.9rem',
                                                        transition: 'all 0.3s ease',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Collapse>
                )}
            </Box>
        );
    };

    const drawerContent = (
        <Box
            sx={{
                width: drawerWidth,
                height: '100%',
                background: '#060606',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                overflow: 'hidden',
                overflowX: 'hidden',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.4) 100%)',
                    zIndex: -1
                }
            }}
        >
            <Box sx={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <Typography variant="h6" sx={{
                    color: '#60a5fa',
                    fontWeight: '700',
                    fontSize: '1.3rem',
                }}>
                    CUST
                </Typography>
                {isMobile && (
                    <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
                        <Close />
                    </IconButton>
                )}
            </Box>
            <List sx={{
                px: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                height: 'calc(100vh - 64px)',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                '&::-webkit-scrollbar-horizontal': {
                    display: 'none'
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {menuItems.map((item, index) => renderMenuItem(item, index))}
            </List>
        </Box>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "persistent"}
            open={open}
            onClose={onClose}
            ModalProps={isMobile ? { keepMounted: true } : undefined}
            sx={{
                width: open ? drawerWidth : 0,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    border: 'none',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: theme.zIndex.drawer,
                    transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
                    transition: 'transform 0.3s ease',
                    background: 'rgba(30, 41, 59, 0.95) !important',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                    overflowX: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        zIndex: -1
                    }
                }
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

export default Sidebar;