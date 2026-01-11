"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type TabType = 'rumor' | 'logic' | 'deepfake' | 'voice' | 'accessibility' | 'game' | 'dividend' | 'news' | 'margin';
type RumorSubTabType = 'text' | 'image' | 'screenshot';

interface TabContextType {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    rumorSubTab: RumorSubTabType;
    setRumorSubTab: (tab: RumorSubTabType) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<TabType>('rumor');
    const [rumorSubTab, setRumorSubTab] = useState<RumorSubTabType>('text');

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab, rumorSubTab, setRumorSubTab }}>
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
