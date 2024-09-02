import React, { useState, useEffect, useCallback } from "react";

const HeaderTabData = ({ onSelectTab, tabCounts }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [fontSize, setFontSize] = useState('13px');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelectTab(tab);
  };

  const updateFontSize = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 375) {
      setFontSize('13px');
    } else if (width > 365 && width <= 425) {
      setFontSize('14px');
    } else {
      setFontSize('13px');
    }
  }, []);

  useEffect(() => {
    // Update font size on component mount
    updateFontSize();

    // Add event listener for window resize
    window.addEventListener('resize', updateFontSize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [updateFontSize]);

  const tabStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '0rem',
    padding: 0,
    listStyle: 'none'
  };

  const itemStyle = {
    flex: '1',
    textAlign: 'center',
    fontSize: fontSize, // Apply dynamic font size
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const badgeStyle = {
    marginLeft: '5px',
    whiteSpace: 'nowrap' // Prevent the badge from wrapping
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className="card-header border-0" style={{marginTop:'-1rem'}}>
      <div className="row align-items-center">
        <div className="col" style={{ marginLeft: '20px'}}>
          <ul
            role='tablist'
            className='nav-tabs-custom card-header-tabs border-bottom-0 nav'
            style={tabStyle}
          >
            {['All', 'Opening', 'In', 'Out', 'Closing'].map(tab => (
              <li
                key={tab}
                className='nav-item'
                style={itemStyle}
              >
                <a
                  href='#'
                  className={`fw-semibold nav-link${activeTab === tab ? ' active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(tab); }}
                  style={linkStyle}
                >
                  {tab}
                  <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1" style={badgeStyle}>
                    {tabCounts[tab] || 0}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderTabData;
