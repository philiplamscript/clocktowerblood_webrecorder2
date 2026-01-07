useEffect(() => {
    localStorage.setItem('clocktower_day', JSON.stringify(currentDay));
    localStorage.setItem('clocktower_count', JSON.stringify(playerCount));
    localStorage.setItem('clocktower_players', JSON.stringify(players));
    localStorage.setItem('clocktower_nominations', JSON.stringify(nominations));
    localStorage.setItem('clocktower_deaths', JSON.stringify(deaths));
    localStorage.setItem('clocktower_chars', JSON.stringify(chars));
    localStorage.setItem('clocktower_dist', JSON.stringify(roleDist));
    localStorage.setItem('clocktower_note', JSON.stringify(note));
    localStorage.setItem('clocktower_font', JSON.stringify(fontSize));
    localStorage.setItem('clocktower_showHub', JSON.stringify(showHub));
    localStorage.setItem('clocktower_splitView', JSON.stringify(splitView));
  }, [currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, fontSize, showHub, splitView]);