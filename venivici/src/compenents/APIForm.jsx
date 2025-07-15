import { useState } from 'react';

const APIForm = ({inputs, handleChange, onSubmit}) => {
  // State to control camera info visibility
  const [showCameraInfo, setShowCameraInfo] = useState(false);
  
  // State for ban list
  const [banList, setBanList] = useState({
    dates: [],
    cameras: []
  });

  // Define inputsInfo with helpful information for NASA API
  const inputsInfo = {
    earth_date: "Enter date in YYYY-MM-DD format (e.g., 2002-09-02)",
    camera: "Optional: FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM",
    page: "Optional: Page number for pagination (default: 1)"
  };

  // Function to add item to ban list
  const addToBanList = (type, value) => {
    if (!value.trim()) return;
    
    setBanList(prev => ({
      ...prev,
      [type]: prev[type].includes(value) ? prev[type] : [...prev[type], value]
    }));
  };

  // Function to remove item from ban list
  const removeFromBanList = (type, value) => {
    setBanList(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  // Check if current value is banned
  const isBanned = (type, value) => {
    const listType = type === 'earth_date' ? 'dates' : 'cameras';
    return banList[listType].includes(value);
  };

  return (
    <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
      {/* Main Form Section */}
      <div style={{flex: '2'}}>
        <h2>Select Your Mars Photo Search Parameters:</h2>
        <form className="form-container" onSubmit={onSubmit}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {inputs &&
              Object.entries(inputs).map(([category, value], index) => (
                <div 
                  key={category} 
                  className="form-field"
                  style={{
                    flex: '1',
                    minWidth: '250px',
                    padding: '10px',
                    border: isBanned(category, value) ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: isBanned(category, value) ? '#f8d7da' : '#f9f9f9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <h3 style={{margin: '0 0 10px 0', fontSize: '16px'}}>
                    {category.replace('_', ' ').toUpperCase()}
                  </h3>
                  
                  {/* Ban button for dates and cameras */}
                  {(category === 'earth_date' || category === 'camera') && value && (
                    <button
                      type="button"
                      onClick={() => {
                        const listType = category === 'earth_date' ? 'dates' : 'cameras';
                        if (isBanned(category, value)) {
                          removeFromBanList(listType, value);
                        } else {
                          addToBanList(listType, value);
                        }
                      }}
                      style={{
                        padding: '3px 6px',
                        fontSize: '10px',
                        backgroundColor: isBanned(category, value) ? '#dc3545' : '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        marginBottom: '5px'
                      }}
                    >
                      {isBanned(category, value) ? 'Unban' : 'Ban'}
                    </button>
                  )}
                  
                  {category === 'camera' && (
                    <button
                      type="button"
                      onClick={() => setShowCameraInfo(!showCameraInfo)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '8px'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                      {showCameraInfo ? 'Hide Camera Type Info' : 'Show Camera Type Info'}
                    </button>
                  )}
                  <input
                    type="text"
                    name={category}
                    value={value}
                    placeholder={
                      category === 'earth_date' ? "YYYY-MM-DD" :
                      category === 'camera' ? "Camera type (optional)" :
                      category === 'page' ? "Page number (optional)" :
                      "Input this attribute..."
                    }
                    onChange={handleChange}
                    className="textbox"
                    style={{
                      width: '80%',
                      maxWidth: '200px',
                      padding: '6px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginBottom: '5px',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}
                  />
                  <p style={{fontSize: '12px', color: '#666', margin: '5px 0 0 0', textAlign: 'center'}}>
                    {inputsInfo[category]}
                  </p>
                  {isBanned(category, value) && (
                    <p style={{fontSize: '10px', color: '#dc3545', margin: '2px 0 0 0', textAlign: 'center'}}>
                      ⚠️ This {category === 'earth_date' ? 'date' : 'camera'} is banned!
                    </p>
                  )}
                </div>
              ))}
          </div>
          <button 
            type="submit" 
            style={{
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Search Mars Photos
          </button>
        </form>
        
        {/* Camera Information Section - Only show when button is clicked */}
        {showCameraInfo && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              color: '#333',
              textAlign: 'center'
            }}>
              Camera Information Reference
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>FHAZ:</strong> Front Hazard Avoidance Camera
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>RHAZ:</strong> Rear Hazard Avoidance Camera
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>MAST:</strong> Mast Camera
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>CHEMCAM:</strong> Chemistry and Camera Complex
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>MAHLI:</strong> Mars Hand Lens Imager
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>MARDI:</strong> Mars Descent Imager
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>NAVCAM:</strong> Navigation Camera
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>PANCAM:</strong> Panoramic Camera
              </div>
              <div style={{padding: '8px', backgroundColor: 'white', borderRadius: '4px', color: 'black'}}>
                <strong>MINITES:</strong> Miniature Thermal Emission Spectrometer (Mini-TES)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ban List Sidebar */}
      <div style={{
        flex: '1',
        minWidth: '250px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        position: 'sticky',
        top: '20px'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          color: 'black',
          textAlign: 'center'
        }}>
          🚫 Ban List
        </h3>
        
        {/* Description */}
        <div style={{
          padding: '10px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <p style={{
            fontSize: '11px',
            color: 'black',
            margin: '0',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            💡 <strong>Tip:</strong> Ban buttons will appear above the date and camera fields when you type in values. Use them to prevent searching with specific dates or camera types.
          </p>
        </div>
        
        {/* Banned Dates */}
        <div style={{marginBottom: '20px'}}>
          <h4 style={{margin: '0 0 10px 0', fontSize: '14px', color: 'black'}}>
            Banned Dates ({banList.dates.length})
          </h4>
          {banList.dates.length === 0 ? (
            <p style={{fontSize: '12px', color: 'black', fontStyle: 'italic'}}>No dates banned</p>
          ) : (
            <div style={{maxHeight: '150px', overflowY: 'auto'}}>
              {banList.dates.map((date, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '5px 8px',
                  margin: '3px 0',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: 'black'
                }}>
                  <span>{date}</span>
                  <button
                    onClick={() => removeFromBanList('dates', date)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '2px 5px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Banned Cameras */}
        <div>
          <h4 style={{margin: '0 0 10px 0', fontSize: '14px', color: 'black'}}>
            Banned Cameras ({banList.cameras.length})
          </h4>
          {banList.cameras.length === 0 ? (
            <p style={{fontSize: '12px', color: 'black', fontStyle: 'italic'}}>No cameras banned</p>
          ) : (
            <div style={{maxHeight: '150px', overflowY: 'auto'}}>
              {banList.cameras.map((camera, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '5px 8px',
                  margin: '3px 0',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: 'black'
                }}>
                  <span>{camera}</span>
                  <button
                    onClick={() => removeFromBanList('cameras', camera)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '2px 5px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear all button */}
        {(banList.dates.length > 0 || banList.cameras.length > 0) && (
          <button
            onClick={() => setBanList({dates: [], cameras: []})}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Clear All Bans
          </button>
        )}
      </div>
    </div>
  );
};

export default APIForm;