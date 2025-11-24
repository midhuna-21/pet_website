"use client";

import {
    GoogleMap,
    Marker,
    useLoadScript,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import Loading from "./Loading";

interface StraySpot {
    id: string;
    lat: number;
    lng: number;
    name?: string;
    location?: string;
}

export default function GoogleMapWithStrayMarkers({
    spots,
}: {
    spots: StraySpot[];
}) {
    const mapRef = useRef<any>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const handleMarkerClick = (spot: StraySpot) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
        window.open(url, "_blank");
    };

    // Auto zoom to fit all markers
    useEffect(() => {
        if (!mapRef.current || spots.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        spots.forEach((spot) => {
            bounds.extend({ lat: spot.lat, lng: spot.lng });
        });

        mapRef.current.fitBounds(bounds);
    }, [spots]);

    if (!isLoaded) return <Loading />;

    return (
        <div
            className="stray-map-container"
            style={{
                width: "100%",
                height: "620px",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
            }}
        >

            <GoogleMap
                zoom={12}
                center={
                    spots.length
                        ? { lat: spots[0].lat, lng: spots[0].lng }
                        : { lat: 20.5937, lng: 78.9629 } // Defaults to India
                }
                onLoad={(map) => {
                    mapRef.current = map; // important: do NOT return map here
                }}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#f5f5f5" }] },

                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#2c2c2c" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#0e1626" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d5d5d5" }],
                        },
                    ],
                }}
            >
                {spots.map((spot) => (
                    <Marker
                        key={spot.id}
                        position={{ lat: spot.lat, lng: spot.lng }}
                        onClick={() => handleMarkerClick(spot)}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                    />
                ))}
            </GoogleMap>

            <style jsx global>{`
  @media (max-width: 640px) {
    .stray-map-container {
      height: 360px !important;
      border-radius: 10px !important;
    }
  }
`}</style>

        </div>
    );
}
