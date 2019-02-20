const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, '../../../../.env')});

const email = require('../../../modules/email');
const chai = require('chai');

const assert = chai.assert;

describe('MODULE.EMAIL', function () {
  describe('send function', function () {
    const MAIL_TEST_RECIPIENT = process.env.MAIL_TEST_RECIPIENT;

    before(function () {
      assert.isOk(MAIL_TEST_RECIPIENT, 'Test recipient must be specified');
    });

    it(`Should send email to ${MAIL_TEST_RECIPIENT}`, function () {
      return email.send(MAIL_TEST_RECIPIENT, 'Test', 'Hi', '<b>Test email</b>');
    });

    it('Shouldn\'t send email without recipient', function (done) {
      email.send('', 'Test', '<b>Test email</b>', 'Hi').then(() => {
        done(new Error('Expected method to reject.'));
      }).catch(() => {
        done();
      });
    });

    it('Shouldn\'t send email without subject', function (done) {
      email.send(MAIL_TEST_RECIPIENT, '', '<b>Test email</b>', 'Hi').then(() => {
        done(new Error('Expected method to reject.'));
      }).catch(() => {
        done();
      });
    });

    it('Shouldn\'t send email without html content', function (done) {
      email.send(MAIL_TEST_RECIPIENT, 'Test', '').then(() => {
        done(new Error('Expected method to reject.'));
      }).catch(() => {
        done();
      });
    });

    it('Shouldn\'t send email without text content', function (done) {
      email.send(MAIL_TEST_RECIPIENT, 'Test', '<b>Test email</b>', '').then(() => {
        done(new Error('Expected method to reject.'));
      }).catch(() => {
        done();
      });
    });
  });
});
