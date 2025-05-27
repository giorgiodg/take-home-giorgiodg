import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { truncateToTokenLimit } from "../src/lib/ai";

// Mock config and tiktoken
jest.mock("../src/config", () => ({
  config: {
    openAi: {
      model: "gpt-4",
      apiKey: "sdasda",
    },
  },
}));

const fakeEncode = jest.fn();
const fakeDecode = jest.fn();

jest.mock("tiktoken", () => ({
  encoding_for_model: jest.fn(() => ({
    encode: fakeEncode,
    decode: fakeDecode,
  })),
}));

describe("truncateToTokenLimit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the original text if token count is within the limit", () => {
    fakeEncode.mockReturnValue([1, 2, 3]);
    const text = "short text";
    const limit = 5;
    const result = truncateToTokenLimit(text, limit);
    expect(result).toBe(text);
    expect(fakeEncode).toHaveBeenCalledWith(text);
  });

  it("truncates the text if token count exceeds the limit", () => {
    const text = "long text";
    const encoded = [1, 2, 3, 4, 5, 6, 7];
    fakeEncode.mockReturnValue(encoded);
    fakeDecode.mockReturnValue(Uint8Array.from([108, 111, 110, 103])); // "long"
    const limit = 4;
    const result = truncateToTokenLimit(text, limit);
    expect(fakeEncode).toHaveBeenCalledWith(text);
    expect(fakeDecode).toHaveBeenCalledWith(encoded.slice(0, limit));
    expect(result).toBe("long");
  });

  it("returns an empty string if limit is zero", () => {
    const text = "something";
    const encoded = [1, 2, 3];
    fakeEncode.mockReturnValue(encoded);
    fakeDecode.mockReturnValue(Uint8Array.from([]));
    const result = truncateToTokenLimit(text, 0);
    expect(result).toBe("");
  });

  it("handles non-ASCII characters", () => {
    const text = "你好世界";
    const encoded = [10, 20, 30, 40];
    fakeEncode.mockReturnValue(encoded);
    fakeDecode.mockReturnValue(Buffer.from("你好"));
    const limit = 2;
    const result = truncateToTokenLimit(text, limit);
    expect(result).toBe("你好");
  });
});
