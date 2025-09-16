"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, ExternalLink, Shield, Zap, Globe, Key } from "lucide-react"

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm border border-cyan-500/20">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Webhook API Documentation
              </h1>
              <p className="text-gray-400 mt-1">Complete integration guide for webhooks, N8N, and push notifications</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Events
            </Badge>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <Shield className="h-3 w-3 mr-1" />
              Secure Authentication
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              <Key className="h-3 w-3 mr-1" />
              API Key Management
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-cyan-500/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">System Overview</CardTitle>
                <CardDescription>
                  A comprehensive webhook system designed for seamless integration with N8N, bots, and push notification
                  services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Key Features</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-cyan-400 rounded-full" />
                        Real-time webhook processing
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-400 rounded-full" />
                        Multiple authentication methods
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full" />
                        Event processing and routing
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-purple-400 rounded-full" />
                        Retry mechanisms and error handling
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                        Rate limiting and security
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Base URL</h3>
                    <CodeBlock code="https://your-domain.com/api" language="text" id="base-url" />
                    <h3 className="text-lg font-semibold text-white">Rate Limits</h3>
                    <div className="text-gray-300 space-y-1">
                      <p>• Webhook endpoints: 100 requests/minute</p>
                      <p>• Admin endpoints: 50 requests/minute</p>
                      <p>• Signed webhooks: 200 requests/minute</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="auth" className="space-y-6">
            <Card className="bg-gray-900 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Authentication Methods</CardTitle>
                <CardDescription>Multiple authentication options to secure your webhook integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">1. API Key Authentication</h3>
                  <p className="text-gray-300">Include your API key in the request header:</p>
                  <CodeBlock
                    code={`curl -X POST https://your-domain.com/api/webhooks/receive \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key-here" \\
  -d '{"event_type": "user.created", "source": "app", "data": {...}}'`}
                    language="bash"
                    id="api-key-example"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">2. Webhook Signature Verification</h3>
                  <p className="text-gray-300">For enhanced security, verify webhook signatures:</p>
                  <CodeBlock
                    code={`curl -X POST https://your-domain.com/api/webhooks/receive \\
  -H "Content-Type: application/json" \\
  -H "x-webhook-signature: sha256=calculated-signature" \\
  -d '{"event_type": "payment.completed", "source": "stripe", "data": {...}}'`}
                    language="bash"
                    id="signature-example"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">3. Admin Authentication</h3>
                  <p className="text-gray-300">Admin endpoints require special authentication:</p>
                  <CodeBlock
                    code={`curl -X POST https://your-domain.com/api/admin/api-keys \\
  -H "Content-Type: application/json" \\
  -H "x-admin-key: your-admin-key" \\
  -d '{"name": "N8N Integration", "permissions": ["webhook.receive"]}'`}
                    language="bash"
                    id="admin-example"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <div className="grid gap-6">
              {/* Webhook Endpoints */}
              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Webhook Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">POST</Badge>
                      <code className="text-cyan-400">/api/webhooks/receive</code>
                    </div>
                    <p className="text-gray-300">General webhook receiver for all event types.</p>
                    <CodeBlock
                      code={`{
  "event_type": "user.created",
  "source": "application",
  "data": {
    "user_id": "123",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}`}
                      language="json"
                      id="webhook-payload"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">POST</Badge>
                      <code className="text-cyan-400">/api/webhooks/n8n</code>
                    </div>
                    <p className="text-gray-300">Specialized endpoint for N8N workflow events.</p>
                    <CodeBlock
                      code={`{
  "event": "workflow_completed",
  "workflow_id": "workflow-123",
  "execution_id": "exec-456",
  "data": {
    "status": "success",
    "output": {...}
  }
}`}
                      language="json"
                      id="n8n-payload"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">POST</Badge>
                      <code className="text-cyan-400">/api/webhooks/push-notification</code>
                    </div>
                    <p className="text-gray-300">Send push notifications through the webhook system.</p>
                    <CodeBlock
                      code={`{
  "title": "New Message",
  "body": "You have a new message from John",
  "data": {
    "message_id": "msg-123",
    "sender": "john@example.com"
  },
  "target": "user",
  "target_id": "user-456"
}`}
                      language="json"
                      id="push-payload"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Admin Endpoints */}
              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Admin Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">GET</Badge>
                      <code className="text-cyan-400">/api/webhooks/events</code>
                    </div>
                    <p className="text-gray-300">Retrieve webhook events with filtering options.</p>
                    <CodeBlock
                      code="GET /api/webhooks/events?limit=50&processed=false&event_type=user.created"
                      language="text"
                      id="events-get"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">POST</Badge>
                      <code className="text-cyan-400">/api/admin/api-keys</code>
                    </div>
                    <p className="text-gray-300">Generate new API keys for webhook access.</p>
                    <CodeBlock
                      code={`{
  "name": "N8N Integration",
  "permissions": ["webhook.receive", "events.read"],
  "expires_in_days": 365
}`}
                      language="json"
                      id="api-key-create"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card className="bg-gray-900 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Outgoing Webhooks</CardTitle>
                <CardDescription>
                  Configure endpoints to receive webhook notifications when events occur.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Creating Webhook Endpoints</h3>
                  <CodeBlock
                    code={`curl -X POST https://your-domain.com/api/admin/webhook-endpoints \\
  -H "Content-Type: application/json" \\
  -H "x-admin-key: your-admin-key" \\
  -d '{
    "name": "Slack Notifications",
    "url": "https://hooks.slack.com/services/...",
    "secret": "webhook-secret-key",
    "events": ["user.created", "payment.completed"]
  }'`}
                    language="bash"
                    id="webhook-endpoint-create"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Webhook Payload Format</h3>
                  <p className="text-gray-300">Your endpoint will receive payloads in this format:</p>
                  <CodeBlock
                    code={`{
  "event_type": "user.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "user_id": "123",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}`}
                    language="json"
                    id="outgoing-webhook-payload"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Signature Verification</h3>
                  <p className="text-gray-300">Verify webhook authenticity using the signature header:</p>
                  <CodeBlock
                    code={`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  const providedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(providedSignature)
  );
}`}
                    language="javascript"
                    id="signature-verification"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">N8N Integration</CardTitle>
                  <CardDescription>Connect your N8N workflows to the webhook system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Setup Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Generate an API key from the admin panel</li>
                      <li>Add a Webhook node to your N8N workflow</li>
                      <li>
                        Configure the webhook URL:{" "}
                        <code className="text-cyan-400">https://your-domain.com/api/webhooks/n8n</code>
                      </li>
                      <li>Add the API key as a query parameter or header</li>
                    </ol>
                  </div>
                  <CodeBlock
                    code={`// N8N Webhook URL with API key
https://your-domain.com/api/webhooks/n8n?api_key=your-api-key

// Or use header authentication
URL: https://your-domain.com/api/webhooks/n8n
Headers: {
  "x-api-key": "your-api-key"
}`}
                    language="text"
                    id="n8n-setup"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Bot Integration</CardTitle>
                  <CardDescription>Integrate chatbots and automated systems.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Discord Bot Example</h3>
                    <CodeBlock
                      code={`const axios = require('axios');

async function sendWebhook(eventType, data) {
  try {
    const response = await axios.post('https://your-domain.com/api/webhooks/receive', {
      event_type: eventType,
      source: 'discord_bot',
      data: data
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WEBHOOK_API_KEY
      }
    });
    
    console.log('Webhook sent:', response.data);
  } catch (error) {
    console.error('Webhook failed:', error.response?.data);
  }
}

// Usage
await sendWebhook('message.received', {
  user_id: '123456789',
  channel_id: '987654321',
  message: 'Hello from Discord!',
  timestamp: new Date().toISOString()
});`}
                      language="javascript"
                      id="discord-bot-example"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Push Notifications</CardTitle>
                  <CardDescription>Send push notifications through the webhook system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Mobile App Integration</h3>
                    <CodeBlock
                      code={`// Send push notification via webhook
fetch('https://your-domain.com/api/webhooks/push-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    title: 'Order Update',
    body: 'Your order #12345 has been shipped!',
    data: {
      order_id: '12345',
      tracking_number: 'TRK123456789'
    },
    target: 'user',
    target_id: 'user-789'
  })
});`}
                      language="javascript"
                      id="push-notification-example"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Complete Integration Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">E-commerce Order Processing</h3>
                    <CodeBlock
                      code={`// 1. Order created webhook
curl -X POST https://your-domain.com/api/webhooks/receive \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key" \\
  -d '{
    "event_type": "order.created",
    "source": "ecommerce_app",
    "data": {
      "order_id": "ORD-12345",
      "customer_id": "CUST-789",
      "total": 99.99,
      "items": [
        {"product_id": "PROD-001", "quantity": 2, "price": 49.99}
      ],
      "created_at": "2024-01-01T10:00:00Z"
    }
  }'

// 2. Payment processed webhook
curl -X POST https://your-domain.com/api/webhooks/receive \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key" \\
  -d '{
    "event_type": "payment.completed",
    "source": "payment_gateway",
    "data": {
      "order_id": "ORD-12345",
      "payment_id": "PAY-456",
      "amount": 99.99,
      "status": "completed",
      "processed_at": "2024-01-01T10:05:00Z"
    }
  }'`}
                      language="bash"
                      id="ecommerce-example"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">User Lifecycle Management</h3>
                    <CodeBlock
                      code={`// User registration flow
const webhookEvents = [
  {
    event_type: "user.registered",
    source: "auth_service",
    data: {
      user_id: "user-123",
      email: "john@example.com",
      registration_method: "email",
      timestamp: "2024-01-01T09:00:00Z"
    }
  },
  {
    event_type: "user.email_verified",
    source: "auth_service", 
    data: {
      user_id: "user-123",
      verified_at: "2024-01-01T09:15:00Z"
    }
  },
  {
    event_type: "user.profile_completed",
    source: "user_service",
    data: {
      user_id: "user-123",
      profile_completion: 100,
      completed_at: "2024-01-01T09:30:00Z"
    }
  }
];

// Send each event
for (const event of webhookEvents) {
  await fetch('https://your-domain.com/api/webhooks/receive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key'
    },
    body: JSON.stringify(event)
  });
}`}
                      language="javascript"
                      id="user-lifecycle-example"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Error Handling & Retries</h3>
                    <CodeBlock
                      code={`async function sendWebhookWithRetry(payload, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch('https://your-domain.com/api/webhooks/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.WEBHOOK_API_KEY
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Webhook sent successfully:', result);
        return result;
      }
      
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      
    } catch (error) {
      attempt++;
      console.error(\`Webhook attempt \${attempt} failed:\`, error.message);
      
      if (attempt >= maxRetries) {
        throw new Error(\`Webhook failed after \${maxRetries} attempts\`);
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`}
                      language="javascript"
                      id="error-handling-example"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-cyan-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400">
              <p>Need help? Contact our support team or check the status page.</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Status Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
