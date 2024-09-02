import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ToastContainer } from 'react-toastify';
import FormsOfPayment from './forms';

const OrderHeader = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [title, setTitle] = useState("Purchase Order");

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

    const tabTitles = {
        "1": "Purchase Order",
        "2": "Inward Order",
        "3": "Gate In",
        "4": "Gate Weighment",
        "5": "Tear Weight",
        "6": "Gross Weight"
    };

    const handleFormSubmit = () => {
        const currentTabIndex = Object.keys(tabTitles).indexOf(activeTab);
        const nextTabIndex = currentTabIndex + 1;
        
        if (nextTabIndex < Object.keys(tabTitles).length) {
            const nextTab = Object.keys(tabTitles)[nextTabIndex];
            setActiveTab(nextTab);
            setTitle(tabTitles[nextTab]);
        }
        window.scrollTo(0, 0); // Scroll to the top after submitting form
    };

    const toggleTab = (tab, label) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setTitle(tabTitles[tab]);
            console.log(`Selected Tab: ${label}`);
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="&nbsp;&nbsp;Raw Material&nbsp;&nbsp;" pageTitle="&nbsp;&nbsp;Infinity-x" />
                <Row>
                    <Col lg={12}>
                        <Card id="orderList">
                            <CardHeader className="border-0">
                                <Row className="align-items-center gy-3">
                                    <div className="col-sm" style={{ marginBottom: isMobile ? '-1.5rem' : '' }}>
                                        <h5 className="card-title mb-0">Raw Material</h5>
                                    </div>
                                    <div className="col-sm-auto">
                                        <div className="d-flex gap-1 flex-wrap">
                                            {/* Add buttons if needed */}
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>

                            <CardBody className="pt-0">
                                <div>
                                    <Nav className="nav-tabs nav-tabs-custom nav-success" role="tablist">
                                        <NavItem>
                                            <NavLink className={classnames({ active: activeTab === "1" })} href="#">
                                                <i className="ri-store-2-fill me-1 align-bottom"></i> Purchase Order
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: activeTab === "2" })} href="#">
                                                <i className="ri-checkbox-circle-line me-1 align-bottom"></i> Inward Order
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: activeTab === "3" })} href="#">
                                                <i className="ri-truck-line me-1 align-bottom"></i> Gate In
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: activeTab === "4" })} href="#">
                                                <i className="ri-arrow-left-right-fill me-1 align-bottom"></i> Gate Weighment
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: activeTab === "5" })} href="#">
                                                <i className="ri-close-circle-line me-1 align-bottom"></i> Tear Weight
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: activeTab === "6" })} href="#">
                                                <i className="ri-close-circle-line me-1 align-bottom"></i> Gross Weight
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </div>
                                <ToastContainer closeButton={false} limit={1} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <div className="page-content" style={{ width: isMobile ? '112.5%' : "104.5%", marginLeft: "-1.5rem", marginTop: "-1.5rem", marginBottom: "0px" }}>
                <FormsOfPayment activeTab={activeTab} title={title} onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
};

export default OrderHeader;