import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import configureStore from '../../../store';
import CustomerDetail, { Props } from '../CustomerDetail';
import { Customer } from '../../../store/customer/types';

describe('CustomerDetail', () => {
    const store = configureStore();

    const getFormattedDate = (date: Date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toJSON()
            .slice(0, 10)
            .split('-')
            .reverse()
            .join('/');

    const emptyCustomer: Customer = {
        id: 0,
        firstName: '',
        lastName: '',
        dob: new Date(),
    };

    const renderCustomerDetail = (props: Partial<Props> = {}) => {
        const defaultProps: Props = {
            customer: props.customer ? props.customer : emptyCustomer,
            open: true,
            handleClose: () => {
                return;
            },
        };
        return render(
            <Provider store={store}>
                <CustomerDetail {...defaultProps} {...props} />
            </Provider>,
        );
    };

    it('renders without crashing', () => {
        const { getByTestId } = renderCustomerDetail();

        expect(getByTestId('customerDetailDialog')).toBeInTheDocument();
    });

    it('renders correct customer info', () => {
        const { getByTestId } = renderCustomerDetail({
            customer: { id: 1, firstName: 'John', lastName: 'Snow', dob: new Date(1989, 11, 2) },
        });

        expect(getByTestId('customerDetailDialog')).toBeInTheDocument();
        expect((document.getElementById('firstName') as HTMLInputElement).value).toBe('John');
        expect((document.getElementById('lastName') as HTMLInputElement).value).toBe('Snow');
        expect((document.getElementById('dobDatePicker') as HTMLInputElement).value).toBe(
            getFormattedDate(new Date(1989, 11, 2)),
        );
    });

    it('adds new customer successfully', () => {
        const { getByTestId } = renderCustomerDetail();

        fireEvent.change(document.getElementById('firstName'), { target: { value: 'Test' } });
        fireEvent.change(document.getElementById('lastName'), { target: { value: 'Suite' } });
        fireEvent.change(document.getElementById('dobDatePicker'), {
            target: { value: getFormattedDate(new Date(1989, 10, 8)) },
        });
        fireEvent.click(getByTestId('saveCustomerBtn'));

        const newCustomer = store
            .getState()
            .customers.find((customer) => customer.firstName === 'Test' && customer.lastName === 'Suite');
        expect(newCustomer).not.toBeNull();
    });

    it('updates customer details successfully', () => {
        const { getByTestId } = renderCustomerDetail({
            customer: { id: 1, firstName: 'John', lastName: 'Snow', dob: new Date(1989, 11, 2) },
        });

        fireEvent.change(document.getElementById('firstName'), { target: { value: 'John1' } });
        fireEvent.change(document.getElementById('lastName'), { target: { value: 'Snow1' } });
        fireEvent.change(document.getElementById('dobDatePicker'), {
            target: { value: getFormattedDate(new Date(1989, 10, 8)) },
        });
        fireEvent.click(getByTestId('saveCustomerBtn'));

        const updatedCustomer = store.getState().customers.find((customer) => customer.id === 1);
        expect(updatedCustomer.firstName).toBe('John1');
        expect(updatedCustomer.lastName).toBe('Snow1');
        expect(updatedCustomer.dob.toJSON()).toBe(new Date(1989, 10, 8).toJSON());
    });
});
