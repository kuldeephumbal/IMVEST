import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import Header from './components/header';
import Sidebar from './components/Sidebar';
import backgroundImage from './assets/img/img01.jpg';

const App = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const location = useLocation();

    // TODO: Add authentication check here when needed
    // useEffect(() => {
    //     const isLoggedIn = localStorage.getItem('isLoggedIn');
    //     const adminToken = localStorage.getItem('adminToken');
    //     const adminData = localStorage.getItem('adminData');
    //     
    //     if (!isLoggedIn || !adminToken || !adminData) {
    //         navigate('/login');
    //     }
    // }, [navigate]);

    const theme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#0f172a',
                paper: '#1e293b'
            },
            text: {
                primary: '#ffffff'
            }
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }
    });

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Don't show layout for 404 or other special pages
    const showLayout = !location.pathname.includes('404');

    if (!showLayout) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
                <Sidebar
                    open={sidebarOpen}
                    onClose={handleSidebarToggle}
                    isDarkMode={isDarkMode}
                />

                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        width: '100%',
                        ml: 0
                    }}
                >
                    <Header
                        onMenuClick={handleSidebarToggle}
                        isDarkMode={isDarkMode}
                        onThemeToggle={handleThemeToggle}
                        sidebarOpen={sidebarOpen}
                    />

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            pt: '88px', // Add top padding to account for fixed header (64px header + 24px padding)
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'fixed',
                            position: 'relative',
                            overflow: 'auto',
                            minHeight: '100vh',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better readability
                                zIndex: -1
                            },
                            '&::-webkit-scrollbar': {
                                display: 'none !important',
                                width: '0 !important',
                                height: '0 !important'
                            },
                            scrollbarWidth: 'none !important',
                            msOverflowStyle: 'none !important',
                            '& *::-webkit-scrollbar': {
                                display: 'none !important',
                                width: '0 !important',
                                height: '0 !important'
                            },
                            '& *': {
                                scrollbarWidth: 'none !important',
                                msOverflowStyle: 'none !important'
                            }
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;
