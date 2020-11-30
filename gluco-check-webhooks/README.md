# gluco-check-webhooks

These are HTTP Webhooks running as Google Firebase Functions. 
There's not much business logic in this package, because webhooks just 
forward requests to `gluco-check-core`


## Validate Nightscout URL
Can be used by the frontend to verify a user's Nightscout URL/Token is working

## Conversation
Webhook that accepts intents from `gluco-check-action`