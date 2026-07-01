document.addEventListener("DOMContentLoaded", function () {

    console.log("SYSTEM LOADED");

    const form = document.querySelector("form");
    const buttons = document.querySelectorAll(".buy-btn");
    const selectBox = document.querySelector(".order-section select");

    // =========================
    // BUY NOW CLICK SYSTEM
    // =========================
    buttons.forEach(btn => {
        btn.addEventListener("click", function () {

            const card = this.closest(".card");

            if (!card) return;

            const packageName = card.querySelector("h3").innerText;

            if (selectBox) {
                selectBox.value = packageName;
            }

            document.querySelector(".order-section")
                .scrollIntoView({ behavior: "smooth" });

        });
    });

    // =========================
    // ORDER SAVE SYSTEM
    // =========================
    if (form) {
        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const packageName = selectBox.value;
            const uid = document.querySelector(".order-section input[type='text']").value;
            const payment = document.querySelectorAll(".order-section select")[1].value;
            const trx = document.querySelectorAll(".order-section input")[1].value;
            const time = new Date().toLocaleString();

            const order = {
                time: time,
                package: packageName,
                uid: uid,
                payment: payment,
                trx: trx
            };

            // Local Storage
            let orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push(order);
            localStorage.setItem("orders", JSON.stringify(orders));

            // Google Sheet Save
            fetch("https://script.google.com/macros/s/AKfycbzdFLpEyyC4LOfJA6c9cFw41LZPYElQXSqPsOlV6VXl1RknHDSMfkrsLExzHl3r5PRd/exec", {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(order)
            })
            .then(() => {
                console.log("Order sent to Google Sheet");
            })
            .catch((err) => {
                console.log(err);
            });

            showSuccessMessage();

            form.reset();

        });
    }

});

// =========================
// SUCCESS POPUP
// =========================
function showSuccessMessage() {

    const popup = document.createElement("div");

    popup.innerHTML = "🎉 Order Placed Successfully!";

    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
    popup.style.color = "white";
    popup.style.padding = "14px 18px";
    popup.style.borderRadius = "10px";
    popup.style.fontSize = "15px";
    popup.style.fontWeight = "bold";
    popup.style.zIndex = "9999";
    popup.style.boxShadow = "0 10px 20px rgba(0,0,0,0.25)";
    popup.style.transform = "translateX(120%)";
    popup.style.transition = "0.4s ease";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
        popup.style.transform = "translateX(120%)";
        setTimeout(() => popup.remove(), 400);
    }, 2500);
}
