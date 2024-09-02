import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Container, Row, Input, Label, Col } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import Flatpickr from 'react-flatpickr';
import Statistics from './statistics';
import TabData from './tabdata';
import Header2 from './header';
import HeaderTabData from "./header_tab_data";
import { fetchFinishedProductsData } from "../../slices/thunks";
import { setDateRange } from "../../slices/finishedProducts/reducer";
import { format, parse } from 'date-fns';
import { useCallback } from "react";
import SearchOption from "../../Components/Common/SearchOption";
import Header from "../../Layouts/Header";

const PartyFilter = ({
  uniquePartyNames,
  searchQuery1,
  checkedState1,
  handleCheckboxChange1,
  showMore1,
  setShowMore1
}) => {
  const filteredParties = uniquePartyNames.filter(party =>
    party.toLowerCase().includes(searchQuery1.toLowerCase())
  );

  if (filteredParties.length <= 3) {
    return filteredParties.map((party, index) => (
      <div className="form-check" key={index}>
        <Input
          className="form-check-input"
          type="checkbox"
          id={`partyName${index}`}
          checked={checkedState1[index]}
          onChange={() => handleCheckboxChange1(index)}
        />
        <Label className="form-check-label" htmlFor={`partyName${index}`}>
          {party}
        </Label>
      </div>
    ));
  }

  return (
    <div className="d-flex flex-column gap-2 mt-3">
      {filteredParties.slice(0, 3).map((party, index) => (
        <div className="form-check" key={index}>
          <Input
            className="form-check-input"
            type="checkbox"
            id={`partyName${index}`}
            checked={checkedState1[index]}
            onChange={() => handleCheckboxChange1(index)}
          />
          <Label className="form-check-label" htmlFor={`partyName${index}`}>
            {party}
          </Label>
        </div>
      ))}
      {showMore1 && filteredParties.slice(3).map((party, index) => (
        <div className="form-check" key={index + 3}>
          <Input
            className="form-check-input"
            type="checkbox"
            id={`partyNameMore${index}`}
            checked={checkedState1[index + 3]}
            onChange={() => handleCheckboxChange1(index + 3)}
          />
          <Label className="form-check-label" htmlFor={`partyNameMore${index}`}>
            {party}
          </Label>
        </div>
      ))}
      <div>
        <button
          type="button"
          className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
          onClick={() => setShowMore1(!showMore1)}
        >
          {showMore1 ? 'Show Less' : `${filteredParties.length - 3} More`}
        </button>
      </div>
    </div>
  );
};

