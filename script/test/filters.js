/**
 * HGV Version Filters
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var Filters = require( '../lib/components/filters' ),
	assert = require( 'assert' );

describe( 'Filters', function() {
	it( 'parses Vagrant versions', function() {
		var input = 'Vagrant 1.7.4',
			expected = '1.7.4';

		var sanitizer = Filters.vagrant;

		assert.equal( expected, sanitizer( input ) );
	} );

	it( 'parses Windows git versions', function() {
		var input = 'git version 1.9.5.msysgit.0',
			expected = '1.9.5';

		var sanitizer = Filters.git;

		assert.equal( expected, sanitizer( input ) );
	} );

	it( 'parses Mac git versions', function() {
		var input = 'git version 2.3.8 (Apple Git 58)',
			expected = '2.3.8';

		var sanitizer = Filters.git;

		assert.equal( expected, sanitizer( input ) );
	} );

	it( 'parses Vagrant Plugin versions', function() {
		var input = 'vagrant-ghost (0.2.1)',
			expected = '0.2.1';

		var sanitizer = Filters.vagrant_plugin;

		assert.equal( expected, sanitizer( input, 'vagrant-ghost' ) );
	} );
} );