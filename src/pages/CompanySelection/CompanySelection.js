import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import { fetchCompanySelectionData } from '../../slices/thunks';
import { createSelector } from 'reselect';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button, CardBody, Container, Input } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { infinity } from 'ldrs';

infinity.register();

const CompanySelection = () => {
    const dispatch = useDispatch();
    const selectLayoutState = (state) => state.CompanySelection;
    const [viewMode, setViewMode] = useState('grid'); // Default to grid view
    const [userList, setUserList] = useState([]); // State to store filtered user list
    const [localLoading, setLocalLoading] = useState(false); // Local loading state
    const navigate = useNavigate();  // Access the history object for navigation
    const [backButtonClickCount, setBackButtonClickCount] = useState(0);
    const [selectedCompany, setSelectedCompany] = useState({ companyName: '', companyCode: '',dataExchangeURL:'' });

    const userprofileData = createSelector(
        selectLayoutState,
        (state) => ({ user: state.user, success: state.success, error: state.error })
    );

    const { user, success, error } = useSelector(userprofileData);
    const loading = useSelector((state) => state.loading); // Global loading state

    useEffect(() => {
        setLocalLoading(true);
        dispatch(fetchCompanySelectionData()).finally(() => {
            setLocalLoading(false);
        });
    }, [dispatch]);

    useEffect(() => {
        setUserList(user); // Initialize userList with the fetched user data
    }, [user]);

    const searchList = (inputVal) => {
        inputVal = inputVal.toLowerCase();
        const filterItems = (arr, query) => {
            return arr.filter((el) => {
                return el.companyName.toLowerCase().includes(query) || el.companyCode.toLowerCase().includes(query);
            });
        };

        let filterData = filterItems(user, inputVal);
        setUserList(filterData);
        if (filterData.length === 0) {
            document.getElementById("noresult").style.display = "block";
            document.getElementById("userList").style.display = "none";
        } else {
            document.getElementById("noresult").style.display = "none";
            document.getElementById("userList").style.display = "block";
        }
    };

    useEffect(() => {
        const list = document.querySelectorAll(".team-list");
        const buttonGroups = document.querySelectorAll('.filter-button');

        buttonGroups.forEach(buttonGroup => {
            buttonGroup.addEventListener('click', onButtonGroupClick);
        });

        function onButtonGroupClick(event) {
            const isListView = event.target.id === 'list-view-button' || event.target.parentElement.id === 'list-view-button';
            setViewMode(isListView ? 'list' : 'grid');

            if (isListView) {
                document.getElementById("list-view-button").classList.add("active");
                document.getElementById("grid-view-button").classList.remove("active");
                list.forEach(el => {
                    el.classList.add("list-view-filter");
                    el.classList.remove("grid-view-filter");
                });
            } else {
                document.getElementById("grid-view-button").classList.add("active");
                document.getElementById("list-view-button").classList.remove("active");
                list.forEach(el => {
                    el.classList.remove("list-view-filter");
                    el.classList.add("grid-view-filter");
                });
            }
        }

        return () => {
            buttonGroups.forEach(buttonGroup => {
                buttonGroup.removeEventListener('click', onButtonGroupClick);
            });
        };
    }, []);

    // useEffect(() => {
    //     if (userList.length === 1) {
    //         setLocalLoading(true); // Start local loading indicator
    //         const timer = setTimeout(() => {
    //             localStorage.setItem('selectedCompany', JSON.stringify({
    //                 companyName: userList[0].companyName,
    //                 companyCode: userList[0].companyCode,
    //                 dataExchangeURL: userList[0].dataExchangeURL 
    //             }));
    //             navigate("/ERPLogin"); // Navigate to login page after storing details and a brief delay
    //             setLocalLoading(false); // Stop local loading indicator after navigation
    //         }, 2000); // Adjust the delay time as needed
    
    //         return () => clearTimeout(timer); // Cleanup timer on component unmount
    //     }
    // }, [userList, navigate]);
    

    useEffect(() => {
        const handleBackButtonClick = (event) => {
            setBackButtonClickCount(prevCount => prevCount + 1); // Increment the click count

            // If it's the second click or more, navigate to a specific page
            if (backButtonClickCount >= 1) {
                event.preventDefault(); // Prevent the default back button behavior
                navigate("/pages-CompanySelection"); // Navigate to another specific page
            }
            // For the first click, allow the default back button behavior or handle as needed
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", handleBackButtonClick);

        return () => {
            window.removeEventListener("popstate", handleBackButtonClick);
        };
    }, [navigate, backButtonClickCount]);

    useEffect(() => {
        setUserList(user); // Initialize userList with the fetched user data
    }, [user]);

    useEffect(() => {
        if (success && user.length > 0) {
            setSelectedCompany({
                companyName: user[0].companyName,
                companyCode: user[0].companyCode
            });
        }
    }, [success, user]);

    const handleLoginClick = (companyName, companyCode, dataExchangeURL) => {
        // Store selected company details in local storage, including dataExchangeURL
        localStorage.setItem('selectedCompany', JSON.stringify({
            companyName,
            companyCode,
            dataExchangeURL
        }));

        // Navigate to login page after storing details
        navigate("/ERPLogin");
    };


    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            {(loading || localLoading) && (
               <div className="loader-overlay">
               <div className="loader-container">
                 <l-infinity
                   size="55"
                   stroke="4"
                   stroke-length="0.15"
                   bg-opacity="0.1"
                   speed="1.3"
                   color="white"
                 ></l-infinity>
                 <p className="validating-message">Selecting Company...</p>
               </div>
             </div>
            )}
            <style jsx>{`
               .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #092537;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .validating-message {
    margin-top: 15px;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
  }
            `}</style>
            <div className="page-content" style={{ paddingTop: '1.5rem' }}>
                <Container fluid>
                    <BreadCrumb title="Company Selection" pageTitle="Pages" />
                    <Card>
                        <CardBody>
                            <Row className="g-2">
                                <Col sm={4}>
                                    <div className="search-box">
                                        <Input type="text" className="form-control" placeholder="Search for name or designation..." onChange={(e) => searchList(e.target.value)} />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </Col>
                                <Col className="col-sm-auto ms-auto">
                                    <div className="list-grid-nav hstack gap-1">
                                        <Button color="info" id="grid-view-button" className="btn btn-soft-info nav-link btn-icon fs-14 active filter-button shadow-none"><i className="ri-grid-fill"></i></Button>
                                        <Button color="info" id="list-view-button" className="btn btn-soft-info nav-link btn-icon fs-14 filter-button shadow-none"><i className="ri-list-unordered"></i></Button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    <Row>
                        <Col lg={12}>
                            <div>
                                <Row className="team-list grid-view-filter" id="userList">
                                    {userList?.map((item, index) => (
                                        <Col key={index}>
                                            <Card className="team-box">
                                                <div className="team-cover">
                                                    <img src={item.companyImage} alt="" className="img-fluid" />
                                                </div>
                                                <CardBody className="p-4">
                                                    <Row className="align-items-center team-row">
                                                        <Col className="team-settings">
                                                            <Row>
                                                                <Col>
                                                                    <div className="flex-shrink-0 me-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light btn-icon rounded-circle btn-sm favourite-btn"
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                position: 'relative'
                                                                            }}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    width: '60%',
                                                                                    height: '60%',
                                                                                    backgroundColor: item.connectionStatus === 'Online' ? 'green' : 'red',
                                                                                    borderRadius: '50%',
                                                                                }}
                                                                            ></span>
                                                                        </button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col lg={4} className="col">
                                                            <div className="team-profile-img">

                                                                <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0">
                                                                    {item.companyImage != null ?
                                                                        <img src={item.companyImage} alt="" className="img-fluid d-block rounded-circle" />
                                                                        :
                                                                        <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary">
                                                                            {item.companyName.charAt(0) + item.companyName.split(" ").slice(-1).toString().charAt(0)}
                                                                        </div>}
                                                                </div>
                                                                <div>
                                                                    <Link>
                                                                        <h5
                                                                            style={{
                                                                                paddingTop: viewMode === 'grid' ? '2%' : '0',
                                                                                paddingLeft: viewMode === 'list' ? '5%' : '0',
                                                                            }}
                                                                            className="fs-16 mb-1"
                                                                        >
                                                                            {item.companyName}
                                                                        </h5>
                                                                    </Link>
                                                                </div>
                                                                {viewMode === 'grid' && (
                                                                    <div className="team-content">
                                                                        <p className="text-muted mb-0">{item.companyCode}</p>
                                                                        <p className="text-muted mb-0">{item.companyPeriod}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>
                                                        <Col lg={4} className="col">
                                                            {viewMode === 'list' && (
                                                                <>
                                                                    <Row className="text-muted text-center">
                                                                        <Col xs={7} className="border-end border-end-dashed">
                                                                            <h5 className="mb-1">{item.companyPeriod}</h5>
                                                                        </Col>
                                                                        <Col xs={3}>
                                                                            <h5 className="mb-1">{item.companyCode}</h5>
                                                                        </Col>
                                                                    </Row>
                                                                </>
                                                            )}
                                                        </Col>
                                                        <Col lg={2} className="col">
                                                            <div className="text-end">
                                {item.connectionStatus === 'Online' ? (
                                    <Button
                                        onClick={() => handleLoginClick(item.companyName, item.companyCode,item.dataExchangeURL)}
                                        className="btn btn-light view-btn"
                                    >
                                        Login
                                    </Button>
                                ) : (
                                    <h6 className="text-muted text-danger" style={{ marginRight: '2rem', color: 'red' }}>
                                        Cannot login, the company is inactive
                                    </h6>
                                )}
                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    ))}
                                    <Col lg={12}></Col>
                                </Row>
                            </div>
                            <div className="py-4 mt-4 text-center" id="noresult" style={{ display: "none" }}>
                                <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: "72px", height: "72px" }}></lord-icon>
                                <h5 className="mt-4">Sorry! No Result Found</h5>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CompanySelection;