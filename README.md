# Work In Progress
This is under current development. I do not have an environment where i can work on the write based methods and as such this is read only. I am happy to help anyone that can provide request body examples for anything not implemented.

## Usage
Create a .env file with the following entries:
```
ncentral_request_apikey=examplekey
ncentral_apikey=examplejwt
```
Run using Deno OR compile using Deno and run. You will need the options --allow-net --allow-env --allow-read if you are using an .env file.

## Making Requests
Set the header X-Api-Key to whatever you used for your ncentral_request_apikey.
- GET /customerlist
- GET /customerlistchildren/124
- GET /devicedetail/127471274
