# R6Api  

initialize:
```
let api = require("r6api")({
    email: "my-ubi@login.com",
    password: "sup3rs3c3t"
});
```

api functions:


## getAuthToken()

### description  
the Authorization header used

### returns
a promise of the auth header string:


## findByName(name: string)

### description  
this find's a players unique id.

### params
    - name: the player's name

### returns
a promise of an array containing id objects:
```
[
    {
        "id": "1b50085a-8a20-4ce6-b75f-db6a00e4d718",
        "name": "LaxisB"
    }
]
```  
  
## getCurrentName(...ids: string)  

### description

get the current names for all passed id's  

### params
    - id: the uplay id  

### returns
a promise of an array containing íd objects:

```
[ 
    { 
        "id": "1b50085a-8a20-4ce6-b75f-db6a00e4d718",
        "name": "LaxisB" 
    }, 
    { 
        "id": "ccd28cc4-845e-4726-8cf8-e2cac4de82a2",
        "name": "NaughtyMuppet" 
    } 
]
```  

## getPlayTime(...ids: string)  

### description
returns the seconds played in casual and ranked for the given ids  

### params
    - id: the uplay id

### returns
a promise of an array containing the play times:
```
[ 
    { 
        "id": "ccd28cc4-845e-4726-8cf8-e2cac4de82a2",
        "casual": 2183940,
        "ranked": 272432 
    },
    { 
        "id": "1b50085a-8a20-4ce6-b75f-db6a00e4d718",
        "casual": 960196,
        "ranked": 116373 
    } 
]

```

## getStats(...ids: string)  

### description
returns the players stats  

### params
    - id: the uplay id

### returns
a promise of an array containing the stats:
```
[
    {
        "id": "ccd28cc4-845e-4726-8cf8-e2cac4de82a2",
        "matchesLost": 908,
        "matchesWon": 2023,
        "kills": 10078,
        "deaths": 7039
    },
    {
        "id": "1b50085a-8a20-4ce6-b75f-db6a00e4d718",
        "matchesLost": 389,
        "matchesWon": 901,
        "kills": 3846,
        "deaths": 3023
    }
]
```