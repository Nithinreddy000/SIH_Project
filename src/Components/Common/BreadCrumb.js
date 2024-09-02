import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

const BreadCrumb = ({ title, pageTitle, children, leftContent }) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [is320, setIs320] = useState(window.innerWidth >= 320 && window.innerWidth <= 360);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [isBetween1200And1300, setIsBetween1200And1300] = useState(window.innerWidth >= 1281 && window.innerWidth < 1399);
  const [isLaptopLarge, setIsLaptopLarge] = useState(window.innerWidth >= 1400 && window.innerWidth < 1600);
  const [IsBetween1600And1800, setIsBetween1600And1800] = useState(window.innerWidth >= 1600 && window.innerWidth < 1800);
  const [IsBetween1800And2000, setIsBetween1800And2000] = useState(window.innerWidth >= 1800 && window.innerWidth < 2000);
  const [IsBetween2000And2200, setIsBetween2000And2200] = useState(window.innerWidth >= 2000 && window.innerWidth < 2200);
  const [IsBetween2200And2400, setIsBetween2200And2400] = useState(window.innerWidth >= 2200 && window.innerWidth < 2400);
  const [is4KDesktop, setIs4KDesktop] = useState(window.innerWidth >= 2400);

    const updateIsMobile = useCallback(() => {
        setIsMobile(window.innerWidth <= 500);
        setIs320(window.innerWidth >= 320 && window.innerWidth <= 360);
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        setIsBetween1200And1300(window.innerWidth >= 1281 && window.innerWidth < 1399);
        setIsLaptopLarge(window.innerWidth >= 1400 && window.innerWidth < 1600);
        setIsBetween1600And1800(window.innerWidth >= 1600 && window.innerWidth < 1800);
        setIsBetween1800And2000(window.innerWidth >= 1800 && window.innerWidth < 2000);
        setIsBetween2000And2200(window.innerWidth >= 2000 && window.innerWidth < 2200);
        setIsBetween2200And2400(window.innerWidth >= 2200 && window.innerWidth < 2400);
        setIs4KDesktop(window.innerWidth >= 2400);
    }, []);

    useEffect(() => {
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);

        return () => {
            window.removeEventListener('resize', updateIsMobile);
        };
    }, [updateIsMobile]);

    const breadcrumbTitleStyle = location.pathname === '/operational' ? { marginTop: isMobile?'-1.7rem':'-2.5rem', marginRight: is4KDesktop?'100rem':isTablet?'0rem':IsBetween1600And1800?'50rem':IsBetween1800And2000?'60rem':IsBetween2000And2200?'70rem':IsBetween2200And2400?'80rem':isLaptopLarge?'40rem': isBetween1200And1300?'35rem':isMobile ? '':'15rem' ,marginLeft: isMobile ? '5rem':''} : {};

    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between" style={{ paddingLeft: '4px', paddingRight: '4px', width: isMobile ? '115%' : '' }}>
                        {leftContent && location.pathname === '/operational' && (
                            <div className="mr-3">{leftContent}</div>
                        )}
                        <h4 className="mb-sm-0" style={breadcrumbTitleStyle}>{title}</h4>

                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                {pageTitle && (
                                    <li className="breadcrumb-item">
                                        <Link to="#">{pageTitle}</Link>
                                    </li>
                                )}
                                {title && location.pathname !== '/operational' && (
                                    <li className="breadcrumb-item active">{title}</li>
                                )}
                            </ol>
                        </div>

                        {children && <div className="ml-3">{children}</div>}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BreadCrumb;
