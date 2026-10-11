import { NextResponse } from 'next/server';

// This route lets the UI POST new custom GIS markers that are stored in memory
// (for the current server session — they merge with the static mapData.ts geopoints)
const customMarkers: any[] = [];

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const markers = customMarkers.filter((m) => m.caseId === params.id);
    return NextResponse.json({ success: true, data: markers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const marker = {
      id: `custom-geo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseId: params.id,
      title: body.title || 'Custom Location',
      category: body.category || 'crime_scene',
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      locationName: body.locationName || body.address || '',
      timestamp: body.timestamp || new Date().toISOString(),
      description: body.description || '',
      evidenceRef: body.evidenceRef || 'Manually added by IO',
      sourceType: 'Manual Entry (IO)',
      photoUrl: body.photoUrl || null,
      disputed: body.disputed || false,
    };
    if (isNaN(marker.latitude) || isNaN(marker.longitude)) {
      return NextResponse.json({ success: false, error: 'Valid latitude and longitude are required' }, { status: 400 });
    }
    customMarkers.push(marker);
    return NextResponse.json({ success: true, data: marker }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
