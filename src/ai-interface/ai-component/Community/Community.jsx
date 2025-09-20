// import React, { useEffect, useRef, useState } from "react";
// import { Users, ShieldCheck, Send, PlusCircle, Lock, Sparkles } from "lucide-react";
// import { motion } from "framer-motion";
// import './Community.css';

// /**
//  * CommunityPage — frontend-only, works without DB (uses localStorage)
//  * - Drop into: src/ai-interface/ai-component/Community/Community.jsx
//  * - When ready to connect DB (Supabase), replace localStorage helpers with fetch/insert/realtime
//  */

// const STORAGE_KEY = "app_communities_v1";

// // LocalStorage helpers
// function loadState() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return null;
//     return JSON.parse(raw);
//   } catch (e) {
//     console.error("Failed to parse community state", e);
//     return null;
//   }
// }

// function saveState(state) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//   } catch (e) {
//     console.error("Failed to save community state", e);
//   }
// }

// const starter = {
//   communities: [
//     { id: "c-stress", name: "Stress Relief", description: "Calm tips, breathing & micro-practices", is_anonymous: false },
//     { id: "c-student", name: "Student Support", description: "Study help, schedules, resources", is_anonymous: false },
//     { id: "c-anon", name: "Anonymous Lounge", description: "Vent & share anonymously", is_anonymous: true },
//     { id: "c-challenges", name: "Challenges", description: "Daily & weekly wellbeing challenges", is_anonymous: false },
//     { id: "c-therapist", name: "Therapist Lounge", description: "Verified therapists & moderated chat", is_anonymous: false, is_therapist_room: true }
//   ],
//   messages: {
//     "c-stress": [
//       { id: 1, username: "Riya", body: "Anyone tried 4-4-4 breathing? super helpful before exams.", is_anonymous: false, role: "user", time: "10:02" },
//       { id: 2, username: "Dr. Neha", body: "Box breathing for 3 minutes can reduce heart rate.", is_anonymous: false, role: "therapist", time: "10:05" }
//     ],
//     "c-anon": [
//       { id: 11, username: "Anonymous", body: "Had a bad day — needed to get this off my chest.", is_anonymous: true, role: "user", time: "09:00" }
//     ],
//     "c-challenges": [
//       { id: 101, username: "System", body: "Week 1: Sleep Reset — Post your nightly check-in.", is_anonymous: false, role: "system", time: "2025-09-01" }
//     ],
//     "c-therapist": [
//       { id: 21, username: "Dr. Sharma", body: "Welcome therapists — pin the resources for this month.", is_anonymous: false, role: "therapist", time: "08:30" }
//     ]
//   },
//   challenges: [
//     { id: "ch-1", title: "7-Day Sleep Reset", description: "Small nightly steps to improve sleep" }
//   ]
// };

// export default function CommunityPage({ currentUser = null }) {
//   const [state, setState] = useState(() => {
//     const saved = loadState();
//     return saved || starter;
//   });

//   const [activeCommunityId, setActiveCommunityId] = useState(state.communities[0].id);
//   const [newMessage, setNewMessage] = useState("");
//   const [postAnonymously, setPostAnonymously] = useState(false);
//   const [showCreateCommunity, setShowCreateCommunity] = useState(false);
//   const [showCreateChallenge, setShowCreateChallenge] = useState(false);
//   const [search, setSearch] = useState("");

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     saveState(state);
//   }, [state]);

//   useEffect(() => {
//     if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [activeCommunityId, state.messages]);

//   function currentCommunity() {
//     return state.communities.find(c => c.id === activeCommunityId) || state.communities[0];
//   }

