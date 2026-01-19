import os
import django
import sys

def reproduce_view():
    print("Setting up Django...")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    from rest_framework.test import APIRequestFactory
    from rag.controllers.rag_controller import SearchAPIView
    import chromadb
    print(f"ChromaDB version: {chromadb.__version__}")

    factory = APIRequestFactory()
    view = SearchAPIView.as_view()

    # Case 1: Full payload
    print("\n--- Test 1: Full Payload ---")
    data = {
        "query": "chicken",
        "n_results": 2,
        "cuisines": ["italian"],
        "must_contain": ["tomato"],
        "must_not_contain": ["pork"]
    }
    request = factory.post('/api/v1/rag/search', data, format='json')
    try:
        response = view(request)
        print(f"Status: {response.status_code}")
        print(f"Data: {response.data}")
    except Exception as e:
        print("CRASHED!")
        import traceback
        traceback.print_exc()

    # Case 2: Minimal Payload (like the user might be sending initially)
    print("\n--- Test 2: Minimal Payload ---")
    data = {
        "query": "dinner",
        "n_results": 2
    }
    request = factory.post('/api/v1/rag/search', data, format='json')
    try:
        response = view(request)
        print(f"Status: {response.status_code}")
        print(f"Data: {response.data}")
    except Exception as e:
        print("CRASHED!")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reproduce_view()
