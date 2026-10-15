# Naver Ad Manager SDK for Web

Naver Ad Manager는 높은 단가의 ‘네이버 성과형 광고 플랫폼’(네이버SSP에서만 물량 제공)을 비롯해 국내/외 대표적인 DSP를 모두 확보하고 있어 매체 수익화를 위한 최적의 환경을 제공합니다.

NAM WEB SDK에 대한 문의사항은 이 저장소의 [이슈](http://github.com/naver/nam-sdk-web/issues)로 등록해주시면 됩니다.

## Docs

NAM WEB SDK에 대한 전체 가이드 문서는 [NAM SDK 문서](https://naver.github.io/nam-sdk-guide/web)에서 확인할 수 있습니다.

[API Reference](https://naver.github.io/nam-sdk-guide/web/api)

## Usage

### 광고 게재

1. NAM SDK 초기화

    서비스 페이지의 `<head>`에 다음 스크립트를 추가하여 NAM SDK를 로드합니다.
    
    ```html
    <head>
      <meta charset="utf-8" />
      <title>Test NAM SDK</title>
      <!-- 아래 스크립트를 추가 -->
      <script async src="https://ssl.pstatic.net/tveta/libs/glad/prod/gfp-core.js"></script>
      <script>
        window.gladsdk = window.gladsdk || { cmd: [] };
      </script>
    </head>
    ```

2. 광고 슬롯 정의

    `gladsdk.defineAdSlot()`를 호출해 광고 슬롯을 생성하고 초기화합니다.
    
    - adUnitId : 매체용으로 발급된 광고 유닛 ID 값
    - adSlotElementId : 매체 페이지에서 생성한 광고가 삽입될 HTML 요소의 ID 값
    
    ```html
    <head>
      <meta charset="utf-8" />
      <title>Test NAM SDK</title>
      <script async src="https://ssl.pstatic.net/tveta/libs/glad/prod/gfp-core.js"></script>
      <script>
        window.gladsdk = window.gladsdk || { cmd: [] };

        window.gladsdk.cmd.push(function () {
          var adSlotInfo = {
            adUnitId: 'WEB_nw_banner-N345765840',
            adSlotElementId: 'division',
          };
 
          window.gladsdk.defineAdSlot(adSlotInfo);
        });
      </script>
    </head>
    ```

3. 광고 요청 및 노출

    `gladsdk.displayAd()`를 호출해 광고 슬롯의 광고를 요청하고, 렌더링할 수 있습니다.
    
    ```html
    <body>
      <div id="division"></div>
      <script>
        window.gladsdk.cmd.push(function () {
          var adSlot = window.gladsdk.findAdSlot('division');
          window.gladsdk.displayAd(adSlot);
        });
      </script>
    </body>
    ```

### 광고 새로고침

`gladsdk.refreshAd()`를 호출해 광고 슬롯에 렌더링된 광고를 제거하고, 새로운 광고를 요청할 수 있습니다.

```html
<body>
  <div id="division"></div>
  <script>
    window.gladsdk.cmd.push(function () {
      var adSlot = window.gladsdk.findAdSlot('division');
      window.gladsdk.displayAd(adSlot);
    });
  </script>

  <button id="refresh">Refresh</button>
  <script>
    document.getElementById('refresh').addEventListener('click', function () {
      var adSlot = window.gladsdk.findAdSlot(adSlotElementId);
      window.gladsdk.refreshAdSlots([adSlot]);
    });
  </script>
</body>
```

### 광고 삭제

`gladsdk.destroyAdSlots()`를 호출해 광고 슬롯을 제거할 수 있습니다.

```html
<body>
  <div id="division"></div>
  <script>
    window.gladsdk.cmd.push(function () {
      var adSlot = window.gladsdk.findAdSlot('division');
      window.gladsdk.displayAd(adSlot);
    });
  </script>

  <button id="destroy">Destroy</button>
  <script>
    document.getElementById('destroy').addEventListener('click', function () {
      var adSlot = window.gladsdk.findAdSlot('division');
      window.gladsdk.destroyAdSlots([adSlot]);
    });
  </script>
</body>
```

### 광고 이벤트리스너 등록

`gladsdk.addEventListener()`를 호출해 광고 슬롯에서 발생하는 이벤트를 수신하는 이벤트리스너를 추가할 수 있습니다.

```html
<script>
window.gladsdk = window.gladsdk || { cmd: [] };

// 광고 로드
window.gladsdk.addEventListener(window.gladsdk.event.AD_LOADED, function (ad) {
  console.log(window.gladsdk.event.AD_LOADED);

  var adSlot = ad.slot;
  var adUnitId = adSlot.getAdUnitId();
  var adSlotElementId = adSlot.getAdSlotElementId();
});

// 광고 클릭
window.gladsdk.addEventListener(window.gladsdk.event.AD_CLICKED, function (ad) {
  console.debug(window.gladsdk.event.AD_CLICKED);
});

// 광고 Viewable
window.gladsdk.addEventListener(window.gladsdk.event.AD_IMPRESSED, function (ad) {
  console.debug(window.gladsdk.event.AD_IMPRESSED);
});

// 광고 렌더링 실패
window.gladsdk.addEventListener(window.gladsdk.event.ERROR, function (ad, error) {
  console.debug(window.gladsdk.event.ERROR);
});

// AD mute 발생
window.gladsdk.addEventListener(window.gladsdk.event.AD_MUTE_COMPLETED, function (ad) {
  console.debug(window.gladsdk.event.AD_MUTE_COMPLETED);
});

window.gladsdk.cmd.push(function () {
  var adSlotInfo = {
    adUnitId: 'WEB_nw_banner-N345765840',
    adSlotElementId: 'division',
  };

  window.gladsdk.defineAdSlot(adSlotInfo);
});
</script>
```

### 광고 클릭 핸들러 등록

`gladsdk.findAdSlot('adSlotElementId').setClickHandler()`를 호출해 특정 광고 슬롯의 클릭 이벤트에 대해 SDK 기본 클릭 핸들러를 대체하는 커스텀 클릭 핸들러를 등록할 수 있습니다.

```html
<script>
  window.gladsdk.cmd.push(function () {
    gladsdk.findAdSlot('adSlotElementId').setClickHandler(function (curl, furl, ext) {
      // curl : click url(string), furl?: fallback url(string | undefined), ext?: extra(any | undefined)
      console.debug('curl', curl, 'furl', furl, 'ext', ext);
    });
  });
</script>
```

### 사용자 타겟팅

`gladsdk.defineAdSlot()`을 호출해 광고 슬롯을 생성할 때, 광고 요청에 함께 전달할 사용자 타게팅 정보를 추가할 수 있습니다.

```html
<script>
  window.gladsdk.cmd.push(function () {
    var adSlotInfo = {
      adUnitId: 'WEB_nw_banner-N345765840',
      adSlotElementId: 'division',

      ai: '001bd666-dbc0-4e3c-900f-e2bbb1668c38', // ad id
      iv: '58F36556-19FD-445B-AF3A-C6D86B15D56C', // identifierForVendor
      yob: 1988, // year of birth, 4 digit number
      gender: 'M', // gender, 'M':male, 'F': female, 'O': unknown
      uct: 'KR', // user country
      uid: 'user id', // publisher user identifier
      customParam: {}, // custom parameter
    };
    window.gladsdk.defineAdSlot(adSlotInfo);
  });
</script>
```

### SDK 전역 설정

`gladsdk.setGlobalConfig()`를 호출해 SDK와 관련된 설정을 할 수 있습니다.

```html
<script>
  window.gladsdk.cmd.push(function () {
    var config = {
      requestTimeout: 60000,
      enablePersistAd: false,
      language: 'en',
      appName: 'm.naver.com',
      appVersion: '1.0.0',
    };

    window.gladsdk.setGlobalConfig(config);
  });
</script>
```

## Examples

- [광고 보여주기](./examples/basic.html)
- [광고 새로고침 및 삭제](./examples/refresh-and-destroy.html)
- [광고 이벤트 수신](https://naver.github.io/nam-sdk-guide/web/basic/eventlistener)
- [광고 클릭 처리](./examples/setClickHandler.html)

### React Demo App

[examples/react](./examples/react)에 React 환경에서 NAM SDK를 사용해 광고를 표시하는 데모 앱이 구현되어 있습니다.

## License

NAM(Naver Ad Manager) SDK의 저작권은 네이버(주)에 있습니다.

```
NAM(Naver Ad Manager) SDK for Web
Copyright 2022-present NAVER Corp.
All rights reserved.
Unauthorized use, modification and redistribution of this software are strongly prohibited.
```
