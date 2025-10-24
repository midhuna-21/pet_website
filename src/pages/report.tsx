import { useState, useEffect, useRef } from "react";

export default function ReportPage() {
  const [petName, setPetName] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef(null);
  const wrapperRef = useRef(null);

  // Initialize Google Places Autocomplete Service
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    };
    document.head.appendChild(script);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat: latitude, lng: longitude };
            
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === "OK" && results[0]) {
                setLocation(results[0].formatted_address);
              }
            });
          } else {
            setLocation(`${latitude}, ${longitude}`);
          }
        },
        (error) => {
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ petName, location, photo });
    alert("Report submitted!");
    setPetName("");
    setLocation("");
    setPhoto(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",    
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center", color: "#1f2937" }}>
          Report a Stray
        </h2>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontWeight: 500, color: "#374151" }}>Pet Name</span>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Enter pet's name"
            required
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontWeight: 500, color: "#374151" }}>Location</span>
          <div ref={wrapperRef} style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: "8px", position: "relative" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="Enter location"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 10px 10px 36px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {/* Map Icon */}
                <svg
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "18px",
                    height: "18px",
                    color: "#6b7280",
                    pointerEvents: "none",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              
              <button
                type="button"
                onClick={getCurrentLocation}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Use current location"
              >
                <svg
                  style={{ width: "18px", height: "18px", color: "#10b981" }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </svg>
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  marginTop: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 10,
                }}
              >
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg
                        style={{ width: "16px", height: "16px", color: "#6b7280", flexShrink: 0 }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>{suggestion.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontWeight: 500, color: "#374151" }}>Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
        </label>

        <button
          type="submit"
          onClick={handleSubmit}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#10b981",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "15px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}