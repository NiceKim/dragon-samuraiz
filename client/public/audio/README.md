# 🔊 Audio Files for Dragon SamuraiZ

## Required Audio Files

Place the following audio files in this directory:

### 1. **win.mp3** - Victory Result Sound
- Duration: 1-3 seconds
- Upbeat, celebratory sound for final victory
- Examples: Fanfare, chime, success sound
- **Plays**: When result popup appears (after 700ms delay)

### 2. **lose.mp3** - Defeat Result Sound  
- Duration: 1-2 seconds
- Sad or disappointing sound for final defeat
- Examples: Descending tone, "aww" sound
- **Plays**: When result popup appears (after 700ms delay)

### 3. **draw.mp3** - Draw Result Sound
- Duration: 1-2 seconds  
- **CHANGED**: Now plays lose.mp3 sound for draw results
- **Note**: This file is no longer used - draw results play lose sound instead

### 4. **slash.mp3** - Victory Card Reveal Sound ⚔️
- Duration: 0.5-1 seconds
- Sharp, cutting sound (sword slash, whoosh)
- Examples: Sword slash, blade cutting air, sharp whoosh
- **Plays**: When cards are revealed and you WIN

### 5. **hit.mp3** - Defeat Card Reveal Sound 💥
- Duration: 0.5-1 seconds  
- Impact sound (punch, thud, crash)
- Examples: Punch impact, thud, crash sound
- **Plays**: When cards are revealed and you LOSE

### 6. **parry.mp3** - Draw Card Reveal Sound ⚔️
- Duration: 0.5-1 seconds
- Defensive blocking sound (sword parry, clang, block)
- Examples: Sword clash, metal clang, defensive block sound
- **Plays**: When cards are revealed and it's a DRAW

## 🎵 Sound Timing Sequence

```
Game Flow → Sound Effects:

1. Player makes choice → (no sound)
2. Cards reveal → slash.mp3 / hit.mp3 / parry.mp3
3. Result popup → win.mp3 / lose.mp3 / lose.mp3 (draw also plays lose)
```

## Free Audio Resources

### 🎯 Recommended for Game Sounds:
- **Freesound.org** ⭐ Best for game effects
- **Zapsplat.com** ⭐ Professional quality
- **Pixabay.com/sound-effects/** Easy to use
- **OpenGameArt.org** Game-focused

### 🔍 Search Terms:
- **Slash sounds**: "sword slash", "blade whoosh", "cut air", "sharp whoosh"
- **Hit sounds**: "punch impact", "thud", "crash", "hit sound", "impact"
- **Parry sounds**: "sword clash", "metal clang", "sword block", "parry sound", "blade clash"

## Audio Format Requirements

- **Format**: MP3 (recommended) or WAV
- **Quality**: 44.1kHz, 16-bit minimum
- **File Size**: Keep under 100KB each for fast loading
- **Volume**: Normalize to prevent clipping

## Volume Levels (Configured in Code)

- **Result sounds**: 60% volume (win.mp3, lose.mp3)
- **Draw result**: 60% volume (now plays lose.mp3)
- **Card reveal effects**: 70% volume (slash.mp3, hit.mp3)
- **Parry sound**: 50% volume (parry.mp3)

## Testing

After adding the files, test the sounds by:
1. Starting the game
2. Playing a match
3. Listening for sounds on:
   - **Card reveal** (slash/hit/parry sounds)
   - **Result popup** (win/lose sounds - draw also plays lose)

## Troubleshooting

If sounds don't play:
1. Check browser console for errors
2. Ensure files are named exactly as listed above
3. Try different audio formats (WAV instead of MP3)
4. Check browser autoplay policies (sounds only work after user interaction)
5. Verify file paths: `/public/audio/filename.mp3`
