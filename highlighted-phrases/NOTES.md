#### Known Issues:
- If a color has a phrase with the same starting word this can cause one of those phrases to not be highlighted due to how each word has a color index associated with it
  - FIX: Could add more properties to the wordMap to keep track of exactly which phrase each word is in.

- If a word in the string is in 3 or more phrases it hover does not currently deal with all 3 phrase classes
  - Example Input:
    - Red: unlikely
    - Blue: very unlikey
    - Grey: very unlikey to leave
    - String: very unlikely to leave
  - OutPut: when hovering over unlikely, blue highlight is removed, the grey and red in the next siblings is not removed.

  - FIX: Add a loop that checks for each color and runs the recursive checker for each color on the main word.

#### Improvements:
- Add the whitepsace to the node's so that it can have the
  highlight effect with using the box shadown work around.