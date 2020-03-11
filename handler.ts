import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as ogs from 'open-graph-scraper';

export const scrape: APIGatewayProxyHandler = async (event, _context) => {

  const { url } = event.queryStringParameters || {};
  
  if (!url) { return { statusCode: 400, body: 'Missing url' }; }

  require('tls').DEFAULT_MIN_VERSION = 'TLSv1'; // questo fa si che accetti tutti i siti tipo adnkronos
  const options = { 'url': url, 'followAllRedirects': true, strictSSL: false };
  try {
    const res = await ogs(options);
    if (res.success) { 
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(res.data),
      };  
    }
    else {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify('No info found on this website'),
      }; 
    }
  }
  catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify(e),
    }; 
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': "*",
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Expose-Headers': 'Authorization',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
};