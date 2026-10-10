const fs = require('fs');

const importStatement = `import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";`;

const newMapComponent = `
const CAFE_LOCATION = { lat: 12.9716, lng: 77.6013 }; // Approx 12 Residency Road, Bangalore

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

function CafeMapInner({ activeTab }: { activeTab: "map" | "landmarks" | "transit" }) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [cafeInfoOpen, setCafeInfoOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!map || !placesLib) return;
    if (activeTab === "map") {
      setPlaces([]);
      setSelectedPlace(null);
      map.panTo(CAFE_LOCATION);
      map.setZoom(16);
      return;
    }

    setLoading(true);
    const service = new placesLib.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: CAFE_LOCATION,
      radius: 1000,
      type: activeTab === "landmarks" ? "tourist_attraction" : "transit_station",
    };

    service.nearbySearch(request, (results, status) => {
      setLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results.slice(0, 5));
        if (results.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(CAFE_LOCATION);
          results.slice(0, 5).forEach((p) => {
            if (p.geometry?.location) bounds.extend(p.geometry.location);
          });
          map.fitBounds(bounds);
        }
      } else {
        setPlaces([]);
      }
    });
  }, [map, placesLib, activeTab]);

  return (
    <>
      <Map
        defaultCenter={CAFE_LOCATION}
        defaultZoom={16}
        styles={MAP_STYLES}
        disableDefaultUI={true}
        zoomControl={true}
        mapId="AJAB_CAFE_MAP_ID"
      >
        {/* Main Cafe Marker */}
        <AdvancedMarker 
          position={CAFE_LOCATION} 
          onClick={() => setCafeInfoOpen(true)}
        >
          <Pin background="#D49566" borderColor="#1A100C" glyphColor="#1A100C" />
        </AdvancedMarker>

        {cafeInfoOpen && (
          <InfoWindow position={CAFE_LOCATION} onCloseClick={() => setCafeInfoOpen(false)}>
            <div className="p-2" style={{ color: "#1A100C" }}>
              <h3 className="font-bold text-sm">AJAB Café & Restaurant</h3>
              <p className="text-xs mt-1">12 Residency Rd, Bangalore</p>
              <p className="text-xs mt-1 font-semibold text-green-700">Open Daily · 8:00 AM – 11:00 PM</p>
              <a 
                href={\`https://www.google.com/maps/dir/?api=1&destination=\${CAFE_LOCATION.lat},\${CAFE_LOCATION.lng}\`} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-bold text-blue-600 underline"
              >
                Get Directions
              </a>
            </div>
          </InfoWindow>
        )}

        {/* Nearby Places Markers */}
        {places.map((place, i) => (
          <AdvancedMarker 
            key={i} 
            position={place.geometry?.location as google.maps.LatLng} 
            onClick={() => setSelectedPlace(place)}
          >
            <Pin background={activeTab === "landmarks" ? "#4ADE80" : "#60A5FA"} borderColor="#1A100C" glyphColor="#1A100C" />
          </AdvancedMarker>
        ))}

        {selectedPlace && selectedPlace.geometry?.location && (
          <InfoWindow position={selectedPlace.geometry.location} onCloseClick={() => setSelectedPlace(null)}>
            <div className="p-2" style={{ color: "#1A100C" }}>
              <h3 className="font-bold text-sm">{selectedPlace.name}</h3>
              <p className="text-xs mt-1">{selectedPlace.vicinity}</p>
              <a 
                href={\`https://www.google.com/maps/dir/?api=1&destination=\${selectedPlace.geometry.location.lat()},\${selectedPlace.geometry.location.lng()}\`} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-bold text-blue-600 underline"
              >
                Get Directions
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating Panel for Places */}
      {activeTab !== "map" && (
        <div className="absolute top-4 left-4 max-w-[280px] sm:max-w-sm max-h-[300px] overflow-y-auto rounded-xl shadow-lg border p-3 z-10" style={{ backgroundColor: "rgba(26, 20, 15, 0.95)", borderColor: C.border }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: C.accent }}>
            {activeTab === "landmarks" ? "Nearby Landmarks" : "Transit & Parking"}
          </h3>
          {loading && <p className="text-xs opacity-70">Loading places...</p>}
          {!loading && places.length === 0 && (
            <p className="text-xs opacity-70">No places found nearby.</p>
          )}
          <div className="flex flex-col gap-2">
            {places.map((place, i) => (
              <div 
                key={i} 
                className="p-2 rounded-lg cursor-pointer transition-colors"
                style={{ backgroundColor: selectedPlace?.place_id === place.place_id ? "rgba(212, 149, 102, 0.2)" : "transparent" }}
                onClick={() => {
                  setSelectedPlace(place);
                  if (map && place.geometry?.location) map.panTo(place.geometry.location);
                }}
              >
                <div className="font-semibold text-xs text-white">{place.name}</div>
                <div className="text-[10px] opacity-70 truncate">{place.vicinity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function CafeSurroundingsMap() {
  const [activeTab, setActiveTab] = useState<"map" | "landmarks" | "transit">("map");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: C.card, border: \`2px solid \${C.border}\` }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#122619] text-[#4ADE80] border border-[#1E4729] mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Open Daily · 8:00 AM – 11:00 PM</span>
          </div>
          <h2 className="font-serif text-3xl font-bold" style={{ color: C.accent }}>
            Café Location &amp; Outside Surroundings
          </h2>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            12 Residency Road, Central Heritage District, Bangalore
          </p>
        </div>

        <div className="flex rounded-2xl p-1 shrink-0 flex-wrap" style={{ backgroundColor: C.cream, border: \`1px solid \${C.border}\` }}>
          {[
            { id: "map" as const, label: "Interactive Map", icon: <Icons.MapPin size={13} /> },
            { id: "landmarks" as const, label: "Landmarks", icon: <Icons.Building size={13} /> },
            { id: "transit" as const, label: "Transit & Parking", icon: <Icons.Car size={13} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: activeTab === tab.id ? C.accent : "transparent",
                color: activeTab === tab.id ? "#FFFDF8" : C.muted,
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border-2" style={{ height: 400, borderColor: C.border, backgroundColor: "#140F0C" }}>
        {!apiKey ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-[#1A100C]">
            <Icons.MapPin size={48} className="mb-4 text-[#D49566] opacity-50" />
            <h3 className="text-xl font-bold mb-2">Google Maps Integration Required</h3>
            <p className="text-sm opacity-70 max-w-md">
              To view the interactive map, please configure your Google Maps Platform API key.
            </p>
            <div className="mt-6 text-xs bg-black/30 p-4 rounded-xl border border-white/10 text-left">
              <p className="font-mono mb-2">1. Create a <b>.env</b> file in the project root</p>
              <p className="font-mono">2. Add: VITE_GOOGLE_MAPS_API_KEY=your_api_key</p>
            </div>
          </div>
        ) : (
          <APIProvider apiKey={apiKey}>
            <CafeMapInner activeTab={activeTab} />
          </APIProvider>
        )}
      </div>
    </div>
  );
}
`;

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Imports
if (!content.includes('@vis.gl/react-google-maps')) {
  // Find the last import
  const lastImportIndex = content.lastIndexOf('import ');
  const endOfLastImport = content.indexOf('\\n', lastImportIndex);
  content = content.substring(0, endOfLastImport + 1) + importStatement + '\\n' + content.substring(endOfLastImport + 1);
}

// 2. Replace the old component
const regex = /function CafeSurroundingsMap\(\) \{[\s\S]*?\}\s*(?=\n\/\* ═══════════════════════════════════════════════════════════════════════\s*MENU)/m;
content = content.replace(regex, newMapComponent + '\\n');

fs.writeFileSync('src/App.tsx', content);
console.log('Successfully patched App.tsx with Google Maps integration!');
