

# 🚀 Kanban Task Board  
A clean, modern, responsive Kanban board application that allows users to create, edit, delete, and organize tasks across "To Do", "Doing", and "Done" columns — with full mobile support, dark mode, local storage persistence, and smooth sidebar interactions.

---
🔗 Presentation Link

👉 Add your presentation link here:
[https://drive.google.com/file/d/16snXGH5737Gej3SY0G53SJobdBD0pVyn/view?usp=sharing]


## 🌈 Features Overview

This Kanban Board is built to deliver a seamless and intuitive task-management experience. Below is a complete breakdown of all the powerful features included in the application.

---

## 📌 1. Task Management  
### ✔ Create Tasks  
Users can add new tasks through a modal form available on both desktop and mobile.

### ✔ Edit Tasks  
Tapping or clicking a task card opens the modal in **edit mode**, allowing users to modify:

- Title  
- Description  
- Status (To Do / Doing / Done)  
- Priority (High / Medium / Low)

### ✔ Delete Tasks  
Tasks can be deleted directly from the edit modal with a confirmation step for safety.

### ✔ Automatic Task Grouping  
Tasks are grouped by status and sorted by priority (High → Medium → Low).

---

## 💾 2. Data Persistence  
### ✔ Fetch Initial Data from API  
On first load:

1. The app attempts to fetch starter tasks from a public API.  
2. If successful, results are normalized and saved locally.  
3. If the API fails, fallback seed data is used.

### ✔ Local Storage Sync  
All task operations (add, update, delete) are saved to `localStorage`, ensuring:

- Tasks remain after refresh  
- Tasks remain after closing the app  
- No account needed — instant persistence  

---

## 🌓 3. Dark & Light Theme Toggle  
### ✔ Custom Sun & Moon Icons  
A theme switcher with user-provided icons allows toggling between **light mode** and **dark mode**.

### ✔ Automatic Logo Switching  
The sidebar logo switches between `logo-light.svg` and `logo-dark.svg` when the theme changes.

### ✔ Theme Memory  
The selected theme is saved in `localStorage` under `kanban.theme`, so the user’s preference always loads automatically.

---

## 📱 4. Fully Responsive Design  
This app is designed to work beautifully on every device:

### ✔ Mobile Mode  
- Sidebar becomes a floating card with smooth animations.  
- A dimmed overlay appears behind the sidebar for better focus.  
- The "Add Task" button becomes a circular + icon.  
- Modals expand to full height with scroll support.  
- Save/Delete buttons remain accessible at the bottom.

### ✔ Desktop Mode  
- Sidebar is fixed on the left.  
- A custom “eye” button allows showing the sidebar when hidden.  
- Three task columns are displayed side-by-side.

---

## 🪟 5. Sidebar Controls  
### ✔ Desktop  
- **Hide Sidebar** button hides the sidebar and shows a floating eye icon.  
- **Show Sidebar** eye icon slides the sidebar back in.  

### ✔ Mobile  
- Sidebar opens when tapping the mobile logo.  
- Sidebar closes when tapping the close (X) button or the overlay.  

---

## 🗂 Folder Structure

📁 project
├── index.html
├── style.css
├── main.js
├── tasks.js
├── storage.js
└── assets/
├── logo-light.svg
├── logo-dark.svg
├── sun.svg
├── moon.svg
└── your-icons-here

yaml
Copy code

---

## 🛠 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/kanban-board.git
2️⃣ Open the project folder
bash
Copy code
cd kanban-board
3️⃣ Start a local server
Use any method (VSCode Live Server is easiest), or:

bash
Copy code
npx http-server .
4️⃣ Open in browser
arduino
Copy code
http://localhost:8080
📘 Technology Used
Technology Purpose
HTML5 Structure of the app
CSS3 Styling, grid, responsive design, dark/light mode
JavaScript (ES Modules) App logic, data handling, DOM interactions
LocalStorage API Data persistence
External Tasks API Initial task data

🎨 UI/UX Highlights
Clean minimal design

Professional theme toggle component

Beautiful sidebar animations

Priority color badges

Smooth modal transitions

Mobile-first optimizations

🧪 Future Improvements (Optional)
These can be added later:

Drag & drop tasks between columns

Multiple boards

User accounts with backend sync

Due dates + reminders

Custom themes

👨‍💻 Author
Your Name
Frontend Developer
Passionate about clean design, modern UI, and building efficient user-centered applications.

⭐ Support
If you love this project, please consider giving it a ⭐ star on GitHub!
It helps others discover the project and motivates future improvements.

🏆 Final Words
This app is a showcase of:

Clean, scalable architecture

Beautiful UI design

Real-world task management logic

Professional frontend engineering practices

Built with care, creativity, and an eye for detail.
Enjoy your Kanban Board!

yaml
Copy code

---

# 🌟 If you want an even more spectacular README…
I can add:

✅ Screenshots section  
✅ GIF demo of the app  
✅ Installation badges  
✅ Live demo link  
✅ Color palette  
✅ Technology badges (HTML, CSS, JS)  

