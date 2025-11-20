"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, MapPin, Calendar, Plus, X, Upload } from 'lucide-react';
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import GooglePlacesAutocomplete from '../hooks/useLoadGoogleMaps';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from '../components/Header';
import React from "react";

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

  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    strayDetails: '',
    location: '',
    photo: null as File | null,
    photoPreview: null as string | null
  });

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

  // add/update handler
  const handleAddOrUpdateTask = async () => {
    if (!currentUser) {
      setShowAddModal(false);
      setShowAuthModal(true);
      return;
    }

    if (!newTask.taskName || !newTask.description || !newTask.location) {
      alert('Please fill all required fields');
      return;
    }

    const userId = currentUser.uid;
    const userName = currentUser.displayName || "User";
    const avatar = userName.charAt(0).toUpperCase();

    try {
      let photoURL = "";

      if (newTask.photo) {
        const storageRef = ref(storage, `tasks/${Date.now()}_${newTask.photo.name}`);
        await uploadBytes(storageRef, newTask.photo);
        photoURL = await getDownloadURL(storageRef);
      }

      if (editTaskId) {
        // Update existing task
        const taskRef = doc(db, "tasks", editTaskId);
        await updateDoc(taskRef, {
          taskName: newTask.taskName,
          description: newTask.description,
          strayDetails: newTask.strayDetails,
          location: newTask.location,
          photo: photoURL || newTask.photoPreview,
        });

        setTasks(prev =>
          prev.map(t =>
            t.id === editTaskId
              ? { ...t, taskName: newTask.taskName, description: newTask.description, strayDetails: newTask.strayDetails, location: newTask.location, photo: photoURL || newTask.photoPreview }
              : t
          )
        );
      } else {
        // Add new task
        const entry = {
          taskName: newTask.taskName,
          description: newTask.description,
          strayDetails: newTask.strayDetails,
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
              strayDetails: newTask.strayDetails,
              location: newTask.location,
              photo: photoURL,
            }
          ]
        };

        const docRef = await addDoc(collection(db, "tasks"), entry);
        setTasks([{ id: docRef.id, ...entry }, ...tasks]);
      }

      setShowAddModal(false);
      setEditTaskId(null);

      setNewTask({
        taskName: '',
        description: '',
        strayDetails: '',
        location: '',
        photo: null,
        photoPreview: null
      });

    } catch (error) {
      console.error("Error adding/updating task:", error);
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

  // derive your tasks and others
  const yourTasks = tasks.filter(task =>
    task.completedBy?.some((t: any) => t.userId === currentUser?.uid)
  );

  const othersTasks = tasks.filter(task =>
    !task.completedBy?.some((t: any) => t.userId === currentUser?.uid)
  );

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
                      <strong style={{ color: "#d8c48d" }}>Stray Details:</strong> <span style={{ color: "rgba(255,255,255,0.85)" }}>{c.strayDetails}</span>
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
                            strayDetails: c.strayDetails,
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
    <div style={{ marginTop: "100px",
          marginBottom: "50px",minHeight: "100vh", background: "#000", color: "#fff",fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
    
      <div style={{ maxWidth: 1100, margin: "0 auto",   }}>
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
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
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
            <Plus size={18} /> Add Completed Task
          </button>
        </div>

        {/* YOUR TASKS */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ color: "#d8c48d", margin: "0 0 12px 0", fontSize: 20, fontWeight: 700 }}>Your Tasks</h2>
          <p style={{ margin: 0, marginBottom: 18, color: "rgba(255,255,255,0.6)" }}>
            Tasks you've reported.
          </p>

          <div>
            {yourTasks.length === 0 ? (
              <div style={{  borderRadius: 12, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.6)" }}>
                You haven’t completed any tasks yet.
              </div>
            ) : (
              yourTasks.map(task => TaskCard(task))
            )}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.04)", margin: "30px 0" }} />

        {/* COMMUNITY TASKS */}
        <section>
          <h2 style={{ color: "#d8c48d", margin: "0 0 12px 0", fontSize: 20, fontWeight: 700 }}>Community Tasks</h2>
          <p style={{ margin: 0, marginBottom: 18, color: "rgba(255,255,255,0.6)" }}>
            See what other members are doing.
          </p>

          <div>
            {othersTasks.length === 0 ? (
              <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.6)" }}>
                No community tasks yet.
              </div>
            ) : (
              othersTasks.map(task => TaskCard(task))
            )}
          </div>
        </section>
      </div>

      {/* ADD / EDIT MODAL (CLASSIC STYLED) */}
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
        maxWidth: 720,
        background: "rgba(20,20,20,0.75)",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 25px 80px rgba(0,0,0,0.75)",
        padding: "32px 28px",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "Playfair Display",
            fontSize: 30,
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
            padding: 6,
            cursor: "pointer",
          }}
        >
          <X size={20} color="#fff" />
        </button>
      </div>

      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 22 }}>
        {editTaskId
          ? "Update your recorded stray assistance."
          : "Share details about the task you completed helping a stray."}
      </p>

      {/* FORM CONTENT */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          placeholder="Task Name"
          value={newTask.taskName}
          onChange={(e) =>
            setNewTask({ ...newTask, taskName: e.target.value })
          }
          style={modalInput}
        />

        <textarea
          placeholder="Description (what you did)"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          style={{ ...modalInput, minHeight: 100 }}
        />

        <input
          placeholder="Stray Details"
          value={newTask.strayDetails}
          onChange={(e) =>
            setNewTask({ ...newTask, strayDetails: e.target.value })
          }
          style={modalInput}
        />

        {/* LOCATION */}
        <div>
          <div
            style={{
              marginBottom: 8,
              color: "rgba(255,255,255,0.75)",
              fontSize: 14,
            }}
          >
            Location
          </div>
          <GooglePlacesAutocomplete
            onSelect={handleSelect}
            error={errors.location}
          />
        </div>

        {/* PHOTO UPLOAD */}
        <div>
          {!newTask.photoPreview ? (
            <label
              style={{
                border: "1px dashed rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.05)",
                padding: 20,
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Upload size={30} color="#d8c48d" />
              <p style={{ marginTop: 8, color: "#d8c48d", fontSize: 14 }}>
                Upload Photo (optional)
              </p>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={newTask.photoPreview}
                style={{
                  width: 200,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />

              <button
                onClick={() =>
                  setNewTask({ ...newTask, photoPreview: null, photo: null })
                }
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 6,
                  cursor: "pointer",
                }}
              >
                <X size={14} color="#fff" />
              </button>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <button
            onClick={handleAddOrUpdateTask}
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: 10,
              background: "linear-gradient(90deg,#b89c58,#d8c48d)",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              color: "#000",
            }}
          >
            {editTaskId ? "Update Task" : "Add Task"}
          </button>

          <button
            onClick={() => {
              setShowAddModal(false);
              setEditTaskId(null);
            }}
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              cursor: "pointer",
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
              {/* You likely have a sign-in widget in your project; if not this is a placeholder */}
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.7)" }}>Please sign in using the login widget in the header.</div>
              </div>
            </div>
          </div>
        </div>
      )}
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
