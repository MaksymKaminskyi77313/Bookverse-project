const API_URL = "https://bookverse-project.onrender.com/books";
//const API_URL = "http://localhost:8080/books";
let booksDatabase = [];
let currentSelectedBookId = null;
 const API_BASE = "https://bookverse-project.onrender.com";
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

 

 async function loadBorrowedBooks() {
    const container = document.getElementById("cart-items-container");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!container || !user) return;

    try {
        const res = await fetch(`${API_BASE}/borrow/user/${user.id}`);
        const data = await res.json();
        updateCartUI(data);
        console.log("BORROWED DATA:", data); 

        container.innerHTML = "";

        data.forEach(item => {
    const div = document.createElement("div");
    div.className = "borrowed-item";

    div.innerHTML = `
        <img src="${item.image}" style="width:50px;height:70px;object-fit:cover;border-radius:6px;">
        
        <div style="flex:1; margin-left:10px;">
            <h4>${item.title}</h4>
            <p>${item.author}</p>
            <small>${item.borrowDate}</small>
        </div>

        <button class="btnremovecart" onclick="deleteBorrow(${item.id})">Remove</button>
    `;

    container.appendChild(div);
});

    } catch (err) {
        console.error("Load borrow error:", err);
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
async function updateCartBadge() {
    const badge = document.getElementById("cart-global-count");
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!badge || !user) return;

    const res = await fetch(`${API_BASE}/borrow/user/${user.id}`);
    const data = await res.json();

    badge.innerText = data.length;
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
async function clearCart() {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) return;

    try {
        const res = await fetch(`${API_BASE}/borrow/user/${user.id}`);
        const data = await res.json();
 
        for (const item of data) {
            await fetch(`${API_BASE}/borrow/${item.id}`, {
                method: "DELETE"
            });
        }
        await loadBorrowedBooks();
        alert("Order processed! Enjoy your reading.");
  

    } catch (err) {
        console.error("Clear cart error:", err);
        alert("Failed to clear cart");
    }
}
 
document.addEventListener("DOMContentLoaded", () => {
    loadBooks(); 
const borrowBtn = document.getElementById("add-to-cart-modal-btn");
 
if (borrowBtn) {
    borrowBtn.onclick = async () => {

    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    const book = booksDatabase.find(b => b.id === currentSelectedBookId);
    if (!book) return;

    const alreadyBorrowed = await isBookBorrowed(user.id, book.id);

    if (alreadyBorrowed) {
        alert("Already in cart");
        return;
    }

    try {
        await fetch("https://bookverse-project.onrender.com/borrow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                bookId: book.id
            })
        });

        alert("Added to cart!");

        await loadBorrowedBooks();
        await updateCartBadge();

    } catch (e) {
         console.error("backend borrow failed:", e.message);
    }
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
    

    const newsBtn = document.querySelector(".newsletter button");
    if (newsBtn) newsBtn.onclick = () => alert("Subscription complete!");

    const chatBtn = document.querySelector(".chat-btn");
    if (chatBtn) chatBtn.onclick = () => alert("Support interface connecting...");
});

document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
        const answer = item.querySelector(".faq-answer");

        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }
    });
});


const authorElement = document.getElementById("author-name");

