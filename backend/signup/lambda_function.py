import json
import bcrypt
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table("Users")
accounts_table = dynamodb.Table("Accounts")

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        name = body.get("name", "").strip()

        if not email or not password:
            return _response(400, {"error": "Email and password required"})

        if len(password) < 8:
            return _response(400, {"error": "Password must be at least 8 characters"})

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        account_id = "acc_" + email.split("@")[0]

        # Create the user (fails if already exists)
        users_table.put_item(
            Item={
                "email": email,
                "passwordHash": hashed.decode("utf-8"),
                "accountId": account_id,
                "name": name
            },
            ConditionExpression="attribute_not_exists(email)"
        )

        # Create their bank account with a starting balance
        accounts_table.put_item(
            Item={
                "accountId": account_id,
                "balance": 1000,
                "currency": "USD",
                "ownerEmail": email,
                "ownerName": name
            }
        )

        return _response(201, {"message": "User created", "accountId": account_id})

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return _response(409, {"error": "User already exists"})
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