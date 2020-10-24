const assert = require('assert');
const helper = require('../../helper');

describe('Helper', () => {
  it('Removes trailing symbols from url', () => {
    assert.strictEqual(helper.removeTrailingSymbolFromUrl('http://a.com////'), 'http://a.com');
    assert.strictEqual(helper.removeTrailingSymbolFromUrl('http://a.com/'), 'http://a.com');
    assert.strictEqual(helper.removeTrailingSymbolFromUrl('http://a.com'), 'http://a.com');
    assert.strictEqual(helper.removeTrailingSymbolFromUrl('http://a.com#'), 'http://a.com');
    assert.strictEqual(helper.removeTrailingSymbolFromUrl('http://a.com?'), 'http://a.com');
  });
});
