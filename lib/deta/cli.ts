import crypto from 'crypto';
import fetch from 'node-fetch';
import { dateToCron } from '../util.js'

const detaSignVersion = 'v0';

export async function setCron(date: Date, isMock = false){
  if(isMock) return;
  const accessToken = process.env.DETA_ACCESS_TOKEN;
  if (!accessToken) throw new Error('DETA_ACCESS_TOKEN is not set as env value.');
  
  const timestamp = Math.trunc(new Date().getTime() / 1000);

  const body = JSON.stringify({
    program_id:  process.env.AWS_LAMBDA_FUNCTION_NAME,
  	type:       "cron",
  	expression: dateToCron(date),
  })

  const token = calcSignature({
    AccessToken: accessToken,
    HTTPMethod: 'POST',
    URI: '/schedules/',
    Timestamp: timestamp,
    ContentType: 'application/json',
    RawBody: body,
  });

  console.log("setCronBody:",body);
  
  const resRaw = await fetch('https://v1.deta.sh/schedules/', {
    method: 'POST',
    headers: {
      'X-Deta-Timestamp': timestamp.toString(),
      'X-Deta-Signature': token,
      'Content-type': 'application/json',
    },
    body,
  });
  const resJson = await resRaw.json();
  console.log("cli: ",resJson)
}

// CalcSignature calculates the signature for signing the requests
export function calcSignature(i) {
  if (detaSignVersion !== 'v0') return '';

  const tokenParts = i.AccessToken.split('_');
  if (tokenParts.length !== 2) return ''; //ErrInvalidAccessToken

  const accessKeyID = tokenParts[0];
	const accessKeySecret = tokenParts[1];

  const stringToSign = `${i.HTTPMethod}\n${i.URI}\n${i.Timestamp}\n${i.ContentType}\n${i.RawBody}\n`;

  const mac = crypto.createHmac('sha256', accessKeySecret);
  const signature = mac.update(stringToSign);
  const hexSign = signature.digest('hex');

  return `${detaSignVersion}=${accessKeyID}:${hexSign}`
}

/*module.exports = {
  setCron,
}*/