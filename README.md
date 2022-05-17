# Deta Random Cron

## How To Use
1. 
2. 
3. 

## config
### environment variable
- `DETA_ACCESS_TOKEN`
  - Note that it expires in 1 year.

### cronconfig.json
```json
{
  "timezone": "JST",
  // 
  
  "interval": "",
  // type: everyhour | everyday | everymonth | everyweek | everyyear
  
  "crons": [
    {
      "type" :"normal",
      // 
      
      "average" : "",
      "stdev": ""
    },
    {
      "type" :"uniform",
      // 
      
      "min" : "",
      "range": ""
    }
  ]
}
```