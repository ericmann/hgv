/**
 * HGV Depencency checker
 *
 * @author WPEngine
 */

'use strict';

/**
 * Test dependencies
 */
var assert = require( 'chai' ).assert,
	events = require( 'events' ),
	util = require( 'util' ),
	proxyquire = require( 'proxyquire' ).noCallThru();

/**
 * Set up mocks
 */

/**
 *
 * @constructor
 */
function Exec() {}
Exec.prototype = new events.EventEmitter;

var myExec = function( command, callback ) {
	var emitter = new Exec();

	switch( command ) {
		case 'no_such_version':
			callback.apply( null, [ true, undefined ] );
			break;
		case 'outdated_version':
			callback.apply( null, [ false, '1.0.0' ] );
			break;
		case 'valid_version':
			callback.apply( null, [ false, '2.0.0' ] );
			break;
	}

	setTimeout( function() { emitter.emit( 'close' ); }, 1 );

	return emitter;
};

var Checker = proxyquire( '../lib/components/checker', {
	child_process: {
		exec: myExec
	}
} );

describe( 'Checker', function() {
	it( 'errors if no installation', function( done ) {
		var message = '',
			stdout = process.stdout.write;

		// Set up polyfills
		process.stdout.write = function( msg ) { message += msg; };

		Checker.cli( 'Git', '2.0.0', 'no_such_version' ).then( function() {

			// Verify
			assert.notEqual( '', message );
			assert.include( message, 'No installation of Git is detected!' );

			// Reset
			process.stdout.write = stdout;

			done();
		} );
	} );

	it( 'errors on outdated installation', function( done ) {
		var message = '',
			stdout = process.stdout.write;

		// Set up polyfills
		process.stdout.write = function( msg ) { message += msg; };

		Checker.cli( 'Git', '2.0.0', 'outdated_version' ).then( function() {

			// Verify
			assert.notEqual( '', message );
			assert.include( message, 'Git' );
			assert.include( message, 'v1.0.0' );
			assert.include( message, 'is installed. You need at least' );
			assert.include( message, 'v2.0.0' );

			// Reset
			process.stdout.write = stdout;

			done();
		} );
	} );

	it( 'succeeds with proper install', function( done ) {
		var message = '',
			stdout = process.stdout.write;

		// Set up polyfills
		process.stdout.write = function( msg ) { message += msg; };

		Checker.cli( 'Git', '2.0.0', 'valid_version' ).then( function() {

			// Verify
			assert.notEqual( '', message );
			assert.include( message, 'Git' );
			assert.include( message, 'v2.0.0' );
			assert.include( message, 'looks good!' );

			// Reset
			process.stdout.write = stdout;

			done();
		} );
	} );
} );