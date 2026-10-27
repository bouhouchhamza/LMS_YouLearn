
import { describe, it, expect } from "@jest/globals";
import { enrollmentEmailTemplate } from "../src/services/email/emailTemplates.js";

describe("Enrollment Email Template", () => {
  it("should generate subject, text and HTML", async () => {
    const result = await enrollmentEmailTemplate(
      "Hamza",
      "Node.js Fundamentals"
    );

    expect(result.subject).toContain("Node.js Fundamentals");
    expect(result.text).toContain("Hamza");
    expect(result.html).toContain("Hamza");
    expect(result.html).toContain("Node.js Fundamentals");
    expect(result.html).not.toContain("{{learnerName}}");
  });

  it("should escape unsafe HTML in learner name", async () => {
    const result = await enrollmentEmailTemplate(
      "<script>alert(1)</script>",
      "Node.js"
    );

    expect(result.html).not.toContain("<script>");
    expect(result.html).toContain("&lt;script&gt;");
  });
});

it('escapes both user-controlled HTML fields', async () => {
  const result = await enrollmentEmailTemplate('<img src=x onerror=alert(1)>', '<script>course</script>');
  expect(result.html).not.toContain('<img');
  expect(result.html).not.toContain('<script>');
  expect(result.html).toContain('&lt;img');
  expect(result.html).toContain('&lt;script&gt;course&lt;/script&gt;');
  expect(result.html).not.toMatch(/{{.*}}/);
});
