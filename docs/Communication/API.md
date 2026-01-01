> # Minix Games API
> 
> In this document we cover and list of all the API endpoints offered by the MinixGames server, allowing communication
and data exchange between essential system parts (Server to Client)
> 
>-----------------
> 
> ### Specifications:
> - __Architecture:__ *REST*
>
> - __Protocols:__
>   - *HTTP* (Development)
>   - *HTTPS* (Test & Production)
>
> - __Allowed methods:__
>   - *GET*
>   - *POST*
> 
> - __Base:__ *.../api/v1*
>
> ------------
>
> ### Server Status codes:
> - 200 `OK` - The request was successful and the server processed and returned the result of the operation.
> - 400 `Bad Request` - The request could not be understood or was missing required parameters.
> - 401 `Unathorized` - Authentication failed or user doesn't have permissions for requested operation.
> - 403 `Forbidden` - Access denied or missing authorization.
> - 404 `Not Found` - Resource was not found.
> - 409 `Conflict` - Resources conflicting (example: cannot create a player with same ID or playerName).
> - 500 `Internal Server Error` - Internal server error involving wrong code or logic.
> - 520 `Unknown Error` - Generic fallback unknown error.

---

## Table of content:

- **[Auth API](#auth-api)**.
  - [User Registration](#user-registration).
  - [User Login](#user-login).

- **[Players API](#players-api)**
  - [All players](#retrieve-all-players).
  - [Spicific player info](#specific-player-info).

---

## Auth API

The following endpoints are APIs created to allow players to register and access the system with a personal account.

---

### User Registration:

***`POST` /api/v1/register***

Registration endpoint to register a new player into the system.

***NOTE:*** *Upon registration success, the system generates a JSON Web Token (JWT) and returns it with the response cookies,
granting the new player access to the system without needing to pass to the login phase.*

---

#### Required Body

The request requires a body to be passed containing:
- **playerName:** a string of no more than 32 characters containing the playerName
- **password:** a string of at least or more than 8 characters, ***NOTE:*** The password is hashed and only then saved in the Database


```JSON
{
  "playerName": "Itlvck",
  "password": "nonHashedPassword123"
}
```

#### Possible Responses

<details>

<summary>Expand</summary>

>- 200 `OK` : 
>  - the operation was successful and the player is now correctly registered in the system
>
>Body:
> 
> ```JSON
>   {
>     "message": "Player profile created successfully",
>     "playerInfo": {
>        "id": 12,
>       "playerName": "examplePlayer123"
>     }
>   }
> ```


>- 400 `Bad Request` :
>  - the request was missing the required body
>  - the value of the parameters in the body didn't pass the data validation
>    - playerName : `<=32 chars`
>    - password: `>= 8 chars`
>
>Body:
>
> - Missing body:
> ```JSON
>   {
>     "message": "Player name and password are required"
>   }
> ```
> 
> - Data failed validation
> ```JSON
>   {
>     "message": "Password must be at least 8 characters long"
>   }
> ```
> ```JSON
>   {
>     "message": "Player name must be less than or 32 characters long"
>   }
> ```

>- 409 `Conflict` :
>  - the registration failed due to an existing account with the same playerName
>
>Body:
>
> ```JSON
>   {
>     "message": "A Player with this name already exists"
>   }
> ```

>- 500 `Internal Server Error` :
   >  - the registration failed due to an internal server error caused by erroneous logic
>
>Body:
>
> ```JSON
>   {
>     "message": "There has been an internal server error"
>   }
> ```

>- 520 `Unknown Error` :
>  - the registration failed due to an unknown or unexpected error
>
>Body:
>
> ```JSON
>   {
>     "message": "Generic unknown error"
>   }
> ```

</details>

---

### User Login:

***`POST` /api/v1/login***

Login endpoint to verify credentials granting access to personal profile if credentials match or exist in the system.

***NOTE:*** *If these requirements are met, the system generates a JSON Web Token (JWT) and returns it with the response cookies.*

---

#### Required Body

The request requires a body to be passed containing:
- **playerName:** a string of no more than 32 characters containing the registered playerName
- **password:** a string of at least or more than 8 characters, ***NOTE:*** The password is hashed and only then saved in the Database

```JSON
{
  "playerName": "Itlvck",
  "password": "nonHashedPassword123"
}
```

#### Possible responses

<details>

<summary>Expand</summary>


>- 200 `OK` :
   >  - the operation was successful and the player is now correctly logged in the system
>
> <details>
> 
><summary>Body:</summary>
>
> ```JSON
>   {
>     "message": "Player logged successfully",
>     "playerInfo": {
>       "id": 12,
>       "playerName": "examplePlayer123"
>     }
>   }
> ```
> 
> </details>


>- 400 `Bad Request` :
>  - the request was missing the required body
>  - the value of the parameters in the body didn't pass the data validation:
>    - playerName : `<=32 chars`
>    - password: `>= 8 chars`
>
> <details>
> 
><summary>Body:</summary>
>
> - Missing body:
> ```JSON
>   {
>     "message": "Player name and password are required"
>   }
> ```
>
> - Data failed validation
> ```JSON
>   {
>     "message": "Password must be at least 8 characters long"
>   }
> ```
> ```JSON
>   {
>     "message": "Player name must be less than or 32 characters long"
>   }
> ```
> 
> </details>


>- 401 `Unathorized` :
   >  - the login failed cause the system found a player but the password doesn't match 
>
> <details>
> 
><summary>Body:</summary>
>
> ```JSON
>   {
>     "message": "Wrong password"
>   }
> ```
> 
> </details>


>- 404 `Not Found` :
   >  - the login failed cause no player with the inserted credentials was found
>
> <details>
> 
><summary>Body:</summary>
>
> ```JSON
>   {
>     "message": "Player not found"
>   }
> ```
> 
> </details>


>- 500 `Internal Server Error` :
   >  - the login failed due to an internal server error caused by erroneous logic
>
> <details>
> 
><summary>Body:</summary>
>
> ```JSON
>   {
>     "message": "There has been an internal server error"
>   }
> ```
>
> </details>


>- 520 `Unknown Error` :
   >  - the registration failed due to an unknown or unexpected error
>
> <details>
> 
><summary>Body:</summary>
>
> ```JSON
>   {
>     "message": "Generic unknown error"
>   }
> ```
> 
> </details>

</details>

---

## Players API

The following endpoints are APIs created to allow the exchange of data related to players from the server to the requesting client

---

### Retrieve all players

***`GET` /api/v1/allPlayers***

This endpoint allows to retrieve all the players registered in the system, excluding guest players.

***NOTE:*** *the system executed a query on the players table retrieving all data, this collection must then be filtered from unsafe data such as password*

---

#### Expected Response

> - 200 `OK`:
>   - the system successfully executed the query and returned all the requested data
> 
> Body:
> ```JSON
> {
>   "allPlayers":[
>     {
>       "playerID":1,
>       "playerName":"TestPlayer1",
>       "registerDate":"2026-01-01T11:34:42.000Z",
>       "isActive":true
>     },
>     { "...": "" }
>   ]
> }
> ```

---

### Specific player info

***`GET` /api/v1/getPlayer?(playerName)***

This endpoint allows to retrieve the information of a specific player given its playerName.

***NOTE:*** *the system executed a query on the players table retrieving all data of the player, this data must then be filtered from unsafe data such as password*

#### Required Query Params:

- playerName : a string containing the playerName of the player

---

#### Expected Responses

> - 200 `OK`:
>   - the system successfully executed the query and returned all the requested data
>
> <details>
> 
> <summary>Body:</summary>
>
> ```JSON
> {
>   "allPlayers":[
>     {
>       "playerID":1,
>       "playerName":"TestPlayer1",
>       "registerDate":"2026-01-01T11:34:42.000Z",
>       "isActive":true
>     },
>     { "...": "" }
>   ]
> }
> ```
> </details>

>- 400 `Bad Request` :
>  - the request was missing the required body
>  - the value of the parameters in the body didn't pass the data validation:
>    - playerName : `<=32 chars`
>
> <details>
>
><summary>Body:</summary>
>
> - Missing body:
> ```JSON
>   {
>     "message": "Player name is required in query params"
>   }
> ```
>
> - Data failed validation
> ```JSON
>   {
>     "message": "Password must be at least 8 characters long"
>   }
> ```
> ```JSON
>   {
>     "message": "Player name must be less than or 32 characters long"
>   }
> ```
>
> </details>