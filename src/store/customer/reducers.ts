import { CustomerActionTypes, ADD_CUSTOMER, DELETE_CUSTOMER, Customer, SET_CUSTOMER_LIST } from './types';

const initialState: Customer[] = [
    { id: 1, firstName: 'John', lastName: 'Snow', dob: new Date(1989, 11, 2) },
    { id: 2, firstName: 'Ali', lastName: 'Connors', dob: new Date(1980, 10, 4) },
    { id: 3, firstName: 'Tresa', lastName: 'Larson', dob: new Date(1990, 9, 8) },
];

export function customerReducer(state = initialState, action: CustomerActionTypes): Customer[] {
    switch (action.type) {
        case ADD_CUSTOMER:
            return [...state, action.newCustomer];
        case DELETE_CUSTOMER:
            return state.filter((customer) => customer.id !== action.meta.id);
        case SET_CUSTOMER_LIST:
            return action.customers || initialState;
        default:
            return state;
    }
}
