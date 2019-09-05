import React from 'react';
import { Container } from '@material-ui/core';
import CustomerList from './components/customer/CustomerList';

const App: React.FC = () => {
    return (
        <Container>
            <CustomerList />
        </Container>
    );
};

export default App;
