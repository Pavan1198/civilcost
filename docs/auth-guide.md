# CivilCost Real-Time Auth Integration Guide

## What this repo supports now

- `src/components/AuthModal.tsx` keeps the current demo auth flow.
- Google sign-in can use real Firebase auth when the `VITE_FIREBASE_*` keys are added.
- If Firebase is not configured yet, the current demo Google login still works.
- Email OTP can use a real backend API when `VITE_AUTH_API_BASE_URL` is set.

## Recommended setup

For this React + Vite app, the easiest real-world setup is:

- Google Sign-In: Firebase Auth
- Phone OTP: Firebase Phone Auth, Twilio Verify, or MSG91
- Email OTP: Resend or Nodemailer with a backend

## Firebase setup

1. Create a Firebase project.
2. Enable Google under `Authentication -> Sign-in method`.
3. Create a web app in Firebase.
4. Copy the Firebase web config into `.env` using `.env.example`.
5. Restart the dev server after adding env values.

## OTP flows

### Phone OTP

Recommended options:

- Firebase Phone Auth
- Twilio Verify
- MSG91

Typical flow:

1. Send the phone number to your auth service.
2. Trigger OTP delivery.
3. Collect the OTP in the app.
4. Verify it server-side or through Firebase.
5. Create the user session.

### Email OTP

Recommended options:

- Resend
- Nodemailer with SMTP

Typical flow:

1. Generate a 6-digit OTP.
2. Store it temporarily with an expiry.
3. Send it by email.
4. Verify the submitted OTP.
5. Create the user session.

Frontend env for this repo:

- Add `VITE_AUTH_API_BASE_URL` in `.env`
- The app will call:
  - `POST /auth/email/send-otp`
  - `POST /auth/email/verify-otp`

Suggested request payloads:

- Send OTP: `{ "email": "user@example.com" }`
- Verify OTP: `{ "email": "user@example.com", "otp": "123456" }`

Suggested verify response:

```json
{
  "verified": true,
  "user": {
    "name": "Pavan",
    "email": "user@example.com",
    "location": "India",
    "userType": "household"
  }
}
```

## Next step for full production auth

Replace the current simulated OTP handlers in `src/components/AuthModal.tsx` with:

- Firebase phone auth for phone OTP, or
- backend API calls that send and verify email/phone OTP.
