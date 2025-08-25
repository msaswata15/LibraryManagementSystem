import requests
import random
import time

# --- CONFIG ---
API_BASE_URL = "http://localhost:8080"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaWJyYXJpYW4yIiwiaWF0IjoxNzU2MTAxMjI1LCJleHAiOjE3NTYxMzcyMjV9.JrzhNpGieC7rux32h35KL43SBln8jLrvKMH7hTaJ9LY"  # Use your librarian JWT
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {JWT_TOKEN}"
}

# --- MEMBER GENERATION ---
def random_member(i):
    return {
        "name": f"Member {i}",
        "email": f"member{i}@example.com",
        "address": f"{random.randint(1, 999)} Main St",
        "phone": f"+1-555-{random.randint(1000,9999)}"
    }

def create_members(total=100):
    member_ids = []
    for i in range(1, total+1):
        payload = random_member(i)
        resp = requests.post(f"{API_BASE_URL}/members", json=payload, headers=HEADERS)
        if resp.status_code in (200, 201):
            member_id = resp.json().get("id")
            member_ids.append(member_id)
            print(f"[Member {i}/{total}] Added: {payload['name']}")
        else:
            print(f"[Member {i}/{total}] Failed: {resp.status_code} - {resp.text}")
        # time.sleep(0.01)
    return member_ids

# --- BOOK FETCH ---
def fetch_book_ids():
    resp = requests.get(f"{API_BASE_URL}/books", headers=HEADERS)
    if resp.status_code == 200:
        return [book["id"] for book in resp.json()]
    print(f"Failed to fetch books: {resp.status_code} - {resp.text}")
    return []

# --- BORROWING GENERATION ---
def random_borrowing(member_id, book_id):
    return {
        "memberId": member_id,
        "bookId": book_id,
        # Add more fields if your API requires (e.g., borrowDate, dueDate)
    }

def create_borrowings(member_ids, book_ids, total=200):
    for i in range(1, total+1):
        member_id = random.choice(member_ids)
        book_id = random.choice(book_ids)
        payload = random_borrowing(member_id, book_id)
        resp = requests.post(f"{API_BASE_URL}/borrowings", json=payload, headers=HEADERS)
        if resp.status_code in (200, 201):
            print(f"[Borrowing {i}/{total}] Member {member_id} borrowed Book {book_id}")
        else:
            print(f"[Borrowing {i}/{total}] Failed: {resp.status_code} - {resp.text}")
        # time.sleep(0.01)

def main():
    print("Creating members...")
    member_ids = create_members(100)
    print("Fetching books...")
    book_ids = fetch_book_ids()
    if not book_ids or not member_ids:
        print("Cannot proceed: missing book or member IDs.")
        return
    print("Creating borrowings...")
    create_borrowings(member_ids, book_ids, 200)

if __name__ == "__main__":
    main()
