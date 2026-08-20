#!/usr/bin/env python3
"""
Backend API tests for Vertex AI rebrand + Firebase swap.
Tests admin auth, user management, tier changes, and premium-gated signal endpoints.
"""

import requests
import json
from typing import Dict, Any, Optional

# Base URL from .env
BASE_URL = "https://lime-dark-ui.preview.emergentagent.com"

# Admin credentials from lib/server/admin-auth.ts
ADMIN_CREDS = {
    "username": "AYAN0004",
    "password": "SXON@TOP009",
    "secretKey": "sec_K9#mT4@Xv8!Qa2$Lf7&Np5^Hs1*Dz6%Rw3@Ju0#Ce9$By4&Gk8*Pm2^Yn5!Vo7"
}

WRONG_CREDS = {
    "username": "WRONG",
    "password": "WRONG",
    "secretKey": "WRONG"
}

# Test user in new Firebase project
TEST_USER_EMAIL = "trader@vertex.test"
TEST_USER_PASSWORD = "Test1234"
TEST_USER_UID = "y7D5CeA1roM59q5eZXmVU6rlChx2"

# Firebase Auth REST API
FIREBASE_API_KEY = "AIzaSyAFm1BmjxTKS6CzETCnEEMVlqKLn3hhrz8"
FIREBASE_AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"


def print_test_header(test_name: str):
    """Print a formatted test header."""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")


def print_result(endpoint: str, status: int, body: Any, cookies: Optional[Dict] = None):
    """Print test result in a formatted way."""
    print(f"\nEndpoint: {endpoint}")
    print(f"Status Code: {status}")
    if cookies:
        print(f"Cookies: {cookies}")
    print(f"Response Body: {json.dumps(body, indent=2) if isinstance(body, dict) else str(body)[:500]}")


def test_admin_login_success():
    """Test 1: POST /api/admin/login with correct credentials."""
    print_test_header("1. Admin Login - Success")
    
    url = f"{BASE_URL}/api/admin/login"
    try:
        response = requests.post(url, json=ADMIN_CREDS, timeout=10)
        cookies = dict(response.cookies)
        body = response.json()
        
        print_result("/api/admin/login (correct creds)", response.status_code, body, cookies)
        
        # Check for session cookie
        if response.status_code == 200 and body.get('ok') == True and 'sx_portal_session' in cookies:
            print("✅ SUCCESS: Login successful, session cookie 'sx_portal_session' set")
            return cookies.get('sx_portal_session')
        else:
            print(f"❌ FAIL: Expected 200 + ok:true + cookie, got status={response.status_code}, body={body}")
            return None
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None


def test_admin_login_failure():
    """Test 2: POST /api/admin/login with wrong credentials."""
    print_test_header("2. Admin Login - Failure (Wrong Credentials)")
    
    url = f"{BASE_URL}/api/admin/login"
    try:
        response = requests.post(url, json=WRONG_CREDS, timeout=10)
        body = response.json()
        print_result("/api/admin/login (wrong creds)", response.status_code, body)
        
        if response.status_code == 401:
            print("✅ SUCCESS: Correctly returned 401 for wrong credentials")
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


