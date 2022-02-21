// Izvdeidota blokķēde sandisCoin, kas spēj izveidot jaunu bloku, verificē vai blokķēde ir pareiza, "Mine" jaunu sandisCoin ne vairāk par diviem
// "Mining" grūtība ir maināma Blockchain klasē mainot this.difficulty vērtību, jo lielāka grūtība, jo grūtāk/ilgāk dabūt sandisCoin.
// Lai programmu palaistu vajag ielādēt node, kur terminālā ievada "node script.js".

// importēts hash no crypto-js bibliotēkas
const SHA256 = require('crypto-js/sha256');

// Bloks, kas atradīsies blokķēdē.
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        // nejaušs skaitlis, kam nav nekāda sakara ar bloku, bet var tikt mainīts
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // "Proof of work" vai "Mining" bloka izveidošanai prasa noteiktu nuļļu daudzumu
    mineBlock(difficulty) {
        // while funkcīja cenšas atrast hashu kas sākas ar noteiktu daudzumu(difficulty) nullēm.
        // kad tiek atrasts pietiekami daudz nulles tiek izveidots jauns bloks - jauns sandisCoin.
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    } 

}

// Blokēde, kas pievieno jaunu bloku un var verificēt vai blokķēde ir pareiza
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    // Pats pirmais bloks blokķēdē, kuru sauc par "Genesis block"
    createGenesisBlock() {
        return new Block(0, "12/02/2022", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // vai bloka hash ir vienāds ja pārēķina atkal
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // vai pašreizējā bloka, kas satur iepriekšejā bloka hashu sakrīt ar iepriekšējā bloka hashu
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        // true ja visi hash ir pareizi
        return true;
    }
}

// izveidota sandisCoin blokķēde
let sandisCoin = new Blockchain();

// pievieno sandisCoin blokķēdē blokus
console.log("Iegūst bloku 1...");
sandisCoin.addBlock(new Block(1, "14/02/2022", {amount: 4}));
console.log("Iegūst bloku 2...");
sandisCoin.addBlock(new Block(2, "17/02/2022", {amount: 10}));

console.log('Is blockchain valid? ' + sandisCoin.isChainValid());

// // skatās vai isChainValid() strādā pareizi
// sandisCoin.chain[1].data = {amount: 100};
// sandisCoin.chain[1].hash = sandisCoin.chain[1].calculateHash();

// console.log('Is blockchain valid? ' + sandisCoin.isChainValid());

// blokķēde izprintēta conosolē ar "node script.js"
console.log(JSON.stringify(sandisCoin, null, 4));
