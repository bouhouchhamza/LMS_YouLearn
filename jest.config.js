export default {
  projects: [
    {
      displayName: "email",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/email*.test.js", "<rootDir>/tests/emailTemplatesTest.js"],
    },
    {
      displayName: "integration",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/**/*.test.js"],
      testPathIgnorePatterns: ["/node_modules/", "[/\\\\]email[^/\\\\]*\\.test\\.js$"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    },
  ],
};
