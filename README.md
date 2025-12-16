# 🎓 Educational Grievance Management System (UniVoice)

**UniVoice** is a centralized grievance redressal portal designed for educational institutions. It bridges the gap between students, faculty, and administration by providing a transparent, efficient, and secure platform for submitting and resolving campus issues.

## 🚀 Key Features

* **Role-Based Access Control:** Secure login portals for **Students**, **Faculty**, and **Admins**.
* **Grievance Submission:** Easy-to-use forms for reporting Academic, Facility, or Administration issues with attachment support.
* **Real-Time Tracking:** Live status updates (Pending → In Progress → Resolved) for every ticket.
* **Admin Dashboard:** Comprehensive visual analytics and management tools to oversee and resolve complaints.
* **Secure Authentication:** User verification and role management backed by a robust MySQL database.
* **Modern UI:** Responsive and accessible design featuring Glassmorphism and Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v3)
* **Icons:** Lucide React
* **State Management:** React Hooks

### Backend
* **Framework:** Spring Boot (Java 17)
* **Data Access:** Spring Data JPA
* **Database:** MySQL
* **Build Tool:** Maven

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:
* **Node.js** (v16 or higher)
* **Java JDK** (v17 or higher)
* **MySQL Server** (v8.0)
* **Maven**

---

## 📥 Installation & Setup

### 1. Database Setup
1.  Open **MySQL Workbench** or your terminal.
2.  Create a database named `grievance_db` (Optional: The app is configured to create it automatically).
3.  Ensure your MySQL server is running on port **3306**.

### 2. Backend Setup (Spring Boot)
1.  Navigate to the backend directory:
    ```bash
    cd grievance-backend
    ```
2.  Update `src/main/resources/application.properties` if your MySQL password differs:
    ```properties
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The server will start at `http://localhost:8080`.*

### 3. Frontend Setup (React)
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # Ensure Tailwind is installed
    npm install -D tailwindcss@3.4.17 postcss autoprefixer
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The application will be available at `http://localhost:5173` (or similar).*

---

## 📖 Usage Guide

### 1. Registration
* Open the frontend link in your browser.
* Click **"Create an account"**.
* Register as a **Student** or **Faculty**.

### 2. Logging In
* Use your registered email and password.
* **Admin Access:** To access the Admin Dashboard, you may need to manually update a user's role to `ADMIN` in the database, or create an admin seeder script.

### 3. Submitting a Grievance
* Log in as a Student.
* Click **"New Grievance"**.
* Select a category (e.g., Academic), describe the issue, and click Submit.

### 4. Resolving Issues (Admin)
* Log in as an Admin.
* View the dashboard statistics.
* Click **"Manage"** on any grievance row.
* Add resolution notes and change status to **"Resolved"**.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

**© 2025 Educational Grievance Management System**
