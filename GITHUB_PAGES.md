# GitHub Pages 배포 안내

현재 앱은 `index.html` 하나에 HTML, CSS, JavaScript가 포함된 정적 웹 앱입니다. 빌드 도구나 패키지 설치 없이 GitHub Pages에서 바로 배포할 수 있습니다. 아래 절차는 WSL Ubuntu 터미널을 기준으로 합니다.

## 1. 앱을 `~/work/tetris`로 복사

WSL Ubuntu에서 실행합니다. 현재 프로젝트의 `index.html`을 복사하면 게임 화면과 필요한 코드가 함께 이동합니다.

```bash
mkdir -p ~/work/tetris
cp /root/work/kosa-ict-genai-2026-hyundai/src/exercise/knowmetoowell/day12/tetris/index.html ~/work/tetris/
cd ~/work/tetris
```

복사됐는지 확인합니다.

```bash
ls -la
```

목록에 `index.html`이 있어야 합니다. `~/work/tetris`는 새 저장소로 사용할 폴더이므로, 기존 파일이나 Git 저장소가 있다면 먼저 내용을 확인하고 진행하세요.

## 2. GitHub SSH 인증 준비

기존 SSH 공개 키가 있는지 확인합니다.

```bash
ls ~/.ssh/id_ed25519.pub
```

파일이 없다면 키를 만듭니다. 이메일은 GitHub 계정에 등록한 주소로 바꿉니다.

```bash
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

공개 키를 출력합니다.

```bash
cat ~/.ssh/id_ed25519.pub
```

GitHub에서 **Settings → SSH and GPG keys → New SSH key**로 이동해 출력된 공개 키를 등록합니다. 공개 키 파일인 `id_ed25519.pub`만 등록하세요. 개인 키인 `id_ed25519`는 공유하거나 업로드하지 않습니다.

연결을 확인합니다.

```bash
ssh -T git@github.com
```

처음 연결할 때 GitHub 호스트 지문을 확인하라는 질문이 나오면 안내된 지문을 확인한 후 `yes`를 입력합니다. 성공하면 `Hi knowmetoowell!`로 시작하는 인증 메시지가 표시됩니다. GitHub는 셸 접속을 제공하지 않으므로 이 확인 명령의 종료 코드가 1이어도 해당 인증 메시지가 나오면 정상입니다.

## 3. GitHub 저장소 만들기

GitHub에 `knowmetoowell` 계정으로 로그인한 뒤 새 저장소를 만듭니다.

- Repository name: `tetris`
- GitHub Free에서 Pages를 사용하려면 저장소 공개 범위를 **Public**으로 선택합니다.
- 로컬 파일을 처음 올리는 절차이므로 README, `.gitignore`, License를 생성하는 옵션은 선택하지 않습니다.

## 4. 앱을 SSH 저장소에 연결하고 업로드

WSL Ubuntu에서 복사한 폴더로 이동해 Git 저장소를 초기화하고, 커밋 작성자 정보를 이 저장소에 등록한 뒤 `main` 브랜치에 업로드합니다. 이메일은 GitHub에 등록한 주소를 사용합니다.

```bash
cd ~/work/tetris
git init -b main
git config user.name "knowmetoowell"
git config user.email "your_email@example.com"
git add index.html
git commit -m "Initial Tetris app"
git remote add origin git@github.com:knowmetoowell/tetris.git
git push -u origin main
```

원격 주소가 SSH 형식인지 확인할 수 있습니다.

```bash
git remote -v
```

출력 주소가 `git@github.com:knowmetoowell/tetris.git`인지 확인합니다.

## 5. GitHub Pages 켜기

GitHub의 `knowmetoowell/tetris` 저장소에서 다음을 설정합니다.

1. **Settings → Pages**를 엽니다.
2. **Build and deployment**의 Source를 **Deploy from a branch**로 선택합니다.
3. Branch에서 `main`, 폴더에서 `/(root)`를 선택하고 **Save**를 누릅니다.
4. 배포가 끝나면 Pages 화면에 표시되는 주소를 엽니다. 주소는 `https://knowmetoowell.github.io/tetris/`입니다.

배포가 완료될 때까지 잠시 기다립니다. 진행 상태는 저장소의 **Actions** 탭에서도 확인할 수 있습니다. 앱 파일은 저장소 최상위의 `index.html`이므로 별도의 빌드 명령은 필요하지 않습니다.

## 이후 앱 업데이트

`~/work/tetris/index.html`을 수정한 다음 변경 사항을 커밋하고 푸시합니다.

```bash
cd ~/work/tetris
git add index.html
git commit -m "Update Tetris app"
git push
```

Pages가 새 커밋을 배포하면 같은 URL에서 업데이트된 앱을 볼 수 있습니다.
