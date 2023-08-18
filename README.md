# wanted-pre-onboarding-backend
### 1. 지원자 성명
김정현
### 2. 애플리케이션 실행방법
.env
```c
DB_USER=
DB_NAME=
DB_PORT=
DB_PASSWORD=
DB_END_POINT=

NODE_ENV=

SECRET_KEY=

AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=

ECR_REGISTRY_URL=
ACCOUNT_ID=

LOCAL= true or false

MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=

PROD_DB_USER=
PROD_DB_NAME=
PROD_DB_PORT=
PROD_DB_END_POINT=
PROD_DB_PASSWORD=
```
아래 명령어를 통해 서버 준비
```c
npm install
npm run all:migrate
```
토큰의 쿠키 삽입을 로컬환경에서 테스트 하기 위해<br>
mkcert를 통해 localhost를 https로 적용<br>
쿠키삽입이 필요 없다면 바로 npm run start<br>
mac os 기준
```c
brew install mkcert
brew install nss
mkcert -install
```
window 기준<br>
https://brunch.co.kr/@devapril/49
<br>위 블로그 참고

mac os
```c
npm run cert
```

window
```c
npm run cert:window
```
추가적인 localhost외에 도메인 설정 참고 블로그<br>
https://blog.naver.com/substance99/223157286310

진행 후<br>
```c
npm run start
```

docker compose<br>
```c
docker compose up -d
```

test
```c
npm run test
```
### 3. 테이블 구조
<img width="902" alt="image" src="https://github.com/1005jh/wanted-pre-onboarding-backend/assets/113870221/da2a010d-40f4-494c-982c-8d7640480352">

### 4. api 영상 링크
https://youtu.be/h0OJLKtcAfQ
### 5. 구현 방법 및 이유
1. joi를 사용해 이메일과 패스워드의 유효성 검사를 했습니다. 이메일에 @ 포함, 패스워드 8자 이상만 유효성 검사를 해야 했기에 joi에 앞의 조건만 넣어주고 요청이 들어왔을 때 joi를 통해 유효성 검사를 하는 식으로 구현했습니다.
2. 로그인 같은 부분은 배포시 https를 진행한다는 점을 생각해 쿠키에 token을 삽입하는 로직으로 짰고 auth middleware 또한 쿠키를 체크하고 쿠키에 없을 시 헤더의 authorization을 통해 토큰을 가져와서 검증하는 방식으로 진행했습니다. 로컬에서의 테스트를 위해 로컬환경을 https로 적용했습니다.
3. node.js/express로 진행해야 했기에 mysql과 sequelize를 사용했고, 페이지네이션을 진행할 때 sequelize에서 지원하는 findAndCountAll를 통해 전체 갯수와 한 페이지에 보여지는 데이터양을 반환하도록 했습니다.
4. 게시글을 만들 때 user의 키값을 외래키로 저장해 작성자인지 판별할 수 있도록 했습니다.
5. 게시글 삭제와 같은 경우는 히스토리를 남기기 위해 enum을 사용해 구현했습니다.
<br>

### 6. api 명세서
<img width="595" alt="image" src="https://github.com/1005jh/wanted-pre-onboarding-backend/assets/113870221/39340126-5395-496e-94ed-eb96dd722cf2">
<img width="604" alt="image" src="https://github.com/1005jh/wanted-pre-onboarding-backend/assets/113870221/2e9cabc0-baf1-464f-8c8c-eeefeae85751">
<img width="592" alt="image" src="https://github.com/1005jh/wanted-pre-onboarding-backend/assets/113870221/3450208f-e3b9-497e-99ca-42f4c3e0b187">
<img width="595" alt="image" src="https://github.com/1005jh/wanted-pre-onboarding-backend/assets/113870221/de685dbe-fc78-4f7e-9a46-fa8e51815563">

link<br>
https://www.notion.so/5a8a7d9070c44ac4a932ca1ff2daeb1e?pvs=4

[API 명세서](%E1%84%86%E1%85%A7%E1%86%BC%E1%84%89%E1%85%A6%205a8a7d9070c44ac4a932ca1ff2daeb1e/API%20%E1%84%86%E1%85%A7%E1%86%BC%E1%84%89%E1%85%A6%E1%84%89%E1%85%A5%20a0c163ec6f014c02a146bc0b3637fe0c.csv)

### 7. 배포주소
https://rlawjdgus.shop
