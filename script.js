function searchTracks() {
    const query = document.getElementById('searchInput').value.trim();
    if (query === '') {
        alert('Please enter a search query.');
        return;
    }

    $('#waitModal').modal('show');

    fetch(`https://spotifyapi.caliphdev.com/api/search/tracks?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const musicGallery = document.getElementById('musicGallery');
            musicGallery.innerHTML = '';

            if (data.length === 0) {
                musicGallery.innerHTML = '<p class="text-center text-gray-600">No results found.</p>';
                $('#waitModal').modal('hide');
                return;
            }

            data.forEach(track => {
                const card = `
                    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                        <img src="${track.thumbnail}" alt="${track.title}" class="w-full h-40 object-cover rounded-t-lg">
                        <div class="p-4">
                            <h2 class="text-lg font-semibold text-white">${track.title}</h2>
                            <p class="text-sm text-gray-400">${track.artist}</p>
                            <button onclick="showTrackInfo('${track.url}')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2">Play</button>
                        </div>
                    </div>
                `;
                musicGallery.innerHTML += card;
            });

            $('#waitModal').modal('hide');
        })
        .catch(error => {
            console.error('Error fetching tracks:', error);
            alert('Failed to fetch tracks. Please try again later.');
            $('#waitModal').modal('hide');
        });
}

function showTrackInfo(trackUrl) {
    $('#waitModal').modal('show');

    fetch(`https://spotifyapi.caliphdev.com/api/info/track?url=${trackUrl}`)
        .then(response => response.json())
        .then(data => {
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');

            modalTitle.textContent = data.title;
            modalContent.innerHTML = `
                <img src="${data.thumbnail}" alt="${data.title}" class="w-100 rounded">
                <p><strong>Artist:</strong> ${data.artist}</p>
                <p><strong>Album:</strong> ${data.album}</p>
                <audio controls class="mx-auto mt-4">
                    <source src="https://spotifyapi.caliphdev.com/api/download/track?url=${trackUrl}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio>
            `;

            $('#trackModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching track info:', error);
            alert('Failed to fetch track info. Please try again later.');
            $('#waitModal').modal('hide');
        });
}

function closeModal() {
    $('#trackModal').modal('hide');
}

document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchTracks();
    }
});