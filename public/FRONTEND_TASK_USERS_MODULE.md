# Frontend Task - Users Module Implementation
نمایش بهتر در 
https://markdownviewer.pages.dev/


## 📚 Swagger Documentation
**Swagger/API Documentation**: https://safepoint-tech.ir/siem/api/v1/docs

---

## ⚠️ لیست کاربران سیستم - مهم

### کاربران قابل استفاده (Do NOT Delete / Do NOT Change Password):
**رمز عبور همه کاربران**: `1qaz!QAZ`

| ID | Username | Email | نام | نقش | وضعیت |
|---|----------|-------|------|------|--------|
| 2 | admin1 | user@example.com | admin1 | admin | ✅ فعال |
| 3 | admin2 | user@example.com | admin2 | admin | ✅ فعال |
| 4 | admin3 | user@example.com | admin3 | admin | ✅ فعال |
| 5 | admin4 | user@example.com | admin4 | admin | ✅ فعال |
| 6 | admin5 | user@example.com | admin5 | admin | ✅ فعال |
| 7 | admin6 | user@example.com | admin6 | admin | ✅ فعال |
| 8 | admin7 | user@example.com | admin7 | admin | ✅ فعال |
| 9 | admin8 | user@example.com | admin8 | admin | ✅ فعال |
| 10 | admin9 | user@example.com | admin9 | admin | ✅ فعال |
| 11 | admin10 | user@example.com | admin10 | admin | ✅ فعال |

### ⛔ نکات مهم:
- **این کاربرها را حذف نکنید**
- **رمز عبور این کاربرها را تغییر ندهید** (برای تست: `1qaz!QAZ`)
- **دسترسی‌های این کاربرها را تغییر ندهید**

### کاربر مدیریت سیستم:
| ID | Username | نقش | توضیح |
|---|----------|------|--------|
| 1 | admin | admin | System Administrator (بدون دسترسی محدود) |

---


## 📋 Task Summary

Implement the user management UI with the following features:
- User login and JWT token management
- Password change when password expires
- List users with pagination, search, and filtering
- Create new users with profile settings
- Edit user information and permissions
- Delete users with confirmation
- Display appropriate error messages from server responses

---

## 🔐 Phase 1: Authentication

### 1. Login Page

**Page Route**: `/login`

**Form Fields**:
- Username (required)
- Password (required)

**API Endpoint**:
```
POST https://safepoint-tech.ir/siem/api/v1/auth/token/
```

**Request Example**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Successful Response** (Status 200):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "first_name": "Ahmad",
    "last_name": "Alipour",
    "is_active": true,
    "date_joined": "2025-12-22T10:00:00Z",
    "profile": {
      "role": "admin",
      "theme": "light",
      "password_changed_at": "2025-12-22T10:00:00Z"
    }
  }
}
```

**Possible Errors**:

| Status | Error | Description |
|--------|-------|-------------|
| 403 | account_locked | Too many failed attempts. Account locked for N minutes |
| 401 | detail | No active account found with the given credentials |
| 400 | validation | Required fields missing |

**Error Handling Example**:
```javascript
if (error.response?.status === 403) {
  const { locked_until, locked_for_minutes } = error.response.data;
  showNotification(
    `Account locked until ${locked_until}. Try again in ${locked_for_minutes} minutes.`,
    'error'
  );
} else if (error.response?.status === 401) {
  showNotification('Invalid username or password', 'error');
}
```

**After Successful Login**:
1. Store `access` token in localStorage as `access_token`
2. Store `refresh` token in localStorage as `refresh_token`
3. Redirect to `/users` page
4. Use `access` token in Authorization header for all requests:
   ```
   Authorization: Bearer {access_token}
   ```

---

### 2. Password Expiration & Change

**When to show**: If password has expired (backend will return 401 with specific message)

**Page Route**: `/change-password`

**Form Fields**:
- Current Password (required)
- New Password (required, min 8 characters)
- Confirm Password (required, must match new password)

**API Endpoint**:
```
POST https://safepoint-tech.ir/siem/api/v1/auth/password/change-with-token/
```

**Request Headers**:
```
Authorization: Bearer {access_token}
```

**Request Example**:
```json
{
  "current_password": "old_password",
  "new_password": "NewSecure123!",
  "confirm_password": "NewSecure123!"
}
```

**Successful Response** (Status 200):
```json
{
  "detail": "Password changed successfully"
}
```

**Possible Errors**:

| Status | Field | Description |
|--------|-------|-------------|
| 400 | current_password | Current password is incorrect |
| 400 | new_password | Password validation failed (too weak, too common, etc) |
| 400 | confirm_password | Passwords do not match |
| 401 | - | Token expired or invalid |

---

## 📊 Phase 2: User Management

### 1. Users List Page

**Page Route**: `/users`

**Access**: Admin only

#### Table Columns

| Column | Type | Description |
|--------|------|-------------|
| ID | Number | User ID |
| Username | Text | Login username |
| Email | Email | User email |
| Name | Text | First and last name |
| Role | Select | admin / user |
| Status | Badge | Active / Inactive |
| Joined | Date | Account creation date |
| Actions | Buttons | Edit / Delete |

#### Pagination & Filtering

**Base URL**:
```
GET https://safepoint-tech.ir/siem/api/v1/users/
```

**Query Parameters**:

```javascript
// Example 1: Basic list with pagination
GET https://safepoint-tech.ir/siem/api/v1/users/?page=1&page_size=20

