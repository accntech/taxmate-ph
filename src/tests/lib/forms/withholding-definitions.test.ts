import { describe, expect, it } from "vitest";
import { getFormDefinition } from "$lib/forms";

describe("withholding catalogue coverage", () => {
  it("makes each selectable packaged withholding revision available", () => {
    for (const code of [
      "0605",
      "0619E",
      "0619F",
      "1600",
      "1600PTv2018",
      "1600VTv2018",
      "1600WP",
      "1601C",
      "1601Cv2018",
      "1601E",
      "1601F",
      "1601FQ",
      "1602",
      "1602Qv2018",
      "1603",
      "1603Qv2018",
      "1604C",
      "1604CF",
      "1604E",
      "1604Ev2018",
      "1604F",
      "1606",
    ]) {
      expect(getFormDefinition(code), code).toBeDefined();
    }
  });
  it("does not expose inactive templates as selectable forms", () => {
    expect(getFormDefinition("0620")).toBeUndefined();
    expect(getFormDefinition("1621")).toBeUndefined();
  });
});
