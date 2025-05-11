export async function POST(req) {
    const { origin, destination, mode } = await req.json();
  
    const key = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${mode}&key=${key}`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    if (data.status !== 'OK') {
      return Response.json({ error: data.status }, { status: 500 });
    }
  
    const route = data.routes[0].legs[0];
    return Response.json({
      distance: route.distance.text,
      duration: route.duration.text,
      summary: data.routes[0].summary,
    });
  }
  