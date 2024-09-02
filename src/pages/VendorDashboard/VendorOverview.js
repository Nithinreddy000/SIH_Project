import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { fetchVendorDashboardData } from '../../slices/thunks';
import { createSelector } from "reselect";


const DataOverview = () => {
    const dispatch = useDispatch();

    const selectLayoutState = (state) => state.VendorDashboard;
  
    const userprofileData = createSelector(
      selectLayoutState,
      (state) => ({ user: state.user, success: state.success, error: state.error })
    );
  
    const { user, success, error } = useSelector(userprofileData);
  
    useEffect(() => {
      dispatch(fetchVendorDashboardData());
    }, [dispatch]);

    return (
        <React.Fragment>
            {user?.map((item, index) => (
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="border-0 align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">{item.voucherType}</h4>
                        </CardHeader>
                        <CardHeader className="p-0 border-0 bg-light-subtle">
                            <Row className="g-0 text-center">
                            {item.argumentValue.map((arg, idx) => (
                                <Col xs={6} sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1"><span className="counter-value" data-target={arg.argument}>
                                            <CountUp
                                                start={0}
                                                end={arg.value}
                                                separator={","}
                                                duration={4}
                                            />
                                        </span></h5>
                                        <p className="text-muted mb-0">{arg.argument}</p>
                                    </div>
                                </Col>
                                ))}
                            </Row>
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
        ))}            
        </React.Fragment>
    );
};

export default DataOverview;