const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi/:kota", async (req, res) => {

    const kota = req.params.kota;
    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    try {

        const response = await axios.get(url);
        const data = response.data;
        const fitur = data.features[0];

        const lokasi = fitur.matching_text;
        const koordinat = fitur.geometry.coordinates;

        const negara = fitur.context
            ?.find(x => x.id.startsWith("country"))?.text || "-";

        const provinsi = fitur.context
            ?.find(x => x.id.startsWith("region"))?.text || "-";

        res.json({
            kota: lokasi,
            negara: negara,
            provinsi: provinsi,
            koordinat: koordinat
        });

    } catch (error) {

        res.status(500).json({
            message: "Gagal Mengambil data"
        });

    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});