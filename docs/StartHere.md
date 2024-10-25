## How to Run the Application
- Step 0 : `cd your-root-directory` Go to the root directory of project.
- Step 1 : `npm install` Install the dependencies.
- Step 2 : Setup `.env` file
- Step 2 : Configure and start the mongodb database.
- Step 3 : `npm run dev` Start the application locally. 

## Constants
`{{serverURL}}` : Default Server link for the api.\
     e.g. `http://localhost:3000/api/v1` to run locally.

## Sample `.env` File
```javascript
PORT='your-port'
DATABASE_URI='db-connection-string'
DB_NAME='your-database-name'
REQ_LIMIT='size-limit' // e.g. 32kb

ALLOWED_ORIGINS=["http://allowed-origin1.dev", "http://allowed-origin2.dev"] // e.g. [https://www.google.com/, https://bewake24.valeff.com/]

ACCESS_TOKEN_SECRET='your-access-token-secret'
ACCESS_TOKEN_EXPIRY='your-access-token-expiry' //e.g. 1d
REFRESH_TOKEN_SECRET='your-refresh-token-secret' 
REFRESH_TOKEN_EXPIRY='your-refresh-token-expiry' //e.g. 15d
```