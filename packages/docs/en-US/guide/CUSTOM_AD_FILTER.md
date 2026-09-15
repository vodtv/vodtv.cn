### Custom Ad-Removal Feature User Guide
 
### VODTV offers robust, customizable ad‑removal features, enabling administrators to write JavaScript code for more precise filtering of M3U8 video stream ads.
 
### Features and Capabilities
 
✅ Flexible filtering logic
 
✅ Dynamic Configuration
 
✅ Developer-friendly
 
### ✅ Safe and reliable
 
### Quick Start
 
### Step 1: Access the Admin Panel
 
Visit the `/admin` page and locate the "Custom Ad Removal" tab.
 
Step 2: Write Custom Code
 
Click the "Load Sample Code" button to view examples, or write your own code directly.
 
### Step 3: Save the configuration
 
### After completing the configuration, click the "Save Configuration" button.
 
### Step 4: Test the effect
 
### Refresh the playback page, and the custom ad‑removal script will take effect automatically. Open the browser console (F12) to see the log entry `✅ Custom ad‑removal script in use`.
 
### Code Style
 
### Function signature
 
Custom code must define a function named `filterAdsFromM3U8`:
 
Parameter Description
 
Return value
 
Must return a string containing the filtered m3u8 content.
 
⚠️ Important: Returning an empty string or a non-string type may cause the video to fail to play.
 
Example code
 
Example 1: Keyword-Based Ad Filtering (Recommended)
 
Use URL keyword detection for ad segments, a universal filtering logic suitable for most playback sources.
 
function filterAdsFromM3U8(type, m3u8Content) {
   if (!m3u8Content) return '';
   // Ad keyword list
   const adKeywords = [
     'sponsor',
     '/ad/',
     '/ads/',
     'advert',
     'advertisement',
     '/adjump',
     'redtraffic'
   ];
   // Split the M3U8 content by lines
   const lines = m3u8Content.split('\n');
   const filteredLines = [];
   let i = 0;
   while (i < lines.length) {
     const line = lines[i];
     // Skip #EXT-X-DISCONTINUITY tags
     if (line.includes('#EXT-X-DISCONTINUITY')) {
       i++;
       continue;
     }
     // If it's an EXTINF line, check whether the next URL contains any ad keywords
     if (line.includes('#EXTINF:')) {
       // Check if the next line's URL contains an ad keyword
       if (i + 1 < lines.length) {
         const nextLine = lines[i + 1];
         const containsAdKeyword = adKeywords.some(keyword =>
           nextLine.toLowerCase().includes(keyword.toLowerCase())
         );
         if (containsAdKeyword) {
           // Skip both the EXTINF line and the subsequent URL line
           i += 2;
           continue;
         }
       }
     }
     // Keep the current line
     filteredLines.push(line);
     i++;
   }
   return filteredLines.join('\n');
 } 
Example 2: Combining Keywords and Custom Rules
 
Employ different filtering strategies based on the playback source, combined with keyword detection and custom rules.
 
function filterAdsFromM3U8(type, m3u8Content) {
   if (!m3u8Content) return '';
   // Ad keyword list
   const adKeywords = [
     'sponsor',
     '/ad/',
     '/ads/',
     'advert',
     'advertisement',
     '/adjump',
     'redtraffic'
   ];
   const lines = m3u8Content.split('\n');
   const filteredLines = [];
   let i = 0;
   while (i < lines.length) {
     const line = lines[i];
     // Skip #EXT-X-DISCONTINUITY tags
     if (line.includes('#EXT-X-DISCONTINUITY')) {
       i++;
       continue;
     }
     // If it's an EXTINF line, check the next URL line
     if (line.includes('#EXTINF:')) {
       if (i + 1 < lines.length) {
         const nextLine = lines[i + 1];
         // Check whether it contains any ad keywords
         const containsAdKeyword = adKeywords.some(keyword =>
           nextLine.toLowerCase().includes(keyword.toLowerCase())
         );
         if (containsAdKeyword) {
           // Skip both the EXTINF line and the URL line
           i += 2;
           continue;
         }
         // Additional rules for specific sources
         if (type === 'ruyi') {
           // For Ruyi source: check for specific URL patterns
           if (nextLine.includes('ad-server') || nextLine.includes('promo')) {
             i += 2;
             continue;
           }
         }
       }
     }
     // Keep the current line
     filteredLines.push(line);
     i++;
   }
   return filteredLines.join('\n');
 }
 
Example 3: Combining SCTE-35 with Keyword Detection
 
Supports industry-standard SCTE-35 ad‑marker detection and, combined with keyword detection, delivers more comprehensive ad filtering.
 
