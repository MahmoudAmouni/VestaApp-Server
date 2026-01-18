from rest_framework import serializers


class ShoppingListChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(min_length=1, max_length=2000, required=False)
    audio = serializers.FileField(required=False)
    home_id = serializers.IntegerField(min_value=1)
    laravel_token = serializers.CharField(min_length=10, required=False, allow_blank=False)

    def validate(self, attrs):
        if not attrs.get("message") and not attrs.get("audio"):
            raise serializers.ValidationError("Either 'message' or 'audio' must be provided.")
        return attrs
