import React, { useState, useEffect } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Switch, Box, InputAdornment, TableSortLabel,
    IconButton
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CiSearch } from "react-icons/ci";
import { ref, onValue, set, remove } from 'firebase/database';
import { auth, database } from './firebase';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [cleared, setCleared] = React.useState(false);
    const[datepick,setDatePick] = React.useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const currentUser = auth.currentUser;
    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'online' ? 'offline' : 'online';
        try {
            // Create a reference to the user's status in the database
            const statusRef = ref(database, `users/${userId}/status`);

            // Update the user's status
            await set(statusRef, newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    const handleDelete = async (userId) => {
        // Check if the user is trying to delete themselves
        if (currentUser && currentUser.uid === userId) {
            console.error("You cannot delete yourself.");
            return;
        }

        try {
            // Remove the user from Firebase Authentication
            await auth.deleteUser(userId);

            // Remove the user's data from the database
            const userRef = ref(database, `users/${userId}`);
            remove(userRef);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const isCurrentUser = (userId) => {
        return currentUser && currentUser.uid === userId;
    };
    const handleAddUser = async () => {
        try {
            // Create a new user in Firebase authentication
            const userCredential = await auth.createUserWithEmailAndPassword(newUser.email, newUser.password);

            // Get the user's unique ID from authentication
            const userId = userCredential.user.uid;

            // Create a reference to the 'users' node in the database
            const userRef = ref(database, `users/${userId}`);

            // Add the new user's data to the database
            await set(userRef, {
                name: newUser.name,
                email: newUser.email,
                createdDate: new Date().toLocaleDateString(), // Add the current date
                status: 'active',
            });

            // Close the dialog and reset the newUser state
            setOpenDialog(false);
            setNewUser({ name: '', email: '', password: '' });
        } catch (error) {
            // Handle any errors that occur during user creation
            console.error(error);
        }
    };

    useEffect(() => {
        // Create a reference to the 'users' node in the database
        const userRef = ref(database, 'users');

        // Set up a listener for changes in the 'users' node
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map((userId) => ({
                    id: userId,
                    ...data[userId],
                }));
                setUsers(userList);
            } else {
                setUsers([]); // No users found
            }
        });
    }, []);
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedDate, setSelectedDate] = useState(null);



    const handleRequestSort = (property) => {
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleDateChange = (date) => {
        if(date){
            const dateObject = new Date(date.$d);
            const formattedDate = `${dateObject.getDate()>9?dateObject.getDate():`0${dateObject.getDate()}`}/${dateObject.getMonth() + 1>9?dateObject.getMonth()+1:`0${dateObject.getMonth()+1}`}/${dateObject.getFullYear()}`;
            
            setSelectedDate(formattedDate);
        }
        else{
            setSelectedDate(date);
        }
    };

    const filteredUsers = users
        .filter(user => {
            return (
                user.username.toLowerCase().includes(filter.toLowerCase()) &&
                (!selectedDate || user.createdDate === selectedDate)
            );
        })
        .sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });

    return (
        <div>
            <Box display="flex" alignItems="center" marginBottom={2}>
                <TextField
                    id="search"
                    placeholder="Filter by name..."
                    type="search"
                    onChange={handleFilterChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <CiSearch />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>

                    <DatePicker
                        label="Filter by date"
                        value={datepick}
                        onChange={handleDateChange}
                        sx={{ width: 260,marginLeft:"3rem" }}
                        slotProps={{
                            field: { clearable: true, onClear: () => setCleared(true) },
                        }}
                    />

                </LocalizationProvider>

            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Username
                            <TableSortLabel
                                active={sortBy === 'name'}
                                direction={sortBy === 'name' ? sortOrder : 'asc'}
                                onClick={() => handleRequestSort('name')}
                            />
                        </TableCell>
                        <TableCell>
                            Added Date
                            <TableSortLabel
                                active={sortBy === 'createdDate'}
                                direction={sortBy === 'createdDate' ? sortOrder : 'asc'}
                                onClick={() => handleRequestSort('createdDate')}
                            />
                        </TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.createdDate}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.status === 'online'}
                                    onChange={() => handleToggleStatus(user.id, user.status)}
                                    color="primary"
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" style={{ marginBottom: "1rem", marginRight: "2rem" }} onClick={() => setOpenDialog(true)}>
                                    Add
                                </Button>
                                {!isCurrentUser(user.id) && ( // Show delete button only if not current user
                                    <Button variant="contained" color="secondary" style={{ marginBottom: "1rem" }} onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        margin="normal"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddUser} color="primary">
                        Add User
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserTable;
