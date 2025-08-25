import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    IconButton
} from '@mui/material';
import {
    Edit,
    Delete,
    Visibility
} from '@mui/icons-material';

const Users = () => {
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 'Active',
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'User',
            status: 'Active',
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'Manager',
            status: 'Inactive',
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            role: 'User',
            status: 'Active',
            avatar: '/api/placeholder/40/40'
        }
    ];

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="primary">
                    Home / Users
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Users Management
            </Typography>

            <Paper
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        All Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your users and their permissions
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                {user.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            size="small"
                                            color={user.role === 'Admin' ? 'error' : user.role === 'Manager' ? 'warning' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status}
                                            size="small"
                                            color={user.status === 'Active' ? 'success' : 'default'}
                                            variant={user.status === 'Active' ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary">
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="info">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default Users;
