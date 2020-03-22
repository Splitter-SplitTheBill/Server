// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'helpers/secret_keys/ocr-google-vision.json'        
});

function isValidItem(item) {
    // console.log(item);
    let invalidItemCode = ["telp", "%", "+62", "jakarta", "jl.", "guest"];
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

    // console.log(onlyItems);

    // process array item to their price
    onlyItems.map(item => {
        // Untuk mendapatkan harga dari item
        // maka perlu menjumlahkan index item dengan jumlah seluruh item
        // agar dapat match ke pricenya yang terpisah
            // karena format price ditiap struk berbeda, ada titik ada koma dsb, maka hanya ambil angkanya saja
            // Masukan data jadi ke array untuk dapat disimpan kedatabase
            let price = words[item[1]+onlyItems.length];
            // console.log(price);
            price = price.match( /\d+/g, '').join('');
            itemsWithPrice.push([item[0], price]);
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
        if (words.length > 0) {            
            let items = [];
    
            let tempIndex = 0;
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
            console.log({itemWithPrice});
        }else{
            console.log('masuk kesini ' , result);
        }
    } catch (error) {
        console.log('Error nih' , error);
    }
}

module.exports = {
    getItems
}

// const kafe          = 'https://img.solopos.com/posts/2018/04/01/907349/aaa.jpg?w=375&h=250';
// const kfcSerius     = 'https://pbs.twimg.com/media/BozJBTJIQAEfxp4.jpg';
// const kfcSerius2    = 'https://pbs.twimg.com/media/BC4dRKCCEAAZoPr.jpg';
// const kfcSerius3    = 'https://pbs.twimg.com/media/By2Ran4CIAA3dSH.jpg';
// const hokben        = 'https://assets-pergikuliner.com/uploads/image/picture/801607/picture-1516368440.JPG';
// const gokana        = 'https://funtachi.files.wordpress.com/2013/02/35.jpg';

// setTimeout(() => {
//     quickstart(kafe);
// }, 1000);
// setTimeout(() => {
//     quickstart(kfcSerius);
// }, 1000);

// setTimeout(() => {
//     quickstart(kfcSerius2);
// }, 1000);

// setTimeout(() => {
//     quickstart(kfcSerius3);
// }, 1000);

// setTimeout(() => {
//     quickstart(hokben);
// }, 1000);

// setTimeout(() => {
//     quickstart(gokana);
// }, 1000);
