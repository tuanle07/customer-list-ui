import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import { customerReducer } from './customer/reducers';

const rootReducer = combineReducers({
    customers: customerReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
    const store = createStore(rootReducer, composeWithDevTools());

    return store;
}
