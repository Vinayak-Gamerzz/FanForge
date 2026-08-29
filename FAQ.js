const faqs = document.querySelectorAll(".faq");

faqs.forEach((faq) => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    });
});

function showCategory(category) {

    const sections = document.querySelectorAll(".faq-section");
    const buttons = document.querySelectorAll(".faq-btn");

    sections.forEach((section) => {

        section.classList.remove("active");

    });

    buttons.forEach((button) => {

        button.classList.remove("active");

    });

    document.getElementById(category).classList.add("active");

    Event.currentTarget.classList.add("active");

}

document.getElementById("about").classList.add("active");