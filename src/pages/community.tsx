"use client";
import React, { useEffect, useRef, useState } from "react";
import { Users, MessageCircle } from "lucide-react";
import { db } from "../lib/firebase";
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
import AuthModal from "../components/AuthModal";
import Header from "../components/Header";

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
      } else {
        setAuthUser(u);
        setShowAuthModal(false);
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            setLoggedInUser({ id: u.uid, name: snap.data().name || "User" });
          } else {
            setLoggedInUser({ id: u.uid, name: "User" });
          }
        } catch {
          setLoggedInUser({ id: u.uid, name: "User" });
        }
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
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        // padding: "40px 20px",
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          marginTop: "80px",
          marginBottom: "50px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Users size={32} color="var(--gold-light)" />
          <h1 style={{ fontSize: "42px", fontFamily: "Playfair Display" }}>
            Community Chats
          </h1>
        </div>

        <p
          style={{
            marginTop: 10,
            fontSize: 17,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 500,
          }}
        >
          Let’s look out for our little strays together.<br />
          Share a sighting to help someone reach them. ❤️
        </p>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "28px",
        }}
      >
        {/* LEFT PANEL */}
        {/* LEFT PANEL */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            padding: "20px",
            height: "78vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",             // ★ prevents inner overflow
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
                boxSizing: "border-box",     // ★ ensures perfect inside-fit
                outline: "none",
              }}
            />
          </div>

          {/* MEMBERS LIST */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loadingUsers ? (
              <div style={{ color: "#999" }}>Loading members...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ color: "#777" }}>No members found</div>
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


        {/* CHAT PANEL */}
        <div
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
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 14,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {selectedUser ? selectedUser.name : "Select a user"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4,
              }}
            >
              You: {loggedInUser?.name}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesScrollRef}
            onScroll={handleScroll}
            style={{
              flex: 1,
              overflowY: "auto",
              background: "rgba(255,255,255,0.03)",
              padding: 16,
              borderRadius: 12,
            }}
          >
            {chatId == null ? (
              <div style={{ color: "#777" }}>Open a chat to start messaging</div>
            ) : messages.length === 0 ? (
              <div style={{ color: "#777" }}>
                No messages yet — say hello 👋
              </div>
            ) : (
              messages.map((m) => {
                const mine = m.senderId === loggedInUser.id;
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: mine ? "flex-end" : "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "12px 16px",
                        background: mine
                          ? "var(--gold-light)"
                          : "rgba(255,255,255,0.06)",
                        color: mine ? "#000" : "#fff",
                        borderRadius: 12,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                      }}
                    >
                      {!mine && (
                        <div
                          style={{
                            fontSize: 11,
                            opacity: 0.7,
                            marginBottom: 6,
                          }}
                        >
                          {m.senderName}
                        </div>
                      )}

                      <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>

                      <div
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
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                selectedUser ? `Message ${selectedUser.name}...` : "Select user"
              }
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
                background: messageText.trim()
                  ? "var(--gold-light)"
                  : "rgba(255,255,255,0.05)",
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
      </div>
    </div>
  );
}
