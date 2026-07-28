#!/usr/bin/env node
'use strict';

const fs=require('fs');

function required(name){
  const value=String(process.env[name]||'').trim();
  if(!value) throw new Error(`${name} GitHub Secret이 없습니다.`);
  return value;
}
function readBrief(){
  const source=fs.readFileSync('snap/home_brief.js','utf8');
  const matched=source.match(/const\s+HOME_BRIEF\s*=\s*({[\s\S]*});?\s*$/);
  if(!matched) throw new Error('snap/home_brief.js에서 HOME_BRIEF를 읽지 못했습니다.');
  return JSON.parse(matched[1]);
}
function kstDate(){
  return new Intl.DateTimeFormat('ko-KR',{
    timeZone:'Asia/Seoul',month:'long',day:'numeric',weekday:'short'
  }).format(new Date());
}
function compact(value,max){
  const text=String(value||'').replace(/\s+/g,' ').trim();
  return text.length>max?text.slice(0,max-1).trim()+'…':text;
}

async function main(){
  const dryRun=process.env.PUSH_DRY_RUN==='1';
  const appId=dryRun?(String(process.env.ONESIGNAL_APP_ID||'00000000-0000-4000-8000-000000000000')):required('ONESIGNAL_APP_ID');
  const brief=readBrief();
  const insight=brief.marketInsight||brief;
  const lines=Array.isArray(insight.lines)?insight.lines:[];
  const content=compact(lines[0]||'오늘 시장과 관심 종목의 최신 흐름을 3분 안에 확인해 보세요.',145);
  const payload={
    app_id:appId,
    target_channel:'push',
    included_segments:['Subscribed Users'],
    headings:{en:`${kstDate()} Gaeo 아침 브리핑`,ko:`${kstDate()} Gaeo 아침 브리핑`},
    contents:{en:content,ko:content},
    url:'https://gaeoteam.com/?utm_source=push&utm_medium=morning_briefing&utm_campaign=daily_brief',
    chrome_web_icon:'https://gaeoteam.com/icon-192.png',
    firefox_icon:'https://gaeoteam.com/icon-192.png',
    collapse_id:'gaeo-morning-briefing'
  };
  if(dryRun){
    console.log(JSON.stringify(payload,null,2));
    return;
  }
  const apiKey=required('ONESIGNAL_REST_API_KEY');
  const response=await fetch('https://api.onesignal.com/notifications',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Key ${apiKey}`
    },
    body:JSON.stringify(payload)
  });
  const body=await response.text();
  if(!response.ok) throw new Error(`OneSignal 발송 실패(${response.status}): ${body}`);
  const result=JSON.parse(body);
  if(!result.id) console.log('구독자가 아직 없어 발송 대상이 없습니다.',result);
  else console.log('아침 브리핑 발송 완료:',result.id,'대상:',result.recipients||0);
}

main().catch(error=>{
  console.error(error.message);
  process.exitCode=1;
});
