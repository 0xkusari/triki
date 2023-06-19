const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TrikiWord', function () {
  let TrikiWord, trikiWord: any, owner: any, addr1, addr2, addrs;

  beforeEach(async function () {
    TrikiWord = await ethers.getContractFactory("TrikiWord");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    trikiWord = await TrikiWord.deploy("TrikiWord", "TW");
    await trikiWord.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await trikiWord.owner()).to.equal(owner.address);
    });

    it("Should mint 3 new words", async function () {
      await trikiWord.connect(owner).mint3Words(20230501, "apple", "banana", "cherry");
      expect(await trikiWord.idToWord(1)).to.equal("apple");
      expect(await trikiWord.idToWord(2)).to.equal("banana");
      expect(await trikiWord.idToWord(3)).to.equal("cherry");
    });

    it("Should not mint words for future dates", async function () {
      await expect(trikiWord.connect(owner).mint3Words(20240501, "apple", "banana", "cherry")).to.be.revertedWith("Cannot mint tokens for future dates");
    });

    it("Should not mint words for dates older than 7 days", async function () {
      await expect(trikiWord.connect(owner).mint3Words(20220401, "apple", "banana", "cherry")).to.be.revertedWith("Cannot mint tokens for dates older than 7 days");
    });
  });
});
