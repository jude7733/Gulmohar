# BMC-ART-GALLERY

## Features

- NativeWind v4
- Dark and light mode
  - Android Navigation Bar matches mode
  - Persistent mode
- Common components
  - ThemeToggle, Avatar, Button, Card, Progress, Text, Tooltip

## Build

### Web

```
npx expo export --platform web

eas deploy
```

### Android

```
# Use replace profile with your own
 eas build --profile development --platform android --local
```
