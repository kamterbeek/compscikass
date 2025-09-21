const form = document.getElementByID('trainingForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {[
        data[key] = value;
  });

    try {
        const response = await fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON,stringify(data),
        }); 

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }

});
