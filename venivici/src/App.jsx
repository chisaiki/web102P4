import { useState } from 'react'
import './App.css'
import APIForm from './compenents/APIForm'

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY; // Note: Vite requires VITE_ prefix
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    earth_date: '',
    camera: '',
    page: '1'
  });

  // State for storing fetched data
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted with inputs:', inputs);
    
    if (!inputs.earth_date) {
      setError('Please enter an earth date');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Build dynamic API URL based on user inputs
      let apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${inputs.earth_date}&api_key=${API_KEY}`;
      
      // Add optional parameters if provided
      if (inputs.camera) {
        apiUrl += `&camera=${inputs.camera}`;
      }
      if (inputs.page) {
        apiUrl += `&page=${inputs.page}`;
      }

      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPhotos(data.photos || []);
      console.log('Fetched data:', data);
      
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>NASA Mars Photos</h1>
      <APIForm 
        inputs={inputs}
        handleChange={handleChange}
        onSubmit={handleSubmit}
      />
      
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      
      {photos.length > 0 && (
        <div>
          <h2>Found {photos.length} photos:</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px'}}>
            {photos.slice(0, 12).map((photo) => (
              <div key={photo.id} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '8px'}}>
                <img 
                  src={photo.img_src} 
                  alt={`Mars photo ${photo.id}`}
                  style={{width: '100%', height: '200px', objectFit: 'cover'}}
                />
                <p><strong>Camera:</strong> {photo.camera.full_name}</p>
                <p><strong>Date:</strong> {photo.earth_date}</p>
                <p><strong>Sol:</strong> {photo.sol}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
