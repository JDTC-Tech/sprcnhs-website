const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        nav.classList.toggle("open");
        menuButton.setAttribute(
            "aria-expanded",
            nav.classList.contains("open") ? "true" : "false"
        );
    });

    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
            nav.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });
}

document.querySelectorAll(".nav a").forEach((link) => {
    const current = window.location.pathname.split("/").pop() || "index.html";
    const target = link.getAttribute("href")?.split("/").pop();

    if (target === current) {
        link.classList.add("active");
    }
});

document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   Homepage welcome popup
   It now appears every time the homepage itself is loaded.
   --------------------------------------------------------- */
const welcome = document.querySelector("#welcome-overlay");
const closeWelcomeButtons = document.querySelectorAll("[data-close-welcome]");

function hideWelcome() {
    if (!welcome) return;

    welcome.classList.remove("show");
    document.body.classList.remove("modal-open");
}

if (welcome) {
    welcome.classList.add("show");
    document.body.classList.add("modal-open");

    welcome.addEventListener("click", (event) => {
        if (event.target === welcome) {
            hideWelcome();
        }
    });
}

closeWelcomeButtons.forEach((button) => {
    button.addEventListener("click", hideWelcome);
});

/* ---------------------------------------------------------
   Personnel category popup and switching
   --------------------------------------------------------- */
const personnelPicker = document.querySelector("#personnel-picker-overlay");
const personnelChoiceButtons = document.querySelectorAll("[data-personnel-choice]");
const personnelPanels = document.querySelectorAll("[data-personnel-panel]");
const personnelPickerOpenButtons = document.querySelectorAll("[data-open-personnel-picker]");
const personnelTitle = document.querySelector("#personnel-category-title");
const personnelDescription = document.querySelector("#personnel-category-description");

const personnelCategoryCopy = {
    teaching: {
        title: "Teaching Personnel",
        description:
            "Faculty members directly involved in classroom instruction and academic leadership."
    },
    "teaching-related": {
        title: "Teaching-Related Personnel",
        description:
            "Personnel who support instructional programs, learning services, and teaching-related school functions."
    },
    "non-teaching": {
        title: "Non-Teaching Personnel",
        description:
            "Administrative, technical, clerical, and support personnel who help keep school services operating."
    }
};

function showPersonnelCategory(category) {
    personnelPanels.forEach((panel) => {
        panel.classList.toggle(
            "active",
            panel.getAttribute("data-personnel-panel") === category
        );
    });

    const copy = personnelCategoryCopy[category];

    if (copy && personnelTitle && personnelDescription) {
        personnelTitle.textContent = copy.title;
        personnelDescription.textContent = copy.description;
    }

    if (personnelPicker) {
        personnelPicker.classList.remove("show");
    }

    document.body.classList.remove("modal-open");
}

personnelChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showPersonnelCategory(button.getAttribute("data-personnel-choice"));
    });
});

personnelPickerOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!personnelPicker) return;

        personnelPicker.classList.add("show");
        document.body.classList.add("modal-open");
    });
});

if (personnelPicker) {
    document.body.classList.add("modal-open");
}

/* ---------------------------------------------------------
   Survey evaluation reminder
   Appears at the top-right every 60 seconds.
   --------------------------------------------------------- */
const surveyUrl = "https://forms.gle/BQADoaQvHX5dyZUE6";
let surveyReminder;

function createSurveyReminder() {
    if (surveyReminder) return surveyReminder;

    surveyReminder = document.createElement("aside");
    surveyReminder.className = "survey-reminder";
    surveyReminder.setAttribute("role", "dialog");
    surveyReminder.setAttribute("aria-label", "Website evaluation reminder");

    surveyReminder.innerHTML = `
        <div class="survey-reminder-top">
            <div>
                <div class="eyebrow">Website Evaluation</div>
                <h3>Help us improve the SPRCNHS website</h3>
            </div>
            <button
                class="survey-reminder-close"
                type="button"
                aria-label="Close survey reminder"
            >×</button>
        </div>

        <p>
            Share your experience through the website evaluation form.
            Your feedback will help guide future improvements.
        </p>

        <div class="survey-reminder-actions">
            <a
                class="survey-reminder-link"
                href="${surveyUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >Open Evaluation Form</a>
        </div>
    `;

    document.body.appendChild(surveyReminder);

    const closeButton = surveyReminder.querySelector(".survey-reminder-close");

    closeButton.addEventListener("click", () => {
        surveyReminder.classList.remove("show");
    });

    return surveyReminder;
}

function showSurveyReminder() {
    const reminder = createSurveyReminder();

    reminder.classList.remove("show");

    window.requestAnimationFrame(() => {
        reminder.classList.add("show");
    });
}

window.setTimeout(() => {
    showSurveyReminder();
    window.setInterval(showSurveyReminder, 60000);
}, 60000);

/* ---------------------------------------------------------
   Copy-contact buttons
   --------------------------------------------------------- */
document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
        const value = button.getAttribute("data-copy");
        const status = document.getElementById(button.getAttribute("data-status"));

        try {
            await navigator.clipboard.writeText(value);

            if (status) {
                status.textContent = `Copied: ${value}`;
            }

            const original = button.textContent;
            button.textContent = "Copied";

            window.setTimeout(() => {
                button.textContent = original;
            }, 1400);
        } catch {
            if (status) {
                status.textContent = `Contact: ${value}`;
            }
        }
    });
});