### function filterAdsFromM3U8(type, m3u8Content) {
   if (!m3u8Content) return '';
   // List of ad keywords
   const adKeywords = [
     'sponsor',
     '/ad/',
     '/ads/',
     'advert',
     'advertisement',
     '/adjump',
     'redtraffic'
   ];
   const lines = m3u8Content.split('\n');
   const filteredLines = [];
   let inAdBlock = false;
   let adSegmentCount = 0;
   let i = 0;
   while (i < lines.length) {
     const line = lines[i];
     // Detect industry-standard ad markers (SCTE-35 series)
     if (line.includes('#EXT-X-CUE-OUT') ||
         (line.includes('#EXT-X-DATERANGE') && line.includes('SCTE35')) ||
         line.includes('#EXT-X-SCTE35') ||
         line includes('#EXT-OATCLS-SCTE35')) {
       inAdBlock = true;
       adSegmentCount++;
       i++;
       continue;
     }
     // Detect ad-end marker
     if (line includes('#EXT-X-CUE-IN')) {
       inAdBlock = false;
       i++;
       continue;
     }
     // Skip ad-block content
     if (inAdBlock) {
       i++;
       continue;
     }
     // Skip #EXT-X-DISCONTINUITY marker
     if (line includes('#EXT-X-DISCONTINUITY')) {
       i++;
       continue;
     }
     // If it's an EXTINF line, check whether the next URL contains any ad keywords
     if (line includes('#EXTINF:')) {
       if (i + 1 < lines.length) {
         const nextLine = lines[i + 1];
         const containsAdKeyword = adKeywords.some(keyword =>
           nextLine.toLowerCase().includes(keyword.toLowerCase())
         );
         if (containsAdKeyword) {
           adSegmentCount++;
           i += 2;
           continue;
         }
       }
     }
     // Keep the current line
     filteredLines.push(line);
     i++;
   }
   // Output statistics (for development and debugging)
   if (adSegmentCount > 0) {
     console.log(`[Ad Removal] ${type} source removed ${adSegmentCount} ad segments`);
   }
   return filteredLines.join('\n');
 } 
### M3U8 File Structure Description
 
### Basic tags
 
Advertising-related tags
 
### Multi-bitrate Stream Label
 
### Best Practices
 
### 1. Use different strategies for different sources
 
### Different playback sources may use different ad insertion methods; it is recommended to organize the code using a switch statement:
 
### function filterAdsFromM3U8(type, m3u8Content) {
   // Use different logic depending on the source
   switch (type) {
     case 'ruyi':
       return filterRuyiAds(m3u8Content);
     case 'dyttzy':
       return filterDyttzAds(m3u8Content);
     case 'kuaikan':
       return filterKuaikanAds(m3u8Content);
     default:
       return filterDefaultAds(m3u8Content);
   }
 }
 function filterRuyiAds(content) {
   // Special filtering logic for the Ruyi source
 }
 function filterDyttzAds(content) {
   // Special filtering logic for the Movie Heaven source
 }
 function filterKuaikanAds(content) {
   // Special filtering logic for the Kuaikan source
 }
 function filterDefaultAds(content) {
   // Default filtering logic (SCTE-35 standard)
 } 
### 2. Add debugging information
 
During the development phase, it is recommended to keep console.log statements for easier debugging:
 
3. Robust Error Handling
 
Custom code should be fault-tolerant to prevent a single error from causing all videos to fail to play:
 
function filterAdsFromM3U8(type, m3u8Content) {
   try {
     if (!m3u8Content) return '';
     // Filtering logic
     const filtered = performFiltering(m3u8Content);
     // Validate the result
     if (!filtered || typeof filtered !== 'string') {
       console.error('[Filter] Invalid return value; using original content');
       return m3u8Content;
     }
     return filtered;
   } catch (error) {
     console.error('[Filter error]', error);
     // Return the original content as a fallback
     return m3u8Content;
   }
 }
 
4. Performance Optimization Techniques
 
For large m3u8 files (with thousands of lines), be mindful of performance optimization:
 
### function filterAdsFromM3U8(type, m3u8Content) {
   if (!m3u8Content) return '';
   // ✅ Use an array instead of string concatenation (better performance)
   const filteredLines = [];
   // ✅ Precompile commonly used detection patterns
   const adMarkers = [
     '#EXT-X-CUE-OUT',
     '#EXT-X-CUE-IN',
     '#EXT-X-DISCONTINUITY',
     'SCTE35'
   ];
   // ✅ Avoid redundant split operations
   const lines = m3u8Content.split('\n');
   for (let i = 0; i < lines.length; i++) {
     const line = lines[i];
     // Filtering logic
     // ...
   }
   // ✅ Join once to avoid multiple string concatenations
   return filteredLines.join('\n');
 }
 
### Version Control and Caching Mechanism
 
### Why is a version number needed?
 
The browser caches the custom ad‑removal code. After you modify the code, incrementing the version number forces the browser to fetch the latest version.
 
