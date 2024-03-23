import {uploadPhotoToAzureBlobStorage} from './AzureUploader';
import Upload from 'react-native-background-upload';

describe('uploadPhoto', () => {
  it('successfully uploads a photo', async () => {
    const fileUri = 'path/to/photo.jpg';
    const blobStorageUrl = 'your_azure_blob_storage_url';

    // Mock any additional functionality as needed, e.g., generating SAS tokens
    await expect(
      uploadPhotoToAzureBlobStorage(fileUri, blobStorageUrl),
    ).resolves.toEqual('uploadId');

    // Ensure startUpload was called with the expected parameters
    expect(Upload.startUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        path: fileUri,
        // Add any other parameters you expect to be passed to startUpload
      }),
    );
  });

  // You can add more tests here to cover failure cases, different input parameters, etc.
});