// Example 2: Search by name or username
GET https://safepoint-tech.ir/siem/api/v1/users/?search=ahmad

// Example 3: Filter by username
GET https://safepoint-tech.ir/siem/api/v1/users/?username=admin

// Example 4: Filter by active status
GET https://safepoint-tech.ir/siem/api/v1/users/?is_active=true

// Example 5: Sort by field (prefix with - for descending)
GET https://safepoint-tech.ir/siem/api/v1/users/?ordering=-date_joined

// Example 6: Combined filters
GET https://safepoint-tech.ir/siem/api/v1/users/?search=ahmad&is_active=true&ordering=username&page=1&page_size=15
```

**Supported Parameters**:
| Name | Type | Default | Max | Description |
|------|------|---------|-----|-------------|
| page | Integer | 1 | - | Page number |
| page_size | Integer | 20 | 100 | Items per page |
| search | String | - | - | Search in username, first_name, last_name, email |
| username | String | - | - | Filter by exact username |
| is_active | Boolean | - | - | Filter by active status |
| ordering | String | username | - | Sort field (see below) |

**Sortable Fields**:
- `username` - Username
- `email` - Email
- `first_name` - First name
- `last_name` - Last name
- `is_active` - Active status
- `date_joined` - Join date

Use `-` prefix for descending order: `-date_joined`

**Response** (Status 200):
```json
{
  "count": 45,
  "next": "http://127.0.0.1:8000/siem/api/v1/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "Ahmad",
      "last_name": "Alipour",
      "is_active": true,
      "date_joined": "2025-12-22T10:00:00Z",
      "profile": {
        "role": "admin",
        "theme": "light"
      }
    }
  ]
}
```

---

### 2. Create User Page

**Page Route**: `/users/create`

**Access**: Admin only

**Form Fields**:

| Field | Type | Required | Constraint | Description |
|-------|------|----------|-----------|-------------|
| username | Text | ✓ | Max 150 chars | Login name (must be unique) |
| email | Email | ✓ | Valid email format | User email |
| first_name | Text | - | Max 150 chars | First name |
| last_name | Text | - | Max 150 chars | Last name |
| password | Password | ✓ | Min 8 chars | Initial password |
| is_active | Boolean | - | Default: true | Account status |
| **profile** | - | - | - | **Profile Settings** |
| profile.role | Select | - | admin / user | User role |
| profile.theme | Select | - | light / dark | UI theme |
| profile.allowed_submenus | Array | - | Menu IDs | **See explanation below** |

#### Understanding allowed_submenus

**What is it?**  
`allowed_submenus` is an array of menu IDs that the user can access in the application.

**How to populate it**:

1. First, fetch all available menus:
   ```
   GET https://safepoint-tech.ir/siem/api/v1/menus/
   ```

2. Response contains all menus and their submenus:
   ```json
   {
     "results": [
       {
         "id": 1,
         "key": "users",
         "title_en": "Users",
         "title_fa": "کاربران",
         "icon": "people",
         "order": 1,
         "parent": null,
         "submenus": [
           {
             "id": 10,
             "key": "users_list",
             "title_en": "List Users",
             "title_fa": "لیست کاربران"
           },
           {
             "id": 11,
             "key": "users_create",
             "title_en": "Create User",
             "title_fa": "ایجاد کاربر"
           }
         ]
       }
     ]
   }
   ```

3. Select the submenu IDs to grant. Example:
   ```javascript
   allowed_submenus: [10, 11, 12]  // User can access menus 10, 11, 12
   ```

4. **For admin users**: Select all submenu IDs
5. **For regular users**: Select only the menus they need

**Create User Request**:

```json
{
  "username": "operator1",
  "email": "operator1@example.com",
  "first_name": "Ali",
  "last_name": "Rezaei",
  "password": "SecurePass123!",
  "is_active": true,
  "profile": {
    "role": "user",
    "theme": "light",
    "allowed_submenus": [10, 11, 12]
  }
}
```

**API Endpoint**:
```
POST https://safepoint-tech.ir/siem/api/v1/users/
```

**Successful Response** (Status 201):
```json
{
  "id": 5,
  "username": "operator1",
  "email": "operator1@example.com",
  "first_name": "Ali",
  "last_name": "Rezaei",
  "is_active": true,
  "date_joined": "2026-02-06T12:00:00Z",
  "profile": {
    "id": 5,
    "role": "user",
    "theme": "light",
    "password_changed_at": "2026-02-06T12:00:00Z",
    "created_at": "2026-02-06T12:00:00Z",
    "updated_at": "2026-02-06T12:00:00Z",
    "allowed_submenus": [
      {"id": 10, "title_en": "List Users", "title_fa": "لیست کاربران"},
      {"id": 11, "title_en": "Create User", "title_fa": "ایجاد کاربر"},
      {"id": 12, "title_en": "Edit User", "title_fa": "ویرایش کاربر"}
    ]
  }
}
```

**Possible Errors**:

| Status | Field | Description |
|--------|-------|-------------|
| 400 | username | A user with that username already exists |
| 400 | email | A user with that email already exists |
| 400 | password | Password validation failed |
| 400 | profile.allowed_submenus | Invalid submenu IDs |
| 403 | - | You don't have permission to perform this action |

---

### 3. Edit User Page

**Page Route**: `/users/{id}/edit`

**Access**: Admin only

**Editable Fields**:
- First name
- Last name
- Email
- Active status
- Role
- Theme
- Allowed menus

**API Endpoint** (PATCH for partial update):
```
PATCH https://safepoint-tech.ir/siem/api/v1/users/{id}/
```

**Request Example**:
```json
{
  "first_name": "New Name",
  "email": "newemail@example.com",
  "profile": {
    "role": "admin",
    "theme": "dark",
    "allowed_submenus": [10, 11, 12, 13, 14]
  }
}
```

**Successful Response** (Status 200):
```json
{
  "id": 1,
  "username": "admin",
  "email": "newemail@example.com",
  "first_name": "New Name",
  "last_name": "Alipour",
  "is_active": true,
  "date_joined": "2025-12-22T10:00:00Z",
  "profile": {
    "role": "admin",
    "theme": "dark",
    "password_changed_at": "2025-12-22T10:00:00Z",
    "created_at": "2025-12-22T10:00:00Z",
    "updated_at": "2026-02-06T14:30:00Z"
  }
}
```

---

### 4. Delete User

**Access**: Admin only

**Important Notes**:
- The `admin` user cannot be deleted
- Deletion is permanent and cannot be undone

**API Endpoint**:
```
DELETE https://safepoint-tech.ir/siem/api/v1/users/{id}/
```

**Successful Response** (Status 204): No content

**Possible Errors**:

| Status | Message | Description |
|--------|---------|-------------|
| 403 | Deleting the admin user is not allowed | Cannot delete admin |
| 404 | Not found | User not found |

---

## 🔔 Error Handling & Notifications

### Error Response Pattern

1. Check the **HTTP Status Code**
2. Read the error message from response body
3. Display appropriate user-friendly message

### Common API Errors

| Status | Meaning | Action |
|--------|---------|--------|
| 400 | Bad Request | Validation failed - show field errors |
| 401 | Unauthorized | Token expired - refresh or redirect to login |
| 403 | Forbidden | Permission denied - show access error |
| 404 | Not Found | Resource not found - show not found message |
| 429 | Too Many Requests | Rate limited - show wait message |
| 500 | Server Error | Internal error - show generic error |



## 📝 User Table Fields Reference

**User Model Fields**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | Integer | - | Auto-generated |
| username | String | ✓ | Max 150, unique |
| email | Email | ✓ | Unique |
| first_name | String | - | Max 150 |
| last_name | String | - | Max 150 |
| password | String | ✓ | Hashed |
| is_active | Boolean | - | Default: true |
| date_joined | DateTime | - | Auto-generated |
| last_login | DateTime | - | Auto-updated |

**UserProfile Related Fields**:

| Field | Type | Values | Notes |
|-------|------|--------|-------|
| role | String | admin / user | User role |
| theme | String | light / dark | UI theme |
| password_changed_at | DateTime | - | Last password change |
| allowed_submenus | Array | Menu IDs | Permissions |

---

## 🛠️ Implementation Checklist

- [ ] Login page works
- [ ] JWT tokens stored securely
- [ ] Authorization header added to all requests
- [ ] Password change when expired works
- [ ] Users list page displays (paginated)
- [ ] Search and filter work correctly
- [ ] Create user form works
- [ ] Menu selection shows and saves correctly
- [ ] Edit user form works
- [ ] Delete user works with confirmation
- [ ] Error messages display appropriately
- [ ] Token refresh works automatically
- [ ] Logout clears tokens
- [ ] No console errors

---

## 📞 Troubleshooting

**Issue**: "401 Unauthorized"
- **Solution**: Token expired - refresh using refresh_token or login again

**Issue**: "403 Forbidden"
- **Solution**: Admin access required - only admins can manage users

**Issue**: "400 Bad Request"
- **Solution**: Check validation errors
  - Are all required fields filled?
  - Is data format correct?
  - Is username/email unique?

**Issue**: CORS error
- **Solution**: Frontend should be on same origin or CORS should be configured

---

## 📚 Additional Resources

- **Swagger/OpenAPI**: https://safepoint-tech.ir/siem/api/v1/docs/
- **ReDoc**: https://safepoint-tech.ir/siem/api/v1/redoc/
- **JWT Info**: https://jwt.io/
- **Axios Docs**: https://axios-http.com/

---

**Version**: 1.0  
**Last Updated**: February 6, 2026

**مسیر صفحه**: `/users`

**دسترسی**: فقط مدیران (Admin)

#### الف) نمایش جدول

**ستون‌های جدول**:
| ستون | نوع | توضیح |
|------|------|--------|
| ID | عدد | شناسه یکتای کاربر |
| نام کاربری | متن | نام لاگین کاربر |
| ایمیل | ایمیل | آدرس ایمیل |
| نام | متن | نام و نام خانوادگی |
| نقش | انتخاب | admin / user |
| وضعیت | تگ | فعال / غیرفعال |
| تاریخ عضویت | تاریخ | تاریخ ایجاد حساب |
| عملیات | دکمه | ویرایش / حذف |

#### ب) جستجو و فیلتر

**URL پایه**:
```
GET https://safepoint-tech.ir/siem/api/v1/users/
```

**پارامترهای جستجو و فیلتر**:

```javascript
// مثال 1: جستجو بر اساس نام/نام کاربری
GET https://safepoint-tech.ir/siem/api/v1/users/?search=احمد
// جستجو در: نام کاربری، نام، نام خانوادگی، ایمیل

