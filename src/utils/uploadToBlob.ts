import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

const containerName = process.env.AZURE_STORAGE_CONTAINER || 'airbnb-images';

// Simple fallback for local development without Azure
export async function uploadToBlob(file: File): Promise<string> {
  if (!process.env.AZURE_STORAGE_ACCOUNT && !process.env.AZURE_STORAGE_CONNECTION_STRING) {
    // For demo purposes, return a placeholder URL
    // In production, you'd want to implement local file storage
    const fileName = `${uuidv4()}-${file.name}`;
    return `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;
  }

  try {
    let blobServiceClient: BlobServiceClient;
    
    // Use connection string if available, otherwise fall back to SAS token
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    } else {
      blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net${process.env.AZURE_STORAGE_SAS_TOKEN}`
      );
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Ensure container exists and is publicly accessible
    try {
      await containerClient.createIfNotExists({
        access: 'blob' // This makes blobs publicly readable
      });
    } catch (containerError) {
      console.log('Container already exists or creation failed:', containerError);
    }
    
    const fileName = `${uuidv4()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file.type
      }
    });

    const imageUrl = blockBlobClient.url;
    console.log('Image uploaded successfully:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading to Azure Blob Storage:', error);
    throw new Error('Failed to upload image');
  }
}
