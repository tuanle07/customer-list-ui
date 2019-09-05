// State
export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    dob: Date;
}

// Actions
export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const SET_CUSTOMER_LIST = 'SET_CUSTOMER_LIST';

interface AddCustomerAction {
    type: typeof ADD_CUSTOMER;
    newCustomer: Customer;
}

interface DeleteCustomerAction {
    type: typeof DELETE_CUSTOMER;
    meta: {
        id: number;
    };
}

interface SetCustomerListAction {
    type: typeof SET_CUSTOMER_LIST;
    customers: Customer[];
}

export type CustomerActionTypes = AddCustomerAction | DeleteCustomerAction | SetCustomerListAction;
