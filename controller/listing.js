const Listing = require("../models/listing");

//Geocode a location string using OpenCage API
async function geocodeLocation(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    const apiKey = process.env.OPENCAGE_API_KEY;

    if (!apiKey) {
        console.warn("OPENCAGE_API_KEY is not set in .env — map will not work.");
        return null;
    }

    try {
        const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&limit=1`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const { lng, lat } = data.results[0].geometry;
            return {
                type: "Point",
                coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
            };
        } else {
            console.warn(`Geocoding returned no results for: ${location}, ${country}`);
            return null;
        }
    } catch (err) {
        console.error("Geocoding error:", err.message);
        return null;
    }
}

module.exports.index = async (req, res) => {
    const q = req.query.q ? req.query.q.trim() : "";
    let allListings;
    if (q) {
        const regex = new RegExp(q, "i");
        allListings = await Listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { country: regex },
            ],
        });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings, q });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listingData = req.body.listing;

    // Remove empty image so existing image is kept
    if (!listingData.image || listingData.image.trim === "") {
        delete listingData.image;
    }

    let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

    // Update image if a new file was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // Re-geocode since location/country may have changed
    const geometry = await geocodeLocation(listing.location, listing.country);
    if (geometry) {
        listing.geometry = geometry;
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings`);
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listingData = req.body.listing;

    // Remove empty image field
    if (!listingData.image || listingData.image.trim === "") {
        delete listingData.image;
    }

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Geocode the location to get coordinates for the map
    const geometry = await geocodeLocation(listingData.location, listingData.country);
    if (geometry) {
        newListing.geometry = geometry;
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
