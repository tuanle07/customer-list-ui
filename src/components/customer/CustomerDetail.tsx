import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker, MaterialUiPickersDate } from '@material-ui/pickers';

import { Customer } from '../../store/customer/types';
import { setCustomerList } from '../../store/customer/actions';
import { AppState } from '../../store';

export interface Props {
    customer: Customer;
    open: boolean;
    handleClose: () => void;
}

const CustomerDetail: FC<Props> = ({ customer, open, handleClose }) => {
    const [customerDetail, setCustomerDetail] = useState({ ...customer });
    const customerList = useSelector((state: AppState) => state.customers);
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDateChange = (date: MaterialUiPickersDate) => {
        if (!date) return;
        setCustomerDetail({ ...customerDetail, dob: date });
    };

    const handleTextChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerDetail({ ...customerDetail, [name]: event.target.value });
    };

    const handleSaveCustomer = () => {
        let newCustomerList = [...customerList];
        newCustomerList = newCustomerList.filter((customer) => customer.id !== customerDetail.id);
        const newCustomer = { ...customerDetail };
        if (newCustomer.id === 0) {
            newCustomer.id = Math.max(...newCustomerList.map((c) => c.id), 0) + 1;
            setCustomerDetail(newCustomer);
        }
        newCustomerList.push(newCustomer);
        dispatch(setCustomerList(newCustomerList));
        handleClose();
    };

    const getDialogTitle = () =>
        customerDetail.id !== 0 ? `${customerDetail.firstName} ${customerDetail.lastName}` : 'New Customer';

    useEffect(() => {
        setCustomerDetail({ ...customer });
    }, [customer]);

    return (
        <Dialog
            data-testid="customerDetailDialog"
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="customer-detail-dialog"
        >
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogContent>
                <DialogContentText>Below is the detailed profile of the customer</DialogContentText>
                <form data-testid="customerDetailForm" autoComplete="off">
                    <TextField
                        required={true}
                        autoFocus={true}
                        margin="dense"
                        id="firstName"
                        label="First Name"
                        defaultValue={customerDetail.firstName}
                        type="text"
                        fullWidth={true}
                        onChange={handleTextChange('firstName')}
                    />
                    <TextField
                        required={true}
                        margin="dense"
                        id="lastName"
                        label="Last Name"
                        defaultValue={customerDetail.lastName}
                        type="text"
                        fullWidth={true}
                        onChange={handleTextChange('lastName')}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar={true}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="dobDatePicker"
                            label="Date of Birth"
                            helperText="dd/mm/yyyy"
                            value={customerDetail.dob}
                            onChange={handleDateChange}
                        />
                    </MuiPickersUtilsProvider>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    disabled={!customerDetail.firstName || !customerDetail.lastName}
                    onClick={handleSaveCustomer}
                    data-testid="saveCustomerBtn"
                    color="primary"
                    autoFocus={true}
                >
                    {customerDetail.id === 0 ? 'Add' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDetail;
