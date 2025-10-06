async function loadProjects(file, target) {
  const res = await fetch(file);
  const md = await res.text();
  const blocks = md.split(/^---$/m);

  const html = blocks.map(block => {
    const lines = block.trim().split("\n");
    const title = lines[0].replace(/^#\s*/, "");
    const icon = lines.find(l => l.startsWith("icon:"))?.replace("icon:", "").trim();
    const image = lines.find(l => l.startsWith("image:"))?.replace("image:", "").trim();
    const link = lines.find(l => l.startsWith("link:"))?.replace("link:", "").trim();
    const desc = lines.find(l => l.startsWith("desc:"))?.replace("desc:", "").trim();

    return `
      <div class="project-card">
        ${icon ? `<img class="icon" src="${icon}" alt="${title} icon">` : ""}
        <h3>${title}</h3>
        ${desc ? `<p>${desc}</p>` : ""}
        ${link ? `<a href="${link}" target="_blank">Learn more →</a>` : ""}
        ${image ? `<img class="screenshot" src="${image}" alt="${title} screenshot">` : ""}
      </div>
    `;
  }).join("");

  document.getElementById(target).innerHTML = html;
}

// вызов
loadProjects("projects.md", "projects-content");