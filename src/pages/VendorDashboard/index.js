import React from 'react';
import { Container } from 'reactstrap';
import VendorOverview from './VendorOverview';

// import Components
import BreadCrumb from '../../Components/Common/BreadCrumb';

const ERPDashboard = () => {


    document.title="Infinit X | ERP";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Vendor Dashboard" pageTitle="Infinit X" />
                        <VendorOverview />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ERPDashboard;