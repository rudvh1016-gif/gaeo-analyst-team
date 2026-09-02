(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.GaeoReleaseSafety=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const CONSENT_KEY='gaeo_analytics_consent_v1';
  const ALLOWED_DRAFT_FILES=new Set(['site_config.js','community.js','tickers.js']);

  function hasMeasurementConsent(storage){
    try{ return storage&&storage.getItem(CONSENT_KEY)==='granted'; }
    catch(e){ return false; }
  }

  function buildPublishRequest(files){
    const entries=Object.entries(files||{}).filter(([name,content])=>
      ALLOWED_DRAFT_FILES.has(name)&&typeof content==='string'
    );
    if(!entries.length) throw new Error('발행 요청에 포함할 안전한 초안 파일이 없습니다.');
    const sections=entries.map(([name,content])=>`--- ${name} ---\n${content.trimEnd()}`).join('\n\n');
    return [
      '아래 초안을 개오 사이트에 반영해줘.',
      'origin/main 최신 상태에서 별도 브랜치를 만들고, 기존 생성 데이터는 건드리지 말아줘.',
      '변경 파일을 검토한 뒤 관련 계약 테스트를 실행하고 PR을 만들어 CI가 통과할 때만 main에 병합해줘.',
      '',
      sections,
    ].join('\n');
  }

  return {CONSENT_KEY,hasMeasurementConsent,buildPublishRequest};
});
