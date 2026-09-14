module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start",
      url: ["http://localhost:3000/"],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}