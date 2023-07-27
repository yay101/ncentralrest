# Work In Progress
I do not have an environment where i can work on the write based methods and as such this is read only. I am happy to help anyone that can provide request body examples for anything not implemented.

This is finished as far as requirements for my day job go and as such fixes and changes will be made when possible.

## Usage
Create a .env file with the following entries:
```
ncentral_url=https://yourinstancehere/dms2/services2/ServerEI2
ncentral_request_apikey=examplekey
ncentral_apikey=examplejwt
ncentral_port=8003
```
Run using Deno OR (recommended) compile using Deno and run. You will need the options ``--allow-net --allow-env --allow-read`` if you are using an .env file.

## Making Requests
Set the header X-Api-Key to whatever you used for your ncentral_request_apikey.
- GET /customerlist
- GET /customerlistchildren/124
- GET /devicedetail/127471274
Powershell Example
- invoke-restmethod -uri http://localhost:8003/customerlist -headers @{"X-Api-Key"="examplekey"}
