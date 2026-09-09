# Chinese Street Mini App — HTML/CSS/JS

Pure static Telegram Mini App. No TypeScript, TSX, Vite, npm or package.json required.

## Deploy to Vercel

Import this folder/repository into Vercel and deploy as a static site. Leave Build Command empty.

After deployment, put the Vercel HTTPS URL into the Python bot:

`MINI_APP_URL=https://your-project.vercel.app`

## Telegram identity

The real Telegram first name is read from `Telegram.WebApp.initDataUnsafe.user` when the page is opened inside Telegram. In a normal browser preview, Telegram user data is unavailable, so the UI shows `Дӯст` instead.

## Premium

Free users cannot see Premium Chinese phrases, pinyin, translations, notes, or audio controls. They only see a locked Premium card. Selecting a plan opens the checkout UI. Receipt capture uses the device camera only; there is no file picker.

The current static demo sends only request metadata through `Telegram.WebApp.sendData`. A Python backend/bot is required to securely receive the actual image bytes, store the receipt, and implement real admin approval and Premium expiry.
