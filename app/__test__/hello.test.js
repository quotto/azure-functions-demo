const hello = require("../hello/index.js");

describe("hello", () => {
    const context = { log: (message) => console.log(message) };
    it("パラメータnameがクエリに設定されている", async () => {
        await hello(context, { query: { name: "john" } });
        expect(context.res.body).toBe("Hello, john. This HTTP triggered function executed successfully.");
    });
    it("パラメータnameがリクエストボディに設定されている", async () => {
        await hello(context, { query: {}, body: { name: "john" } });
        expect(context.res.body).toBe("Hello, john. This HTTP triggered function executed successfully.");
    });
    it("パラメータnameがクエリにもリクエストボディに設定されている場合はクエリが優先される", async () => {
        await hello(context, { query: { name: "john" }, body: { name: "mike" } });
        expect(context.res.body).toBe("Hello, john. This HTTP triggered function executed successfully.");
    });
    it("パラメータnameクエリにもリクエストボディにも設定されていない", async () => {
        await hello(context, { query: {}, body: {}});
        expect(context.res.body).toBe("This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.");
    })
});