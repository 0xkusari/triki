import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe('TrikiWord', function () {
  let TrikiWord, trikiWord: any, owner: any;

  beforeEach(async function () {
    TrikiWord = await ethers.getContractFactory("TrikiWord");
    [owner] = await ethers.getSigners();
    trikiWord = await TrikiWord.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await trikiWord.owner()).to.equal(owner.address);
    });

    it("Should mint 3 new words", async function () {
      await trikiWord.connect(owner).mint3Words(20230619, "apple", "banana", "cherry");
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
