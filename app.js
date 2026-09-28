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
        const fitur = response.data.features[0];

        const negara = fitur.context
            ?.find(x => x.id.startsWith("country"))?.text || "-";

        const provinsi = fitur.context
            ?.find(x => x.id.startsWith("region"))?.text || "-";

        const kecamatan = fitur.context
            ?.find(x => x.id.startsWith("county"))?.text || "-";

        res.json({
            kota: fitur.matching_text,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            koordinat: fitur.geometry.coordinates
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