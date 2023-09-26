/* [S] CustomStyle */
export function setCustomStyle(style, id) {
    let styleElement = document.createElement("style");
    styleElement.setAttribute("id", id);
    styleElement.innerHTML = style;
    document.body.appendChild(styleElement);
}

export function removeCustomStyle(id) {
    const target = document.querySelector("style#" + id);
    if(target) target.remove();
}
/* [E] CustomStyle */

export function clone(target) { // 오브벡트 복제
    return JSON.parse(JSON.stringify(target));
}

export function getUrlParams() { // URL Parameter 받아오기
    let str = window.location.search;
    let objURL = {};

    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
}

export function setUrlParam(param) {
    if(param) {
        let search = window.location.search;
        let url = '';
        let objURL = {};
        search.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) {
                objURL[$1] = $3;
            }
        );

        if(param.value) {
            objURL[param.key] = param.value;
        } else {
            delete objURL[param.key];
        }
        
        Object.entries(objURL).forEach((item, index) => {
            if(index === 0) {
                url += `?${item[0]}=${item[1]}`;
            } else {
                url += `&${item[0]}=${item[1]}`;
            }
        });

        window.history.replaceState(null, null, url);
    }
}

export function searchToObject() { // location.search => Object
    let pairs = window.location.search.substring(1).split("&"),
      obj = {},
      pair,
      i;
  
    for ( i in pairs ) {
      if ( pairs[i] === "" ) continue;
  
      pair = pairs[i].split("=");
      obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
    }
  
    return obj;
}

export function isIOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

export function isApp() {
	return /SalesforceMobileSDK/i.test(navigator.userAgent);
}

export function arraySortWithUnit(data) {
    let charList = [];
    if(data.length > 0){
        let arr  = data.map(function (x) { 
            let element = {num : x.replace(/[^0-9.]/g, ""), unit : x.replace(/[0-9.]/g, "")};
            return element;
        });

        let numberSort = arr.sort((a,b) => { return a.num - b.num });
        numberSort.sort((a, b) => {
            if(a.unit < b.unit) return -1;
            if(a.unit > b.unit) return 1;
            return 0;
        });

        charList = numberSort.map(function (x) { 
            return (x.num + x.unit);
        });
    }else{
        charList = '-';
    }
    return charList;
}

// 커스텀 Alert 모달
export function alert(title, params = {
    // txt : 제목 밑에 들어가는 부가 설명 문구
    // btn : '확인' 버튼의 글자를 바꾸고 싶을때 추가
}){
    if (!window._isOpenAlertModal) {
        window._isOpenAlertModal = true;
        return new Promise((resolve) => {
            let alertModal = document.createElement("aside");
            alertModal.classList.add("alert-modal");
            alertModal.innerHTML = `
                <div class="alert-container">
                    <style>${alertConfirmStyle}</style>
                    <div class="alert-body">
                        <h5 class='ca-title'>${title}</h5>
                        ${params.txt ? "<p class='ca-txt'>" + params.txt + "</p>" : ""}
                    </div>
                    <div class="alert-bottom">
                        <button type="button" class="confirm">${
                            params.btn || commonCustomLabel.DE_LAB_0529 //'확인'
                        }</button>
                    </div>
                </div>`;
            document.body.appendChild(alertModal);
            
            setTimeout(function () {
                document.querySelector(".alert-modal").classList.add("active");
            }, 150);

            let alertButton = alertModal.querySelector("button");
            setTimeout(function () {
                alertButton.focus();
            }, 150);
            alertButton.addEventListener("click", () => {
                document
                    .querySelector(".alert-modal")
                    .classList.remove("active");
                setTimeout(function () {
                    document.querySelector(".alert-modal").remove();
                    window._isOpenAlertModal = false;
                    resolve();
                }, 350);
            });

            alertButton.addEventListener("focusout", (event) => {
                event.currentTarget.focus();
            });
            alertButton.addEventListener("keydown", (event) => {
                if (event.keyCode == 9) {
                    event.preventDefault();
                }
                if (event.keyCode == 27) {
                    document
                        .querySelector(".alert-modal")
                        .classList.remove("active");
                    setTimeout(function () {
                        document.querySelector(".alert-modal").remove();
                        window._isOpenAlertModal = false;
                        resolve();
                    }, 350);
                }
            });
        });
    }
}

