"use client";

import React from 'react';
import PlayerGrid from '../ledger/PlayerGrid/PlayerGrid';
import { type IdentityMode } from '../../type';

interface PlayersTabProps {
  players: any[];
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>;
  identityMode?: IdentityMode;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ players, setPlayers, identityMode }) => {
  return (
    <div id="player-grid-container">
      <PlayerGrid players={players} setPlayers={setPlayers} identityMode={identityMode} />
    </div>
  );
};

export default PlayersTab;