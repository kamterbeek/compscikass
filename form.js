document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(this); // Capture form data

    try {
        const response = await fetch("/submit-form", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            alert("Form submitted successfully!");
            console.log(result);
        } else {
            throw new Error("Failed to submit form.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error submitting form.");
    }
});
