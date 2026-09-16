# Skip Opening & Ending Guide

> 
> 💡 This feature is referenced from [KatelyaTV](https://github.com/katelya77/KatelyaTV)

## 📖 Feature Introduction

VODTV now comes with a powerful opening‑ending skip function:

- ✨ Multi‑segment configuration (multiple opening / ending entries supported)
- ⏱️ Precise time control (`mm:ss` format supported)
- 🚀 Auto‑skip opening
- ⏭️ Auto‑play next episode
- ⏸️ Manual skip button (shown when auto‑skip is disabled)
- ⏳ Countdown reminder
- 🎯 **Smart default preset** (automatically apply standard skip timing for new series)

---

## 🎯 Smart Default Preset

Signature feature of VODTV! When you play a new series for the first time, standard skip settings are loaded automatically:

- **Opening skip**: `0:00‑1:30` (first 90 seconds)
- **Ending skip**: Last `2:00` before video ends (final 2 minutes)
- **Auto‑skip**: Enabled by default
- **Auto next‑episode**: Enabled by default

### Design rationale

Most TV shows and animations follow relatively fixed opening / ending durations:

- 📺 TV drama: Opening ~60‑90s, ending ~120s
- 🎬 Anime: OP ~90s, ED ~90‑120s

**Default preset lets you enjoy auto‑skip without manual configuration!**

### How to adjust

If default timing is inaccurate:

1. Click *Skip Settings* to open configuration panel
2. Modify timings of existing segments
3. Or delete default entry and add custom segments manually

> 
> 💡 Note: The default preset is applied **only on the very first playback** for a series. Existing configurations for that show will not be overwritten.

---

## 🎯 Usage Steps

### 1️⃣ Open Settings Panel

On the playback page, locate the **Skip Settings** button above the player (to the left of the Hide button).

```
[Video Title]                      [Skip Settings]  [Hide]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        [Player]
```

Click **Skip Settings** to bring up the configuration panel.

---

### 2️⃣ Configure Skip Timing

Two configuration methods available inside the panel:

#### 🔵 Method 1: Quick Batch Setup (Recommended)

Batch setup for common opening‑ending values:

**Opening settings:**

- Opening start time: Usually `0:00` (from video beginning)
- Opening end time: e.g. `1:30` (90 seconds) or raw number `90`

**Ending settings:**

- Ending mode:
  - `Remaining‑time mode`: Trigger based on remaining playback time (recommended)
  - `Absolute‑time mode`: Trigger from the start of video
- Ending start time:
  - Remaining‑time mode: `2:00` means countdown starts when 2 minutes remain
  - Absolute‑time mode: Fill in exact playback timestamp

**Example batch config:**

```
Opening start: 0:00
Opening end: 1:30      ← Skip first 90 seconds
Ending mode: Remaining‑time
Ending start: 2:00     ← Countdown begins with 2 minutes left
```

Click **Apply Batch Settings** to save.

#### 🟢 Method 2: Manually Add Segments

More flexible for multiple skip ranges:

1. Click **Add Segment**
2. Fill segment properties:
   - **Type**: Opening or Ending
   - **Start time**: e.g. `0:00` or `0`
   - **End time**: e.g. `1:30` or `90`
   - **Description** (optional): e.g. "OP Theme Song"
   - **Auto‑skip**: Check to automatically jump over this segment
   - **Auto next‑episode** (Ending only): Check to jump to next episode after playback
3. Click **Save**

**Multi‑segment example:**

```
Segment1: Opening 0:00‑1:30  (OP Theme Song)
Segment2: Ending 21:30‑22:00 (ED Theme Song)
Segment3: Ending 23:00‑23:30 (Next‑episode Preview)
```

---

### 3️⃣ Playback Behavior After Configuration

#### 🎬 Opening Skip

When playback reaches opening range:

- If **Auto‑skip ON**: Jump automatically to end timestamp
- If **Auto‑skip OFF**: Show button at top‑left corner `Opening detected [Skip]` for manual click

```
┌─────────────────────────────────────────┐
│ ┌──────────────────┐                   │
│ │Opening detected [Skip]│              │
│ └──────────────────┘                   │
│           [Video playing]              │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

#### 🎬 Ending Skip

When playback reaches ending range:
‑ Top countdown hint shown: `"Auto‑play next episode in 5s" [Cancel]`
‑ Click **Cancel** to abort countdown
‑ When countdown finishes, next episode starts automatically

```
┌─────────────────────────────────────────┐
│ ⏱️ Auto‑play next episode in 5s [Cancel]│
├─────────────────────────────────────────┤
│                                         │
│           [Video playing]               │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚙️ Settings Explanation

### Global Switches

‑ **Auto‑skip**: Automatically jump all configured segments; turn off to show manual skip buttons
‑ **Auto next‑episode**: Auto‑load next episode after ending countdown completes

### Supported Time Formats

表格

| Format | Example | Description |
| --- | --- | --- |
| mm:ss | `1:30` | 1 min 30 sec = 90 seconds |
| Raw seconds | `90` | 90 seconds |
| mm:ss.decimal | `1:30.5` | 1 min 30.5 sec = 90.5 sec |

### Ending Modes

表格

| Mode | Description | Example |
| --- | --- | --- |
| **Remaining‑time** | Trigger based on remaining playback duration | `2:00` = trigger when 2 minutes left |
| **Absolute‑time** | Trigger based on absolute playback position | `20:00` = trigger once playback hits 20‑min mark |

💡 **Remaining‑time mode is recommended**, since different source files may have varying total episode durations.

---

## 🔧 Manage Saved Configurations

### Edit segment

1. Locate target segment in panel
2. Modify time values and toggles
3. Hit **Save** on the right‑hand side of the segment

### Delete segment

Click the **Delete** button next to the target segment.

### Clear all settings for current series

Click **Delete Skip Configurations** at panel bottom to wipe all skip entries for this show.

---

## 💾 Data Persistence

Skip configurations auto‑save, two storage modes available:

### 🔵 LocalStorage Mode (Default)

‑ Stored locally inside your browser
‑ Login not required
‑ Configurations get lost when clearing browser site data

### 🔵 Database Mode (Login Required)

‑ Saved on backend database
‑ Cross‑device synchronization supported
‑ Persistent permanent storage

> 
> Storage mode is controlled by environment variable `NEXT_PUBLIC_STORAGE_TYPE`

---

## 📝 Real‑world Configuration Examples

### Scenario1: Skip Anime OP / ED

```
Opening: 0:00‑1:30      (90‑second OP theme)
Ending: Remaining 1:30  (countdown starts with 1.5 min left)
Auto‑skip: ✅
Auto next‑episode: ✅
```

### Scenario2: Skip Recap Opening for TV Series

```
Opening: 0:00‑2:00      (previous‑episode recap,120s)
Auto‑skip: ✅
Auto next‑episode: ✅
```

### Scenario3: Manual‑control only

```
Opening: 0:00‑1:30
Auto‑skip: ❌            (manual skip button appears)
Auto next‑episode: ❌    (no automatic episode jump)
```

### Scenario4: Precise multi‑segment setup

```
Segment1: Opening 0:00‑1:30     (OP)
Segment2: Ending 20:30‑22:00    (ED + next‑episode preview)
Segment3: Ending 23:50‑24:00    (closing credits)
```

---

## ❓ FAQ

### Q: Cannot open configuration panel?

**A:** Check these items:

1. Confirm you are on playback page
2. Confirm video source is fully loaded (`currentSource` and `currentId` exist)
3. Refresh browser page and retry

### Q: Auto‑skip does not work?

**A:** Verify:

1. Make sure global **Auto‑skip** toggle is turned ON
2. Double‑check your time segment values
3. Open browser dev‑tools console and inspect runtime errors

### Q: My skip settings got lost?

**A:**
‑ LocalStorage mode: Clearing browser site data erases config; export a backup regularly
‑ Database mode: Make sure you are logged in; server‑side storage persists your settings

### Q: Do I need re‑configure for different video sources?

**A:** Yes. Config is isolated per `source + id` pair. Timing values are usually similar across different sources for the same series.

### Q: Can I batch‑apply config for all episodes?

**A:** Settings are saved per series (`source + id`). All episodes belonging to this series reuse the same skip configuration.

---

## 🎉 Enjoy Uninterrupted Viewing!

Once opening‑ending skip is properly configured:
‑ ⏩ Automatically skip repetitive OP & ED
‑ 🎬 Continuous playback across episodes with zero manual clicks
‑ ⏸️ Manual skip available whenever needed
‑ 💾 Auto‑saved settings, configure once for repeated use

Have fun! 🍿