Intelligent caching mechanism
 
VODTV uses an intelligent caching mechanism to optimize performance:
 
### How to Use Version Numbers
 
### 💡 Tip:
 
### Troubleshooting
 
Question 1: The code is not taking effect.
 
Symptom: After modifying the code, the player still uses the old rules or the default rules.
 
Troubleshooting steps:
 
Question 2: The video cannot be played.
 
Symptom: After applying custom code, video playback fails or results in a black screen.
 
Troubleshooting steps:
 
Question 3: Ads are still appearing
 
Symptom: After applying custom code, the ad still plays.
 
Troubleshooting steps:
 
Example debugging code:
 
Issue 4: Automatic Degradation on Execution Failure
 
Symptom: The console displays “Failed to execute custom ad‑removal code; falling back to the default rule.”
 
### Note: This is a normal downgrade mechanism and will not affect video playback.
 
### Troubleshooting steps:
 
### Technical Details
 
### Code Execution Flow
 
### 1. The user accesses the playback page
    ↓
 2. The version number is read from RUNTIME_CONFIG
    ↓
 3. Check the localStorage cache
    ├─ If a cache exists and the version numbers match → use the cached code
    └─ If there is no cache or the version numbers do not match → call /api/ad-filter?full=true to retrieve the full code
    ↓
 4. Store the code and version number in localStorage
    ↓
 5. The player loads the m3u8 file
    ↓
 6. Call filterAdsFromM3U8(type, content)
    ↓
 7. Prioritize the custom code; if it fails, fall back to the default rules
    ↓
 8. Return the filtered m3u8 content to the player 
### API Endpoint Description
 
GET /api/ad-filter
 
Supports two modes:
 
💡 Optimization Notes:
 
### TypeScript Type Annotation Processing
 
### The system automatically removes TypeScript type annotations, so the following code is all valid:
 
### Safety Instructions
 
Frequently Asked Questions (FAQ)
 
Q1: Can ES6+ features be used?
 
A: Yes, but make sure the target browser supports it. We recommend using ES5 syntax for optimal compatibility.
 
### Recommended ES6 features:
 
### Avoid using:
 
### Q2: Can external libraries be imported?
 
A: No. Custom code can only use the native JavaScript API.
 
Q3: How do I obtain the detailed information of the current video?
 
A: The `type` parameter contains the key of the playback source. For additional information, such as the video ID or title, you’ll need to add extra parameter-passing logic in the source code.
 
### Q4: Do I need to restart the server after modifying the code?
 
### A: No, it’s not necessary. After saving the configuration, users can simply refresh the page for the changes to take effect. This is an online hot-update mechanism.
 
### Q5: Can ad blocking be completely disabled?
 
A:
 
Q6: What happens if code execution fails?
 
A: The system will automatically downgrade to the default ad‑free rule and output an error message in the console. This will not prevent the video from playing.
 
### Q7: Is there an upper limit to the version number?
 
### A: No. The version number can be any positive integer; it is recommended to increment it by 1 each time you make a change.
 
### Q8: Can I filter by a specific video ID?
 
A: The current version only provides the `type` (playback source) parameter. To filter by video ID, you’ll need to modify the source code to add this parameter.
 
Contribution and Sharing
 
If you have good ad‑removal rules, feel free to share them in the community!
 
Sharing format
 
Example Sharing
 
## Ruyi Source Ad-Removal Rules
**Applicable Source**: ruyi  
**Description**: Removes ad segments of specific durations from the Ruyi source.  
**Author**: VODTV Community  
```javascript
function filterAdsFromM3U8(type, m3u8Content) {
  if (type !== 'ruyi' || !m3u8Content) return m3u8Content;
  const lines = m3u8Content.split('\n');
  const filteredLines = [];
  let skipNext = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (skipNext) {
      skipNext = false;
      continue;
    }
    // Filter out ad segments lasting 5.64 seconds, 2.96 seconds, and 3.48 seconds
    if (line.includes('EXTINF:5.640000') ||
        line.includes('EXTINF:2.960000') ||
        line.includes('EXTINF:3.480000')) {
      skipNext = true;
      continue;
    }
    filteredLines.push(line);
  }
  return filteredLines.join('\n');
}
```
**Test Results**:
- ✅ Successfully removed the 5.64-second intro ad.
- ✅ Successfully removed the 2.96-second mid-roll ad.
- ✅ Successfully removed the 3.48-second outro ad. 
### Related Resources
 
### Official Documentation
 
### Community Resources
 
### Tool Recommendations
 
### Changelog
 
### Version History
 
License and Disclaimer
 
Technical Support
 
Having trouble? We’re here to help anytime!
 
Make your movie-watching experience purer and enjoy smooth, ad-free playback! 🎬✨
 
