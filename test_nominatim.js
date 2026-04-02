import axios from 'axios';

async function testNominatim() {
  try {
    const q = 'Car Wash near Andheri';
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q, format: 'json', addressdetails: 1 },
      headers: { 'User-Agent': 'Intellicar-App/1.0' }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}
testNominatim();