/* Escape closes the active modal, but not the repeating survey reminder. */
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (welcome?.classList.contains("show")) {
        hideWelcome();
        return;
    }

    if (personnelPicker?.classList.contains("show")) {
        personnelPicker.classList.remove("show");
        document.body.classList.remove("modal-open");
    }
});


/* ---------------------------------------------------------
   V9: automatic homepage announcement rotator
   --------------------------------------------------------- */
document.querySelectorAll("[data-rotator]").forEach((rotator) => {
    const slides = Array.from(rotator.querySelectorAll(".rotator-slide"));
    const controls = rotator.querySelector(".rotator-controls");
    const interval = Number(rotator.getAttribute("data-interval")) || 10000;

    if (slides.length <= 1) return;

    let current = Math.max(
        0,
        slides.findIndex((slide) => slide.classList.contains("active"))
    );

    const dots = slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "rotator-dot" + (index === current ? " active" : "");
        dot.setAttribute("aria-label", `Show item ${index + 1}`);
        dot.addEventListener("click", () => {
            show(index);
            restart();
        });
        controls?.appendChild(dot);
        return dot;
    });

    function show(index) {
        slides[current].classList.remove("active");
        dots[current]?.classList.remove("active");
        current = (index + slides.length) % slides.length;
        slides[current].classList.add("active");
        dots[current]?.classList.add("active");
    }

    let timer = window.setInterval(() => show(current + 1), interval);

    function restart() {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(current + 1), interval);
    }

    rotator.addEventListener("mouseenter", () => window.clearInterval(timer));
    rotator.addEventListener("mouseleave", restart);
});

document.addEventListener("click", (event) => {
    document.querySelectorAll(".nav-more[open]").forEach((details) => {
        if (!details.contains(event.target)) {
            details.removeAttribute("open");
        }
    });
});



// V19 personnel directory: working search, sex filter, and alphabetical sorting.
document.querySelectorAll(".personnel-category-panel").forEach((panel) => {
    const input = panel.querySelector(".personnel-search");
    const sexFilter = panel.querySelector(".personnel-sex-filter");
    const sortSelect = panel.querySelector(".personnel-sort");
    const list = panel.querySelector(".directory-list");
    const count = panel.querySelector(".personnel-count");
    const empty = panel.querySelector(".personnel-empty");
    const records = [...panel.querySelectorAll(".personnel-record")];

    function updatePersonnelDirectory() {
        const query = (input?.value || "").trim().toLowerCase();
        const sex = sexFilter?.value || "all";
        const direction = sortSelect?.value || "az";

        records.sort((a, b) => {
            const an = a.dataset.personnelName || a.querySelector("h3")?.textContent.trim().toLowerCase() || "";
            const bn = b.dataset.personnelName || b.querySelector("h3")?.textContent.trim().toLowerCase() || "";
            return direction === "za" ? bn.localeCompare(an) : an.localeCompare(bn);
        });
        records.forEach((record) => list?.appendChild(record));

        let visible = 0;
        records.forEach((record) => {
            const haystack = (record.dataset.personnelSearch || record.textContent || "").toLowerCase();
            const recordSex = record.dataset.personnelSex || "";
            const matchesSearch = !query || haystack.includes(query);
            const matchesSex = sex === "all" || recordSex === sex;
            const show = matchesSearch && matchesSex;

            record.hidden = !show;
            record.classList.toggle("is-filtered-out", !show);
            if (show) visible++;
        });

        if (count) count.textContent = `${visible} ${visible === 1 ? "person" : "personnel"}`;
        if (empty) empty.hidden = visible !== 0;
    }

    input?.addEventListener("input", updatePersonnelDirectory);
    sexFilter?.addEventListener("change", updatePersonnelDirectory);
    sortSelect?.addEventListener("change", updatePersonnelDirectory);
    updatePersonnelDirectory();
});

// V21 homepage hero background carousel
document.querySelectorAll("[data-hero-carousel]").forEach((carousel)=>{
 const slides=[...carousel.querySelectorAll("[data-hero-slide]")],dots=[...carousel.querySelectorAll("[data-hero-dot]")];
 const prev=carousel.querySelector("[data-hero-prev]"),next=carousel.querySelector("[data-hero-next]"),pause=carousel.querySelector("[data-hero-pause]");
 const interval=Math.max(3000,Number(carousel.dataset.interval)||6500),reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 let current=0,timer=null,paused=false;
 const show=(n)=>{current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===current));dots.forEach((d,i)=>{d.classList.toggle("active",i===current);d.setAttribute("aria-current",i===current?"true":"false")})};
 const stop=()=>{if(timer)clearInterval(timer);timer=null};
 const start=()=>{stop();if(!paused&&!reduce&&slides.length>1)timer=setInterval(()=>show(current+1),interval)};
 const manual=(n)=>{show(n);start()};
 prev?.addEventListener("click",()=>manual(current-1));next?.addEventListener("click",()=>manual(current+1));dots.forEach((d,i)=>d.addEventListener("click",()=>manual(i)));
 pause?.addEventListener("click",()=>{paused=!paused;pause.innerHTML=paused?'<span class="hero-control-icon hero-play-icon" aria-hidden="true">▶</span>':'<span class="hero-control-icon" aria-hidden="true">Ⅱ</span>';pause.setAttribute("aria-label",paused?"Play carousel":"Pause carousel");pause.setAttribute("aria-pressed",String(paused));paused?stop():start()});
 carousel.addEventListener("mouseenter",stop);carousel.addEventListener("mouseleave",start);carousel.addEventListener("focusin",stop);carousel.addEventListener("focusout",start);
 show(0);start();
});
