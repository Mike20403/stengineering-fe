// type TestResponse =
//   | {
//     data: string;
//     error?: undefined;
//   }
//   | {
//     data?: undefined;
//     error: string;
//   };

// type TestDataResponse =
//
// Exclude<TestResponse, {error: string}>;
//
// const isTestDataResponse = (res: TestResponse): res is TestDataResponse {
//   return res.data !== undefined;
// }
//
// const test() {
//   const a = {
//     data: 'aaa',
//   }
//
//   if (isTestDataResponse(a)) {
//     const b = a
//   }
// }
