import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const SearchOption = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const location = useLocation();
  const path = location.pathname;

  const onChangeData = (value) => {
    setValue(value);
    if (onSearch) onSearch(value); // pass the value to the parent
  };

  useEffect(() => {
    const searchInput = document.getElementById('search-options');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => onChangeData(e.target.value));
  
      return () => {
        if (searchInput) {
          searchInput.removeEventListener('input', (e) => onChangeData(e.target.value));
        }
      }
    }
  }, []);

  return (
    (path === '/operational' || path === '/finished-products') ? (
      <form className="app-search d-none d-md-block">
        <div className="position-relative">
          <Input
            type="text"
            className="form-control"
            placeholder="Search..."
            id="search-options"
            value={value}
            onChange={e => onChangeData(e.target.value)}
          />
          <span className="mdi mdi-magnify search-widget-icon"></span>
          <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" id="search-close-options"></span>
        </div>
      </form>
    ) : null
  );
};

SearchOption.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchOption;