const Moralis = require('moralis/node');
const fs = require('fs');
const fetch = require('node-fetch');


const serverUrl = "";
const appId = "";
const contractAddress = "0x48355CE6ba377D06335Be9499fEaf735948484BC";

(async () => {
  await Moralis.start({ serverUrl: serverUrl, appId: appId });

  let cursor = null;
  let beans = {};
  do {
    const response = await Moralis.Web3API.token.getNFTOwners({
      address: contractAddress,
      chain: "eth",
      limit: 100,
      cursor: cursor,
    });
    console.log(
      `Got page ${response.page} of ${Math.ceil(
        response.total / response.page_size
      )}, ${response.total} total`
      );
      for (const owner of response.result) {
        beans[owner.token_id] = {
        amount: owner.amount,
        owner: owner.owner_of,
        tokenId: owner.token_id,
        tokenAddress: owner.token_address,
        metadata: owner.metadata,
      };
    }
    cursor = response.cursor;
  } while (cursor != "" && cursor != null);

  console.log("Total beans:", Object.keys(beans).length);
  let db = fs.readFileSync('db.json', 'utf8')
  db = JSON.parse(db);
  let allBeansData = db
  for (const transaction of Object.keys(beans)) {
      let trinfo = beans[transaction]
      if (trinfo.owner != (db[trinfo.tokenId] ? db[trinfo.tokenId].owner : null)) {
    const response2 = await Moralis.Web3API.token.getWalletTokenIdTransfers({
        address: contractAddress,
        token_id: trinfo.tokenId,
        chain: "eth",
        limit: 100,
      });
      for (const trdata of response2.result) {
        if (trdata.to_address == trinfo.owner) {
        allBeansData[trinfo.tokenId] = {
            amount: trinfo.amount,
            owner: trinfo.owner,
            tokenId: trinfo.tokenId,
            tokenAddress: trinfo.tokenAddress,
            metadata: trinfo.metadata,
            timestamp: trdata.block_timestamp,
            price: trdata.value,
        }
        }
    }
    const updatedata = JSON.stringify(allBeansData, null, 4);
    fs.writeFile('db.json', updatedata, (err) => {
     if (err) throw err;
 });
    console.log(`Got Bean ${trinfo.tokenId} of ${Object.keys(beans).length}`);
  } else {
    console.log(`Bean ${trinfo.tokenId} is stored in the db and has not changed, skipping.`);
  }
  }
  const data = JSON.stringify(allBeansData, null, 4);
    fs.writeFile('db.json', data, (err) => {
     if (err) throw err;
     console.log('Data saved to database');
 });
})()



// async function get() {
//     const get = await fetch('https://deep-index.moralis.io/api/v2/nft/0x48355CE6ba377D06335Be9499fEaf735948484BC/owners?chain=eth&format=decimal', {
//         method: 'GET',
//         headers: {'Accept': 'application/json', 'X-API-Key': 'Qe5nAWuDhNAgB8xjqs5OI6j2JmcHzSjT3j3m7a36AntDy1NkISNwWOI9AhYRY3rb'},
//     })

// let parse = await get.json()
// let data = JSON.stringify(parse, null, 2);
// fs.writeFile('result.json', data, (err) => {
//     if (err) throw err;
//     console.log('Data written to file');
// });
// console.log(parse.result.length);
// for (const data of parse.result) {
//     console.log(data.token_id);
//     const gettoken = await fetch(`https://deep-index.moralis.io/api/v2/nft/0x48355CE6ba377D06335Be9499fEaf735948484BC/${data.token_id}/transfers?chain=eth&format=decimal`, {
//         method: 'GET',
//         headers: {'Accept': 'application/json', 'X-API-Key': 'Qe5nAWuDhNAgB8xjqs5OI6j2JmcHzSjT3j3m7a36AntDy1NkISNwWOI9AhYRY3rb'},
//     })
//     let parse2 = await gettoken.json()
//     let data2 = JSON.stringify(parse2, null, 2);
//     fs.writeFile('result2.json', data2, (err) => {
//     if (err) throw err;
//     console.log('Data written to file2');
// });
// }
// }

// get()
