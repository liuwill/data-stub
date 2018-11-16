# DATA STUB

> Build data stub from database for programer

set config at workdir with name: `app.json`

```json
{
  "mysql": {
    "host": "127.0.0.1",
    "user": "ketchup",
    "password": "123456",
    "database": "ketchup",
    "port": 3306,
    "charset": "utf8"
  },
  "prefix": "tb"
}
```

Instructions:

`data-stub -f ls` list table in the specific database

`data-stub -t tableName` show result of the tableName

`data-stub -f generate -o outputDir` generate data stub to outputDir

