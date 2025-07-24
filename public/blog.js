// Get the h2 element
const h2Element = document.getElementById('bubble-heading');

// Add event listener
h2Element.addEventListener('mouseover', () => {
    h2Element.classList.add('grow');
});

// Remove the effect when mouse leaves
h2Element.addEventListener('mouseout', () => {
    h2Element.classList.remove('grow'); // Remove 'grow' class 
});
