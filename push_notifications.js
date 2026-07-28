/* Gaeo 아침 브리핑 웹 푸시
 * - 공개 App ID만 브라우저에서 사용합니다.
 * - 구독 주소 보관과 실제 발송은 OneSignal이 담당합니다.
 * - iPhone/iPad는 iOS 16.4+에서 홈 화면에 설치한 뒤 실행해야 알림을 허용할 수 있습니다.
 */
(function(){
  'use strict';

  const config=window.GAEO_PUSH_CONFIG||{};
  const appId=String(config.oneSignalAppId||'').trim();
  const buttons=()=>Array.from(document.querySelectorAll('[data-push-toggle]'));
  let sdk=null;
  let ready=false;
  let busy=false;

  function isIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  }
  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone===true;
  }
  function setButtons(label,state){
    buttons().forEach(button=>{
      button.textContent=label;
      button.dataset.pushState=state||'';
      button.disabled=state==='busy';
      button.setAttribute('aria-busy',state==='busy'?'true':'false');
    });
  }
  function track(name,params){
    if(typeof window.gaeoTrack==='function') window.gaeoTrack(name,params||{});
  }
  function modal(options){
    const previous=document.getElementById('pushPermissionModal');
    if(previous) previous.remove();
    const wrap=document.createElement('div');
    wrap.className='push-permission-modal';
    wrap.id='pushPermissionModal';
    wrap.setAttribute('role','dialog');
    wrap.setAttribute('aria-modal','true');
    wrap.setAttribute('aria-labelledby','pushPermissionTitle');
    wrap.innerHTML=
      '<div class="push-permission-card">'+
        '<button type="button" class="push-permission-close" aria-label="알림 안내 닫기">닫기</button>'+
        '<span class="push-permission-kicker">아침 브리핑 알림</span>'+
        '<h2 id="pushPermissionTitle">'+options.title+'</h2>'+
        '<p>'+options.body+'</p>'+
        '<div class="push-permission-note">'+
          '<b>보내는 시간</b><span>'+(config.morningTime||'평일 오전 8시 50분')+'</span>'+
          '<b>보내는 내용</b><span>오늘 시장 요약과 사이트 바로가기</span>'+
        '</div>'+
        '<div class="push-permission-actions">'+
          '<button type="button" class="push-permission-cancel">나중에</button>'+
          '<button type="button" class="push-permission-ok">'+options.action+'</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(wrap);
    const close=()=>wrap.remove();
    wrap.querySelector('.push-permission-close').onclick=close;
    wrap.querySelector('.push-permission-cancel').onclick=close;
    wrap.addEventListener('click',event=>{if(event.target===wrap) close();});
    wrap.querySelector('.push-permission-ok').onclick=()=>{close();options.onConfirm();};
    wrap.querySelector('.push-permission-ok').focus();
  }
  function openGuide(){
    track('select_content',{content_type:'notification_guide',item_id:'morning_push'});
    if(typeof window.openCommunityPost==='function') window.openCommunityPost(2);
  }
  function showUnavailable(){
    modal({
      title:'알림 연결을 준비하고 있어요',
      body:'알림 화면과 자동 발송 기능은 준비됐지만 알림 서버 연결값이 아직 등록되지 않았어요. 설치와 알림 설정 방법을 먼저 확인할 수 있어요.',
      action:'설정 방법 보기',
      onConfirm:openGuide
    });
  }
  function refreshState(){
    if(!ready||!sdk){
      setButtons(appId?'알림 확인 중':'아침 알림 준비 중',appId?'busy':'unavailable');
      return;
    }
    const optedIn=Boolean(sdk.User&&sdk.User.PushSubscription&&sdk.User.PushSubscription.optedIn);
    setButtons(optedIn?'아침 알림 켜짐':'아침 알림 받기',optedIn?'on':'off');
  }
  async function subscribe(){
    if(!sdk||busy) return;
    if(isIOS()&&!isStandalone()){
      modal({
        title:'아이폰에서는 설치가 먼저예요',
        body:'사파리에서 Gaeo를 홈 화면에 추가한 뒤, 홈 화면의 Gaeo 아이콘으로 다시 열어주세요. 그 안에서 알림을 켤 수 있어요.',
        action:'설치 방법 보기',
        onConfirm:openGuide
      });
      return;
    }
    modal({
      title:'아침 시장 요약을 받아볼까요?',
      body:'알림을 켜면 평일 아침에 한 번만 보내드려요. 원하지 않으면 언제든 프로필 메뉴에서 끌 수 있어요.',
      action:'알림 허용하기',
      onConfirm:async()=>{
        busy=true;setButtons('알림 허용 중','busy');
        track('push_permission_prompt',{source:'morning_briefing'});
        try{
          await sdk.User.PushSubscription.optIn();
          refreshState();
          const optedIn=Boolean(sdk.User.PushSubscription.optedIn);
          track('push_subscription_change',{status:optedIn?'subscribed':'not_subscribed'});
          if(!optedIn&&typeof Notification!=='undefined'&&Notification.permission==='denied') openGuide();
        }catch(error){
          console.warn('[Gaeo push] subscribe failed',error);
          setButtons('알림 설정 다시 시도','error');
          openGuide();
        }finally{busy=false;}
      }
    });
  }
  async function unsubscribe(){
    if(!sdk||busy) return;
    modal({
      title:'아침 알림을 끌까요?',
      body:'끄더라도 사이트와 관심종목은 그대로 이용할 수 있어요. 나중에 같은 버튼으로 다시 켤 수 있습니다.',
      action:'알림 끄기',
      onConfirm:async()=>{
        busy=true;setButtons('알림 해제 중','busy');
        try{
          await sdk.User.PushSubscription.optOut();
          track('push_subscription_change',{status:'unsubscribed'});
        }catch(error){
          console.warn('[Gaeo push] unsubscribe failed',error);
        }finally{busy=false;refreshState();}
      }
    });
  }
  function toggle(){
    if(!appId){showUnavailable();return;}
    if(!ready){setButtons('알림 확인 중','busy');return;}
    if(sdk.User.PushSubscription.optedIn) unsubscribe();
    else subscribe();
  }
  function bindButtons(){
    buttons().forEach(button=>button.addEventListener('click',toggle));
    refreshState();
  }
  function loadSDK(){
    if(!appId) return;
    window.OneSignalDeferred=window.OneSignalDeferred||[];
    window.OneSignalDeferred.push(async function(OneSignal){
      try{
        await OneSignal.init({
          appId:appId,
          serviceWorkerPath:'/push/onesignal/OneSignalSDKWorker.js',
          serviceWorkerParam:{scope:'/push/onesignal/'},
          notifyButton:{enable:false},
          welcomeNotification:{
            title:'Gaeo 아침 브리핑',
            message:'알림 설정이 완료됐어요. 평일 아침에 시장 요약을 보내드릴게요.'
          }
        });
        sdk=OneSignal;
        ready=true;
        OneSignal.User.PushSubscription.addEventListener('change',refreshState);
        OneSignal.Notifications.addEventListener('permissionChange',permission=>{
          track('push_permission_result',{permission:permission?'granted':'denied'});
          refreshState();
        });
        OneSignal.Notifications.addEventListener('click',()=>{
          track('push_notification_click',{content_type:'morning_briefing'});
        });
        refreshState();
      }catch(error){
        console.warn('[Gaeo push] init failed',error);
        setButtons('알림 설정 확인','error');
      }
    });
    const script=document.createElement('script');
    script.src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer=true;
    script.onerror=()=>setButtons('알림 연결 실패','error');
    document.head.appendChild(script);
  }

  window.GaeoPush={toggle,refreshState,openGuide};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{
    bindButtons();loadSDK();
  });
  else{bindButtons();loadSDK();}
})();