// 커스텀 Confirm 모달
export function confirm(title, params = {
    /*
        txt : 제목 밑에 들어가는 부가 설명 문구
        btns : {
            confirm : '확인' 버튼의 글자를 바꾸고 싶을 때 추가
            cancel : '취소' 버튼의 글자를 바꾸고 싶을 때 추가
        }
        customElement : {
            html : 기본적으로 들어가는 요소 외 다른 html 요소를 추가 할 때
            position : 'top' => 모달 상단에 추가
                       'middle' => 모달 중간에 추가
                       'bottom' => 모달 하단에 추가
        }
        customStyle : 커스텀 css를 추가 할 때
    */
}) {
    if (!window._isOpenConfirmModal) {
        window._isOpenConfirmModal = true;
        return new Promise((resolve) => {
            let confirmModal = document.createElement("aside");
            confirmModal.classList.add("confirm-modal");
            confirmModal.innerHTML = `
                <div class="confirm-container">
                    <style>${alertConfirmStyle}</style>
                    <div class="confirm-body">
                        ${params.customElement ? params.customElement.position === 'top' ? params.customElement.html : '' : ''}
                        <h5 class="ca-title">${title}</h5>

                        ${params.customElement ? params.customElement.position === 'middle' ? params.customElement.html : '' : ''}

                        ${params.txt ? "<p class='ca-txt'>" + params.txt + "</p>" : ""}

                        ${params.customElement ? (params.customElement.position === 'bottom' || !params.customElement.position) ? params.customElement.html : '' : ''}

                        <style>${params.customStyle|| ''}</style>
                    </div>
                    <div class="confirm-bottom">
                        <button type="button" class="cancel">
                            ${
                                params.btns
                                    ? params.btns.cancel || commonCustomLabel.DE_LAB_0217// '취소'
                                    : commonCustomLabel.DE_LAB_0217 //'취소'
                            }
                        </button>
                        <button type="button" class="confirm">
                            ${
                                params.btns
                                    ? params.btns.confirm || commonCustomLabel.DE_LAB_0529 //'확인'
                                    : commonCustomLabel.DE_LAB_0529 // '확인'
                            }
                        </button>
                    </div>
                </div>`;
            document.body.appendChild(confirmModal);
            setTimeout(function () {
                document
                    .querySelector(".confirm-modal")
                    .classList.add("active");
            }, 150);

            let buttons = confirmModal.querySelectorAll(
                ".confirm-bottom > button"
            );
            setTimeout(function () {
                buttons[0].focus();
            }, 150);
            buttons.forEach((item, idx) => {
                let isConfirm = item.classList.contains("confirm");
                item.addEventListener("click", () => {
                    setResolve(isConfirm);
                });

                item.addEventListener("keydown", (event) => {
                    if (idx === 0) {
                        if (event.shiftKey && event.keyCode == 9) {
                            buttons[1].focus();
                        }
                    }
                    if (idx === buttons.length - 1) {
                        if (!event.shiftKey && event.keyCode == 9) {
                            buttons[0].focus();
                        }
                    }

                    if (event.keyCode == 27) {
                        setResolve(false);
                    }
                });
            });

            function setResolve(bool) {
                document
                    .querySelector(".confirm-modal")
                    .classList.remove("active");

                setTimeout(function () {
                    document.querySelector(".confirm-modal").remove();
                    window._isOpenConfirmModal = false;
                    resolve(bool);
                }, 350);
            }
        });
    }
}

