/*
 * NAM(Naver Ad Manager) SDK for Web
 *
 * Copyright 2022-present NAVER Corp.
 * All rights reserved.
 *
 * Unauthorized use, modification and redistribution of this software are strongly prohibited.
 */

import { Suspense, useEffect } from 'react';

import { NaverAd } from './components';
import { useAdSlot, useGladSdk } from './hooks';

import './App.css';

const adSlotInfo = {
  adUnitId: 'WEB_nw_banner-N345765840',
  customParam: {
    category: 'entertainment',
    hobby: ['music', 'sports'],
  },
};

const SampleAd = () => {
  const gladSdk = useGladSdk();
  const adSlot = useAdSlot(adSlotInfo, {
    onAdLoaded(ad) {
      console.debug('onAdLoaded', ad);
    },
    onAdImpressed(ad) {
      console.debug('onAdImpressed', ad);
    },
    onAdClicked(ad) {
      console.debug('onAdClicked', ad);
    },
    onAdMuteCompleted(ad) {
      console.debug('onAdMuteCompleted', ad);
    },
  });

  const refresh = () => {
    gladSdk.refreshAdSlots([adSlot]);
  };

  useEffect(() => {
    gladSdk.displayAd(adSlot);
  }, [gladSdk, adSlot]);

  return (
    <div className="ad_sample">
      <NaverAd adSlot={adSlot} />
      <button onClick={refresh}>Refresh</button>
    </div>
  );
};

function App() {
  return (
    <Suspense fallback={'Loading NAM SDK...'}>
      <SampleAd />
    </Suspense>
  );
}

export default App;
