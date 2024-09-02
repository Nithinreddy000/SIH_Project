import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from "reselect";
import { fetchVoucherImagesNumData } from '../../slices/thunks';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Card, CardHeader, CardBody } from 'reactstrap';

const VoucherImages = () => {
  const dispatch = useDispatch();

  // Selecting data from Redux state
  const selectLayoutState = (state) => state.VoucherImageNum;
  const userprofileData = createSelector(
    selectLayoutState,
    (state) => state.user2,
    (state) => state.error,
    (state) => state.loading
  );

  const user2 = useSelector(state => userprofileData(state).user2);
  const loading = useSelector(state => userprofileData(state).loading);
  const error = useSelector(state => userprofileData(state).error);

  useEffect(() => {
    dispatch(fetchVoucherImagesNumData());
  }, [dispatch]);

  useEffect(() => {
    console.log('user2:', user2); // Log the user2 array
  }, [user2]);

  // Handling loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Handling errors
  if (error) {
    return <p>Error occurred: {error.message}</p>;
  }

  const errorimages = localStorage.getItem("errorimages");

  // Rendering Swiper component if user2 exists and has elements
  return (
    !errorimages && user2 && user2.length > 0 ? (
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">
            <i className="ri-flag-2-fill align-bottom me-1 text-muted"></i>
            Camera Captures
          </h5>
        </CardHeader>
        <CardBody>
          <Swiper
            navigation
            pagination={{ clickable: true }}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            className="mySwiper swiper navigation-swiper rounded"
          >
            {user2.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`data:image/png;base64,${image.imageBase64}`}
                  alt={image.imageName}
                  className="img-fluid"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </CardBody>
      </Card>
    ) : null
  );
};

export default VoucherImages;