const alertConfirmStyle = `
    .alert-modal, .confirm-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        padding: 20px 0;
        z-index: 999999;
    }
    .alert-modal .alert-container, .confirm-modal .confirm-container {
        background-color: white;
        width: 500px;
        max-width: calc(100% - 40px);
        max-height: 100%;
        text-align: center;
        overflow-y: auto;
        opacity: 0;
        transform: scale(0.85);
        transition: all 0.25s;
    }
    .alert-modal.active .alert-container, 
    .confirm-modal.active .confirm-container {
        opacity: 1;
        transform: none;
    }
    .alert-modal .alert-body, .confirm-modal .confirm-body {
        min-height: 220px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }
    .alert-modal .alert-body > .ca-title, .confirm-modal .confirm-body > .ca-title {
        color: #333;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: -0.05em;
        line-height: 1.5;
        max-width: 100%;
        word-break: keep-all !important;
    }
    .alert-modal .alert-body > .ca-txt, .confirm-modal .confirm-body > .ca-txt {
        color: #333;
        margin-top: 10px;
        font-size: 16px;
        font-weight: 300;
        letter-spacing: -0.05em;
        line-height: 1.78;
        word-break: keep-all !important;
    }
    .alert-modal .alert-bottom, .confirm-modal .confirm-bottom {
        display: flex;
        overflow: hidden;
        border-top: 1px solid #ddd;
    }
    .alert-modal .alert-bottom > button, 
    .confirm-modal .confirm-bottom > button {
        width: 50%;
        height: 70px;
        background-color: white;
        color: #333;
        font-size: 16px;
        font-weight: bold;
        line-height: normal;
        letter-spacing: -0.05em;
        border: 0;
        outline: none;
        position: relative;
    }
    .alert-modal .alert-bottom > button {
        width: 100%;
    }
    .alert-modal .alert-bottom > button.cancel, 
    .confirm-modal .confirm-bottom > button.cancel {
        color: #A8A8A8;
        font-weight: 300; 
    }
    .confirm-modal .confirm-bottom > button + button::before {
        content: '';
        width: 1px;
        height: 24px;
        background-color: #ddd;
        display: block;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -12px;
    }

    @media all and (max-width: 1023px) {
        .alert-modal .alert-container, .confirm-modal .confirm-container {
            width: 350px;
        }
        .alert-modal .alert-body, .confirm-modal .confirm-body {
            min-height: unset;
            padding: 40px 30px;
        }
        .alert-modal .alert-body > .ca-title, .confirm-modal .confirm-body > .ca-title {
            font-size: 20px;
        }
        .alert-modal .alert-body > .ca-txt, .confirm-modal .confirm-body > .ca-txt {
            font-size: 14px;
        }
        .alert-modal .alert-bottom > button, .confirm-modal .confirm-bottom > button {
            height: 60px;
        }
    }
`;

// 쿠키 생성
export function setStorage(name, value) {
    return new Promise(resolve => {
        localStorage.setItem(name, value);

        resolve();
    });
}
export function setCookie(name, value, exp) {
    return new Promise(resolve => {
        var date = new Date();
        if (exp) {
            date.setTime(date.getTime() + exp*24*60*60*1000);
            document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
        } else {
            date.setTime(date.getTime() + 36500*24*60*60*1000);
            document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
        }

        resolve();
    });
}

// 쿠키 가져오기
export function getStorage(name) {
    return localStorage.getItem(name);
}
export function getCookie(name) {
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');      
    return value? value[2] : null;
}

// 쿠키 삭제
export function deleteStorage(name) {
    return new Promise(resolve => {
        localStorage.removeItem(name);

        resolve();
    });
}

