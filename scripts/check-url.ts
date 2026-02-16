import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const url = 'http://localhost:3000/music/mga-isla-sa-gitna-natin.mp3';

console.log(`Checking HEAD for: ${url}`);

fetch(url, { method: 'HEAD' })
    .then(res => {
        console.log(`Status: ${res.status} ${res.statusText}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        console.log(`Content-Length: ${res.headers.get('content-length')}`);
    })
    .catch(err => {
        console.error('Fetch error:', err);
    });
