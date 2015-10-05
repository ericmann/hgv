/**
 * HGV Depencency checker
 *
 * @author WPEngine
 */

'use strict';

/**
 * Module dependencies
 */
var chalk = require( 'chalk' ),
	compareVersion = require( 'compare-version' ),
	exec = require( 'child_process' ).exec,
	os = require( 'os' ),
	semver = require( 'semver' ),
	symbols = require( './symbols' ),
	util = require( 'util' );

/**
 * Test a dependency to make sure the minimum version is installed.
 *
 * @param {String}   name       Name of the dependency to test
 * @param {String}   minVersion Minimum version allowed
 * @param {String}   cliCommand Command line instruction to fetch the version
 * @param {Function} [filter]   Optional filter callback
 * @param {Function} [onError]  Optional error handler when tool is not installed
 *
 * @returns {Promise}
 */
function checkCLIDependency( name, minVersion, cliCommand, filter, onError ) {
	if ( undefined === filter ) {
		filter = semver.clean;
	}

	return new Promise( function( fulfill ) {
		var check = exec( cliCommand, function( err, stdout ) {
			if ( err ) {
				process.stdout.write( '  ' + chalk.red( symbols.err ) + '  ' + chalk.gray( util.format( 'No installation of %s is detected!', name ) ) + os.EOL );

				if ( onError ) {
					onError.apply( null, [name] );
				}
			} else {
				var version = filter.apply( null, [stdout] );

				if ( compareVersion( minVersion, version ) > 0 ) {
					process.stdout.write( '  ' + chalk.red( symbols.err ) + '  ' + chalk.gray( util.format( '%s ' + chalk.red( 'v%s' ) + ' is installed. You need at least ' + chalk.white( 'v%s' ) + '!', name, version, minVersion ) ) + os.EOL );
				} else {
					process.stdout.write( '  ' + chalk.green( symbols.ok ) + '  ' + chalk.gray( util.format( '%s ' + chalk.green( 'v%s' ) + ' looks good!', name, version ) ) + os.EOL );
				}
			}
		} );

		check.on( 'close', fulfill );
	} );
}

/**
 * Test a Vagrant dependency to make sure the recommended version is installed.
 *
 * @param {String}   name       Name of the dependency to test
 * @param {String}   minVersion Minimum version allowed
 * @param {String}   pluginName Name of the Vagrant plugin
 * @param {Function} filter     Optional filter callback
 * @param {Function} [onError]  Optional error handler when tool is not installed
 *
 * @returns {Promise}
 */
function checkVagrantDependency( name, minVersion, pluginName, filter, onError ) {
	return new Promise( function( fulfill ) {
		var check = exec( 'vagrant plugin list', function( err, stdout ) {
			if ( err ) {
				process.stdout.write( '  ' + chalk.red( symbols.err ) + '  ' + chalk.gray( 'Unable to detect any Vagrant plugins.' ) + os.EOL );

				if ( onError ) {
					onError.apply( null, [name] );
				}
			} else {
				var hasPlugin = false,
					pluginVersion,
					plugins = stdout.split( os.EOL );

				for ( var i = 0; i < plugins.length; i++ ) {
					var plugin = plugins[ i ];

					if ( plugin.indexOf( pluginName ) === 0 ) {
						hasPlugin = true;
						pluginVersion = filter.apply( null, [plugin, pluginName] );
						break;
					}
				}

				if ( ! hasPlugin ) {
					process.stdout.write( '  ' + chalk.gray( symbols.err + '  The ' + name + ' plugin (recommended) was not detected!' ) + os.EOL );
				} else {
					if ( compareVersion( minVersion, pluginVersion ) > 0 ) {
						process.stdout.write( '  ' + chalk.red( symbols.err ) + '  ' + chalk.gray( util.format( name + ' ' + chalk.red( 'v%s' ) + ' is installed. You need at least ' + chalk.white( 'v%s' ) + '!', pluginVersion, minVersion ) ) + os.EOL );
					} else {
						process.stdout.write( '  ' + chalk.green( symbols.ok ) + '  ' + chalk.gray( util.format( name + ' ' + chalk.green( 'v%s' ) + ' looks good!', pluginVersion ) ) + os.EOL );
					}
				}
			}
		} );

		check.on( 'close', fulfill );
	} );
}

/**
 * Export the module
 */
module.exports = {
	cli: checkCLIDependency,
	vagrant: checkVagrantDependency
};