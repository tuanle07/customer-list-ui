import React, { useState, FC } from 'react';
import { makeStyles, Theme, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { ThemeProvider } from '@material-ui/styles';
import { Box, Fab, Icon, TextField, Tooltip } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import CustomerDetail from './CustomerDetail';
import stringToColor from '../../utils/stringToColor';
import { AppState } from '../../store/index';
import { Customer } from '../../store/customer/types';
import { deleteCustomer } from '../../store/customer/actions';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    margin: {
        margin: theme.spacing(1),
    },
    searchBox: {
        flexGrow: 1,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(2),
        justifyContent: 'space-evenly',
    },
}));

const CustomerList: FC<{}> = () => {
    const classes = useStyles();
    const customerList = useSelector((state: AppState) => state.customers);
    const dispatch = useDispatch();
    const emptyCustomer: Customer = {
        id: 0,
        firstName: '',
        lastName: '',
        dob: new Date(),
    };
    const [selectedCustomer, setSelectedCustomer] = useState(emptyCustomer);
    const [checkedCustomerIds, setCheckedCustomerIds] = useState<number[]>([]);
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleOpenCustomerDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setOpenCustomerDialog(true);
    };

    const handleCloseCustomerDialog = () => {
        setOpenCustomerDialog(false);
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(emptyCustomer);
        setOpenCustomerDialog(true);
    };

    const handleDeleteCustomers = () => {
        checkedCustomerIds.forEach((id) => {
            dispatch(deleteCustomer(id));
        });
        setCheckedCustomerIds([]);
    };

    const handleSearchCustomer = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleToggle = (value: number) => () => {
        const currentIndex = checkedCustomerIds.indexOf(value);
        const newCheckedCustomerIds = [...checkedCustomerIds];

        if (currentIndex === -1) {
            newCheckedCustomerIds.push(value);
        } else {
            newCheckedCustomerIds.splice(currentIndex, 1);
        }

        setCheckedCustomerIds(newCheckedCustomerIds);
    };

    const getPrimaryText = (customer: Customer) => (
        <Typography component="span" variant="body1" className={classes.inline} color="textPrimary">
            {customer.firstName} {customer.lastName}
        </Typography>
    );

    const getSecondaryText = (customer: Customer) => (
        <>
            <Typography component="span" variant="body2" className={classes.inline} color="textSecondary">
                Born on {customer.dob.toDateString()}
            </Typography>
        </>
    );

    const renderListItem = () =>
        [...customerList]
            .filter(
                (customer) =>
                    customer.firstName.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
                    customer.lastName.toLowerCase().search(searchValue.toLowerCase()) !== -1,
            )
            .sort((a, b) => a.id - b.id)
            .map((customer) => (
                <div key={customer.id} data-testid={`customerId-${customer.id}`}>
                    <ListItem button={true} onClick={() => handleOpenCustomerDialog(customer)} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar
                                style={{
                                    backgroundColor: stringToColor(`${customer.firstName} ${customer.lastName}`),
                                }}
                            >
                                {customer.firstName.charAt(0).toUpperCase()}
                                {customer.lastName.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={getPrimaryText(customer)} secondary={getSecondaryText(customer)} />
                        <ListItemSecondaryAction>
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(customer.id)}
                                checked={checkedCustomerIds.indexOf(customer.id) !== -1}
                                inputProps={{ 'aria-labelledby': `checkbox-list-${customer.id}` }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </div>
            ));

    return (
        <ThemeProvider theme={theme}>
            <Typography variant="h3" component="h1">
                <Box m={2}>Customer List</Box>
            </Typography>
            <Box ml={1} display="flex" justifyContent="space-between">
                <TextField
                    className={classes.searchBox}
                    autoFocus={true}
                    margin="dense"
                    data-testid="searchTb"
                    placeholder="Search here..."
                    type="text"
                    onChange={handleSearchCustomer('search')}
                />
                <Box>
                    <Tooltip title="Add new customer">
                        <Fab
                            onClick={handleAddCustomer}
                            size="small"
                            color="primary"
                            aria-label="add"
                            data-testid="addCustomerBtn"
                            className={classes.margin}
                        >
                            <Icon>add</Icon>
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Delete checked customer(s)">
                        <span>
                            <Fab
                                onClick={handleDeleteCustomers}
                                disabled={!checkedCustomerIds.length}
                                size="small"
                                color="primary"
                                data-testid="deleteCustomerBtn"
                                aria-label="delete"
                                className={classes.margin}
                            >
                                <Icon>delete_outline</Icon>
                            </Fab>
                        </span>
                    </Tooltip>
                </Box>
            </Box>
            <List data-testid="customerList" dense={true} className={classes.root}>
                {renderListItem()}
            </List>
            <CustomerDetail
                customer={selectedCustomer}
                open={openCustomerDialog}
                handleClose={handleCloseCustomerDialog}
            />
        </ThemeProvider>
    );
};

export default CustomerList;