// مثال 2: فیلتر بر اساس نام کاربری دقیق
GET https://safepoint-tech.ir/siem/api/v1/users/?username=admin

// مثال 3: فیلتر بر اساس وضعیت
GET https://safepoint-tech.ir/siem/api/v1/users/?is_active=true

// مثال 4: مرتب‌سازی (نزولی: از جدید‌تر)
GET https://safepoint-tech.ir/siem/api/v1/users/?ordering=-date_joined

// مثال 5: صفحه‌بندی
GET https://safepoint-tech.ir/siem/api/v1/users/?page=2&page_size=20

// مثال 6: ترکیب
GET https://safepoint-tech.ir/siem/api/v1/users/?search=احمد&is_active=true&ordering=username&page=1&page_size=15
```

**پارامترهای دستاوری**:
| نام | نوع | پیش‌فرض | حداکثر | توضیح |
|-----|------|---------|--------|--------|
| page | عدد | 1 | - | شماره صفحه |
| page_size | عدد | 20 | 100 | تعداد آیتم در هر صفحه |
| search | متن | - | - | جستجو در نام‌ها و ایمیل |
| username | متن | - | - | فیلتر دقیق نام کاربری |
| is_active | boolean | - | - | فیلتر بر اساس وضعیت (true/false) |
| ordering | متن | username | - | مرتب‌سازی (نام‌های فیلد قابل مرتب‌سازی پایین) |

**فیلدهای قابل مرتب‌سازی**:
- `username` - نام کاربری
- `email` - ایمیل
- `first_name` - نام
- `last_name` - نام خانوادگی
- `is_active` - وضعیت
- `date_joined` - تاریخ عضویت

برای مرتب‌سازی معکوس، پیشوند `-` اضافه کنید: `-date_joined`

**پاسخ لیست** (Status 200):
```json
{
  "count": 45,
  "next": "http://127.0.0.1:8000/siem/api/v1/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "احمد",
      "last_name": "علی‌پور",
      "is_active": true,
      "date_joined": "2025-12-22T10:00:00Z",
      "profile": {
        "role": "admin",
        "theme": "light"
      }
    },
    {
      "id": 2,
      "username": "operator",
      "email": "operator@example.com",
      "first_name": "فاطمه",
      "last_name": "محمدی",
      "is_active": true,
      "date_joined": "2025-12-23T14:30:00Z",
      "profile": {
        "role": "user",
        "theme": "dark"
      }
    }
  ]
}
```

---

### ۲. صفحه ایجاد کاربر جدید

**مسیر صفحه**: `/users/create`

**دسترسی**: فقط مدیران (Admin)

**فیلدهای ورودی**:

| فیلد | نوع | الزامی | محدودیت | توضیح |
|------|------|---------|---------|--------|
| username | متن | ✓ | حداکثر 150 کاراکتر | نام لاگین (باید یکتا باشد) |
| email | ایمیل | ✓ | فرمت ایمیل معتبر | آدرس ایمیل کاربر |
| first_name | متن | - | حداکثر 150 کاراکتر | نام |
| last_name | متن | - | حداکثر 150 کاراکتر | نام خانوادگی |
| password | رمز | ✓ | حداقل 8 کاراکتر | رمز عبور اولیه |
| is_active | boolean | - | پیش‌فرض: true | وضعیت حساب |
| **profile** | - | - | - | **تنظیمات پروفایل** |
| profile.role | انتخاب | - | admin / user | نقش کاربر |
| profile.theme | انتخاب | - | light / dark | تم رابط کاربری |
| profile.allowed_submenus | آرایه | - | لیست IDs | **توضیح زیر** |

#### توضیح allowed_submenus

**چیست؟**  
`allowed_submenus` فهرستی از منوهایی است که کاربر دسترسی داشته باشد.

**نحوه پر کردن**:
1. ابتدا **لیست تمام منوها را از این API دریافت کنید**:
   ```
   GET https://safepoint-tech.ir/siem/api/v1/menus/
   ```

2. پاسخ شامل تمام منوهای دستاوری خواهد بود:
   ```json
   {
     "results": [
       {
         "id": 1,
         "key": "users",
         "title_en": "Users",
         "title_fa": "کاربران",
         "icon": "people",
         "order": 1,
         "parent": null,
         "submenus": [
           {
             "id": 10,
             "key": "users_list",
             "title_en": "List Users",
             "title_fa": "لیست کاربران"
           },
           {
             "id": 11,
             "key": "users_create",
             "title_en": "Create User",
             "title_fa": "ایجاد کاربر"
           }
         ]
       },
       {
         "id": 2,
         "key": "logs",
         "title_en": "Logs",
         "title_fa": "گزارش‌ها"
         // ...
       }
     ]
   }
   ```

3. **زیرمنوها را انتخاب کنید**. مثلا برای کاربر معمولی:
   ```javascript
   allowed_submenus: [10, 11]  // لیست و جزئیات کاربران
   ```

4. **برای مدیر**: تمام زیرمنوها را انتخاب کنید

5. **برای اپراتور**: فقط منوهای مربوط به عملیات انتخاب کنید

**نمونه درخواست ایجاد کاربر**:

```json
{
  "username": "operator1",
  "email": "operator1@example.com",
  "first_name": "علی",
  "last_name": "رضایی",
  "password": "SecurePass123!",
  "is_active": true,
  "profile": {
    "role": "user",
    "theme": "light",
    "allowed_submenus": [10, 11, 12]
  }
}
```

**URL درخواست**:
```
POST https://safepoint-tech.ir/siem/api/v1/users/
```

**پاسخ موفق** (Status 201):
```json
{
  "id": 5,
  "username": "operator1",
  "email": "operator1@example.com",
  "first_name": "علی",
  "last_name": "رضایی",
  "is_active": true,
  "date_joined": "2026-02-06T12:00:00Z",
  "profile": {
    "id": 5,
    "role": "user",
    "theme": "light",
    "password_changed_at": "2026-02-06T12:00:00Z",
    "created_at": "2026-02-06T12:00:00Z",
    "updated_at": "2026-02-06T12:00:00Z",
    "allowed_submenus": [
      {"id": 10, "title_en": "List Users", "title_fa": "لیست کاربران"},
      {"id": 11, "title_en": "Create User", "title_fa": "ایجاد کاربر"},
      {"id": 12, "title_en": "Edit User", "title_fa": "ویرایش کاربر"}
    ]
  }
}
```

**خطاهای ممکن**:

| Status | فیلد | توضیح |
|--------|------|--------|
| 400 | username | نام کاربری تکراری است |
| 400 | email | ایمیل تکراری است |
| 400 | password | رمز عبور ضعیف است (حداقل 8 کاراکتر) |
| 400 | allowed_submenus | یک یا بیشتر از منوهای انتخابی معتبر نیست |

---

### ۳. صفحه ویرایش کاربر

**مسیر صفحه**: `/users/{id}/edit`

**دسترسی**: فقط مدیران (Admin)

**فیلدهای قابل ویرایش**:
- نام
- نام خانوادگی
- ایمیل
- وضعیت (فعال/غیرفعال)
- نقش
- تم رابط کاربری
- منوهای مجاز

**URL درخواست** (نوع PATCH - ویرایش جزئی):
```
PATCH https://safepoint-tech.ir/siem/api/v1/users/{id}/
```

**نمونه درخواست**:
```json
{
  "first_name": "احمد",
  "email": "newemail@example.com",
  "profile": {
    "role": "admin",
    "theme": "dark",
    "allowed_submenus": [10, 11, 12, 13, 14]
  }
}
```

**پاسخ موفق** (Status 200):
```json
{
  "id": 1,
  "username": "admin",
  "email": "newemail@example.com",
  "first_name": "احمد",
  "last_name": "علی‌پور",
  "is_active": true,
  "date_joined": "2025-12-22T10:00:00Z",
  "profile": {
    "role": "admin",
    "theme": "dark",
    "password_changed_at": "2025-12-22T10:00:00Z",
    "created_at": "2025-12-22T10:00:00Z",
    "updated_at": "2026-02-06T14:30:00Z"
  }
}
```

---

### ۴. حذف کاربر

**دسترسی**: فقط مدیران (Admin)

**نکات مهم**:
- کاربر admin قابل حذف نیست
- حذف کاربر یک عملیات permanent است

**URL درخواست**:
```
DELETE https://safepoint-tech.ir/siem/api/v1/users/{id}/
```

**پاسخ موفق** (Status 204): بدون محتوا

**خطاهای ممکن**:

| Status | پیام | توضیح |
|--------|------|--------|
| 403 | `not_allowed` | نمی‌توانید کاربر admin را حذف کنید |
| 404 | `not_found` | کاربر پیدا نشد |

---

## 🔔 نمایش خطاها و پیام‌های نوتیفیکیشن

### الگوی نمایش خطا

**استراتژی شامل**:
1. **بررسی Status Code**
2. **خواندن پیام خطا** از جسم پاسخ
3. **نمایش پیام متناسب** در UI

### جدول خطاهای عمومی

| Status | کد | توضیح | نمایش شود |
|--------|-----|--------|-----------|
| 400 | validation_error | خطا در تایید داده‌ها | پیام‌های تفصیلی برای هر فیلد |
| 401 | unauthorized | توکن منقضی یا معتبر نیست | "لطفا دوباره وارد شوید" |
| 403 | forbidden | دسترسی محدود است | "شما اجازه دسترسی ندارید" |
| 404 | not_found | منبع پیدا نشد | "کاربر / صفحه یافت نشد" |
| 429 | too_many_requests | درخواست‌های زیاد | "لطفا بعد‌تر تلاش کنید" |
| 500 | server_error | خطای سرور | "خطای سرور. لطفا تماس بگیرید" |


## 🌐 Swagger Documentation

**آدرس Swagger**: 
```
https://safepoint-tech.ir/siem/api/v1/docs/
```

**مراحل دسترسی**:
1. در مرورگر وارد شوید: `https://safepoint-tech.ir/siem/api/v1/docs/`
2. قسمت "Users" را باز کنید
3. تمام API endpoints را مشاهده کنید
4. برای تست، روی "Try it out" کلیک کنید

