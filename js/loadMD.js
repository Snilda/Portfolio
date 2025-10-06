async function loadProjects(file, target) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
    const md = await res.text();

    // Разделяем блоки по строкам с только '---' (игнорируем пробелы)
    const blocks = md.split(/^\s*---\s*$/m);

    const html = blocks.map(block => {
      const lines = block.trim().split("\n").filter(l => l.trim() !== "");
      if (lines.length === 0) return "";

      // Первая строка - заголовок
      const titleLine = lines[0].trim();
      const title = titleLine.replace(/^#\s*/, "");

      // Парсим все поля вида key: value
      const fields = {};
      lines.slice(1).forEach(line => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        fields[key.trim().toLowerCase()] = rest.join(":").trim();
      });

      return `
        <div class="project-card">
          ${fields.icon ? `<img class="icon" src="${fields.icon}" alt="${title} icon">` : ""}
          <h3>${title}</h3>
          ${fields.desc ? `<p>${fields.desc}</p>` : ""}
          ${fields.link ? `<a href="${fields.link}" target="_blank">Learn more →</a>` : ""}
          ${fields.image ? `<img class="screenshot" src="${fields.image}" alt="${title} screenshot">` : ""}
        </div>
      `;
    }).join("");

    document.getElementById(target).innerHTML = html;

  } catch (err) {
    console.error(err);
    document.getElementById(target).innerHTML = `<p>Error loading projects.</p>`;
  }
}

// вызов
loadProjects("projects.md", "projects-content");