const Filters = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('statistics');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);
  const [showMore4, setShowMore4] = useState(false);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');
  const [searchQuery4, setSearchQuery4] = useState('');
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isAnyAccordionOpen, setIsAnyAccordionOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  

  const [partyFilter, setPartyFilter] = useState([]);
  const [itemFilter, setItemFilter] = useState([]);
  const [brokerFilter, setBrokerFilter] = useState([]);
  const [groupFilter, setGroupFilter] = useState([]);
  const [combinedFilter, setCombinedFilter] = useState([]);
  const [isLargeOrMedium, setIsLargeOrMedium] = useState(window.innerWidth > 767);
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 560);
  const [tabCounts, setTabCounts] = useState({
    All: 0,
    Opening: 0,
    In: 0,
    Out: 0,
    Closing: 0,
  });

  const today = new Date();
  const formattedToday = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}, ${today.getFullYear()}`;

  useEffect(() => {
    const handleResize = () => {
      setIsLargeOrMedium(window.innerWidth > 767);
      setIsSmallDevice(window.innerWidth <= 560);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => {
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    dispatch(fetchFinishedProductsData());
    if (selectedDates[0] && selectedDates[1]) {
      dispatch(setDateRange(selectedDates));
      dispatch(fetchFinishedProductsData());
    }
  }, [selectedDates, dispatch]);

  const handleDateChange = (newDates) => {
    const convertedDates = newDates.map(date => format(date, 'yyyy-MM-dd'));
    setSelectedDates(convertedDates);
  };

  const toggleAccordion1 = () => setIsOpen1(!isOpen1);
  const toggleAccordion2 = () => setIsOpen2(!isOpen2);
  const toggleAccordion3 = () => setIsOpen3(!isOpen3);
  const toggleAccordion4 = () => setIsOpen4(!isOpen4);

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

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const headerContent = <Header2 />;

  const uniquePartyNames = Array.isArray(user) ? Array.from(new Set(user.map(voucher => voucher.party))) : [];
  const allItems = Array.isArray(user) ? user.flatMap(voucher => voucher.items) : [];
  const uniqueItems = Array.isArray(allItems) ? Array.from(new Map(allItems.map(item => [item?.item, item])).values()) : [];
  const uniqueBrokerNames = Array.isArray(user) ? Array.from(new Set(user.map(voucher => voucher.broker))) : [];
  const uniqueGroups = Array.isArray(allItems) ? Array.from(new Map(allItems.map(item => [item?.stockGroup, item])).values()) : [];

  const [checkedState1, setCheckedState1] = useState(Array(uniquePartyNames.length).fill(false));
  const [checkedState2, setCheckedState2] = useState(Array(uniqueItems.length).fill(false));
  const [checkedState3, setCheckedState3] = useState(Array(uniqueBrokerNames.length).fill(false));
  const [checkedState4, setCheckedState4] = useState(Array(uniqueGroups.length).fill(false));

  const handleSearchChange1 = (event) => setSearchQuery1(event.target.value.toLowerCase());
  const handleSearchChange2 = (event) => setSearchQuery2(event.target.value.toLowerCase());
  const handleSearchChange3 = (event) => setSearchQuery3(event.target.value.toLowerCase());
  const handleSearchChange4 = (event) => setSearchQuery4(event.target.value.toLowerCase());

  const handleCheckboxChange1 = (index) => {
    const updatedCheckedState = [...checkedState1];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setCheckedState1(updatedCheckedState);
    filterParties(updatedCheckedState);
  };
  
  const handleCheckboxChange2 = (itemIndex) => {
    const updatedCheckedState = [...checkedState2];
    updatedCheckedState[itemIndex] = !updatedCheckedState[itemIndex];
    setCheckedState2(updatedCheckedState);
    filterItems(updatedCheckedState);
  };
  
  const handleCheckboxChange3 = (index) => {
    const updatedCheckedState = [...checkedState3];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setCheckedState3(updatedCheckedState);
    filterBrokers(updatedCheckedState);
  };
  
  const handleCheckboxChange4 = (index) => {
    const updatedCheckedState = [...checkedState4];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setCheckedState4(updatedCheckedState);
    filterGroups(updatedCheckedState);
  };

  const filterParties = (checkedState) => {
    const selectedParties = uniquePartyNames.filter((_, index) => checkedState[index]);
    const filteredVouchers = user.filter(voucher => selectedParties.includes(voucher.party));
    setPartyFilter(filteredVouchers);
    updateFilters(filteredVouchers);
  };
  
  const filterItems = (checkedState) => {
    const selectedItems = uniqueItems.filter((_, index) => checkedState[index]).map(item => item?.item);
    const filteredVouchers = user.filter(voucher => voucher.items.some(item => selectedItems.includes(item?.item)));
    setItemFilter(filteredVouchers);
    updateFilters(filteredVouchers);
  };
  
  const filterBrokers = (checkedState) => {
    const selectedBrokers = uniqueBrokerNames.filter((_, index) => checkedState[index]);
    const filteredVouchers = user.filter(voucher => selectedBrokers.includes(voucher.broker));
    setBrokerFilter(filteredVouchers);
    updateFilters(filteredVouchers);
  };
  
  const filterGroups = (checkedState) => {
    const selectedGroups = uniqueGroups.filter((_, index) => checkedState[index]).map(group => group?.stockGroup);
    const filteredVouchers = user.filter(voucher => voucher.items.some(item => selectedGroups.includes(item?.stockGroup)));
    setGroupFilter(filteredVouchers);
    updateFilters(filteredVouchers);
  };
  
  const updateFilters = (filteredVouchers) => {
    setPartyFilter(filteredVouchers);
    setItemFilter(filteredVouchers);
    setBrokerFilter(filteredVouchers);
    setGroupFilter(filteredVouchers);
  };

  const clearAll = () => {
    setCheckedState1(Array(uniquePartyNames.length).fill(false));
    setCheckedState2(Array(uniqueItems.length).fill(false));
    setCheckedState3(Array(uniqueBrokerNames.length).fill(false));
    setCheckedState4(Array(uniqueGroups.length).fill(false));
    setPartyFilter(user);
    setItemFilter(user);
    setBrokerFilter(user);
    setGroupFilter(user);
    setCombinedFilter(user);
  };

  useEffect(() => {
    if (!Array.isArray(user)) return; // Ensure user is an array before setting states
    setPartyFilter(user);
    setItemFilter(user);
    setBrokerFilter(user);
    setGroupFilter(user);
  }, [user]);

  useEffect(() => {
    if (!Array.isArray(user)) return; // Ensure user is an array before using filter
    const updateCombinedFilter = () => {
      const filters = [partyFilter, itemFilter, brokerFilter, groupFilter];
      const filteredVouchers = user.filter(voucher =>
        filters.every(filter =>
          filter.length === 0 || filter.includes(voucher)
        )
      );
      setCombinedFilter(filteredVouchers);
    };

    updateCombinedFilter();
  }, [partyFilter, itemFilter, brokerFilter, groupFilter, user]);

  useEffect(() => {
    setIsAnyAccordionOpen(isOpen1 || isOpen2 || isOpen3 || isOpen4);
  }, [isOpen1, isOpen2, isOpen3, isOpen4]);

  useEffect(() => {
    const today2 = new Date();
    const formattedToday2 = format(today2, 'dd MMM yyyy');
    const defaultDates = [formattedToday2]; // Pass today's date

    const convertedDates = defaultDates.map(date => {
      const parsedDate = parse(date, 'dd MMM yyyy', new Date());
      return format(parsedDate, 'yyyy-MM-dd');
    });

    setSelectedDates(convertedDates);
  }, []);

  const filteredItems = uniqueItems.filter((item) =>
    item?.item.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  const filteredGroups = uniqueGroups.filter((item) =>
    item?.stockGroup.toLowerCase().includes(searchQuery4.toLowerCase())
  );

  
  const handleUpdateCounts = (counts) => {
    setTabCounts(counts);
  };


  const handleTabSelection = (tab) => {
    setSelectedTab(tab);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth >= 361 && window.innerWidth <= 500);
  const [is320, setIs320] = useState(window.innerWidth >= 320 && window.innerWidth <= 360);

  const updateIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
    setIs320(window.innerWidth >= 320 && window.innerWidth <= 360);
  }, []);

  useEffect(() => {
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, [updateIsMobile]);

  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isLaptop1024, setIsLaptop1024] = useState(window.innerWidth >= 1024 && window.innerWidth < 1280);
  const [isBetween1200And1300, setIsBetween1200And1300] = useState(window.innerWidth >= 1281 && window.innerWidth < 1399);
  const [isLaptopLarge, setIsLaptopLarge] = useState(window.innerWidth >= 1400 && window.innerWidth < 1600);
  const [IsBetween1600And1800, setIsBetween1600And1800] = useState(window.innerWidth >= 1600 && window.innerWidth < 1800);
  const [IsBetween1800And2000, setIsBetween1800And2000] = useState(window.innerWidth >= 1800 && window.innerWidth < 2000);
  const [IsBetween2000And2200, setIsBetween2000And2200] = useState(window.innerWidth >= 2000 && window.innerWidth < 2200);
  const [IsBetween2200And2400, setIsBetween2200And2400] = useState(window.innerWidth >= 2200 && window.innerWidth < 2400);
  const [is4KDesktop, setIs4KDesktop] = useState(window.innerWidth >= 2400);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsLaptop1024(window.innerWidth >= 1024 && window.innerWidth < 1280);
      setIsBetween1200And1300(window.innerWidth >= 1281 && window.innerWidth < 1399);
      setIsLaptopLarge(window.innerWidth >= 1400 && window.innerWidth < 1600);
      setIsBetween1600And1800(window.innerWidth >= 1600 && window.innerWidth < 1800);
      setIsBetween1800And2000(window.innerWidth >= 1800 && window.innerWidth < 2000);
      setIsBetween2000And2200(window.innerWidth >= 2000 && window.innerWidth < 2200);
      setIsBetween2200And2400(window.innerWidth >= 2200 && window.innerWidth < 2400);
      setIs4KDesktop(window.innerWidth >= 2400);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerStyle = activeTab === 'statistics' && isMobile
  ? { paddingLeft: '0px', paddingRight: '0px', width: '110%' ,marginLeft:'-1rem'}
  : is4KDesktop
  ? { marginLeft: '0rem' } // Adjust the margin left for 4K desktop here
  : {}; // Default empty style if not 'statistics' or not mobile or not 4K

  const cardHeaderStyle = {
    marginTop:isMobile ? '1rem':'1rem',
    width: is4KDesktop ? '500%' :IsBetween1600And1800?'350%':IsBetween1800And2000?'350%':IsBetween2000And2200?'350%':IsBetween2200And2400?'450%': isLaptopLarge ? '350%' : isBetween1200And1300 ? '350%' : isLaptop1024 ? '290%' : isTablet ? '200%' : '100%',
    marginLeft: is4KDesktop ? '-100rem'  :IsBetween1600And1800?'-55rem':IsBetween1800And2000?'-60rem':IsBetween2000And2200?'-65rem':IsBetween2200And2400?'-86rem': isLaptopLarge ? '-52rem' : isBetween1200And1300 ? '-47rem' : isLaptop1024 ? '-37rem' : isTablet ? '-20rem' : '0'
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query); // update search query
  };
  
// Inside your Filters component

useEffect(() => {
  if (selectedDates) {
    localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
  }
}, [selectedDates]);

  return (
    <div>
           <BreadCrumb title="Inward Order" leftContent={headerContent} >
            {location.pathname !== '/operational' && headerContent}
            <div className="mt-3 mt-lg-0 d-flex justify-content-end">
                <i
                    className="ri-filter-3-line"
                    style={{ marginTop: isMobile?'-0.5rem':'0.3rem', marginRight: '1rem', fontSize: '1.5rem', cursor: 'pointer' }}
                    onClick={toggleFilter}
                ></i>
                <form action="#" style={{marginTop:isMobile?'-0.5rem':'',marginRight:is320?'':isMobile?'2rem':''}}>
                    <Row className="g-3 mb-0 align-items-center">
                        <div className="col-sm-auto">
                            <div className="input-group" style={{ flexWrap: "nowrap" }}>
                                <Flatpickr
                                    className="form-control border-0 dash-filter-picker shadow"
                                    options={{ mode: "range", dateFormat: "d M, Y",   defaultDate: [formattedToday] }}
                                    onChange={(dates) => handleDateChange(dates)}
                                />
                                <div className="input-group-text bg-primary border-primary text-white">
                                    <i className="ri-calendar-2-line"></i>
                                </div>
                            </div>
                        </div>
                    </Row>
                </form>
            </div>
            <div className="card-header border-0" style={cardHeaderStyle}>
                <div className="row align-items-center" style={{ justifyContent: 'space-between' }}>
                    <div className="col">
                        <ul role="tablist" className="nav-tabs-custom card-header-tabs border-bottom-0 nav flex-fill" style={{ width: '100%' }}>
                            <li className="nav-item" style={{ flex: 1 }}>
                                <a href="#" className={`fw-semibold nav-link ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')} style={{ width: '100%', textAlign: 'center' }}>
                                    Statistics
                                </a>
                            </li>
                            <li className="nav-item" style={{ flex: 1 }}>
                                <a href="#" className={`fw-semibold nav-link ${activeTab === 'vouchers' ? 'active' : ''}`} onClick={() => setActiveTab('vouchers')} style={{ width: '100%', textAlign: 'center' }}>
                                    Vouchers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </BreadCrumb>
        
