const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://arabic-news-api.p.rapidapi.com/aljazeera');
xhr.setRequestHeader('x-rapidapi-key', 'f3ba5b26e1msh2b3c7cea1ece59dp18385djsn79bca45f9655');
xhr.setRequestHeader('x-rapidapi-host', 'arabic-news-api.p.rapidapi.com');

xhr.send(data);

console.log(xhr.responseText);