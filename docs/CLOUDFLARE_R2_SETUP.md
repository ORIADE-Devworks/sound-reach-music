# Cloudflare R2 Setup Guide — SoundReach Music

## Overview

SoundReach uses Cloudflare R2 for storing audio files and cover art. All access is through **signed URLs only** — no public bucket access.

---

## 1. Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2 Object Storage**
2. Click **Create bucket**
3. Name: `soundreach-media`
4. Location: Choose nearest region to your users
5. **Do NOT enable public access** — keep the bucket private

---

## 2. Create API Token

1. Go to **R2** → **Manage R2 API Tokens**
2. Click **Create API Token**
3. Permissions: **Object Read & Write**
4. Specify bucket: `soundreach-media`
5. Save the credentials:
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**

---

## 3. Folder Structure

```
soundreach-media/
├── audio/          # MP3, WAV, FLAC, AAC files
│   └── {user_id}/{uuid}.{ext}
└── covers/         # JPEG, PNG cover art
    └── {user_id}/{uuid}.{ext}
```

---

## 4. Environment Variables

Add these to your Supabase Edge Functions secrets (or `.env`):

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=soundreach-media
R2_ENDPOINT=https://{account_id}.r2.cloudflarestorage.com
```

---

## 5. Signed URL Generation (Edge Function)

Create a Supabase Edge Function `r2-signed-url` to generate presigned upload/download URLs.

### Upload Flow:
1. Client requests a presigned upload URL from the edge function
2. Edge function validates auth + file type + size limits
3. Client uploads directly to R2 using the presigned URL
4. Client confirms upload, edge function stores the R2 key in the `songs` table

### Download/Stream Flow:
1. Client requests a presigned download URL
2. Edge function validates auth + checks song status is 'approved'
3. Returns a signed URL valid for **5–10 minutes**

### Example Edge Function (`supabase/functions/r2-signed-url/index.ts`):

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: Deno.env.get("R2_ENDPOINT")!,
  credentials: {
    accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
  },
});

// Generate upload URL
async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: Deno.env.get("R2_BUCKET_NAME")!,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: 600 }); // 10 min
}

// Generate download URL
async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: Deno.env.get("R2_BUCKET_NAME")!,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
}
```

---

## 6. File Validation Rules

### Allowed Audio Types:
| MIME Type      | Extension |
|---------------|-----------|
| audio/mpeg    | .mp3      |
| audio/wav     | .wav      |
| audio/flac    | .flac     |
| audio/aac     | .aac      |
| audio/mp4     | .m4a      |

### Allowed Image Types:
| MIME Type   | Extension |
|------------|-----------|
| image/jpeg | .jpg      |
| image/png  | .png      |
| image/webp | .webp     |

### Size Limits:
- **Audio**: Max 50 MB
- **Cover Art**: Max 5 MB

---

## 7. Security Checklist

- [x] R2 bucket is **private** (no public access)
- [x] All URLs are **signed** with expiration (5–10 min)
- [x] File MIME type validated server-side before generating upload URL
- [x] File size validated server-side
- [x] Only authenticated users can request upload URLs
- [x] Only users with `artist` role can upload songs
- [x] Download URLs only generated for `approved` songs
- [x] R2 credentials stored as **secrets**, never exposed to client
- [x] Upload keys use `{user_id}/{uuid}` pattern to prevent overwrites
- [x] Rate limiting on upload endpoint (recommended: 10 uploads/hour/user)

---

## 8. CORS Configuration

In Cloudflare R2 bucket settings, add CORS rules:

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 9. Integration with Supabase

### Song Upload Flow:
1. Artist fills out song form (title, ISRC, genre, etc.)
2. Frontend requests presigned upload URLs for audio + cover
3. Files upload directly to R2
4. Frontend calls Supabase to insert song row with R2 keys
5. Song status = `pending` — awaits admin approval
6. Admin approves → status = `approved` → song is publicly visible

### Streaming Flow:
1. User clicks play on an approved song
2. Frontend requests signed download URL via edge function
3. Edge function returns temporary URL
4. Audio player loads the signed URL
5. `increment_play_count` RPC called to track the play
