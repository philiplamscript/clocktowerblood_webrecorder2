"use client";

import React, { useState, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useGameState } from './hooks/useGameState';

import Header from './components/layout/Header';
import PlayerHub from './components/layout/PlayerHub';
import PlayerDetailView from './components/PlayerDetailView';
import GlobalVotingView from './components/GlobalVotingView';
import LedgerTabsPopup from './components/popitems/popups/LedgerTabsPopup';
import RoleSelectorPopup from './components/popitems/popups/RoleSelectorPopup';
import RoleUpdatePopup from './components/popitems/popups/RoleUpdatePopup';
import ResetConfirmation from './components/popitems/popups/ResetConfirmation';
import GreetingPopup from './components/popitems/popups/GreetingPopup';
import SettingsPopup from './components/popitems/popups/SettingsPopup';
import AboutPopup from './components/popitems/popups/AboutPopup';
import PlayerRosterPopup from './components/popitems/popups/PlayerRosterPopup';
import FAB from './components/popitems/FAB';
import Sidebar from './components/Sidebar';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

export default function App() {
  const state = useGameState();
  const [activeTab, setActiveTab] = useState<'players' | 'votes' | 'chars' | 'notes'>('players');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(() => !localStorage.getItem('clocktower_greeted'));
  const [greetingTitle, setGreetingTitle] = useState("Welcome to BOTCT-ClockTracker");
  const [showReset, setShowReset] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [focusPlayerNo, setFocusPlayerNo] = useState<number>(1);
  const [showRoleSelector, setShowRoleSelector] = useState<{ playerNo: number; roles: { role: string; category: string }[] } | null>(null);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [roleUpdateText, setRoleUpdateText] = useState('');
  const [voteHistoryMode, setVoteHistoryMode] = useState<'vote' | 'beVoted' | 'allReceive'>('allReceive');
  const [assignmentMode, setAssignmentMode] = useState<'death' | 'property' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('🌑');
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  const handlePlayerClick = (num: number) => {
    if (assignmentMode === 'death') {
      const existing = state.deaths.find(d => parseInt(d.playerNo) === num);
      if (existing) state.setDeaths(state.deaths.map(d => d.id === existing.id ? { ...d, reason: selectedReason, day: state.currentDay } : d));
      else state.setDeaths([...state.deaths, { id: Math.random().toString(), day: state.currentDay, playerNo: num.toString(), reason: selectedReason, note: '', isConfirmed: true }]);
    } else if (assignmentMode === 'property') {
      state.setPlayers(prev => prev.map(p => {
        if (p.no === num) {
          const current = p.property ? p.property.split('|').map(pr => pr.trim()) : [];
          if (!current.includes(selectedProperty.trim())) {
            return { ...p, property: [...current, selectedProperty.trim()].filter(Boolean).join('|') };
          }
        }
        return p;
      }));
    } else {
      setFocusPlayerNo(num);
    }
  };

  const parseRoleUpdate = () => {
    const lines = roleUpdateText.split('\n').map(l => l.trim()).filter(Boolean);
    const newChars: any = { Townsfolk: [], Outsider: [], Minion: [], Demon: [] };
    let current: string | null = null;
    lines.forEach(l => {
      if (l.includes('Townsfolk:')) current = 'Townsfolk';
      else if (l.includes('Outsider:')) current = 'Outsider';
      else if (l.includes('Minion:')) current = 'Minion';
      else if (l.includes('Demon:')) current = 'Demon';
      else if (current) newChars[current].push({ name: l, status: '—', note: '' });
    });
    Object.keys(newChars).forEach(cat => { while (newChars[cat].length < 8) newChars[cat].push({ name: '', status: '—', note: '' }); });
    state.setChars(newChars);
    setShowRoleUpdate(false);
    setRoleUpdateText('');
    toast.success('Roles script updated');
  };

  const fontSizeClass = { small: 'text-[10px]', mid: 'text-xs', large: 'text-sm' }[state.fontSize];

  const themeStyles = useMemo(() => {
    const c = state.currentTheme.colors;
    return {
      '--bg-color': c.bg,
      '--panel-color': c.panel,
      '--header-color': c.header,
      '--accent-color': c.accent,
      '--accent-color-rgb': hexToRgb(c.accent),
      '--text-color': c.text,
      '--text-on-bg': c.textOnBg || c.text,
      '--text-on-panel': c.textOnPanel || c.text,
      '--text-on-header': c.textOnHeader || c.bg,
      '--border-color': c.border,
      '--muted-color': c.muted,
    } as React.CSSProperties;
  }, [state.currentTheme]);

  const openHowToUse = () => {
    setGreetingTitle("How to use ClockTracker");
    setShowGreeting(true);
    setSidebarOpen(false);
  };

  return (
    <div 
      style={themeStyles}
      className={`min-h-screen w-full bg-[var(--bg-color)] flex flex-col font-sans select-none ${fontSizeClass} transition-colors duration-500`}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <GreetingPopup isOpen={showGreeting} title={greetingTitle} onClose={() => { setShowGreeting(false); localStorage.setItem('clocktower_greeted', 'true'); }} />
      <Sidebar 
        isOpen={sidebarOpen} setIsOpen={setSidebarOpen} 
        onReset={() => { setShowReset(true); setSidebarOpen(false); }} 
        onLoadRole={() => { setShowRoleUpdate(true); setSidebarOpen(false); }} 
        onShowUpdateLog={() => toast.info('Log: Added Settings system')} 
        onFocusPlayerDetail={() => { setShowRoster(true); setSidebarOpen(false); }} 
        onOpenSettings={() => { setShowSettings(true); setSidebarOpen(false); }} 
        onShowHowToUse={openHowToUse} 
        onShowAbout={() => { setShowAbout(true); setSidebarOpen(false); }} 
        onShowFAQ={() => toast('Check Settings', { icon: '❓' })} 
        onShowDonation={() => setShowAbout(true)} 
      />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} splitView={state.splitView} setSplitView={state.setSplitView} showHub={state.showHub} setShowHub={state.setShowHub} setShowLedger={setShowLedger} />
      {state.showHub && <PlayerHub currentDay={state.currentDay} setCurrentDay={state.setCurrentDay} playerCount={state.playerCount} players={state.players} deadPlayers={state.deadPlayers} deaths={state.deaths} assignmentMode={assignmentMode} setAssignmentMode={setAssignmentMode} selectedReason={selectedReason} setSelectedReason={setSelectedReason} selectedProperty={selectedProperty} setSelectedProperty={setSelectedProperty} propTemplates={state.propTemplates} focusPlayerNo={focusPlayerNo} onPlayerClick={handlePlayerClick} identityMode={state.identityMode} />}
      <main className="flex-1 relative">
        <div className={`h-full ${state.splitView ? 'grid grid-cols-2 divide-x border-[var(--border-color)]' : ''}`}>
          <div className="bg-[var(--panel-color)] transition-colors duration-500">
            <PlayerDetailView playerNo={focusPlayerNo} setPlayerNo={setFocusPlayerNo} playerCount={state.playerCount} players={state.players} deadPlayers={state.deadPlayers} updatePlayerInfo={state.updatePlayerInfo} updatePlayerProperty={state.updatePlayerProperty} togglePlayerAlive={state.togglePlayerAlive} chars={state.chars} nominations={state.nominations} setNominations={state.setNominations} voteHistoryMode={voteHistoryMode} setVoteHistoryMode={setVoteHistoryMode} setShowRoleSelector={setShowRoleSelector} deaths={state.deaths} setDeaths={state.setDeaths} currentDay={state.currentDay} setCurrentDay={state.setCurrentDay} assignmentMode={assignmentMode} selectedReason={selectedReason} selectedProperty={selectedProperty} onPlayerClick={handlePlayerClick} setAssignmentMode={setAssignmentMode} setSelectedReason={setSelectedReason} setSelectedProperty={setSelectedProperty} notepadTemplates={state.notepadTemplates} propTemplates={state.propTemplates} identityMode={state.identityMode} />
          </div>
          {state.splitView && (
            <div className="bg-[var(--panel-color)] transition-colors duration-500">
              <GlobalVotingView nominations={state.nominations} playerCount={state.playerCount} deadPlayers={state.deadPlayers} players={state.players} deaths={state.deaths} currentDay={state.currentDay} setCurrentDay={state.setCurrentDay} onPlayerClick={handlePlayerClick} assignmentMode={assignmentMode} selectedReason={selectedReason} selectedProperty={selectedProperty} />
            </div>
          )}
        </div>
      </main>
      <LedgerTabsPopup isOpen={showLedger} onClose={() => setShowLedger(false)} activeTab={activeTab} setActiveTab={setActiveTab} players={state.players} setPlayers={state.setPlayers} nominations={state.nominations} setNominations={state.setNominations} chars={state.chars} setChars={state.setChars} note={state.note} setNote={state.setNote} playerCount={state.playerCount} setPlayerCount={state.setPlayerCount} roleDist={state.roleDist} setRoleDist={state.setRoleDist} deadPlayers={state.deadPlayers} addNomination={() => state.setNominations([...state.nominations, { id: Math.random().toString(), day: state.currentDay, f: '-', t: '-', voters: '', note: '' }])} isDragging={false} setIsDragging={() => {}} dragAction={null} setDragAction={() => {}} lastDraggedPlayer={null} setLastDraggedPlayer={() => {}} identityMode={state.identityMode} />
      <RoleSelectorPopup showRoleSelector={showRoleSelector} setShowRoleSelector={setShowRoleSelector} updatePlayerInfo={state.updatePlayerInfo} players={state.players} categoryBg={{ Townsfolk: 'bg-blue-100 hover:bg-blue-200', Outsider: 'bg-blue-50 hover:bg-blue-100', Minion: 'bg-orange-50 hover:bg-orange-100', Demon: 'bg-red-100 hover:bg-red-200' }} />
      <RoleUpdatePopup showRoleUpdate={showRoleUpdate} setShowRoleUpdate={setShowRoleUpdate} roleUpdateText={roleUpdateText} setRoleUpdateText={setRoleUpdateText} parseRoleUpdate={parseRoleUpdate} />
      <ResetConfirmation showReset={showReset} setShowReset={setShowReset} reset={state.reset} />
      <SettingsPopup 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        fontSize={state.fontSize} 
        setFontSize={state.setFontSize} 
        language={state.language} 
        setLanguage={state.setLanguage} 
        identityMode={state.identityMode}
        setIdentityMode={state.setIdentityMode}
        notepadTemplates={state.notepadTemplates} 
        setNotepadTemplates={state.setNotepadTemplates} 
        propTemplates={state.propTemplates} 
        setPropTemplates={state.setPropTemplates} 
        activeTheme={state.activeTheme}
        setActiveTheme={state.setActiveTheme}
        setCustomThemeColors={state.setCustomThemeColors}
        savedCustomThemes={state.savedCustomThemes}
        saveCustomTheme={state.saveCustomTheme}
        deleteCustomTheme={state.deleteCustomTheme}
        renameCustomTheme={state.renameCustomTheme}
        reorderNotepadTemplates={state.reorderNotepadTemplates}
        reorderPropTemplates={state.reorderPropTemplates}
        defaultNotepad={state.defaultNotepad}
        setDefaultNotepad={state.setDefaultNotepad}
        aiThemeInput={state.aiThemeInput}
        setAiThemeInput={state.setAiThemeInput}
        resetCustomization={state.resetCustomization}
      />
      <AboutPopup isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <PlayerRosterPopup 
        isOpen={showRoster} 
        onClose={() => setShowRoster(false)} 
        players={state.players} 
        updatePlayerName={state.updatePlayerName} 
        updatePlayerInfo={state.updatePlayerInfo} 
        reorderPlayers={state.reorderPlayers} 
        addPlayer={state.addPlayer} 
        removePlayer={state.removePlayer} 
      />
      <FAB showLedger={showLedger} setShowLedger={setShowLedger} />
      <div className="bg-[var(--panel-color)] border-t border-[var(--border-color)] px-3 py-1 text-[9px] font-bold text-[var(--muted-color)] flex justify-between items-center z-50">
        <span>PLAYERS REGISTERED: {state.players.filter(p => p.inf || p.name).length} / {state.playerCount}</span>
        <div className="w-32 h-1 bg-[var(--bg-color)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent-color)]" style={{ width: `${(state.players.filter(p => p.inf || p.name).length / state.playerCount) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}