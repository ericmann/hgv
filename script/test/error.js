/**
 * Tests for HGV Error Information
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var Err = require( '../lib/error' ),
	assert = require( 'assert' );

describe( 'Error', function() {
	it( 'has no_config', function() {
		var message = '',
			code = 0,
			stderr = process.stderr.write,
			exit = process.exit;

		// Set up polyfills
		process.stderr.write = function( msg ) { message += msg; };
		process.exit = function( errcode ) { code = errcode; };

		// Test
		Err.no_config();

		// Verify
		assert.equal( 1, code );        // Exit with error code 1
		assert.notEqual( '', message ); // Print an error message

		// Reset
		process.stderr.write = stderr;
		process.exit = exit;
	} );

	it( 'has broken_config', function() {
		var message = '',
			code = 0,
			stderr = process.stderr.write,
			exit = process.exit;

		// Set up polyfills
		process.stderr.write = function( msg ) { message += msg; };
		process.exit = function( errcode ) { code = errcode; };

		// Test
		Err.broken_config( 'config' );

		// Verify
		assert.equal( 1, code );        // Exit with error code 1
		assert.notEqual( '', message ); // Print an error message

		// Reset
		process.stderr.write = stderr;
		process.exit = exit;
	} );

	it( 'has broken_site', function() {
		var message = '',
			code = 0,
			stderr = process.stderr.write,
			exit = process.exit;

		// Set up polyfills
		process.stderr.write = function( msg ) { message += msg; };
		process.exit = function( errcode ) { code = errcode; };

		// Test
		Err.broken_site( 'site' );

		// Verify
		assert.equal( 1, code );        // Exit with error code 1
		assert.notEqual( '', message ); // Print an error message

		// Reset
		process.stderr.write = stderr;
		process.exit = exit;
	} );
} );