//   function sendMessage(e) {
//     e?.preventDefault();
//     if (!newMessage.trim()) return;
//     const cm = currentCommunity();
//     const payload = {
//       id: Date.now(),
//       username: postAnonymously || cm.is_anonymous ? "Anonymous" : (currentUser?.name || "Guest"),
//       body: newMessage.trim(),
//       is_anonymous: postAnonymously || cm.is_anonymous || false,
//       role: currentUser?.role || "user",
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setState(prev => {
//       const messages = { ...(prev.messages || {}) };
//       messages[cm.id] = [...(messages[cm.id] || []), payload];
//       return { ...prev, messages };
//     });

//     setNewMessage("");
//   }

//   function createCommunity(name, description, is_anonymous = false, is_therapist_room = false) {
//     const id = `c-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
//     const community = { id, name, description, is_anonymous, is_therapist_room };
//     setState(prev => ({ ...prev, communities: [community, ...prev.communities] }));
//     setShowCreateCommunity(false);
//     setActiveCommunityId(id);

//     // TODO: replace with DB insert (e.g., supabase.from('communities').insert(...))
//   }

//   function createChallenge(title, description) {
//     const ch = { id: `ch-${Date.now()}`, title, description };
//     setState(prev => ({ ...prev, challenges: [ch, ...(prev.challenges || [])] }));
//     setShowCreateChallenge(false);

//     // TODO: persist to DB
//   }

//   function joinCommunity(id) {
//     setActiveCommunityId(id);
//     // TODO: mark membership in DB
//   }

//   function searchCommunities(q) {
//     setSearch(q);
//   }

//   const visibleCommunities = state.communities.filter(c =>
//     c.name.toLowerCase().includes(search.toLowerCase()) ||
//     c.description.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="community-page min-h-screen p-6 grid grid-cols-12 gap-6">
//       {/* LEFT: communities */}
//       <aside className="community-sidebar col-span-3">
//         <div className="sidebar-top">
//           <div>
//             <h3 className="title">Communities</h3>
//             <p className="muted">Join rooms to connect with peers</p>
//           </div>

//           <div className="search-row">
//             <input value={search} onChange={e => searchCommunities(e.target.value)} placeholder="Search communities..." />
//             <button className="icon-btn" onClick={() => setShowCreateCommunity(true)} aria-label="Create community"><PlusCircle /></button>
//           </div>
//         </div>

//         <ul className="list">
//           {visibleCommunities.map(c => (
//             <li key={c.id} className={c.id === activeCommunityId ? 'active' : ''}>
//               <button onClick={() => joinCommunity(c.id)} className="community-item">
//                 <div className="left">
//                   <div className="avatar">{c.is_therapist_room ? <ShieldCheck /> : <Users />}</div>
//                 </div>
//                 <div className="meta">
//                   <div className="name">{c.name}</div>
//                   <div className="desc">{c.description}</div>
//                 </div>
//                 <div className="tags">
//                   {c.is_anonymous && <span className="tag anon">Anon</span>}
//                   {c.is_therapist_room && <span className="tag therapist">Therapists</span>}
//                 </div>
//               </button>
//             </li>
//           ))}
//         </ul>

//         <div className="sidebar-bottom">
//           <div className="small-muted">Tip: toggle "Post anonymously" when composing.</div>
//         </div>
//       </aside>

//       {/* MAIN: chat */}
//       <main className="community-main col-span-6">
//         <header className="main-header">
//           <div>
//             <h2>{currentCommunity().name}</h2>
//             <p className="muted">{currentCommunity().description}</p>
//           </div>

//           <div className="header-actions">
//             {currentCommunity().is_therapist_room && <div className="pill therapist"><ShieldCheck /> Therapist room</div>}
//             <div className="small-muted">You: {currentUser?.name || 'Guest'}</div>
//           </div>
//         </header>

//         <section className="messages-panel">
//           <ul className="messages">
//             {(state.messages[currentCommunity().id] || []).map(m => (
//               <li key={m.id} className={`message ${m.is_anonymous ? 'anonymous' : ''} ${m.role === 'therapist' ? 'therapist' : ''}`}>
//                 <div className="meta">
//                   <div className="left">
//                     <div className="username">{m.is_anonymous ? 'Anonymous' : m.username}</div>
//                     <div className="time">{m.time}</div>
//                   </div>
//                 </div>
//                 <div className="body">{m.body}</div>
//               </li>
//             ))}
//             <div ref={messagesEndRef} />
//           </ul>
//         </section>

//         <form className="composer" onSubmit={sendMessage}>
//           <label className="anon-toggle">
//             <input type="checkbox" checked={postAnonymously} onChange={() => setPostAnonymously(p => !p)} />
//             Post anonymously
//           </label>

//           <input
//             className="composer-input"
//             placeholder={`Message #${currentCommunity().name}`}
//             value={newMessage}
//             onChange={e => setNewMessage(e.target.value)}
//           />

//           <button type="submit" className="send-btn" aria-label="Send"><Send /></button>
//         </form>
//       </main>

//       {/* RIGHT: challenges + therapists */}
//       <aside className="community-right col-span-3">
//         <div className="section">
//           <div className="section-head">
//             <h4>Challenges</h4>
//             <button className="small" onClick={() => setShowCreateChallenge(true)}>+ Add</button>
//           </div>

//           <ul className="ch-list">
//             {state.challenges.map(ch => (
//               <motion.li key={ch.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="challenge-card">
//                 <div className="ch-title">{ch.title}</div>
//                 <div className="ch-desc">{ch.description}</div>
//                 <div className="ch-actions"><button className="tiny">Join</button></div>
//               </motion.li>
//             ))}
//           </ul>
//         </div>

//         <div className="section">
//           <h4>Therapists</h4>
//           <div className="small-muted">Verified therapists in the Therapist Lounge</div>
//           <ul className="therapist-list">
//             <li className="therapist-item"><ShieldCheck /> Dr. Neha</li>
//             <li className="therapist-item"><ShieldCheck /> Dr. Sharma</li>
//           </ul>
//         </div>

//         <div className="section">
//           <h4>Quick actions</h4>
//           <button className="block-btn" onClick={() => setActiveCommunityId('c-anon')}><Lock /> Go Anonymous Lounge</button>
//           <button className="block-btn" onClick={() => setActiveCommunityId('c-challenges')}><Sparkles /> Open Challenges</button>
//         </div>
//       </aside>

//       {/* Create community modal */}
//       {showCreateCommunity && (
//         <Modal onClose={() => setShowCreateCommunity(false)}>
//           <CreateCommunityForm
//             onCreate={(n, d, anon, therapist) => createCommunity(n, d, anon, therapist)}
//             onCancel={() => setShowCreateCommunity(false)}
//           />
//         </Modal>
//       )}

//       {/* Create challenge modal */}
//       {showCreateChallenge && (
//         <Modal onClose={() => setShowCreateChallenge(false)}>
//           <CreateChallengeForm onCreate={(t, d) => createChallenge(t, d)} onCancel={() => setShowCreateChallenge(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* Small UI primitives (kept inside file for single-file drop-in) */

// function Modal({ children, onClose }) {
//   return (
//     <div className="modal-overlay">
//       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="modal">
//         <div className="modal-body">{children}</div>
//         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
//           <button className="muted" onClick={onClose}>Close</button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// function CreateCommunityForm({ onCreate, onCancel }) {
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");
//   const [anon, setAnon] = useState(false);
//   const [therapist, setTherapist] = useState(false);

//   return (
//     <div className="form">
//       <h3>Create community</h3>
//       <label>Name <input value={name} onChange={e => setName(e.target.value)} placeholder="Stress Relief" /></label>
//       <label>Description <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short summary" /></label>
//       <label><input type="checkbox" checked={anon} onChange={() => setAnon(a => !a)} /> Anonymous room</label>
//       <label><input type="checkbox" checked={therapist} onChange={() => setTherapist(t => !t)} /> Therapist-only room</label>
//       <div className="form-actions">
//         <button onClick={() => onCreate(name || 'Unnamed', desc || '', anon, therapist)} className="primary">Create</button>
//         <button onClick={onCancel} className="muted">Cancel</button>
//       </div>
//     </div>
//   );
// }

// function CreateChallengeForm({ onCreate, onCancel }) {
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");

//   return (
//     <div className="form">
//       <h3>New Challenge</h3>
//       <label>Title <input value={title} onChange={e => setTitle(e.target.value)} placeholder="7-Day Sleep Reset" /></label>
//       <label>Description <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description" /></label>
//       <div className="form-actions">
//         <button onClick={() => { onCreate(title || 'Untitled', desc || ''); }} className="primary">Add</button>
//         <button onClick={onCancel} className="muted">Cancel</button>
//       </div>
//     </div>
//   );
// }
