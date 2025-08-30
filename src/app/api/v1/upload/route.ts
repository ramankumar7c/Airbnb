import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob } from '@/utils/uploadToBlob';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    // Check if the file is actually a File object
    if (!(file instanceof File)) {
      return new NextResponse('Invalid file type', { status: 400 });
    }

    const url = await uploadToBlob(file);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('UPLOAD_ERROR', error);
    return new NextResponse('Upload failed', { status: 500 });
  }
}
