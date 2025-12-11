import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    Box,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Typography,
    useTheme,
    useMediaQuery,
    Stack,
    Collapse,
    Pagination,
} from '@mui/material';
import {
    Search,
    KeyboardArrowDown,
    KeyboardArrowUp
} from '@mui/icons-material';

const BaseTable = ({
    columns = [],
    data = [],
    title = '',
    searchable = true,
    sortable = true,
    paginated = true,
    defaultRowsPerPage = 10,
    onRowClick = null,
    renderActions = null,
    emptyMessage = 'No data available',
    primaryColumn = null // The most important column to show in mobile accordion header
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(defaultRowsPerPage);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');

    // Handle search
    const filteredData = searchable
        ? data.filter((row) =>
            columns.some((column) => {
                const value = row[column.field];
                return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        )
        : data;

    // Handle sorting
    const sortedData = sortable && orderBy
        ? [...filteredData].sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (aValue === bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return order === 'asc' ? comparison : -comparison;
        })
        : filteredData;

    // Handle pagination
    const paginatedData = paginated
        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedData;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleRequestSort = (property) => {
        if (!sortable) return;

        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Render cell content based on column type
    const renderCellContent = (column, row) => {
        const value = row[column.field];

        if (column.renderCell) {
            return column.renderCell(row);
        }

        if (column.type === 'status') {
            return (
                <Chip
                    label={value}
                    size="small"
                    color={column.statusColors?.[value] || 'default'}
                    sx={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        minWidth: '80px'
                    }}
                />
            );
        }

        if (column.type === 'date') {
            return value ? new Date(value).toLocaleDateString() : '-';
        }

        if (column.type === 'currency') {
            return value ? `$${parseFloat(value).toLocaleString()}` : '$0';
        }

        if (column.type === 'percentage') {
            return value ? `${value}%` : '0%';
        }

        return value || '-';
    };

    // Mobile Accordion View
    const MobileAccordionView = ({ row }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        // Get primary column (first column if not specified)
        const primaryCol = primaryColumn || columns[0];

        return (
            <Box
                sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:last-child': {
                        borderBottom: 'none'
                    }
                }}
            >
                {/* Accordion Header Row */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.03)'
                        }
                    }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Expand Icon */}
                    <IconButton
                        size="small"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            p: 0,
                            mr: 1
                        }}
                    >
                        {isExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                    </IconButton>

                    {/* Primary Column Value */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {renderCellContent(primaryCol, row)}
                        </Box>
                    </Box>

                    {/* Actions */}
                    {renderActions && (
                        <Box
                            sx={{ display: 'flex', gap: 0.5, ml: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {renderActions(row)}
                        </Box>
                    )}
                </Box>

                {/* Accordion Expanded Content */}
                <Collapse in={isExpanded}>
                    <Box sx={{
                        p: 2,
                        pt: 1.5,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <Stack spacing={1.5}>
                            {columns.map((column, colIndex) => (
                                <Box key={colIndex} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            display: 'block',
                                            mb: 0.5,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {column.headerName}
                                    </Typography>
                                    <Box
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {renderCellContent(column, row)}
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Collapse>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            {/* Header Section */}
            {(title || searchable) && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                        mb: 3
                    }}
                >
                    {title && (
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                color: 'rgba(255, 255, 255, 0.9)'
                            }}
                        >
                            {title}
                        </Typography>
                    )}
                    {searchable && (
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                width: { xs: '100%', sm: '300px' },
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#60a5fa'
                                    }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    opacity: 1
                                }
                            }}
                        />
                    )}
                </Box>
            )}

            {/* Mobile View */}
            {isMobile ? (
                <Box>
                    {paginatedData.length === 0 ? (
                        <Box
                            sx={{
                                p: 4,
                                textAlign: 'center'
                            }}
                        >
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                {emptyMessage}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {/* Table Header for Mobile */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1.5,
                                    mb: 2,
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <Box sx={{ width: 24, mr: 1 }} /> {/* Spacer for expand icon */}
                                    <Typography
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {(primaryColumn || columns[0])?.headerName}
                                    </Typography>
                                </Box>
                                {renderActions && (
                                    <Typography
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            ml: 1
                                        }}
                                    >
                                        Actions
                                    </Typography>
                                )}
                            </Box>

                            {/* Accordion Rows Container */}
                            <Box>
                                {paginatedData.map((row, index) => (
                                    <MobileAccordionView key={row.id || index} row={row} />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            ) : (
                /* Desktop/Tablet Table View */
                <TableContainer
                    component={Paper}
                    sx={{
                        background: 'transparent',
                        boxShadow: 'none',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.3)'
                            }
                        }
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.field}
                                        align={column.align || 'left'}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontWeight: 'bold',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            whiteSpace: 'nowrap',
                                            minWidth: column.minWidth || 'auto',
                                            width: column.width || 'auto'
                                        }}
                                    >
                                        {sortable && column.sortable !== false ? (
                                            <TableSortLabel
                                                active={orderBy === column.field}
                                                direction={orderBy === column.field ? order : 'asc'}
                                                onClick={() => handleRequestSort(column.field)}
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.9) !important',
                                                    '&:hover': {
                                                        color: 'white !important'
                                                    },
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: 'rgba(255, 255, 255, 0.7) !important'
                                                    },
                                                    '&.Mui-active': {
                                                        color: 'white !important',
                                                        '& .MuiTableSortLabel-icon': {
                                                            color: 'white !important'
                                                        }
                                                    }
                                                }}
                                            >
                                                {column.headerName}
                                            </TableSortLabel>
                                        ) : (
                                            column.headerName
                                        )}
                                    </TableCell>
                                ))}
                                {renderActions && (
                                    <TableCell
                                        align="center"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontWeight: 'bold',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            minWidth: '100px'
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (renderActions ? 1 : 0)}
                                        align="center"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            py: 8,
                                            borderBottom: 'none'
                                        }}
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row, index) => (
                                    <TableRow
                                        key={row.id || index}
                                        hover
                                        onClick={() => onRowClick && onRowClick(row)}
                                        sx={{
                                            cursor: onRowClick ? 'pointer' : 'default',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                            },
                                            '&:last-child td': {
                                                borderBottom: 'none'
                                            }
                                        }}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.field}
                                                align={column.align || 'left'}
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            >
                                                {renderCellContent(column, row)}
                                            </TableCell>
                                        ))}
                                        {renderActions && (
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                                }}
                                            >
                                                {renderActions(row)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            {paginated && filteredData.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 3,
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    <Pagination
                        count={Math.ceil(filteredData.length / rowsPerPage)}
                        page={page + 1}
                        onChange={(event, value) => handleChangePage(event, value - 1)}
                        showFirstButton
                        showLastButton
                        variant="outlined"
                        shape="rounded"
                        siblingCount={1}
                        boundaryCount={1}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default BaseTable;
