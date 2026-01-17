#!/usr/bin/env node

/**
 * Test Authentication API
 * Tests NextAuth credentials flow via API calls
 */

const http = require('http');

const BASE_URL = process.argv[2] || 'http://localhost:4000';
const EMAIL = process.argv[3] || 'khoahocgiare.info@gmail.com';
const PASSWORD = process.argv[4] || 'Nguyenhuuthanga3@';

console.log('\n🧪 Testing Authentication API');
console.log('='.repeat(60));
console.log(`Base URL: ${BASE_URL}`);
console.log(`Email: ${EMAIL}`);
console.log(`Password: ${'*'.repeat(PASSWORD.length)}`);
console.log('='.repeat(60));

// Helper function to make HTTP requests
function request(method, path, data = null, cookies = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(cookieString && { Cookie: cookieString }),
      },
    };

    if (data) {
      const dataString = typeof data === 'string' ? data : new URLSearchParams(data).toString();
      options.headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      const responseCookies = {};

      // Parse cookies from response
      if (res.headers['set-cookie']) {
        res.headers['set-cookie'].forEach((cookie) => {
          const [keyValue] = cookie.split(';');
          const [key, value] = keyValue.split('=');
          if (key && value) {
            responseCookies[key.trim()] = value.trim();
          }
        });
      }

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: responseCookies,
          data: responseData,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      const dataString = typeof data === 'string' ? data : new URLSearchParams(data).toString();
      req.write(dataString);
    }

    req.end();
  });
}

async function testAuth() {
  try {
    console.log('\n📋 Step 1: Get CSRF Token');
    console.log('-'.repeat(60));

    // Step 1: Get CSRF token
    const csrfResponse = await request('GET', '/api/auth/csrf');
    
    if (csrfResponse.status !== 200) {
      console.error(`❌ Failed to get CSRF token: ${csrfResponse.status}`);
      console.error('Response:', csrfResponse.data);
      process.exit(1);
    }

    let csrfToken;
    try {
      const csrfData = JSON.parse(csrfResponse.data);
      csrfToken = csrfData.csrfToken;
      console.log(`✅ CSRF Token received: ${csrfToken.substring(0, 20)}...`);
    } catch (error) {
      console.error('❌ Failed to parse CSRF response:', error);
      console.error('Response:', csrfResponse.data);
      process.exit(1);
    }

    console.log('\n📋 Step 2: Get Session (should be null)');
    console.log('-'.repeat(60));

    // Step 2: Check current session (should be null)
    const sessionResponse = await request('GET', '/api/auth/session', null, csrfResponse.cookies);
    let sessionData;
    try {
      sessionData = JSON.parse(sessionResponse.data);
      console.log(`Status: ${sessionResponse.status}`);
      console.log(`Session: ${sessionData?.user ? '✅ Active' : '❌ None'}`);
      if (sessionData?.user) {
        console.log(`  User: ${sessionData.user.email}`);
        console.log(`  Role: ${sessionData.user.role}`);
      }
    } catch (error) {
      console.log(`Status: ${sessionResponse.status}`);
      console.log('Session: ❌ None (or invalid JSON)');
    }

    console.log('\n📋 Step 3: Attempt Login');
    console.log('-'.repeat(60));

    // Step 3: Attempt login
    const loginData = {
      email: EMAIL,
      password: PASSWORD,
      csrfToken: csrfToken,
      json: 'true',
      redirect: 'false',
    };

    const loginResponse = await request(
      'POST',
      '/api/auth/callback/credentials',
      loginData,
      csrfResponse.cookies
    );

    console.log(`Status: ${loginResponse.status}`);
    
    // Check for redirect
    if (loginResponse.status === 302 || loginResponse.status === 307) {
      const location = loginResponse.headers.location || loginResponse.headers.Location;
      console.log(`⚠️  Redirect detected (${loginResponse.status})`);
      if (location) {
        console.log(`   Location: ${location}`);
      }
    }
    
    try {
      const loginResult = JSON.parse(loginResponse.data);
      console.log('Response:', JSON.stringify(loginResult, null, 2));
      
      if (loginResult.error) {
        console.log(`❌ Login failed: ${loginResult.error}`);
        console.log(`   Error code: ${loginResult.code || 'N/A'}`);
      } else if (loginResult.url) {
        console.log(`✅ Login successful! Redirect URL: ${loginResult.url}`);
      } else if (loginResult.ok) {
        console.log('✅ Login successful!');
      } else {
        console.log('⚠️  Unexpected response format');
      }
    } catch (error) {
      if (loginResponse.data && loginResponse.data.length > 0) {
        console.log('Response (text):', loginResponse.data.substring(0, 200));
      } else {
        console.log('Response: (empty)');
      }
    }

    // Merge cookies from all responses
    const allCookies = { ...csrfResponse.cookies, ...loginResponse.cookies };
    console.log(`\nCookies collected: ${Object.keys(allCookies).length} cookie(s)`);

    console.log('\n📋 Step 4: Check Session After Login');
    console.log('-'.repeat(60));

    // Step 4: Check session after login
    const sessionAfterResponse = await request('GET', '/api/auth/session', null, allCookies);
    
    try {
      const sessionAfter = JSON.parse(sessionAfterResponse.data);
      console.log(`Status: ${sessionAfterResponse.status}`);
      
      if (sessionAfter?.user) {
        console.log('✅ Session is active!');
        console.log(`  User ID: ${sessionAfter.user.id}`);
        console.log(`  Email: ${sessionAfter.user.email}`);
        console.log(`  Role: ${sessionAfter.user.role}`);
        console.log(`  Name: ${sessionAfter.user.name || 'N/A'}`);
      } else {
        console.log('❌ Session is not active');
        console.log('Response:', sessionAfter);
      }
    } catch (error) {
      console.log(`Status: ${sessionAfterResponse.status}`);
      console.log('Response (text):', sessionAfterResponse.data.substring(0, 200));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    if (loginResponse.status === 200) {
      console.log('✅ Authentication flow completed');
      console.log('   - CSRF token: ✅ Received');
      console.log('   - Login request: ✅ Sent');
      console.log('   - Response status: ✅ 200');
    } else {
      console.log('❌ Authentication flow failed');
      console.log(`   - Login response status: ${loginResponse.status}`);
    }

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testAuth();
