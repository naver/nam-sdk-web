# Naver Ad Manager SDK for Web

Naver Ad Manager는 높은 단가의 ‘네이버 성과형 광고 플랫폼’(네이버SSP에서만 물량 제공)을 비롯해 국내/외 대표적인 DSP를 모두 확보하고 있어 매체 수익화를 위한 최적의 환경을 제공합니다.

NAM WEB SDK에 대한 문의사항은 이 저장소에 [이슈](http://github.com/naver/nam-sdk-web/issues)로 등록해주시면 됩니다.

NAM WEB SDK에 대한 전체 가이드 문서는 [여기](https://naver.github.io/glad-sdk-guide/ko/web_new/common/get_started/)에서 확인할 수 있습니다.

---

## Getting Started

### 광고 보여주기

1. NAM SDK 초기화

   - 서비스 페이지에 NAM SDK를 로드합니다.

     NAM SDK는 페이지에 최초 1회만 로드되어야 합니다.

   - 로딩된 NAM SDK는 실행할 준비가 되면 cmd 큐에 있는 명령어들을 실행시킵니다.

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8" />
       <title>Test NAM SDK</title>
       <script async src="https://ssl.pstatic.net/tveta/libs/glad/prod/gfp-core.js"></script>
       <script>
         window.gladsdk = window.gladsdk || { cmd: [] };
       </script>
     </head>
   </html>
   ```

2. adSlot 정의하기

   `gladsdk.defineAdSlot()`은 광고 슬롯을 생성하고 초기화합니다.

   - adUnitId : 매체용으로 발급된 광고 유닛 ID 값
   - adSlotElementId : 매체 페이지에서 생성한 광고가 삽입될 HTML 요소의 ID 값

   ```html
   <!DOCTYPE html>
   <html>
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
   </html>
   ```

3. 광고 보여주기

   `gladsdk.displayAd()`를 통해 광고 슬롯의 광고를 요청하고, 렌더링할 수 있습니다.

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

완성된 HTML은 [여기](./examples/basic.html)에서 확인할 수 있습니다.

### 광고 새로고침

`gladsdk.refreshAd()`를 통해 광고 슬롯에 렌더링된 광고를 제거하고, 새로운 광고를 요청할 수 있습니다.

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

완성된 HTML은 [여기](./examples/refresh.html)에서 확인할 수 있습니다.

### 광고 삭제

`gladsdk.destroyAdSlots()`를 통해 광고 슬롯을 제거할 수 있습니다.

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

완성된 HTML은 [여기](./examples/destroy.html)에서 확인할 수 있습니다.

### 광고 이벤트리스너 등록

- `gladsdk.addEventListener()`를 이용해서 광고 슬롯 렌더링중에 발생할 이벤트를 확인하기 위해 이벤트리스너를 추가할 수 있습니다.

- 이벤트 종류

  |     이벤트     |          이벤트 타입명          |                       설명                       |
  | :------------: | :-----------------------------: | :----------------------------------------------: |
  |   광고 로드    |     gladsdk.event.AD_LOADED     |          광고 슬롯에 광고 로드 시 발생           |
  |   광고 노출    |   gladsdk.event.AD_IMPRESSED    | 광고 슬롯에 랜더링된 소재 노출 기준 만족 시 발생 |
  |   광고 클릭    |    gladsdk.event.AD_CLICKED     |      광고 슬롯에 랜더링된 소재 클릭 시 발생      |
  |   광고 에러    |       gladsdk.event.ERROR       |      광고 로드 실패 혹은 실행 에러 시 발생       |
  | 광고 뮤트 완료 | gladsdk.event.AD_MUTE_COMPLETED |           광고 뮤트 사유 클릭 시 발생            |

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

- 광고 이벤트 해제

  `gladsdk.removeAllEventListener()`를 이용하여 모든 이벤트리스너를 해제할 수 있습니다.

  ```html
  <script>
    window.gladsdk.cmd.push(function () {
      window.gladsdk.removeAllEventListener();
    });
  </script>
  ```

완성된 HTML은 [여기](./examples/event.html)에서 확인할 수 있습니다.

### 광고 클릭 핸들러 등록

- `gladsdk.findAdSlot('adSlotElementId').setClickHandler()`를 이용해서 특정 광고 슬롯에서 클릭 이벤트가 발생하면 SDK 내장 클릭 핸들러를 대신하는 커스텀한 클릭 핸들러를 등록할 수 있습니다.

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

완성된 HTML은 [여기](./examples/setClickHandler.html)에서 확인할 수 있습니다.

---

## 광고 파라미터 설정 가이드

### 사용자 타겟팅

`gladsdk.defineAdSlot()`을 통해 광고 슬롯을 생성할 때, 광고 요청에 함께 전달될 사용자 정보를 추가할 수 있습니다.

- ai : ADID (안드로이드 GAID, iOS IDFA), e.g.) 001bd666-dbc0-4e3c-900f-e2bbb1668c38

- iv identifierForVendor, iOS IDFA를 대체할 수 있는 identifier로 등록한 서비스 Vendor ID, e.g.) com.navercorp 을 UUID 형태로 추출한 값

- yob : 출생년도 4자리

- gender : user gender, M | F | O, M: 남자, F: 여자, O: Other(M, F로 구분이 안되는 경우)

- uct : user country

  [ISO 3166-1 alpha-2](https://ko.wikipedia.org/wiki/ISO_3166-1) 사용

- uid : user id

- customParam : 매체 커스텀 파라미터

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

`gladsdk.setGlobalConfig()`를 통해 SDK와 관련된 설정을 할 수 있습니다.

- requestTimeout : 광고 요청 타임 아웃값(number) // default: 60000ms

- enablePersistAd : 광고 퍼시스트 설정 여부(boolean), 기본값 false

- language : 언어 코드값, ko(Korean), en(English), ja(Japanese), zh-tw(Taiwanese), th(Thai), id(Indonesian) // default: en

- appName : 서비스 이름 // default: 도메인 네임

- appVersion: 서비스 릴리즈 버전

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

---

## License

NAM(Naver Ad Manager) SDK의 저작권은 네이버(주)에 있습니다.

```
NAM(Naver Ad Manager) SDK for Web
Copyright 2022-present NAVER Corp.
All rights reserved.
Unauthorized use, modification and redistribution of this software are strongly prohibited.
```
