import { describe, expect, test } from "bun:test";

describe("mobile claim lodgement mapping", () => {
  test("maps the existing four-step form into the OWC claim contract", async () => {
    let mod: Record<string, unknown> = {};
    try {
      mod = await import("./claim-lodgement");
    } catch {
      // RED phase: production mapper intentionally does not exist yet.
    }

    const build = mod.buildClaimLodgementInput as
      | undefined
      | ((form: Record<string, string>, documentCount: number, declaration: boolean) => Record<string, unknown>);

    const result = build?.(
      {
        name: "Mara Kila",
        phone: "+67570000001",
        email: "mara@example.com",
        employer: "Pacific Engineering Ltd",
        occupation: "Heavy Equipment Operator",
        province: "National Capital District",
        wage: "1200",
        idate: "2026-09-10",
        itype: "Crush injury",
        location: "Port Moresby Operations Site",
        desc: "Injured while operating equipment.",
      },
      2,
      true,
    );

    expect(result?.workerName).toBe("Mara Kila");
    expect(result?.employerName).toBe("Pacific Engineering Ltd");
    expect(result?.documentCount).toBe(2);
    expect(result?.declaration).toBe(true);
    expect(String(result?.description)).toBe(
      "Injured while operating equipment. Location: Port Moresby Operations Site",
    );
  });
});
