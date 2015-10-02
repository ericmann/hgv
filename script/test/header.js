/**
 * Tests for HGV Header Information
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var header = require( '../lib/header' ),
	assert = require( 'assert' );

describe( 'Header', function() {
	it( 'has content', function() {
		assert.notEqual( '', header );
	} );
} );