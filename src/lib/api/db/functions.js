//

/*

{
    "user": {
        "iduser": 9099, // unique, primary key, autoincrement BIGINT, not null
        "ts": "2023-01-01T23:00:23.12", // DEFAULT NOW datetime, update on changes
        "rowkey": 0, // SMALL INT, DEFAULT 0, update on changes to random number    
        "username": "edwinspire", // UNIQUE y REQUIRED
        "first_name": "edwin",
        "last_name": "DLC",
        "email": "eeeff@g.com"
    },
    "app": {
        "idapp": 100089, // unique, primary key, autoincrement BIGINT not null
        "ts": "2023-01-01T23:00:23.12", // DEFAULT NOW datetime, update on changes
        "rowkey": 0, // SMALL INT, DEFAULT 0, update on changes to random number
        "description": "My App Demo",
        "icon": "icon.png",
        "app": "demo", // unique, not null
        "enabled": true,
        "creation_date": "2016-01-01T00:00:00.000Z", // DEFAULT NOW
        "iduser": 1 // foreign  key from user
    },
    "route": {
        "idroute": 99787, // unique, primary key, autoincrement BIGINT
        "ts": "2023-01-01T23:00:23.12", // DEFAULT NOW datetime, update on changes     
        "rowkey": 0, // SMALL INT, DEFAULT 0, update on changes to random number               
        "idapp": 100089, // Forgiven key BIGINT NOT NULL, UNIQUE WITH route field
        "route": "demopath", // UNIQUE WITH idapp field, NOT NULL
        "enabled": true
    },
    "method": {
        "idmethod":  9972, // unique, primary key, autoincrement BIGINT
        "ts": "2023-01-01T23:00:23.12", // DEFAULT NOW datetime, update on changes     
        "rowkey": 0, // SMALL INT, DEFAULT 0, update on changes to random number
        "idroute": 99787, // foreign  key from route
        "method": "GET", // UNIQUE WITH idroute field, NOT NULL
        "enabled": true, // Default true
        "version": 1,    // Not null default 1 SMALLINT
        "isPublic": true, // NOT NULL DEFAULT true
        "description": "Method Get",
        "handler": "jsFunction", // Not null
        "code": "RETURN_DATA = {funciona: 'mundo funciona bien'};", 
        "examples": [] // JSONB
      }
}
*/
