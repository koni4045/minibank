import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Accounts")

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def handler(event, context):
    try:
        account_id = event.get("queryStringParameters", {}).get("accountId") if event.get("queryStringParameters") else None

        if not account_id:
            return _response(400, {"error": "accountId is required"})

        response = table.get_item(Key={"accountId": account_id})
        item = response.get("Item")

        if not item:
            return _response(404, {"error": "Account not found"})

        return _response(200, json.loads(json.dumps(item, default=decimal_default)))

    except Exception as e:
        print(f"Error: {str(e)}")
        return _response(500, {"error": str(e)})


def _response(status, body):
    return {
        "statusCode": status,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body)
    }