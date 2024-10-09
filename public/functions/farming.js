document.addEventListener("DOMContentLoaded", function () {
    const smallBoxes = document.querySelectorAll(".small-box");
    let currentIndex = 0;
    let currentlyOpenedBox = null;
    const menu = document.querySelector(".menu");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const closeMenu = document.querySelector(".close-menu");
  
    hamburgerMenu.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  
    closeMenu.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  
    function updateCarousel() {
      smallBoxes.forEach((box, index) => {
        box.classList.remove("opened");
        if (index === currentIndex) {
          box.classList.add("opened");
        }
      });
    }
  
    function nextBox() {
      const currentBox = smallBoxes[currentIndex];
      if (currentBox.classList.contains("collapsed")) {
        currentBox.classList.remove("collapsed");
        const arrow = currentBox.querySelector(".arrow");
        if (arrow) {
          arrow.classList.remove("collapsed");
        }
      }
      currentIndex = (currentIndex + 1) % smallBoxes.length;
      updateCarousel();
    }
  
    function prevBox() {
      const currentBox = smallBoxes[currentIndex];
      if (currentBox.classList.contains("collapsed")) {
        currentBox.classList.remove("collapsed");
        const arrow = currentBox.querySelector(".arrow");
        if (arrow) {
          arrow.classList.remove("collapsed");
        }
      }
      currentIndex = (currentIndex - 1 + smallBoxes.length) % smallBoxes.length;
      updateCarousel();
    }
  
    const nextArrow = document.querySelector(".carousel-arrow.next");
    const prevArrow = document.querySelector(".carousel-arrow.prev");
  
    nextArrow.addEventListener("click", nextBox);
    prevArrow.addEventListener("click", prevBox);
  
    smallBoxes.forEach((box, index) => {
      const header = box.querySelector(".small-box-header");
      header.addEventListener("click", () => {
        const arrow = header.querySelector(".arrow");
        box.classList.toggle("collapsed");
        arrow.classList.toggle("collapsed");
  
        // Mobile specific behavior
        if (window.innerWidth <= 768) {
          if (currentlyOpenedBox && currentlyOpenedBox !== box) {
            currentlyOpenedBox.classList.remove("opened");
            currentlyOpenedBox.querySelector(".arrow").classList.add("collapsed");
            currentlyOpenedBox.classList.add("collapsed");
          }
          if (box.classList.contains("collapsed")) {
            box.classList.remove("opened");
          } else {
            box.classList.add("opened");
            currentlyOpenedBox = box;
            currentIndex = index;
          }
        }
      });
    });
  
    // Initialize carousel display
    updateCarousel();
  });
  
  function openUserModal() {
    document.getElementById("userModal").style.display = "block";
  }
  
  function closeUserModal() {
    document.getElementById("userModal").style.display = "none";
  }
  
  function relinkUser() {
    // Your relink functionality here
    alert("Relink button clicked");
  }
  
  function refreshUser() {
    // Your relink functionality here
    alert("Refresh button clicked");
  }
  
  // Close modal when clicking outside of it
  window.onclick = function (event) {
    const modal = document.getElementById("userModal");
    if (event.target === modal) {
      closeUserModal();
    }
  };