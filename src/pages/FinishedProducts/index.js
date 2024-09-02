import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Collapse, Col, Container, Row, Card, CardBody, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { fetchFinishedProductsData } from "../../slices/thunks";
import { useNavigate } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";
import moment from "moment";
import HeaderTabData from "../Operational/header_tab_data";  // Import the HeaderTabData component
import Header from "../../Layouts/Header";
import SearchOption from "../../Components/Common/SearchOption";


const FinishedProducts = () => {
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedGateMap, setExpandedGateMap] = useState({});
  const [expandedWeightment, setExpandedWeightment] = useState([]);
  const navigate = useNavigate();
  const [expandedWeighBridgeMap, setExpandedWeighBridgeMap] = useState({});
  const [filteredUser, setFilteredUser] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');   // State to keep track of the selected tab
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State to keep track of the search query

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  };

  // Fetching data and handling loading and error states
  useEffect(() => {
    dispatch(fetchFinishedProductsData());
    const selectedFilter = localStorage.getItem("selectedFilter");
    const selectedValue = localStorage.getItem("selectedValue");
    const selectedDates = JSON.parse(localStorage.getItem('selectedDates'));
    
    if (selectedDates) {
      setFromDate(selectedDates[0]);
      setToDate(selectedDates[1]);
    }

    if (selectedFilter && selectedValue) {
      // Apply filter logic here
      const filteredUser = user.filter(voucher => {
        if (selectedFilter === 'party') return voucher.party === selectedValue;
        if (selectedFilter === 'item') return voucher.items.some(item => item.item === selectedValue);
        if (selectedFilter === 'broker') return voucher.broker === selectedValue;
        if (selectedFilter === 'group') return voucher.items.some(item => item.stockGroup === selectedValue);
        return false;
      });
      setFilteredUser(filteredUser);
    }
  }, [dispatch]);

  const formatDate2 = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is always 2 digits
    const day = d.getDate().toString().padStart(2, '0'); // Ensure day is always 2 digits
    const hours = d.getHours().toString().padStart(2, '0'); // Ensure hours is always 2 digits
    const minutes = d.getMinutes().toString().padStart(2, '0'); // Ensure minutes is always 2 digits
    const seconds = d.getSeconds().toString().padStart(2, '0'); // Ensure seconds is always 2 digits
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Selecting data from Redux state using selectors
  const selectFinishedProductsState = (state) => state.FinishedProducts;
  const selectFinishedProductsData = createSelector(
    selectFinishedProductsState,
    (state) => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
    })
  );

  const { user, loading, error } = useSelector(selectFinishedProductsData);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filtering logic for search query
  const filterFinishedProductsByQuery = (vouchers, query) => {
    if (!query) return vouchers;
    return vouchers.filter(voucher => {
      const lowerCaseQuery = query.toLowerCase();
      return voucher.party.toLowerCase().includes(lowerCaseQuery)
        || voucher.items.some(item => item.item.toLowerCase().includes(lowerCaseQuery))
        || voucher.voucherNumber.toLowerCase().includes(lowerCaseQuery)
        || voucher.vehicleNumber.toLowerCase().includes(lowerCaseQuery)
        || formatDate(voucher.voucherDate).toLowerCase().includes(lowerCaseQuery);
    });
  };

  // Filtering logic based on the selected tab
  const getFilteredVouchers = (vouchers, tab) => {
    const filteredByQuery = filterFinishedProductsByQuery(vouchers, searchQuery);
    return filteredByQuery.filter(voucher => {
      const gateInTime = formatDate2(voucher.gateWeightRecord.inTime);
      const gateOutTime = formatDate2(voucher.gateWeightRecord.outTime);
      const from = formatDate2(fromDate);
      const to = formatDate2(toDate);

      if (tab === "Opening") {
        return gateInTime < from;
      } else if (tab === "In") {
        return gateInTime >= from && gateInTime <= to;
      } else if (tab === "Out") {
        return gateOutTime >= from && gateOutTime <= to;
      } else if (tab === "Closing") {
        return gateOutTime > to;
      } else {
        return true;
      }
    });
  };

  const countTabs = {
    All: getFilteredVouchers(filteredUser, "All").length,
    Opening: getFilteredVouchers(filteredUser, "Opening").length,
    In: getFilteredVouchers(filteredUser, "In").length,
    Out: getFilteredVouchers(filteredUser, "Out").length,
    Closing: getFilteredVouchers(filteredUser, "Closing").length,
  };

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  const handleExpandItem = (e, index) => {
    e.stopPropagation();
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const toggleGateDetails = (e, voucherIndex) => {
    e.stopPropagation(); // Prevents the click event from bubbling up
    setExpandedGateMap((prevState) => ({
      ...prevState,
      [voucherIndex]: !prevState[voucherIndex],
    }));
  };

  const toggleWeighBridgeDetails = (e, voucherIndex) => {
    e.stopPropagation(); // Prevents the click event from bubbling up
    setExpandedWeighBridgeMap((prevState) => ({
      ...prevState,
      [voucherIndex]: !prevState[voucherIndex],
    }));
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return moment(dateTime).format("ddd, DD MMM YYYY - hh:mmA");
  };


  const handleCardClick = (e, voucher) => {
    e.stopPropagation(); // Prevents the click event from bubbling up
    setVoucherDetailsToLocalStorage(voucher);
    navigate(`/voucher-num`);
  };

  const setVoucherDetailsToLocalStorage = (voucher) => {
    localStorage.setItem("NetWeight", JSON.stringify(voucher.gateWeightRecord.netWeight));
    localStorage.setItem("NetGateTime", JSON.stringify(voucher.gateWeightRecord.netGateTime));
    localStorage.setItem("FirstTime", JSON.stringify(voucher.gateWeightRecord.inTime));
    localStorage.setItem("voucherNumID", JSON.stringify(voucher.voucherNumID));
    localStorage.setItem("FinalTime", JSON.stringify(voucher.gateWeightRecord.outTime));
    localStorage.setItem("FirstWeight", JSON.stringify(voucher.gateWeightRecord.grossWeight));
    localStorage.setItem("FinalWeight", JSON.stringify(voucher.gateWeightRecord.tareWeight));
    localStorage.setItem("Items", JSON.stringify(voucher.items.map((item) => item.item)));
    localStorage.setItem("Quantity", JSON.stringify(voucher.items.map((item) => item.quantity)));
    localStorage.setItem("Unit", JSON.stringify(voucher.items.map((item) => item.unit)));
    localStorage.setItem("Party", JSON.stringify(voucher.party));
    localStorage.setItem("VehicleNumber", JSON.stringify(voucher.vehicleNumber));
    localStorage.setItem("VoucherDate", JSON.stringify(voucher.voucherDate));
    localStorage.setItem("VoucherDetails", JSON.stringify(voucher));
  };

  useEffect(() => {
    if (Array.isArray(user)) {
      user.forEach((voucher) => setVoucherDetailsToLocalStorage(voucher));
    }
  }, [user]);

  useEffect(() => {
    if (Array.isArray(user)) {
      const partynames = user.map((voucher) => voucher.party); // Extracting party names
      localStorage.setItem("PartyNames", JSON.stringify(partynames)); // Storing party names in localStorage
      user.forEach((voucher) => setVoucherDetailsToLocalStorage(voucher));
    }
  }, [user]);

  const filteredAndTabFilteredUser = getFilteredVouchers(filteredUser, selectedTab);

  const indianNumberFormatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Inward Order/Finished Products" pageTitle="Infinity X" />
        <HeaderTabData onSelectTab={handleTabSelect} tabCounts={countTabs} />
        {/* Include SearchOption but hide it using CSS */}
        <div className="d-none">
          <SearchOption onSearch={handleSearch} />
        </div>
        {/* Include SearchOption but hide it using CSS */}
        <div className="d-block d-md-none">
          <Header onSearch={handleSearch} />
        </div>
        <Row className="mb-1">
          <Col xl={8} style={{ paddingLeft: "1px", paddingRight: "1px" }}>
            {Array.isArray(user) ? (
              filteredAndTabFilteredUser.map((voucher, voucherIndex) => (
                <div className="card-header p-0" onClick={(e) => handleCardClick(e, voucher)}>
                  <Col xl={14}>
                    <Card className="product cursor-pointer  ribbon-box border shadow-none mb-lg-0 right mt-2">
                      <CardBody style={{ paddingTop: "0px" }}>
                        <div className="ribbon-two ribbon-two-info">
                          <span style={{ fontSize: voucher.status && voucher.status.length > 7 ? "7px" : "13px" }}>
                            {voucher.status}
                          </span>
                        </div>
                        <div>
                          <div className="card-header p-0">
                            <div className="d-flex align-items-center">
                              <h5 className="card-title flex-grow-1 mb-0 mt-0">
                                <span className="d-block d-md-none" style={{ fontSize: "13px", marginTop: "10px", marginBottom: "10px", fontWeight: "bold" }}>
                                  {voucher.party}
                                </span>
                                <span className="d-none d-md-block">{voucher.party}</span>
                              </h5>
                              <div className="d-none d-md-block" style={{ paddingTop: "1rem", paddingRight: "2rem" }}>
                                {voucher.voucherNumber}
                                <div>{formatDate(voucher.voucherDate)}</div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 mb-4" style={{ marginTop: "-0.5rem" }}>
                              {voucher.vehicleNumber}
                              <div className="d-block d-md-none">
                                {voucher.voucherNumber}
                                <div>{formatDate(voucher.voucherDate)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
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
                              <tr>
                                <td>
                                  <div className="d-flex">
                                    <div className="flex-grow-1 ms-0">
                                      <h5 className="fs-15">
                                        {voucher.items[0].sequence}. {voucher.items[0].item}
                                      </h5>
                                      <p className="text-muted mb-0">
                                        {voucher.items[0].quantity} {voucher.items[0].unit} | {indianNumberFormatter.format(voucher.items[0].exclusiveRate)}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="fw-medium text-end">{indianNumberFormatter.format(voucher.items[0].amount)}</td>
                              </tr>
                              {!expandedItems.includes(voucherIndex) && voucher.items.length > 1 ? (
                                <tr
                                  key="expand-btn"
                                  style={{ cursor: "pointer", color: "red" }}
                                  onClick={(e) => handleExpandItem(e, voucherIndex)}
                                >
                                  <td colSpan="2">+{voucher.items.length - 1} more items</td>
                                </tr>
                              ) : (
                                expandedItems.includes(voucherIndex) && voucher.items.length > 1 && (
                                  <>
                                    {voucher.items.slice(1).map((item, itemIndex) => (
                                      <tr key={itemIndex}>
                                        <td>
                                          <div className="d-flex">
                                            <div className="flex-grow-1 ms-0">
                                              <h5 className="fs-15">
                                                {item.sequence}. {item.item}
                                              </h5>
                                              <p className="text-muted mb-0">
                                                {item.quantity} {item.unit} | {indianNumberFormatter.format(item.exclusiveRate)}
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="fw-medium text-end">{indianNumberFormatter.format(item.amount)}</td>
                                      </tr>
                                    ))}
                                    <tr
                                      key="collapse-btn"
                                      style={{ cursor: "pointer", color: "red" }}
                                      onClick={(e) => handleExpandItem(e, voucherIndex)}
                                    >
                                      <td colSpan="2">Less items</td>
                                    </tr>
                                  </>
                                )
                              )}
                              <tr className="border-top border-top-dashed">
                                <td colSpan="2" className="fw-medium p-0">
                                  <table className="table table-borderless table-sm mb-0">
                                    <tbody>
                                      <tr>
                                        <td style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                                          <div className="d-flex align-items-center">
                                            <div
                                              className="flex-shrink-0 avatar-xs"
                                              style={{ width: "0.5rem", marginTop: "9px" }}
                                              onClick={(e) => toggleGateDetails(e, voucherIndex)}
                                            >
                                              <div className="avatar-title bg-success rounded-circle" style={{ width: "17px", height: "17px" }}>
                                                {expandedGateMap[voucherIndex] ? (
                                                  <FaMinus />
                                                ) : (
                                                  <i className="ri-add-line" style={{ fontSize: "12px" }}></i>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3" style={{ marginTop: "-px" }}>
                                              <h6 className="fs-15 mb-0">Gate</h6>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="text-end" style={{ paddingTop: "10px" }}>
                                          {voucher.gateWeightRecord.gateDisplay}
                                        </td>
                                      </tr>
                                      {expandedGateMap[voucherIndex] && (
                                        <tr>
                                          <td colSpan="2" className="accordion-body ms-2 ps-5 pt-0">
                                            <div>
                                              <h6 className="mb-2">In Time: {formatDateTime(voucher.gateWeightRecord.inTime)}</h6>
                                              <h6 className="mb-1">Out Time: {formatDateTime(voucher.gateWeightRecord.outTime)}</h6>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                      <tr>
                                        <td style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                                          <div className="d-flex align-items-center">
                                            <div
                                              className="flex-shrink-0 avatar-xs"
                                              style={{ width: "0.5rem", marginTop: "0px" }}
                                              onClick={(e) => toggleWeighBridgeDetails(e, voucherIndex)}
                                            >
                                              <div className="avatar-title bg-success rounded-circle" style={{ width: "17px", height: "17px" }}>
                                                {expandedWeighBridgeMap[voucherIndex] ? (
                                                  <FaMinus />
                                                ) : (
                                                  <i className="ri-add-line" style={{ fontSize: "12px" }}></i>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3" style={{ marginTop: "-15px" }}>
                                              <h6 className="fs-15 mb-0">WeighBridge</h6>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="text-end" style={{ marginTop: "-15px" }}>
                                          {voucher.gateWeightRecord.weightDisplay}
                                        </td>
                                      </tr>
                                      {expandedWeighBridgeMap[voucherIndex] && (
                                        <tr>
                                          <td colSpan="2" className="accordion-body ms-2 ps-5 pt-0">
                                            <div>
                                              <h6 className="mb-2">Gross Weight: {voucher.gateWeightRecord.grossWeight} {voucher.items.unit}</h6>
                                              <h6 className="mb-1">Tare Weight: {voucher.gateWeightRecord.tareWeight} {voucher.items.unit}</h6>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </div>
              ))
            ) : (
              <p>No finished products data available.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FinishedProducts;