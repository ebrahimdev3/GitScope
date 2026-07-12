GitScope

GitScope is a modern GitHub Profile Analyzer built with FastAPI and Vanilla JavaScript.

It helps developers analyze GitHub profiles by providing detailed insights, repository statistics, technology detection, visual charts, and developer metrics in a clean and responsive interface.

Features

- GitHub Profile Analysis
- Repository Statistics
- Developer Score
- Developer Level
- Tech Stack Detection
- Repository Timeline
- Charts & Visualizations
- Quick Search
- Recent Search History
- GitHub OAuth Login
- Authenticated GitHub API Requests (5000 requests/hour)

Tech Stack

Frontend

- HTML5
- CSS3
- JavaScript (ES Modules)
- Chart.js

Backend

- Python
- FastAPI
- HTTPX
- GitHub OAuth

Project Structure

GitScope/
├── Backend/
├── Frontend/
├── README.md
└── .gitignore

Getting Started

Clone the repository

git clone https://github.com/YOUR_USERNAME/GitScope.git

Backend

cd Backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload

Frontend

Open the Frontend folder using your preferred local server.

Environment Variables

Create a ".env" file inside the "Backend" folder.

GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

Roadmap

- User Dropdown Menu
- Logout
- User Settings
- Developer Card Export
- GitHub Profile Comparison
- Contribution Insights
- Advanced Analytics

License

This project is open source and available under the MIT License.