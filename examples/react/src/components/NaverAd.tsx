/*
 * NAM(Naver Ad Manager) SDK for Web
 *
 * Copyright 2022-present NAVER Corp.
 * All rights reserved.
 *
 * Unauthorized use, modification and redistribution of this software are strongly prohibited.
 */

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';

type NaverAdRef = ComponentRef<'div'>;
type NaverAdProps = ComponentPropsWithoutRef<'div'> & {
  adSlot: any;
};

/**
 * AdSlot을 props로 받아 광고를 노출할 Element를 생성하는 컴포넌트
 */
export const NaverAd = forwardRef<NaverAdRef, NaverAdProps>((props, ref) => {
  const { adSlot, ...divProps } = props;

  return <div {...divProps} ref={ref} id={adSlot.getAdSlotElementId()} />;
});
NaverAd.displayName = 'NaverAd';