{/* Include SearchOption but hide it using CSS */}
<div className="d-none">
      <SearchOption onSearch={handleSearch} />
   </div>
   {/* Include SearchOption but hide it using CSS */}
   <div className="d-block d-md-none">
  <Header onSearch={handleSearch} />
</div>

   
   <Container style={containerStyle}>
      {activeTab === 'vouchers' && <HeaderTabData onSelectTab={handleTabSelection} tabCounts={tabCounts} />}
      <Col xl={8}>
        {Array.isArray(user) ? (
          activeTab === 'statistics' ? (
            <Statistics
              partyFilter={partyFilter}
              itemFilter={itemFilter}
              brokerFilter={brokerFilter}
              groupFilter={groupFilter}
              selectedDates={selectedDates}
              user={user}
              searchQuery={searchQuery} // pass the search query to Statistics
            />
          ) : (
            <TabData vouchers={combinedFilter} selectedTab={selectedTab} selectedDates={selectedDates}   onUpdateCounts={handleUpdateCounts}  searchQuery={searchQuery}/>
          )
        ) : (
          <p>No finished products data available.</p>
        )}
      </Col>
    </Container>
            {filterOpen && (
                <div className={`sidebar-filter ${isAnyAccordionOpen ? 'open-height' : 'closed-height'}`}>
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex justify-content-end p-2" style={{ marginTop:'-1.5rem' }}>
                                <i className="ri-close-line" style={{ cursor: 'pointer' }} onClick={toggleDropdown}></i>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="flex-grow-1">
                                    <h5 className="fs-16">Filters</h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <a className="text-decoration-underline" style={{ cursor: 'pointer' }} onClick={clearAll}>Clear All</a>
                                </div>
                            </div>
                        </div>
                        <div className="accordion accordion-flush">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button bg-transparent shadow-none" type="button" id="flush-headingBrands" onClick={toggleAccordion1}>
                                        <span className="text-muted text-uppercase fs-12 fw-medium">Party</span>
                                        <span className="badge bg-success rounded-pill align-middle ms-1">{uniquePartyNames.length}</span>
                                    </button>
                                </h2>
                                <div className={`collapse ${isOpen1 ? 'show' : ''}`} id="flush-collapseBrands" aria-labelledby="flush-headingBrands">
                                    <div className="accordion-body text-body pt-0">
                                        <div className="search-box search-box-sm">
                                             <input
                                                type="text"
                                                className="form-control bg-light border-0"
                                                placeholder="Search Party..."
                                                value={searchQuery1}
                                                onChange={handleSearchChange1}
                                            />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                        <PartyFilter
                                            uniquePartyNames={uniquePartyNames}
                                            searchQuery1={searchQuery1}
                                            checkedState1={checkedState1}
                                            handleCheckboxChange1={handleCheckboxChange1}
                                            showMore1={showMore1}
                                            setShowMore1={setShowMore1}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Accordion items for Items, Brokers, and Groups */}
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button bg-transparent shadow-none"
                                        type="button"
                                        id="flush-headingItems"
                                        onClick={toggleAccordion2}
                                    >
                                        <span className="text-muted text-uppercase fs-12 fw-medium">Items</span>
                                        <span className="badge bg-success rounded-pill align-middle ms-1">{filteredItems.length}</span>
                                    </button>
                                </h2>
                                <div className={`collapse ${isOpen2 ? 'show' : ''}`} id="flush-collapseItems" aria-labelledby="flush-headingItems">
                                    <div className="accordion-body text-body pt-0">
                                        <div className="search-box search-box-sm">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-0"
                                                placeholder="Search Items..."
                                                value={searchQuery2}
                                                onChange={handleSearchChange2}
                                            />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                        <div className="d-flex flex-column gap-2 mt-3">
                                            {filteredItems.slice(0, 3).map((item, itemIndex) => (
                                                <div className="form-check" key={itemIndex}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`itemsName${itemIndex}`}
                                                        checked={checkedState2[itemIndex]}
                                                        onChange={() => handleCheckboxChange2(itemIndex)}
                                                        value={item.item}
                                                    />
                                                    <label className="form-check-label" htmlFor={`itemsName${itemIndex}`}>
                                                        {item.item}
                                                    </label>
                                                </div>
                                            ))}
                                            {showMore2 && filteredItems.slice(3).map((item, itemIndex) => (
                                                <div className="form-check" key={itemIndex + 3}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`itemsNameMore${itemIndex}`}
                                                        checked={checkedState2[itemIndex + 3]}
                                                        onChange={() => handleCheckboxChange2(itemIndex + 3)}
                                                        value={item.item}
                                                    />
                                                    <label className="form-check-label" htmlFor={`itemsNameMore${itemIndex}`}>
                                                        {item.item}
                                                    </label>
                                                </div>
                                            ))}
                                            {filteredItems.length > 3 && (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                                                        onClick={() => setShowMore2(!showMore2)}
                                                    >
                                                        {showMore2 ? 'Show Less' : `${filteredItems.length - 3} More`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button bg-transparent shadow-none"
                                        type="button"
                                        id="flush-headingBrokers"
                                        onClick={toggleAccordion3}
                                    >
                                        <span className="text-muted text-uppercase fs-12 fw-medium">Broker</span>
                                        <span className="badge bg-success rounded-pill align-middle ms-1">{uniqueBrokerNames.length}</span>
                                    </button>
                                </h2>
                                <div className={`collapse ${isOpen3 ? 'show' : ''}`} id="flush-collapseBrokers" aria-labelledby="flush-headingBrokers">
                                    <div className="accordion-body text-body pt-0">
                                        <div className="search-box search-box-sm">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-0"
                                                placeholder="Search Agents..."
                                                value={searchQuery3}
                                                onChange={handleSearchChange3}
                                            />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                        <div className="d-flex flex-column gap-2 mt-3">
                                            {uniqueBrokerNames.slice(0, 3).map((broker, index) => (
                                                <div className="form-check" key={index}>
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`brokerName${index}`}
                                                        checked={checkedState3[index]}
                                                        onChange={() => handleCheckboxChange3(index)}
                                                    />
                                                    <Label className="form-check-label" htmlFor={`brokerName${index}`}>
                                                        {broker}
                                                    </Label>
                                                </div>
                                            ))}
                                            {showMore3 && uniqueBrokerNames.slice(3).map((broker, index) => (
                                                <div className="form-check" key={index + 3}>
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`brokerNameMore${index}`}
                                                        checked={checkedState3[index + 3]}
                                                        onChange={() => handleCheckboxChange3(index + 3)}
                                                    />
                                                    <Label className="form-check-label" htmlFor={`brokerNameMore${index}`}>
                                                        {broker}
                                                    </Label>
                                                </div>
                                            ))}
                                            {uniqueBrokerNames.length > 3 && (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                                                        onClick={() => setShowMore3(!showMore3)}
                                                    >
                                                        {showMore3 ? 'Show Less' : `${uniqueBrokerNames.length - 3} More`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button bg-transparent shadow-none"
                                        type="button"
                                        id="flush-headingGroups"
                                        onClick={toggleAccordion4}
                                    >
                                        <span className="text-muted text-uppercase fs-12 fw-medium">Groups</span>
                                        <span className="badge bg-success rounded-pill align-middle ms-1">{filteredGroups.length}</span>
                                    </button>
                                </h2>
                                <div className={`collapse ${isOpen4 ? 'show' : ''}`} id="flush-collapseGroups" aria-labelledby="flush-headingGroups">
                                    <div className="accordion-body text-body pt-0">
                                        <div className="search-box search-box-sm">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-0"
                                                placeholder="Search Groups..."
                                                value={searchQuery4}
                                                onChange={handleSearchChange4}
                                            />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                        <div className="d-flex flex-column gap-2 mt-3">
                                            {filteredGroups.slice(0, 3).map((group, itemIndex) => (
                                                <div className="form-check" key={itemIndex}>
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`groupName${itemIndex}`}
                                                        checked={checkedState4[itemIndex]}
                                                        onChange={() => handleCheckboxChange4(itemIndex)}
                                                    />
                                                    <Label className="form-check-label" htmlFor={`groupName${itemIndex}`}>
                                                        {group.stockGroup}
                                                    </Label>
                                                </div>
                                            ))}
                                            {showMore4 && filteredGroups.slice(3).map((group, itemIndex) => (
                                                <div className="form-check" key={itemIndex + 3}>
                                                    <Input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`groupNameMore${itemIndex}`}
                                                        checked={checkedState4[itemIndex + 3]}
                                                        onChange={() => handleCheckboxChange4(itemIndex + 3)}
                                                    />
                                                    <Label className="form-check-label" htmlFor={`groupNameMore${itemIndex}`}>
                                                        {group.stockGroup}
                                                    </Label>
                                                </div>
                                            ))}
                                            {filteredGroups.length > 3 && (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                                                        onClick={() => setShowMore4(!showMore4)}
                                                    >
                                                        {showMore4 ? 'Show Less' : `${filteredGroups.length - 3} More`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
 <style jsx>{`
                .sidebar-filter {
                    position: fixed;
                    top: 21%; /* Adjust this value based on your header height */
                    right: 1%;
                    width: 300px; /* Adjust width as needed */
                    height: 70%;
                    background-color: white;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    z-index: 1050;
                    padding: 1rem;
                    overflow-y: auto;
                }
                .sidebar-filter.open-height {
                    height: 70%;
                }
                .sidebar-filter.closed-height {
                    height: 50%;
                }
            `}</style>
        </div>
    );
};

export default Filters;
