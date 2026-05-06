function fetchUsers() {
  return new Promise((resolve, reject) => {
    const shouldFail = false; // change to true to simulate failure
    document.getElementById('loader').textContent = "Loading users...";
    document.getElementById('userList').innerHTML = "";
    document.getElementById('errorMsg').textContent = "";

    setTimeout(() => {
      if (!shouldFail) {
        resolve([
          { name: "John Doe", email: "john@example.com" },
          { name: "Jane Smith", email: "jane@example.com" },
          { name: "Bob Johnson", email: "bob@example.com" }
        ]);
      } else {
        reject("Failed to load users.");
      }
    }, 3000);
  });
}

document.getElementById('loadBtn').addEventListener('click', () => {
  fetchUsers()
    .then(users => {
      document.getElementById('loader').textContent = "";
      const userList = document.getElementById('userList');
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.email})`;
        userList.appendChild(li);
      });
    })
    .catch(err => {
      document.getElementById('loader').textContent = "";
      document.getElementById('errorMsg').textContent = err;
    });
});