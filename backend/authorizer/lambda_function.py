import jwt

JWT_SECRET = "dev-secret-change-this-later"

def handler(event, context):
    token = event.get("authorizationToken", "")

    if token.startswith("Bearer "):
        token = token[7:]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return generate_policy(payload["email"], "Allow", event["methodArn"], payload)
    except jwt.ExpiredSignatureError:
        return generate_policy("user", "Deny", event["methodArn"])
    except jwt.InvalidTokenError:
        return generate_policy("user", "Deny", event["methodArn"])


def generate_policy(principal_id, effect, resource, context_data=None):
    policy = {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": resource
                }
            ]
        }
    }
    if context_data:
        policy["context"] = {
            "email": context_data["email"],
            "accountId": context_data["accountId"]
        }
    return policy