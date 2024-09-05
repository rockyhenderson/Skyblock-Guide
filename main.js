document.getElementById("fetchMessage").addEventListener("click", () => {
  fetch("/netlify/functions/hello.js")
    .then(response => response.json())
    .then(data => {
      document.getElementById("message").innerText = data.message;
    })
    .catch(error => console.error('Error fetching data:', error));
});