if(authorElement){

const authors={

"George Orwell":{

photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e",

role:"English novelist, essayist, journalist and literary critic",

years:"1903 - 1950",

country:"United Kingdom",

genre:"Dystopian Fiction, Political Satire, Social Criticism",

biography:`George Orwell, whose real name was Eric Arthur Blair, was born on 25 June 1903 in Motihari, British India. Although he was born overseas, he grew up mainly in England and from an early age showed a deep interest in literature and language. Orwell attended Eton College, one of the most prestigious schools in Britain, where he developed his writing abilities. Instead of going directly to university, he joined the Indian Imperial Police in Burma, an experience that changed his view of colonialism and political power.

After several years in Burma, Orwell resigned and decided to become a writer. He lived among poor communities in London and Paris to better understand social inequality. These experiences became the basis for some of his early books and essays. Orwell believed that writers should tell the truth about society and never ignore injustice. His journalistic work focused on politics, poverty and the struggles of ordinary people.

One of the most important moments in his life was his participation in the Spanish Civil War. While fighting against fascism, Orwell witnessed propaganda, censorship and political manipulation from different sides of the conflict. These events deeply influenced his thinking and later inspired his most famous novels. His experiences taught him that freedom of speech and freedom of thought should always be protected.

In 1945 Orwell published Animal Farm, a political allegory that criticized totalitarian governments through the story of farm animals. The novel quickly became a worldwide success because readers understood its deeper political meaning. Four years later he completed Nineteen Eighty-Four, often simply called 1984, a dystopian masterpiece that introduced concepts such as Big Brother, Thought Police and doublethink. The book remains one of the most influential novels ever written.

Besides his novels, Orwell produced numerous essays, articles and literary reviews. His writing style was simple, clear and direct because he believed that complicated language could hide lies and manipulation. Many schools and universities continue to study his works because they remain relevant in discussions about politics, media and individual freedom.

George Orwell died on 21 January 1950 from tuberculosis, but his literary legacy continues to influence millions of readers around the world. His books encourage people to question authority, defend truth and protect democracy. More than seventy years after his death, Orwell remains one of the most respected writers of modern literature.`,

books:[
"1984",
"Animal Farm",
"Homage to Catalonia"
],

facts:[
"His real name was Eric Arthur Blair.",
"He fought in the Spanish Civil War.",
"He created famous terms such as Big Brother and Thought Police."
],

quote:"In a time of deceit, telling the truth is a revolutionary act."

},

"J.K Rowling":{

photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330",

role:"British author, producer and philanthropist",

years:"1965 - Present",

country:"United Kingdom",

genre:"Fantasy",

biography:`Joanne Rowling, better known as J.K. Rowling, was born on 31 July 1965 in England. From an early age she loved reading books and inventing stories. As a child she often wrote short tales for her family and friends. Her passion for literature continued throughout her education and eventually inspired her dream of becoming an author.

Before achieving success, Rowling worked in several different jobs and experienced many personal challenges. She lived for some time in Portugal, where she worked as an English teacher. After returning to the United Kingdom, she faced financial difficulties while raising her daughter. During this period she continued writing the story that would eventually become Harry Potter and the Philosopher's Stone.

The idea for Harry Potter came to Rowling during a train journey. She imagined a young wizard discovering that he belonged to a magical world. Over the following years she developed a detailed universe filled with magical creatures, spells and unforgettable characters. The first manuscript was rejected by several publishers, but eventually a small publishing house accepted it.

The Harry Potter series became one of the greatest publishing successes in history. Millions of readers around the world fell in love with the adventures of Harry, Hermione and Ron. The books were translated into many languages and adapted into blockbuster films. Rowling's magical world expanded through additional books, stage productions and other creative projects.

Apart from writing, Rowling is also known for her charitable work. She has donated large amounts of money to organizations that support children, education and medical research. She often speaks about the importance of imagination, kindness and determination. Her personal journey from struggling writer to world-famous author has inspired many people to follow their dreams despite difficulties.

Today J.K. Rowling remains one of the best-known authors in the world. Her stories introduced a new generation to reading and created one of the largest fan communities in literary history. Her influence extends far beyond books, making her one of the most significant cultural figures of modern times.`,

books:[
"Harry Potter and the Philosopher's Stone",
"Harry Potter and the Chamber of Secrets",
"Harry Potter and the Prisoner of Azkaban"
],

facts:[
"The idea for Harry Potter came during a train journey.",
"The first book was rejected by several publishers.",
"The Harry Potter series has sold hundreds of millions of copies."
],

quote:"It is our choices that show what we truly are, far more than our abilities."

},

"Tolkien":{

photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",

role:"English writer, philologist and university professor",

years:"1892 - 1973",

country:"United Kingdom",

genre:"High Fantasy",

biography:`John Ronald Reuel Tolkien was born on 3 January 1892 in South Africa, but after the death of his father his family moved to England. As a child Tolkien developed a fascination with languages, myths and ancient legends. He spent many hours studying words and even creating his own imaginary languages. These interests would later become the foundation of his literary career.

Tolkien studied at Oxford University, where he focused on languages and literature. During the First World War he served in the British Army and experienced the horrors of battle. Many scholars believe that his experiences during the war influenced themes of friendship, courage and sacrifice found in his books.

After the war Tolkien returned to academic life and became a professor at Oxford University. He specialized in Old and Middle English and was respected for his research. At the same time he continued creating the fictional world of Middle-earth. Unlike many writers, Tolkien designed complete histories, cultures, maps and languages for his imaginary world long before publishing his novels.

In 1937 he published The Hobbit, a fantasy adventure that quickly became popular among readers. Encouraged by its success, Tolkien spent many years writing The Lord of the Rings. The trilogy became one of the greatest achievements in fantasy literature and introduced unforgettable characters such as Frodo, Gandalf and Aragorn. Later, his son Christopher Tolkien edited and published The Silmarillion, expanding the mythology of Middle-earth.

Tolkien's imagination was extraordinary because he created entire civilizations with their own traditions and languages. His work inspired countless authors, filmmakers and game developers. Many elements of modern fantasy literature can be traced back to Tolkien's ideas and storytelling methods.

John Ronald Reuel Tolkien died on 2 September 1973, but his influence remains enormous. His books continue to be translated into many languages and are loved by readers of all ages. The world of Middle-earth has become one of the most famous fictional universes ever created and ensures that Tolkien's legacy will live for generations.`,

books:[
"The Hobbit",
"The Lord of the Rings",
"The Silmarillion"
],

facts:[
"He was a professor at Oxford University.",
"He created several complete fictional languages.",
"He is considered the father of modern fantasy literature."
],

quote:"Not all those who wander are lost."

}

};

const params=new URLSearchParams(window.location.search);
const currentAuthor=params.get("name");
const author=authors[currentAuthor];

if(author){

document.getElementById("author-photo").src = author.photo;

document.getElementById("author-name").innerText = currentAuthor;
document.getElementById("author-role").innerText = author.role;
document.getElementById("author-years").innerText = author.years;
document.getElementById("author-country").innerText = author.country;
document.getElementById("author-genre").innerText = author.genre;
document.getElementById("author-biography").innerText = author.biography;

document.getElementById("book-one").innerText = author.books[0];
document.getElementById("book-two").innerText = author.books[1];
document.getElementById("book-three").innerText = author.books[2];

document.getElementById("fact-one").innerText = author.facts[0];
document.getElementById("fact-two").innerText = author.facts[1];
document.getElementById("fact-three").innerText = author.facts[2];

document.getElementById("author-quote").innerText = author.quote;

}
}



