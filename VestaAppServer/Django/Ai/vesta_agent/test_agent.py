from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch, MagicMock, Mock
from io import BytesIO


class AgentChatViewTestCase(APITestCase):
    """Test cases for the Vesta Agent Chat endpoint."""

    def setUp(self):
        """Set up test fixtures."""
        self.url = '/api/agent/chat'
        self.valid_payload = {
            'home_id': 1,
            'message': 'Add milk to my shopping list',
            'laravel_token': 'test-token-123'
        }

    @patch('vesta_agent.services.agents.vesta_agent.VestaAgentService.run')
    def test_agent_chat_with_text_message_success(self, mock_service):
        """Test successful chat with text message."""
        mock_service.return_value = {
            'response': 'I have added milk to your shopping list.',
            'action_taken': True
        }

        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response', response.data)
        self.assertEqual(response.data['response'], 'I have added milk to your shopping list.')
        mock_service.assert_called_once()

    @patch('vesta_agent.views.agent.OpenAI')
    @patch('vesta_agent.services.agents.vesta_agent.VestaAgentService.run')
    def test_agent_chat_with_audio_message_success(self, mock_service, mock_openai):
        """Test successful chat with audio file (mocking OpenAI transcription)."""
        mock_client = MagicMock()
        mock_transcription = MagicMock()
        mock_transcription.text = 'Turn on the living room lights'
        mock_client.audio.transcriptions.create.return_value = mock_transcription
        mock_openai.return_value = mock_client

        mock_service.return_value = {
            'response': 'I have turned on the living room lights.',
            'action_taken': True
        }

        audio_content = b'fake audio content'
        audio_file = BytesIO(audio_content)
        audio_file.name = 'voice.m4a'

        payload = {
            'home_id': 1,
            'audio': audio_file,
            'laravel_token': 'test-token-123'
        }

        response = self.client.post(self.url, payload, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response', response.data)
        mock_openai.assert_called_once()
        mock_service.assert_called_once()

    def test_agent_chat_without_message_or_audio_fails(self):
        """Test validation error when neither message nor audio is provided."""
        payload = {
            'home_id': 1,
            'laravel_token': 'test-token-123'
        }

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data or response.json())

    def test_agent_chat_without_home_id_fails(self):
        """Test validation error when home_id is missing."""
        payload = {
            'message': 'Add milk to my shopping list',
            'laravel_token': 'test-token-123'
        }

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('vesta_agent.services.agents.vesta_agent.VestaAgentService.run')
    def test_agent_chat_with_invalid_content_fails(self, mock_service):
        """Test security validation rejection for malicious content."""
        payload = {
            'home_id': 1,
            'message': '<script>alert("xss")</script>',
            'laravel_token': 'test-token-123'
        }

        response = self.client.post(self.url, payload, format='json')

        # Should fail validation before reaching the service
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Security Restriction', str(response.data.get('message', '')))
        mock_service.assert_not_called()
