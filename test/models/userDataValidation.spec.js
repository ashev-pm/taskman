const assert = require('assert');
const User = require('../../src/models/user');

describe('User', function() {
    describe('data validation', function (done) {

        it('should sucessed with valid data', async function() {
            const user = new User ({ name: "Rata Tatata", email: "hisemail@email.com", password:"elPaswordo"});
            assert.doesNotReject(user.save());
        });
                
        it('should return error because of invalid email', async function() {
            const user = new User ({ name: "Rata Tatata", email: "hisemailemail.com", password:"elPaswordo"});
                assert.throws(user.save, 'ValidationError');
        });
             
        it('should return error because of missing name', async function() {
            const user = new User ({ email: "hisemail@email.com", password:"elPaswordo"});
            assert.throws(user.save, "ValidationError");
        });
    });
});
