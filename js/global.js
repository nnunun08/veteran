window.addEventListener("DOMContentLoaded", function(){
    /* IE 판별 */
    var agent = navigator.userAgent.toLowerCase();
    if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
      document.body.classList.add('IE');
    }

    function setBodyFontSize() {
        let winWidth = window.innerWidth;
        if(winWidth <= 720) {
            window.document.body.style.fontSize = winWidth / 45 + 'px';
            window.document.documentElement.style.fontSize = winWidth / 45 + 'px';
        } else {
            window.document.body.style.fontSize = '16px';
            window.document.documentElement.style.fontSize = '16px';
        }
    }

    window.addEventListener('load', () => {
        setBodyFontSize();
    });
    window.addEventListener('resize', () => {
        setTimeout(function(){
            setBodyFontSize();
        }, 100);
    });

    const dateInputs = document.querySelectorAll('.input[type="date"]');
    if(dateInputs) {
      dateInputs.forEach(item => {
        item?.addEventListener('change', (e) => {
          item.parentNode.querySelector('.date-output').innerHTML = e.target.value;
        });
      });
    }
    
      const tabs = document.querySelectorAll('[role="tab"]');
      const tabList = document.querySelector('[role="tablist"]');
    
      // 탭
      if(tabs) {
        tabs.forEach(function(tab) {
          tab.addEventListener("click", changeTabs);
        });
      }
    
      let tabFocus = 0;
      
      if(tabList) {
        tabList.addEventListener("keydown", function(e) {
          // Move right
          if (e.keyCode === 39 || e.keyCode === 37) {
            tabs[tabFocus].setAttribute("tabindex", -1);
            if (e.keyCode === 39) {
              tabFocus++;
              if (tabFocus >= tabs.length) {
                tabFocus = 0;
              }
              // Move left
            } else if (e.keyCode === 37) {
              tabFocus--;
              if (tabFocus < 0) {
                tabFocus = tabs.length - 1;
              }
            }
      
            tabs[tabFocus].setAttribute("tabindex", 0);
            tabs[tabFocus].focus();
          }
        });
      }
      
      function changeTabs(e) {
        const target = e.currentTarget;
        const parent = target.parentNode;
        const grandparent = parent.parentNode;
      
        parent
          .querySelectorAll('[aria-selected="true"]')
          .forEach(function(t) {t.setAttribute("aria-selected", false)});
      
        target.setAttribute("aria-selected", true);
      
        grandparent.parentNode
          .querySelectorAll('[role="tabpanel"]')
          .forEach(function(p) {p.setAttribute("hidden", true)});
      
        grandparent.parentNode
          .querySelector('#' + target.getAttribute("aria-controls"))
          .removeAttribute("hidden");
      }
  
        /* Side Menu */
        let mMenuBtn = document.querySelector('.m-menu-btn');
        let mMenuClose = document.querySelector('.m-menu-close');
        let mSideMenu = document.querySelector('.side-menu__wrap');
        mMenuBtn?.addEventListener('click', function() {
            toggleSideMenu();
        });
        mMenuClose?.addEventListener('click', function() {
            toggleSideMenu();
        });


        function toggleSideMenu() {
          let isActive = mSideMenu.classList.contains('active');
          if(isActive) {
            mSideMenu.classList.remove('active');
            mMenuBtn.classList.remove('close-btn');
            document.body.classList.remove('y-hidden');
          } else {
            mSideMenu.classList.add('active');
            mMenuBtn.classList.add('close-btn');
            document.body.classList.add('y-hidden');
          }
        }
  
        /* Accordion */
        let accordion = document.querySelectorAll('.accordion');
        for(let i=0; i<accordion.length; i++) {
          accordion[i]?.addEventListener('click', function(e) {
            let isActive = e.currentTarget.classList.contains('active');
            if(isActive) {
              e.currentTarget.classList.remove('active');
            } else {
              e.currentTarget.classList.add('active');
            }
          });
        }
    });
  
  
    /* IE ==> forEach Polyfill */
    if ('NodeList' in window && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
        }
      };
    }
  

    /* 사이드 서브 메뉴 제어 (퍼블 임시) */
    function goSubMenu() {
        let closeBtn = document.querySelector('.side-menu__wrap .m-menu-close'),
            backBtn = document.querySelector('.side-menu__wrap .m-menu-close.back'),
            depth1List = document.querySelector('.side-menu__wrap .side-menu__nav.depth-1'),
            depth2List = document.querySelector('.side-menu__wrap .side-menu__nav.depth-2');

        closeBtn.setAttribute('hidden', true);
        depth1List.setAttribute('hidden', true);

        backBtn.removeAttribute('hidden');
        depth2List.removeAttribute('hidden');
    }

    function goMainMenu() {
        let closeBtn = document.querySelector('.side-menu__wrap .m-menu-close'),
            backBtn = document.querySelector('.side-menu__wrap .m-menu-close.back'),
            depth1List = document.querySelector('.side-menu__wrap .side-menu__nav.depth-1'),
            depth2List = document.querySelector('.side-menu__wrap .side-menu__nav.depth-2');

        backBtn.setAttribute('hidden', true);
        depth2List.setAttribute('hidden', true);

        closeBtn.removeAttribute('hidden');
        depth1List.removeAttribute('hidden');
    }