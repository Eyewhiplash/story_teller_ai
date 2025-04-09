# Custom Images for Story-Teller-AI

This directory contains custom images for the story-teller-ai application.

## Directory Structure

- `stories/` - Contains images for universal stories
- `elements/` - Contains images for story creation elements
  - `characters/` - Character images
  - `settings/` - Setting images
  - `themes/` - Theme/adventure images

## Adding Custom Images

### Universal Stories

To add custom images for the universal stories, add PNG files to the `stories/` directory using the following naming convention:

- `red-riding-hood.png` - Little Red Riding Hood
- `tortoise-hare.png` - The Tortoise and the Hare
- `cinderella.png` - Cinderella
- `three-little-pigs.png` - The Three Little Pigs
- `jack-beanstalk.png` - Jack and the Beanstalk
- `golden-goose.png` - The Golden Goose

### Story Elements

To add custom images for story creation elements, add PNG files to the appropriate subdirectories following these naming patterns:

1. For characters, add PNG files to `elements/characters/` with filenames based on the character name:
   - Example: For a "Princess" character, use `princess.png`
   - For names with spaces, use hyphens: "Magic Dragon" would be `magic-dragon.png`

2. For settings, add PNG files to `elements/settings/` with the same naming convention:
   - Example: For a "Castle" setting, use `castle.png`
   - For "Enchanted Forest", use `enchanted-forest.png`

3. For themes/adventures, add PNG files to `elements/themes/` following the same pattern:
   - Example: For an "Adventure" theme, use `adventure.png`
   - For "Treasure Hunt", use `treasure-hunt.png`

## Image Requirements

- Use PNG format
- Recommended size: 300x200 pixels 
- Files should be reasonably sized (less than 1MB each)
- Use transparent backgrounds if possible
- Use appropriate content for children

## Default Fallback Images

If a specific image is not found, the application will:
1. Try to use a default fallback image for that category
2. Fall back to showing an emoji icon if no default is available

Default fallback images:
- `stories/default-story.png` - Default for universal stories
- `elements/default-character.png` - Default for characters
- `elements/default-setting.png` - Default for settings
- `elements/default-theme.png` - Default for themes 