/*
 * NAM(Naver Ad Manager) SDK for Web
 *
 * Copyright 2022-present NAVER Corp.
 * All rights reserved.
 *
 * Unauthorized use, modification and redistribution of this software are strongly prohibited.
 */

import { useEffect, useRef, useState } from 'react';
import { useGladSdk } from './useGladSdk';

type AdSlotInfo = Record<string, unknown>;
type AdEventListener = (ad: any, error?: unknown) => void;
interface AdEventListeners {
  onAdLoaded?: AdEventListener;
  onAdClicked?: AdEventListener;
  onAdImpressed?: AdEventListener;
  onAdMuteCompleted?: AdEventListener;
  onError?: AdEventListener;
}
const defaultListeners = {};

export function useAdSlot(adSlotInfo: AdSlotInfo, eventListeners: AdEventListeners = defaultListeners) {
  const gladSdk = useGladSdk();
  const [adSlot, setAdSlot] = useState(() => gladSdk.defineAdSlot(adSlotInfo));
  const adSlotInfoRef = useRef<AdSlotInfo>();
  const eventListenersRef = useRef(eventListeners);

  if (!deepEqual(adSlotInfoRef.current, adSlotInfo)) {
    adSlotInfoRef.current = adSlotInfo;
  }
  const optimalAdSlotInfo = adSlotInfoRef.current;

  useEffect(() => {
    const _adSlot = gladSdk.defineAdSlot(optimalAdSlotInfo);
    setAdSlot(_adSlot);
    return () => {
      gladSdk.destroyAdSlots([_adSlot]);
    };
  }, [gladSdk, optimalAdSlotInfo]);

  useEffect(() => {
    eventListenersRef.current = eventListeners;
  }, [eventListeners]);

  useEffect(() => {
    const eventMap: Record<string, string> = {
      [gladSdk.event.AD_LOADED]: 'onAdLoaded',
      [gladSdk.event.AD_CLICKED]: 'onAdClicked',
      [gladSdk.event.AD_IMPRESSED]: 'onAdImpressed',
      [gladSdk.event.AD_MUTE_COMPLETED]: 'onAdMuteCompleted',
      [gladSdk.event.ERROR]: 'onError',
    };
    const disposers = Object.entries(eventMap).map(([event, listenerName]) => {
      const listener: AdEventListener = (ad, error) => {
        if (ad.slot !== adSlot) return;
        eventListenersRef.current[listenerName as keyof AdEventListeners]?.(ad, error);
      };
      gladSdk.addEventListener(event, listener);
      return () => gladSdk.removeEventListener(event, listener);
    });
    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [gladSdk, adSlot]);

  return adSlot;
}

function deepEqual(a: unknown, b: unknown): a is typeof b {
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    for (const prop in a) {
      if (!Object.prototype.hasOwnProperty.call(b, prop)) {
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}
