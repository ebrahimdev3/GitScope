GitScope

GitScope is a GitHub profile analyzer built with FastAPI and Vanilla JavaScript.

It retrieves public GitHub profile and repository data and turns it into a set of statistics, visualizations, technology indicators, repository information, and custom GitHub-based metrics.

The project also includes GitHub OAuth authentication and a profile comparison feature.

Features

GitHub Profile Analysis

Enter any GitHub username to retrieve and analyze available public profile information, including:

- Public repositories
- Followers
- Following
- Public gists
- Profile information
- Company
- Location
- Personal website

Repository Analysis

GitScope analyzes the user's repositories and displays:

- Repository count
- Total stars
- Forks
- Watchers
- Open issues
- Primary programming languages
- Creation date
- Last update date
- Default branch
- Archived/active status
- Repository links

Developer Score

GitScope calculates a custom score from 0–100 based on selected GitHub metrics.

The current calculation considers:

- Number of public repositories
- Followers
- Total repository stars
- Number of detected programming languages
- Recently updated repositories
- Profile completeness

The score is a GitScope-specific metric and is not an official GitHub ranking or an objective measurement of programming ability.

Developer Level

The score is mapped to a GitScope-defined level:

Score| Level
90–100| Elite Developer
75–89| Advanced Developer
50–74| Intermediate Developer
25–49| Beginner Developer
0–24| New Developer

These labels describe the application's scoring model and should not be interpreted as professional qualifications.

Technology Detection

GitScope estimates technologies used across repositories.

Detection currently combines:

- Repository primary language
- Repository name
- Repository description

The application checks for technology keywords such as:

- React
- Next.js
- Vue
- Angular
- Express
- FastAPI
- Django
- Flask
- Laravel
- TailwindCSS
- Bootstrap
- Docker

This is a heuristic based on GitHub repository metadata, not source-code analysis.

Charts

GitScope generates visualizations for:

- Programming language distribution
- Top repositories by stars

Charts are rendered using Chart.js.

Repository Timeline

Repositories are displayed with their:

- Creation date
- Last update
- Default branch
- Current active/archived state

Search History

GitScope keeps up to 10 recent searches in the browser's "localStorage".

Users can:

- Reuse recent searches
- View search history
- Clear search history

The history is stored locally in the browser.

GitHub Comparison

Two GitHub usernames can be compared using selected metrics:

- Public repositories
- Followers
- Total stars
- Developer Score
- Top programming language
- Public gists

The application also calculates a metric-by-metric comparison result.

This comparison is intended as a visualization of GitHub data, not as an objective ranking of developers.

GitHub OAuth

Users can authenticate with GitHub.

The current authentication flow is:

Browser
   │
   │ GitHub OAuth
   ▼
GitHub
   │
   │ Authorization code
   ▼
GitScope callback
   │
   ▼
FastAPI /auth/github
   │
   ▼
GitHub OAuth API
   │
   │ Access token
   ▼
Browser

Authenticated requests can access the user's authenticated GitHub API context.

Architecture

                    ┌─────────────────────┐
                    │       Browser       │
                    │                     │
                    │ HTML / CSS / JS     │
                    │ Chart.js            │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌──────────────────┐
       │  GitHub REST API│          │   FastAPI        │
       │                 │          │                  │
       │ Profiles        │          │ OAuth exchange   │
       │ Repositories    │          │ /auth/github     │
       └─────────────────┘          └────────┬─────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │ GitHub OAuth API │
                                    └──────────────────┘

The frontend communicates directly with the GitHub REST API for profile and repository data.

FastAPI currently provides the backend endpoint used to exchange the GitHub OAuth authorization code for an access token.

Project Structure

GitScope/
│
├── Backend/
│   ├── main.py
│   └── auth.py
│
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── api.js
│   ├── analytics.js
│   ├── app.js
│   ├── callback.js
│   ├── history.js
│   ├── profile.js
│   └── ui.js
│
├── Index.html
├── callback.html
├── profile.html
├── requirements.txt
├── .gitignore
└── README.md

Backend

"main.py"

Creates the FastAPI application, configures CORS, and registers the authentication router.

"auth.py"

Handles the GitHub OAuth authorization-code exchange.

The endpoint is:

POST /auth/github

It accepts a GitHub authorization code and exchanges it for an access token using GitHub's OAuth API.

Frontend

"api.js"

Handles GitHub REST API requests and GitHub OAuth configuration.

It provides functions for:

- Fetching public user profiles
- Fetching repositories
- Retrieving the authenticated user
- Starting GitHub OAuth

"app.js"

Controls the main application flow:

- Username search
- Profile loading
- Repository loading
- Score calculation
- Technology analysis
- Charts
- Repository rendering
- Search history
- GitHub comparison

"analytics.js"

Contains the custom GitScope Developer Score calculation.

