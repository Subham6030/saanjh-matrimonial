# Saanjh Matrimony

A premium, front-end-only matrimonial demo built with React, Vite, Tailwind CSS and React Router. Every profile, conversation, statistic and payment is fictional sample data.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Demo accounts

| Role   | Email                  | Password    |
| ------ | ---------------------- | ----------- |
| Member | `demo@saanjh.example`  | `demo1234`  |
| Admin  | `admin@saanjh.example` | `admin1234` |

You can also create a new account or use the demo entry points on the login page.

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the Vite dev server    |
| `npm run build`   | Create a production build    |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

## Features

- Public marketing pages, profile directory and profile detail views
- Member dashboard with compatibility-led recommendations and profile completeness
- Profile creation/editing wizard and partner preferences
- Search, shortlist, interests, messaging and notifications
- Demo subscription plans and checkout flow
- Account settings with privacy, notification, appearance and demo-data controls
- Admin area for profile moderation, subscriptions, reports and platform settings
- Responsive layouts, light/dark/system themes and local persistence

## Routes

### Public

`/`, `/login`, `/register`, `/about`, `/contact`, `/help`, `/privacy`, `/terms`, `/profile/:id`

### Member (sign-in required)

`/dashboard`, `/matches`, `/search`, `/shortlist`, `/interests`, `/messages`, `/notifications`, `/plans`, `/checkout`, `/settings`, `/preferences`, `/profile/me`, `/profile/edit`

Aliases: `/partner-preferences` redirects to `/preferences`; `/membership` redirects to `/plans`.

### Admin

`/admin`, `/admin/profiles`, `/admin/subscriptions`, `/admin/reports`, `/admin/settings`

Admin access is simulated in the front end only and is not real authorization.

## Demo data and persistence

- Seeded profiles are `p1`–`p24`, with several marked as new today.
- Demo conversations, interests, notifications and subscriptions are preloaded for the member account.
- State is stored in `localStorage` under keys prefixed with `saanjh.`.
- Passwords, payment credentials and tokens are never stored.
- Reset demo data from **Settings → Demo & data** or **Admin → Settings**.

## Limitations

This is a demonstration project. There is no backend, authentication service, payment processing, email delivery or persistent moderation. Admin checks and plan limits are illustrative only.
