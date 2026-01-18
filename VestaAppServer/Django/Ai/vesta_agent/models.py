from django.db import models


class ChatMessage(models.Model):
    home_id = models.IntegerField(db_index=True)
    role = models.CharField(max_length=20) 
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
