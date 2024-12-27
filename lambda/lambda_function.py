# lambda/lambda_function.py
import json
import anthropic

def lambda_handler(event, context):
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',  # Or specify your domain
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight OPTIONS request
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }

    try:
        body = json.loads(event['body'])
        text = body.get('text')
        target_language = body.get('target_language')

        # Initialize Anthropic client
        client = anthropic.Anthropic(
            api_key='your-api-key'
        )

        # Create translation prompt
        prompt = f"Translate the following text to {target_language}: {text}"

        # Call Claude API
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract translated text
        translated_text = message.content[0].text

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'translated_text': translated_text
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': str(e)
            })
        }