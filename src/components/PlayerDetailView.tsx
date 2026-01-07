{/* Death Status and Prop in one row, always visible */}
            <div className={`grid grid-cols-6 gap-2 ${isDead ? '' : 'items-center'}`}>
              {isDead ? (
                <>
                  <div className="col-span-1 flex items-center justify-center">
                    <Skull size={16} className="text-red-500" />
                  </div>
                  <div className="col-span-1 bg-slate-100 rounded px-2 py-1 flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase">D{currentPlayer?.day}</span>
                  </div>
                  <div className="col-span-2 flex justify-around items-center">
                    {REASON_CYCLE.map(reason => {
                      const death = deaths.find(d => parseInt(d.playerNo) === playerNo);
                      const isSelected = death?.reason === reason;
                      return (
                        <button 
                          key={reason}
                          onClick={() => {
                            if (death) {
                              setDeaths(deaths.map(d => d.id === death.id ? { ...d, reason: reason } : d));
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${isSelected ? 'bg-red-600 scale-110 shadow-md text-white' : 'hover:bg-slate-100'}`}
                        >
                          {reason}
                        </button>
                      );
                    })}
                  </div>
                  <div className="col-span-2 flex items-center bg-white border rounded-lg px-3 h-10 shadow-sm">
                    <Tag size={12} className="text-slate-400 mr-2" />
                    <input 
                      type="text" 
                      value={currentPlayer?.property || ''} 
                      onChange={(e) => updatePlayerProperty(playerNo, e.target.value)}
                      placeholder="Properties"
                      className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full"
                    />
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => togglePlayerAlive(playerNo)}
                    className="col-span-4 h-10 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 shadow-sm bg-emerald-600 text-white"
                  >
                    ALIVE
                  </button>
                  <div className="col-span-2 flex items-center bg-white border rounded-lg px-3 h-10 shadow-sm">
                    <Tag size={12} className="text-slate-400 mr-2" />
                    <input 
                      type="text" 
                      value={currentPlayer?.property || ''} 
                      onChange={(e) => updatePlayerProperty(playerNo, e.target.value)}
                      placeholder="Properties"
                      className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full"
                    />
                  </div>
                </>
              )}
            </div>