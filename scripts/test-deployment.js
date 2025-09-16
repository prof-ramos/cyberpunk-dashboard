#!/usr/bin/env node

/**
 * Deployment Test Script
 * Run this script to validate deployment readiness
 *
 * Usage: node scripts/test-deployment.js [base-url] [admin-key]
 */

const https = require("https")
const http = require("http")

class DeploymentTester {
  constructor(baseUrl, adminKey) {
    this.baseUrl = baseUrl || "http://localhost:3000"
    this.adminKey = adminKey || process.env.ADMIN_API_KEY
    this.results = []
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl)
      const client = url.protocol === "https:" ? https : http

      const requestOptions = {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      }

      const req = client.request(url, requestOptions, (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => {
          try {
            const jsonData = data ? JSON.parse(data) : {}
            resolve({ status: res.statusCode, data: jsonData, headers: res.headers })
          } catch (e) {
            resolve({ status: res.statusCode, data: data, headers: res.headers })
          }
        })
      })

      req.on("error", reject)

      if (options.body) {
        req.write(JSON.stringify(options.body))
      }

      req.end()
    })
  }

  async testEndpoint(name, path, expectedStatus = 200, options = {}) {
    console.log(`Testing ${name}...`)

    try {
      const response = await this.makeRequest(path, options)
      const success = response.status === expectedStatus

      this.results.push({
        name,
        path,
        success,
        status: response.status,
        expected: expectedStatus,
        data: response.data,
      })

      console.log(`  ${success ? "✅" : "❌"} ${name}: ${response.status} (expected ${expectedStatus})`)

      if (!success && response.data?.error) {
        console.log(`     Error: ${response.data.error}`)
      }

      return success
    } catch (error) {
      console.log(`  ❌ ${name}: ${error.message}`)
      this.results.push({
        name,
        path,
        success: false,
        error: error.message,
      })
      return false
    }
  }

  async runTests() {
    console.log(`🚀 Testing deployment at: ${this.baseUrl}\n`)

    // Test 1: Health check
    await this.testEndpoint("Health Check", "/api/health")

    // Test 2: Database status (requires admin key)
    if (this.adminKey) {
      await this.testEndpoint("Database Status", "/api/admin/database-status", 200, {
        headers: { "x-admin-key": this.adminKey },
      })

      // Test 3: Deployment status
      await this.testEndpoint("Deployment Status", "/api/admin/deployment-status", 200, {
        headers: { "x-admin-key": this.adminKey },
      })

      // Test 4: API key generation
      await this.testEndpoint("API Key Generation", "/api/admin/api-keys", 200, {
        method: "POST",
        headers: { "x-admin-key": this.adminKey },
        body: {
          name: "Test Key",
          permissions: ["webhook.receive"],
          expires_in_days: 1,
        },
      })
    } else {
      console.log("⚠️  Skipping admin tests (no admin key provided)")
    }

    // Test 5: Webhook endpoint (should fail without API key)
    await this.testEndpoint("Webhook Endpoint (no auth)", "/api/webhooks/receive", 401, {
      method: "POST",
      body: {
        event_type: "test.deployment",
        source: "test",
        data: { test: true },
      },
    })

    // Test 6: API documentation
    await this.testEndpoint("API Documentation", "/api-docs")

    // Summary
    console.log("\n📊 Test Summary:")
    const passed = this.results.filter((r) => r.success).length
    const total = this.results.length

    console.log(`  Passed: ${passed}/${total}`)
    console.log(`  Success Rate: ${Math.round((passed / total) * 100)}%`)

    if (passed === total) {
      console.log("\n🎉 All tests passed! Deployment is ready.")
      process.exit(0)
    } else {
      console.log("\n❌ Some tests failed. Check the issues above.")
      process.exit(1)
    }
  }
}

// Run tests
const baseUrl = process.argv[2]
const adminKey = process.argv[3]

const tester = new DeploymentTester(baseUrl, adminKey)
tester.runTests().catch(console.error)
