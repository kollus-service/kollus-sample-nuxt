# Kollus-sample-nuxt

## 개요

> NuxtJS + Express 환경에서 콜러스와 연동할수 있는 샘플 소개   
> 연동 범위에 있어서 순차적으로 진행 예정.

## 사용법
> * 연동 및 인증 정보 설정
>  + /backned/auth/config.js
>  + Kollus 연동
>    - kollus.secretkey : 콜러스 보안키
>    - kollus.customkey : 콜러스 사용자키
>    - kollus.accesstoken : 콜러스 API 접근키
>   + MultiDrm 연동
>    - multidrm.siteid : 사이트 아이디
>    - multidrm.accesskey : 엑세스키
>    - multidrm.key : 사이트 키
> * 실행 방법
> ```shell
> npm run dev 
> ```

## 구현내용
> - [X] ~~Player URL 생성~~
> - [X] ~~Multidrm token 생성~~
> - [X] ~~VG controller 생성~~
 > - [ ] Query String 예시
 > - [ ] JWT Payload 예시
 > - [ ] Play Callback 예시 
 > - [ ] DRM Callback 예시
 > - [ ] LMS Callback 예시
 > - [ ] Bookmark 연동 예시
 > - [ ] Kollus CMS API 연동 예시