const joinChallengeBtn=document.getElementById("join-challenge-btn");

if(joinChallengeBtn){

joinChallengeBtn.addEventListener("click",()=>{
alert("Welcome to the BookVerse Reading Challenge!");
});

let booksRead=localStorage.getItem("booksRead");

if(!booksRead){
booksRead=0;
}

const booksCounter=document.getElementById("books-read");

function updateBooks(){
booksCounter.innerText=booksRead+" / 50";
}

updateBooks();

document.getElementById("add-book-btn")
.addEventListener("click",()=>{

if(booksRead<50){
booksRead++;
localStorage.setItem("booksRead",booksRead);
updateBooks();
}

});

const quests=[
"Read 30 pages today.",
"Read a fantasy book.",
"Discover a new author.",
"Read before bedtime.",
"Finish one chapter.",
"Read a classic novel.",
"Read for one hour.",
"Start a science fiction book."
];

document.getElementById("new-quest-btn")
.addEventListener("click",()=>{

const random=
Math.floor(Math.random()*quests.length);

document.getElementById("daily-quest")
.innerText=quests[random];

});

const books=[
"1984",
"The Hobbit",
"Dune",
"Harry Potter",
"Sapiens",
"Atomic Habits",
"The Midnight Library",
"Project Hail Mary"
];

document.getElementById("fortune-btn")
.addEventListener("click",()=>{

const random=
Math.floor(Math.random()*books.length);

document.getElementById("fortune-book")
.innerText=books[random];

});

}


const premiumBtn =
document.getElementById("premium-btn");