"ui.js"

Responsible for rendering:

- Profile information
- Statistics
- Repository cards
- Technology indicators
- Charts
- Developer level

"history.js"

Manages the local search history stored in browser "localStorage".

"profile.js"

Loads and displays the authenticated user's GitHub profile.

"callback.js"

Handles the OAuth callback and sends the authorization code to the FastAPI backend.

Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript
- JavaScript ES Modules
- Chart.js
- GitHub REST API

Backend

- Python
- FastAPI
- HTTPX
- Pydantic
- python-dotenv
- Uvicorn

Requirements

Before running GitScope locally, install:

- Python 3
- pip
- A modern web browser
- A GitHub account for OAuth functionality
- A GitHub OAuth App if authentication is enabled

Python dependencies are listed in:

requirements.txt

Current backend dependencies include:

fastapi
uvicorn[standard]
httpx
python-dotenv
pydantic

Installation

Clone the repository:

git clone https://github.com/ebrahimdev3/GitScope.git
cd GitScope

Backend Setup

Move into the backend directory:

cd Backend

Create a virtual environment:

python -m venv .venv

Activate it.

Linux/macOS:

source .venv/bin/activate

Windows:

.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r ../requirements.txt

Environment Variables

Create a ".env" file inside the "Backend" directory:

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

Do not commit the ".env" file or your GitHub client secret.

Running the Backend

From the "Backend" directory:

uvicorn main:app --reload

The FastAPI server runs locally on:

http://127.0.0.1:8000

The root endpoint can be used to verify that the API is running:

GET /

Expected response:

{
  "message": "GitScope API is running."
}

Running the Frontend

The frontend consists of static HTML, CSS, and JavaScript files.

Run the project through a local HTTP server rather than opening the HTML files directly with "file://".

For example, from the project root:

python -m http.server 8158

Then open:

http://localhost:8158/Index.html

The current OAuth configuration uses:

http://localhost:8158/callback.html

as the callback URL.

If you change the frontend port or deployment URL, update the OAuth configuration accordingly.

GitHub OAuth Setup

Create a GitHub OAuth App in your GitHub developer settings.

Configure the authorization callback URL to match the value used by GitScope.

For the current local configuration:

http://localhost:8158/callback.html

The application requests:

read:user public_repo

The OAuth authorization code is sent to:

POST /auth/github

The FastAPI backend exchanges the code with GitHub and returns the resulting access token to the browser.

GitHub API Usage

GitScope uses GitHub's REST API for profile and repository information.

Public profile requests use:

GET /users/{username}

Repository requests use:

GET /users/{username}/repos

Authenticated requests use the OAuth access token when available.

GitHub API availability and rate limits are controlled by GitHub and can affect application behavior.

Data Storage

GitScope does not currently use a database.

Search history is stored locally in the browser:

localStorage
└── gitscope-history

The OAuth access token is also currently stored in browser "localStorage" under:

github-access-token

This is part of the current implementation and should be reviewed before deploying the application to a public production environment.

Security Considerations

The current project is primarily designed for local development and learning.

Before production deployment, the authentication flow should be strengthened.

Areas that should be reviewed include:

- OAuth state/CSRF protection
- Access-token storage
- Production redirect URIs
- Environment-specific configuration
- HTTPS
- Token lifecycle and revocation
- CORS configuration
- Authentication error handling

The current backend explicitly allows the local frontend origin:

http://localhost:8158

Production deployment would require an appropriate origin configuration.

Current Limitations

GitScope currently has several limitations:

- Repository analysis is based primarily on GitHub API metadata.
- Technology detection is heuristic.
- Developer Score is a custom metric rather than a validated developer assessment.
- The current frontend is designed around local development.
- OAuth configuration uses localhost URLs.
- OAuth tokens are stored in browser "localStorage".
- There is no database.
- There is no automated test suite.
- There is no CI/CD configuration.
- GitHub API rate limits can affect usage.

Roadmap

Potential future improvements include:

- Improve OAuth security
- Add proper OAuth state validation
- Improve token handling
- Add contribution analysis
- Add profile comparison improvements
- Add advanced repository analytics
- Add developer card export
- Add user settings
- Add logout improvements
- Add automated tests
- Add API caching
- Add GitHub API error handling and retry logic
- Add production deployment configuration
- Add CI/CD

What This Project Demonstrates

GitScope was built to explore practical web-development concepts including:

- REST API integration
- GitHub API consumption
- OAuth authentication
- FastAPI backend development
- Async HTTP requests with HTTPX
- Vanilla JavaScript modules
- Client-side state management
- Browser local storage
- Data transformation
- Metric calculation
- Chart-based visualization
- Responsive frontend development
- Frontend/backend integration

License

Licensed under the MIT License.

Author

ebrahimdev3

GitHub:

https://github.com/ebrahimdev3