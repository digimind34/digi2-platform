def has_active_subscription(user):
    if not user or not user.is_authenticated:
        return False

    subscription = getattr(user, "subscription", None)

    if not subscription:
        return False

    return (
        subscription.active is True
        and subscription.plan != "free"
    )
