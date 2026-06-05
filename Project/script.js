const API_URL = "https://bookverse-project.onrender.com/books";
let booksDatabase = [];
let currentSelectedBookId = null;

let authorsDatabase = [
    { name: "George Orwell", bio: "English novelist, essayist, journalist, and critic noted for his clear prose, awareness of social injustice, and opposition to totalitarianism.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
    { name: "J.K Rowling", bio: "British author, philanthropist, producer, and screenwriter best known for writing the Harry Potter fantasy series.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    { name: "Tolkien", bio: "English writer, poet, philologist, and academic, best known as the author of the high fantasy classic works The Hobbit and The Lord of the Rings.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" }
];
 

async function loadBooks() {
    try {
        const res = await fetch(API_URL);
        booksDatabase = await res.json();
        renderAllGrids();
    } catch (err) {
        console.error("Could not connect to backend:", err);
        renderAllGrids();
    }
}

async function createBook(bookData) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData)
        });
        const newBook = await res.json();
        booksDatabase.unshift(newBook);
        renderAllGrids();
        if (typeof renderCatalog === 'function') renderCatalog();
        if (typeof renderAdminTable === 'function') renderAdminTable();
    } catch (err) {
        console.error("Failed to create book:", err);
    }
}

async function deleteBook(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        booksDatabase = booksDatabase.filter(b => b.id !== id);
        renderAllGrids();
        if (typeof renderCatalog === 'function') renderCatalog();
        if (typeof renderAdminTable === 'function') renderAdminTable();
    } catch (err) {
        console.error("Failed to delete book:", err);
    }
}

async function updateBook(id, updatedData) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });
        const updated = await res.json();
        const index = booksDatabase.findIndex(b => b.id === id);
        if (index !== -1) booksDatabase[index] = updated;
        renderAllGrids();
        if (typeof renderCatalog === 'function') renderCatalog();
        if (typeof renderAdminTable === 'function') renderAdminTable();
    } catch (err) {
        console.error("Failed to update book:", err);
    }
}

 

function updateCartBadge() {
    const badge = document.getElementById('cart-global-count');
    if (badge) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        badge.innerText = cart.length;
    }
}

 

