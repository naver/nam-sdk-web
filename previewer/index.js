const AD_SLOT_ELEMENT_ID = 'main';

window.addEventListener('message', (e) => {
  if (e.data.type === 'preview') {
    const { id, ad } = e.data;

    console.log(id, ad);

    if (id === undefined || !ad) return;

    function sendMessage(message) {
      parent.postMessage(
        {
          type: 'preview_message',
          previewId: id,
          data: message,
        },
        '*'
      );
    }

    window.gladsdk = window.gladsdk || { cmd: [] };
    window.gladsdk.cmd.push(() => {
      const adSlot = window.gladsdk.defineAdSlot({
        adUnitId: 'preview_ad_unit',
        adSlotElementId: AD_SLOT_ELEMENT_ID,
      });

      window.gladsdk.displayAdWithResponse(adSlot, {
        requestId: 'preview_request_id',
        head: {
          version: '0.0.1',
          description: 'Naver SSP Waterfall List',
        },
        eventTracking: {
          ackImpressions: [],
          activeViewImpressions: [],
          clicks: [],
          completions: [],
          attached: [],
          renderedImpressions: [],
          viewableImpressions: [],
          loadErrors: [],
          startErrors: [],
          lazyRenderMediaFailed: [],
          mute: [],
          close: [],
        },
        adUnit: 'preview_ad_unit',
        randomNumber: 0,
        adDivId: AD_SLOT_ELEMENT_ID,
        advertiserDomains: [],
        adDuplicationKeys: [],
        ads: [ad],
      });

      const EVENTS = [
        window.gladsdk.event.AD_LOADED,
        window.gladsdk.event.AD_RENDERED,
        window.gladsdk.event.AD_CLICKED,
        window.gladsdk.event.AD_IMPRESSED,
        window.gladsdk.event.ERROR,
        window.gladsdk.event.EMPTY,
        window.gladsdk.event.AD_MUTE_COMPLETED,
        window.gladsdk.event.AD_MUTE_STATE_CHANGED,
        window.gladsdk.event.CREATIVE_META_CHANGED,
      ];

      EVENTS.forEach((event) => {
        window.gladsdk.addEventListener(event, (ad) => {
          sendMessage({
            event,
            ad,
          });
        });
      });
    });

    // body 크기 변경 감지를 위한 ResizeObserver 추가
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        sendMessage({
          event: 'resize',
          width: width,
          height: height,
        });
      }
    });

    // body 요소 관찰 시작
    resizeObserver.observe(document.body);
  }
});

const searchParams = new URLSearchParams(window.location.search);
const feed = searchParams.get('feed');

if (feed) {
  document.getElementById('pre').style.display = 'block';
  document.getElementById('post').style.display = 'block';
  document.body.style.overflow = 'auto';
}

if (typeof +feed === 'number' && !isNaN(+feed) && +feed > 0) {
  document.getElementById('pre').style.height = `${+feed}px`;
  document.getElementById('post').style.height = `${+feed}px`;
}
