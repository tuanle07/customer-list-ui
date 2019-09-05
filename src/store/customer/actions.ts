import { Customer, ADD_CUSTOMER, DELETE_CUSTOMER, CustomerActionTypes, SET_CUSTOMER_LIST } from './types';

export const addCustomer = (newCustomer: Customer): CustomerActionTypes => {
    return {
        type: ADD_CUSTOMER,
        newCustomer: newCustomer,
    };
};

export const deleteCustomer = (id: number): CustomerActionTypes => {
    return {
        type: DELETE_CUSTOMER,
        meta: {
            id,
        },
    };
};

export const setCustomerList = (customers: Customer[]): CustomerActionTypes => {
    return {
        type: SET_CUSTOMER_LIST,
        customers: customers,
    };
};
