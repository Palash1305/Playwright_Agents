# OrangeHRM Basic Operations Test Plan

## Application Overview

Functional test plan for the OrangeHRM Open Source demo login and routine HR administration workflows. Exploration confirmed a login page with publicly displayed demo credentials, authenticated dashboard navigation, PIM employee search/add forms, Admin system-user filters, Leave application form, and an account menu with Logout. Use isolated, resettable demo data for tests that create or submit records; the shared public demo may contain changing baseline data, and the inspected account displayed a 0.00-day leave balance.

## Test Scenarios

### 1. Authentication and navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in using the published demo account

**File:** `tests/orangehrm/authentication/valid-login.spec.ts`

**Steps:**
  1. Open https://opensource-demo.orangehrmlive.com/web/index.php/auth/login in a fresh browser context.
    - expect: The OrangeHRM Login page is displayed with Username, Password, and Login controls.
  2. Enter the demo credentials displayed on the login page (observed during exploration: Admin / admin123), then select Login.
    - expect: Authentication succeeds and the Dashboard is displayed.
    - expect: The authenticated page shows the main navigation and dashboard widgets.

#### 1.2. Reject invalid credentials and missing required fields

**File:** `tests/orangehrm/authentication/invalid-login.spec.ts`

**Steps:**
  1. Start at the login page in a fresh browser context. Enter a valid demo username and an incorrect password, then select Login.
    - expect: The user remains on the login page.
    - expect: A clear authentication error is shown; no authenticated dashboard is opened.
  2. Clear both fields and select Login.
    - expect: Required-field validation is shown for missing credentials.
    - expect: No authenticated session is created.

#### 1.3. Sign out and prevent access to authenticated pages

**File:** `tests/orangehrm/authentication/logout.spec.ts`

**Steps:**
  1. Sign in with the published demo account, open the account menu in the page header, and select Logout.
    - expect: The browser returns to the OrangeHRM login page.
  2. Use browser back navigation to revisit the previously authenticated page.
    - expect: Protected content is not accessible without signing in again; the app redirects to login or otherwise requires authentication.

#### 1.4. Navigate between dashboard modules

**File:** `tests/orangehrm/dashboard/navigation.spec.ts`

**Steps:**
  1. Sign in with the published demo account and inspect the dashboard.
    - expect: Dashboard is displayed with navigation links for modules including Admin, PIM, Leave, Time, Recruitment, My Info, and Buzz.
  2. Open PIM, then use the main navigation to open Leave, then Dashboard.
    - expect: Each selected module loads with its matching page heading and navigation remains available.

### 2. Employee, system user, and leave operations

**Seed:** `tests/seed.spec.ts`

#### 2.1. Search and reset employee-list filters

**File:** `tests/orangehrm/pim/employee-search.spec.ts`

**Steps:**
  1. Sign in and open PIM > Employee List. Search using a known employee name or ID from the current resettable fixture data.
    - expect: Search returns matching employee rows; the result details correspond to the entered criterion.
  2. Change the criterion to a value guaranteed not to exist in the fixture and select Search.
    - expect: The list shows no matching records and does not show unrelated employees.
  3. Select Reset.
    - expect: All search criteria are cleared and the default employee list is restored.

#### 2.2. Validate required employee details

**File:** `tests/orangehrm/pim/add-employee-validation.spec.ts`

**Steps:**
  1. Sign in and open PIM > Add Employee. Leave required name fields empty and select Save.
    - expect: Required-field validation is displayed for missing employee details.
    - expect: No employee record is created.
  2. Enter a value in only one required name field and select Save.
    - expect: Validation continues to identify missing required fields and the incomplete record is not saved.

#### 2.3. Create and verify an employee record

**File:** `tests/orangehrm/pim/add-employee.spec.ts`

**Steps:**
  1. In an isolated or resettable environment, sign in and open PIM > Add Employee. Enter a unique first and last name; retain or set a unique Employee Id; leave Create Login Details unchecked unless credentials are explicitly required for the test.
    - expect: The form accepts the supplied required values and does not show validation errors before save.
  2. Select Save.
    - expect: The employee profile is saved and displayed with the entered name and Employee Id.
  3. Return to Employee List and search by the unique Employee Id.
    - expect: Exactly the created employee is returned with matching details.
  4. Remove the test employee using the supported cleanup procedure or reset the test environment.
    - expect: The test-created record is removed and baseline fixture data is restored.

#### 2.4. Filter system users and reset search criteria

**File:** `tests/orangehrm/admin/system-user-search.spec.ts`

**Steps:**
  1. Sign in and open Admin > User Management. Search for the current demo administrator using Username or another known stable fixture criterion.
    - expect: The users table shows records that match the submitted criteria.
  2. Apply a criterion guaranteed not to match any fixture and select Search.
    - expect: The result set shows no records; unrelated users are not returned.
  3. Select Reset.
    - expect: Username, User Role, Employee Name, and Status criteria are cleared and the default user list returns.

#### 2.5. Validate required leave application fields

**File:** `tests/orangehrm/leave/apply-leave-validation.spec.ts`

**Steps:**
  1. Sign in and open Leave > Apply.
    - expect: The form displays required Leave Type, From Date, and To Date fields, a Comments field, and an Apply action.
  2. Leave required fields empty and select Apply.
    - expect: Required-field validation is shown and no leave request is created.
  3. Select a leave type if available, enter a start date later than the end date, and select Apply.
    - expect: The invalid date range is rejected with clear validation and no request is created.

#### 2.6. Submit and verify a valid leave request

**File:** `tests/orangehrm/leave/apply-leave.spec.ts`

**Steps:**
  1. Use an isolated/resettable employee fixture with an enabled leave type and sufficient leave balance (the inspected demo account showed 0.00 days, so provision entitlement in the fixture before running). Sign in and open Leave > Apply.
    - expect: An available leave type can be selected and the applicable balance is displayed.
  2. Choose a valid leave type, select an eligible future From Date and To Date with sufficient balance, optionally enter a comment, and select Apply.
    - expect: The application is accepted and a success confirmation is displayed.
  3. Open Leave > My Leave and locate the new request.
    - expect: The submitted request appears with the chosen dates/type and the expected initial status.
  4. Cancel or remove the test request using the supported cleanup procedure, then restore the fixture balance.
    - expect: No test-created request remains and baseline leave data is restored.
