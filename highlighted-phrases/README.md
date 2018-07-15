### Highlight Phrases Challenge

Write some HTML/CSS/Javascript to have a controller that can repeatedly take in a string and render it to the page with highlights based on a given prioritized colored word list.
When a word is hovered over the highlight must darkest slightly relative to it's color and the text color change to white.
If phrases are overlapping the highest priority color wins.
When a word is hovered over it must only show the color of the highest priority phrase it is in, and it's associated words in that same phrase must also show that same color. (all other colors removed from this phrase is there are overlaps).

### To Test:
1). Run the build script with   
```npm run build```

```yarn build```

  OR
  ```
  sudo npx babel src --out-dir build --copy-files
  ```

2.) Open build/index.html

### Alternative WAY in case of permissions issues:
run these commands in this order separate terminals:
- yarn babelWatch
- yarn watchify
- live-server build/index.html

#### Seth Donohue