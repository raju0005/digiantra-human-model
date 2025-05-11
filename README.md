
# Human Model Viewer with Clickable Parts and Stencil Outline


This project showcases an interactive 3D human figure built using Three.js, complete with a radial grid ground, camera controls, and object highlighting using scale animation and stencil outlines. It's designed as a demonstration of frontend 3D graphics skills for the Digiantra Frontend Intern shortlisting.

This interactive 3D scene displays a stylized human figure using Three.js. Each body part (head, arms, legs, body, cap) is individually clickable and responds with a smooth scale animation and an outline highlight using stencil buffer techniques.

The scene includes:

- A textured background

- Directional lighting

- A ring-shaped ground with radial and concentric grid lines

- A grouped human figure model

- Interactive click events on each body part with GSAP animation

- Highlighting with stencil-based outline effect


## 🧩 Features

- **Interactive Clickable Body Parts:** Click on the head, body, arms, or legs to scale them up and highlight them.

- **GSAP Animations:** Smooth scaling animations for user interaction.

- **Orbit Controls:** Enables camera rotation and zoom.

- **Stencil Outlines:** Clean outline effects that enhance part selection.

- **Responsive Design:** Adjusts automatically to window size changes.


## 📁 Project Structure
```bash 
/project-root
├── src/ 
│ ├── bg.jpg # Background image for the scene 
│ ├── main.js # Your main Three.js + GSAP + DOM code 
│ └── style.css # Styling for the scene (if any) 
├── index.html # Entry point HTML file 
```
## 🛠️ Installation & Usage
1. Clone the repository
```bash
git clone https://github.com/your-username/digiantra-human-model.git
cd digiantra-human-model
```
2. Install dependencies :

```js 
npm install three gsap
```

3. Run the Vite server:

```js
npm run dev
```
## 🖱️ Interaction Guide
- Click on any part of the human figure to:

   - Scale it up with animation

   - Show an outline using stencil buffer techniques

- Click again to reset to original size and remove outline.

- Use mouse drag/zoom via OrbitControls to explore the scene.
## 🧰 Tech Stack
- Three.js

- GSAP

- JavaScript (ES6)

- Vite
## 🎯 Purpose

This is a submission for the Digiantra Frontend Intern shortlisting challenge, aimed at demonstrating:

- 3D graphics and animation capabilities

- UI interactivity via raycasting

- Familiarity with WebGL and Three.js ecosystem
