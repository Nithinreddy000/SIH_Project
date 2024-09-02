import React from 'react';
import { Container } from 'reactstrap';
import Filters from './filters';

const Operational = (props) => {


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Filters/>
                </Container>
                    </div>
        </React.Fragment>
    );
};

export default Operational;
