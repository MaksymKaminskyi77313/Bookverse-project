let defaultBooks = [
    { id: 1, title: "Harry Potter", author: "J.K Rowling", category: "Fantasy", img: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=600&auto=format&fit=crop", description: "A young wizard discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.", type: "featured", reviews: [] },
    { id: 2, title: "The Hobbit", author: "Tolkien", category: "Fantasy", img: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=600&auto=format&fit=crop", description: "Bilbo Baggins is whisked away from his comfortable, unambitious life in Hobbiton by the wizard Gandalf and a company of dwarves on a quest to reclaim a lost treasure.", type: "featured", reviews: [] },
    { id: 3, title: "Dune", author: "Frank Herbert", category: "Sci-Fi", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop", description: "Set in the far future amidst a sprawling feudal interstellar empire, Dune tells the story of young Paul Atreides as his family accepts the control of the desert planet Arrakis.", type: "featured", reviews: [] },
    { id: 4, title: "1984", author: "George Orwell", category: "History", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop", description: "Winston Smith wrestles with oppression in Oceania, a place where the Party scrutinizes human actions with ever-watchful Big Brother.", type: "featured", reviews: [] },
    { id: 5, title: "Atomic Habits", author: "James Clear", category: "Business", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop", description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies to form good habits.", type: "bestseller", reviews: [] },
    { id: 6, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Business", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=600&auto=format&fit=crop", description: "Explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.", type: "bestseller", reviews: [] },
    { id: 7, title: "It Ends With Us", author: "Colleen Hoover", category: "Romance", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop", description: "Lily hasn't always had it easy, but that's never stopped her from working hard for the life she wants. A beautiful yet heartbreaking love triangle tale.", type: "bestseller", reviews: [] },
    { id: 8, title: "The Midnight Library", author: "Matt Haig", category: "Psychology", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop", description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life.", type: "new", reviews: [] },
    { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "History", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop", description: "Earth is 4.5 billion years old. In just a fraction of that time, one species among countless others has conquered it: us. Sapiens walks through human history.", type: "new", reviews: [] },
    { id: 10, title: "Project Hail Mary", author: "Andy Weir", category: "Sci-Fi", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&auto=format&fit=crop", description: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity and the Earth from an extinction-level event.", type: "new", reviews: [] }
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

let currentSelectedBookId = null;

function saveToStorage() {
    localStorage.setItem("booksDatabase", JSON.stringify(booksDatabase));
}

function updateCartBadge() {
    const badge = document.getElementById('cart-global-count');
    if (badge) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        badge.innerText = cart.length;
    }
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
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
            </div>
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

    currentSelectedBookId = bookId;

    if (!book.reviews) {
        book.reviews = [];
    }

    document.getElementById("modal-view-title").innerText = book.title;
    document.getElementById("modal-view-author").innerText = `By ${book.author}`;
    document.getElementById("modal-view-category").innerText = book.category;
    document.getElementById("modal-view-description").innerText = book.description;
    document.getElementById("modal-view-img").src = book.img;

    let reviewsContainer = document.getElementById("modal-reviews-container");
    if (!reviewsContainer) {
        const modalContent = document.querySelector("#details-book-modal .modal-content");
        reviewsContainer = document.createElement("div");
        reviewsContainer.id = "modal-reviews-container";
        reviewsContainer.style.marginTop = "30px";
        reviewsContainer.style.borderTop = "1px solid #333";
        reviewsContainer.style.paddingTop = "20px";
        modalContent.appendChild(reviewsContainer);
    }

    function renderReviews() {
        let avgRating = "No ratings yet";
        if (book.reviews.length > 0) {
            const sum = book.reviews.reduce((acc, r) => acc + r.rating, 0);
            avgRating = (sum / book.reviews.length).toFixed(1) + " / 5 ★";
        }

        reviewsContainer.innerHTML = `
            <h3 style="color: white; margin-bottom: 10px;">User Reviews (<span style="color: #a855f7;">${avgRating}</span>)</h3>
            <div id="reviews-list" style="max-height: 150px; overflow-y: auto; margin-bottom: 15px; padding-right: 5px;">
                ${book.reviews.length === 0 ? '<p style="color: #666; font-style: italic;">No opinions yet. Be the first to review!</p>' : book.reviews.map(r => `
                    <div style="background: #1a1a1a; padding: 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #222;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: #a855f7; font-weight: bold; font-size: 14px;">${r.user}</span>
                            <span style="color: #eab308; font-size: 13px;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                        </div>
                        <p style="color: #bbb; font-size: 13px; line-height: 1.4;">${r.text}</p>
                    </div>
                `).join("")}
            </div>
            <form id="add-review-form" style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="review-user" placeholder="Your Name" required style="flex: 1; padding: 8px 12px; background: #222; border: 1px solid #333; color: white; border-radius: 6px; font-size: 13px;">
                    <select id="review-rating" style="padding: 8px 12px; background: #222; border: 1px solid #333; color: #eab308; border-radius: 6px; font-size: 13px; font-weight: bold;">
                        <option value="5">5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="3">3 ★</option>
                        <option value="2">2 ★</option>
                        <option value="1">1 ★</option>
                    </select>
                </div>
                <textarea id="review-text" placeholder="Write your opinion here..." rows="2" required style="padding: 8px 12px; background: #222; border: 1px solid #333; color: white; border-radius: 6px; font-size: 13px; resize: none;"></textarea>
                <button type="submit" class="btn-primary" style="padding: 8px 15px; font-size: 13px; align-self: flex-end;">Submit Review</button>
            </form>
        `;

        document.getElementById("add-review-form").addEventListener("submit", function(e) {
            e.preventDefault();
            const user = document.getElementById("review-user").value;
            const rating = parseInt(document.getElementById("review-rating").value);
            const text = document.getElementById("review-text").value;

            book.reviews.push({ user, rating, text });
            saveToStorage();
            renderReviews();
        });
    }

    renderReviews();

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
    window.location.href = `author.html?name=${encodeURIComponent(authorName)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderAllGrids();
    updateCartBadge();

    const addToCartModalBtn = document.getElementById('add-to-cart-modal-btn');
    if (addToCartModalBtn) {
        addToCartModalBtn.onclick = function() {
            if (!currentSelectedBookId) return;
            const targetBook = booksDatabase.find(b => b.id === currentSelectedBookId);
            if (!targetBook) return;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const isExist = cart.some(item => item.id === targetBook.id);

            if (isExist) {
                alert(`"${targetBook.title}" is already in your cart!`);
            } else {
                cart.push(targetBook);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();
                alert(`"${targetBook.title}" successfully added to your cart!`);
            }
            document.getElementById("details-book-modal").classList.remove("active");
        };
    }

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
                type: "new",
                reviews: []
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

    const newsBtn = document.querySelector(".newsletter button");
    if(newsBtn) newsBtn.onclick = () => alert("Subscription complete!");

    const chatBtn = document.querySelector(".chat-btn");
    if(chatBtn) chatBtn.onclick = () => alert("Support interface connecting...");
});