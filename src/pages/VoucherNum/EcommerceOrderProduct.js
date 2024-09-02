import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from "reselect";
import { fetchVoucherNumData } from '../../slices/thunks';

const EcommerceOrderProduct = () => {
  const dispatch = useDispatch();
  const selectLayoutState = (state) => state.VoucherNum;

  const userprofileData = createSelector(
    selectLayoutState,
    (state) => ({ user: state.user, loading: state.loading, error: state.error })
  );

  const { user, loading, error } = useSelector(userprofileData);

  useEffect(() => {
    dispatch(fetchVoucherNumData());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user || !user.item) {
    return <p>No data available</p>;
  }

  return (
    <React.Fragment>
      {user.item.map((item, index) => (
        <tr key={index}>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 ms-0">
                <h5 className="fs-15">
                  {item.particulars}
                </h5>
                <p className="text-muted mb-0">
                  {item.quantity}  | {item.exclusiveRate}
                </p>
              </div>
            </div>
          </td>
          <td className="fw-medium text-end">{item.exclusiveAmount}</td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default EcommerceOrderProduct;
