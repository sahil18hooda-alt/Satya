"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type TabType = 'rumor' | 'logic' | 'deepfake' | 'voice' | 'accessibility' | 'game' | 'dividend' | 'news' | 'margin';
export type RumorSubTabType = 'text' | 'image' | 'url';
export type LogicSubTabType = 'rationale' | 'basis' | 'citations';
export type DeepfakeSubTabType = 'detector' | 'heatmap' | 'extension';
export type VoiceSubTabType = 'assistant' | 'upload';
export type AccessibilitySubTabType = 'visual' | 'hearing' | 'physical' | 'cognitive' | 'language' | 'literacy' | 'health' | 'legal';
export type GameSubTabType = 'ONOE' | 'CLUSTER' | 'ROLLING';
export type DividendSubTabType = 'receipt' | 'budget' | 'scale' | 'mcc';
export type NewsSubTabType = 'newsroom' | 'trending';
export type MarginSubTabType = 'reality' | 'simulator';

interface TabContextType {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    rumorSubTab: RumorSubTabType;
    setRumorSubTab: (tab: RumorSubTabType) => void;
    logicSubTab: LogicSubTabType;
    setLogicSubTab: (tab: LogicSubTabType) => void;
    deepfakeSubTab: DeepfakeSubTabType;
    setDeepfakeSubTab: (tab: DeepfakeSubTabType) => void;
    voiceSubTab: VoiceSubTabType;
    setVoiceSubTab: (tab: VoiceSubTabType) => void;
    accessibilitySubTab: AccessibilitySubTabType | null;
    setAccessibilitySubTab: (tab: AccessibilitySubTabType | null) => void;
    gameSubTab: GameSubTabType | null;
    setGameSubTab: (tab: GameSubTabType | null) => void;
    dividendSubTab: DividendSubTabType;
    setDividendSubTab: (tab: DividendSubTabType) => void;
    newsSubTab: NewsSubTabType;
    setNewsSubTab: (tab: NewsSubTabType) => void;
    marginSubTab: MarginSubTabType;
    setMarginSubTab: (tab: MarginSubTabType) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    isHighContrast: boolean;
    setIsHighContrast: (isHighContrast: boolean) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<TabType>('rumor');
    const [rumorSubTab, setRumorSubTab] = useState<RumorSubTabType>('text');
    const [logicSubTab, setLogicSubTab] = useState<LogicSubTabType>('rationale');
    const [deepfakeSubTab, setDeepfakeSubTab] = useState<DeepfakeSubTabType>('detector');
    const [voiceSubTab, setVoiceSubTab] = useState<VoiceSubTabType>('assistant');
    const [accessibilitySubTab, setAccessibilitySubTab] = useState<AccessibilitySubTabType | null>(null);
    const [gameSubTab, setGameSubTab] = useState<GameSubTabType | null>(null);
    const [dividendSubTab, setDividendSubTab] = useState<DividendSubTabType>('receipt');
    const [newsSubTab, setNewsSubTab] = useState<NewsSubTabType>('newsroom');
    const [marginSubTab, setMarginSubTab] = useState<MarginSubTabType>('reality');
    const [fontSize, setFontSize] = useState(100);
    const [isHighContrast, setIsHighContrast] = useState(false);

    return (
        <TabContext.Provider value={{
            activeTab, setActiveTab,
            rumorSubTab, setRumorSubTab,
            logicSubTab, setLogicSubTab,
            deepfakeSubTab, setDeepfakeSubTab,
            voiceSubTab, setVoiceSubTab,
            accessibilitySubTab, setAccessibilitySubTab,
            gameSubTab, setGameSubTab,
            dividendSubTab, setDividendSubTab,
            newsSubTab, setNewsSubTab,
            marginSubTab, setMarginSubTab,
            fontSize, setFontSize,
            isHighContrast, setIsHighContrast
        }}>
            {children}
        </TabContext.Provider>
    );
}

export function useTabs() {
    const context = useContext(TabContext);
    if (context === undefined) {
        throw new Error('useTabs must be used within a TabProvider');
    }
    return context;
}
