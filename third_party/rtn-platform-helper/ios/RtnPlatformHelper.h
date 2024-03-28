
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRtnPlatformHelperSpec.h"

@interface RtnPlatformHelper : NSObject <NativeRtnPlatformHelperSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RtnPlatformHelper : NSObject <RCTBridgeModule>
#endif

@end
