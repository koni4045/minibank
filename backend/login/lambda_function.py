import json
import bcrypt
import jwt
import time
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users")

JWT_SECRET = "dev-secret-change-this-later"  # placeholder for now, more on this below

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return _response(400, {"error": "Email and password required"})

        response = table.get_item(Key={"email": email})
        user = response.get("Item")

        if not user:
            return _response(401, {"error": "Invalid email or password"})

        stored_hash = user["passwordHash"].encode("utf-8")

        if not bcrypt.checkpw(password.encode("utf-8"), stored_hash):
            return _response(401, {"error": "Invalid email or password"})

        # Build the JWT
        payload = {
            "email": email,
            "accountId": user["accountId"],
            "exp": int(time.time()) + 3600  # expires in 1 hour
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return _response(200, {"token": token, "accountId": user["accountId"]})

    except Exception as e:
        print(f"Error: {str(e)}")
        return _response(500, {"error": str(e)})


def _response(status, body):
    return {
        "statusCode": status,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(body)
    }