import React, { useState, createContext, useCallback, useEffect } from 'react';
import _ from 'lodash';

const CouponContext = createContext({});

function CouponProvider({ children }) {

  const [couponState, setCoupons] = useState({
    list: [],
    couponSelected: null,
    couponMechanics: null,
    couponAudience: null,
    mechanicsSaved: null,
  });

  const setCouponSelected = coupon => {
    setCoupons({...couponState, couponSelected: coupon})
  }

  const setFullyMechanics = (data) => {
    setCoupons({
      ...couponState,
      couponMechanics: data
    });
  }

  const setCouponMechanics = (key, value) => {
    console.log(key, value);
    setCoupons({
      ...couponState,
      couponMechanics: {
        ...couponState.couponMechanics,
        [key]: value
      }
    });
  }

  const setCouponAudience = (key, value) => {
    setCoupons({
      ...couponState,
      couponAudiences: {
        ...couponState.couponAudiences,
        [key]: value
      }
    });
  }

  const couponClear = () => {
    setCoupons({
      list: [],
      couponSelected: null,
      couponMechanics: null,
      couponAudience: null,
      mechanicsSaved: null,
    })
  }

  useEffect(()=>{
    console.log( 'couponState' ,couponState);
  },[couponState]);

  return (
    <CouponContext.Provider value={{
      couponState,
      setCoupons,
      setCouponSelected,
      setCouponMechanics,
      setFullyMechanics,
      setCouponAudience,
      couponClear
    }}>
      {children}
    </CouponContext.Provider>
  );
}

export { CouponContext, CouponProvider };
