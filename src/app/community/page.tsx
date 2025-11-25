"use client";
import React, { useEffect, useRef, useState } from "react";
import { Users, MessageCircle } from "lucide-react";
import { db } from "../../lib/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AuthModal from "../../components/AuthModal";
import Loading from "../../components/Loading";

export default function CommunityPage() {
    const [authUser, setAuthUser] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<{ id: string; name: string } | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const [users, setUsers] = useState<Array<{ id: string; name?: string }>>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedUser, setSelectedUser] = useState<{ id: string; name?: string } | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [messageText, setMessageText] = useState("");
    const unsubscribeRef = useRef<() => void | null>(null);
    const messagesScrollRef = useRef<HTMLDivElement | null>(null);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 599);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleScroll = () => {
        if (!messagesScrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesScrollRef.current;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20);
    };

    useEffect(() => {
        if (isAtBottom && messagesScrollRef.current) {
            messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
        }
    }, [messages, isAtBottom]);

    const startListeningMessages = (cId: string) => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        const messagesRef = collection(db, `chats/${cId}/messages`);
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            setMessages(docs);

            if (messagesScrollRef.current) {
                messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
            }
        });

        unsubscribeRef.current = unsub;
    };

    const openChatWith = async (otherUser: { id: string; name?: string }) => {
        if (!loggedInUser) {
            setShowAuthModal(true);
            return;
        }
        if (otherUser.id === loggedInUser.id) return;

        setSelectedUser(otherUser);
        setMessages([]);
        setChatId(null);
        if (isMobile) setShowChatPanel(true);

        try {
            const cQuery = query(collection(db, "chats"), where("members", "array-contains", loggedInUser.id));
            const cSnap = await getDocs(cQuery);

            let foundId: string | null = null;
            cSnap.forEach((docSnap) => {
                const d = docSnap.data() as any;
                if (
                    Array.isArray(d.members) &&
                    d.members.length === 2 &&
                    d.members.includes(otherUser.id) &&
                    d.members.includes(loggedInUser.id)
                ) {
                    foundId = docSnap.id;
                }
            });

            if (foundId) {
                setChatId(foundId);
                startListeningMessages(foundId);
                return;
            }

            const newChatRef = await addDoc(collection(db, "chats"), {
                members: [loggedInUser.id, otherUser.id],
                lastMessage: "",
                lastAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            });

            setChatId(newChatRef.id);
            startListeningMessages(newChatRef.id);
        } catch (err) {
            console.error("openChatWith error:", err);
        }
    };

    const sendMessage = async () => {
        if (!chatId || !messageText.trim() || !loggedInUser) return;

        const text = messageText.trim();
        setMessageText("");

        try {
            await addDoc(collection(db, `chats/${chatId}/messages`), {
                senderId: loggedInUser.id,
                senderName: loggedInUser.name,
                text,
                createdAt: serverTimestamp(),
            });

            await updateDoc(doc(db, "chats", chatId), {
                lastMessage: text,
                lastAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("sendMessage error:", err);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (u) => {

            if (!u) {
                setAuthUser(null);
                setLoggedInUser(null);
                setShowAuthModal(true);
                setAuthLoading(false);
            } else {
                setAuthUser(u);
                try {
                    const snap = await getDoc(doc(db, "users", u.uid));
                    if (snap.exists()) {
                        setLoggedInUser({ id: u.uid, name: (snap.data() as any).name || "User" });
                    } else {
                        setLoggedInUser({ id: u.uid, name: "User" });
                    }
                } catch {
                    setLoggedInUser({ id: u.uid, name: "User" });
                }
                setShowAuthModal(false);
                setAuthLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const list = usersSnap.docs
                    .map((d) => ({ id: d.id, ...(d.data() as any) }))
                    .filter((u) => u.id !== loggedInUser?.id);
                setUsers(list);
            } finally {
                setLoadingUsers(false);
            }
        };

        if (loggedInUser) fetchUsers();
    }, [loggedInUser]);

    const filteredUsers = users.filter((u) =>
        (u.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current();
        };
    }, []);


    useEffect(() => {
        if (chatId) {
            startListeningMessages(chatId);
        }
    }, [chatId]);

    if (authLoading) {
        return (
            <Loading />
        );
    }

    if (!loggedInUser) {
        return (
            <div
                style={{
                    height: "100vh",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AuthModal open={true} onClose={() => { }} onSelect={() => { }} />
            </div>
        );
    }


    return (

        <div style={{
            marginTop: "100px",
            marginBottom: "50px",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* TOP SECTION */}
            <div className="title-wrapper" style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Users size={32} color="var(--gold-light)" />
                    <span className="heading" style={{ fontSize: "52px", fontFamily: "Playfair Display", margin: 0 }}>
                        Community Chats
                    </span>
                </div>

                <p className="descr-community" style={{ marginTop: 10, fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 700 }}>
                    Let’s look out for our little strays together.<br />
                    Share a sighting to help someone reach them. ❤️
                </p>
            </div>

            {/* MAIN GRID */}
            <div
                className="community-grid"
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "340px 1fr",
                    gap: "28px",
                    padding: "0 20px 60px",
                }}
            >
                {/* LEFT PANEL */}
                {(!isMobile || !showChatPanel) && (
                    <div
                        className="left-panel"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "18px",
                            padding: "20px",
                            height: "78vh",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}
                    >
                        {/* FIXED SEARCH INPUT */}
                        <div style={{ width: "100%", marginBottom: "14px" }}>
                            <input
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "#fff",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* MEMBERS LIST */}
                        <div className="members-list fixed-scroll" style={{ flex: 1 }}>
                            {loadingUsers ? (
                                <div style={{ color: "#999" }}>Loading members...</div>
                            ) : filteredUsers.length === 0 ? (
                                <div style={{ color: "#777", fontSize: 18, textAlign: "center", paddingTop: 20 }}>No members found</div>
                            ) : (
                                filteredUsers.map((u) => (
                                    <div
                                        key={u.id}
                                        onClick={() => openChatWith(u)}
                                        style={{
                                            padding: "14px",
                                            marginBottom: "12px",
                                            borderRadius: "12px",
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                            transition: "0.25s",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                                        </div>

                                        <MessageCircle size={20} color="var(--gold-light)" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* CHAT PANEL */}
                {(!isMobile || showChatPanel) && (
                    <div
                        className="right-panel"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "18px",
                            padding: "20px",
                            height: "78vh",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Chat Header */}
                        <div
                            style={{
                                position: "relative",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                paddingBottom: 14,
                                marginBottom: 14,
                                minHeight: 40,
                                display: "flex",
                                alignItems: "center"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 0",
                                    position: "relative",
                                }}
                            >
                                {selectedUser && (
                                    <button
                                        onClick={() => setShowChatPanel(false)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "6px",
                                            color: "var(--gold-light)",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="15 18 9 12 15 6" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* NAME */}
                            <div style={{ fontSize: 18, fontWeight: 600, marginLeft: isMobile ? 2 : 12 }}>
                                {selectedUser ? selectedUser.name : "Just pick who you wanna chat with ✨"}
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesScrollRef}
                            className="chat-messages fixed-scroll"
                            onScroll={handleScroll}
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.03)",
                                padding: 16,
                                borderRadius: 12,
                            }}
                        >
                            {chatId == null ? (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: 0.7,
                                    }}
                                >
                                    <MessageCircle size={70} color="var(--gold-light)" />
                                    <div style={{ marginTop: 12, fontSize: 17, color: "#fff" }}>
                                        Message
                                    </div>
                                </div>

                            ) : messages.length === 0 ? (
                                <div
                                    className="say-hello-mobile"
                                    style={{ color: "#777", fontSize: 18, textAlign: "center", paddingTop: 20 }}
                                >
                                    say hello 👋
                                </div>

                            ) : (
                                messages.map((m) => {
                                    const mine = m.senderId === loggedInUser.id;
                                    return (
                                        <div
                                            key={m.id}
                                            className="chat-message-wrapper"
                                            style={{
                                                display: "flex",
                                                justifyContent: mine ? "flex-end" : "flex-start",
                                            }}
                                        >
                                            <div
                                                className="chat-bubble"
                                                style={{
                                                    maxWidth: "75%",
                                                    padding: "12px 16px",
                                                    background: mine ? "var(--gold-light)" : "rgba(255,255,255,0.06)",
                                                    color: mine ? "#000" : "#fff",
                                                    borderRadius: 12,
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                                                }}
                                            >
                                                <div>{m.text}</div>

                                                <div
                                                    className="chat-time"
                                                    style={{
                                                        fontSize: 10,
                                                        opacity: 0.5,
                                                        marginTop: 6,
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    {m.createdAt?.toDate
                                                        ? new Date(m.createdAt.toDate()).toLocaleTimeString("en-IN", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                            timeZone: "Asia/Kolkata",
                                                        })
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>

                                    );
                                })
                            )}
                        </div>

                        {/* Input */}
                        <div className="message-input-row" style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            <input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Message…"
                                disabled={!selectedUser}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    borderRadius: 12,
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                    fontSize: 14,
                                }}
                            />

                            <button
                                onClick={sendMessage}
                                disabled={!selectedUser || !messageText.trim()}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: 12,
                                    background: messageText.trim() ? "var(--gold-light)" : "rgba(255,255,255,0.05)",
                                    color: messageText.trim() ? "#000" : "#777",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    fontWeight: 600,
                                    cursor: messageText.trim() ? "pointer" : "default",
                                    transition: "0.25s",
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* RESPONSIVE & UTILITY STYLES */}
            <style jsx>{`
        :root {
          --gold-light: #d8c48d;
        }

        .say-hello-mobile {
  font-size: 12px !important;
  padding-top: 40px !important;
}


        /* Make internal scroll areas hidden but scrollable */
        .fixed-scroll {
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
        }
        .fixed-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
          width: 0;
          height: 0;
        }

        /* Desktop baseline (keeps your original styling) */
        .community-grid {
          /* default set inline — desktop uses grid columns */
        }

        /* Tablet */
        @media (max-width: 1100px) and (min-width: 600px) {
          .community-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }

          .left-panel,
          .right-panel {
            height: 70vh !important;
          }
        }

        /* Mobile */
        @media (max-width: 599px) {
        
          .community-grid {
            display: block !important;
          }

          .title-wrapper {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .title-wrapper h1,
          .heading {
            font-size: 22px !important;
          }

          .descr-community{
           font-size: 9px !important;
          }
          .left-panel,
          .right-panel {
            height: auto !important;
            margin-bottom: 18px;
            padding: 14px !important;
            border-radius: 12px !important;
          }

          .members-list {
            max-height: 240px;
            overflow-y: auto;
          }

          .chat-messages {
            max-height: 350px;
            overflow-y: auto;
          }

          .message-input-row {
            flex-direction: column !important;
          }

          .message-input-row button {
            width: 100% !important;
            margin-top: 10px !important;
          }

          .left-panel .members-list > div,
          .left-panel .members-list > * {
            margin-bottom: 10px !important;
          }
        }
          /* ------------- TABLET (max-width: 1100px) ------------- */
@media (max-width: 1100px) and (min-width: 600px) {
  

  /* LEFT PANEL USER BOX */
  .left-panel .members-list > div {
    padding: 10px !important;
    margin-bottom: 8px !important;
  }

  .left-panel .members-list div div {
    font-size: 13px !important;
  }

  .left-panel svg {
    width: 16px !important;
    height: 16px !important;
  }

  /* CHAT HEADER */
  .right-panel {
    padding: 14px !important;
  }

  .right-panel .chat-header-name {
    font-size: 15px !important;
  }

  /* MESSAGE BOX HEIGHT */
  .chat-messages {
    max-height: 420px !important;
  }

  /* INPUT + SEND */
  .message-input-row input {
    padding: 10px 12px !important;
    font-size: 12px !important;
  }

  .message-input-row button {
    padding: 10px 14px !important;
    font-size: 13px !important;
  }
}


/* ------------- MOBILE (max-width: 599px) ------------- */
@media (max-width: 599px) {

  /* LEFT PANEL LIST BOXES */
  .left-panel .members-list > div {
    padding: 10px !important;
    margin-bottom: 8px !important;
  }

  .left-panel .members-list div div {
    font-size: 12px !important;
  }

  .left-panel svg {
    width: 14px !important;
    height: 14px !important;
  }

  /* CHAT HEADER TEXT + ARROW */
  .right-panel {
    padding: 12px !important;
  }

  .right-panel .chat-header-name {
    font-size: 14px !important;
    margin-left: 4px !important;
  }

  .right-panel button svg {
    width: 18px !important;
    height: 18px !important;
  }

  /* Make underline area tighter */
  .right-panel > div:first-child {
    padding-bottom: 8px !important;
    margin-bottom: 10px !important;
  }

  /* MESSAGE AREA MORE HEIGHT */
  .chat-messages {
    max-height: 460px !important;
  }

  /* INPUT + SEND SMALL */
  .message-input-row input {
    padding: 10px 12px !important;
    font-size: 12px !important;
  }

  .message-input-row button {
    padding: 10px 12px !important;
    font-size: 12px !important;
  }
}

@media (max-width: 640px) {
  /* message bubble */
  .chat-bubble {
    max-width: 80% !important;
    padding: 8px 10px !important;
    border-radius: 10px !important;
    font-size: 13px !important;
  }

  /* sender name above message */
  .chat-sender-name {
    font-size: 10px !important;
    margin-bottom: 4px !important;
  }

  /* timestamp inside bubble */
  .chat-time {
    font-size: 9px !important;
    margin-top: 4px !important;
  }

  /* header: back arrow + username */
  .chat-header-name {
    font-size: 16px !important;
  }

  .chat-header-icon {
    transform: scale(0.8) !important;
  }

  /* spacing between bubbles */
  .chat-message-wrapper {
    margin-bottom: 8px !important;
  }
}/* MOBILE FIXED HEIGHT FOR CHAT MESSAGES */
@media (max-width: 599px) {
  .chat-messages {
    height: 40vh !important;       /* FIXED HEIGHT */
    max-height: 40vh !important;
    overflow-y: auto !important;
  }
}

/* FINAL FIX — DESKTOP MESSAGE SPACING */
@media (min-width: 600px) {
  .chat-message-wrapper {
    margin-bottom: 16px !important;
  }
}


      `}</style>

        </div>
    );
}
