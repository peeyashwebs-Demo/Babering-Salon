// ================================
// Imperial Blend Barber Salon JS
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const revealElements = document.querySelectorAll(".reveal");

  const serviceSelect = document.getElementById("service");
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const bookingForm = document.getElementById("bookingForm");
  const bookingNote = document.getElementById("bookingNote");

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  const heroBg = document.querySelector(".hero-bg");

  // --------------------------------
  // Sticky Header Blur on Scroll
  // --------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  // --------------------------------
  // Mobile Menu Toggle
  // --------------------------------
  const toggleMobileMenu = () => {
    const isActive = mobileMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isActive));
    mobileMenu.setAttribute("aria-hidden", String(!isActive));
    document.body.style.overflow = isActive ? "hidden" : "";
  };

  menuToggle.addEventListener("click", toggleMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  });

  // --------------------------------
  // Reveal on Scroll - Intersection Observer
  // --------------------------------
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  // --------------------------------
  // Custom Cursor
  // --------------------------------
  if (window.innerWidth > 900) {
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const hoverTargets = document.querySelectorAll("a, button, .service-card, .gallery-item");

    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        cursorOutline.style.width = "52px";
        cursorOutline.style.height = "52px";
      });

      target.addEventListener("mouseleave", () => {
        cursorOutline.style.width = "34px";
        cursorOutline.style.height = "34px";
      });
    });
  }

  // --------------------------------
  // Hero Parallax Effect
  // --------------------------------
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (heroBg) {
      heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.18}px)`;
    }
  });

  // --------------------------------
  // Booking Widget Logic
  // --------------------------------

  // Set minimum date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${yyyy}-${mm}-${dd}`;
  dateInput.min = formattedToday;

  const timeOptions = {
    "The Executive Cut": ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    "Beard Sculpting": ["9:30 AM", "12:00 PM", "2:00 PM", "4:30 PM", "6:00 PM"],
    "Hot Towel Shave": ["10:30 AM", "12:30 PM", "2:30 PM", "4:00 PM", "6:30 PM"]
  };

  const populateTimes = () => {
    const selectedService = serviceSelect.value;
    const selectedDate = dateInput.value;

    timeSelect.innerHTML = '<option value="">Choose a time</option>';

    if (!selectedService) {
      bookingNote.textContent = "Choose a service to see available time slots.";
      return;
    }

    if (!selectedDate) {
      bookingNote.textContent = "Now select a date to view available times.";
      return;
    }

    const chosenDate = new Date(selectedDate);
    const day = chosenDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Salon closed on Sundays
    if (day === 0) {
      bookingNote.textContent = "Salon is closed on Sundays. Please choose another date.";
      return;
    }

    timeOptions[selectedService].forEach((time) => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });

    bookingNote.textContent = `Available slots loaded for ${selectedService}.`;
  };

  serviceSelect.addEventListener("change", populateTimes);
  dateInput.addEventListener("change", populateTimes);

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const service = serviceSelect.value;
    const date = dateInput.value;
    const time = timeSelect.value;

    if (!name || !service || !date || !time) {
      bookingNote.textContent = "Please complete all fields before confirming your booking.";
      bookingNote.style.color = "#ffb3b3";
      return;
    }

    bookingNote.textContent = `Booking confirmed for ${name}: ${service} on ${date} at ${time}.`;
    bookingNote.style.color = "#d4af37";

    bookingForm.reset();
    timeSelect.innerHTML = '<option value="">Choose a time</option>';
  });
});