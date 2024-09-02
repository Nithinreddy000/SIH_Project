import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button } from 'reactstrap';
import UiContent from "../../Components/Common/UiContent";
import PreviewCardHeader from '../../Components/Common/PreviewCardHeader';

const FormsOfPayment = ({ activeTab, title, onSubmit }) => {
    document.title = "Infinity X | ERP";

    const [showTerms, setShowTerms] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth >= 319 && window.innerWidth <= 500);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [isLaptop1024, setIsLaptop1024] = useState(window.innerWidth >= 1024 && window.innerWidth < 1280);

    const handleResize = () => {
        setIsMobile(window.innerWidth >= 319 && window.innerWidth <= 500);
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        setIsLaptop1024(window.innerWidth >= 1024 && window.innerWidth < 1280);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleShowTerms = () => setShowTerms(true);
    const handleCloseTerms = () => setShowTerms(false);

    const popupStyle = {
        position: 'fixed',
        top: isMobile ? 30 : isTablet ? 30 : isLaptop1024 ? 30 : 30,
        left: isMobile ? 0 : isTablet ? 50 : isLaptop1024 ? 55 : 190,
        width: isMobile ? '100%' : isTablet ? '95%' : isLaptop1024 ? '95%' : '90%',
        height: isMobile ? '100%' : isTablet ? '100%' : isLaptop1024 ? '100%' : '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const popupContentStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        width: '80%',
        height: '80%',
        overflowY: 'scroll'
    };

    const closeButtonStyle = {
        display: 'block',
        margin: '20px auto 0',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const submitButtonStyle = {
        display: 'block',
        margin: '20px auto',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const renderFormInputs = () => {
        if (activeTab === "3") {
            return (
                <>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="billNumberInput" className="form-label">Inward Order Number</Label>
                            <Input type="text" className="form-control" id="billNumberInput" />
                        </div>
                    </Col>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="exampleInputtime" className="form-label">Gate In Time</Label>
                            <Input type="time" className="form-control" id="exampleInputtime" />
                        </div>
                    </Col>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="billNumberInput" className="form-label">Driver Name</Label>
                            <Input type="text" className="form-control" id="billNumberInput" />
                        </div>
                    </Col>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="billNumberInput" className="form-label">Vehicle Number</Label>
                            <Input type="text" className="form-control" id="billNumberInput" />
                        </div>
                    </Col>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="billNumberInput" className="form-label">Driver's Mobile Number</Label>
                            <Input type="text" className="form-control" id="billNumberInput" />
                        </div>
                    </Col>
                </>
            );
        }
        if (activeTab === "2") {
            return (
                <>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="billNumberInput" className="form-label">Bill Number</Label>
                            <Input type="text" className="form-control" id="billNumberInput" />
                        </div>
                    </Col>
                    <Col xxl={3} md={6}>
                        <div>
                            <Label htmlFor="billDateInput" className="form-label">Bill Date</Label>
                            <Input type="date" className="form-control" id="billDateInput" />
                        </div>
                    </Col>
                </>
            );
        }

        return (
            <>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="basiInput" className="form-label">Party Name</Label>
                        <Input type="text" className="form-control" id="basiInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="brokerInput" className="form-label">Broker Name</Label>
                        <Input type="text" className="form-control" id="brokerInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="itemInput" className="form-label">Item</Label>
                        <Input type="text" className="form-control" id="itemInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="quantityInput" className="form-label">Quantity</Label>
                        <Input type="text" className="form-control" id="quantityInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="rateInput" className="form-label">Rate</Label>
                        <Input type="text" className="form-control" id="rateInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="transportationInput" className="form-label">Transportation</Label>
                        <Input type="text" className="form-control" id="transportationInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="billingInput" className="form-label">Billing</Label>
                        <Input type="text" className="form-control" id="billingInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div>
                        <Label htmlFor="shippingInput" className="form-label">Shipping</Label>
                        <Input type="text" className="form-control" id="shippingInput" />
                    </div>
                </Col>
                <Col xxl={3} md={6}>
                    <div className="form-check">
                        <Input type="checkbox" className="form-check-input" id="termsCheckbox" />
                        <Label htmlFor="termsCheckbox" className="form-check-label">
                            I agree to the <span onClick={handleShowTerms} style={{ color: 'blue', cursor: 'pointer' }}>Terms and Conditions</span>
                        </Label>
                    </div>
                </Col>
            </>
        );
    };

    return (
        <React.Fragment>
            <UiContent />
            <div className="page-content">
                <Container fluid style={{ marginTop: "-10rem" }}>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <PreviewCardHeader title={title} />
                                <CardBody className="card-body">
                                    <div className="live-preview">
                                        <Row className="gy-4">
                                            {renderFormInputs()}
                                        </Row>
                                        <Button color="primary" style={submitButtonStyle} onClick={onSubmit}>Submit</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                {showTerms && (
                    <div style={popupStyle}>
                        <div style={popupContentStyle}>
                            <h5>Terms and Conditions</h5>
                            <p>
                                {/* Add your terms and conditions content here */}
                                By using this application, you agree to comply with and be bound by the following terms and conditions of use. These terms govern your use of the application and its features. Please read them carefully before proceeding. If you do not agree with these terms, please do not use the application.
                            </p>
                            <button style={closeButtonStyle} onClick={handleCloseTerms}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default FormsOfPayment;