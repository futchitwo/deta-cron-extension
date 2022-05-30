import crypto from 'crypto';
import fetch from 'node-fetch';

const detaSignVersion = 'v0';

// rewrite get to set

export async function setCron(microId:string, date: Date, isMock = false){
  if(isMock) return;

  const timestamp = Math.trunc(new Date().getTime() / 1000);

  const token = calcSignature({
    AccessToken: process.env.DETA_ACCESS_TOKEN,
    HTTPMethod: 'GET',
    URI: '/schedules/' + microId,
    Timestamp: timestamp,
    ContentType: "",
    RawBody: "",
  });
  
  const resRaw = await fetch('https://v1.deta.sh/schedules/' + microId,{
    headers: {
      'X-Deta-Timestamp': timestamp.toString(),
      'X-Deta-Signature': token,
    }
  });
  const resJson = await resRaw.json();
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