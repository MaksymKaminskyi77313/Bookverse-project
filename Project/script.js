let defaultBooks = [
    { id: 1, title: "Harry Potter", author: "J.K Rowling", category: "Fantasy", img: "https://covers.openlibrary.org/b/id/10523338-L.jpg", description: "A young wizard discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.", type: "featured" },
    { id: 2, title: "The Hobbit", author: "Tolkien", category: "Fantasy", img: "https://covers.openlibrary.org/b/id/11153224-L.jpg", description: "Bilbo Baggins is whisked away from his comfortable, unambitious life in Hobbiton by the wizard Gandalf and a company of dwarves on a quest to reclaim a lost treasure.", type: "featured" },
    { id: 3, title: "Dune", author: "Frank Herbert", category: "Sci-Fi", img: "https://covers.openlibrary.org/b/id/12606557-L.jpg", description: "Set in the far future amidst a sprawling feudal interstellar empire, Dune tells the story of young Paul Atreides as his family accepts the control of the desert planet Arrakis.", type: "featured" },
    { id: 4, title: "1984", author: "George Orwell", category: "History", img: "https://covers.openlibrary.org/b/id/8231856-L.jpg", description: "Winston Smith wrestles with oppression in Oceania, a place where the Party scrutinizes human actions with ever-watchful Big Brother.", type: "featured" },
    { id: 5, title: "Atomic Habits", author: "James Clear", category: "Business", img: "https://covers.openlibrary.org/b/id/240726-L.jpg", description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies to form good habits.", type: "bestseller" },
    { id: 6, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Business", img: "https://covers.openlibrary.org/b/id/5546156-L.jpg", description: "Explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.", type: "bestseller" },
    { id: 7, title: "It Ends With Us", author: "Colleen Hoover", category: "Romance", img: "https://covers.openlibrary.org/b/id/7884866-L.jpg", description: "Lily hasn't always had it easy, but that's never stopped her from working hard for the life she wants. A beautiful yet heartbreaking love triangle tale.", type: "bestseller" },
    { id: 8, title: "The Midnight Library", author: "Matt Haig", category: "Psychology", img: "https://covers.openlibrary.org/b/id/240727-L.jpg", description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life.", type: "new" },
    { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "History", img: "https://covers.openlibrary.org/b/id/240728-L.jpg", description: "Earth is 4.5 billion years old. In just a fraction of that time, one species among countless others has conquered it: us. Sapiens walks through human history.", type: "new" },
    { id: 10, title: "Project Hail Mary", author: "Andy Weir", category: "Sci-Fi", img: "https://covers.openlibrary.org/b/id/240729-L.jpg", description: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity and the Earth from an extinction-level event.", type: "new" }
];

if (!localStorage.getItem("booksDatabase")) {
    localStorage.setItem("booksDatabase", JSON.stringify(defaultBooks));
}
let booksDatabase = JSON.parse(localStorage.getItem("booksDatabase"));

let authorsDatabase = [
    { name: "George Orwell", bio: "English novelist, essayist, journalist, and critic noted for his clear prose, awareness of social injustice, and opposition to totalitarianism.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
    { name: "J.K Rowling", bio: "British author, philanthropist, producer, and screenwriter best known for writing the Harry Potter fantasy series.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    { name: "Tolkien", bio: "English writer, poet, philologist, and academic, best known as the author of the high fantasy classic works The Hobbit and The Lord of the Rings.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" }
];

function saveToStorage() {
    localStorage.setItem("booksDatabase", JSON.stringify(booksDatabase));
}

function renderAllGrids() {
    const featuredGrid = document.getElementById("featured-books-grid");
    const bestsellersGrid = document.getElementById("bestsellers-books-grid");
    const newReleasesGrid = document.getElementById("new-releases-grid");
    const authorsGrid = document.getElementById("authors-grid");

    if(featuredGrid) featuredGrid.innerHTML = "";
    if(bestsellersGrid) bestsellersGrid.innerHTML = "";
    if(newReleasesGrid) newReleasesGrid.innerHTML = "";
    if(authorsGrid) authorsGrid.innerHTML = "";

    booksDatabase.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <img src="${book.img}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>By ${book.author}</p>
        `;
        card.addEventListener("click", () => openDetailsModal(book.id));

        if (book.type === "featured" && featuredGrid) featuredGrid.appendChild(card);
        else if (book.type === "bestseller" && bestsellersGrid) bestsellersGrid.appendChild(card);
        else if (book.type === "new" && newReleasesGrid) newReleasesGrid.appendChild(card);
    });

    authorsDatabase.forEach(author => {
        const card = document.createElement("div");
        card.className = "author-card";
        card.innerHTML = `
            <img src="${author.img}" alt="${author.name}">
            <h3>${author.name}</h3>
        `;
        card.addEventListener("click", () => openAuthorModal(author.name));
        if(authorsGrid) authorsGrid.appendChild(card);
    });
}

function setupModal(openId, modalId, closeId) {
    const openBtn = document.getElementById(openId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => modal.classList.add("active"));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }
}

function openDetailsModal(bookId) {
    const book = booksDatabase.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById("modal-view-title").innerText = book.title;
    document.getElementById("modal-view-author").innerText = `By ${book.author}`;
    document.getElementById("modal-view-category").innerText = book.category;
    document.getElementById("modal-view-description").innerText = book.description;
    document.getElementById("modal-view-img").src = book.img;

    const deleteBtn = document.getElementById("delete-book-btn");
    if(deleteBtn) {
        deleteBtn.onclick = function() {
            booksDatabase = booksDatabase.filter(b => b.id !== bookId);
            saveToStorage();
            document.getElementById("details-book-modal").classList.remove("active");
            renderAllGrids();
            if(typeof renderCatalog === 'function') renderCatalog();
            if(typeof renderAdminTable === 'function') renderAdminTable();
        };
    }

    document.getElementById("details-book-modal").classList.add("active");
}

function openAuthorModal(authorName) {
    const author = authorsDatabase.find(a => a.name === authorName);
    if (!author) return;

    document.getElementById("author-modal-name").innerText = author.name;
    document.getElementById("author-modal-bio").innerText = author.bio;
    document.getElementById("author-modal-img").src = author.img;

    const list = document.getElementById("author-books-list");
    list.innerHTML = "";
    
    const books = booksDatabase.filter(b => b.author.toLowerCase().includes(authorName.toLowerCase()));
    if(books.length === 0) {
        list.innerHTML = "<li>No books uploaded by this author yet.</li>";
    } else {
        books.forEach(b => {
            list.innerHTML += `<li>${b.title} (${b.category})</li>`;
        });
    }

    document.getElementById("author-modal").classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
    renderAllGrids();

    const searchInput = document.getElementById("global-search");
    if (searchInput) {
        searchInput.addEventListener("input", function(e) {
            const query = e.target.value.toLowerCase().trim();
            const allCards = document.querySelectorAll(".book-card");
            
            allCards.forEach(card => {
                const title = card.querySelector("h3").innerText.toLowerCase();
                const author = card.querySelector("p").innerText.toLowerCase();
                if (title.includes(query) || author.includes(query)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    document.querySelectorAll(".category-grid div").forEach(item => {
        item.addEventListener("click", function() {
            const selectedCat = this.getAttribute("data-category");
            window.location.href = `catalog.html?category=${selectedCat}`;
        });
    });

    setupModal("open-add-book-modal", "add-book-modal", "close-add-modal");
    
    const authBtn = document.getElementById("auth-btn");
    if (authBtn) {
        authBtn.addEventListener("click", () => {
            window.location.href = "auth.html";
        });
    }
    
    setupModal(null, "details-book-modal", "close-details-modal");
    setupModal(null, "author-modal", "close-author-modal");

    const addBookForm = document.getElementById("add-book-form");
    if (addBookForm) {
        addBookForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const title = document.getElementById("new-title").value;
            const author = document.getElementById("new-author").value;
            let img = document.getElementById("new-image").value.trim();
            const category = document.getElementById("new-category").value;
            const description = document.getElementById("new-description").value;

            if (!img) {
                img = "https://images.unsplash.com/photo-1512820790803-83ca734da794";
            }

            const newBook = {
                id: Date.now(),
                title,
                author,
                category,
                img,
                description,
                type: "new"
            };

            booksDatabase.unshift(newBook);
            saveToStorage();
            document.getElementById("add-book-modal").classList.remove("active");
            this.reset();
            renderAllGrids();
            
            document.querySelector(".new-releases").scrollIntoView({ behavior: 'smooth' });
        });
    }

    const heroImages = [
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
    ];
    let heroIndex = 0;
    const heroImgElement = document.querySelector(".hero-right img");
    if (heroImgElement) {
        setInterval(() => {
            heroIndex = (heroIndex + 1) % heroImages.length;
            heroImgElement.src = heroImages[heroIndex];
        }, 4000);
    }

    const moonIcon = document.querySelector(".fa-moon");
    if (moonIcon) {
        moonIcon.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
        });
    }

    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progressBar = document.querySelector(".progress-bar");
        if (height > 0 && progressBar) {
            progressBar.style.width = (winScroll / height) * 100 + "%";
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll("section").forEach(section => observer.observe(section));

    const wishlistBtn = document.getElementById("wishlist-btn");
    if(wishlistBtn) wishlistBtn.onclick = () => alert("Wishlist system active! Book saved.");

    const cartBtn = document.getElementById("cart-btn");
    if(cartBtn) cartBtn.onclick = () => alert("Cart status updated.");

    const newsBtn = document.querySelector(".newsletter button");
    if(newsBtn) newsBtn.onclick = () => alert("Subscription complete!");

    const chatBtn = document.querySelector(".chat-btn");
    if(chatBtn) chatBtn.onclick = () => alert("Support interface connecting...");
});