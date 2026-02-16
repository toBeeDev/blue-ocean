/**
 * lat/lng → OpenStreetMap 타일 좌표 변환
 */
export function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) +
          1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );
  return { x, y };
}

/**
 * 수영장 좌표 기반 지도 타일 URL 생성
 * 줌 레벨 15 ≈ 약 1km 범위
 */
export function getMapTileUrl(lat: number, lng: number, zoom = 15) {
  const { x, y } = latLngToTile(lat, lng, zoom);
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

/**
 * 2x2 타일 그리드 URL 생성 (더 넓은 지도 영역)
 */
export function getMapTileGrid(lat: number, lng: number, zoom = 15) {
  const { x, y } = latLngToTile(lat, lng, zoom);
  return [
    { url: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`, col: 0, row: 0 },
    { url: `https://tile.openstreetmap.org/${zoom}/${x + 1}/${y}.png`, col: 1, row: 0 },
    { url: `https://tile.openstreetmap.org/${zoom}/${x}/${y + 1}.png`, col: 0, row: 1 },
    { url: `https://tile.openstreetmap.org/${zoom}/${x + 1}/${y + 1}.png`, col: 1, row: 1 },
  ];
}
