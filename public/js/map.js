document.addEventListener("DOMContentLoaded", function () {
    const mapDiv = document.getElementById("map");

    if (!mapDiv) return;

    let coordinates;
    try {
        coordinates = JSON.parse(mapDiv.dataset.coordinates);
    } catch (e) {
        console.error("Invalid map coordinates:", e);
        return;
    }

    if (!coordinates || coordinates.length !== 2) {
        console.error("Map coordinates missing or malformed.");
        return;
    }

    const lat = coordinates[1];
    const lng = coordinates[0];

    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup("<b>Listing Location</b>")
        .openPopup();
});
