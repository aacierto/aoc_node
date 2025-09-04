// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// The correct raw URL for your JSON file
const JSON_URL = 'https://raw.githubusercontent.com/aacierto/archive_of_constraint_JSON/main/archive_of_constraint_June_2025.json';

// Function to fetch and filter JSON data
async function fetchConstraintData() {
  try {
    const response = await fetch(JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Filter to only include the fields you need
    const filteredData = data.map(item => ({
      accession_number: item.accession_number || null,
      title_from_seller: item.title_from_seller || null,
      format: item.format || null,
      date_of_sale: item.date_of_sale || null,
      cost_less_shipping: item.cost_less_shipping || null,
      notes: item.notes || null
    }));
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// API endpoint to get the filtered data
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchConstraintData();
    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to search data
app.get('/api/search', async (req, res) => {
  try {
    const { q, field } = req.query;
    const data = await fetchConstraintData();
    
    let filteredData = data;
    
    if (q && field) {
      filteredData = data.filter(item => 
        item[field] && item[field].toString().toLowerCase().includes(q.toLowerCase())
      );
    } else if (q) {
      // Search across all fields
      filteredData = data.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(q.toLowerCase())
        )
      );
    }
    
    res.json({
      success: true,
      count: filteredData.length,
      data: filteredData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