if(premiumBtn){

premiumBtn.addEventListener("click",()=>{

alert(
"Congratulations! Welcome to BookVerse Premium!"
);

});

const premiumBooks=[
"Dune",
"Sapiens",
"The Midnight Library",
"Project Hail Mary",
"Atomic Habits",
"1984",
"The Hobbit"
];

document.getElementById("premium-book-btn")
.addEventListener("click",()=>{

const random=
Math.floor(
Math.random()*premiumBooks.length
);

document.getElementById("premium-book")
.innerText=
premiumBooks[random];

});

}


function showPartner(name){

const partners={

penguin:{
title:"Penguin Random House",
description:"Penguin Random House is one of the world's largest publishing companies. It works with thousands of authors and publishes bestselling books across many genres.",
founded:"2013",
country:"United States"
},

oxford:{
title:"Oxford University Press",
description:"Oxford University Press is one of the oldest and most respected academic publishers. It is famous for educational books and dictionaries.",
founded:"1586",
country:"United Kingdom"
},

amazon:{
title:"Amazon Books",
description:"Amazon Books helps readers discover and buy millions of books around the world while supporting digital reading technologies.",
founded:"1994",
country:"United States"
},

harper:{
title:"HarperCollins",
description:"HarperCollins is an international publishing company with a long literary history and a large collection of bestselling books.",
founded:"1989",
country:"United States"
}

};

const partner=partners[name];

document.getElementById("partner-title").innerText=
partner.title;

document.getElementById("partner-description").innerText=
partner.description;

document.getElementById("partner-founded").innerText=
partner.founded;

document.getElementById("partner-country").innerText=
partner.country;

}


const buyGiftBtn=
document.getElementById("buy-gift-btn");

if(buyGiftBtn){

buyGiftBtn.addEventListener("click",()=>{

const name=
document.getElementById("gift-name").value;

if(name==""){

alert("Please enter recipient name.");
return;

}

alert(
"Gift Card purchased successfully!"
);

document.getElementById("gift-name").value="";
document.getElementById("gift-email").value="";
document.getElementById("gift-message").value="";

});

}


// admin script 
 const tableBody = document.getElementById("admin-database-table");
        const statusEl  = document.getElementById("admin-status");

        function renderAdminTable() {
            tableBody.innerHTML = "";
            statusEl.innerText  = `${booksDatabase.length} book(s) in database`;

            booksDatabase.forEach(book => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="${book.image || book.img || ''}" alt="" style="width:40px; height:60px; object-fit:cover; border-radius:4px;"></td>
                    <td style="font-weight:bold; color:white;">${book.title}</td>
                    <td>${book.author}</td>
                    <td><span style="background:rgba(168,85,247,0.1); color:#a855f7; padding:4px 10px; border-radius:12px; font-size:13px;">${book.category}</span></td>
                    <td><span style="color:#aaa; font-size:13px;">${book.type || 'new'}</span></td>
                    <td>
                        <button class="action-btn-edit"   onclick="openEditModal(${book.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn-delete" onclick="deleteBookAdmin(${book.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        async function deleteBookAdmin(id) {
            if (!confirm("Delete this book?")) return;
            try {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                booksDatabase = booksDatabase.filter(b => b.id !== id);
                renderAdminTable();
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }

        function openEditModal(id) {
            const book = booksDatabase.find(b => b.id === id);
            if (!book) return;

            document.getElementById("edit-id").value          = book.id;
            document.getElementById("edit-title").value       = book.title;
            document.getElementById("edit-author").value      = book.author;
            document.getElementById("edit-image").value       = book.image || book.img || "";
            document.getElementById("edit-category").value    = book.category;
            document.getElementById("edit-type").value        = book.type || "new";
            document.getElementById("edit-description").value = book.description || "";

            document.getElementById("edit-book-modal").classList.add("active");
        }

        const closeEditModalBtn = document.getElementById("close-edit-modal");

        if (closeEditModalBtn) {
            closeEditModalBtn.addEventListener("click", () => {
                const modal = document.getElementById("edit-book-modal");
                if (modal) modal.classList.remove("active");
            });
        }   

       const editForm = document.getElementById("edit-book-form");

if (editForm) {
    editForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const id = document.getElementById("edit-id").value;

        const updatedBook = {
            title: document.getElementById("edit-title").value,
            author: document.getElementById("edit-author").value,
            image: document.getElementById("edit-image").value,
            category: document.getElementById("edit-category").value,
            type: document.getElementById("edit-type").value,
            description: document.getElementById("edit-description").value
        };

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook)
            });

            const saved = await res.json();

            const index = booksDatabase.findIndex(b => b.id == id);
            if (index !== -1) booksDatabase[index] = saved;

            document.getElementById("edit-book-modal").classList.remove("active");
            renderAdminTable();

        } catch (err) {
            alert("Update failed: " + err.message);
        }
    });
}