**Endpoints قابل مشاهده**:
- `POST https://safepoint-tech.ir/siem/api/v1/auth/login/` - ورود
- `POST https://safepoint-tech.ir/siem/api/v1/auth/change-password/` - تغییر رمز
- `GET https://safepoint-tech.ir/siem/api/v1/users/` - لیست کاربران
- `POST https://safepoint-tech.ir/siem/api/v1/users/` - ایجاد کاربر
- `GET https://safepoint-tech.ir/siem/api/v1/users/{id}/` - جزئیات کاربر
- `PATCH https://safepoint-tech.ir/siem/api/v1/users/{id}/` - ویرایش کاربر
- `DELETE https://safepoint-tech.ir/siem/api/v1/users/{id}/` - حذف کاربر
- `GET https://safepoint-tech.ir/siem/api/v1/menus/` - لیست منوها

---

## 📝 خلاصه فیلدهای جدول Users

| فیلد | نوع | الزامی | توضیح |
|------|------|---------|--------|
| id | Integer | - | شناسه یکتا (خودکار) |
| username | String | ✓ | نام لاگین (max 150) |
| email | Email | ✓ | آدرس ایمیل معتبر |
| first_name | String | - | نام (max 150) |
| last_name | String | - | نام خانوادگی (max 150) |
| password | Password | ✓ | رمز عبور (hash‌شده) |
| is_active | Boolean | - | وضعیت فعال/غیرفعال |
| date_joined | DateTime | - | تاریخ ایجاد |
| last_login | DateTime | - | آخرین ورود |
| is_staff | Boolean | - | وضعیت staff |
| is_superuser | Boolean | - | وضعیت super user |

