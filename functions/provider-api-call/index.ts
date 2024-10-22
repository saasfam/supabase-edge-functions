import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Helper function to call the appropriate API based on provider
async function fetchFromProvider(provider: string, apiKey: string) {
  let apiUrl;

  // Determine the API URL based on the provider
  switch (provider) {
    case 'RetellAI':
      apiUrl = 'https://api.retellai.com/list-agents';
      break;
    case 'Vapi':
      apiUrl = 'https://api.vapi.ai/your-endpoint'; // Replace with Vapi's API URL
      break;
    default:
      throw new Error('Unsupported provider');
  }

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${provider}: ${response.statusText}`);
  }

  return await response.json();
}

// Main function to handle the HTTP request
Deno.serve(async (req) => {
  try {
    // Handle preflight OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*', // Update as necessary for security
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400', // Cache preflight request for 24 hours
        },
      });
    }

    // Parse the incoming request body
    const { provider, api_key } = await req.json();

    // Validate the request
    if (!provider || !api_key) {
      return new Response(JSON.stringify({ error: 'Provider and API key are required' }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",  // Allow all origins for simplicity
        },
      });
    }

    // Fetch data from the provider's API
    const data = await fetchFromProvider(provider, api_key);

    // Return the fetched data as a response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Ensure CORS is allowed
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Ensure CORS is allowed even on error
      },
    });
  }
});
