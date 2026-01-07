{/* Death Status and Prop in one row, always visible */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => togglePlayerAlive(playerNo)}
                className={`flex-[8] h-10 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 shadow-sm ${isDead ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
              >
                {isDead ? <Skull size={14} /> : null}
                {isDead ? 'DEAD' : 'ALIVE'}
              </button>
              <div className="flex-[2] flex items-center bg-white border rounded-lg px-3 h-10 shadow-sm">
                <Tag size={12} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={currentPlayer?.property || ''} 
                  onChange={(e) => updatePlayerProperty(playerNo, e.target.value)}
                  placeholder="Properties"
                  className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full"
                />
              </div>
            </div>