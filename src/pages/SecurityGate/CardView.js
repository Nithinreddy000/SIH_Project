import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { fetchSecurityGateData } from '../../slices/thunks';
import { createSelector } from "reselect";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const CardView = () => {
    const dispatch = useDispatch();
    const selectLayoutState = (state) => state.SecurityGate;

    const userprofileData = createSelector(
        selectLayoutState,
        (state) => ({ user: state.user, success: state.success, error: state.error })
    );

    const { user, success, error } = useSelector(userprofileData);

    useEffect(() => {
        dispatch(fetchSecurityGateData());
    }, [dispatch]);

    return (
        <React.Fragment>
            {console.log(user)}
            <Row>
                {user?.map((item, index) => {
                    const totalValue = item.argumentValue.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
                    return (
                        <Col lg={3} key={index}>
                            <Link to="/gate-products"> {/* Wrap Card with Link */}
                                <Card>
                                    <CardBody>
                                        <h5 className="fs-15 fw-semibold">{item.voucherType}</h5>
                                        <div className="d-flex flex-wrap justify-content-evenly">
                                            {item.argumentValue.map((arg, idx) => (
                                                <p className="text-muted mb-0" key={idx}>
                                                    <i className={"fs-18 align-middle me-2 mdi mdi-numeric-" + arg.value + "-circle" + " text-" + (idx === 0 ? "info" : (idx === 1 ? "success" : "danger"))}></i>{arg.argument}
                                                </p>
                                            ))}
                                        </div>
                                    </CardBody>
                                    <div className="progress animated-progess rounded-bottom rounded-0" style={{ height: "6px" }}>
                                        {item.argumentValue.map((arg, index) => {
                                            const percentage = (parseFloat(arg.value) / totalValue) * 100;
                                            return (
                                                <div
                                                    className={"progress-bar rounded-0 " + "bg-" + (index === 0 ? "info" : (index === 1 ? "success" : "danger"))}
                                                    role="progressbar"
                                                    style={{ width: `${percentage}%` }}
                                                    aria-valuenow="30"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                    key={index}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    );
                })}
            </Row>
        </React.Fragment>
    );
};

export default CardView;
