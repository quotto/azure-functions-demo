const hello = require("../hello/index.js");

describe("hello", () => {
   it ("パラメータnameが設定されている",async ()=>{
       const context = { log: (message) => console.log(message) };
       await hello(context, { query: {name: "john" }});
       expect(context.res.body).toBe("Hello, john. This HTTP triggered function executed successfully.");
   });
});