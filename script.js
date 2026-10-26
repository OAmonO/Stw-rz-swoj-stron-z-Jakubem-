const CONTACT_EMAIL = "jakubmalecki@proton.me";
// Opcjonalnie numer telefonu, np. "+48 600 000 000". Zostaw puste, jeśli nie chcesz go pokazywać.
const CONTACT_PHONE = "";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const form = document.getElementById("contact-form");
const status = document.querySelector(".form-status");
const year = document.getElementById("year");

document.documentElement.classList.add("js");

if (year) year.textContent = String(new Date().getFullYear());

function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

function closeMenu() {
    header.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
}

toggle.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.18 });

reveals.forEach((item) => revealObserver.observe(item));

const sectionLinks = new Map(
    [...nav.querySelectorAll("a")].map((link) => [link.getAttribute("href").slice(1), link])
);

const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
        const current = sectionLinks.get(entry.target.id);
        if (current) current.setAttribute("aria-current", "true");
    });
}, { rootMargin: "-40% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => spy.observe(section));

const direct = document.querySelector(".contact-direct");
const mailLink = direct?.querySelector("[data-mail]");

if (CONTACT_EMAIL && mailLink && direct) {
    mailLink.textContent = CONTACT_EMAIL;
    mailLink.href = `mailto:${CONTACT_EMAIL}`;
    direct.hidden = false;
}

if (CONTACT_PHONE && direct) {
    const phone = document.createElement("a");
    phone.href = `tel:${CONTACT_PHONE.replace(/\s/g, "")}`;
    phone.textContent = CONTACT_PHONE;
    const line = document.createElement("p");
    line.className = "contact-direct";
    line.append("Telefon: ", phone);
    direct.insertAdjacentElement("afterend", line);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Strona — wiadomość od ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = "Wiadomość jest gotowa w programie pocztowym. Zostało ją tylko wysłać.";
});
