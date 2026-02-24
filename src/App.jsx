import { useState, useEffect } from "react";

const TABS = ["Ideas", "Calendar", "Campaigns", "Library", "Brand Voice", "Captions"];
const STATUS_OPTIONS = ["Idea", "In Progress", "Ready", "Published"];
const CHANNEL_OPTIONS = ["Instagram", "Email", "Website", "TikTok", "LinkedIn"];
const TYPE_OPTIONS = ["Brewing Guide", "Product Launch", "Origin Story", "Processing Method", "Campaign", "Community", "Other"];

const STATUS_COLORS = {
  "Idea": "bg-stone-100 text-stone-600",
  "In Progress": "bg-[#fa8f9c]/20 text-[#a12f52]",
  "Ready": "bg-[#F05881]/20 text-[#a12f52]",
  "Published": "bg-[#a12f52]/20 text-[#a12f52]"
};
const TYPE_COLORS = {
  "Brewing Guide": "bg-[#fa8f9c]/25 text-[#a12f52]",
  "Product Launch": "bg-[#F05881]/20 text-[#a12f52]",
  "Origin Story": "bg-[#ef4056]/15 text-[#a12f52]",
  "Processing Method": "bg-[#fa8f9c]/30 text-[#a12f52]",
  "Campaign": "bg-[#a12f52]/15 text-[#a12f52]",
  "Community": "bg-[#F05881]/10 text-[#a12f52]",
  "Other": "bg-stone-100 text-stone-600"
};

const defaultBrandVoice = `TONE
Warm, knowledgeable, and quietly confident. We don't preach — we invite. Think of a well-traveled friend who happens to know everything about coffee and shares that knowledge generously, without gatekeeping.

VOCABULARY
Use: craft, process, terroir, fermentation, origin, experimental, transparent, intentional
Avoid: "premium," "luxury," overused coffee clichés like "bean juice"

CONTENT PILLARS
1. The Process — fermentation, processing methods, sourcing
2. The People — farmers, roasters, the tāst community
3. The Ritual — brewing at home, sensory experience
4. The Drop — product launches, limited releases

WRITING SAMPLES
"We spent three years chasing this fermentation profile. Not because we had to — because we couldn't stop thinking about it."
"Every bag tells a story that started long before the roast. We're just the last chapter."
"Specialty coffee isn't about exclusivity. It's about paying attention."`;

// ── Storage helpers (localStorage for self-hosted) ──
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

function Tag({ label, colorClass }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>{label}</span>;
}
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800 text-lg">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>}
      <input className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F05881]/40" {...props} />
    </div>
  );
}
function Select({ label, options, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>}
      <select className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F05881]/40 bg-white" {...props}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Textarea({ label, rows = 4, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>}
      <textarea rows={rows} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F05881]/40 resize-none" {...props} />
    </div>
  );
}

// ── IDEAS ──
function Ideas({ ideas, setIdeas, onMoveToCalendar }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", notes: "", type: TYPE_OPTIONS[0], channel: CHANNEL_OPTIONS[0], product: "" });
  const save = () => {
    if (!form.title.trim()) return;
    setIdeas(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm({ title: "", notes: "", type: TYPE_OPTIONS[0], channel: CHANNEL_OPTIONS[0], product: "" });
    setShowForm(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Idea Inbox</h2>
        <button onClick={() => setShowForm(true)} style={{ background: "#F05881" }} className="hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium">+ Add Idea</button>
      </div>
      {ideas.length === 0 && <p className="text-stone-400 text-sm">No ideas yet — capture something.</p>}
      <div className="space-y-3">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-stone-800 text-sm">{idea.title}</p>
                {idea.product && <p className="text-xs text-stone-400 mt-0.5">Product: {idea.product}</p>}
                {idea.notes && <p className="text-xs text-stone-500 mt-1">{idea.notes}</p>}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <Tag label={idea.type} colorClass={TYPE_COLORS[idea.type] || TYPE_COLORS["Other"]} />
                  <Tag label={idea.channel} colorClass="bg-stone-100 text-stone-600" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => onMoveToCalendar(idea)} style={{ color: "#F05881" }} className="text-xs font-medium whitespace-nowrap hover:opacity-70">→ Calendar</button>
                <button onClick={() => setIdeas(prev => prev.filter(i => i.id !== idea.id))} className="text-xs text-stone-300 hover:text-red-400">remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <Modal title="New Idea" onClose={() => setShowForm(false)}>
          <Input label="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What's the idea?" />
          <Input label="Product reference (optional)" value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))} placeholder="e.g. Ethiopia Anaerobic Natural" />
          <Select label="Content type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
          <Select label="Channel" options={CHANNEL_OPTIONS} value={form.channel} onChange={e => setForm(p => ({ ...p, channel: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any context or angles..." />
          <button onClick={save} style={{ background: "#F05881" }} className="w-full hover:opacity-90 text-white py-2 rounded-lg font-medium text-sm">Save Idea</button>
        </Modal>
      )}
    </div>
  );
}

