# Image Loading Troubleshooting

## Common Issues

### Build-Time Errors: "Failed to resolve import"

If you're seeing errors like `Failed to resolve import "../assets/images/stories/red-riding-hood.png"`, it means Vite can't find the image files at build time.

**Solution:**
1. We've modified the code to use dynamic imports that won't break at build time.
2. You need to create the image directories (which we've already done):
   ```
   /src/assets/images/stories/
   /src/assets/images/elements/characters/
   /src/assets/images/elements/settings/
   /src/assets/images/elements/themes/
   ```
3. Add your custom images following the naming conventions in the README.md.

### Runtime Image Loading Errors

If the app builds successfully but you see broken images or console warnings about loading images:

**Solution:**
1. Check that you've placed your images in the correct directories.
2. Verify the image filenames match the expected formats:
   - Story images: `red-riding-hood.png`, `tortoise-hare.png`, etc.
   - Character images: lowercase with hyphens instead of spaces (e.g., `magic-dragon.png`)
   - Setting and theme images: same format as character images

### Missing Default Images

If you see emoji icons instead of images, it means:
1. The specific image wasn't found
2. The default fallback image wasn't found either

**Solution:**
Create at least these default images:
- `src/assets/images/stories/default-story.png`
- `src/assets/images/elements/default-character.png`
- `src/assets/images/elements/default-setting.png`
- `src/assets/images/elements/default-theme.png`

## Temporary Fix

While developing, if you just want to see the app without worrying about images:

1. The app will gracefully fallback to showing emoji icons when images are missing
2. You can continue developing other features
3. Add proper images later when you're ready to finalize the visual design 