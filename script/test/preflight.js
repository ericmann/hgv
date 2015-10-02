/**
 * HGV Requirements Scanner Tests
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var assert = require( 'assert' ),
	preflight = require( '../lib/preflight' );

describe( 'Preflight', function() {
	it( 'reports complete', function() {
		var message = '',
			code = 0,
			stdout = process.stdout.write,
			exit = process.exit;

		// Set up polyfills
		process.stdout.write = function( msg ) { message += msg; };
		process.exit = function( exitcode ) { code = exitcode; };

		// Act
		preflight._complete();

		// Verify
		assert.equal( 0, code );        // Exit with error code 1
		assert.notEqual( '', message ); // Print an error message

		// Reset
		process.stdout.write = stdout;
		process.exit = exit;
	} );

	describe( 'sanitization', function() {
		it( 'parses Vagrant versions', function() {
			var input = 'Vagrant 1.7.4',
				expected = '1.7.4';

			var sanitizer = preflight._sanitizers.vagrant;

			assert.equal( expected, sanitizer( input ) );
		} );

		it( 'parses Windows git versions', function() {
			var input = 'git version 1.9.5.msysgit.0',
				expected = '1.9.5';

			var sanitizer = preflight._sanitizers.git;

			assert.equal( expected, sanitizer( input ) );
		} );

		it( 'parses Mac git versions', function() {
			var input = 'git version 2.3.8 (Apple Git 58)',
				expected = '2.3.8';

			var sanitizer = preflight._sanitizers.git;

			assert.equal( expected, sanitizer( input ) );
		} );
	} );
} );