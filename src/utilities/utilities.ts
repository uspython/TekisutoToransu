import {
  PermissionHelper,
  PreferenceKey,
  PreloadPreferencesList,
  SimpleStorage,
  analyzeImageWithAzureOCR,
  uploadPhotoToAzureBlobStorage,
} from 'lib';
import {Platform} from 'react-native';
import mobileAds, {
  MaxAdConten,
  MaxAdContentRating,
  Rating,
} from 'react-native-google-mobile-ads';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {OCRResponse} from 'model';
import RtnPlatformHelper from 'rtn-platform-helper';
import Upload from 'react-native-background-upload';

export async function InitAds() {
  console.log('InitAds');
  const initAd = async () => {
    try {
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });
      await mobileAds().initialize();
      // Initialize the Ads SDK successfully.
      console.log('Ads SDK initialized successfully.');
    } catch (error) {
      console.log('Ads SDK failed to initialize.', error);
    }
  };

  if (Platform.OS === 'android') {
    await initAd();
  } else if (Platform.OS === 'ios') {
    PermissionHelper.requestATTPermission(initAd, err => {
      console.log('request ATT:' + err);
    });
  }
}

export async function checkLaunchCount(): Promise<number> {
  const countStr = await SimpleStorage.getAsync(
    PreferenceKey.APP_LAUNCH_COUNT,
    '0',
  );
  let count = countStr ? parseInt(countStr, 10) : 0;
  count = count + 1;
  SimpleStorage.saveForNow(PreferenceKey.APP_LAUNCH_COUNT, `${count}`);
  await SimpleStorage.save(PreferenceKey.APP_LAUNCH_COUNT, `${count}`);
  return count;
}

export async function loadAsyncStorage() {
  SimpleStorage.clear();
  await SimpleStorage.load(PreloadPreferencesList);
}

export async function handleResizeImage(
  imagePath: string,
  isRotationNeeded: boolean = true,
) {
  const resizeResp = await ImageResizer.createResizedImage(
    imagePath,
    1280,
    1280,
    'JPEG',
    70,
    isRotationNeeded ? 90 : 0,
    null,
    false,
    {mode: 'contain', onlyScaleDown: true},
  );

  return resizeResp.path;
}

export async function handleApiRequest(path: string): Promise<OCRResponse> {
  const {
    MSSubscriptionKey,
    MSEndPoint,
    BLOB_ACCOUNT_NAME,
    BLOB_CONTAINER_NAME,
    SAS_TOKEN,
    BLOB_VERSION_CODE,
  } = RtnPlatformHelper.getConstants();
  console.log('handleApiRequest', path);

  // upload to azure blob storage
  const [uploadId, uploadUrl] = await uploadPhotoToAzureBlobStorage({
    photoUri: path,
    accountName: BLOB_ACCOUNT_NAME,
    containerName: BLOB_CONTAINER_NAME,
    sasToken: SAS_TOKEN,
    versionCode: BLOB_VERSION_CODE,
  });

  // Wrap the upload listener in a Promise
  const uploadResult = new Promise<OCRResponse>((resolve, reject) => {
    // Adjust `OCRResponse` as needed
    Upload.addListener('progress', uploadId, data => {
      console.log(`[AzureUploader] Progress: ${data.progress}%`);
    });

    Upload.addListener('error', uploadId, data => {
      console.error(`[AzureUploader] Error: ${JSON.stringify(data)}`);
      reject(data);
    });

    Upload.addListener('completed', uploadId, async data => {
      console.log('[AzureUploader] Upload completed!', data);
      console.log(uploadUrl);

      try {
        const resp = await analyzeImageWithAzureOCR(
          uploadUrl,
          MSEndPoint,
          MSSubscriptionKey,
        );
        console.log(JSON.stringify(resp));
        resolve(resp); // Resolve the promise with the OCR analysis result
      } catch (error) {
        reject(error); // Reject the promise if OCR analysis fails
      }
    });
  });

  return uploadResult; // Return the promise
}

export function handleOcrResult(ocrResult: OCRResponse): {
  text: string;
  wordsArray: string[];
} {
  // Just return the first text
  // let texts = [];
  // for (let i = 0; i < ocrResult.readResult.blocks.length; i++) {
  //   const block = ocrResult.readResult.blocks[i];
  //   for (let j = 0; j < block.lines.length; j++) {
  //     const line = block.lines[j];
  //     texts.push(line.text);
  //   }
  // }

  // return all words
  let wordsArray: string[] = [];
  let retText = '';

  for (const block of ocrResult.readResult.blocks) {
    for (const line of block.lines) {
      for (const word of line.words) {
        // Only return words with high confidence
        if (word.confidence > 0.7) {
          const {text} = word;
          wordsArray.push(text);
          retText += text;
        }
      }
    }
  }

  return {text: retText, wordsArray};
}
