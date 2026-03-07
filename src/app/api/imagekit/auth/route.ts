import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET() {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: 'https://ik.imagekit.io/ilk0tj3rj',
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error: any) {
    console.error('[ImageKit Auth Error]', error);
    let errorMessage = 'Failed to get ImageKit auth params.';
    if (error.message && (error.message.includes('publicKey') || error.message.includes('privateKey') || error.message.includes('urlEndpoint'))) {
      errorMessage = 'ImageKit initialization failed. Ensure environment variables (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY) are set correctly on your hosting provider.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
