/**
 * Tests for HGV Symbols
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var Symbols = require( '../lib/components/symbols' ),
	reload = require( 'require-reload' )( require ),
	assert = require( 'assert' );

describe( 'symbols', function() {
	it( 'has error', function() {
		assert.notEqual( undefined, Symbols.err );
	} );

	it( 'has ok', function() {
		assert.notEqual( undefined, Symbols.ok );
	} );

	it( 'differs on Windows or Mac', function() {
		// Store default
		var platform = process.platform;

		// Set Windows
		Object.defineProperty( process, 'platform', {
			value: 'win32'
		} );
		Symbols = reload( '../lib/components/symbols' );
		var win_err = Symbols.err,
			win_ok = Symbols.ok;

		// Set OSX
		Object.defineProperty( process, 'platform', {
			value: 'darwin'
		} );
		Symbols = reload( '../lib/components/symbols' );
		var mac_err = Symbols.err,
			mac_ok = Symbols.ok;

		// Verify differences
		assert.notEqual( win_err, mac_err );
		assert.notEqual( win_ok, mac_ok );

		// Restore default
		Object.defineProperty( process, 'platform', {
			value: platform
		} );
		Symbols = reload( '../lib/components/symbols' );
	} );
} );