export interface GeoJSON {
  type: string,
  geometry: {
    type: string,
    coordinates: number[]
  },
  properties: {
    map: string,
    name: string,
    minZoom: string,
    maxZoom: string,
    url: string,
    desc: string
  }
}
