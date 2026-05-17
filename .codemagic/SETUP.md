# Codemagic Android Signing Setup

Follow these steps **once** before your first build.

---

## 1. Copy the base64 keystore value

Open `.codemagic/keystore.b64` — the entire single-line string is the
base64-encoded Android keystore.

> **Do not commit this file to a public repo.**
> The `.gitignore` already excludes it, but double-check before pushing.

---

## 2. Create an environment variable group in Codemagic

1. Log in to [codemagic.io](https://codemagic.io).
2. Go to **Teams** → your team → **Global variables & secrets**.
3. Click **+ Add group** and name it exactly: `android_signing`
4. Add the following variables inside that group.
   **Tick "Secure" (encrypt) on every one of them.**

| Variable name          | Value                                    |
|------------------------|------------------------------------------|
| `CM_KEYSTORE`          | *(paste the full content of `keystore.b64`)* |
| `CM_KEYSTORE_PASSWORD` | `Sh0fast@Secure2024!`                    |
| `CM_KEY_ALIAS`         | `shofast-customers`                      |
| `CM_KEY_PASSWORD`      | `Sh0fast@Secure2024!`                    |

5. Save the group.

---

## 3. Connect your repository

1. In Codemagic, go to **Apps** → **+ Add application**.
2. Select your Git provider and choose this repo.
3. Codemagic will automatically detect `codemagic.yaml`.

---

## 4. Trigger a build

Push a commit to `main` (or trigger manually in the dashboard).
The build will:
1. Install Node 22 dependencies
2. Run `npm run build` (Vite + TanStack)
3. Sync Capacitor to the Android project
4. Decode the keystore from `CM_KEYSTORE`
5. Run `./gradlew bundleRelease` with full signing flags
6. Upload the signed `.aab` as a build artifact

---

## Keystore details (for reference)

| Field           | Value                                              |
|-----------------|----------------------------------------------------|
| File            | `shofast-customers.keystore`                       |
| Alias           | `shofast-customers`                                |
| Algorithm       | RSA 2048-bit                                       |
| Valid until     | 2053-10-02 (~27 years)                             |
| DN              | CN=Shofast, OU=Mobile, O=Shofast, L=Lagos, C=NG    |
| SHA-256 fp      | `68:18:A7:B1:49:54:1B:DB:5E:41:61:A4:10:B0:2B:69` |

Store the keystore password somewhere safe (e.g. a team password manager).
If you lose the keystore or password you **cannot** update your Play Store app.

---

## Changing the password (optional)

If you want to rotate the password before your first Play Store submission:

```bash
keytool -storepasswd -keystore .codemagic/shofast-customers.keystore
keytool -keypasswd  -keystore .codemagic/shofast-customers.keystore -alias shofast-customers
```

Then re-encode and update the Codemagic env vars:

```bash
base64 .codemagic/shofast-customers.keystore | tr -d '\n' > .codemagic/keystore.b64
```
