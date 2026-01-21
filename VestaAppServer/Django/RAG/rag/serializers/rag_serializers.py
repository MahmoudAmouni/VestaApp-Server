from __future__ import annotations

from rest_framework import serializers

class SearchRequestSerializer(serializers.Serializer):
    query = serializers.CharField(min_length=2, max_length=500)
    n_results = serializers.IntegerField(min_value=1, max_value=50, default=4)
    seed = serializers.IntegerField(required=False, allow_null=True)
    
    cuisines = serializers.ListField(
        child=serializers.CharField(min_length=2, max_length=64),
        required=False,
        allow_empty=True,
    )
    must_contain = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=64),
        required=False,
        allow_empty=True,
    )
    must_not_contain = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=64),
        required=False,
        allow_empty=True,
    )

class AnswerRequestSerializer(SearchRequestSerializer):
    question = serializers.CharField(min_length=2, max_length=2000)
