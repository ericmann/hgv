/**
 * Tests for HGV Usage Information
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var usage = require( '../lib/usage' ),
	assert = require( 'assert' );

describe( 'Usage', function() {
	it( 'has start', function() {
		var message = usage.start;

		assert.notEqual( '', message );
	} );
} );