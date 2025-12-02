export interface Coordinate {
  lat: number;
  long: number;
}

export interface SolarProject {
  id: string;
  name: string;
  location: string;
  stateCode: string; // Used for map coloring logic (e.g., 'CA', 'TX')
  capacityMW: number;
  coordinates: Coordinate;
  imageUrl: string;
}

export interface MapTopology {
  type: string;
  objects: {
    states: {
      type: string;
      geometries: Array<{
        type: string;
        id: string; // FIPS code or Name
        properties: {
          name: string;
        };
      }>;
    };
  };
  arcs: number[][][];
  transform: {
    scale: number[];
    translate: number[];
  };
}