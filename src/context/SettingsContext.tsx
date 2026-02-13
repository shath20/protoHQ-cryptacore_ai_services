
import React, { createContext, useContext, useState, useEffect } from 'react';

interface RiskSettings {
    highRiskThreshold: number;
    mediumRiskThreshold: number;
    autoFlagThreshold: number;
    enableAiDetection: boolean;
    enableSentimentAnalysis: boolean;
}

interface SettingsContextType {
    settings: RiskSettings;
    updateSettings: (newSettings: Partial<RiskSettings>) => void;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS: RiskSettings = {
    highRiskThreshold: 70,
    mediumRiskThreshold: 40,
    autoFlagThreshold: 85,
    enableAiDetection: true,
    enableSentimentAnalysis: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<RiskSettings>(() => {
        const saved = localStorage.getItem('cryptacore_settings');
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    useEffect(() => {
        localStorage.setItem('cryptacore_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<RiskSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
