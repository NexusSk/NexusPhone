# Nexus Phone - 3D Showcase

A premium Three.js website showcasing a 3D phone model with smooth animations and Apple-inspired dark aesthetics.

## 🚀 Quick Start

### 1. Download the 3D Model

1. Go to: https://sketchfab.com/3d-models/low-poly-phone-for-mockups-bb7058cfb8fd44f2880e03df1235299d
2. Click **Download 3D Model**
3. Select **glTF** format (or **GLB** if available)
4. Extract and rename the file to `phone.glb`
5. Place `phone.glb` in this project folder

### 2. Run the Website

You need a local server because of CORS restrictions with 3D model loading.

**Option A - Python (easiest):**
```bash
python -m http.server 8000
```

**Option B - Node.js:**
```bash
npx serve
```

**Option C - VS Code:**
Install "Live Server" extension and click "Go Live"

### 3. Open in Browser

Navigate to `http://localhost:8000` (or whichever port your server uses)

## ✨ Features

- **Three.js 3D Integration** - Interactive phone model with orbit controls
- **Smooth Animations** - Floating, rotating, and scroll-triggered animations
- **Interactive Demo** - Functional phone screen with app icons
- **Dark Theme** - Premium Apple-inspired black & gold aesthetic
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Performance Optimized** - Tab visibility detection, pixel ratio limiting

## 🎨 Design

- **Primary Background:** Deep black (#0a0a0a)
- **Accent Color:** Warm gold (#f5a623)
- **Secondary Accent:** Cool cyan (#00d4ff)
- **Typography:** Instrument Sans

## 📁 Project Structure

```
Nexus_Phone/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── main.js         # Three.js and interactions
├── phone.glb       # 3D model (you need to download)
└── README.md       # This file
```

## 🔧 Customization

### Change the Phone Model
Replace `phone.glb` with any GLTF/GLB model. Adjust scale in `main.js`:
```javascript
model.scale.set(2, 2, 2); // Adjust these values
```

### Change Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
    --color-accent: #f5a623;
    --color-cyan: #00d4ff;
}
```

## 📝 Credits

- 3D Model: [Low Poly Phone for Mockups](https://sketchfab.com/3d-models/low-poly-phone-for-mockups-bb7058cfb8fd44f2880e03df1235299d) by akacodes (CC Attribution)
- Three.js: https://threejs.org/

## License

MIT - Feel free to use for personal or commercial projects.