**جدول مرتبط: UserProfile**

| فیلد | نوع | مقادیر | توضیح |
|------|------|---------|--------|
| id | Integer | - | شناسه یکتا |
| user | Foreign Key | - | ارجاع به User |
| role | String | admin / user | نقش کاربر |
| theme | String | light / dark | تم رابط |
| password_changed_at | DateTime | - | آخرین تغییر رمز |
| created_at | DateTime | - | تاریخ ایجاد |
| updated_at | DateTime | - | تاریخ به‌روزرسانی |
| allowed_submenus | Many-to-Many | - | منوهای مجاز |

---

## 🛠️ نکات مهم و توصیات

### ۱. احراز هویت
- **توکن JWT** در localStorage ذخیره کنید
- **هدر Authorization** را در تمام درخواست‌ها اضافه کنید
- **Refresh Token** برای تجدید توکن منقضی استفاده کنید

### ۲. جستجو و فیلتر
- جستجو با تاخیر (debounce) برای بهینگی
- نمایش loading indicator در حین جستجو
- تعداد نتایج را نمایش دهید

### ۳. نمایش خطاها
- هرگز رمز عبور را در console log نکنید
- تمام خطاهای 4xx و 5xx را بگیرید
- پیام‌های دوست‌داشتنی به فارسی نمایش دهید

### ۴. ایجاد/ویرایش کاربران
- از فرم validation برای بررسی client-side استفاده کنید
- قبل از ارسال، داده‌ها را تایید کنید
- پس از ایجاد موفق، لیست را refresh کنید

### ۵. حذف کاربران
- confirmation dialog نمایش دهید
- هشدار برای حذف admin
- undo یا notification برای تأیید حذف

---

## 📞 راهنمای رفع مشکلات

### مشکل: "401 Unauthorized"
**راه حل**: توکن expire شده است
- Refresh token استفاده کنید
- یا دوباره وارد شوید

### مشکل: "403 Forbidden"
**راه حل**: شما admin نیستید
- فقط مدیران می‌توانند کاربران را مدیریت کنند

### مشکل: "400 Bad Request"
**راه حل**: بررسی کنید:
- تمام فیلدهای الزامی را پر کردید؟
- فرمت داده‌ها صحیح است؟
- نام کاربری/ایمیل تکراری نیست؟

---
