import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

// Utility function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is always 2 digits
  const day = d.getDate().toString().padStart(2, '0'); // Ensure day is always 2 digits
  const hours = d.getHours().toString().padStart(2, '0'); // Ensure hours is always 2 digits
  const minutes = d.getMinutes().toString().padStart(2, '0'); // Ensure minutes is always 2 digits
  const seconds = d.getSeconds().toString().padStart(2, '0'); // Ensure seconds is always 2 digits
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const isMobile = window.innerWidth <= 767.98;

const Statistics = ({ partyFilter, itemFilter, brokerFilter, groupFilter, selectedDates, user,searchQuery  }) => {
  const [FromDate, ToDate] = Array.isArray(selectedDates) ? selectedDates : [null, null];
  const [openingCounts, setOpeningCounts] = useState({});
  const [inwardCounts, setInwardCounts] = useState({});
  const [outwardCounts, setOutwardCounts] = useState({});
  const [closingCounts, setClosingCounts] = useState({});
  const [openingCountsItem, setOpeningCountsItem] = useState({});
  const [inwardCountsItem, setInwardCountsItem] = useState({});
  const [outwardCountsItem, setOutwardCountsItem] = useState({});
  const [closingCountsItem, setClosingCountsItem] = useState({});
  const [openingCountsBroker, setOpeningCountsBroker] = useState({});
  const [inwardCountsBroker, setInwardCountsBroker] = useState({});
  const [outwardCountsBroker, setOutwardCountsBroker] = useState({});
  const [closingCountsBroker, setClosingCountsBroker] = useState({});
  const [openingCountsGroup, setOpeningCountsGroup] = useState({});
  const [inwardCountsGroup, setInwardCountsGroup] = useState({});
  const [outwardCountsGroup, setOutwardCountsGroup] = useState({});
  const [closingCountsGroup, setClosingCountsGroup] = useState({});
  const [mobileFontSize, setMobileFontSize] = useState('15px');
  const [expandedRows, setExpandedRows] = useState([]);
  const [netWeights, setNetWeights] = useState({});
  const [netWeightsItem, setNetWeightsItem] = useState({});
  const [netWeightsBroker, setNetWeightsBroker] = useState({});
  const [netWeightsGroup, setNetWeightsGroup] = useState({});
  const [weights, setWeights] = useState({
    opening: {},
    inward: {},
    outward: {},
    closing: {},
  });
  const [weightsItem, setWeightsItem] = useState({
    opening: {},
    inward: {},
    outward: {},
    closing: {},
  });
  const [weightsBroker, setWeightsBroker] = useState({
    opening: {},
    inward: {},
    outward: {},
    closing: {},
  });
  const [weightsGroup, setWeightsGroup] = useState({
    opening: {},
    inward: {},
    outward: {},
    closing: {},
  });

  const sumNetWeights = (vouchers, type = 'party') => {
    return vouchers.reduce((acc, voucher) => {
      if (voucher.gateWeightRecord && voucher.gateWeightRecord.netWeight) {
        let key;
        if (type === 'party') key = voucher.party;
        else if (type === 'item') key = voucher.items.map(item => item.item).join(', ');
        else if (type === 'broker') key = voucher.broker;
        else if (type === 'group') key = voucher.items.map(item => item.stockGroup).join(', ');

        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += voucher.gateWeightRecord.netWeight;
      }
      return acc;
    }, {});
  };

  useEffect(() => {
    setNetWeights(sumNetWeights(partyFilter, 'party'));
    setNetWeightsItem(sumNetWeights(itemFilter, 'item'));
    setNetWeightsBroker(sumNetWeights(brokerFilter, 'broker'));
    setNetWeightsGroup(sumNetWeights(groupFilter, 'group'));
  }, [partyFilter, itemFilter, brokerFilter, groupFilter, FromDate, ToDate]);


  useEffect(() => {
    const counts = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    const weightSums = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    partyFilter.forEach(voucher => {
      const formattedInTime = formatDate(voucher.gateWeightRecord.inTime);
      const formattedOutTime = formatDate(voucher.gateWeightRecord.outTime);
      const formattedFromDate = formatDate(FromDate);
      const formattedToDate = formatDate(ToDate);

      if (formattedInTime < formattedFromDate) {
        counts.opening[voucher.party] = (counts.opening[voucher.party] || 0) + 1;
        weightSums.opening[voucher.party] = (weightSums.opening[voucher.party] || 0) + voucher.gateWeightRecord.netWeight;
      }

      if (formattedInTime >= formattedFromDate && formattedInTime <= formattedToDate) {
        counts.inward[voucher.party] = (counts.inward[voucher.party] || 0) + 1;
        weightSums.inward[voucher.party] = (weightSums.inward[voucher.party] || 0) + voucher.gateWeightRecord.netWeight;
      }

      if (formattedOutTime >= formattedFromDate && formattedOutTime <= formattedToDate) {
        counts.outward[voucher.party] = (counts.outward[voucher.party] || 0) + 1;
        weightSums.outward[voucher.party] = (weightSums.outward[voucher.party] || 0) + voucher.gateWeightRecord.netWeight;
      }

      if (formattedOutTime > formattedToDate) {
        counts.closing[voucher.party] = (counts.closing[voucher.party] || 0) + 1;
        weightSums.closing[voucher.party] = (weightSums.closing[voucher.party] || 0) + voucher.gateWeightRecord.netWeight;
      }
    });

    setOpeningCounts(counts.opening);
    setInwardCounts(counts.inward);
    setOutwardCounts(counts.outward);
    setClosingCounts(counts.closing);
    setWeights(weightSums);
  }, [partyFilter, FromDate, ToDate]);


  useEffect(() => {
    const counts = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    const weightSums = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    itemFilter.forEach(voucher => {
      voucher.items.forEach(item => {
        const formattedInTime = formatDate(voucher.gateWeightRecord.inTime);
        const formattedOutTime = formatDate(voucher.gateWeightRecord.outTime);
        const formattedFromDate = formatDate(FromDate);
        const formattedToDate = formatDate(ToDate);

        if (formattedInTime < formattedFromDate) {
          counts.opening[item.item] = (counts.opening[item.item] || 0) + 1;
          weightSums.opening[item.item] = (weightSums.opening[item.item] || 0) +voucher.gateWeightRecord.netWeight;
        }
  
        if (formattedInTime >= formattedFromDate && formattedInTime <= formattedToDate) {
          counts.inward[item.item] = (counts.inward[item.item] || 0) + 1;
          weightSums.inward[item.item] = (weightSums.inward[item.item] || 0) + voucher.gateWeightRecord.netWeight;
        }
  
        if (formattedOutTime >= formattedFromDate && formattedOutTime <= formattedToDate) {
          counts.outward[item.item] = (counts.outward[item.item] || 0) + 1;
          weightSums.outward[item.item] = (weightSums.outward[item.item] || 0) + voucher.gateWeightRecord.netWeight;
        }
        
        if (formattedOutTime > formattedToDate) {
          counts.closing[item.item] = (counts.closing[item.item] || 0) + 1;
          weightSums.closing[item.item] = (weightSums.closing[item.item] || 0) + voucher.gateWeightRecord.netWeight;
        }
      });
    });

    setOpeningCountsItem(counts.opening);
    setInwardCountsItem(counts.inward);
    setOutwardCountsItem(counts.outward);
    setClosingCountsItem(counts.closing);
    setWeightsItem(weightSums);
  }, [itemFilter, FromDate, ToDate]);

  useEffect(() => {
    const counts = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    const weightSums = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    brokerFilter.forEach(voucher => {
      const formattedInTime = formatDate(voucher.gateWeightRecord.inTime);
      const formattedOutTime = formatDate(voucher.gateWeightRecord.outTime);
      const formattedFromDate = formatDate(FromDate);
      const formattedToDate = formatDate(ToDate);

      if (formattedInTime < formattedFromDate) {
        counts.opening[voucher.broker] = (counts.opening[voucher.broker] || 0) + 1;
        weightSums.opening[voucher.broker] = (weightSums.opening[voucher.broker] || 0) + voucher.gateWeightRecord.netWeight;
      }

      if (formattedInTime >= formattedFromDate && formattedInTime <= formattedToDate) {
        counts.inward[voucher.broker] = (counts.inward[voucher.broker] || 0) + 1;
        weightSums.inward[voucher.broker] = (weightSums.inward[voucher.broker] || 0) + voucher.gateWeightRecord.netWeight;
      }

      if (formattedOutTime >= formattedFromDate && formattedOutTime <= formattedToDate) {
        counts.outward[voucher.broker] = (counts.outward[voucher.broker] || 0) + 1;
        weightSums.outward[voucher.broker] = (weightSums.outward[voucher.broker] || 0) + voucher.gateWeightRecord.netWeight;
      }

      if (formattedOutTime > formattedToDate) {
        counts.closing[voucher.broker] = (counts.closing[voucher.broker] || 0) + 1;
        weightSums.closing[voucher.broker] = (weightSums.closing[voucher.broker] || 0) + voucher.gateWeightRecord.netWeight;
      }
    });

    setOpeningCountsBroker(counts.opening);
    setInwardCountsBroker(counts.inward);
    setOutwardCountsBroker(counts.outward);
    setClosingCountsBroker(counts.closing);
    setWeightsBroker(weightSums);
  }, [brokerFilter, FromDate, ToDate]);

  useEffect(() => {
    const counts = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    const weightSums = {
      opening: {},
      inward: {},
      outward: {},
      closing: {},
    };

    groupFilter.forEach(voucher => {
      voucher.items.forEach(item => {
        const formattedInTime = formatDate(voucher.gateWeightRecord.inTime);
        const formattedOutTime = formatDate(voucher.gateWeightRecord.outTime);
        const formattedFromDate = formatDate(FromDate);
        const formattedToDate = formatDate(ToDate);

        if (formattedInTime < formattedFromDate) {
          counts.opening[item.stockGroup] = (counts.opening[item.stockGroup] || 0) + 1;
          weightSums.opening[item.stockGroup] = (weightSums.opening[item.stockGroup] || 0) + voucher.gateWeightRecord.netWeight;
        }
  
        if (formattedInTime >= formattedFromDate && formattedInTime <= formattedToDate) {
          counts.inward[item.stockGroup] = (counts.inward[item.stockGroup] || 0) + 1;
          weightSums.inward[item.stockGroup] = (weightSums.inward[item.stockGroup] || 0) + voucher.gateWeightRecord.netWeight;
        }
  
        if (formattedOutTime >= formattedFromDate && formattedOutTime <= formattedToDate) {
          counts.outward[item.stockGroup] = (counts.outward[item.stockGroup] || 0) + 1;
          weightSums.outward[item.stockGroup] = (weightSums.outward[item.stockGroup] || 0) +voucher.gateWeightRecord.netWeight;
        }
        
        if (formattedOutTime > formattedToDate) {
          counts.closing[item.stockGroup] = (counts.closing[item.stockGroup] || 0) + 1;
          weightSums.closing[item.stockGroup] = (weightSums.closing[item.stockGroup] || 0) + voucher.gateWeightRecord.netWeight;
        }
      });
    });

    setOpeningCountsGroup(counts.opening);
    setInwardCountsGroup(counts.inward);
    setOutwardCountsGroup(counts.outward);
    setClosingCountsGroup(counts.closing);
    setWeightsGroup(weightSums);
  }, [groupFilter, FromDate, ToDate]);

  const filterDataByQuery = (data, query, fields) => {
    if (!query) return data;
    const lowerCaseQuery = query.toLowerCase();
    return data.filter(item => fields.some(field => item[field]?.toLowerCase().includes(lowerCaseQuery)));
  };



 

 



  const uniqueParties = filterDataByQuery(
    Array.isArray(partyFilter) ? Array.from(new Map(partyFilter.map(voucher => [voucher.party, voucher])).values()) : [],
    searchQuery,
    ['party']
  );

  const uniqueItems = filterDataByQuery(
    Array.isArray(itemFilter) ? Array.from(new Map(itemFilter.flatMap(voucher => voucher.items).map(item => [item.item, item])).values()) : [],
    searchQuery,
    ['item']
  );

  const uniqueBrokers = filterDataByQuery(
    Array.isArray(brokerFilter) ? Array.from(new Map(brokerFilter.map(voucher => [voucher.broker, voucher])).values()) : [],
    searchQuery,
    ['broker']
  );

  const uniqueGroups = filterDataByQuery(
    Array.isArray(groupFilter) ? Array.from(new Map(groupFilter.flatMap(voucher => voucher.items).map(item => [item.stockGroup, item])).values()) : [],
    searchQuery,
    ['stockGroup']
  );
  // Sorting uniqueParties and uniqueItems in alphabetical order by name
  uniqueParties.sort((a, b) => a.party.localeCompare(b.party));
  uniqueItems.sort((a, b) => a.item.localeCompare(b.item));
  uniqueBrokers.sort((a, b) => a.broker.localeCompare(b.broker));
  uniqueGroups.sort((a, b) => a.stockGroup.localeCompare(b.stockGroup));

  const mobileStyles = {
    fontSize: '0.5rem',
    whiteSpace: 'normal',
  };
  const isMobile = window.innerWidth <= 767.98;

  useEffect(() => {
    // Function to update font size based on window width
    const updateFontSize = () => {
      if (window.innerWidth <= 767) {
        setMobileFontSize('10px');
      } else {
        setMobileFontSize('15px');
      }
    };

    // Initial font size setting
    updateFontSize();

    // Add event listener for window resize
    window.addEventListener('resize', updateFontSize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  const getFontSize = () => (window.innerWidth <= 767 ? '11px' : '13px');

  const toggleRow = (id, event) => {
    event.stopPropagation(); // Stop event propagation
    setExpandedRows(prevState => 
      prevState.includes(id) 
        ? prevState.filter(row => row !== id) 
        : [...prevState, id]
    );
  };

  const calculateTotals = (counts) => {
    return counts.reduce((totals, item) => {
      totals.opening += item.opening || 0;
      totals.inward += item.inward || 0;
      totals.outward += item.outward || 0;
      totals.closing += item.closing || 0;
      return totals;
    }, { opening: 0, inward: 0, outward: 0, closing: 0 });
  };

  const partyTotals = calculateTotals(uniqueParties.map(voucher => ({
    opening: openingCounts[voucher.party],
    inward: inwardCounts[voucher.party],
    outward: outwardCounts[voucher.party],
    closing: closingCounts[voucher.party],
  })));

  const itemTotals = calculateTotals(uniqueItems.map(item => ({
    opening: openingCountsItem[item.item],
    inward: inwardCountsItem[item.item],
    outward: outwardCountsItem[item.item],
    closing: closingCountsItem[item.item],
  })));

  const brokerTotals = calculateTotals(uniqueBrokers.map(voucher => ({
    opening: openingCountsBroker[voucher.broker],
    inward: inwardCountsBroker[voucher.broker],
    outward: outwardCountsBroker[voucher.broker],
    closing: closingCountsBroker[voucher.broker],
  })));

  const groupsTotals = calculateTotals(uniqueGroups.map(item => ({
    opening: openingCountsGroup[item.stockGroup],
    inward: inwardCountsGroup[item.stockGroup],
    outward: outwardCountsGroup[item.stockGroup],
    closing: closingCountsGroup[item.stockGroup],
  })));
  // Utility function to truncate text to a specific number of words

  const navigate = useNavigate();

const handleNavigation = (filterType, filterValue, event) => {
  event.stopPropagation(); // Stop event propagation
  localStorage.setItem("selectedFilter", filterType);
  localStorage.setItem("selectedValue", filterValue);
  navigate("/finished-products");
};

  return (
    <div className="page-content" style={{ paddingBottom: '0px', paddingLeft: '0px', paddingRight: '0px', marginBottom: '0' }}>
      <Container fluid style={{ marginTop: '-4rem', paddingLeft: '0px', paddingRight: '0px' }}>
        <Row className="mb-3">
          {uniqueParties.length > 0 ? (
            <Col xl={12} lg={12}>
              <Card className="product cursor-pointer ribbon-box border shadow-none mb-1 right" xl={12} lg={12} md={12} style={{ marginTop: '0rem', marginLeft: '0rem' }}>
                <CardBody style={{ paddingTop: "0px" }}>
                  <div className="table-responsive table-card">
                    <table className="table table-sm mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th scope="col">Party Name</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueParties.map((voucher, voucherIndex) => (
                          <React.Fragment key={voucherIndex}>
                            <tr onClick={(e) => handleNavigation("party", voucher.party, e)}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2 mb-2" onClick={(e) => toggleRow(voucher.party, e)} style={{ cursor: 'pointer' }}>
                                    {expandedRows.includes(voucher.party) ? (
                                      <RiSubtractLine size={16} />
                                    ) : (
                                      <RiAddLine size={16} />
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                  <h5 style={{ fontSize: getFontSize() }}>
                                  {voucher.party}                                       
                                      </h5>
                                    <p className="text-muted mb-0">
                                      {/* Quantity and unit if needed */}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="fw-medium" style={{ textAlign: 'right' }}>
                                {(netWeights[voucher.party] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                                {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |
                                {(
                                  (outwardCounts[voucher.party] || 0)
                                ).toLocaleString()}
                              </td>
                            </tr>
                            {expandedRows.includes(voucher.party) && (
                              <>
                                <tr>
                                <td>
                                  Opening
                                </td>
                                <td  style={{ textAlign: 'right' }}>{(weights.opening[voucher.party] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{openingCounts[voucher.party] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>In</td>
                                <td  style={{ textAlign: 'right' }}>{(weights.inward[voucher.party] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{inwardCounts[voucher.party] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Out</td>
                                <td  style={{ textAlign: 'right' }}>{(weights.outward[voucher.party] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{outwardCounts[voucher.party] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Closing</td>
                                <td  style={{ textAlign: 'right' }}>{(weights.closing[voucher.party] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{closingCounts[voucher.party] || 0}
                                </td>
                              </tr>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-top border-top-dashed">
                          <th scope="row">Total Entries: (As per all Parties)</th>
                          <th style={{ textAlign: 'right' }}>
                            {Object.values(netWeights).reduce((acc, weight) => acc + weight, 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {uniqueParties.length && uniqueParties[0].items.length ? ` ${uniqueParties[0].items[0].unit}` : ''} | 
                            {Math.round(
                              partyTotals.opening +
                              partyTotals.inward +
                              partyTotals.outward +
                              partyTotals.closing
                            ).toLocaleString()}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <p></p>
          )}

          {uniqueItems.length > 0 ? (
            <Col xl={12} lg={12}>
              <Card className="product cursor-pointer ribbon-box border shadow-none mb-1 right" xl={12} lg={12} md={12} style={{ marginTop: '0rem', marginLeft: '0rem' }}>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table  table-sm mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th scope="col">Item Name</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueItems.map((item, itemIndex) => (
                          <React.Fragment key={itemIndex}>
                              <tr onClick={(e) => handleNavigation("item", item.item, e)}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2 mb-2" onClick={(e) => toggleRow(item.item,e)} style={{ cursor: 'pointer' }}>
                                    {expandedRows.includes(item.item) ? (
                                      <RiSubtractLine size={16} />
                                    ) : (
                                      <RiAddLine size={16} />
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                  <h5 style={{ fontSize: getFontSize() }}>
                                        {item.item}
                                      </h5>
                                    <p className="text-muted mb-0">
                                      {/* Quantity and unit if needed */}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="fw-medium" style={{ textAlign: 'right' }}>
                              {netWeightsItem[item.item]?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              {item.unit && ` ${item.unit}`} | 
                                  {(
                                   (outwardCountsItem[item.item] || 0)
                                  ).toLocaleString()}
                                </td>
                            </tr>
                            {expandedRows.includes(item.item) && (
                              <>
                                <tr>
                                <td>
                                  Opening
                                </td>
                                <td  style={{ textAlign: 'right' }}>  {(weightsItem.opening[item.item] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {item.unit && ` ${item.unit}`} | {openingCountsItem[item.item] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>In</td>
                                <td  style={{ textAlign: 'right' }}>  {(weightsItem.inward[item.item] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {item.unit && ` ${item.unit}`} | {inwardCountsItem[item.item] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Out</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsItem.outward[item.item] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {item.unit && ` ${item.unit}`} | {outwardCountsItem[item.item] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Closing</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsItem.closing[item.item] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {item.unit && ` ${item.unit}`} | {closingCountsItem[item.item] || 0}
                                </td>
                              </tr>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <tfoot>
                      <tr className="border-top border-top-dashed">
                          <th scope="row">Total Entries:(As per all Items)</th>
                          <th style={{ textAlign: 'right' }}>
                          {Object.values(netWeightsItem).reduce((acc, weight) => acc + weight, 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          {uniqueItems.length && uniqueItems[0].unit ? ` ${uniqueItems[0].unit}` : ''}
                            |  {Math.round(itemTotals.opening + itemTotals.inward + itemTotals.outward + itemTotals.closing).toLocaleString()}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <p></p>
          )}

          {uniqueBrokers.length > 0 ? (
            <Col xl={12} lg={12}>
              <Card className="product cursor-pointer ribbon-box border shadow-none mb-1 right" xl={12} lg={12} md={12} style={{ marginTop: '0rem', marginLeft: '0rem' }}>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-sm mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th scope="col">Broker Name</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueBrokers.map((voucher, voucherIndex) => (
                          <React.Fragment key={voucherIndex}>
                            <tr onClick={(e) => handleNavigation("broker", voucher.broker, e)}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2 mb-2" onClick={(e) => toggleRow(voucher.broker,e)} style={{ cursor: 'pointer' }}>
                                    {expandedRows.includes(voucher.broker) ? (
                                      <RiSubtractLine size={16} />
                                    ) : (
                                      <RiAddLine size={16} />
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                  <h5 style={{ fontSize: getFontSize() }}>
                                        {voucher.broker}
                                      </h5>
                                    <p className="text-muted mb-0">
                                      {/* Quantity and unit if needed */}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="fw-medium" style={{ textAlign: 'right' }}>
                              {(netWeightsBroker[voucher.broker] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                                {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |
                                  {(
                                    (outwardCountsBroker[voucher.broker] || 0)
                                  ).toLocaleString()}
                                </td>
                            </tr>
                            {expandedRows.includes(voucher.broker) && (
                              <>
                                <tr>
                                <td>
                                  Opening
                                </td>
                                <td  style={{ textAlign: 'right' }}>{(weightsBroker.opening[voucher.broker] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{openingCountsBroker[voucher.broker] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>In</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsBroker.inward[voucher.broker] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{inwardCountsBroker[voucher.broker] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Out</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsBroker.outward[voucher.broker] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{outwardCountsBroker[voucher.broker] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Closing</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsBroker.closing[voucher.broker] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {voucher.items.length ? ` ${voucher.items[0].unit}` : ''} |{closingCountsBroker[voucher.broker] || 0}
                                </td>
                              </tr>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <tfoot>
                      <tr className="border-top border-top-dashed">
                          <th scope="row">Total Entries: (As per all Brokers)</th>
                          <th style={{ textAlign: 'right' }}>
                            {Object.values(netWeightsBroker).reduce((acc, weight) => acc + weight, 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {uniqueBrokers.length && uniqueBrokers[0].items.length ? ` ${uniqueBrokers[0].items[0].unit}` : ''} | 
                            {Math.round(
                                brokerTotals.opening +
                                brokerTotals.inward +
                                brokerTotals.outward +
                                brokerTotals.closing
                              ).toLocaleString()}                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <p></p>
          )}

{uniqueGroups.length > 0 ? (
            <Col xl={12} lg={12}>
              <Card className="product cursor-pointer ribbon-box border shadow-none mb-1 right" xl={12} lg={12} md={12} style={{ marginTop: '0rem', marginLeft: '0rem' }}>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-sm mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th scope="col">Group Name</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueGroups.map((item, itemIndex) => (
                          <React.Fragment key={itemIndex}>
                             <tr onClick={(e) => handleNavigation("group", item.stockGroup, e)}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2 mb-2" onClick={(e) => toggleRow(item.stockGroup,e)} style={{ cursor: 'pointer' }}>
                                    {expandedRows.includes(item.stockGroup) ? (
                                      <RiSubtractLine size={16} />
                                    ) : (
                                      <RiAddLine size={16} />
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                  <h5 style={{ fontSize: getFontSize() }}>
                                        {item.stockGroup}
                                      </h5>
                                    <p className="text-muted mb-0">
                                      {/* Quantity and unit if needed */}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="fw-medium" style={{ textAlign: 'right' }}>
                              {netWeightsGroup[item.stockGroup]?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                              {item.unit && ` ${item.unit}`} | 
                                  {(
                                   (outwardCountsGroup[item.stockGroup] || 0)
                                  ).toLocaleString()}
                                </td>

                            </tr>
                            {expandedRows.includes(item.stockGroup) && (
                              <>
                                <tr>
                                <td>
                                  Opening
                                </td>
                                <td  style={{ textAlign: 'right' }}>  {(weightsGroup.opening[item.stockGroup] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {item.unit && ` ${item.unit}`} | {openingCountsGroup[item.stockGroup] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>In</td>
                                <td  style={{ textAlign: 'right' }}>  {(weightsGroup.inward[item.stockGroup] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {item.unit && ` ${item.unit}`} | {inwardCountsGroup[item.stockGroup] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Out</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsGroup.outward[item.stockGroup] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {item.unit && ` ${item.unit}`} | {outwardCountsGroup[item.stockGroup] || 0}
                                </td>
                              </tr>
                              <tr>
                                <td>Closing</td>
                                <td  style={{ textAlign: 'right' }}>{(weightsGroup.closing[item.stockGroup] || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {item.unit && ` ${item.unit}`} | {closingCountsGroup[item.stockGroup] || 0}
                                </td>
                              </tr>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <tfoot>
                      <tr className="border-top border-top-dashed">
                          <th scope="row">Total Entries:(As per all Groups)</th>
                          <th style={{ textAlign: 'right' }}>
                          {Object.values(netWeightsGroup).reduce((acc, weight) => acc + weight, 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          {uniqueGroups.length && uniqueGroups[0].unit ? ` ${uniqueGroups[0].unit}` : ''}
                            |  {Math.round(groupsTotals.opening + groupsTotals.inward + groupsTotals.outward + groupsTotals.closing).toLocaleString()}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <p></p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Statistics;