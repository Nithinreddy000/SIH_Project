import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import DataOverview from './DataOverview';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import {  useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom

const ERPDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("authUser2"))?.token;
        // Check if token exists and is not expired
        if (token) {
            // Perform any necessary actions with the token, like refreshing data or checking validity
            console.log('Token exists and is valid. Performing necessary actions.');
            // Example: Navigate to ERP dashboard
            navigate('/dashboard-ERP'); // Replace with your ERP dashboard route
        } else {
            // Redirect user to the start of the application or handle as needed
            console.log('Token not found or expired. Redirecting to login page or handling as needed.');
            navigate('/LicenseValidation')
            // Example: Redirect to login page
            // history.push('/login'); // Ensure history is available from react-router or another routing solution
        }
    }, [navigate]); // Ensure history is included in dependencies to avoid eslint warning

    document.title = "Infinity X | ERP";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="ERP Dashboard" pageTitle="Infinity X" />
                    <DataOverview />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ERPDashboard;