// ── CALENDAR ──
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function Calendar({ items, setItems }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", date: "", type: TYPE_OPTIONS[0], channel: CHANNEL_OPTIONS[0], status: "Idea", notes: "" });

  const openNew = (date = "") => { setEditItem(null); setForm({ title: "", date, type: TYPE_OPTIONS[0], channel: CHANNEL_OPTIONS[0], status: "Idea", notes: "" }); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowForm(true); };
  const save = () => {
    if (!form.title.trim() || !form.date) return;
    if (editItem) setItems(prev => prev.map(i => i.id === editItem.id ? { ...form, id: editItem.id } : i));
    else setItems(prev => [...prev, { ...form, id: Date.now() }]);
    setShowForm(false);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);
  const itemsForDay = (d) => {
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return items.filter(i => i.date === key);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }} className="text-stone-400 hover:text-stone-700 text-lg">‹</button>
          <h2 className="text-lg font-semibold text-stone-800">{MONTHS[month]} {year}</h2>
          <button onClick={() => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }} className="text-stone-400 hover:text-stone-700 text-lg">›</button>
        </div>
        <button onClick={() => openNew()} style={{ background: "#F05881" }} className="hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium">+ Add</button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-stone-100 rounded-xl overflow-hidden border border-stone-100">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="bg-stone-50 text-center text-xs font-medium text-stone-400 py-2">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div key={i} onClick={() => d && openNew(`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`)}
            className={`bg-white min-h-16 p-1.5 cursor-pointer hover:bg-pink-50 transition-colors ${!d?"opacity-0 pointer-events-none":""}`}>
            {d && <>
              <p className="text-xs font-medium mb-1" style={d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear()?{color:"#F05881"}:{color:"#a8a29e"}}>{d}</p>
              <div className="space-y-0.5">
                {itemsForDay(d).map(item => (
                  <div key={item.id} onClick={e=>{e.stopPropagation();openEdit(item);}}
                    className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer font-medium ${TYPE_COLORS[item.type]||TYPE_COLORS["Other"]}`}>
                    {item.title}
                  </div>
                ))}
              </div>
            </>}
          </div>
        ))}
      </div>
      {showForm && (
        <Modal title={editItem ? "Edit Content" : "New Content"} onClose={() => setShowForm(false)}>
          <Input label="Title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Content title" />
          <Input label="Date" type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
          <Select label="Content type" options={TYPE_OPTIONS} value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} />
          <Select label="Channel" options={CHANNEL_OPTIONS} value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))} />
          <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} />
          <Textarea label="Notes" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Details, links, copy notes..." />
          <div className="flex gap-2">
            <button onClick={save} style={{background:"#F05881"}} className="flex-1 hover:opacity-90 text-white py-2 rounded-lg font-medium text-sm">Save</button>
            {editItem && <button onClick={()=>{setItems(prev=>prev.filter(i=>i.id!==editItem.id));setShowForm(false);}} className="px-4 py-2 text-sm text-red-400 hover:text-red-600">Delete</button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CAMPAIGNS ──
function Campaigns({ campaigns, setCampaigns }) {
  const [showForm, setShowForm] = useState(false);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name:"", dropDate:"", goal:"", pillars:"", channels:"", bigThink:"", status:"Planning" });
  const save = () => {
    if (!form.name.trim()) return;
    if (active) { setCampaigns(prev=>prev.map(c=>c.id===active.id?{...form,id:active.id}:c)); setActive({...form,id:active.id}); }
    else { const c={...form,id:Date.now()}; setCampaigns(prev=>[c,...prev]); }
    setShowForm(false);
  };
  const statusCls = s => s==="Live"?"bg-[#a12f52]/15 text-[#a12f52]":s==="Complete"?"bg-stone-200 text-stone-600":"bg-[#fa8f9c]/20 text-[#a12f52]";

  if (active) {
    const c = campaigns.find(x=>x.id===active.id)||active;
    return (
      <div>
        <button onClick={()=>setActive(null)} style={{color:"#F05881"}} className="text-sm hover:opacity-70 mb-4">← All Campaigns</button>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">{c.name}</h2>
            {c.dropDate && <p className="text-sm text-stone-400 mt-0.5">Drop: {c.dropDate}</p>}
          </div>
          <div className="flex gap-2 items-center">
            <Tag label={c.status} colorClass={statusCls(c.status)} />
            <button onClick={()=>{setForm({...c});setShowForm(true);}} className="text-xs text-stone-400 hover:text-stone-600">Edit</button>
          </div>
        </div>
        <div className="grid gap-4">
          {c.goal && <div className="bg-white rounded-xl border border-stone-100 p-4"><p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Goal</p><p className="text-sm text-stone-700">{c.goal}</p></div>}
          {c.pillars && <div className="bg-white rounded-xl border border-stone-100 p-4"><p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Content Pillars</p><p className="text-sm text-stone-700 whitespace-pre-wrap">{c.pillars}</p></div>}
          {c.channels && <div className="bg-white rounded-xl border border-stone-100 p-4"><p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Channel Plan</p><p className="text-sm text-stone-700 whitespace-pre-wrap">{c.channels}</p></div>}
          {c.bigThink && <div className="rounded-xl border p-4" style={{background:"#fff5f7",borderColor:"#fa8f9c"}}><p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:"#F05881"}}>Big Think / Creative Sandbox</p><p className="text-sm text-stone-700 whitespace-pre-wrap">{c.bigThink}</p></div>}
        </div>
        {showForm && (
          <Modal title="Edit Campaign" onClose={()=>setShowForm(false)}>
            <Input label="Campaign name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
            <Input label="Drop date" type="date" value={form.dropDate} onChange={e=>setForm(p=>({...p,dropDate:e.target.value}))} />
            <Select label="Status" options={["Planning","Active","Live","Complete"]} value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} />
            <Textarea label="Goal" value={form.goal} onChange={e=>setForm(p=>({...p,goal:e.target.value}))} />
            <Textarea label="Content pillars" value={form.pillars} onChange={e=>setForm(p=>({...p,pillars:e.target.value}))} />
            <Textarea label="Channel plan" value={form.channels} onChange={e=>setForm(p=>({...p,channels:e.target.value}))} />
            <Textarea label="Big think" rows={6} value={form.bigThink} onChange={e=>setForm(p=>({...p,bigThink:e.target.value}))} />
            <button onClick={save} style={{background:"#F05881"}} className="w-full hover:opacity-90 text-white py-2 rounded-lg font-medium text-sm">Save</button>
          </Modal>
        )}
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Campaigns</h2>
        <button onClick={()=>{setForm({name:"",dropDate:"",goal:"",pillars:"",channels:"",bigThink:"",status:"Planning"});setShowForm(true);}} style={{background:"#F05881"}} className="hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium">+ New Campaign</button>
      </div>
      {campaigns.length===0 && <p className="text-stone-400 text-sm">No campaigns yet — plan a product drop.</p>}
      <div className="space-y-3">
        {campaigns.map(c=>(
          <div key={c.id} onClick={()=>setActive(c)} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm cursor-pointer hover:border-[#fa8f9c] transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-stone-800 text-sm">{c.name}</p>
                {c.dropDate && <p className="text-xs text-stone-400 mt-0.5">Drop: {c.dropDate}</p>}
                {c.goal && <p className="text-xs text-stone-500 mt-1 line-clamp-2">{c.goal}</p>}
              </div>
              <Tag label={c.status} colorClass={statusCls(c.status)} />
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <Modal title="New Campaign" onClose={()=>setShowForm(false)}>
          <Input label="Campaign name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Spring Fermentation Drop" />
          <Input label="Drop date" type="date" value={form.dropDate} onChange={e=>setForm(p=>({...p,dropDate:e.target.value}))} />
          <Select label="Status" options={["Planning","Active","Live","Complete"]} value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} />
          <Textarea label="Goal" value={form.goal} onChange={e=>setForm(p=>({...p,goal:e.target.value}))} placeholder="What does success look like?" />
          <Textarea label="Content pillars" value={form.pillars} onChange={e=>setForm(p=>({...p,pillars:e.target.value}))} />
          <Textarea label="Channel plan" value={form.channels} onChange={e=>setForm(p=>({...p,channels:e.target.value}))} />
          <Textarea label="Big think / creative sandbox" rows={5} value={form.bigThink} onChange={e=>setForm(p=>({...p,bigThink:e.target.value}))} placeholder="Concepts, moodboard notes, wild ideas..." />
          <button onClick={save} style={{background:"#F05881"}} className="w-full hover:opacity-90 text-white py-2 rounded-lg font-medium text-sm">Create Campaign</button>
        </Modal>
      )}
    </div>
  );
}

// ── LIBRARY ──
function Library({ items }) {
  const [fType, setFType] = useState("All");
  const [fCh, setFCh] = useState("All");
  const [fSt, setFSt] = useState("All");
  const filtered = items.filter(i=>(fType==="All"||i.type===fType)&&(fCh==="All"||i.channel===fCh)&&(fSt==="All"||i.status===fSt));
  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-800 mb-4">Content Library</h2>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[[fType,setFType,["All",...TYPE_OPTIONS],"Type"],[fCh,setFCh,["All",...CHANNEL_OPTIONS],"Channel"],[fSt,setFSt,["All",...STATUS_OPTIONS],"Status"]].map(([val,set,opts,label],i)=>(
          <select key={i} value={val} onChange={e=>set(e.target.value)} className="border border-stone-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#F05881]/40">
            <option value="All">All {label}s</option>
            {opts.slice(1).map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      {filtered.length===0 && <p className="text-stone-400 text-sm">No content matches these filters.</p>}
      <div className="space-y-2">
        {filtered.map(item=>(
          <div key={item.id} className="bg-white rounded-xl border border-stone-100 p-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-stone-800 text-sm">{item.title}</p>
                {item.date && <p className="text-xs text-stone-400 mt-0.5">{item.date}</p>}
                {item.notes && <p className="text-xs text-stone-500 mt-1 line-clamp-2">{item.notes}</p>}
              </div>
              <Tag label={item.status||"Idea"} colorClass={STATUS_COLORS[item.status||"Idea"]} />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <Tag label={item.type} colorClass={TYPE_COLORS[item.type]||TYPE_COLORS["Other"]} />
              <Tag label={item.channel} colorClass="bg-stone-100 text-stone-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BRAND VOICE ──
function BrandVoice({ voice, setVoice }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(voice);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Brand Voice & Guidelines</h2>
        {!editing
          ? <button onClick={()=>{setDraft(voice);setEditing(true);}} style={{color:"#F05881"}} className="text-sm hover:opacity-70 font-medium">Edit</button>
          : <div className="flex gap-2">
              <button onClick={()=>{setVoice(draft);setEditing(false);}} style={{background:"#F05881"}} className="text-sm hover:opacity-90 text-white px-3 py-1.5 rounded-lg font-medium">Save</button>
              <button onClick={()=>setEditing(false)} className="text-sm text-stone-400 hover:text-stone-600">Cancel</button>
            </div>
        }
      </div>
      {editing
        ? <textarea value={draft} onChange={e=>setDraft(e.target.value)} className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F05881]/40 resize-none font-mono" rows={20} />
        : <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm"><pre className="text-sm text-stone-700 whitespace-pre-wrap font-sans leading-relaxed">{voice}</pre></div>
      }
    </div>
  );
}

// ── CAPTION GENERATOR ──
function CaptionGenerator({ brandVoice }) {
  const [channel, setChannel] = useState("Instagram");
  const [context, setContext] = useState("");
  const [product, setProduct] = useState("");
  const [tone, setTone] = useState("On-brand default");
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setCaptions([]);
    try {
      const resp = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, context, product, tone, brandVoice })
      });
      const data = await resp.json();
      setCaptions(data.captions || ["Error generating captions."]);
    } catch { setCaptions(["Error generating captions. Please try again."]); }
    setLoading(false);
  };

  const copy = (text, i) => { navigator.clipboard.writeText(text); setCopied(i); setTimeout(()=>setCopied(null),1500); };

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-800 mb-1">Caption Generator</h2>
      <p className="text-sm text-stone-400 mb-4">Generate on-brand captions powered by your brand voice guidelines.</p>
      <div className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm mb-4">
        <Select label="Channel" options={CHANNEL_OPTIONS} value={channel} onChange={e=>setChannel(e.target.value)} />
        <Input label="Product (optional)" value={product} onChange={e=>setProduct(e.target.value)} placeholder="e.g. Colombia Honey Process" />
        <Textarea label="Post context" rows={3} value={context} onChange={e=>setContext(e.target.value)} placeholder="What's this post about?" />
        <Select label="Tone direction" options={["On-brand default","More poetic","More direct","Playful","Educational","Hype / launch energy"]} value={tone} onChange={e=>setTone(e.target.value)} />
        <button onClick={generate} disabled={loading||!context.trim()}
          style={loading||!context.trim()?{}:{background:"#F05881"}}
          className="w-full disabled:bg-stone-200 disabled:text-stone-400 text-white py-2.5 rounded-lg font-medium text-sm mt-1 hover:opacity-90">
          {loading ? "Generating..." : "Generate Captions"}
        </button>
      </div>
      {captions.length>0 && (
        <div className="space-y-3">
          {captions.map((c,i)=>(
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{c}</p>
              <button onClick={()=>copy(c,i)} style={{color:"#F05881"}} className="mt-2 text-xs hover:opacity-70 font-medium">{copied===i?"Copied!":"Copy"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── APP ──
export default function App() {
  const [tab, setTab] = useState(0);
  const [ideas, setIdeas] = useState(() => store.get("tast_ideas") || []);
  const [calItems, setCalItems] = useState(() => store.get("tast_cal") || []);
  const [campaigns, setCampaigns] = useState(() => store.get("tast_campaigns") || []);
  const [brandVoice, setBrandVoice] = useState(() => store.get("tast_voice") || defaultBrandVoice);

  useEffect(() => store.set("tast_ideas", ideas), [ideas]);
  useEffect(() => store.set("tast_cal", calItems), [calItems]);
  useEffect(() => store.set("tast_campaigns", campaigns), [campaigns]);
  useEffect(() => store.set("tast_voice", brandVoice), [brandVoice]);

  const moveIdeaToCalendar = (idea) => {
    setCalItems(prev => [...prev, { ...idea, id: Date.now(), date: "", status: "Idea" }]);
    setIdeas(prev => prev.filter(i => i.id !== idea.id));
    setTab(1);
  };

  const allLibraryItems = [...calItems].sort((a,b)=>(b.date||"").localeCompare(a.date||""));

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-stone-800 text-lg tracking-tight">tāst</span>
            <span className="text-stone-400 text-sm ml-2">content ops</span>
          </div>
          <div className="text-xs text-stone-300">{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
        </div>
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map((t,i)=>(
              <button key={t} onClick={()=>setTab(i)}
                className="text-sm px-3 py-2.5 border-b-2 whitespace-nowrap font-medium transition-colors"
                style={tab===i?{borderColor:"#F05881",color:"#F05881"}:{borderColor:"transparent",color:"#a8a29e"}}>
                {t}
                {t==="Ideas"&&ideas.length>0&&<span className="ml-1 text-xs px-1.5 py-0.5 rounded-full" style={{background:"#fff0f4",color:"#F05881"}}>{ideas.length}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {tab===0 && <Ideas ideas={ideas} setIdeas={setIdeas} onMoveToCalendar={moveIdeaToCalendar} />}
        {tab===1 && <Calendar items={calItems} setItems={setCalItems} />}
        {tab===2 && <Campaigns campaigns={campaigns} setCampaigns={setCampaigns} />}
        {tab===3 && <Library items={allLibraryItems} />}
        {tab===4 && <BrandVoice voice={brandVoice} setVoice={setBrandVoice} />}
        {tab===5 && <CaptionGenerator brandVoice={brandVoice} />}
      </div>
    </div>
  );
}
