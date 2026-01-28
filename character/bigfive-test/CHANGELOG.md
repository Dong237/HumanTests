# Changelog

## [1.1.0] - 2026-01-25

### ✨ Improved User Experience

**Auto-advance on Answer Selection**
- Clicking any answer option now automatically advances to the next question after 300ms
- Eliminates the need to manually click "下一题" for each question
- Makes the 240-question test much more efficient to complete
- Visual feedback preserved with brief delay before advancing

**Navigation Buttons Retained**
- "上一题" (Previous) button still available to go back and change answers
- "下一题" (Next) button still available for manual control if needed
- Last question shows "完成测试" (Complete Test) button

### 🔧 Technical Changes

**Modified Components:**
- `src/components/test/QuestionCard.tsx`:
  - Added `handleAnswerClick()` function with auto-advance logic
  - 300ms delay allows visual feedback before transition
  - Auto-advance only occurs for non-final questions

### 🎯 User Flow Improvement

**Before:**
1. Read question
2. Click answer
3. Click "下一题"
4. Repeat 240 times

**After:**
1. Read question
2. Click answer → **automatically moves to next question**
3. Repeat 240 times

**Time Saved:** Approximately 3-5 minutes for the entire test!

---

## [1.0.0] - 2026-01-25

### Initial Release

- ✅ All 240 questions from NEO-PI-R Big Five test
- ✅ Exact scoring methodology with reverse-scored items
- ✅ T-score and percentile calculations
- ✅ Radar and bar chart visualizations
- ✅ Detailed dimension and facet scores
- ✅ Download results (PDF, CSV, JSON)
- ✅ Progress tracking with localStorage
- ✅ Excalidraw-style design
- ✅ Responsive mobile layout
- ✅ Chinese language interface
