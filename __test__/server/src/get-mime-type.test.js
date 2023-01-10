import { getMimeType } from "@server/src/get-mime-type.js";

test("get-mime-type.js", () => {
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
    expect(getMimeType(["a.wasm"])).toBe("application/wasm");
    expect(getMimeType(["a.txt"])).toBe("text/plain");
    expect(getMimeType(["a.xml"])).toBe("text/xml");
    expect(getMimeType(["a.woff"])).toBe("font/woff");
    expect(getMimeType(["a.woff2"])).toBe("font/woff2");
    expect(getMimeType(["a.ttf"])).toBe("font/ttf");
    expect(getMimeType(["a.eot"])).toBe("application/vnd.ms-fontobject");
    expect(getMimeType(["a.otf"])).toBe("font/otf");
    expect(getMimeType(["a.7z"])).toBe("application/x-7z-compressed");
    expect(getMimeType(["a.ace"])).toBe("application/x-ace-compressed");
    expect(getMimeType(["a.arc"])).toBe("application/x-freearc");
    expect(getMimeType(["a.arj"])).toBe("application/arj");
    expect(getMimeType(["a.bz"])).toBe("application/x-bzip");
    expect(getMimeType(["a.bz2"])).toBe("application/x-bzip2");
    expect(getMimeType(["a.cab"])).toBe("application/vnd.ms-cab-compressed");
    expect(getMimeType(["a.cbr"])).toBe("application/x-cbr");
    expect(getMimeType(["a.cbt"])).toBe("application/x-cbt");
    expect(getMimeType(["a.cbz"])).toBe("application/x-cbz");
    expect(getMimeType(["a.ccp"])).toBe("application/x-cbr");
    expect(getMimeType(["a.cpio"])).toBe("application/x-cpio");
    expect(getMimeType(["a.deb"])).toBe("application/x-debian-package");
  })
})
