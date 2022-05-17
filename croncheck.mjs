import fetch from 'node-fetch'

const resRaw = await fetch("https://v1.deta.sh/schedules/1073defb-0158-4d9f-a6bf-0eed5ca4efc1",{
  headers:{
    Authorization: `Bearer ${process.env.DETA_ACCESS_TOKEN}`
  }
})
const resJson = await resRaw.json()
console.log(resJson)