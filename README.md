![Frame_5_4](https://github.com/HypeBBoy/backend/assets/86117661/2b3d284d-3e98-44ae-9267-dfe655ebd184)  

유튜브 API를 통해 제목, 해시태그와 함께 자신만의 플레이리스트를 등록하고,  
찜한 플레이리스트를 재생할 수 있는 서비스

## 1️⃣ 프로젝트 기간

2023.06 ~ 2023.08

## 2️⃣ 서비스 화면

### 메인페이지

![image](https://github.com/HypeBBoy/backend/assets/86117661/1f52ed46-b895-47e9-8619-bce1b0c9da49)

### 비로그인 시 구글로그인

![image](https://github.com/HypeBBoy/backend/assets/86117661/fc6779fb-455f-48f0-a0dc-7a9bcbdbd225)

### 플리 등록페이지, 수정페이지

![image](https://github.com/HypeBBoy/backend/assets/86117661/8eb14c2d-d1f0-4941-8f6c-6144d170313d)

### 플리 등록페이지 (노래검색)

![image](https://github.com/HypeBBoy/backend/assets/86117661/cea7123d-7a52-4efd-9610-079e85e2d9cc)

### 플레이리스트 상세페이지

![image](https://github.com/HypeBBoy/backend/assets/86117661/9e8afbe6-e02f-4e0f-bd2f-e77be97e311f)

### 마이페이지

![image](https://github.com/HypeBBoy/backend/assets/86117661/34df23e1-f766-49e7-91d2-9ecf3bc90853)

### 찜한플리 페이지

![image](https://github.com/HypeBBoy/backend/assets/86117661/47d68959-c04b-44f6-a32d-5e984952dcb2)

### 등록한플리 페이지
![image](https://github.com/HypeBBoy/backend/assets/86117661/749b2499-ca8e-49d5-b0b3-21f4cbe95c9b)


## 3️⃣ **Service Architecture**

<img width="1000" alt="Frame" src="https://github.com/HypeBBoy/backend/assets/86117661/e032e300-620d-4229-9f01-68f59b901687">

## 4️⃣ Trouble Shooting

### issue 1

### 🤔 situation

- passport를 이용하여 google login oauth2.0을 구현하였는데, 정상적으로 잘 작동하는듯 했으나 알 수 없는 오류가 발생
- passport 모듈이 로그인 과정을 알아서 처리해주었기 때문에 어디서 오류가 발생했는지 알기가 어려움

### 😙 solution

- passport를 사용하지 않고 직접 axios를 통해 google과 통신을 하여 로그인 과정을 처리함

## 5️⃣ Members

![image](https://github.com/HypeBBoy/backend/assets/86117661/9a8e4922-c66b-4e34-beff-1c823621ae9b)

