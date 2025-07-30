Planning to Build Angular+SpringBoot+Postgres
How to start Building Web Application similar to one given below.
Suggest step by step work to do this using angular. Intention is not only build Frontend but also understand Angular.


Planned Update:
project-root/
├── index.html
├── style.css
├── reset.css
├── Menu.js
├── pages/
│   ├── dashboard.html
│   └── students.html
├── pageStyles/
│   ├── students.css
├── components/
│   └── nav.html
├── utils/
│   └── loadPage.js

HTML Reference:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="Menu.js" defer></script>
    <link rel="stylesheet" href="reset.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Header Navigation Bar -->
    <header class="navbar">
        <div class="nav-left">
            <div class="dropdown">
                <button class="menu-btn">Menu</button>
                <div class="dropdown-content">
                    <a href="#" data-page="Dashboard">Dashboard</a>
                    <a href="#" data-page="Students">Students</a>
                    <a href="#">Faculties</a>
                    <a href="#">Classrooms & Labs</a>
                    <a href="#">Semesters</a>
                    <a href="#">Subject Allotment</a>
                    <a href="#">Time Table</a>
                    <a href="#">COE</a>
                </div>
            </div>
        </div>
        <div class="nav-right">
            <a href="#" class="logout-btn">Logout</a>
        </div>
    </header>

    <!-- Main Content Area -->
    <main>
        <section class="main-content">
            <h2>Admin Dashboard Placeholder</h2>
            <p>This is a placeholder for main admin content. We'll define this later.</p>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <!-- Empty footer as per instruction -->
    </footer>


</body>
</html>

