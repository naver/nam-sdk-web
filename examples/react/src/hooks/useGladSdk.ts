/*
 * NAM(Naver Ad Manager) SDK for Web
 *
 * Copyright 2022-present NAVER Corp.
 * All rights reserved.
 *
 * Unauthorized use, modification and redistribution of this software are strongly prohibited.
 */

let sdk: typeof window.gladsdk;

window.gladsdk = window.gladsdk || { cmd: [] };
const suspender = new Promise((resolve) => {
  window.gladsdk.cmd.push(resolve);
}).then(() => {
  sdk = window.gladsdk;
});

export function useGladSdk() {
  if (!sdk) {
    throw suspender;
  }
  return sdk;
}

declare global {
  interface Window {
    gladsdk: any;
  }
}
