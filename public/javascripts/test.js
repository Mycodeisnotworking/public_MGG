const qs = require('querystring');
const request=require('request');

let itemName = '무색 큐브 조각';
var key="B3jbs7izT3mNCb8zQoJfDNgyqvlnv91h";
let requesturl=`https://api.neople.co.kr/df/auction?itemName=${qs.escape(itemName)}&sort=unitPrice:asc&limit=30&apikey=${key}`;
let url = `https://api.neople.co.kr/df/items?&apikey=${key}&itemName=${qs.escape(itemName)}`;
request.get({
    uri: requesturl
}, (err, res, body)=>{
    let json=JSON.parse(body);
    console.log(json);
});
