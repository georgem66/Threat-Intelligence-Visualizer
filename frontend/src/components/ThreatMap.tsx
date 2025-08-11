import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { analyticsService } from '../services/analyticsService';

interface GeoThreat {
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  count: number;
  severity: string;
  category: string;
}

const severityColors = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#D97706',
  low: '#65A30D',
};

const ThreatMap: React.FC = () => {
  const [geoThreats, setGeoThreats] = useState<GeoThreat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeoData();
  }, []);

  const loadGeoData = async () => {
    try {
      const data = await analyticsService.getGeographic();
      setGeoThreats(data.geoData);
    } catch (error) {
      console.error('Failed to load geographic data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getMarkerColor = (severity: string) => {
    return severityColors[severity as keyof typeof severityColors] || '#6B7280';
  };

  const getMarkerSize = (count: number) => {
    if (count >= 100) return 15;
    if (count >= 50) return 12;
    if (count >= 20) return 9;
    if (count >= 10) return 6;
    return 4;
  };

  // Group threats by location to avoid overlapping markers
  const groupedThreats = geoThreats.reduce((acc, threat) => {
    const key = `${threat.latitude},${threat.longitude}`;
    if (!acc[key]) {
      acc[key] = {
        ...threat,
        totalCount: 0,
        categories: {} as Record<string, number>,
        severities: {} as Record<string, number>,
      };
    }
    
    acc[key].totalCount += threat.count;
    acc[key].categories[threat.category] = (acc[key].categories[threat.category] || 0) + threat.count;
    acc[key].severities[threat.severity] = (acc[key].severities[threat.severity] || 0) + threat.count;
    
    return acc;
  }, {} as Record<string, GeoThreat & { 
    totalCount: number; 
    categories: Record<string, number>; 
    severities: Record<string, number>; 
  }>);

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Object.values(groupedThreats).map((threat, index) => {
          const primarySeverity = Object.entries(threat.severities)
            .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
          
          return (
            <CircleMarker
              key={index}
              center={[threat.latitude, threat.longitude]}
              radius={getMarkerSize(threat.totalCount)}
              pathOptions={{
                color: getMarkerColor(primarySeverity),
                fillColor: getMarkerColor(primarySeverity),
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold mb-2">{threat.country}</h3>
                  <div className="space-y-1 text-sm">
                    <div>Total Threats: {threat.totalCount}</div>
                    <div>
                      <div className="font-medium">By Severity:</div>
                      {Object.entries(threat.severities).map(([severity, count]) => (
                        <div key={severity} className="ml-2">
                          <span className="capitalize">{severity}</span>: {count as number}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-medium">By Category:</div>
                      {Object.entries(threat.categories).map(([category, count]) => (
                        <div key={category} className="ml-2">
                          <span className="capitalize">{category}</span>: {count as number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ThreatMap;