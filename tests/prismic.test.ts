import * as prismicModule from "../src/lib/prismic";
import * as prismic from "@prismicio/client";
import {
  jest,
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
} from "@jest/globals";

jest.mock("@prismicio/client");
const mockCreateWriteClient = prismic.createWriteClient as jest.Mock;
const mockCreateMigration = prismic.createMigration as jest.Mock;

describe("formatKeyTakeaways", () => {
  const { formatKeyTakeaways } = jest.requireActual(
    "../src/lib/prismic"
  ) as typeof prismicModule;

  it("formats an array of strings into the expected structure", () => {
    const input = ["Takeaway 1", "Takeaway 2"];
    const result = formatKeyTakeaways(input);
    expect(result).toEqual([
      { takeaway: [{ type: "paragraph", text: "Takeaway 1" }] },
      { takeaway: [{ type: "paragraph", text: "Takeaway 2" }] },
    ]);
  });

  it("returns an empty array when given an empty array", () => {
    expect(formatKeyTakeaways([])).toEqual([]);
  });
});
