import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'ImageKit features are disabled.' },
    { status: 404 }
  );
}
