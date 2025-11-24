"use client";

import { Camera, MapPin, Heart, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "../hooks/useLoadGoogleMaps";
import { db, storage, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import LoginWidget from "../components/LoginWidget";
import AuthModal from "../components/AuthModal";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";


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

export default function ReportPage() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [petName, setPetName] = useState<string>("");
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/strays");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, router]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && showLoginModal) setShowLoginModal(false);
  }, [user, showLoginModal]);

  const handleSelect = (place: any) => {
    if (place?.geometry && place.geometry.location) {
      setSelectedLocation({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      setSelectedLocation({ address: place.formatted_address });
    }
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPetPhoto(null);
  };

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {};
    if (!petName.trim()) newErrors.petName = "Please enter a name.";
    if (!petPhoto) newErrors.photo = "Please upload a photo.";
    if (!selectedLocation) newErrors.location = "Please select a location.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!user) {
  //     setShowAuthModal(true);
  //     return;
  //   }

  //   if (!validateFields()) return;

  //   try {
  //     setLoading(true);
  //     const storageRef = ref(storage, `pets/${Date.now()}_${petPhoto?.name}`);
  //     await uploadBytes(storageRef, petPhoto!);
  //     const photoURL = await getDownloadURL(storageRef);

  //     await addDoc(collection(db, "pets"), {
  //       name: petName,
  //       photoURL,
  //       location: selectedLocation?.address,
  //       coordinates: {
  //         lat: selectedLocation?.lat,
  //         lng: selectedLocation?.lng,
  //       },
  //       createdAt: serverTimestamp(),
  //       userId: user.uid,
  //     });

  //     setShowSuccessModal(true);
  //     setPetName("");
  //     setPetPhoto(null);
  //     setImage(null);
  //     setSelectedLocation(null);
  //     setErrors({});
  //   } catch (err: any) {
  //     console.error("Error saving pet data:", err);
  //     alert("Error saving data: " + err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // === container styles ===
 
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    setShowAuthModal(true);
    return;
  }

  if (!validateFields()) return;

  try {
    setLoading(true); // button shows "Saving..."

    const storageRef = ref(storage, `pets/${Date.now()}_${petPhoto?.name}`);
    await uploadBytes(storageRef, petPhoto!);
    const photoURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "pets"), {
      name: petName,
      photoURL,
      location: selectedLocation?.address,
      coordinates: {
        lat: selectedLocation?.lat,
        lng: selectedLocation?.lng,
      },
      createdAt: serverTimestamp(),
      userId: user.uid,
    });

    setTimeout(() => {
      router.push("/strays");
    }, 2000);

  } catch (err: any) {
    console.error("Error saving pet data:", err);
    alert("Error saving data: " + err.message);
  } finally {
    // keep loading true until redirect!
  }
};

  const CONTAINER_STYLE: React.CSSProperties = {
    maxWidth: "1200px",
    padding: "70px 55px",
    margin: "0 auto",
    boxSizing: "border-box",
    width: "100%",
  };

  return (
    <div>
      <style>{`
        /* ====== RESPONSIVE STYLES ====== */

        @media (max-width: 1024px) {
        
 .no-focus-input:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  /* hide placeholder after typing */
  .no-focus-input:not(:placeholder-shown)::placeholder {
    opacity: 0;
  }
          .two-col {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .left-text h1 {
            font-size: 36px !important;
            margin-bottom: 12px !important;
          }
          .left-text p {
            font-size: 16px !important;
            line-height: 1.5 !important;
            max-width: 100% !important;
          }
          .form-wrapper {
            max-width: 100% !important;
            margin: 0 !important;
          }
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 40px 22px !important;
          }
          .left-text h1 {
            font-size: 30px !important;
          }
         
        }

        @media (max-width: 480px) {
          .left-text h1 {
            font-size: 22px !important;
            line-height: 1.25 !important;
            margin-bottom: 6px !important;
          }
       
          input, textarea, select {
            font-size: 13px !important;
          }
          input::placeholder {
            font-size: 12px !important;
            opacity: 0.7 !important;
          }
          .form-wrapper label {
            font-size: 13px !important;
            margin-bottom: 4px !important;
          }
          .form-wrapper button {
            font-size: 14px !important;
            padding: 10px 0 !important;
          }
          .page-container {
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
          .two-col {
            gap: 20px !important;
          }
                 .left-text .hero-title {
    font-size: 22px !important;
    line-height: 1.1 !important;
  }
       .left-text p {
    font-size:9px !important;
    line-height: 1.2 !important;
    margin-top: 5px !important;
    
  }
       
        }
       
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          padding: "40px 0",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          position: "relative",
          background: "#000",
        }}
      >
        {/* dot bg */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            opacity: 0.03,
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        <div
          className="page-container"
          style={{ ...CONTAINER_STYLE, paddingTop: "100px", paddingBottom: "100px" }}
        >
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "start",
            }}
          >
            {/* LEFT TEXT */}
            <div className="left-text">
              <span
                className="hero-title"
                style={{
                  fontSize: "52px",
                  color: "#fff",
                  fontFamily: "Playfair Display",
                  fontWeight: 700,
                  marginBottom: "20px",
                  lineHeight: "1.0",
                  letterSpacing: "-1px",
                }}
              >
                Report a stray,
                <span style={{ color: "var(--gold-light)", display: "block" }}>
                  show some kindness.
                </span>
              </span>


              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.3",
                  color: "rgba(255,255,255,0.65)",
                  maxWidth: "500px",
                }}
              >
                You know, just letting someone know about a stray actually helps them get a bit of food, care, and some kind of attention. They don’t have anyone to speak for them, so even your tiny nudge makes things easier for the people who look out for them. It’s such a small thing from your side, but it ends up giving that little one a better moment in their day. </p>
            </div>

            {/* FORM */}
            <form
              className="form-wrapper"
              onSubmit={handleSubmit}
              style={{ width: "100%", maxWidth: "420px" }}
            >
              <div style={{ marginBottom: "24px" }}>
                <label style={{ color: "rgba(255,255,255,0.85)", fontSize: 15 }}>Who’s this lovely soul?</label>
                <input
                  type="text"
                  value={petName}
                  placeholder="Shadow, Luna, Ranger…"
                  onChange={(e) => setPetName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff",
                    fontSize: "15px",

                    outline: "none",
                    boxShadow: "none",
                  }}
                  className="no-focus-input"
                />
                {errors.petName && <p style={{ color: "#e04f5f" }}>{errors.petName}</p>}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, marginBottom: "6px", display: 'flex' }}>Share a photo</label>

                {!image ? (
                  <label
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "32px 0",
                      textAlign: "center",
                      border: "1px dashed rgba(255,255,255,0.18)",
                      borderRadius: "8px",

                      cursor: "pointer",
                    }}
                  >
                    <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
                    <Upload size={28} color="rgba(255,255,255,0.4)" />
                  </label>
                ) : (
                  <div style={{ position: "relative" }}>
                    {/* <img src={image} style={{ width: "100%", borderRadius: 8 }} /> */}
                    <img
                      src={image}
                      style={{
                        width: "100%",
                        height: "260px",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(255,255,255,0.8)",
                        borderRadius: "50%",
                        padding: 3,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <X size={16} color="#000" />
                    </button>
                  </div>
                )}

                {errors.photo && <p style={{ color: "#e04f5f" }}>{errors.photo}</p>}
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, marginBottom: "6px", display: 'flex' }}>Where did you meet them?</label>
                <GooglePlacesAutocomplete onSelect={handleSelect} error={errors.location} />
                {errors.location && <p style={{ color: "#e04f5f" }}>{errors.location}</p>}
              </div>

              {/* <button
                type="submit"
                style={{
                  width: "100%",
                  fontSize: 15,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: 'center',
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
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit Report"}
              </button> */}

              <button
  type="submit"
  disabled={loading}
  style={{
    width: "100%",
    fontSize: 15,
    padding: "12px 18px",
    background: loading
      ? "rgba(255,255,255,0.3)"
      : "linear-gradient(90deg,#b89c58,#d8c48d)",
    color: loading ? "#333" : "#000",
    borderRadius: 12,
    fontWeight: 700,
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "0.25s",
  }}
>
  {loading ? "Saving..." : "Submit Report"}
</button>

            </form>
          </div>
        </div>
      </div>
      {/* {loading && <Loading />} */}

    </div>
  );
}
