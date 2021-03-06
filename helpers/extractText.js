// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'helpers/secret_keys/ocr-google-vision.json'        
    // untuk testing code gunakan ini, supaya bisa langsung jalankan node extractText.js
    // keyFilename: 'secret_keys/ocr-google-vision.json'     
});

function isValidItem(item) {
    // console.log(item);
    let invalidItemCode = [
        "telp", 
        "%", 
        "+62", "021", "140", "(021)", "(022)", "(031)", "(028)", "(0281)",
        "jakarta", 
        "jl", "jl.",
        "guest", 
        "no.", "tanggal", "meja", "table",
        "2017", "2020",
        "pax: ",
        "makanan untuk"
        // "jan", "feb", "mar", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "des"
    ];
    for (let i = 0; i < invalidItemCode.length; i++) {
        if (item.toLowerCase().includes(invalidItemCode[i])) {
            return false;
        }        
    }
    return true;
}

function paringItemToPrice(items, words) {
    // console.log({items, words});
    let itemsWithPrice = [];
    let tempIdxItem;
    
    // Last checking to make sure only items in array to process
    let onlyItems = [];
    items.map(item => {
        if ((item[1] - tempIdxItem === 1) || typeof tempIdxItem === "undefined") {       
            onlyItems.push(item); 
            tempIdxItem = item[1];
        }
        
    })

    // console.log({onlyItems});

    // process array item to their price
    onlyItems.map(item => {
            // Untuk mendapatkan harga dari item
            // maka perlu menjumlahkan index item dengan jumlah seluruh item
            // agar dapat match ke pricenya yang terpisah

            // karena format price ditiap struk berbeda, ada titik ada koma dsb, maka hanya ambil angkanya saja
            // Masukan data jadi ke array untuk dapat disimpan kedatabase
            let price = words[item[1]+onlyItems.length];
            price = price.match( /\d+/g, '');
            price = price ? price.join('') : 0;

            let totalQty = Number(item[0][0]);
            if (totalQty <= 0 || isNaN(totalQty)) {
                itemsWithPrice.push({name: item[0], price });
            }else{                
                for (let i = 0; i < totalQty; i++) {                                
                    itemsWithPrice.push({name: item[0].slice(1), price: (price / totalQty) });
                }
            }
    });

    return itemsWithPrice;
}

async function getItems(imgUrl) {  
    if (!imgUrl) {
        return "please send url as first argument e.g: getItems('img.google.com')";
    }
    
    try {
        const [result] = await client.textDetection(imgUrl);
        let words = result.fullTextAnnotation && result.fullTextAnnotation.text.split("\n") || "";
        // console.log(words);
        if (words.length > 0) {            
            let items = [];
    
            words.map((word, index) => {
                let splittedWords = word.split(" ");
                let isItem;
                splittedWords.map(splittedWord => {
                    // check untuk memastikan ada qty sebaris text yang sudah dipisahkan (qty, amount, item name, dll)
                    if (Number.isInteger(Number(splittedWord)) && Number(splittedWord) > 0) {                
                        isItem = true;
                    }
                });
        
                // jika merupakan sebuah item
                if ( isItem && isValidItem(word) ) {
                    items.push([word, index]);        
                }
            });


            let itemWithPrice = paringItemToPrice(items, words);
            // console.log(words);
            return itemWithPrice;
            // console.log({itemWithPrice});
        }else{
            return result;
        }
    } catch (error) {
        return error;
    }

}

module.exports = {
    getItems
}

const kafe          = 'https://img.solopos.com/posts/2018/04/01/907349/aaa.jpg?w=375&h=250';
const kfcSerius     = 'https://pbs.twimg.com/media/BozJBTJIQAEfxp4.jpg';
const kfcSerius2    = 'https://pbs.twimg.com/media/BC4dRKCCEAAZoPr.jpg';
const kfcSerius3    = 'https://pbs.twimg.com/media/By2Ran4CIAA3dSH.jpg';
const hokben        = 'https://assets-pergikuliner.com/uploads/image/picture/801607/picture-1516368440.JPG';
const gokana        = 'https://funtachi.files.wordpress.com/2013/02/35.jpg';
const upnormal      = 'https://media-cdn.tripadvisor.com/media/photo-s/0e/4a/dd/6a/struk.jpg';
const aws           = 'https://jsprojectdev37.s3-ap-southeast-1.amazonaws.com/1584945069337-test.jpg';
const dunkin        = 'https://2.bp.blogspot.com/-xc1miug9fA0/VscbBevwUjI/AAAAAAAAAFE/TQIKNxXlko8/s1600/WP_20160219_016%255B1%255D.jpg';
const test          = 'https://jsprojectdev37.s3.ap-southeast-1.amazonaws.com/1585080645169-test.jpg';
const gcs           = 'gs://split-bill-bucket/coba-gcs.jpg';

// getItems(gcs)
//     .then(items => {
//         console.log({items});
//     });
