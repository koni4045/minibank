import json
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table_name = "Accounts"

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        from_account = body.get("fromAccountId")
        to_account = body.get("toAccountId")
        amount = Decimal(str(body.get("amount", 0)))

        if not from_account or not to_account or amount <= 0:
            return _response(400, {"error": "Invalid transfer request"})

        client = boto3.client("dynamodb")

        client.transact_write_items(
            TransactItems=[
                {
                    "Update": {
                        "TableName": table_name,
                        "Key": {"accountId": {"S": from_account}},
                        "UpdateExpression": "SET balance = balance - :amt",
                        "ConditionExpression": "balance >= :amt",
                        "ExpressionAttributeValues": {":amt": {"N": str(amount)}}
                    }
                },
                {
                    "Update": {
                        "TableName": table_name,
                        "Key": {"accountId": {"S": to_account}},
                        "UpdateExpression": "SET balance = balance + :amt",
                        "ExpressionAttributeValues": {":amt": {"N": str(amount)}}
                    }
                }
            ]
        )

        return _response(200, {"message": "Transfer successful"})

    except ClientError as e:
        if e.response["Error"]["Code"] == "TransactionCanceledException":
            return _response(400, {"error": "Insufficient funds or invalid account"})
        print(f"Error: {str(e)}")
        return _response(500, {"error": str(e)})
    except Exception as e:
        print(f"Error: {str(e)}")
        return _response(500, {"error": str(e)})


def _response(status, body):
    return {
        "statusCode": status,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body)
    }