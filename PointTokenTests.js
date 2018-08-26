var PointToken = artifacts.require("./PointToken.sol");

contract('PointToken', function (accounts) {
    it("should have a name", function () {
        return PointToken.new().then(function (instance) {

            return instance.name.call();
        }).then(function (name) {
            assert.equal(name, "POINT");
        });
    });
    it("should have an owner", function () {
        return PointToken.new().then(function (instance) {

            return instance.owner.call();
        }).then(function (owner) {
            assert.equal(owner, accounts[0]);
        });
    });
    it('can mint', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.mint(accounts[0], 10000, { from: accounts[0] })
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[0])
        }).then(function (result) {
            assert.strictEqual(result.toNumber(), 10000)
        }).catch((err) => { throw new Error(err) })
    });

    it('can add awarder ', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.addAwarder(accounts[1], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[1])
        }).then(function (result) {
            assert.isTrue(result)
        }).catch((err) => { throw new Error(err) })
    });
    it('can add award', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.addAwarder(accounts[1], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[1])
        }).then(function (result) {
            assert.isTrue(result)
            return ctr.addAward(13, { from: accounts[1] })
        }).then(function (result) {
            return ctr.getAward.call(13)
        }).then(function (result) {
            assert.equal(result, accounts[1])
        }).catch((err) => { throw new Error(err) })
    });

    
    it('can award achievement', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            ctr.mint(accounts[0], 10000, { from: accounts[0] })
            return ctr.addAwarder(accounts[0], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[0])
        }).then(function (result) {
            assert.isTrue(result)
            return ctr.addAward(13, { from: accounts[0] })
        }).then(function (result) {
            return ctr.getAward.call(13)
        }).then(function (result) {
            assert.equal(result, accounts[0]);
            ctr.giveAward(accounts[2],13,100,0, { from: accounts[0] });
        }).then(function () {
            return ctr.balanceOf.call(accounts[2])
        }).then(function (result) {
            assert.equal(result, 100);
        }).catch((err) => { throw new Error(err) })
    });
    it('can award achievement without giving any tokens', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            ctr.mint(accounts[0], 10000, { from: accounts[0] });
            return ctr.addAwarder(accounts[0], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[0])
        }).then(function (result) {
            assert.isTrue(result)
            return ctr.addAward(13, { from: accounts[0] })
        }).then(function (result) {
            return ctr.getAward.call(13)
        }).then(function (result) {
            assert.equal(result, accounts[0]);
            ctr.giveAward(accounts[2],13,0,0, { from: accounts[0] });
        }).then(function () {
            return ctr.balanceOf.call(accounts[2])
        }).then(function (result) {
            assert.equal(result, 0);
        }).catch((err) => { throw new Error(err) })
    });

    it('can not take over someone elses award', function () {
        return PointToken.new().then(function (result) {
            ctr = result;
            ctr.addAwarder(accounts[0], { from: accounts[0] });
            return ctr.addAwarder(accounts[1], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[0])
        }).then(function (result) {
            assert.isTrue(result)
            return ctr.addAward(13, { from: accounts[0] })
        }).then(function (result) {
            return ctr.getAward.call(13)
        }).then(function (result) {
            assert.equal(result, accounts[0]);
            return ctr.addAward(13, { from: accounts[1] })
        }).then(function (result) {
            return ctr.getAward.call(13)
            assert.equal(result, accounts[0]);

        }).catch((err) => { throw new Error(err) })
    });

    it('can lookup award', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.getAward.call(12)
        }).then(function (result) {
            assert.equal(result, "0x0000000000000000000000000000000000000000")
        }).catch((err) => { throw new Error(err) })
    });

    it('can remove awarder ', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.addAwarder(accounts[1], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[1])
        }).then(function (result) {
            assert.isTrue(result);
            return ctr.deleteAwarder(accounts[1], { from: accounts[0] })
        }).then(function (result) {
            return ctr.isAwarder.call(accounts[1])
        }).then(function (result) {
            assert.isFalse(result);
        }).catch((err) => { throw new Error(err) })
    });
    it('can check that random user is not awarder', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.isAwarder.call(accounts[1])
        }).then(function (result) {
            assert.isFalse(result);
        }).catch((err) => { throw new Error(err) })
    });



    it('only owner can mint', function () {
        return PointToken.new().then(function (result) {
            ctr = result
            return ctr.mint(accounts[1], 10000, { from: accounts[1] })
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[1])
        }).then(function (result) {
            assert.strictEqual(result.toNumber(), 20000)
        }).catch((error) => {
            var errstr = error.toString();
            var newErrMsg = errstr.indexOf('invalid opcode') != -1;
            var oldErrMsg = errstr.indexOf('invalid JUMP') != -1;
            if (!newErrMsg && !oldErrMsg)
                assert(false, 'Did not receive expected error message');
        })
    });

});
