import { useState, useEffect } from "react";
import { defaultBrandVoice } from "./Components.jsx";
import { Pipeline, Calendar, BrandVoice, Captions } from "./Views.jsx";
import { Campaigns } from "./Campaigns.jsx";
import { ProductManager } from "./Products.jsx";

const TABS = [
  { label: "Pipeline",   icon: "⊞" },
  { label: "Calendar",   icon: "📅" },
  { label: "Campaigns",  icon: "🚀" },
  { label: "Brand Voice",icon: "✍️" },
  { label: "Captions",   icon: "💬" },
];

const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

export default function App() {
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState(() => store.get("tast_items") || []);
  const [campaigns, setCampaigns] = useState(() => store.get("tast_campaigns") || []);
  const [brandVoice, setBrandVoice] = useState(() => store.get("tast_voice") || defaultBrandVoice);
  const [products, setProducts] = useState(() => store.get("tast_products") || []);
  const [showProductManager, setShowProductManager] = useState(false);

  useEffect(() => store.set("tast_items", items), [items]);
  useEffect(() => store.set("tast_campaigns", campaigns), [campaigns]);
  useEffect(() => store.set("tast_voice", brandVoice), [brandVoice]);
  useEffect(() => store.set("tast_products", products), [products]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-20 md:pb-0">
      {/* Desktop header + top tabs */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-bold text-stone-800 text-lg tracking-tight">tāst</span>
              <span className="text-stone-400 text-sm ml-2">content ops</span>
            </div>
            <button onClick={() => setShowProductManager(true)}
              className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded-lg px-3 py-1.5 transition-colors">
              ☕ Products ({products.length})
            </button>
          </div>
          <div className="text-xs text-stone-300">{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
        </div>
        {/* Top tabs — desktop only */}
        <div className="hidden md:block max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map((t,i)=>(
              <button key={t.label} onClick={()=>setTab(i)}
                className="text-sm px-3 py-2.5 border-b-2 whitespace-nowrap font-medium transition-colors"
                style={tab===i?{borderColor:"#F05881",color:"#F05881"}:{borderColor:"transparent",color:"#a8a29e"}}>
                {t.label}
                {t.label==="Pipeline"&&items.length>0&&(
                  <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full" style={{background:"#fff0f4",color:"#F05881"}}>{items.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <>
          {tab===0 && <Pipeline items={items} setItems={setItems} campaigns={campaigns} products={products} setProducts={setProducts} />}
          {tab===1 && <Calendar items={items} setItems={setItems} campaigns={campaigns} products={products} setProducts={setProducts} />}
          {tab===2 && <Campaigns campaigns={campaigns} setCampaigns={setCampaigns} allItems={items} setAllItems={setItems} products={products} setProducts={setProducts} />}
          {tab===3 && <BrandVoice voice={brandVoice} setVoice={setBrandVoice} />}
          {tab===4 && <Captions brandVoice={brandVoice} />}
        </>
      </div>

      {/* Bottom tab bar — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 z-40 flex">
        {TABS.map((t,i)=>(
          <button key={t.label} onClick={()=>setTab(i)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            style={tab===i?{color:"#F05881"}:{color:"#a8a29e"}}>
            <span className="text-lg leading-none">{t.icon}</span>
            <span className="text-xs font-medium leading-none">{t.label.split(" ")[0]}</span>
            {t.label==="Pipeline"&&items.length>0&&(
              <span className="absolute top-1 text-xs w-4 h-4 rounded-full flex items-center justify-center" style={{background:"#F05881",color:"white",fontSize:9}}>{items.length}</span>
            )}
          </button>
        ))}
      </div>

      {showProductManager && (
        <ProductManager products={products} setProducts={setProducts} onClose={() => setShowProductManager(false)} />
      )}
    </div>
  );
}
