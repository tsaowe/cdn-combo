import { getMimeType } from "@server/src/get-mime-type.js";

//test suit
describe("get-mime-type.js", () => {
  it("getMimeType", () => {
    expect(getMimeType(["a.js"])).toBe("application/javascript");
    expect(getMimeType(["a.css"])).toBe("text/css");
    expect(getMimeType(["a.html"])).toBe("text/html");
    expect(getMimeType(["a.json"])).toBe("application/json");
    expect(getMimeType(["a.png"])).toBe("image/png");
    expect(getMimeType(["a.jpg"])).toBe("image/jpeg");
    expect(getMimeType(["a.jpeg"])).toBe("image/jpeg");
    expect(getMimeType(["a.gif"])).toBe("image/gif");
    expect(getMimeType(["a.svg"])).toBe("image/svg+xml");
    expect(getMimeType(["a.txt"])).toBe("text/plain");
  });
});
