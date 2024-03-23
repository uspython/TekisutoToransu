jest.mock('react-native-background-upload', () => {
  return {
    startUpload: jest.fn(),
    addListener: jest.fn((event, uploadId, callback) => {
      switch (event) {
        case 'progress':
          callback({progress: 50}); // Simulate progress
          break;
        case 'error':
          callback({error: 'Test error'}); // Simulate an error
          break;
        case 'completed':
          callback({}); // Simulate successful completion
          break;
      }
    }),
  };
});