function renderAllGrids() {
    const featuredGrid    = document.getElementById("featured-books-grid");
    const bestsellersGrid = document.getElementById("bestsellers-books-grid");
    const newReleasesGrid = document.getElementById("new-releases-grid");
    const authorsGrid     = document.getElementById("authors-grid");

    if (featuredGrid)    featuredGrid.innerHTML    = "";
    if (bestsellersGrid) bestsellersGrid.innerHTML = "";
    if (newReleasesGrid) newReleasesGrid.innerHTML = "";
    if (authorsGrid)     authorsGrid.innerHTML     = "";

    booksDatabase.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <img src="${book.image || book.img || ''}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
            </div>
        `;
        card.addEventListener("click", () => openDetailsModal(book.id));

        if      (book.type === "featured"   && featuredGrid)    featuredGrid.appendChild(card);
        else if (book.type === "bestseller" && bestsellersGrid) bestsellersGrid.appendChild(card);
        else if (book.type === "new"        && newReleasesGrid) newReleasesGrid.appendChild(card);
    });

    authorsDatabase.forEach(author => {
        const card = document.createElement("div");
        card.className = "author-card";
        card.innerHTML = `
            <img src="${author.img}" alt="${author.name}">
            <h3>${author.name}</h3>
        `;
        card.addEventListener("click", () => openAuthorModal(author.name));
        if (authorsGrid) authorsGrid.appendChild(card);
    });
}

 

function setupModal(openId, modalId, closeId) {
    const openBtn  = document.getElementById(openId);
    const modal    = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (openBtn && modal)  openBtn.addEventListener("click",  () => modal.classList.add("active"));
    if (closeBtn && modal) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
}

function openDetailsModal(bookId) {
    const book = booksDatabase.find(b => b.id === bookId);
    if (!book) return;

    currentSelectedBookId = bookId;

    document.getElementById("modal-view-title").innerText       = book.title;
    document.getElementById("modal-view-author").innerText      = `By ${book.author}`;
    document.getElementById("modal-view-category").innerText    = book.category;
    document.getElementById("modal-view-description").innerText = book.description || "";
    document.getElementById("modal-view-img").src               = book.image || book.img || "";
 
    if (!book.reviews) book.reviews = [];

    let reviewsContainer = document.getElementById("modal-reviews-container");
    if (!reviewsContainer) {
        const modalContent = document.querySelector("#details-book-modal .modal-content");
        if (modalContent) {
            reviewsContainer = document.createElement("div");
            reviewsContainer.id = "modal-reviews-container";
            reviewsContainer.style.marginTop  = "30px";
            reviewsContainer.style.borderTop  = "1px solid #333";
            reviewsContainer.style.paddingTop = "20px";
            modalContent.appendChild(reviewsContainer);
        }
    }

    if (reviewsContainer) {
        function renderReviews() {
            let avgRating = "No ratings yet";
            if (book.reviews.length > 0) {
                const sum = book.reviews.reduce((acc, r) => acc + r.rating, 0);
                avgRating = (sum / book.reviews.length).toFixed(1) + " / 5 ★";
            }

            reviewsContainer.innerHTML = `
                <h3 style="color:white; margin-bottom:10px;">User Reviews (<span style="color:#a855f7;">${avgRating}</span>)</h3>
                <div id="reviews-list" style="max-height:150px; overflow-y:auto; margin-bottom:15px; padding-right:5px;">
                    ${book.reviews.length === 0
                        ? '<p style="color:#666; font-style:italic;">No opinions yet. Be the first to review!</p>'
                        : book.reviews.map(r => `
                            <div style="background:#1a1a1a; padding:10px; border-radius:8px; margin-bottom:8px; border:1px solid #222;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <span style="color:#a855f7; font-weight:bold; font-size:14px;">${r.user}</span>
                                    <span style="color:#eab308; font-size:13px;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                                </div>
                                <p style="color:#bbb; font-size:13px; line-height:1.4;">${r.text}</p>
                            </div>
                        `).join("")}
                </div>
                <form id="add-review-form" style="display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="review-user" placeholder="Your Name" required style="flex:1; padding:8px 12px; background:#222; border:1px solid #333; color:white; border-radius:6px; font-size:13px;">
                        <select id="review-rating" style="padding:8px 12px; background:#222; border:1px solid #333; color:#eab308; border-radius:6px; font-size:13px; font-weight:bold;">
                            <option value="5">5 ★</option>
                            <option value="4">4 ★</option>
                            <option value="3">3 ★</option>
                            <option value="2">2 ★</option>
                            <option value="1">1 ★</option>
                        </select>
                    </div>
                    <textarea id="review-text" placeholder="Write your opinion here..." rows="2" required style="padding:8px 12px; background:#222; border:1px solid #333; color:white; border-radius:6px; font-size:13px; resize:none;"></textarea>
                    <button type="submit" class="btn-primary" style="padding:8px 15px; font-size:13px; align-self:flex-end;">Submit Review</button>
                </form>
            `;

            document.getElementById("add-review-form").addEventListener("submit", function(e) {
                e.preventDefault();
                book.reviews.push({
                    user:   document.getElementById("review-user").value,
                    rating: parseInt(document.getElementById("review-rating").value),
                    text:   document.getElementById("review-text").value
                });
                renderReviews();
            });
        }
        renderReviews();
    }

    const deleteBtn = document.getElementById("delete-book-btn");
    if (deleteBtn) {
        deleteBtn.onclick = function () {
            deleteBook(bookId);
            document.getElementById("details-book-modal").classList.remove("active");
        };
    }

    document.getElementById("details-book-modal").classList.add("active");
}

function openAuthorModal(authorName) {
    window.location.href = `author.html?name=${encodeURIComponent(authorName)}`;
}

 
document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    updateCartBadge();
 
    const addToCartModalBtn = document.getElementById('add-to-cart-modal-btn');
    if (addToCartModalBtn) {
        addToCartModalBtn.onclick = function () {
            if (!currentSelectedBookId) return;
            const targetBook = booksDatabase.find(b => b.id === currentSelectedBookId);
            if (!targetBook) return;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.some(item => item.id === targetBook.id)) {
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
        searchInput.addEventListener("input", function (e) {
            const query = e.target.value.toLowerCase().trim();
            document.querySelectorAll(".book-card").forEach(card => {
                const title  = card.querySelector("h3").innerText.toLowerCase();
                const author = card.querySelector("p").innerText.toLowerCase();
                card.style.display = (title.includes(query) || author.includes(query)) ? "block" : "none";
            });
        });
    }
 
    document.querySelectorAll(".category-grid div").forEach(item => {
        item.addEventListener("click", function () {
            window.location.href = `catalog.html?category=${this.getAttribute("data-category")}`;
        });
    });
 
    setupModal("open-add-book-modal", "add-book-modal", "close-add-modal");
    setupModal(null, "details-book-modal", "close-details-modal");
    setupModal(null, "author-modal",       "close-author-modal");
 
    const addBookForm = document.getElementById("add-book-form");
    if (addBookForm) {
        addBookForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const bookData = {
                title:       document.getElementById("new-title").value,
                author:      document.getElementById("new-author").value,
                image:       document.getElementById("new-image").value.trim() || "https://images.unsplash.com/photo-1512820790803-83ca734da794",
                category:    document.getElementById("new-category").value,
                description: document.getElementById("new-description").value,
                type:        "new"
            };
            createBook(bookData);
            document.getElementById("add-book-modal").classList.remove("active");
            this.reset();
            const newRelSection = document.querySelector(".new-releases");
            if (newRelSection) newRelSection.scrollIntoView({ behavior: "smooth" });
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
    if (moonIcon) moonIcon.addEventListener("click", () => document.body.classList.toggle("light-mode"));
 
    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const bar       = document.querySelector(".progress-bar");
        if (height > 0 && bar) bar.style.width = (winScroll / height) * 100 + "%";
    });
 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll("section").forEach(section => observer.observe(section));
 
    const authBtn = document.getElementById("auth-btn");
    if (authBtn) {
        const currentUser = sessionStorage.getItem("currentUser");
        if (currentUser) {
            const user = JSON.parse(currentUser);
            authBtn.title = `Logged in as ${user.fullName}`;
            authBtn.style.color = "#a855f7";
            authBtn.onclick = () => {
                if (confirm(`Logged in as ${user.fullName}. Log out?`)) {
                    sessionStorage.removeItem("currentUser");
                    location.reload();
                }
            };
        } else {
            authBtn.addEventListener("click", () => { window.location.href = "auth.html"; });
        }
    }
 
    const exploreBtn = document.getElementById("btnExploreNow");
    if (exploreBtn) exploreBtn.addEventListener("click", () => { window.location.href = "catalog.html"; });
 
    const shopNowBtn = document.getElementById("btnShopNow");
    if (shopNowBtn) shopNowBtn.addEventListener("click", () => { window.location.href = "catalog.html?filter=bestseller"; });
 
    const wishlistBtn = document.getElementById("wishlist-btn");
    if (wishlistBtn) wishlistBtn.onclick = () => alert("Wishlist system active! Book saved.");

    const cartBtn = document.getElementById("cart-btn");
    if (cartBtn) cartBtn.onclick = () => alert("Cart status updated.");

    const newsBtn = document.querySelector(".newsletter button");
    if (newsBtn) newsBtn.onclick = () => alert("Subscription complete!");

    const chatBtn = document.querySelector(".chat-btn");
    if (chatBtn) chatBtn.onclick = () => alert("Support interface connecting...");
});
