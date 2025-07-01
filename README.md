# DEMO LINK
[🎮 Live Demo](http://dragon-samurai-z-env.eba-bdb4qx2n.ap-southeast-1.elasticbeanstalk.com/)

# 🐉 용사 가위바위보 게임

React + Tailwind CSS + Node.js(Express) + Socket.IO로 구성된 실시간 가위바위보 게임입니다.

## 🎮 게임 특징

- **실시간 매칭**: Socket.IO를 통한 실시간 플레이어 매칭
- **반응형 UI**: Tailwind CSS로 구현된 모던한 디자인
- **타임아웃 시스템**: 10초 내 선택하지 않으면 자동 패배
- **랜덤 닉네임**: 닉네임을 입력하지 않으면 자동 생성


## 🏗️ 프로젝트 구조

```
Dragon SamuraiZ/
├── client/                 # React 클라이언트
│   ├── build/              # React 빌드 결과물
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   └── App.js         # 메인 앱 컴포넌트
│   └── package.json
├── server/                 # Express + Socket.IO 서버
│   ├── server.js          # 메인 서버 파일
│   └── package.json       # start 스크립트만 정의
└── package.json           # 루트 package.json (의존성 관리)
```

## 🚀 로컬 개발

### 필수 요구사항
- Node.js 18.0.0 이상
- npm

### 설치 및 실행

1. **의존성 설치 (개별 설치)**:
```bash
npm install          # 루트 의존성
cd client && npm install  # 클라이언트 의존성
cd ../server && npm install  # 서버 의존성
```

2. **개발 서버 실행**:
```bash
# 터미널 2개를 사용하거나, 각각 실행하세요.
cd server && npm start   # Express 서버 (포트 3001)
cd client && npm start   # React 개발 서버 (포트 3000)
```

## 🌐 AWS Elastic Beanstalk 배포

### 배포 준비

1. **AWS CLI 설치 및 설정**
2. **EB CLI 설치**:
```bash
npm install -g aws-elasticbeanstalk-cli
```

### 빌드 및 배포

1. **React 앱 빌드**
```bash
npm run build
```

2. **EB 초기화 및 배포**
```bash
eb init
eb create dragon-samurai-rps-env
eb deploy
```

### 배포 후 확인

배포가 완료되면 EB에서 제공하는 URL로 접속하여 게임을 확인할 수 있습니다.

**환경변수 참고**: 별도의 환경변수 파일이 없어도 기본값으로 동작합니다. EB 환경에서 필요하다면 EB 환경변수로만 세팅하세요.

## 🔧 기술 스택

### Frontend
- **React 18**: UI 프레임워크
- **Tailwind CSS**: 스타일링
- **Socket.IO Client**: 실시간 통신

### Backend
- **Node.js**: 런타임 환경
- **Express**: 웹 서버 프레임워크
- **Socket.IO**: 실시간 통신
- **CORS**: 크로스 오리진 리소스 공유

## 🎯 게임 플레이

### 1. 홈 화면
- 닉네임 입력 (선택사항)
- "게임 시작" 버튼 클릭

### 2. 매칭 대기
- 상대방을 찾는 동안 대기
- 자동으로 매칭되면 게임 화면으로 전환

### 3. 게임 화면
- React로 구현된 게임 인터페이스
- 가위/바위/보 중 하나 선택
- 10초 타이머
- 상대방 선택 상태 표시

### 4. 결과 화면
- 승/패/무승부 결과 표시
- 각자의 선택 확인
- "다시 매칭" 또는 "홈으로" 버튼

## 🎯 게임 규칙

- 가위바위보 기본 규칙 적용
- 10초 제한 시간
- 자동 매칭 시스템
- 실시간 결과 전송

## 🔄 개발 워크플로우

1. 로컬에서 개발 및 테스트
2. Git에 커밋
3. EB CLI로 배포
4. 프로덕션 환경에서 테스트

## 🐛 문제 해결

### 포트 충돌
- EB에서는 반드시 `process.env.PORT` 사용 (EB 환경에서만 필요)
- 기본 포트: 8080 (EB), 3001 (로컬)

### EB 로그 확인
```bash
eb logs
```

### 빌드 오류
1. **CSS 문법 오류**
   ```bash
   # 캐시 클리어
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 📞 지원

문제가 발생하거나 개선 사항이 있으면 이슈를 등록해 주세요.

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**즐거운 게임 되세요! 🎮** 
