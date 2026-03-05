require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function geocodeLocation(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    const apiKey = process.env.OPENCAGE_API_KEY;

    if (!apiKey) {
        throw new Error("OPENCAGE_API_KEY is not set in your .env file!");
    }

    const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&limit=1`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        const { lng, lat } = data.results[0].geometry;
        return { type: "Point", coordinates: [lng, lat] };
    }

    return null;
}

async function migrate() {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected\n");

    // Find all listings that are missing geometry
    const listings = await Listing.find({
        $or: [
            { geometry: { $exists: false } },
            { "geometry.coordinates": { $exists: false } },
            { "geometry.coordinates": { $size: 0 } },
        ],
    });

    console.log(`Found ${listings.length} listing(s) without coordinates.\n`);

    if (listings.length === 0) {
        console.log("All listings already have coordinates. Nothing to do!");
        process.exit(0);
    }

    let success = 0;
    let failed = 0;

    for (let listing of listings) {
        try {
            const geometry = await geocodeLocation(listing.location, listing.country);

            if (geometry) {
                listing.geometry = geometry;
                await listing.save();
                console.log(`✅  "${listing.title}" → [${geometry.coordinates}]`);
                success++;
            } else {
                console.log(`⚠️  "${listing.title}" → No results found for "${listing.location}, ${listing.country}"`);
                failed++;
            }
        } catch (err) {
            console.error(`❌  "${listing.title}" → Error: ${err.message}`);
            failed++;
        }

        // Small delay to avoid hitting API rate limits
        await new Promise((res) => setTimeout(res, 300));
    }

    console.log(`\nDone! ${success} updated, ${failed} failed.`);
    process.exit(0);
}

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
