const input = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');

function addItem() {
    const text = input.value.trim();
    if (!text) return;

    // Create LI
    const li = document.createElement('li');
    
    li.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Handle Delete with a small fade-out effect
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.style.opacity = '0';
        li.style.transform = 'scale(0.9)';
        setTimeout(() => li.remove(), 200);
    });

    itemList.appendChild(li);
    input.value = "";
    input.focus();
}

addBtn.addEventListener('click', addItem);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});