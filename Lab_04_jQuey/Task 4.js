const tabs = document.querySelectorAll('.tab-link');
const sections = document.querySelectorAll('.content-box');

tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);

        // 1. Reset all buttons and sections
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // 2. Set active state
        btn.classList.add('active');
        targetSection.classList.add('active');

        // 3. Smooth Scroll - scroll-margin-top in CSS handles the offset
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});