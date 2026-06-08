document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cart-items-container");
    const totalCountSpan = document.getElementById("total-count");

    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const API_BASE = "http://localhost:8080";

    if (!container || !totalCountSpan) return;


     


    async function loadBorrowedBooks() {

        if (!user) {
            container.innerHTML = "<p>Please login first.</p>";
            totalCountSpan.innerText = "0";
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/borrow/user/${user.id}`);
            const data = await res.json();

            totalCountSpan.innerText = data.length;

            if (!data.length) {
                container.innerHTML = "<p>No borrowed books yet.</p>";
                return;
            }

           

            document.querySelectorAll(".remove-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;

                    try {
                        await fetch(`${API_BASE}/borrow/${id}`, {
                            method: "DELETE"
                        });

                        loadBorrowedBooks();

                    } catch (err) {
                        console.error("Delete error:", err);
                        alert("Failed to delete book");
                    }
                });
            });

        } catch (err) {
            console.error("Borrow fetch error:", err);
            container.innerHTML = "<p>Server error</p>";
        }
    }

 
    window.borrowBook = async function (bookId) {

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

            alert("Book added!");
            loadBorrowedBooks();

        } catch (err) {
            console.error("Borrow error:", err);
        }
    };

    loadBorrowedBooks();
});