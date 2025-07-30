// Get all menu links
const menuLinks = document.querySelectorAll('.dropdown-content a');

// Main content section to update
const mainContent = document.querySelector('.main-content');

// Page contents as HTML strings (you can expand this object)
const pages = {
  Dashboard: `
    <h2>Admin Dashboard</h2>
    <p>Welcome to the dashboard! Summary stats will go here.</p>
  `,
  Students: `
    <h2>Students Management</h2>
    <div class="search-bar">
      <input type="text" placeholder="Search students by name or ID" />
      <button>Search</button>
    </div>
    <table class="students-table">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Department</th><th>Year</th><th>Email</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ST101</td><td>Alice Johnson</td><td>Computer Engineering</td><td>3</td><td>alice@example.com</td>
          <td><button class="edit-btn">Edit</button><button class="delete-btn">Delete</button></td>
        </tr>
        <tr>
          <td>ST102</td><td>Bob Smith</td><td>Electrical Engineering</td><td>2</td><td>bob@example.com</td>
          <td><button class="edit-btn">Edit</button><button class="delete-btn">Delete</button></td>
        </tr>
      </tbody>
    </table>
    <button class="add-student-btn">Add New Student</button>
  `,
  // Add other pages similarly
};

// Add click event listeners on menu links
menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default anchor navigation

    const page = link.getAttribute('data-page');

    if (pages[page]) {
      mainContent.innerHTML = pages[page];
    } else {
      mainContent.innerHTML = `<h2>Page Not Found</h2><p>The requested page content is not available.</p>`;
    }
  });
});
