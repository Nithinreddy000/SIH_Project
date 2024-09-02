import React, { useState, useEffect } from "react";
import { Collapse, Col, Container, Row, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";
import moment from "moment";

const TabData = ({ vouchers, selectedTab, selectedDates, onUpdateCounts,searchQuery  }) => {
  const [FromDate, ToDate] = Array.isArray(selectedDates) ? selectedDates : [null, null];
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedGateMap, setExpandedGateMap] = useState({});
  const [expandedWeighBridgeMap, setExpandedWeighBridgeMap] = useState({});
  const navigate = useNavigate();

  const handleExpandItem = (e, index) => {
    e.stopPropagation();
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter(item => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const toggleGateDetails = (e, voucherIndex) => {
    e.stopPropagation();
    setExpandedGateMap(prevState => ({
      ...prevState,
      [voucherIndex]: !prevState[voucherIndex]
    }));
  };

  const toggleWeighBridgeDetails = (e, voucherIndex) => {
    e.stopPropagation();
    setExpandedWeighBridgeMap(prevState => ({
      ...prevState,
      [voucherIndex]: !prevState[voucherIndex]
    }));
  };

  const formatDateTime = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    return moment(dateTime).format("ddd, DD MMM YYYY - hh:mmA");
  };

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

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  };

  const handleCardClick = (e, voucher) => {
    e.stopPropagation();
    setVoucherDetailsToLocalStorage(voucher);
    navigate("/voucher-num");
  };

  const setVoucherDetailsToLocalStorage = voucher => {
    localStorage.setItem("NetWeight", JSON.stringify(voucher.gateWeightRecord.netWeight));
    localStorage.setItem("NetGateTime", JSON.stringify(voucher.gateWeightRecord.netGateTime));
    localStorage.setItem("voucherNumID", JSON.stringify(voucher.voucherNumID));
    localStorage.setItem("FirstTime", JSON.stringify(voucher.gateWeightRecord.inTime));
    localStorage.setItem("FinalTime", JSON.stringify(voucher.gateWeightRecord.outTime));
    localStorage.setItem("FirstWeight", JSON.stringify(voucher.gateWeightRecord.grossWeight));
    localStorage.setItem("FinalWeight", JSON.stringify(voucher.gateWeightRecord.tareWeight));
    localStorage.setItem("Items", JSON.stringify(voucher.items.map(item => item.item)));
    localStorage.setItem("Quantity", JSON.stringify(voucher.items.map(item => item.quantity)));
    localStorage.setItem("Unit", JSON.stringify(voucher.items.map(item => item.unit)));
    localStorage.setItem("Party", JSON.stringify(voucher.party));
    localStorage.setItem("VehicleNumber", JSON.stringify(voucher.vehicleNumber));
    localStorage.setItem("VoucherDate", JSON.stringify(voucher.voucherDate));
    localStorage.setItem("VoucherDetails", JSON.stringify(voucher));
  };

  const filterVouchersByTab = (vouchers, selectedTab) => {
    if (selectedTab === "All") {
      return vouchers; // Return all vouchers for the 'All' tab
    }
    return vouchers.filter(voucher => {
      const gateInTime = formatDate2(voucher.gateWeightRecord.inTime);
      const gateOutTime = formatDate2(voucher.gateWeightRecord.outTime);
      const fromDate = formatDate2(FromDate);
      const toDate = formatDate2(ToDate);

      if (selectedTab === "Opening") {
        return gateInTime < fromDate;
      } else if (selectedTab === "In") {
        return gateInTime >= fromDate && gateInTime <= toDate;
      } else if (selectedTab === "Out") {
        return gateOutTime >= fromDate && gateOutTime <= toDate;
      } else if (selectedTab === "Closing") {
        return gateOutTime > toDate;
      } else {
        return true;
      }
    });
  };

  const getCounts = (vouchers) => {
    return {
      All: vouchers.length,
      Opening: filterVouchersByTab(vouchers, "Opening").length,
      In: filterVouchersByTab(vouchers, "In").length,
      Out: filterVouchersByTab(vouchers, "Out").length,
      Closing: filterVouchersByTab(vouchers, "Closing").length
    };
  }

  const filterVouchersByQuery = (vouchers, query) => {
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

  const filteredVouchers = filterVouchersByTab(filterVouchersByQuery(vouchers, searchQuery), selectedTab);

 // First effect to handle counting vouchers
 useEffect(() => {
  if (typeof onUpdateCounts === "function") {
    onUpdateCounts(getCounts(filterVouchersByQuery(vouchers, searchQuery)));
  }
}, [vouchers, selectedDates, onUpdateCounts, selectedTab, searchQuery]);

const indianNumberFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

  return (
    <div className="page-content" style={{ paddingBottom: '0px', paddingLeft: '0px', paddingRight: '0px', marginBottom: '0rem' }}>
      <Container fluid style={{ marginTop: '-5.5rem' ,paddingLeft: '0px', paddingRight: '0px'}}>
        <Row className="mb-3">
          {filteredVouchers.length > 0 ? (
            filteredVouchers.map((voucher, voucherIndex) => (
              <div className="card-header p-0" key={voucherIndex} onClick={e => handleCardClick(e, voucher)}>
                <Col xl={12} lg={12}>
                  <Card className="product cursor-pointer ribbon-box border shadow-none mb-1 right" xl={12} lg={12} md={12} style={{ marginTop: '0rem', marginLeft: '0rem' }}>
                    <CardBody style={{ paddingTop: "0px"}}>
                      <div className="ribbon-two ribbon-two-info">
                        <span style={{ fontSize: voucher.status && voucher.status.length > 7 ? "7px" : "13px" }}>
                          {voucher.status}
                        </span>
                      </div>
                      <div>
                        <div className="card-header p-0">
                          <div className="d-flex align-items-center">
                            <h5 className="card-title flex-grow-1 mb-0 mt-0">
                              <span className="d-block d-md-none" style={{
                                fontSize: window.innerWidth >= 320 && window.innerWidth <= 350 ? "11px" : "13px",
                                marginTop: "10px",
                                marginBottom: "10px",
                                fontWeight: 'bold',
                                wordWrap: 'break-word'
                              }}>
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
                              <th scope="col" className="text-end">Total Amount</th>
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
                                      {voucher.items[0].quantity} {voucher.items[0].unit} |
                                      {indianNumberFormatter.format(voucher.items[0].exclusiveRate)} {/* Comma separator */}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="fw-medium text-end">
                              {indianNumberFormatter.format(voucher.items[0].amount)}  {/* Comma separator */}
                              </td>
                            </tr>
                            {!expandedItems.includes(voucherIndex) && voucher.items.length > 1 ? (
                              <tr
                                key="expand-btn"
                                style={{ cursor: "pointer", color: "red" }}
                                onClick={e => handleExpandItem(e, voucherIndex)}
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
                                              {item.quantity} {item.unit} |
                                              {indianNumberFormatter.format(item.exclusiveRate)}  {/* Comma separator */}
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="fw-medium text-end">
                                        {indianNumberFormatter.format(item.amount)}  {/* Comma separator */}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr
                                    key="collapse-btn"
                                    style={{ cursor: "pointer", color: "red" }}
                                    onClick={e => handleExpandItem(e, voucherIndex)}
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
                                            onClick={e => toggleGateDetails(e, voucherIndex)}
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
                                            onClick={e => toggleWeighBridgeDetails(e, voucherIndex)}
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
                                      <td className="text-end" style={{marginTop:'-15px'}}>
                                        {voucher.gateWeightRecord.weightDisplay}
                                      </td>
                                    </tr>
                                    {expandedWeighBridgeMap[voucherIndex] && (
                                      <tr>
                                        <td colSpan="2" className="accordion-body ms-2 ps-5 pt-0">
                                          <div>
                                            <h6 className="mb-2">
                                              Gross Weight: {voucher.gateWeightRecord.grossWeight} {voucher.items.unit}
                                            </h6>
                                            <h6 className="mb-1">
                                              Tare Weight: {voucher.gateWeightRecord.tareWeight} {voucher.items.unit}
                                            </h6>
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
            <p>No data available for the selected filters.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default TabData;