import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CustomerList from '../CustomerList';
import configureStore from '../../../store';

describe('CustomerList', () => {
    const store = configureStore();

    const getFormattedDate = (date: Date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toJSON()
            .slice(0, 10)
            .split('-')
            .reverse()
            .join('/');

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <CustomerList />
            </Provider>,
            div,
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders correct DOM elements', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomerList />
            </Provider>,
        );

        expect(getByTestId('searchTb')).toBeDefined();
        expect(getByTestId('addCustomerBtn')).toBeDefined();
        expect(getByTestId('deleteCustomerBtn')).toBeDisabled();
        expect(getByTestId('customerList')).toBeDefined();
    });

    it('renders blank customer detail dialog upon clicking on Add btn', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomerList />
            </Provider>,
        );

        fireEvent.click(getByTestId('addCustomerBtn'));

        expect(getByTestId('customerDetailDialog')).toBeVisible();
        expect((document.getElementById('firstName') as HTMLInputElement).value).toBe('');
        expect((document.getElementById('lastName') as HTMLInputElement).value).toBe('');
        expect((document.getElementById('dobDatePicker') as HTMLInputElement).value).toBe(getFormattedDate(new Date()));
    });

    it('renders dialog with customer info upon clicking on a specific customer', () => {
        const { getByText, getByTestId } = render(
            <Provider store={store}>
                <CustomerList />
            </Provider>,
        );

        fireEvent.click(getByText('John Snow'));

        expect(getByTestId('customerDetailDialog')).toBeVisible();
        expect((document.getElementById('firstName') as HTMLInputElement).value).toBe('John');
        expect((document.getElementById('lastName') as HTMLInputElement).value).toBe('Snow');
        expect((document.getElementById('dobDatePicker') as HTMLInputElement).value).toBe(
            getFormattedDate(new Date(1989, 11, 2)),
        );
    });

    it('deletes selected customers', () => {
        const { getByTestId, queryByTestId } = render(
            <Provider store={store}>
                <CustomerList />
            </Provider>,
        );

        fireEvent.click(document.querySelector('[aria-labelledby="checkbox-list-1"]'));
        expect(
            (document.querySelector('[aria-labelledby="checkbox-list-1"]') as HTMLInputElement).checked,
        ).toBeTruthy();
        expect(getByTestId('deleteCustomerBtn')).toBeEnabled();

        fireEvent.click(getByTestId('deleteCustomerBtn'));
        expect(queryByTestId('customerId-1')).not.toBeInTheDocument();
    });
});
