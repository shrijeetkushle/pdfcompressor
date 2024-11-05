document.getElementById('upload-form').onsubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const formData = new FormData(e.target); // Create FormData object

    // Send the form data to the server
    const response = await fetch('/compress-pdf', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    const resultDiv = document.getElementById('result');

    if (result.success) {
        resultDiv.innerHTML = `<a href="${result.filePath}" target="_blank">Download Compressed PDF</a>`;
    } else {
        resultDiv.innerHTML = `Error: ${result.message}`;
    }
};
