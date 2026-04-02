import axios from 'axios';

async function testApi() {
    try {
        const type = "RTO";
        const pincode = "Andheri";
        const searchQuery = `${type} ${pincode}`;
        const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=10`;
        const mapRes = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Intellicar-App/1.0' }
        });
        console.log("RTO Andheri:", mapRes.data.length);
        
        const q2 = `Car Wash ${pincode}`;
        const apiUrl2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q2)}&format=json&limit=10`;
        const mapRes2 = await axios.get(apiUrl2, {
            headers: { 'User-Agent': 'Intellicar-App/1.0' }
        });
        console.log("Car Wash Andheri:", mapRes2.data.length);
    } catch (e) {
        console.error(e.message);
    }
}
testApi();
