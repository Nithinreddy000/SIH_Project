import React, { useState, useEffect } from 'react';
import {
    ButtonGroup,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Col,
    Input,
    Label
} from 'reactstrap'; // Assuming you're using Reactstrap

const Header2 = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 700);

    const [selectedOptions, setSelectedOptions] = useState({
        inward: false,
        outward: false,
        rawMaterials: false,
        finishedProducts: false,
        stores: false,
        others: false
    });

    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;
        setSelectedOptions({ ...selectedOptions, [id]: checked });
    };

    const renderSelectedOptions = () => {
        const selectedKeys = Object.keys(selectedOptions).filter(key => selectedOptions[key]);

        if (selectedKeys.length === 6) {
            return <span style={searchChoiceStyle}>All <a style={closeButtonStyle} onClick={() => handleCloseAll()}>×</a></span>;
        }

        return (
            <ul style={selectedOptionsContainerStyle}>
                {selectedKeys.map((key, index) => (
                    <li key={index} style={searchChoiceStyle}>
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <a style={closeButtonStyle} onClick={() => handleCloseOption(key)}>×</a>
                    </li>
                ))}
            </ul>
        );
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 700);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCloseOption = (option) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [option]: false
        }));
    };

    const handleCloseAll = () => {
        setSelectedOptions({
            inward: false,
            outward: false,
            rawMaterials: false,
            finishedProducts: false,
            stores: false,
            others: false
        });
    };

    const chosenChoicesStyle = {
        padding: '11px',
        background: '#fff',
        border: '1px solid #DDD',
        fontSize: '14px',
        height: 'auto',
        lineHeight: '1.14285714',
        borderRadius: '3px',
        position: 'relative',
        overflow: 'hidden',
        margin: '0',
        width: '100%',
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(#eee 1%, #fff 15%)',
        cursor: 'text'
    };

    const searchChoiceStyle = {
        position: 'relative',
        maxWidth: '100%',
        backgroundColor: '#008BDC',
        color: '#fff',
        fontSize: '10px',
        lineHeight: '1.1428571',
        border: 'none',
        borderRadius: '24px',
        padding: '8px 24px 8px 12px',
        margin: '0 8px 8px 0',
        display: 'inline-flex',
        alignItems: 'center',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '50%',
        right: '8px',
        transform: 'translateY(-50%)',
        fontSize: '12px',
        color: '#fff',
        cursor: 'pointer'
    };

    const selectedOptionsContainerStyle = {
        padding: 0,
        margin: 0,
        listStyleType: 'none',
        display: 'flex',
        flexWrap: 'wrap',
    };

    return (
        <div className="d-flex align-items-center" style={isLargeScreen ? { marginTop: '-2.5rem' } : {}}>
            <ButtonGroup className="me-3">
                <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle tag="button" className="btn btn-primary">
                       <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <div className="d-flex justify-content-end p-2">
                            <i className="ri-close-line" style={{ cursor: 'pointer' }} onClick={toggleDropdown}></i>
                        </div>
                        <DropdownItem>
                            {renderSelectedOptions()}
                            <Col>
                                <div>
                                    <div className="form-check mb-2">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="inward"
                                            checked={selectedOptions.inward}
                                            onChange={handleCheckboxChange}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="form-check-label" htmlFor="inward">
                                            Inward
                                        </Label>
                                    </div>
                                    <div className="form-check">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="outward"
                                            checked={selectedOptions.outward}
                                            onChange={handleCheckboxChange}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="form-check-label" htmlFor="outward">
                                            Outward
                                        </Label>
                                    </div>
                                    <div className="dropdown-divider" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.5)', margin: '0.5rem 0' }}/>
                                    <div className="form-check mb-2">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="rawMaterials"
                                            checked={selectedOptions.rawMaterials}
                                            onChange={handleCheckboxChange}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="form-check-label" htmlFor="rawMaterials">
                                            Raw Materials
                                        </Label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="finishedProducts"
                                            checked={selectedOptions.finishedProducts}
                                            onChange={handleCheckboxChange}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="form-check-label" htmlFor="finishedProducts">
                                            Finished Products
                                        </Label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="stores"
                                            checked={selectedOptions.stores}
                                            onChange={handleCheckboxChange}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="form-check-label" htmlFor="stores">
                                            Stores
                                        </Label>
                                    </div>
                                    <div className="form-check">
                                        <Input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="others"
                                            checked={selectedOptions.others}
                                            onChange={handleCheckboxChange}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="form-check-label" htmlFor="others">
                                            Others
                                        </Label>
                                    </div>
                                </div>
                            </Col>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </ButtonGroup>
        </div>
    );
};

export default Header2;