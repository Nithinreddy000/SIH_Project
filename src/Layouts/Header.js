import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Form } from 'reactstrap';

// Import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

// Import Components
import SearchOption from '../Components/Common/SearchOption';
import LanguageDropdown from '../Components/Common/LanguageDropdown';
import WebAppsDropdown from '../Components/Common/WebAppsDropdown';
import MyCartDropdown from '../Components/Common/MyCartDropdown';
import FullScreenDropdown from '../Components/Common/FullScreenDropdown';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
import LightDark from '../Components/Common/LightDark';

import { changeSidebarVisibility } from '../slices/thunks';
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass, onSearch }) => {
    const dispatch = useDispatch();
    const companyName = JSON.parse(localStorage.getItem("selectedCompany"))?.companyName;
    const location = useLocation();
    const path = location.pathname;

    const selectDashboardData = createSelector(
        (state) => state.Layout,
        (sidebarVisibilitytype) => sidebarVisibilitytype.sidebarVisibilitytype
    );

    const sidebarVisibilitytype = useSelector(selectDashboardData);

    const [search, setSearch] = useState(false);

    const toggleSearch = () => {
        setSearch(!search);
    };

    const toggleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;
        dispatch(changeSidebarVisibility("show"));

        if (windowSize > 767)
            document.querySelector(".hamburger-icon").classList.toggle('open');

        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.toggle("menu");
        }

        if (sidebarVisibilitytype === "show" && (document.documentElement.getAttribute('data-layout') === "vertical" || document.documentElement.getAttribute('data-layout') === "semibox")) {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }

        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.toggle('twocolumn-panel');
        }
    };

    const [value, setValue] = useState('');

    const onChangeData = (value) => {
        setValue(value);
        if (onSearch) onSearch(value); // pass the value to the parent
    };

    useEffect(() => {
        const searchInput = document.getElementById('search-options');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => onChangeData(e.target.value));
        }

        return () => {
            if (searchInput) {
                searchInput.removeEventListener('input', (e) => onChangeData(e.target.value));
            }
        };
    }, []);

    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">
                            <div className="navbar-brand-box horizontal-logo">
                                <Link to="/" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="17" />
                                    </span>
                                </Link>
                                <Link to="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="17" />
                                    </span>
                                </Link>
                            </div>
                            <button
                                onClick={toggleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                            <SearchOption onSearch={onSearch} />
                            {path !== '/operational' && path !== '/finished-products' && (
                                <h5 className="mb-0 mt-4">{companyName}</h5>
                            )}
                        </div>

                        {path === '/operational' || path === '/finished-products' ? (
                            <h5 className="mb-0">{companyName}</h5>
                        ) : null}
                        <div className="d-flex align-items-center">
                            {(path === '/operational' || path === '/finished-products') && (
                                <Dropdown isOpen={search} toggle={toggleSearch} className="d-md-none topbar-head-dropdown header-item">
                                    <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                        <i className="bx bx-search fs-22"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                        <Form className="p-3">
                                            <div className="form-group m-0">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Search ..."
                                                        aria-label="Recipient's username" 
                                                        id="search-options"
                                                        value={value}
                                                        onChange={e => onChangeData(e.target.value)} />
                                                </div>
                                            </div>
                                        </Form>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                            <FullScreenDropdown />
                            <LightDark
                                layoutMode={layoutModeType}
                                onChangeLayoutMode={onChangeLayoutMode}
                            />
                            <NotificationDropdown />
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;
