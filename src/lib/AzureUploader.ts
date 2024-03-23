import {Platform} from 'react-native';
import Upload from 'react-native-background-upload';
import type {UploadOptions as BackgroundUploadOptions} from 'react-native-background-upload';

interface AzureUploadOptions {
  photoUri: string;
  containerName: string;
  accountName: string;
  sasToken: string;
  versionCode: string;
}

export const uploadPhotoToAzureBlobStorage = async ({
  photoUri,
  accountName,
  containerName,
  sasToken,
  versionCode, // api version code
}: AzureUploadOptions) => {
  const fileName = new Date().getMilliseconds().toString();
  const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}.jpeg?${sasToken}`;

  // Note: For iOS, the file URI should be prefixed with 'file://'.
  const uriPrefix = Platform.OS === 'ios' ? 'file://' : '';
  const photoUriWithPrefix = `${uriPrefix}${photoUri}`;

  try {
    const options: BackgroundUploadOptions = {
      url: uploadUrl,
      path: photoUriWithPrefix,
      method: 'PUT',
      type: 'raw',
      headers: {
        'x-ms-version': versionCode,
        'Content-Type': 'image/jpeg', // Adjust the content type based on your file type
        'x-ms-blob-type': 'BlockBlob',
      },
      notification: {
        enabled: false,
      },
    };

    const uploadId = await Upload.startUpload(options);
    console.log(`[AzureUploader] Upload started with ID: ${uploadId}`);

    Upload.addListener('progress', uploadId, data => {
      console.log(`[AzureUploader] Progress: ${data.progress}%`);
    });

    Upload.addListener('error', uploadId, data => {
      console.error(`[AzureUploader] Error: ${JSON.stringify(data)}`);
    });

    Upload.addListener('completed', uploadId, data => {
      console.log('AzureUploader] Upload completed!' + data);
    });
  } catch (error) {
    console.error('[AzureUploader] Upload failed', error);
  }
};
