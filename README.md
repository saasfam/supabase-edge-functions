# Supabase Edge Function Setup and Usage

This guide walks you through the process of setting up a Supabase Edge Function, deploying it, and testing it using `curl`.

## Prerequisites

Before you begin, make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (v1.0 or later)
- [Git](https://git-scm.com/)
- Supabase Project (create one from [app.supabase.io](https://app.supabase.io/))

---

## 1. Install Supabase CLI

If you haven't installed the Supabase CLI, run the following command:

```bash
npm install -g supabase
```

Verify that the Supabase CLI is installed:

```bash
supabase --version
```

---

## 2. Log in to Supabase

Log in to your Supabase account using the CLI:

```bash
supabase login
```

This will open a browser window asking for your Supabase credentials. Once you log in, you're ready to interact with Supabase from the CLI.

---

## 3. Create a New Supabase Project

If you haven't created a Supabase project yet, you can do so by visiting the [Supabase Dashboard](https://app.supabase.io/projects). 

Once you've created a project, you'll have access to the `project-ref` and `API keys`, which you'll need later.

---

## 4. Initialize a Supabase Project Locally

Now, initialize your local project by running:

```bash
supabase init
```

This will create a `.supabase` directory and a `supabase/config.toml` file, which contains the details of your Supabase project.

---

## 5. Create a New Edge Function

To create a new edge function, run the following command:

```bash
supabase functions new <function-name>
```

For example, to create a function called `hello-world`:

```bash
supabase functions new hello-world
```

This will create a new directory under `supabase/functions/hello-world`, with a default `index.ts` file where you can write your function logic.

### Example Function (`index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

serve(async (req) => {
  return new Response("Hello, Supabase Edge Functions!", {
    headers: { "Content-Type": "text/plain" },
  });
});
```

---

## 6. Test the Edge Function Locally

You can run and test your function locally before deploying it. First, navigate to the directory containing your function:

```bash
cd supabase/functions/hello-world
```

Then, run the function locally using the `serve` command:

```bash
supabase functions serve hello-world
```

The function will run on `http://localhost:54321/functions/v1/<function-name>`.

To test it using `curl`, open a new terminal window and run:

```bash
curl http://localhost:54321/functions/v1/hello-world
```

You should see the response:

```
Hello, Supabase Edge Functions!
```

---

## 7. Deploy the Edge Function to Supabase

Once you're satisfied with your local testing, you can deploy the function to Supabase. Run the following command:

```bash
supabase functions deploy hello-world
```

The function will be deployed to Supabase and made available at the URL:

```
https://<project-ref>.supabase.co/functions/v1/hello-world
```

Replace `<project-ref>` with your actual Supabase project reference (you can find this in the Supabase dashboard under Project Settings > API).

---

## 8. Test the Deployed Function Using `curl`

You can test the deployed function using `curl`:

```bash
curl https://<project-ref>.supabase.co/functions/v1/hello-world
```

You should receive the same response as your local test:

```
Hello, Supabase Edge Functions!
```

---

## 9. Manage and Monitor Your Functions

You can manage, view logs, and monitor your deployed functions from the Supabase Dashboard under **Functions**. This includes insights on execution time, memory usage, and more.

---

## 10. Invoking Edge Functions with Headers (Authorization)

You may need to invoke your function with an API key for authorization. Supabase functions often require the `apikey` header for production requests:

```bash
curl -H "Authorization: Bearer <your-api-key>" https://<project-ref>.supabase.co/functions/v1/hello-world
```

You can find your API key in the Supabase Dashboard under **Project Settings > API > Anon Key**.

---

## Conclusion

You have successfully created, deployed, and tested an Edge Function using Supabase! You can now create more complex functions and integrate them into your applications.

For more advanced use cases, including environment variables, authentication, and database access, refer to the [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions).

---

### Example Edge Function with Query Parameters

Here's an example of an edge function that takes query parameters:

```typescript
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") || "world";
  return new Response(`Hello, ${name}!`, {
    headers: { "Content-Type": "text/plain" },
  });
});
```

You can test this by running:

```bash
curl "https://<project-ref>.supabase.co/functions/v1/hello-world?name=Supabase"
```

This should return:

```
Hello, Supabase!
```

---

## Common Issues

### 1. **CORS Errors**:
   If you encounter CORS issues, you can add CORS headers to your response:

```typescript
new Response("Hello, world!", {
  headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" },
});
```

---

### 2. **Function Not Deploying**:
   - Ensure your function has the correct permissions in your Supabase project.
   - Make sure your project’s API key is correctly configured.

---

### Additional Resources:
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)

---
