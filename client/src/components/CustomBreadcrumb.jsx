import React from 'react';
import { Breadcrumbs, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Home, NavigateNext } from '@mui/icons-material';

const CustomBreadcrumb = ({
    customPath = null,
    customLabels = {},
    customRoutes = {},
    showHome = true,
    sx = {}
}) => {
    const location = useLocation();
    const pathnames = customPath ? customPath.split('/').filter(x => x) : location.pathname.split('/').filter(x => x);

    // Default path labels
    const defaultLabels = {
        'dashboard': 'Dashboard',
        'client-management': 'Client Management',
        'client-details': 'Client Details',
        'contracts': 'Contracts & Documents',
        'communication': 'Communication System',
        'settings': 'Settings',
        'profile': 'Profile',
        '': 'Dashboard'
    };

    const labels = { ...defaultLabels, ...customLabels };

    const breadcrumbItems = [];

    // Add home if requested
    if (showHome) {
        breadcrumbItems.push(
            <Link
                key="home"
                to="/"
                style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
                <Home sx={{ mr: 0.5, fontSize: 16 }} />
                Home
            </Link>
        );
    }

    // Add path items
    pathnames.forEach((name, index) => {
        // Use custom route if provided, otherwise use default route construction
        const routeTo = customRoutes[name] || `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        if (isLast) {
            breadcrumbItems.push(
                <Typography
                    key={name}
                    sx={{
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                >
                    {labels[name] || name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
            );
        } else {
            breadcrumbItems.push(
                <Link
                    key={name}
                    to={routeTo}
                    style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                    {labels[name] || name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
            );
        }
    });

    return (
        <Box
            sx={{
                padding: '12px 0',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                ...sx
            }}
        >
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-ol': {
                        alignItems: 'center'
                    }
                }}
            >
                {breadcrumbItems}
            </Breadcrumbs>
        </Box>
    );
};

export default CustomBreadcrumb;
