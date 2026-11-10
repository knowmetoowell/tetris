# Jest로 프론트엔드 단위 테스트 시작하기

이 앱은 `index.html`을 제공하는 정적 웹 앱입니다. 화면과 대부분의 게임 동작은 HTML 파일에 있으며, 테스트를 위해 회전 계산을 `src/game-logic.js`로 분리했습니다. Jest는 JavaScript 단위 테스트를 실행하지만 브라우저 전체를 띄우지는 않습니다. DOM을 다루는 테스트에는 `jsdom` 환경을 함께 사용할 수 있습니다.

## 현재 실행 환경

확인 당시 Windows PowerShell에서는 Node.js `v20.9.0`, npm `10.4.0`이 확인됐습니다. WSL Ubuntu에는 nvm `0.40.3`과 Node.js LTS `v26.13.0`, npm `11.20.0`이 설치되어 있습니다. 비대화형 셸에서는 nvm 초기화가 자동으로 되지 않아 `node`를 찾지 못할 수 있습니다. 그런 셸에서는 `source ~/.nvm/nvm.sh`를 먼저 실행합니다. Windows와 WSL은 별도 실행 환경이므로, `~/work/tetris`처럼 WSL 파일 경로에서 작업할 때는 WSL 터미널의 Node.js를 사용합니다.

## 1. Node.js와 npm 설치

Node.js에는 JavaScript 실행 환경인 Node와 패키지를 설치하는 npm이 함께 제공됩니다. 이미 사용하는 터미널에서 `node --version`과 `npm --version`이 모두 정상 출력되면 설치 단계는 건너뜁니다.

### Windows PowerShell

Windows에서 프로젝트 작업을 할 경우, 관리자 권한 터미널에서 다음 명령을 사용하거나 [Node.js 공식 다운로드 페이지](https://nodejs.org/en/download)에서 LTS Windows Installer를 내려받아 설치합니다.

```powershell
winget install OpenJS.NodeJS.LTS
```

설치가 끝나면 PowerShell을 다시 열고 확인합니다.

```powershell
node --version
npm --version
```

### WSL Ubuntu

`~/work/tetris`에서 작업한다면 Ubuntu 터미널에서 nvm을 사용해 Node.js LTS를 설치합니다.

```bash
sudo apt update
sudo apt install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

설치를 확인합니다.

```bash
node --version
npm --version
```

두 명령 모두 버전을 출력해야 합니다. WSL에서 `node`를 찾을 수 없으면 WSL 터미널을 다시 열고 확인하세요.

## 2. 프로젝트에 Jest 설치

`index.html`이 있는 프로젝트 루트에서 실행합니다. 이 저장소의 WSL 경로는 `~/work/tetris`입니다. Windows PowerShell에서 별도 Windows 폴더를 작업한다면 먼저 `cd C:\path\to\tetris`로 이동한 뒤 같은 `npm` 명령을 실행합니다.

```bash
cd ~/work/tetris
# package.json이 없는 새 프로젝트에서만 한 번 실행
npm init -y
npm install --save-dev jest jest-environment-jsdom
npm pkg set scripts.test="jest"
```

`npm init -y`는 `package.json`이 아직 없을 때 한 번만 실행합니다. `jest`는 테스트 실행기이며 `jest-environment-jsdom`은 DOM 관련 테스트용 브라우저 환경을 제공합니다. 설치 후 `package.json`에는 테스트 명령이 저장되고 `package-lock.json`에는 설치된 버전 정보가 기록됩니다.

프로젝트 루트에 `jest.config.cjs` 파일을 만들고 다음 설정을 저장합니다.

```js
module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.js"],
  clearMocks: true,
};
```

## 3. 게임 로직을 분리해 테스트하기

현재 게임 로직은 `index.html`의 즉시 실행 함수 안에 있어 Jest에서 직접 가져올 수 없습니다. 예를 들어 회전 계산 같은 순수 로직을 `src/game-logic.js`로 옮기고, 브라우저에서는 전역 객체로, Jest에서는 CommonJS 내보내기로 접근하게 할 수 있습니다.

`src/game-logic.js` 예시:

```js
function rotateMatrix(matrix, direction) {
  const height = matrix.length;
  const width = matrix[0].length;
  const rotated = Array.from({ length: width }, () => Array(height).fill(0));

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (direction > 0) rotated[col][height - 1 - row] = matrix[row][col];
      else rotated[width - 1 - col][row] = matrix[row][col];
    }
  }

  return rotated;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { rotateMatrix };
} else {
  window.TetrisLogic = { rotateMatrix };
}
```

기존 `index.html`에서는 이 파일을 기존 인라인 스크립트보다 먼저 불러오고, IIFE 안에서 `const { rotateMatrix } = window.TetrisLogic;`를 사용합니다. 기존 인라인 스크립트에 있던 `rotateMatrix` 함수 정의는 제거해 중복을 피합니다.

```html
<script src="./src/game-logic.js"></script>
<script>
  // 기존 게임 스크립트
</script>
```

`tests/game-logic.test.js`에 테스트 파일을 만들면 Jest가 검색합니다.

```js
const { rotateMatrix } = require("../src/game-logic");

describe("rotateMatrix", () => {
  test("시계 방향으로 회전한다", () => {
    expect(rotateMatrix([[1, 0], [1, 1]], 1)).toEqual([[1, 1], [1, 0]]);
  });

  test("반시계 방향으로 회전한다", () => {
    expect(rotateMatrix([[1, 0], [1, 1]], -1)).toEqual([[0, 1], [1, 1]]);
  });
});
```

## 4. 테스트 실행

프로젝트 루트에서 전체 테스트를 실행합니다.

```bash
npm test
```

테스트 파일을 감시하며 수정할 때마다 다시 실행하려면 다음 명령을 사용합니다.

```bash
npm test -- --watch
```

`jsdom`은 DOM API를 흉내 내는 환경입니다. 실제 화면 배치, Canvas 그리기, 오디오 재생은 검증하지 않으므로 그런 동작에는 브라우저에서 실행하는 별도 테스트가 필요합니다. Jest 단위 테스트에서는 게임 규칙, 점수 계산, 블록 회전처럼 입력과 결과를 비교할 수 있는 로직부터 검증하는 것이 좋습니다.

## 참고 자료

- [Node.js 공식 다운로드](https://nodejs.org/en/download)
- [nvm for POSIX](https://github.com/nvm-sh/nvm)
- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [Jest jsdom 환경](https://jestjs.io/docs/configuration#testenvironment-string)
