// =====================
// Amarjeet Portfolio — Script
// =====================

// Theme toggle with persistence
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);
document.getElementById('themeToggle').addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Mobile nav
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('show');
});

// Typewriter
const roles = [
  'Aspiring Engineer',
  'Learning MERN(S)',
  'Pythonista | DS/AI/ML',
  'Cybersecurity Curious',
  'Builder • Breaker • Coder'
];
let i = 0, j = 0, del = false;
function type() {
  const target = document.getElementById('typewriter');
  if (!target) return;
  const word = roles[i];
  if (!del) {
    target.textContent = word.slice(0, ++j);
    if (j === word.length) { del = true; setTimeout(type, 900); return; }
  } else {
    target.textContent = word.slice(0, --j);
    if (j === 0) { del = false; i = (i + 1) % roles.length; }
  }
  setTimeout(type, del ? 60 : 100);
}
document.addEventListener('DOMContentLoaded', type);

// Show timeline only after 70% scroll
function revealTimelineOnScroll() {
  const tl = document.getElementById('timelineList');
  if (!tl) return;
  const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
  if (scrolled >= 0.7) {
    tl.hidden = false;
    window.removeEventListener('scroll', revealTimelineOnScroll);
  }
}
window.addEventListener('scroll', revealTimelineOnScroll);

// Feature comments — limit 3/day
// --- Feedback (with delete option + confirm) ---
const LIMIT = 3;
const KEY = 'feedback_meta';

function updateRemaining() {
  const info = JSON.parse(localStorage.getItem(KEY) || '{}');
  const today = new Date().toDateString();
  const used = info.date === today ? (info.count || 0) : 0;
  const remaining = Math.max(0, LIMIT - used);
  const span = document.getElementById('remaining');
  if (span) span.textContent = `${remaining} of ${LIMIT} left today`;
  return {info, today, used, remaining};
}

function saveFeedback(name, comment) {
  const list = JSON.parse(localStorage.getItem('feedback_list') || '[]');
  list.unshift({ id: Date.now(), name, comment, at: new Date().toLocaleString() });
  localStorage.setItem('feedback_list', JSON.stringify(list));
  renderFeedbackList();
}

function deleteFeedback(id) {
  if (!confirm("Are you sure you want to delete this comment?")) return; // confirmation
  let list = JSON.parse(localStorage.getItem('feedback_list') || '[]');
  list = list.filter(item => item.id !== id);
  localStorage.setItem('feedback_list', JSON.stringify(list));
  renderFeedbackList();
}

function renderFeedbackList() {
  const ul = document.getElementById('feedbackList');
  if (!ul) return;
  const list = JSON.parse(localStorage.getItem('feedback_list') || '[]');
  ul.innerHTML = '';

  list.slice(0, 20).forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `[${item.at}] <b>${item.name}</b>: ${item.comment} `;

    // delete button
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.style.marginLeft = '10px';
    btn.onclick = () => deleteFeedback(item.id);

    li.appendChild(btn);
    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateRemaining();
  renderFeedbackList();
  const form = document.getElementById('feedbackForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const {info, today, used, remaining} = updateRemaining();
    if (remaining <= 0) {
      alert('Daily limit reached (3). Try again tomorrow!');
      return;
    }
    const name = document.getElementById('featureName').value.trim();
    const comment = document.getElementById('featureComment').value.trim();
    if (!name || !comment) return;
    saveFeedback(name, comment);
    const next = { date: today, count: (used + 1) };
    localStorage.setItem(KEY, JSON.stringify(next));
    updateRemaining();
    e.target.reset();
  });
});
