import React, { useEffect,useState } from "react";
import {Card,CardBody,Col,Container,Row,CardHeader,Collapse} from "reactstrap";

import classnames from "classnames";
import { Link } from "react-router-dom";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { productDetails } from "../../common/data/ecommerce";
import EcommerceOrderProduct from "./EcommerceOrderProduct";
import avatar3 from "../../assets/images/users/avatar-3.jpg";

import {fetchVoucherNumData } from '../../slices/thunks';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from "reselect";
import moment from "moment/moment";
import { FaWhatsapp } from 'react-icons/fa';


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import VoucherImages from "./Images";

const EcommerceOrderDetail = (props) => {
  const [col1, setcol1] = useState(true);
  const [col2, setcol2] = useState(true);
  const [col3, setcol3] = useState(true);
  const [accordionState, setAccordionState] = useState([]);

  function togglecol1() {
    setcol1(!col1);
  }

  function togglecol2() {
    setcol2(!col2);
  }

  function togglecol3() {
    setcol3(!col3);
  }

  const toggleAccordion = (index) => {
    setAccordionState(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const dispatch = useDispatch();
  const selectLayoutState = (state) => state.VoucherNum;


  const userprofileData = createSelector(
    selectLayoutState,
    (state) => ({ user: state.user, loading: state.loading, error: state.error })
  );

  const { user,loading, error } = useSelector(userprofileData);

  useEffect(() => {
    dispatch(fetchVoucherNumData());
  }, [dispatch]);

  // Prevent back navigation
  useEffect(() => {
    const handleBackNavigation = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href); // Set initial state
    window.addEventListener('popstate', handleBackNavigation);

    return () => {
      window.removeEventListener('popstate', handleBackNavigation); // Clean up event listener
    };
  }, []);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  // Debugging: log user2 object


  const handleDownload = async () => {
    try {
      const downloadUrl = `http://45.124.144.253:9890/api/InfinityX/VoucherDownload?VoucherNumID=280D3BAA-195E-47C6-A6B9-36E14DA14992`;
      const yourAccessToken = JSON.parse(localStorage.getItem("authUser2"))?.token;
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${yourAccessToken}`, // Add your authorization token if required
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${user.voucherNumber}.pdf`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error as needed
    }
  };
  
  localStorage.setItem("voucherNum", JSON.stringify(user.voucherNumber));

  const handleShareWhatsApp = async () => {
    try {
      // Fetch voucher number from localStorage
      // const user = localStorage.getItem("authUser2");
      const voucherNumber = localStorage.getItem('voucherNum');
      const Party = localStorage.getItem("Party")
  const VehicleNumber = JSON.parse(localStorage.getItem("VehicleNumber"))
  const VoucherDate = JSON.parse(localStorage.getItem("VoucherDate"))
  const NetGateTime = JSON.parse(localStorage.getItem("NetGateTime"));
  const FirstTime = JSON.parse(localStorage.getItem("FirstTime"));
  const FinalTime = JSON.parse(localStorage.getItem("FinalTime"));
  const FirstWeight = JSON.parse(localStorage.getItem("FirstWeight"));
  const FinalWeight = JSON.parse(localStorage.getItem("FinalWeight"));
  const NetWeight = JSON.parse(localStorage.getItem("NetWeight"));
  const Items = JSON.parse(localStorage.getItem("Items"));
  const Quantity = JSON.parse(localStorage.getItem("Quantity"));
  const Unit = JSON.parse(localStorage.getItem("Unit"));
      // Ensure voucherNumber is available
      if (!voucherNumber) {
        throw new Error('Voucher number not found in localStorage');
      }
  
      // Sanitize the voucher number to make it a valid file name
      const sanitizedVoucherNumber = voucherNumber.replace(/[\/:*?"<>|]/g, '-');
  
      const downloadUrl = `http://45.124.144.253:9890/api/InfinityX/VoucherDownload?VoucherNumID=280D3BAA-195E-47C6-A6B9-36E14DA14992`;
      const yourAccessToken = JSON.parse(localStorage.getItem("authUser2"))?.token;
  
      // Fetch the PDF from the API
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${yourAccessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
  
      // Get the PDF blob
      const blob = await response.blob();
  
      // Upload the PDF to File.io or any other file hosting service
      const formData = new FormData();
      formData.append('file', blob, `${sanitizedVoucherNumber}.pdf`);
  
      const uploadResponse = await fetch('https://file.io', {
        method: 'POST',
        body: formData,
      });
  
      const uploadResult = await uploadResponse.json();
  
      if (!uploadResult.success) {
        throw new Error('Failed to upload PDF');
      }
  
      // Generate the WhatsApp share link with the uploaded PDF link
      const shareMessage = `"Inward Order (Raw Materials) \r\n\r\n Account : '${Party}'\r\n VehicleNumber :'${VehicleNumber}'\r\n\r\n VoucherDate :'${VoucherDate}'\r\nVoucherNumber :'${sanitizedVoucherNumber}'\r\n\r\n'Items :${Items}' - '${Quantity}' '${Unit}'\r\n\r\n\r\n'${FirstWeight}'\r\n'${FinalWeight}'\r\n'Net-Weight :${NetWeight}'\r\n\r\n'${FirstTime}'\r\n'${FinalTime}'\r\n'Net-Gate-Time :${NetGateTime}'",: \r\n${uploadResult.link}`;
      const shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  
      // Open the WhatsApp share link
      window.open(shareLink, '_blank');
  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
document.title ="Voucher Details | Infinity X";
  return (
    <div className="page-content">
      <Container fluid>        
        <BreadCrumb title={user.voucherName} pageTitle={user.voucherNumber} />

        <Row>
          <Col xl={9}>
            <Card>
              <CardHeader>
                <div className="d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">{user.voucherNumber}</h5>
                  <div className="flex-shrink-0">
                    <button className="btn btn-success btn-sm me-2" onClick={handleDownload}>
                      <i className="ri-download-2-fill align-middle me-0 fs-6"></i>
                    </button>
                    <button className="btn btn-info btn-sm" onClick={handleShareWhatsApp}>
      <FaWhatsapp className="me-0 fs-4" />
    </button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="table-responsive table-card">
                  <table className="table table-nowrap align-middle table-sm mb-0">
                    <thead className="table-light text-muted">
                      <tr>
                        <th scope="col">Product Details</th>
                        <th scope="col" className="text-end">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                   
        <EcommerceOrderProduct  />
      
                      <tr className="border-top border-top-dashed">
                        <td colSpan="2" className="fw-medium p-0">
                          <table className="table table-borderless table-sm mb-0">
                            <tbody>
                            {user.financial.map((financial, index) => (
                <tr key={index}>
                                <td>{financial.particulars} :</td>
                                <td className="text-end">{financial.exclusiveAmount}</td>
                              </tr>
                                ))}
                              {/* <tr>
                                <td>
                                  Discount{" "}
                                  <span className="text-muted">(VELZON15)</span>{" "}
                                  : :
                                </td>
                                <td className="text-end">-$53.99</td>
                              </tr>
                              <tr>
                                <td>Shipping Charge :</td>
                                <td className="text-end">$65.00</td>
                              </tr>
                              <tr>
                                <td>Estimated Tax :</td>
                                <td className="text-end">$44.99</td>
                              </tr>
                              <tr className="border-top border-top-dashed">
                                <th scope="row">Total (USD) :</th>
                                <th className="text-end">$415.96</th>
                              </tr> */}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="d-sm-flex align-items-center">
                <h5 className="card-title flex-grow-1 mb-0">
                    <i className="ri-links-line align-middle me-1 text-muted"></i> Voucher Tracking
                  </h5>
                  <div className="flex-shrink-0 mt-2 mt-sm-0">
                  </div>
                </div>
              </CardHeader>
              <CardBody>
  <div className="profile-timeline">
    <div className="accordion accordion-flush" id="accordionFlushExample">
      {user.trackingDetails.map((tracking, index) => (
        <div className="accordion-item border-0" key={index} onClick={() => toggleAccordion(index)}>
          <div className="accordion-header" id={`heading${index}`}>
            <Link to="#" className={classnames(
              "accordion-button",
              "p-2",
              "shadow-none",
              { collapsed: !accordionState[index] }
            )}>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-xs">
                  <div className="avatar-title bg-success rounded-circle">
                    <i className="ri-shopping-bag-line"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fs-15 mb-0 fw-semibold">
                    {tracking.particulars} -{" "}
                    <span className="fw-normal">
                    {moment(tracking.trackingDate).format('ddd, DD MMM YYYY - hh:mmA')}
                    </span>
                  </h6>
                </div>
              </div>
            </Link>
          </div>
          <Collapse
            id={`collapse${index}`}
            className="accordion-collapse"
            isOpen={accordionState[index]}
          >
            <div className="accordion-body ms-2 ps-5 pt-0">
              {tracking.trackingDetails.map((subDetail, subIndex) => (
                <div key={subIndex}>
                  <h6 className="mb-1">{subDetail.subParticulars}</h6>
                  <p className="text-muted mb-0">
                    {moment(subDetail.subDate).format('ddd, DD MMM YYYY - hh:mmA')}
                  </p>
                </div>
              ))}
            </div>
          </Collapse>
        </div>
      ))} 
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl={3}>
            <Card>
              <CardHeader>
                <div className="d-flex">
                  <h5 className="card-title flex-grow-1 mb-0">
                    <i className="mdi mdi-truck-fast-outline align-middle me-1 text-muted"></i> Logistics Details
                  </h5>
                  <div className="flex-shrink-0">
                    <Link to="#" className="badge bg-primary-subtle text-primary fs-11">
                      Track Order
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/uetqnvvg.json"
                    trigger="loop"
                    colors="primary:#405189,secondary:#0ab39c"
                    style={{ width: "80px", height: "80px" }}
                  ></lord-icon>
                  <h5 className="fs-16 mt-2">{user.logistics.vehicleNumber}</h5>
                  <p className="text-muted mb-0">{user.logistics.transporterName}</p>
                  <p className="text-muted mb-0">LR : <b>{user.logistics.lrNumber}</b> dt. {moment(user.logistics.lrDate).format("DD-MM-yyyy")}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="d-flex">
                  <h5 className="card-title flex-grow-1 mb-0">
                  <i className="ri-secure-payment-line align-bottom me-1 text-muted"></i>{" "}
                    Voucher Details
                  </h5>
                  <div className="flex-shrink-0">                    
                      Gate In Pending
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                
              <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Entity:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="text-muted mb-0"><b>{user.entity} | {user.division} | {user.center}</b></p>                  
                  </div>
                </div>
                <br />
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Voucher   :</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="text-muted mb-0"><b>{user.voucherNumber}</b> | {moment(user.voucherDate).format("DD-MM-yyyy")}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Purchase:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="text-muted mb-0"><b>{user.purchaseNumber}</b> | {moment(user.purchaseDate).format("DD-MM-yyyy")}</p>                  
                  </div>
                </div>

                <div className="d-flex align-items-center mb-2">
                <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Narration:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="text-muted mb-0">{user.narration}</p>                  
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-map-pin-line align-middle me-1 text-muted"></i>{" "}
                  Billing Address
                </h5>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled vstack fs-13 mb-0">
                  <li className="fw-medium fs-14">{user.billing.name}</li>
                  <li>{user.billing.address}</li>
                  <li>{user.billing.cityPinState}</li>
                  <li>PAN: {user.billing.pan}</li>
                  <li><b>GSTIN: {user.billing.gstin}</b></li>
                  <li>POS: {user.billing.placeOfSupply}</li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-map-pin-line align-middle me-1 text-muted"></i>{" "}
                  Shipping Address
                </h5>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled vstack fs-13 mb-0">
                <li className="fw-medium fs-14">{user.shipping.name}</li>
                  <li>{user.shipping.address}</li>
                  <li>{user.shipping.cityPinState}</li>
                  <li>PAN: {user.shipping.pan}</li>
                  <li><b>GSTIN: {user.shipping.gstin}</b></li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className=" ri-flag-2-fill align-bottom me-1 text-muted"></i>{" "}
                  Order Details
                </h5>
              </CardHeader>
              <CardBody>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Transactions:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">#VLZ124561278124</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Payment Method:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Debit Card</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Card Holder Name:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">Joseph Parker</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Card Number:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">xxxx xxxx xxxx 2456</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <p className="text-muted mb-0">Total Amount:</p>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0">$415.96</h6>
                  </div>
                </div>
              </CardBody>
            </Card>
      <VoucherImages />
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className=" ri-flag-2-fill align-bottom me-1 text-muted"></i>{" "}
                  Time Taken
                </h5>
              </CardHeader>
              <CardBody>
                    <div className="mb-2 text-center" >
                        <lord-icon src="https://cdn.lordicon.com/kbtmbyzy.json" trigger="loop"
                            colors="primary:#405189,secondary:#02a8b5" style={{ width: "90px", height: "90px" }}>
                        </lord-icon>
                    </div>
                    <h3 className="mb-1 text-center">9 hrs 13 min</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceOrderDetail;