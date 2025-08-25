import React, { useState } from 'react';
import {
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            background: {
                default: isDarkMode ? '#0f172a' : '#f8fafc',
                paper: isDarkMode ? '#1e293b' : '#ffffff'
            },
            text: {
                primary: isDarkMode ? '#ffffff' : '#1e293b'
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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
                <Header
                    onMenuClick={handleSidebarToggle}
                    isDarkMode={isDarkMode}
                    onThemeToggle={handleThemeToggle}
                />

                <Sidebar
                    open={sidebarOpen}
                    onClose={handleSidebarToggle}
                    isDarkMode={isDarkMode}
                />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        mt: 8,
                        backgroundColor: 'background.default',
                        minHeight: 'calc(100vh - 64px)',
                        width: '100%',
                        overflow: 'auto',
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
        </ThemeProvider>
    );
};

export default MainLayout;
