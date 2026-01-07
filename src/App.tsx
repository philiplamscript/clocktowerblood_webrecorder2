const togglePlayerAlive = (no: number) => {
    if (deadPlayers.includes(no)) {
      setDeaths(deaths.filter(d => parseInt(d.playerNo) !== no));
    } else {
      setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: no.toString(), reason: '⚔️', note: '', isConfirmed: true }]);
    }
  };