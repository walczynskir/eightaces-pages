/* Eight Aces adapter. Uses the approved Games Chest recovery policy and existing results migration. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./results.js'):root.PasjansResults,node?require('./engine.js'):root.PasjansEngine);
 if(node)module.exports=api;else root.PasjansProgressBackup=api;
})(globalThis,(scoring,engine)=>{
 const rewardIds=['orange-grove','copper','starry-sky'];
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 function validProgress(v){
  if(!exact(v,['results','legacyCopper','unlockedThemes'])||typeof v.legacyCopper!=='boolean'
   ||!Array.isArray(v.unlockedThemes)||new Set(v.unlockedThemes).size!==v.unlockedThemes.length
   ||!v.unlockedThemes.every(id=>rewardIds.includes(id)))return false;
  const r=v.results;
  return exact(r,['baseWins','records'])&&scoring.valid({results:r})
   &&Object.values(r.records).every(record=>exact(record,['outcome','reason','counted'])
    &&(record.outcome==='win'?record.reason==='completed':!record.counted))
   &&Number.isSafeInteger(scoring.winCount(r));
 }
 function validDeal(v){
  if(!v||!Array.isArray(v.rows)||v.rows.length!==8||!Array.isArray(v.goals)||v.goals.length!==8)return false;
  const piles=[...v.rows,...v.goals,v.stock,v.drawn,v.waste];
  if(!piles.every(Array.isArray)||v.drawn.length>1)return false;
  const cards=piles.flat();
  return cards.length===104&&new Set(cards).size===104&&cards.every(c=>Number.isInteger(c)&&c>=0&&c<104)
   &&v.goals.every(p=>p.every((c,i)=>engine.rank(c)===i+1&&engine.suit(c)===engine.suit(p[0])));
 }
 function readLegacy(v, currentPrefs, languages){
  const fail=()=>{throw Object.assign(Error('invalid'),{code:'invalid'});};
  if(!v||!validDeal(v.state)||!scoring.valid(v)||!Number.isSafeInteger(v.wins)||v.wins<0
   ||![v.history??[],v.future??[]].every(list=>Array.isArray(list)&&list.every(validDeal))
   ||!v.prefs||typeof v.prefs!=='object'||Array.isArray(v.prefs))fail();
  const p={...currentPrefs};
  for(const [k,value]of Object.entries(v.prefs)){
   if(!Object.hasOwn(p,k)||typeof value!==typeof p[k])fail();
   p[k]=value;
  }
  if(!languages.includes(p.language)||! /^[a-z][a-z0-9-]{0,63}$/.test(p.theme))fail();
  if(p.theme==='andromeda')p.theme='starry-sky';
  if(p.theme==='tangerine-grove')p.theme='orange-grove';
  if(v.legacyCopper!==undefined&&typeof v.legacyCopper!=='boolean')fail();
  if(v.rewarded!==undefined&&typeof v.rewarded!=='boolean')fail();
  const results=scoring.read(v).results;
  const progress={results,legacyCopper:v.legacyCopper??v.wins>=3,unlockedThemes:v.unlockedThemes??[]};
  if(!validProgress(progress)||(v.results&&scoring.winCount(results)!==v.wins))fail();
  return {preferences:p,progress,legacy:true,legacyCounter:!v.results};
 }
 function merge(current,incoming){
  let right=structuredClone(incoming.progress.results);
  if(incoming.legacyCounter){
   right.baseWins=Math.max(0,right.baseWins-(scoring.winCount(current.results)-current.results.baseWins));
  }
  const results=scoring.merge(current.results,right);
  const legacyCopper=current.legacyCopper||incoming.progress.legacyCopper;
  const wins=scoring.winCount(results);
  const unlocked=new Set([...current.unlockedThemes,...incoming.progress.unlockedThemes]);
  for(const id of rewardIds)if(wins>=(id==='orange-grove'?3:id==='copper'?(legacyCopper?3:5):10))unlocked.add(id);
  let conflicts=0;
  for(const [id,record]of Object.entries(right.records))if(current.results.records[id]
   &&JSON.stringify(record)!==JSON.stringify(current.results.records[id]))conflicts++;
  return {results,legacyCopper,unlockedThemes:rewardIds.filter(id=>unlocked.has(id)),conflicts};
 }
 const summary=progress=>({wins:scoring.winCount(progress.results),losses:Object.values(progress.results.records).filter(r=>r.outcome==='loss').length,
  unlocked:progress.unlockedThemes.length});
 return {validProgress,readLegacy,merge,summary,rewardIds};
});
