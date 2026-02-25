import { useState, useEffect } from "react";
import { defaultBrandVoice } from "./Components.jsx";
import { Pipeline, Calendar, BrandVoice, Captions } from "./Views.jsx";
import { Campaigns } from "./Campaigns.jsx";

const TABS = ["Pipeline", "Calendar", "Campaigns", "Brand Voice", "Captions"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [brandVoice, setBrandVoice] = useState(defaultBrandVoice);
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        const [it,ca,bv] = await Promise.all([
          window.storage.get("tast_items").catch(()=>null),
          window.storage.get("tast_campaigns").catch(()=>null),
          window.storage.get("tast_voice").catch(()=>null),
        ]);
        if(it) setItems(JSON.parse(it.value));
        if(ca) setCampaigns(JSON.parse(ca.value));
        if(bv) setBrandVoice(bv.value);
      } catch {}
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{if(loaded)window.storage.set("tast_items",JSON.stringify(items)).catch(()=>{});},[items,loaded]);
  useEffect(()=>{if(loaded)window.storage.set("tast_campaigns",JSON.stringify(campaigns)).catch(()=>{});},[campaigns,loaded]);
  useEffect(()=>{if(loaded)window.storage.set("tast_voice",brandVoice).catch(()=>{});},[brandVoice,loaded]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-stone-800 text-lg tracking-tight">tāst</span>
            <span className="text-stone-400 text-sm ml-2">content ops</span>
          </div>
          <div className="text-xs text-stone-300">{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map((t,i)=>(
              <button key={t} onClick={()=>setTab(i)}
                className="text-sm px-3 py-2.5 border-b-2 whitespace-nowrap font-medium transition-colors"
                style={tab===i?{borderColor:"#F05881",color:"#F05881"}:{borderColor:"transparent",color:"#a8a29e"}}>
                {t}
                {t==="Pipeline"&&items.length>0&&(
                  <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full" style={{background:"#fff0f4",color:"#F05881"}}>{items.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {!loaded ? <p className="text-stone-400 text-sm">Loading...</p> : (
          <>
            {tab===0 && <Pipeline items={items} setItems={setItems} campaigns={campaigns} />}
            {tab===1 && <Calendar items={items} setItems={setItems} campaigns={campaigns} />}
            {tab===2 && <Campaigns campaigns={campaigns} setCampaigns={setCampaigns} allItems={items} setAllItems={setItems} />}
            {tab===3 && <BrandVoice voice={brandVoice} setVoice={setBrandVoice} />}
            {tab===4 && <Captions brandVoice={brandVoice} />}
          </>
        )}
      </div>
    </div>
  );
}
