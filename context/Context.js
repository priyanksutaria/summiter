import React, { createContext, useState } from "react";

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [nearbyPeak, setNearbyPeak] = useState(null);
    const [certificateUri, setCertificateUri] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);

    return (
        <OnboardingContext.Provider
            value={{
                certificateUri,
                setCertificateUri,
                capturedPhoto, 
                setCapturedPhoto,
                nearbyPeak,
                setNearbyPeak,
                lat,
                setLat,
                long,
                setLong
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};