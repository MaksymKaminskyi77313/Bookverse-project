// catalog

 
  const catalogGrid = document.getElementById("catalog-grid");
        const catSearch   = document.getElementById("catalog-search");
        const catFilter   = document.getElementById("catalog-filter-category");
        const catSort     = document.getElementById("catalog-sort");

        const urlParams = new URLSearchParams(window.location.search);
        const catParam  = urlParams.get('category');
        if (catParam) catFilter.value = catParam;

        function renderBooks(data) {
            catalogGrid.innerHTML = "";

            if (data.length === 0) {
                catalogGrid.innerHTML = `<p style="color:#666; font-size:18px; grid-column:1/-1; text-align:center;">No books found matching your criteria.</p>`;
                return;
            }

            data.forEach(book => {
                const card = document.createElement("div");
                card.className = "book-card";
                card.innerHTML = `
                    <img src="${book.image || book.img || ''}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>By ${book.author}</p>
                `;
                card.addEventListener("click", () => openCatalogModal(book));
                catalogGrid.appendChild(card);
            });
        }

        function renderCatalog() {
            let data = [...booksDatabase];

            const query = catSearch.value.toLowerCase().trim();
            if (query) {
                data = data.filter(b =>
                    b.title.toLowerCase().includes(query) ||
                    b.author.toLowerCase().includes(query)
                );
            }

            const category = catFilter.value;
            if (category !== "all") {
                data = data.filter(b => b.category === category);
            }

            const sort = catSort.value;
            if (sort === "az") data.sort((a, b) => a.title.localeCompare(b.title));
            if (sort === "za") data.sort((a, b) => b.title.localeCompare(a.title));

            renderBooks(data);
        }

        function openCatalogModal(book) {
            document.getElementById("modal-view-title").innerText       = book.title;
            document.getElementById("modal-view-author").innerText      = `By ${book.author}`;
            document.getElementById("modal-view-category").innerText    = book.category;
            document.getElementById("modal-view-description").innerText = book.description || "";
            document.getElementById("modal-view-img").src               = book.image || book.img || "";

            const deleteBtn = document.getElementById("catalog-delete-btn");
            deleteBtn.onclick = async function () {
                if (!confirm("Delete this book?")) return;
                await fetch(`${API_URL}/${book.id}`, { method: "DELETE" });
                booksDatabase = booksDatabase.filter(b => b.id !== book.id);
                document.getElementById("details-book-modal").classList.remove("active");
                renderCatalog();
            };

            document.getElementById("details-book-modal").classList.add("active");
        }
        document.getElementById("close-details-modal").addEventListener("click", () => {
            document.getElementById("details-book-modal").classList.remove("active");
        });

        async function initCatalog() {
            try {
                const res = await fetch(API_URL);
                booksDatabase = await res.json();
            } catch (err) {
                console.error("Failed to load books:", err);
                catalogGrid.innerHTML = `<p style="color:#ef4444; grid-column:1/-1; text-align:center;">Could not connect to backend. Is Spring Boot running?</p>`;
                return;
            }
            renderCatalog();
        }

        catSearch.addEventListener("input",  renderCatalog);
        catFilter.addEventListener("change", renderCatalog);
        catSort.addEventListener("change",   renderCatalog);

        window.addEventListener("load", initCatalog);
        console.log("USER:", user);
 