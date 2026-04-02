import axios from 'axios';

export const getLocationServices = async (req, res) => {
  try {
    const { type, pincode, lat, lng } = req.query;


    const locationQuery = pincode ? pincode : `${lat},${lng}`;
    const searchQuery = `${type} ${locationQuery}`;

    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=15&countrycodes=in`;
    
    const mapRes = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Intellicar-App/1.0'
      }
    });

    const filteredData = (mapRes.data || []).filter(place => {
      const address = place.display_name.toLowerCase();
      const searchTerms = locationQuery.toLowerCase().split(/[\s,]+/);
      

      const hasMatch = searchTerms.some(term => term.length > 2 && address.includes(term));
      
      
      return searchTerms.length === 0 || hasMatch || locationQuery.length <= 2;
    });

    if (filteredData.length === 0) {
      
      return res.json({ 
        success: true, 
        data: [],
        message: "No exact local matches found by OSM."
      });
    }

    const formattedResults = filteredData.map(place => {
      const parts = place.display_name.split(',');
      const shortName = parts[0] || place.display_name;
      const address = place.display_name;

      return {
        name: shortName,
        address: address,
        rating: null, 
        user_ratings_total: 0,
        maps_link: `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`
      };
    });

    res.json({ success: true, data: formattedResults });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

