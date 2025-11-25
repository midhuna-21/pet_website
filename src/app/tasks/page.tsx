"use client";
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, MapPin, Calendar, Plus, X, Upload } from 'lucide-react';
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db, storage } from '../../lib/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import GooglePlacesAutocomplete from '../../hooks/useLoadGoogleMaps';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from '../../components/Header';
import React from "react";
import Loading from '../../components/Loading';

interface FormErrors {
  petName?: string;
  photo?: string;
  location?: string;
}

interface SelectedLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export default function Tasks() {
  // state (kept same logic)
  const [tasks, setTasks] = useState<any[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [pageLoading, setPageLoading] = useState(true);

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [location, setLocation] = useState("");

  const [taskError, setTaskError] = useState("");
  const [savingTask, setSavingTask] = useState(false);


  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    strayName: '',
    location: '',
    photo: null as File | null,
    photoPreview: null as string | null
  });


  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // helper to format date (kept)
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  const handleSelect = (place: any) => {
    if (place.geometry && place.geometry.location) {
      setSelectedLocation({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      setSelectedLocation({ address: place.formatted_address });
    }

    setNewTask(prev => ({
      ...prev,
      location: place.formatted_address
    }));

    setErrors(prev => ({ ...prev, location: "" }));
  };

  // fetch tasks once
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tasks"));
        let tasksData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        tasksData.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate?.() || new Date("1970");
          const dateB = b.createdAt?.toDate?.() || new Date("1970");
          return dateB.getTime() - dateA.getTime();
        });

        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // file upload preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTask({
        ...newTask,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (!currentUser) {
      setShowAddModal(false);
      setShowAuthModal(true);
      return;
    }

    if (!newTask.taskName.trim()) {
      setTaskError("Oops! You forgot the task name 😅");
      return;
    }

    if (!newTask.description.trim()) {
      setTaskError("Tell us a little about what you did! ✨");
      return;
    }

    if (!newTask.strayName.trim()) {
      setTaskError("Hey! What should we call the stray? 😄");
      return;
    }

    if (!location.trim()) {
      setTaskError("Drop the location so others know where this happened 📍");
      return;
    }

    if (!newTask.photo && !newTask.photoPreview) {
      setTaskError("A quick photo would be awesome! Snap one in 😄📷");
      return;
    }

    // Clear errors + start loading
    setTaskError("");
    setSavingTask(true);

    const userId = currentUser.uid;
    const userName = currentUser.displayName || "User";
    const avatar = userName.charAt(0).toUpperCase();

    try {
      let photoURL = "";

      // Upload image if new one
      if (newTask.photo) {
        const storageRef = ref(storage, `tasks/${Date.now()}_${newTask.photo.name}`);
        await uploadBytes(storageRef, newTask.photo);
        photoURL = await getDownloadURL(storageRef);
      }

      if (editTaskId) {
        // ---------- UPDATE TASK ----------
        const taskRef = doc(db, "tasks", editTaskId);
        await updateDoc(taskRef, {
          taskName: newTask.taskName,
          description: newTask.description,
          strayName: newTask.strayName,
          location: newTask.location,
          photo: photoURL || newTask.photoPreview,
        });

        setTasks(prev =>
          prev.map(t =>
            t.id === editTaskId
              ? {
                ...t,
                taskName: newTask.taskName,
                description: newTask.description,
                strayName: newTask.strayName,
                location: newTask.location,
                photo: photoURL || newTask.photoPreview,
              }
              : t
          )
        );

      } else {
        // ---------- ADD NEW TASK ----------
        const entry = {
          taskName: newTask.taskName,
          description: newTask.description,
          strayName: newTask.strayName,
          location: newTask.location,
          photo: photoURL,
          createdAt: serverTimestamp(),
          completedBy: [
            {
              userId,
              userName,
              avatar,
              date: formatDate(new Date().toString()),
              description: newTask.description,
              strayName: newTask.strayName,
              location: newTask.location,
              photo: photoURL,
            },
          ],
        };

        const docRef = await addDoc(collection(db, "tasks"), entry);
        setTasks([{ id: docRef.id, ...entry }, ...tasks]);
      }

      // ---------- KEEP “Adding…” / “Updating…” for 2 seconds ----------
      setTimeout(() => {
        setSavingTask(false);
        setShowAddModal(false);
        setEditTaskId(null);

        setNewTask({
          taskName: "",
          description: "",
          strayName: "",
          location: "",
          photo: null,
          photoPreview: null,
        });

      }, 2000);

    } catch (error) {
      console.error("Error adding task:", error);

      // Delay hiding loader for smooth UX
      setTimeout(() => {
        setSavingTask(false);
      }, 2000);
    }
  };

  // auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);


  const yourTasks = tasks.filter(task =>
    task.completedBy?.some((t: any) => t.userId === currentUser?.uid)
  );

  const othersTasks = tasks.filter(task =>
    !task.completedBy?.some((t: any) => t.userId === currentUser?.uid)
  );



  useEffect(() => {
    if (!showAddModal) return;

    function initAutocomplete() {
      if (!window.google || !inputRef.current) {
        setTimeout(initAutocomplete, 200);
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place) return;

        setLocation(place.formatted_address || "");

        setNewTask(prev => ({
          ...prev,
          location: place.formatted_address || ""
        }));


        if (place.geometry && place.geometry.location) {
          setSelectedLocation({
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }

    // load script if needed
    if (!document.getElementById("googleMaps")) {
      const script = document.createElement("script");
      script.id = "googleMaps";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        }&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, [showAddModal]);



  if (pageLoading) return <Loading />;


  // ---------- STYLED TASK CARD (classic look) ----------
  const TaskCard = (task: any) => (
    <div key={task.id} style={{
      background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 18,
      boxShadow: "0 12px 30px rgba(0,0,0,0.5)"
    }}>
      <div
        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
        style={{
          padding: 20,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "linear-gradient(180deg, rgba(184,156,88,0.12), rgba(184,156,88,0.06))",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(184,156,88,0.14)'
          }}>
            <CheckCircle size={20} color="#d8c48d" />
          </div>

          <div>
            <h3 style={{ margin: 0, fontFamily: "Playfair Display", fontSize: 20, fontWeight: 700, color: "#fff" }}>{task.taskName}</h3>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 6, maxWidth: 640 }}>
              {task.description}
            </div>
          </div>
        </div>

        <div>
          {expandedTask === task.id ? (
            <ChevronUp size={22} color="#d8c48d" />
          ) : (
            <ChevronDown size={22} color="rgba(255,255,255,0.5)" />
          )}
        </div>
      </div>

      {expandedTask === task.id && (
        <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }}>
          {task.completedBy?.map((c: any, i: number) => {
            const isSelf = c.userId === currentUser?.uid;

            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: "#d8c48d",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#0a0a0a'
                  }}>
                    {c.avatar}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontWeight: 700, color: "#fff" }}>{isSelf ? "You" : c.userName}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                        <Calendar size={12} /> &nbsp; {c.date}
                      </div>
                    </div>

                    {c.photo && (
                      <img src={c.photo} alt="task" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, marginTop: 12 }} />
                    )}

                    <p style={{ marginTop: 12, color: "rgba(255,255,255,0.85)" }}>{c.description}</p>

                    <div style={{ marginTop: 10, padding: 10, background: "rgba(184,156,88,0.06)", borderRadius: 8 }}>
                      <strong style={{ color: "#d8c48d" }}>Stray Details:</strong> <span style={{ color: "rgba(255,255,255,0.85)" }}>{c.strayName}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, color: "rgba(255,255,255,0.65)" }}>
                      <MapPin size={14} color="#d8c48d" /> <span>{c.location}</span>
                    </div>
                  </div>

                  {isSelf && (
                    <div style={{ marginLeft: 12 }}>
                      <button
                        onClick={() => {
                          setEditTaskId(task.id);
                          setNewTask({
                            taskName: task.taskName,
                            description: c.description,
                            strayName: c.strayName,
                            location: c.location,
                            photo: null,
                            photoPreview: c.photo || null,
                          });
                          setShowAddModal(true);
                        }}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.06)",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: 8,
                          cursor: "pointer"
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      marginTop: "100px",
      marginBottom: "50px", minHeight: "100vh", background: "#000", color: "#fff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div className="mobile-wrap" style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Title block */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily: "Playfair Display", fontSize: 44, margin: 0, fontWeight: 700, color: "#fff" }}>
            Tasks & Community Efforts
          </h1>

          <p style={{ marginTop: 10, color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 760 }}>
            Small acts, big impact — record the work you’ve done or see what others in your community are doing to help strays.
          </p>
        </div>

        {/* Add button */}
        <div className="add-btn-wrapper" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>

          <button
            onClick={() => currentUser ? setShowAddModal(true) : setShowAuthModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 18px",
              background: "linear-gradient(90deg,#b89c58,#d8c48d)",
              color: "#000",
              borderRadius: 12,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(216,196,141,0.12)",
            }}
          >
            Add Completed Task
          </button>
        </div>

        {/* YOUR TASKS */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: "#d8c48d",
              margin: "0 0 6px 0",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "Playfair Display",
            }}
          >
            Your Tasks
          </h2>

          <p
            style={{
              margin: 0,
              marginBottom: 20,
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
            }}
          >
            Tasks you've reported.
          </p>

          {/* Empty State */}
          {yourTasks.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
              }}
            >
              You haven’t completed any tasks yet.
            </div>
          ) : (
            yourTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "18px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Title */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setExpandedTask(expandedTask === task.id ? null : task.id)
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#fff",
                        fontFamily: "Playfair Display",
                        marginBottom: 6,
                      }}
                    >
                      {task.taskName}
                    </div>

                  </div>

                  {expandedTask === task.id ? (
                    <ChevronUp size={20} color="#d8c48d" />
                  ) : (
                    <ChevronDown size={20} color="#d8c48d" />
                  )}
                </div>

                {/* Expanded Content */}
                {/* Expanded Content */}
                {expandedTask === task.id && (
                  <div style={{ marginTop: 16 }}>
                    {task.completedBy?.map((entry, i) => {
                      const isSelf = entry.userId === currentUser?.uid;

                      return (
                        <div key={i} style={{ marginBottom: 18 }}>

                          {/* User Info Row + Edit Button */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 10,
                            }}
                          >
                            {/* LEFT: Avatar + Name + Date */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div
                                style={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: "50%",
                                  background: "#d8c48d",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#000",
                                  fontWeight: 700,
                                }}
                              >
                                {entry.avatar}
                              </div>

                              <div style={{ color: "#fff" }}>
                                <div style={{ fontWeight: 600 }}>
                                  {isSelf ? "You" : entry.userName}
                                </div>

                                <div
                                  style={{
                                    color: "rgba(255,255,255,0.45)",
                                    fontSize: 12,
                                    marginTop: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <Calendar size={12} /> {entry.date}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT: Edit Button (only for the user's own task entry) */}
                            {isSelf && (
                              <button
                                onClick={() => {
                                  setEditTaskId(task.id);
                                  setNewTask({
                                    taskName: task.taskName,
                                    description: entry.description,
                                    strayName: entry.strayName,
                                    location: entry.location,
                                    photo: null,
                                    photoPreview: entry.photo || null,
                                  });
                                  setLocation(entry.location);
                                  setShowAddModal(true);
                                }}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 4,
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="17"
                                  height="17"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#d8c48d"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Image */}
                          {entry.photo && (
                            <img
                              src={entry.photo}
                              style={{
                                width: 160,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: 10,
                                marginBottom: 12,
                                border: "1px solid rgba(255,255,255,0.12)",
                              }}
                            />
                          )}

                          {/* Description */}
                          <div
                            style={{
                              fontSize: 14,
                              color: "rgba(255,255,255,0.85)",
                              marginBottom: 10,
                            }}
                          >
                            {entry.description}
                          </div>

                          {/* Stray Name */}
                          <div
                            style={{
                              fontSize: 14,
                              color: "#d8c48d",
                              marginBottom: 6,
                            }}
                          >
                            Stray Name:
                            <span
                              style={{
                                color: "rgba(255,255,255,0.85)",
                                marginLeft: 6,
                              }}
                            >
                              {entry.strayName}
                            </span>
                          </div>

                          {/* Location */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: 13,
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            <MapPin size={14} color="#d8c48d" />
                            <span style={{ marginLeft: 6 }}>{entry.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            ))
          )}
        </section>


        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.04)", margin: "30px 0" }} />

        {/* COMMUNITY TASKS */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: "#d8c48d",
              margin: "0 0 6px 0",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "Playfair Display",
            }}
          >
            Community Tasks
          </h2>

          <p
            style={{
              margin: 0,
              marginBottom: 20,
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
            }}
          >
            See what other members are doing.
          </p>

          {othersTasks.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
              }}
            >
              No community tasks yet.
            </div>
          ) : (
            othersTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: "18px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Header / title row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setExpandedTask(expandedTask === task.id ? null : task.id)
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#fff",
                        fontFamily: "Playfair Display",
                        marginBottom: 6,
                      }}
                    >
                      {task.taskName}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 13,
                        maxWidth: 650,
                      }}
                    >
                      {task.description}
                    </div>
                  </div>

                  {expandedTask === task.id ? (
                    <ChevronUp size={20} color="#d8c48d" />
                  ) : (
                    <ChevronDown size={20} color="#d8c48d" />
                  )}
                </div>

                {/* Expanded details */}
                {expandedTask === task.id && (
                  <div style={{ marginTop: 16 }}>
                    {task.completedBy?.map((entry: any, i: number) => (
                      <div key={i} style={{ marginBottom: 18 }}>
                        {/* Author row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: "#d8c48d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#000",
                              fontWeight: 700,
                            }}
                          >
                            {entry.avatar}
                          </div>

                          <div style={{ color: "#fff" }}>
                            <div style={{ fontWeight: 600 }}>
                              {entry.userId === currentUser?.uid ? "You" : entry.userName}
                            </div>
                            <div
                              style={{
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 12,
                                marginTop: 2,
                              }}
                            >
                              <Calendar size={12} /> {entry.date}
                            </div>
                          </div>
                        </div>

                        {/* Photo if present */}
                        {entry.photo && (
                          <img
                            src={entry.photo}
                            style={{
                              width: 160,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 10,
                              marginBottom: 12,
                              border: "1px solid rgba(255,255,255,0.12)"
                            }}
                          />
                        )}

                        {/* Description */}
                        <div
                          style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.85)",
                            marginBottom: 10,
                          }}
                        >
                          {entry.description}
                        </div>

                        {/* Stray name */}
                        <div
                          style={{
                            fontSize: 14,
                            color: "#d8c48d",
                            marginBottom: 6,
                          }}
                        >
                          Stray Name:
                          <span
                            style={{
                              color: "rgba(255,255,255,0.85)",
                              marginLeft: 6,
                            }}
                          >
                            {entry.strayName}
                          </span>
                        </div>

                        {/* Location */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 13,
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          <MapPin size={14} color="#d8c48d" />
                          <span style={{ marginLeft: 6 }}>{entry.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </section>


      </div>

      {/* ADD / EDIT MODAL (COMPACT - OPTION B) */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0,0,0,0.60)",
            zIndex: 2500,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <style>
            {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
          </style>

          {/* MODAL BOX */}
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: "rgba(20,20,20,0.78)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.75)",
              padding: "20px 20px",
              color: "#fff",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Playfair Display",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#d8c48d",
                }}
              >
                {editTaskId ? "Edit Completed Task" : "Add Completed Task"}
              </h2>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditTaskId(null);
                }}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 5,
                  cursor: "pointer",
                }}
              >
                <X size={18} color="#fff" />
              </button>
            </div>

            <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 18, fontSize: 14 }}>
              {editTaskId
                ? "Update your recorded stray assistance."
                : "Share details about the task you completed helping a stray."}
            </p>

            {/* FORM CONTENT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* INPUTS SMALLER */}
              <input
                placeholder="Task Name"
                value={newTask.taskName}
                onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                style={{
                  ...modalInput,
                  padding: "9px 12px",
                  fontSize: 13,
                }}
              />

              <textarea
                placeholder="Description (what you did)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                style={{
                  ...modalInput,
                  minHeight: 70,
                  padding: "9px 12px",
                  fontSize: 13,
                }}
              />

              <input
                placeholder="Stray Name"
                value={newTask.strayName}
                onChange={(e) => setNewTask({ ...newTask, strayName: e.target.value })}
                style={{
                  ...modalInput,
                  padding: "9px 12px",
                  fontSize: 13,
                }}
              />

              {/* LOCATION */}
              <div style={{ width: "100%", marginBottom: 12, position: "relative" }}>
                <MapPin
                  size={14}
                  color="#d8c48d"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setNewTask(prev => ({ ...prev, location: e.target.value }));
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    paddingLeft: 40,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                    display: "block",
                  }}
                />
              </div>

              {/* PHOTO UPLOAD (smaller box) */}
              <div>
                {!newTask.photoPreview ? (
                  <label
                    style={{
                      border: "1px dashed rgba(255,255,255,0.25)",
                      background: "rgba(255,255,255,0.05)",
                      padding: 16,
                      borderRadius: 12,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Upload size={26} color="#d8c48d" />
                    <p style={{ marginTop: 6, color: "#d8c48d", fontSize: 13 }}>
                      Upload Photo (optional)
                    </p>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  </label>
                ) : (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={newTask.photoPreview}
                      style={{
                        width: 180,
                        height: 130,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    />

                    <button
                      onClick={() =>
                        setNewTask({ ...newTask, photoPreview: null, photo: null })
                      }
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.55)",
                        border: "none",
                        borderRadius: "50%",
                        padding: 4,
                        cursor: "pointer",
                      }}
                    >
                      <X size={12} color="#fff" />
                    </button>
                  </div>
                )}
              </div>

              {/* ERROR BOX (same as AuthModal) */}
              {taskError && (
                <div
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,0,0,0.1)",
                    border: "1px solid rgba(255,0,0,0.25)",
                    borderRadius: 8,
                    color: "#f87171",
                    fontSize: 13,
                  }}
                >
                  {taskError}
                </div>
              )}

              {/* BUTTONS (compact) */}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  onClick={handleAddOrUpdateTask}
                  disabled={savingTask}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "linear-gradient(90deg,#b89c58,#d8c48d)",
                    border: "none",
                    fontWeight: 700,
                    cursor: savingTask ? "not-allowed" : "pointer",
                    color: "#000",
                    fontSize: 14,
                    opacity: savingTask ? 0.6 : 1,
                  }}
                >
                  {savingTask
                    ? (editTaskId ? "Updating…" : "Adding…")
                    : (editTaskId ? "Update Task" : "Add Task")}
                </button>


                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditTaskId(null);
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* small auth modal (if needed) */}
      {showAuthModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 420, maxWidth: "95%", padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Sign in to continue</div>
                <div style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>We need your account to attach the task to your profile.</div>
              </div>
              <button onClick={() => setShowAuthModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.7)" }}>Please sign in using the login widget in the header.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
  /* MOBILE */

  @media (max-width: 599px) {

    /* Add padding to whole content */
    .mobile-wrap {
      padding-left: 14px !important;
      padding-right: 14px !important;
    }

    /* Make all text smaller */
    h1 { font-size: 26px !important; }
    h2 { font-size: 15px !important; margin-bottom: 6px !important; }
    h3 { font-size: 15px !important; }
    p, div, span, label { font-size: 13px !important; }

    /* Remove extra spacing between sentences */
    p {
      margin-bottom: 6px !important;
      margin-top: 2px !important;
      line-height: 1.25 !important;
    }

    /* Section spacing reduced */
    section {
      margin-bottom: 20px !important;
    }

    /* Remove spacing before community section */
    hr {
      margin: 16px 0 !important;
    }

    /* Make “Add Completed Task” button small & aligned left */
    .add-btn-wrapper {
      justify-content: flex-start !important;
      margin-bottom: 12px !important;
    }
    .add-btn-wrapper button {
      padding: 8px 9px !important;
      font-size: 12px !important;
      border-radius: 8px !important;
    }

    /* Task Cards compact */
    div[style*="borderRadius: 16"] {
      padding: 10px !important;
      margin-bottom: 12px !important;
    }
    div[style*="padding: 20"] {
      padding: 12px !important;
    }

    /* Avatar, icons smaller */
    img { max-height: 150px !important; }

    /* Modal compact */
    div[style*="maxWidth: 720"] {
      padding: 18px !important;
      max-width: 92% !important;
    }
  }

  /* TABLET */
  @media (min-width: 600px) and (max-width: 1024px) {
    h1 { font-size: 34px !important; }
    h2 { font-size: 17px !important; }
    div, span, p { font-size: 14px !important; }
    .mobile-wrap {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
    .add-btn-wrapper button {
      padding: 10px 14px !important;
      font-size: 14px !important;
    }
  }

  /* ============================
   MOBILE (max-width: 599px)
   Make the Add Task Modal Responsive
   ============================ */
@media (max-width: 599px) {

  /* Modal container */
  div[style*="maxWidth: 720"] {
    width: 94% !important;
    padding: 16px !important;
    border-radius: 14px !important;
    margin: 0 3% !important;
  }

  /* Modal title */
  div[style*="font-family: Playfair Display"][style*="font-size: 30px"] {
    font-size: 20px !important;
  }

  /* Description under title */
  div[style*="margin-bottom: 22px"],
  p[style*="margin-bottom: 22px"] {
    font-size: 12px !important;
    margin-bottom: 14px !important;
  }

  /* Inputs */
  input,
  textarea {
    font-size: 12px !important;
    padding: 10px 12px !important;
    border-radius: 8px !important;
  }

  textarea {
    min-height: 80px !important;
  }

  /* Google Places component wrapper */
  div[style*="margin-bottom: 8px"] + div {
    width: 100% !important;
  }

  /* Upload box */
  label[style*="dashed"] {
    padding: 14px !important;
  }

  label[style*="dashed"] p {
    font-size: 12px !important;
  }

  /* Uploaded Image Preview */
  div[style*="position: absolute"] + img,
  img[style*="height: 150"] {
    width: 100% !important;
    height: auto !important;
    max-height: 200px !important;
    object-fit: cover !important;
  }

  /* Button row: stack vertically */
  div[style*="display: flex"][style*="gap: 12px"] {
    flex-direction: column !important;
  }

  div[style*="display: flex"][style*="gap: 12px"] button {
    width: 100% !important;
    font-size: 13px !important;
    padding: 10px 12px !important;
  }
}


/* ============================
   TABLET (600px – 1024px)
   Slight adjustments only
   ============================ */
@media (min-width: 600px) and (max-width: 1024px) {

  /* Modal box padding */
  div[style*="maxWidth: 720"] {
    padding: 22px !important;
    width: 90% !important;
  }

  /* Title */
  div[style*="font-family: Playfair Display"][style*="font-size: 30px"] {
    font-size: 26px !important;
  }

  input,
  textarea {
    font-size: 13px !important;
    padding: 11px 13px !important;
  }

  textarea {
    min-height: 100px !important;
  }

  /* Upload preview */
  img[style*="height: 150"] {
    max-height: 230px !important;
  }

  /* Button adjustments */
  div[style*="display: flex"][style*="gap: 12px"] button {
    padding: 12px 14px !important;
    font-size: 14px !important;
  }
}

`}</style>

      <style>
        {`
.pac-container {
  background: rgba(10,10,10,0.92) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
  border-radius: 12px !important;
  backdrop-filter: blur(6px) !important;
  z-index: 9999999 !important;
}

.pac-item {
  padding: 12px 16px !important;
  color: rgba(255,255,255,0.85) !important;
  font-size: 14px !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  background: transparent !important;
}

.pac-item:last-child {
  border-bottom: none !important;
}

.pac-item .pac-item-query {
  color: #d8c48d !important;
  font-weight: 600 !important;
}

.pac-item span {
  color: rgba(255,255,255,0.55) !important;
}

.pac-icon {
  filter: brightness(0) invert(1) sepia(80%) saturate(300%) hue-rotate(20deg);
  opacity: 0.8 !important;
}

.pac-item:hover,
.pac-item-selected {
  background: rgba(255,255,255,0.08) !important;
}
`}
      </style>

    </div>
  );
}

/* Shared styles */
const modalInput: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#fff',
  fontSize: 14,
  outline: 'none'
};
