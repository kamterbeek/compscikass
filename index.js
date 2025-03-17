// JavaScript to dynamically create buttons
window.onload = function() {
  const buttonArea = document.getElementById("button-area");
  
  // Button data (can be expanded with more buttons)
  const buttons = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Services", link: "/services" },
    { label: "Contact", link: "/contact" }
  ];

  // Loop through each button data and create a button
  buttons.forEach(button => {
    const btn = document.createElement("button");
    btn.textContent = button.label;
    btn.onclick = () => window.location.href = button.link;
    buttonArea.appendChild(btn);
  });
};
