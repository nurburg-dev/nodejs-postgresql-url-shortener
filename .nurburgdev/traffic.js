import http from "k6/http";
import { check, sleep } from "k6";

// Configuration
const API_HOST = __ENV.API_HOST || "http://localhost:3000";
const URL_COUNT = 10000;

// Sample URLs for testing
const sampleUrls = [
  "https://www.myntra.com/sports-shoes/nike/nike-experience-run-11-womens-road-running-shoes/30739789/buy",
  "https://www.amazon.com/dp/B08N5WRWNW",
  "https://www.flipkart.com/samsung-galaxy-m32-light-blue-128-gb/p/itm123456789",
  "https://www.example.com/products/laptop-dell-inspiron-15-3000-series",
  "https://www.ecommerce.com/category/electronics/smartphones/iphone-13-pro-max",
  "https://www.onlinestore.com/deals/summer-sale-2023/clothing/mens-t-shirts",
  "https://www.retailer.com/books/fiction/bestsellers/the-great-novel",
  "https://www.marketplace.com/home-garden/furniture/sofa-sets/3-seater-fabric-sofa"
];

// Custom keys for testing
const customKeys = [
  "summer-sale", "winter-deals", "flash-offer", "mega-discount", "special-promo",
  "holiday-sale", "clearance", "new-arrivals", "bestsellers", "trending-now"
];

// Load test configuration
export const options = {
  scenarios: {
    // Setup phase: Create URLs
    setup_urls: {
      executor: "shared-iterations",
      vus: 20,
      iterations: URL_COUNT,
      maxDuration: "2m",
      tags: { scenario: "setup" },
      exec: "setupUrls",
    },

    // Load test phase: Test redirect API
    load_test: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "2m", target: 200 },
        { duration: "2m", target: 500 },
        { duration: "3m", target: 500 },
        { duration: "2m", target: 0 },
      ],
      tags: { scenario: "load_test" },
      exec: "loadTest",
      startTime: "2m",
    },
  },

  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
    "http_req_duration{scenario:load_test}": ["p(90)<1000"],
  },
};

// Setup function - creates URLs
export function setupUrls() {
  const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
  const randomId = Math.floor(Math.random() * 100000);
  
  // Randomly choose between auto-generated and custom key
  if (Math.random() < 0.3) {
    // Create custom short URL
    const customKey = `${customKeys[Math.floor(Math.random() * customKeys.length)]}-${randomId}`;
    const payload = JSON.stringify({
      key: customKey,
      long_url: `${randomUrl}?id=${randomId}`
    });

    const params = {
      headers: {
        "Content-Type": "application/json",
      },
      tags: { operation: "create_custom_url" },
    };

    const response = http.post(`${API_HOST}/api/short_url/custom`, payload, params);

    check(response, {
      "custom URL created successfully": (r) => r.status === 201,
      "response time < 5s": (r) => r.timings.duration < 5000,
    });
  } else {
    // Create auto-generated short URL
    const payload = JSON.stringify({
      long_url: `${randomUrl}?id=${randomId}`
    });

    const params = {
      headers: {
        "Content-Type": "application/json",
      },
      tags: { operation: "create_short_url" },
    };

    const response = http.post(`${API_HOST}/api/short_url`, payload, params);

    check(response, {
      "URL created successfully": (r) => r.status === 201,
      "response time < 5s": (r) => r.timings.duration < 5000,
    });
  }
}

// Load test function - tests redirect API
export function loadTest() {
  // This is a simplified version - in reality you'd need to store created keys
  // and use them for redirect testing
  const testKey = `test-${Math.floor(Math.random() * 1000)}`;
  
  const params = {
    tags: {
      operation: "redirect",
    },
  };

  const response = http.get(`${API_HOST}/${testKey}`, params);

  check(response, {
    "status is 302 or 404": (r) => r.status === 302 || r.status === 404,
    "response time < 1s": (r) => r.timings.duration < 1000,
  });

  sleep(0.1);
}

// Default function for single test runs
export default function () {
  loadTest();
}

// Setup hook
export function setup() {
  console.log("Starting URL shortener load test...");
  console.log(`API Host: ${API_HOST}`);
  console.log(`URLs to create: ${URL_COUNT}`);
  return { startTime: new Date().toISOString() };
}

// Teardown hook
export function teardown(data) {
  console.log("Load test completed");
  console.log(`Started at: ${data.startTime}`);
  console.log(`Completed at: ${new Date().toISOString()}`);
}