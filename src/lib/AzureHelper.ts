import {OCRResponse} from 'model';
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
  const fileName = new Date().toISOString().replace(/:/g, '-');
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

export async function analyzeImageWithAzureOCR(
  imageUrl: string,
  endpoint: string,
  apiKey: string,
  features?: string[],
  language: string = 'ja',
  modelVersion: string = 'latest',
  smartCropsAspectRatios?: number[],
  genderNeutralCaption: boolean = false,
): Promise<OCRResponse> {
  const url = `${endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01`;

  // Prepare request body and headers
  const requestBody = {
    url: imageUrl,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': apiKey,
  };

  // Prepare query parameters
  const queryParams: string[] = [];
  if (features) {
    queryParams.push(`features=${features.join(',')}`);
  }
  if (modelVersion) {
    queryParams.push(`model-version=${modelVersion}`);
  }
  if (language) {
    queryParams.push(`language=${language}`);
  }
  if (smartCropsAspectRatios) {
    queryParams.push(
      `smartcrops-aspect-ratios=${smartCropsAspectRatios.join(',')}`,
    );
  }
  if (genderNeutralCaption) {
    queryParams.push(`gender-neutral-caption=${genderNeutralCaption}`);
  }

  // Final URL with query params
  const finalUrl = `${url}&${queryParams.join('&')}`;

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Failed to analyze image with status: ${response.status}`);
      return null;
    }

    const data: OCRResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Azure OCR API:', error);
    return null;
  }
}
