/**
 * HGV Symbols for CLI prettyiness
 *
 * @author WPEngine
 */

'use strict';

/**
 * Module variables
 */
var symbols = {};

/**
 * Default symbols
 */
symbols.ok = '✓';
symbols.err = '✖';

/**
 * Windows overrides
 */
if ( /^win/.test( process.platform ) ) {
	symbols.ok = '\u221A';
	symbols.err = '\u00D7';
}

/**
 * Export the module
 */
module.exports = symbols;