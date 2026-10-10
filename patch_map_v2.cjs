const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

const newMapStr = `function CafeSurroundingsMap() {
  const [activeTab, setActiveTab] = useState('directions'); // 'directions', 'landmarks', 'transit'

  // Map configuration
  const center = { lat: 51.5126, lng: -0.1337 }; // Soho, London
  const mapId = 'e2300b9be44983fb'; // Custom map ID for styling

  // Custom dark style for the map matching espresso theme
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#241812" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#241812" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#D49566" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#F5EBDD" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#F5EBDD" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#285C43" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3C7A59" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#4B3023" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#241812" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#B87543" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#744A31" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#4B3023" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#F5EBDD" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#241812" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#D49566" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#1A110D" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4B3023" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1A110D" }],
      },
    ],
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start my-12" id="cafe-location">
      {/* Left Column: Interactive Map */}
      <div className="w-full lg:w-2/3 h-[500px] border border-[#4B3023] relative bg-[#241812] rounded-xl overflow-hidden shadow-2xl group">
        {!apiKey ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#241812]">
            <Icons.Map size={48} className="text-[#991B1B] mb-4 opacity-70" />
            <h3 className="font-serif text-2xl text-[#D49566] mb-2">Map Unavailable</h3>
            <p className="text-[#F5EBDD] opacity-80 max-w-md mx-auto mb-4">
              Google Maps integration requires a valid API key. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
            </p>
          </div>
        ) : (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={center}
              defaultZoom={15}
              mapId={mapId}
              options={mapOptions}
              className="w-full h-full"
            >
              <AdvancedMarker position={center} title="AJAB Café">
                <div className="w-10 h-10 bg-[#D49566] rounded-full border-2 border-[#241812] flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                  <Icons.Coffee size={20} className="text-[#241812]" />
                </div>
              </AdvancedMarker>
              
              {activeTab === 'landmarks' && (
                <>
                  <AdvancedMarker position={{ lat: 51.5132, lng: -0.1345 }} title="Soho Square">
                    <Pin background={"#285C43"} borderColor={"#1A3D2D"} glyphColor={"#F5EBDD"} />
                  </AdvancedMarker>
                  <AdvancedMarker position={{ lat: 51.5118, lng: -0.1331 }} title="Piccadilly Theatre">
                    <Pin background={"#4B3023"} borderColor={"#241812"} glyphColor={"#F5EBDD"} />
                  </AdvancedMarker>
                </>
              )}
              
              {activeTab === 'transit' && (
                <>
                  <AdvancedMarker position={{ lat: 51.5113, lng: -0.1338 }} title="Piccadilly Circus Station">
                    <Pin background={"#1A4384"} borderColor={"#0F284F"} glyphColor={"#FFFFFF"} />
                  </AdvancedMarker>
                  <AdvancedMarker position={{ lat: 51.5140, lng: -0.1305 }} title="Tottenham Court Road Station">
                    <Pin background={"#1A4384"} borderColor={"#0F284F"} glyphColor={"#FFFFFF"} />
                  </AdvancedMarker>
                </>
              )}
            </Map>
          </APIProvider>
        )}
      </div>
      
      {/* Right Column: Directions & Details */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-3xl text-[#D49566] mb-3">Find Us</h2>
          <p className="text-[#F5EBDD] opacity-90 leading-relaxed mb-4">
            Nestled in the heart of the city, AJAB Café is an urban sanctuary offering respite from the bustling streets. Look for our signature copper espresso bar through the heritage windows.
          </p>
          <div className="flex items-start gap-3 mt-4 text-[#F5EBDD]">
            <Icons.Map size={20} className="text-[#D49566] shrink-0 mt-1" />
            <div>
              <p className="font-bold">142 Reserve St, Central District</p>
              <p className="opacity-80 text-sm mt-1">London, W1D 3QU</p>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-[#1A110D] p-1 rounded-lg border border-[#4B3023]">
          <button 
            onClick={() => setActiveTab('directions')}
            className={\`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-md transition-colors \${activeTab === 'directions' ? 'bg-[#4B3023] text-[#D49566]' : 'text-[#F5EBDD] opacity-60 hover:opacity-100'}\`}
          >
            Directions
          </button>
          <button 
            onClick={() => setActiveTab('transit')}
            className={\`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-md transition-colors \${activeTab === 'transit' ? 'bg-[#4B3023] text-[#D49566]' : 'text-[#F5EBDD] opacity-60 hover:opacity-100'}\`}
          >
            Transit
          </button>
          <button 
            onClick={() => setActiveTab('landmarks')}
            className={\`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-md transition-colors \${activeTab === 'landmarks' ? 'bg-[#4B3023] text-[#D49566]' : 'text-[#F5EBDD] opacity-60 hover:opacity-100'}\`}
          >
            Nearby
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#241812] p-5 rounded-xl border border-[#4B3023]">
          {activeTab === 'directions' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl text-[#F5EBDD] mb-3">Getting Here</h3>
              <p className="text-sm text-[#F5EBDD] opacity-80 mb-4">
                We are located just off the main avenue. If you are driving, enter our address directly into Google Maps for the best route.
              </p>
              <a 
                href="https://maps.google.com/?q=51.5126,-0.1337" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#D49566] text-[#241812] font-bold rounded flex items-center justify-center gap-2 hover:bg-[#B87543] transition-colors"
              >
                <Icons.Map size={18} /> Open in Google Maps
              </a>
            </div>
          )}

          {activeTab === 'transit' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl text-[#F5EBDD] mb-3">Transit & Parking</h3>
              <ul className="text-sm text-[#F5EBDD] opacity-80 space-y-3">
                <li className="flex gap-2">
                  <strong className="text-[#D49566]">Tube:</strong> 3 min walk from Piccadilly Circus Station (Piccadilly & Bakerloo lines).
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#D49566]">Bus:</strong> Routes 14, 19, 38 stop nearby.
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#D49566]">Parking:</strong> Validated parking available at Q-Park Soho (5 min walk).
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'landmarks' && (
            <div className="animate-fade-in">
              <h3 className="font-serif text-xl text-[#F5EBDD] mb-3">Around Us</h3>
              <ul className="text-sm text-[#F5EBDD] opacity-80 space-y-3">
                <li className="flex justify-between items-center border-b border-[#4B3023] pb-2">
                  <span>Soho Square Gardens</span>
                  <span className="text-xs opacity-60">2 min walk</span>
                </li>
                <li className="flex justify-between items-center border-b border-[#4B3023] pb-2">
                  <span>Piccadilly Theatre</span>
                  <span className="text-xs opacity-60">4 min walk</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>National Gallery</span>
                  <span className="text-xs opacity-60">10 min walk</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

let start = -1;
let end = -1;
let braces = 0;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('function CafeSurroundingsMap')) {
    start = i;
    braces = 1;
    continue;
  }
  if (start !== -1) {
    for(let j=0; j<lines[i].length; j++) {
      if (lines[i][j] === '{') braces++;
      if (lines[i][j] === '}') braces--;
    }
    if (braces === 0) {
      end = i;
      break;
    }
  }
}

if (start !== -1 && end !== -1) {
  lines.splice(start, end - start + 1, newMapStr);
  
  // Also fix import at top of App.tsx
  if (lines[0] && !lines[0].includes('APIProvider')) {
    lines.unshift('import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";');
  }

  fs.writeFileSync('src/App.tsx', lines.join('\\n'), 'utf8');
  console.log('Successfully patched App.tsx with Google Maps integration!');
} else {
  console.error('Could not find CafeSurroundingsMap bounds in App.tsx');
}