def test_admin_session_without_cookie():
    """Test 3: GET /api/admin/session without cookie."""
    print_test_header("3. Admin Session - Without Cookie")
    
    url = f"{BASE_URL}/api/admin/session"
    try:
        response = requests.get(url, timeout=10)
        body = response.json()
        print_result("/api/admin/session (no cookie)", response.status_code, body)
        
        if body.get('authed') == False:
            print("✅ SUCCESS: Correctly returned authed=false without cookie")
        else:
            print(f"❌ FAIL: Expected authed=false, got {body}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


def test_admin_session_with_cookie(session_cookie: str):
    """Test 4: GET /api/admin/session with valid cookie."""
    print_test_header("4. Admin Session - With Valid Cookie")
    
    url = f"{BASE_URL}/api/admin/session"
    try:
        cookies = {'sx_portal_session': session_cookie}
        response = requests.get(url, cookies=cookies, timeout=10)
        body = response.json()
        print_result("/api/admin/session (with cookie)", response.status_code, body)
        
        if body.get('authed') == True:
            print("✅ SUCCESS: Correctly returned authed=true with valid cookie")
            return True
        else:
            print(f"❌ FAIL: Expected authed=true, got {body}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


def test_admin_users(session_cookie: str):
    """Test 5: GET /api/admin/users - verify NEW Firebase project connection."""
    print_test_header("5. Admin Users - NEW Firebase Project (vertex-ai-d21c3)")
    
    url = f"{BASE_URL}/api/admin/users"
    try:
        cookies = {'sx_portal_session': session_cookie}
        response = requests.get(url, cookies=cookies, timeout=15)
        
        if response.status_code == 200:
            body = response.json()
            users = body.get('users', [])
            day = body.get('day', 'N/A')
            
            print(f"\n✅ SUCCESS: Firebase RTDB connection working")
            print(f"   - Total users: {len(users)}")
            print(f"   - Day: {day}")
            
            # Look for trader@vertex.test
            trader_user = None
            for user in users:
                if user.get('uid') == TEST_USER_UID or user.get('email') == TEST_USER_EMAIL:
                    trader_user = user
                    break
            
            if trader_user:
                print(f"\n✅ CRITICAL: Found test user trader@vertex.test:")
                print(f"   - UID: {trader_user.get('uid')}")
                print(f"   - Email: {trader_user.get('email')}")
                print(f"   - Tier: {trader_user.get('tier')}")
                print(f"   - Name: {trader_user.get('name')}")
                print(f"   - Created: {trader_user.get('createdAt')}")
                return trader_user
            else:
                print(f"\n❌ CRITICAL FAIL: trader@vertex.test (uid {TEST_USER_UID}) NOT FOUND in user list")
                print(f"   First 3 users: {json.dumps(users[:3], indent=2)}")
                return None
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"   Error: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None


def test_admin_set_tier(session_cookie: str):
    """Test 6: POST /api/admin/set-tier - change trader@vertex.test tier."""
    print_test_header("6. Admin Set Tier - Change trader@vertex.test")
    
    url = f"{BASE_URL}/api/admin/set-tier"
    cookies = {'sx_portal_session': session_cookie}
    
    # Step 1: Change to standard
    print("\n--- Step 1: Change tier to 'standard' ---")
    try:
        payload = {"uid": TEST_USER_UID, "tier": "standard"}
        response = requests.post(url, json=payload, cookies=cookies, timeout=10)
        body = response.json()
        print_result("/api/admin/set-tier (to standard)", response.status_code, body)
        
        if response.status_code == 200 and body.get('tier') == 'standard':
            print("✅ SUCCESS: Tier changed to 'standard'")
        else:
            print(f"❌ FAIL: Expected 200 + tier='standard', got {response.status_code}, {body}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False
    
    # Step 2: Verify via /api/admin/users
    print("\n--- Step 2: Verify tier change via /api/admin/users ---")
    try:
        users_url = f"{BASE_URL}/api/admin/users"
        response = requests.get(users_url, cookies=cookies, timeout=15)
        if response.status_code == 200:
            users = response.json().get('users', [])
            trader = next((u for u in users if u.get('uid') == TEST_USER_UID), None)
            if trader and trader.get('tier') == 'standard':
                print(f"✅ SUCCESS: Verified tier is 'standard' in user list")
            else:
                print(f"❌ FAIL: Tier not updated correctly. User: {trader}")
                return False
        else:
            print(f"❌ FAIL: Could not fetch users, status={response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False
    
    # Step 3: Change back to premium
    print("\n--- Step 3: Change tier back to 'premium' ---")
    try:
        payload = {"uid": TEST_USER_UID, "tier": "premium"}
        response = requests.post(url, json=payload, cookies=cookies, timeout=10)
        body = response.json()
        print_result("/api/admin/set-tier (to premium)", response.status_code, body)
        
        if response.status_code == 200 and body.get('tier') == 'premium':
            print("✅ SUCCESS: Tier changed back to 'premium'")
        else:
            print(f"❌ FAIL: Expected 200 + tier='premium', got {response.status_code}, {body}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False
    
    # Step 4: Final verification
    print("\n--- Step 4: Final verification via /api/admin/users ---")
    try:
        response = requests.get(users_url, cookies=cookies, timeout=15)
        if response.status_code == 200:
            users = response.json().get('users', [])
            trader = next((u for u in users if u.get('uid') == TEST_USER_UID), None)
            if trader and trader.get('tier') == 'premium':
                print(f"✅ SUCCESS: Verified tier is back to 'premium'")
                return True
            else:
                print(f"❌ FAIL: Tier not restored. User: {trader}")
                return False
        else:
            print(f"❌ FAIL: Could not fetch users, status={response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


def firebase_sign_in():
    """Sign in as trader@vertex.test via Firebase Auth REST API."""
    print_test_header("7. Firebase Auth - Sign in as trader@vertex.test")
    
    try:
        payload = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "returnSecureToken": True
        }
        response = requests.post(FIREBASE_AUTH_URL, json=payload, timeout=10)
        
        if response.status_code == 200:
            body = response.json()
            id_token = body.get('idToken')
            print(f"✅ SUCCESS: Firebase Auth sign-in successful")
            print(f"   - Email: {body.get('email')}")
            print(f"   - LocalId (UID): {body.get('localId')}")
            print(f"   - idToken: {id_token[:50]}..." if id_token else "   - idToken: None")
            return id_token
        else:
            print(f"❌ FAIL: Firebase Auth failed with status {response.status_code}")
            print(f"   Error: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None


def test_signals_live_with_token(id_token: str):
    """Test 8: POST /api/signals/live WITH Bearer token."""
    print_test_header("8. Signals Live - WITH Bearer Token (Premium User)")
    
    url = f"{BASE_URL}/api/signals/live"
    try:
        headers = {"Authorization": f"Bearer {id_token}"}
        response = requests.post(url, json={}, headers=headers, timeout=10)
        
        if response.status_code == 200:
            body = response.json()
            print_result("/api/signals/live (with token)", response.status_code, body)
            print(f"✅ SUCCESS: Premium user can access live signals")
            print(f"   - Direction: {body.get('direction')}")
            print(f"   - Tier: {body.get('tier')}")
            print(f"   - Used: {body.get('used')}")
            print(f"   - Limit: {body.get('limit')}")
            print(f"   - Remaining: {body.get('remaining')}")
            return True
        else:
            print_result("/api/signals/live (with token)", response.status_code, response.text[:500])
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


def test_signals_future_with_token(id_token: str):
    """Test 9: POST /api/signals/future WITH Bearer token."""
    print_test_header("9. Signals Future - WITH Bearer Token (Premium User)")
    
    url = f"{BASE_URL}/api/signals/future"
    try:
        headers = {"Authorization": f"Bearer {id_token}"}
        payload = {"count": 3}
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            body = response.json()
            print_result("/api/signals/future (with token)", response.status_code, body)
            print(f"✅ SUCCESS: Premium user can access future signals")
            print(f"   - Picks count: {len(body.get('picks', []))}")
            print(f"   - Tier: {body.get('tier')}")
            print(f"   - Used: {body.get('used')}")
            print(f"   - Limit: {body.get('limit')}")
            print(f"   - Remaining: {body.get('remaining')}")
            return True
        else:
            print_result("/api/signals/future (with token)", response.status_code, response.text[:500])
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


def test_news_with_token(id_token: str):
    """Test 10: GET /api/news WITH Bearer token."""
    print_test_header("10. News - WITH Bearer Token (Premium User)")
    
    url = f"{BASE_URL}/api/news"
    try:
        headers = {"Authorization": f"Bearer {id_token}"}
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            body = response.json()
            events = body.get('events', [])
            print(f"✅ SUCCESS: Premium user can access news")
            print(f"   - Events count: {len(events)}")
            print(f"   - Updated at: {body.get('updatedAt')}")
            if events:
                print(f"   - First event: {events[0].get('title')} ({events[0].get('currency')})")
            return True
        else:
            print_result("/api/news (with token)", response.status_code, response.text[:500])
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


def test_signals_live_without_token():
    """Test 11: POST /api/signals/live WITHOUT token."""
    print_test_header("11. Signals Live - WITHOUT Token")
    
    url = f"{BASE_URL}/api/signals/live"
    try:
        response = requests.post(url, json={}, timeout=10)
        body = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        print_result("/api/signals/live (no token)", response.status_code, body)
        
        if response.status_code == 401:
            print(f"✅ SUCCESS: Correctly returned 401 without token")
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


def test_signals_future_without_token():
    """Test 12: POST /api/signals/future WITHOUT token."""
    print_test_header("12. Signals Future - WITHOUT Token")
    
    url = f"{BASE_URL}/api/signals/future"
    try:
        response = requests.post(url, json={"count": 5}, timeout=10)
        body = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        print_result("/api/signals/future (no token)", response.status_code, body)
        
        if response.status_code == 401:
            print(f"✅ SUCCESS: Correctly returned 401 without token")
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


def test_news_without_token():
    """Test 13: GET /api/news WITHOUT token."""
    print_test_header("13. News - WITHOUT Token")
    
    url = f"{BASE_URL}/api/news"
    try:
        response = requests.get(url, timeout=10)
        body = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        print_result("/api/news (no token)", response.status_code, body)
        
        if response.status_code == 401:
            print(f"✅ SUCCESS: Correctly returned 401 without token")
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


def test_admin_logout(session_cookie: str):
    """Test 14: POST /api/admin/logout then verify session is cleared."""
    print_test_header("14. Admin Logout")
    
    url = f"{BASE_URL}/api/admin/logout"
    try:
        cookies = {'sx_portal_session': session_cookie}
        response = requests.post(url, cookies=cookies, timeout=10)
        body = response.json()
        print_result("/api/admin/logout", response.status_code, body)
        
        if response.status_code == 200 and body.get('ok') == True:
            print("✅ SUCCESS: Logout successful")
            
            # Now verify session is cleared
            print("\n--- Verifying session is cleared ---")
            session_url = f"{BASE_URL}/api/admin/session"
            session_response = requests.get(session_url, cookies=dict(response.cookies), timeout=10)
            session_body = session_response.json()
            print_result("/api/admin/session (after logout)", session_response.status_code, session_body)
            
            if session_body.get('authed') == False:
                print("✅ SUCCESS: Session correctly cleared after logout")
            else:
                print(f"❌ FAIL: Session still active after logout: {session_body}")
        else:
            print(f"❌ FAIL: Logout failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


def main():
    """Run all backend tests for Vertex AI rebrand + Firebase swap."""
    print("\n" + "="*80)
    print("BACKEND API TESTS - Vertex AI Rebrand + Firebase Project Swap")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Firebase Project: vertex-ai-d21c3")
    print(f"Test User: {TEST_USER_EMAIL} (uid: {TEST_USER_UID})")
    print("="*80)
    
    # Admin auth tests
    session_cookie = test_admin_login_success()
    test_admin_login_failure()
    test_admin_session_without_cookie()
    
    if not session_cookie:
        print("\n❌ CRITICAL: No valid session cookie - cannot continue with admin tests")
        return
    
    test_admin_session_with_cookie(session_cookie)
    
    # Admin user management tests
    trader_user = test_admin_users(session_cookie)
    if not trader_user:
        print("\n❌ CRITICAL: trader@vertex.test not found - Firebase project may not be connected correctly")
    
    test_admin_set_tier(session_cookie)
    
    # Firebase Auth + premium-gated endpoints
    id_token = firebase_sign_in()
    if id_token:
        test_signals_live_with_token(id_token)
        test_signals_future_with_token(id_token)
        test_news_with_token(id_token)
    else:
        print("\n❌ CRITICAL: Could not get Firebase idToken - cannot test premium-gated endpoints")
    
    # Test endpoints without token (should get 401)
    test_signals_live_without_token()
    test_signals_future_without_token()
    test_news_without_token()
    
    # Logout
    test_admin_logout(session_cookie)
    
    print("\n" + "="*80)
    print("ALL TESTS COMPLETED")
    print("="*80)


if __name__ == "__main__":
    main()