export function deleteCookie(name) {      
    return new Promise(resolve => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 2000 00:00:10 GMT; path=/`;
        resolve();
    });
}

// 휴대폰 번호 정규식
const phoneRegExp = /^[0-9]{3,4}[0-9]{4}$/;
// 이메일 정규식
const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]/i;
// 문자 정규식(특수문자, 숫자 제외)
const nameRegExp = /^[a-z|A-Z|가-힣]+$/g;
// 숫자 정규식
const numberRegExp = /^[0-9]+$/g;
// 번호 정규식 (괄포 포함)
const companyNumRegExp = /^[0-9\(\)\W|\s]+$/g;
// 특수문자 정규식
const sCharRegExp = /^[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/gi;
// 특수문자 정규식 (괄호 제외)
const sCharBracketRegExp = /^[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/gi;

export {
    phoneRegExp,
    emailRegExp,
    nameRegExp,
    numberRegExp,
    companyNumRegExp,
    sCharRegExp,
    sCharBracketRegExp
}


/* [ Navigation Example : 대상 ] */

import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';
import currentLanguage from '@salesforce/i18n/lang';

// 매개변수 (this 객체, 메뉴/사이트 이름, Record ID/undefined, URL Parameter)
// state : { id: 0010w00000zk6OFAAY } 객체 형태로 매개변수를 받아옴
// 페이지 네비게이션 공통 함수
const defaultNavigation = (_this, menu, recordId, state, url, reload) => {
    if (menu === 'login') {
        console.log("login util navigation")
        // window.location.href = 'https://daesang--sit.sandbox.my.site.com/s/login';
        _this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: {
                actionName: 'login'
            }
        });
    // } else if (window.location.pathname.indexOf('login') > 0 || menu === 'register' || menu === 'forgotPassword') {
    } else if (window.location.pathname.indexOf('login') > 0) {
        loginToCustomPage(menu, state);
    } else {
        var categoryList = ['industry','product','trend','archive','order','meeting','notice'];
        var category = '';

        for (let i = 0; i < categoryList.length; i++) {
            if (menu.indexOf(categoryList[i]) > -1) {
                category = menu;
            }
        }
        var actionName = 'list';
    
        if (menu.indexOf('Detail') >= 0) actionName = 'detail';
        else if (menu.indexOf('Edit') >= 0) actionName = 'edit';
        else actionName = 'list';
    
        if (category) {
            if (recordId) recordNavigation(_this, pageNames[menu], recordId, state);
            else objectNavigation(_this, pageNames[menu], actionName, state);
        } else {
            commonNavigation(_this, pageNames[menu], state, reload?false:true);
        }
    }
}

// 기본 제공 페이지 함수
const commonNavigation = (_this, apiName, stateData, reload) => {
    if (apiName === 'Search__c') {
        _this[NavigationMixin.Navigate]({
            type: 'standard__search',
            attributes: {
                name: apiName
            },
            state: stateData
        });
    } else {
        _this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: apiName
            },
            state: stateData
        }, reload);
    }
}

// 커스텀 페이지 함수
const recordNavigation = (_this, objectApiName, recordId, state) => {
    _this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            // recordId: 'a005g0000348J0NAAU',
            // objectApiName: 'IndustryMaster__c',
            // actionName: 'view'
            recordId: recordId,
            objectApiName: objectApiName,
            actionName: 'view'
        },
        state: state
    });
}

// 외부 페이지 링크 함수
const externalNavigation = (_this, url) => {
    _this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            // url: '/industrymaster/'+'a005g0000348J0NAAU' or https://www.naver.com
            url: url,
        }
    });
}

// 오브젝트 페이지 함수
const objectNavigation = (_this, objectApiName, actionName, state) => {
    _this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            // objectApiName: 'IndustryMaster__c',
            // actionName: 'list'
            objectApiName: objectApiName,
            actionName: actionName,
        },
        state: state
    });
}

// 로그인 페이지에서 다른 페이지로 이동할 때
const loginToCustomPage = (url, state) => {
    let tempBase = '';
    let urlSplit = url.split('/')[1];
    console.log(urlSplit, " : urlSPlit")
    if (basePath[basePath.length-1] !== '/') tempBase = basePath + '/';
    else tempBase = basePath;

    let path = tempBase.split('login');
    
    let param = '';
    let searchKeyword = '';
    let language = currentLanguage.replaceAll('-', '_');
    if (state) {
        let cnt = 0;
        for (const [key, value] of Object.entries(state)) {
            if (key === 'term') {
                searchKeyword = value;
            } else {
                if (cnt === 0) param += `?${key}=${value}`;
                else param += `&${key}=${value}`;
                cnt++;
            }
        }
        if (!state.language && cnt > 0) param += `&language=${language}`;
        else param += `?language=${language}`;
    }
    // console.log(path[0], " : path[0]", url, " : url")
    console.log(param, " : param")
    for (let key in loginUrlName) {
        if (key === url) {
            // console.log(path[0] + loginUrlName[key] + (searchKeyword?'/'+searchKeyword:'') + param, " : path[0] + loginUrlName[key] + (searchKeyword?'/'+searchKeyword:'') + param")
            console.log(path[0] + loginUrlName[key] + (searchKeyword?'/'+searchKeyword:'') + param,  " : true");
            return window.location.href = path[0] + loginUrlName[key] + (searchKeyword?'/'+searchKeyword:'') + param;
        } else if (key === urlSplit) {
            console.log(path[0] + url.substring(1, url.length) + (searchKeyword?'/'+searchKeyword:'') + param,  " : path[0] + url.substring(1, url.length) + (searchKeyword?'/'+searchKeyword:'') + param")
            return window.location.href = path[0] + url.substring(1, url.length) + (searchKeyword?'/'+searchKeyword:'') + param;
        }
    }
}

const pageNames = {
    home: 'Home',                                           // 홈
    industryList: 'Industry__c',                            // 업종(목록)                
    industryDetail: 'Industry__c',                          // 업종(상세)              
    productGruopList: 'ChannelProductGroup__c',             // 제품군(목록)                          
    productGroupDetail: 'ChannelProductGroup__c',           // 제품군(상세)
    productDetail: 'ChannelProduct__c',                     // 제품(상세)
    support: 'Support__c',                                  // 고객지원
    faq: 'FAQ__c',                                          // FAQ
    cncNew: 'CnCNew__c',                                    // C&C 문의
    inquiryNew: 'InquiryNew__c',                            // 고객문의
    trendList: 'Trend__c',                                  // 트렌드(목록)
    trendDetail: 'Trend__c',                                // 트렌트(상세)
    archiveList: 'Archive__c',                              // 자료실(목록)
    archiveDetail: 'Archive__c',                            // 자료실(상세)
    mypage: 'MyPage__c',                                    // 마이페이지
    profile: 'Profile__c',                                  // My 계정관리
    withdraw: 'Withdraw__c',                                // 회원탈퇴
    orderList: 'Order__c',                                  // 주문(목록)
    orderDetail: 'Order__c',                                // 주문(상세)
    cncList: 'CnCList__c',                                  // C&C(목록)
    cncDetail: 'CnCDetail__c',                              // C&C(상세)
    cncEdit: 'CnCEdit__c',                                  // C&C(편집)
    inquiryList: 'InquiryList__c',                          // Q&A(목록)
    inquiryDetail: 'InquiryDetail__c',                      // Q&A(상세)
    inquiryEdit: 'InquiryEdit__c',                          // Q&A(편집)
    bookmark: 'BookmarkList__c',                            // 북마크
    meetingList: 'Meeting__c',                              // 미팅(목록)
    meetingDetail: 'Meeting__c',                            // 미팅(상세)
    download: 'DownloadList__c',                            // 다운로드
    chatter: 'Chatter__c',                                  // 채터
    tradlinx: 'Tradlinx__c',                                // Tradlinx
    login: 'Login',                                         // 로그인
    forgotPassword: 'FindPassword__c',                      // 비밀번호 찾기
    register: 'DirectRegister__c',                          // 직접 회원가입
    inviteRegister: 'InviteRegister__c',                    // 초대 회원가입
    newPassword: 'NewPassword__c',                          // 비밀번호 설정
    // noticeList: 'Notice_List__c',                           // 공지사항(목록)
    noticeList: 'Notice__c',                                // 공지사항(목록)
    noticeDetail: 'Notice__c',                              // 공지사항(상세)
    policy: 'Policy__c',                                    // 정책
    search: 'Search__c',                                    // 통합검색
    searchProduct: 'SearchProduct__c',                      // 제품검색
    error: 'Error',                                         // 에러
}

const loginUrlName = {
    home: '',
    register: 'register',
    noticeList: 'notice/Notice__c/Default',
    inquiryNew: 'support/inquiry',
    Industry__c: 'industry/Industry__c/Default',
    forgotPassword: 'findpassword',
    ChannelProductGroup__c: 'channelproductgroup/ChannelProductGroup__c/Default',
    Trend__c: 'trend/Trend__c/Default',
    Archive__c: 'archive/Archive__c/Default',
    searchProduct: 'searchproduct',
    search: 'global-search',
    policy: 'policy',
    channelproductgroup: 'channelproductgroup',
    industry: 'industry',
    support: 'support',
}

export { 
    defaultNavigation,
    commonNavigation,
    recordNavigation,
    objectNavigation,
    externalNavigation,
}