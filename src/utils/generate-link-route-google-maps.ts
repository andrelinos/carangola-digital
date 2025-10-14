export function generateGoogleMapsLinkByAddress(address: string): string {
  if (!address) return '';

  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

export function generateGoogleMapsLinkByCoords({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