function updateCartUI(data) {
    const totalCountSpan = document.getElementById("total-count");
    const container = document.getElementById("cart-items-container");

    if (totalCountSpan) {
        totalCountSpan.innerText = data.length;
    }

    if (!container) return;

    if (!data.length) {
        container.innerHTML = "<p>No borrowed books yet.</p>";
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="cart-item" style="display:flex;gap:20px;align-items:center;padding:15px;border:1px solid #333;border-radius:10px;">
            
            <img src="${item.image}" style="width:50px;height:70px;object-fit:cover;border-radius:6px;">

            <div style="flex:1">
                <h4>${item.title}</h4>
                <p>${item.author}</p>
                <small>${item.borrowDate}</small>
            </div>

            <button class="remove-btn" data-id="${item.id}" style="color:red;border:none;background:none;cursor:pointer;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join("");
 
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            await fetch(`${API_BASE}/borrow/${id}`, {
                method: "DELETE"
            });

            await loadBorrowedBooks();
        });
    });
}


const openAddModalBtn = document.getElementById("open-add-book-modal");
const closeAddModalBtn = document.getElementById("close-add-modal");
const addBookModal = document.getElementById("add-book-modal");

if (openAddModalBtn && addBookModal) {
    openAddModalBtn.addEventListener("click", () => {
        addBookModal.classList.add("active");
    });
}

if (closeAddModalBtn && addBookModal) {
    closeAddModalBtn.addEventListener("click", () => {
        addBookModal.classList.remove("active");
    });
}


 const addBookForm = document.getElementById("add-book-form");

if (addBookForm) {
    addBookForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const bookData = {
            title: document.getElementById("new-title")?.value,
            author: document.getElementById("new-author")?.value,
            image:
                document.getElementById("new-image")?.value.trim() ||
                "https://images.unsplash.com/photo-1512820790803-83ca734da794",
            category: document.getElementById("new-category")?.value,
            type: document.getElementById("new-type")?.value,
            description: document.getElementById("new-description")?.value
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            });

            const newBook = await res.json();

            booksDatabase.unshift(newBook);

            document.getElementById("add-book-modal")?.classList.remove("active");
            addBookForm.reset();

            renderAdminTable?.();

        } catch (err) {
            alert("Add failed: " + err.message);
        }
    });
}

      async function initAdmin() {
    try {
        const res = await fetch(API_URL);
        booksDatabase = await res.json();

        renderAdminTable?.();

    } catch (err) {
        const statusEl = document.getElementById("admin-status");

        if (statusEl) {
            statusEl.innerText =
                "Could not connect to backend. Is Spring Boot running?";
            statusEl.style.color = "#ef4444";
        }
    }
}

window.addEventListener("load", () => {
    initAdmin();
});
       

// cart 
async function isBookBorrowed(userId, bookId) {
    const res = await fetch(`${API_BASE}/borrow/user/${userId}`);
    const data = await res.json();

    return data.some(item => Number(item.bookId) === Number(bookId));
}
document.addEventListener("DOMContentLoaded", () => {
  
     

    async function borrowBook(bookId) {
        const user = JSON.parse(sessionStorage.getItem("currentUser"));

        if (!user) {
            window.location.href = "auth.html";
            return;
        }

        try {
            await fetch(`${API_BASE}/borrow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    bookId: bookId
                })
            });

            await updateCartBadge();
            await loadBorrowedBooks();

            alert("Book added!");
        } catch (err) {
            console.error("Borrow error:", err);
        }
    }

async function deleteBorrow(id) {
    await fetch(`${API_BASE}/borrow/${id}`, {
        method: "DELETE"
    });

    await loadBorrowedBooks();
    await updateCartBadge();
}
 
    window.borrowBook = borrowBook;
    window.deleteBorrow = deleteBorrow;
 
    updateCartBadge();
    loadBorrowedBooks();
});