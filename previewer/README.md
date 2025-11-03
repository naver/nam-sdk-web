# 광고 프리뷰어 (Ad Previewer)

이 프로젝트는 네이버 광고 SDK를 사용하여 광고를 미리보기할 수 있는 iframe 기반 프리뷰어입니다.

## 파일 구조

- `index.html`: 광고가 렌더링되는 iframe 페이지
- `index.js`: 광고 SDK 초기화 및 이벤트 처리 로직
- `example.html`: 프리뷰어 사용 예제

## 사용 방법

### 1. 기본 설정

프리뷰어를 사용하려면 `example.html`과 같은 구조로 HTML 페이지를 만드세요:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>광고 프리뷰어</title>
  </head>
  <body>
    <div>
      <iframe
        id="preview"
        src="https://naver.github.io/nam-sdk-web/previewer"
        style="overflow: hidden; border: none; width: 100%; height: 100%"
      ></iframe>
    </div>
    <script>
      // 프리뷰어 초기화 코드 (아래 참조)
    </script>
  </body>
</html>
```

> 광고 영역 상하에 컨텐츠 영역을 추가하려면 src 주소에 `?feed={height}` 쿼리 파라미터를 추가하세요.  
> 예: `~/previewer?feed=200`  or  `~/previewer?feed=true`  
> `feed=true` 설정 시 기본 값 300px 설정

### 2. 광고 데이터 전송

iframe이 로드된 후, `postMessage`를 통해 광고 데이터를 전송합니다:

```javascript
const iframe = document.querySelector('#preview');

iframe.onload = () => {
  iframe.contentWindow.postMessage(
    {
      type: 'preview',
      id: '고유한_프리뷰_ID', // 예: "1234567890"
      ad: {
        // 광고 데이터 객체
        creativeType: 'NATIVE',
        renderType: 'NN',
        adInfo: {
          // 광고 정보...
        },
        // 기타 광고 관련 데이터...
      },
    },
    '*'
  );
};
```

### 3. 이벤트 수신

프리뷰어에서 발생하는 이벤트를 수신하여 처리할 수 있습니다:

```javascript
window.addEventListener('message', (e) => {
  if (e.data.type === 'preview_message') {
    const { previewId, data } = e.data;

    console.log('프리뷰 ID:', previewId);
    console.log('이벤트 데이터:', data);

    // 크기 변경 이벤트 처리
    if (data.event === 'resize') {
      const { width, height } = data;
      iframe.style.width = `${width}px`;
      iframe.style.height = `${height}px`;
    }

    // 기타 광고 이벤트 처리
    // data.event 값에 따라 다양한 이벤트 처리 가능
  }
});
```

## 지원하는 이벤트

프리뷰어는 다음과 같은 이벤트를 전송합니다:

### 광고 SDK 이벤트

- `AD_LOADED`: 광고 로드 완료
- `AD_RENDERED`: 광고 렌더링 완료
- `AD_CLICKED`: 광고 클릭
- `AD_IMPRESSED`: 광고 노출
- `ERROR`: 오류 발생
- `AD_MUTE_COMPLETED`: 광고 음소거 완료
- `AD_MUTE_STATE_CHANGED`: 음소거 상태 변경
- `CREATIVE_META_CHANGED`: 크리에이티브 메타 정보 변경

### 크기 변경 이벤트

- `resize`: body 크기 변경 시 자동으로 전송
  ```javascript
  {
    event: "resize",
    width: 300,    // 새로운 너비
    height: 250    // 새로운 높이
  }
  ```
