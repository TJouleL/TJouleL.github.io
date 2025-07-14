document.addEventListener('DOMContentLoaded', () => {
    const blogList = document.getElementById('blog-list');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    const currentPath = window.location.pathname;
    let jsonPath = 'index.json';
    if (currentPath.startsWith('/nl/')) {
      jsonPath = '/nl/index.json';
    } else if (currentPath.startsWith('/en/')) {
      jsonPath = '/en/index.json';
    }

    fetch(jsonPath)
      .then(response => response.json())
      .then(posts => {
        function renderPosts(filteredPosts) {
          blogList.innerHTML = '';
          filteredPosts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
              <a href="${post.url}"><img src="${post.picture_url}" alt="${post.title}" class="post-image"></a>
              <h2><a href="${post.url}">${post.title}</a></h2>
              <p>${post.description}</p>
              <p><em>${post.date}</em></p>
            `;
            blogList.appendChild(article);
          });
        }

        function filterAndSortPosts() {
          let filteredPosts = posts.filter(post =>
                post.title.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                post.description.toLowerCase().includes(searchInput.value.toLowerCase())
          );
              

          if (sortSelect.value === 'date') {
            filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
          } else if (sortSelect.value === 'name') {
            filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
          }

          renderPosts(filteredPosts);
        }

        searchInput.addEventListener('input', filterAndSortPosts);
        sortSelect.addEventListener('change', filterAndSortPosts);

        renderPosts(posts);
      })
      .catch(error => console.error('Error loading posts:', error));
});


// Matrix background effect
function initMatrixBackground() {
  const canvas = document.getElementById('matrix-background');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const letters = '01';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(0);

  function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
          const text = letters[Math.floor(Math.random() * letters.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          drops[i]++;
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.999) {
              drops[i] = 0;
          }
      }
  }
  setInterval(draw, 33);
}
initMatrixBackground();
