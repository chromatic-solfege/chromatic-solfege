function chromatic( __settings, __object ) {
	var __defaultSettings = {
		// noteEvent : putTripleAccidentals,
		noteEvent : transparent,
	};
	base_settings = Object.assign( {}, 
			__defaultSettings, require ( 'chromatic-solfege/settings' ), __settings  );

	var DEBUG = false;
	var DIATONIC_NOTE_COUNT = 7;
	var NOTE_VOID = 'void'

	function multiply( arr ) {
		return [].concat(
				arr.map( (s)=>`    ${s},,,,,`.trim() ) , // c-1
				arr.map( (s)=>`    ${s},,,, `.trim() ) , // c0
				arr.map( (s)=>`    ${s},,,  `.trim() ) , // c1
				arr.map( (s)=>`    ${s},,   `.trim() ) , // c2
				arr.map( (s)=>`    ${s},    `.trim() ) , // c3
				arr.map( (s)=>`    ${s}     `.trim() ) , // c4
				arr.map( (s)=>`    ${s}'    `.trim() ) , // c5
				arr.map( (s)=>`    ${s}''   `.trim() ) , // c6
				arr.map( (s)=>`    ${s}'''  `.trim() )   // c7
			);
	}
	var NOTE_NI_TRANSLATE_OFFSET = DIATONIC_NOTE_COUNT * 5; // ADDED <<< (Tue, 15 May 2018 16:26:08 +0900)

	/*
	 * Note that c' in Lilypond is treated as c4 .
	 *
	 * In this program, c' is treated as c5 so that not dash/comma comes to octave zero
	 * which let users free from adding dashes to relative intervals in the
	 * same octave.
	 *
	 * (Sun, 20 May 2018 06:02:27 +0900)
	 */

	var NOTE_QUADRUPLE_FLAT  = multiply( [ 'daes','raes','maes','faes','saes','laes','taes', ] );
	var NOTE_7QTR_FLAT       = multiply( [ 'dawm','rawm','mawm','fawm','sawm','lawm','tawm', ] );
	var NOTE_TRIPLE_FLAT     = multiply( [ 'dae', 'rae', 'mae', 'fae', 'sae', 'lae', 'tae',  ] );
	var NOTE_5QTR_FLAT       = multiply( [ 'dawn','rawn','mawn','fawn','sawn','lawn','tawn', ] );
	var NOTE_DOUBLE_FLAT     = multiply( [ 'daw', 'raw', 'maw', 'faw', 'saw', 'law', 'taw',  ] );
	var NOTE_3QTR_FLAT       = multiply( [ 'dem', 'ram', 'mem', 'fem', 'sem', 'lem', 'tem',  ] );
	var NOTE_FLAT            = multiply( [ 'de' , 'ra',  'me',  'fe',  'se',  'le',  'te',   ] );
	var NOTE_1QTR_FLAT       = multiply( [ 'dew', 'rew', 'mew', 'few', 'sew', 'lew', 'tew',  ] );
	var NOTE_NATURAL         = multiply( [ 'do' , 're',  'mi',  'fa',  'sol', 'la',  'ti',   ] );
	var NOTE_1QTR_SHARP      = multiply( [ 'dia', 'ria', 'mia', 'fia', 'sia', 'lia', 'tia',  ] );
	var NOTE_SHARP           = multiply( [ 'di' , 'ri',  'ma',  'fi',  'si',  'li',  'ta',   ] );
	var NOTE_3QTR_SHARP      = multiply( [ 'dim', 'rim', 'mam', 'fim', 'sim', 'lim', 'tam',  ] );
	var NOTE_DOUBLE_SHARP    = multiply( [ 'dai', 'rai', 'mai', 'fai', 'sai', 'lai', 'tai',  ] );
	var NOTE_5QTR_SHARP      = multiply( [ 'dain','rain','main','fain','sain','lain','tain', ] );
	var NOTE_TRIPLE_SHARP    = multiply( [ 'dao', 'rao', 'mao', 'fao', 'sao', 'lao', 'tao',  ] );
	var NOTE_7QTR_SHARP      = multiply( [ 'daim','raim','maim','faim','saim','laim','taim', ] );
	var NOTE_QUADRUPLE_SHARP = multiply( [ 'daos','raos','maos','faos','saos','laos','taos', ] );

	var NOTES_ALL = [
		NOTE_QUADRUPLE_FLAT,
		NOTE_7QTR_FLAT ,
		NOTE_TRIPLE_FLAT ,
		NOTE_5QTR_FLAT ,
		NOTE_DOUBLE_FLAT,
		NOTE_3QTR_FLAT ,
		NOTE_FLAT ,
		NOTE_1QTR_FLAT ,
		NOTE_NATURAL,
		NOTE_1QTR_SHARP, 
		NOTE_SHARP, 
		NOTE_3QTR_SHARP, 
		NOTE_DOUBLE_SHARP,
		NOTE_5QTR_SHARP, 
		NOTE_TRIPLE_SHARP, 
		NOTE_7QTR_SHARP, 
		NOTE_QUADRUPLE_SHARP,
	];
	// var NOTE_LOOKUP_OFFSET       = 7;

	var DIATONIC_TO_CHROMATIC = (()=>{
		var __offset = ( arr, v ) => {
			// console.error( v );
			var result=[];
			for ( var i=0; i<arr.length; i++ ) {
				result[i] = arr[i] + v;
			}
			// console.error( result );
			return result;
		};
		var t = [ 0, 4, 8, 10, 14, 18, 22, ]; 

		var octave = 24

		return [].concat( 
				__offset(t, octave * -5 ), // c-1
				__offset(t, octave * -4 ), // c0
				__offset(t, octave * -3 ), // c1
				__offset(t, octave * -2 ), // c2
				__offset(t, octave * -1 ), // c3
				__offset(t, octave *  0 ), // c4
				__offset(t, octave *  1 ), // c5
				__offset(t, octave *  2 ), // c6
				__offset(t, octave *  3 )  // c7
			 );
	})();

	var NOTES_CHROMATIC_VERTICAL_OFFSET = Math.floor( NOTES_ALL.length / 2 );
	var NOTES_CHROMATIC_VALUE_TABLE = (()=>{
		var arr = [];
		for ( var i=0; i<NOTES_ALL.length; i++ ) {
			arr[i] = [];
			for ( var j=0; j< NOTES_ALL[i].length; j++ ) {
				arr[i][j] = DIATONIC_TO_CHROMATIC[ j ] - NOTES_CHROMATIC_VERTICAL_OFFSET + i;
			}
		}
		return arr;
	})();

	// console.error( NOTES_CHROMATIC_VALUE_TABLE  );


	var dumpTable = (()=>{
		function format( s, l ) {
			var s = String(s);
			while ( s.length < l ) {
				s = ' ' + s;
			}
			return s;
		}
		return (arr)=> {
			var out= process.stderr;
			for ( var i=0; i<arr.length; i++ ) {
				for ( var j=0; j<arr[i].length; j++ ) {
					out.write( format( arr[i][j], 3 )  + ',' );
					if ( ( j +1 ) % 7 == 0 ) {
						out.write( '  ' );
					}
				}
				out.write( '\n' );
			}
			out.write( '\n' );
		};
	})();

	if ( DEBUG )
		dumpTable( NOTES_CHROMATIC_VALUE_TABLE );


	function __dumpTable() {
		dumpTable( NOTES_CHROMATIC_VALUE_TABLE );
	}



	// Chromatic
	// var NOTES_CHROMATIC_VALUE_TABLE = [
	// 	[-15, -13, -11, -10,  -8, -6, -4,  -3 ,-1, 1, 2, 4,  6,  8,    9, 11, 13, 14, 16, 18, 20, 21 ],
	// 	[-14, -12, -10,  -9,  -7, -5, -3,  -2 , 0, 2, 3, 5,  7,  9,   10, 12, 14, 15, 17, 19, 21, 22 ],
	// 	[-13, -11,  -9,  -8,  -6, -4, -2,  -1 , 1, 3, 4, 6,  8, 10,   11, 13, 15, 16, 18, 20, 22, 23 ],
	// 	[-12, -10,  -8,  -7,  -5, -3, -1,   0 , 2, 4, 5, 7,  9, 11,   12, 14, 16, 17, 19, 21, 23, 24 ],
	// 	[-11,  -9,  -7,  -6,  -4, -2,  0,   1 , 3, 5, 6, 8, 10, 12,   13, 15, 17, 18, 20, 22, 24, 25 ],
	// 	[-10,  -8,  -6,  -5,  -3, -1,  1,   2 , 4, 6, 7, 9, 11, 13,   14, 16, 18, 19, 21, 23, 25, 26 ],
	// 	[ -9,  -7,  -5,  -4,  -2,  0,  2,   3 , 5, 7, 8,10, 12, 14,   15, 17, 19, 20, 22, 24, 26, 27 ],
	// ];

	// // Micro Chromatic ( 26 Mar 2018)
	// var NOTES_CHROMATIC_VALUE_TABLE = [
	// 	[ -30,-26,-22,-20,-16,-12, -8,   -6, -2,  2,  4,  8, 12, 16,    18, 22, 26, 28, 32, 36, 40, 42, ], // QUADRUPLE FLAT
	// 	[ -28,-24,-20,-18,-14,-10, -6,   -4,  0,  4,  6, 10, 14, 18,    20, 24, 28, 30, 34, 38, 42, 44, ], // DOUBLE FLAT
	// 	[ -26,-22,-18,-16,-12, -8, -4,   -2,  2,  6,  8, 12, 16, 20,    22, 26, 30, 32, 36, 40, 44, 46, ], // FLAT
	// 	[ -24,-20,-16,-14,-10, -6, -2,    0,  4,  8, 10, 14, 18, 22,    24, 28, 32, 34, 38, 42, 46, 48, ], // NATURAL
	// 	[ -22,-18,-14,-12, -8, -4,  0,    2,  6, 10, 12, 16, 20, 24,    26, 30, 34, 36, 40, 44, 48, 50, ], // SHARP
	// 	[ -20,-16,-12,-10, -6, -2,  2,    4,  8, 12, 14, 18, 22, 26,    28, 32, 36, 38, 42, 46, 50, 52, ], // DOUBLE SHARP
	// 	[ -18,-14,-10, -8, -4,  0,  4,    6, 10, 14, 16, 20, 24, 28,    30, 34, 38, 40, 44, 48, 52, 54, ], // QUADRUPLE SHARP
	// ];

	var IDX_CTR = 0;
	var IDX_QUADRUPLE_FLAT  = IDX_CTR++;
	var IDX_7QTR_FLAT       = IDX_CTR++;
	var IDX_TRIPLE_FLAT     = IDX_CTR++;
	var IDX_5QTR_FLAT       = IDX_CTR++;
	var IDX_DOUBLE_FLAT     = IDX_CTR++;
	var IDX_3QTR_FLAT       = IDX_CTR++;
	var IDX_FLAT            = IDX_CTR++;
	var IDX_1QTR_FLAT       = IDX_CTR++;
	var IDX_NATURAL         = IDX_CTR++;
	var IDX_1QTR_SHARP      = IDX_CTR++;
	var IDX_SHARP           = IDX_CTR++;
	var IDX_3QTR_SHARP      = IDX_CTR++;
	var IDX_DOUBLE_SHARP    = IDX_CTR++;
	var IDX_5QTR_SHARP      = IDX_CTR++;
	var IDX_TRIPLE_SHARP    = IDX_CTR++;
	var IDX_7QTR_SHARP      = IDX_CTR++;
	var IDX_QUADRUPLE_SHARP = IDX_CTR++;


	function NoteLoc( ci, ni ) {
		if (DEBUG ) console.error( 'NoteLoc(' + ci + ',' + ni + ')' );
		// category index   // =alteration (Tue, 15 May 2018 16:26:08 +0900)
		this.ci = ci;
		// note index
		this.ni = ni;
	}

	NoteLoc.prototype.getChromaticIndex = function () {
		try {
			return NOTES_CHROMATIC_VALUE_TABLE[this.ci][this.ni];
		} catch ( e ) {
			// console.error( 'WARNING location:', this.ci + "," + this.ni + " void"   );
			// return NOTE_VOID;
			throw new Error( "Could not refer the chromatic value at [ " + this.ci + "," + this.ni + "]" );
		}
	};
	NoteLoc.prototype.getDiatonicIndex = function () {
		// return this.ni % 7;
		return this.ni ;
	};

	NoteLoc.prototype.getNoteName = function() {
		try {
			return NOTES_ALL[this.ci][this.ni];
		} catch ( e ) {
			console.error( 'WARNING location:', this.ci + "," + this.ni + " void"   );
			return NOTE_VOID;
			throw new Error( "Could not refer the note name at [ " + this.ci + "," + this.ni + "]" );
			// return '\\textSpanColorB do\\uin  s\\uout';
		}
	};
	NoteLoc.prototype.debug = function() {
		return this.getNoteName() +
			'('  + this.ci + ',' + this.ni + ') ' +
			'7=>'   + this.getDiatonicIndex() + ' ' +
			'24=>'  + this.getChromaticIndex() + ' ' + 
			'';
	};
	NoteLoc.prototype.toString = function() {
		return this.getNoteName();
	};
	NoteLoc.prototype.translate = function() {
		var ci = arguments[0];
		var ni = arguments[1];
		if (DEBUG ) console.error( `translate ( ${ci}, ${ ni } ) on NoteLoc( ${ this.ci } , ${this.ni } ) ` );
		return new NoteLoc( this.ci + ci  , this.ni + ni );
	};

	NoteLoc.lookup = function ( noteName )  {
		for ( var ci = 0; ci< NOTES_ALL.length; ci++ ) {
			// for ( var ni = NOTE_LOOKUP_OFFSET; ni< NOTE_LOOKUP_OFFSET + DIATONIC_NOTE_COUNT; ni++ )
			for ( var ni = 0; ni< NOTES_ALL[ci] .length; ni++ ) {
				// console.error( 'ci',ci,'ni',ni, NOTES_ALL[ci][ni] );
				if ( NOTES_ALL[ci][ni] == noteName ) {
					if (DEBUG ) console.error( 'found ' + noteName +'[' + ci + ',' + ni + ']' );
					return new NoteLoc( ci, ni );
				}
			}
		}
		throw new Error( '`' + noteName + '` is not a valid note name' );
	};



	/*
	 * Looking up Notes by Number   (Thu, 22 Mar 2018 21:09:45 +0900)
	 *
	 * There are multiple notes per a chromatic number. For example, when you look
	 * up 4, the result would be [ mi, fe ]. In another example, if 7 is the number
	 * that you look up, 7, the result would be [ sol fai law ].
	 *
	 * Therefore the user must to specify priority which indicates priority between
	 * the these series [ double sharp, sharp, natural, flat, double flat ].
	 */
	var NOTELOC_LOOKUP_C_PRIORITY_TABLE = {
		// double sharp
		ds : [
			IDX_DOUBLE_SHARP,
			IDX_SHARP, 
			IDX_NATURAL,
			IDX_FLAT ,
			IDX_DOUBLE_FLAT,
		],
		// sharp
		s : [
			IDX_NATURAL,
			IDX_SHARP, 
			IDX_FLAT ,
			IDX_DOUBLE_SHARP,
			IDX_DOUBLE_FLAT,
		],
		// natural
		n : [
			IDX_NATURAL,
			IDX_FLAT ,
			IDX_SHARP, 
			IDX_DOUBLE_FLAT,
			IDX_DOUBLE_SHARP,
		],
		// flat
		f : [
			IDX_NATURAL,
			IDX_FLAT ,
			IDX_SHARP, 
			IDX_DOUBLE_FLAT,
			IDX_DOUBLE_SHARP,
		],
		// double flat
		df : [
			IDX_DOUBLE_FLAT,
			IDX_FLAT ,
			IDX_NATURAL,
			IDX_SHARP, 
			IDX_DOUBLE_SHARP,
		],
	};

	// Lookup a proper NoteLoc object by chromatic order numeral
	NoteLoc.lookup_c = function ( num, type )  {
		if ( ! type ) type = 'n';
		num = Number(num);

		var note_arr_idx = NOTELOC_LOOKUP_C_PRIORITY_TABLE[ type ];
		if ( ! note_arr_idx )
			throw new Error( '`' + type + '` is not a valid node class name. The value supported to be one of (ds,s,n,f,df). ' );

		for ( var ci = 0; ci< note_arr_idx.length; ci++ ) {
			var ci2 = note_arr_idx[ci];

			for ( var ni = 0; ni< NOTES_CHROMATIC_VALUE_TABLE[ci2].length; ni++ ) {
				// console.error( NOTES_CHROMATIC_VALUE_TABLE[ci2][ni] );
				if ( NOTES_CHROMATIC_VALUE_TABLE[ci2][ni] == num ) {
					if (DEBUG ) console.error( 'lookup' );
					return new NoteLoc( ci2, ni );
				}
			}
		}
		throw new Error( '`' + num + '` is not a valid note name.' );
	};

	function parseInterval( interval ) {
		var parsed = /^([a-zA-Z]+)([,']*)([0-9]*)$/.exec( interval );
		if ( ! parsed )
			throw new Error( '"'+  interval + '" is not valid note value.' );

		return {
			name : parsed[1],
			octave  : parsed[2],
			notelen  : parsed[3],
		};
	}

	function __transpose0( root, interval ) {
		var rootNote     = NoteLoc.lookup( root ); 
		var intervalNote = NoteLoc.lookup( interval );

		// Increment the value by diatonic offset
		var tempNote = rootNote.translate( 0, intervalNote.getDiatonicIndex() - NOTE_NI_TRANSLATE_OFFSET );

		if ( DEBUG )
			console.error( 'root=>', rootNote.debug(), '\ninterval=>', intervalNote.debug(), '\ntemp=>' , tempNote.debug() );

		// Calculate chromatic offset of the value
		var coff =
			rootNote.getChromaticIndex() + intervalNote.getChromaticIndex()  -
			tempNote.getChromaticIndex();

		// console.error( 'coff', coff );

		var resultNote = tempNote.translate( coff, 0 );

		return resultNote.toString();
	}

	function __transpose( root, interval, is_absolute ) {
		if (/[\s+]/.exec( interval ) )
			return interval;

		// ADDED >>> (Wed, 06 Jun 2018 07:44:58 +0900)
		// Ignore every bar specifier.
		if ( /\|/.exec( interval ) ) {
			return interval;
		}
		if ( /^".*"$/.exec( interval ) )
			// console.error( 'interval',  interval );
			return interval;
		// <<<

		switch ( interval ) {
			case ''  : 
			case '!' :     // << ADDED ON (Wed, 06 Jun 2018 07:44:58 +0900)
			case '=' :
			// case '|' :   // << REMOVED ON (Wed, 06 Jun 2018 07:44:58 +0900)
			// case '||':   // << REMOVED ON (Wed, 06 Jun 2018 07:44:58 +0900)
			case '.' :
			// case '|.' :  // << REMOVED ON (Wed, 06 Jun 2018 07:44:58 +0900)
			// case '.|' :  // << REMOVED ON (Wed, 06 Jun 2018 07:44:58 +0900)
			// case '|.|':  // << REMOVED ON (Wed, 06 Jun 2018 07:44:58 +0900)
			case '..' :
			case '=' :
			case '[' :
			case ']' :
			case '<' :
			case '>' :
			case 's' :
			case '{' :
			case '}' :
				return interval;
		}

		if ( /^\#/.exec( interval ) ) 
			return interval;

		if ( /^\\/.exec( interval ) )
			// console.error( 'interval',  interval );
			return interval;


		var parsedInterval = parseInterval( interval );

		switch  ( parsedInterval.name ) {
			case 's' :
				return interval;
			case 'r' :
				return interval;
		}

		if ( is_absolute ) {
			return __transpose0( root, parsedInterval.name + parsedInterval.octave ) + parsedInterval.notelen;
		} else {
			return parseInterval( 
					__transpose0( root, parsedInterval.name ) 
					).name + parsedInterval.octave + parsedInterval.notelen;
		}
	}

	function transpose( root, intervals, is_absolute ) {
		function single_executeProc( root, intervals ) {
			return __transpose( root, intervals, is_absolute );
		}

		// (Thu, 26 Apr 2018 19:10:15 +0900)
		// BE CAREFUL ***************
		// This must be ' ' not \s since \n has a special meaning here.

		// (Thu, 26 Apr 2018 19:10:15 +0900)
		// ******************* I FORGOT TO FIX THIS *********************
		if ( typeof root === 'string' )
			// root = root.trim().split( /\s+/ );
			root = root.trim().split( / +/ );

		// (Thu, 26 Apr 2018 19:10:15 +0900)
		// ******************* I FORGOT TO FIX THIS *********************
		if ( typeof intervals === 'string' )
			// intervals = intervals.trim().split( /\s+/ );
			intervals = intervals.trim().split( / +/ );

		if ( 1 < root.length  )
			[ root ,intervals ]  = [ [ root.shift() ], root ] ;

		// XXX TWO ARGUMENTS IMPLY SINGLE EXECUTION.
		// var [ _result, _scale ] =  multi_executeProc( root, intervals );
		//
		return single_executeProc( root.shift(), intervals.shift() );
	}

	function transposeScript( value, settings  ) {
		var curr_settings = Object.assign( {}, base_settings, settings );

		function interpolateScales( root, intervals, scale ) {
			// >>> MODIFIED (Sat, 21 Apr 2018 08:26:11 +0900)
			// let matched = /([a-zA-Z0-9]+)@\((\S*)\)/.exec( root );
			let matched    = /([a-zA-Z0-9\=\-\>\<]+)\((\S*)\)/.exec( root );
			// <<< MODIFIED (Sat, 21 Apr 2018 08:26:11 +0900) 

			if ( matched ) {
				scale = matched[2].trim().split( /,/ );
				root  = matched[1].trim();
			}

			/*
			 * If the interval string starts with an alphabet, then treat
			 * it as notes; if the interval string starts with a number,
			 * then treat it as scale index. 
			 *
			 * Note for extensibility, if it comes that something different
			 * must be there before the notes, there is a little place to 
			 * extend this syntax. One of possible solutions is let some
			 * characters precedes to the notes. 
			 * 
			 * Current 
			 *     do4 => do4
			 *     1&4 => do4
			 *
			 * An example of possible Solution
			 *    some^${1&4} =>some^do4
			 *
			 * (Sun, 22 Apr 2018 17:28:20 +0900)
			 */

			// console.error("Intervals1", intervals );
			for ( var i=0; i<intervals.length; i++ ) {
				var matched2 = /^([0-9]+)(.*)/.exec( intervals[i] );
				if ( matched2 ) {
					if ( scale == null ) {
						throw new Error( `scale not defined error(${intervals[i]})` );
					}
					var n = (Number( matched2[1] ) -1) % scale.length;
					intervals[i] = scale[n] + matched2[2];
				}
			}

			// ADDED (Fri, 13 Apr 2018 11:13:34 +0900) >>
			for ( var i=0; i<intervals.length; i++ ) {
				intervals[i] = intervals[i].replace( /\&/, '' );
			}
			// ADDED (Fri, 13 Apr 2018 11:13:34 +0900) <<

			// console.error("Intervals2", intervals );
			return [ root, intervals, scale ];
		}

		function multi_executeProc( root, intervals, scale ) {
			if ( root.trim() == '' || intervals.length == 0 )
				return [ [], scale ];

			[ root, intervals, scale ] = interpolateScales( root, intervals, scale );

			// Parse the root specifier in a block.
			{
				var parsedRoot = root.split( /\=\>/ );
				var fromKey , toKey;
				if ( parsedRoot.length == 1 ) {
					fromKey = NoteLoc.lookup( "do" );
					toKey   = NoteLoc.lookup( parsedRoot[0] );
				} else {
					fromKey = NoteLoc.lookup( parsedRoot[0] );
					toKey   = NoteLoc.lookup( parsedRoot[1] );
				}

				var baseKey = NoteLoc.lookup( "do" );
				root = new NoteLoc( 
						toKey.ci - fromKey.ci + baseKey.ci  , 
						toKey.ni - fromKey.ni + baseKey.ni ).getNoteName();

				// console.error( 'fromKey=>', fromKey.debug(), 'toKey=>', toKey.debug() , 'root=>' , root );
			}


			var result = [];
			for ( var i=0; i<intervals.length; i++ ) {
				var note = intervals[i];

				switch ( note.trim() ) {
					case "" :
						// Ignore empty strings
						continue;
					case "\\enh" : 
						flag_enharmonic = true;
						continue; // continue the loop.
					case "\\har" : 
						flag_enharmonic = false;
						continue; // continue the loop.
					case "\\abs" : 
						flag_is_absolute = true;
						continue; // continue the loop.
					case "\\rel" : 
						flag_is_absolute = false;
						continue; // continue the loop.
					default :
						break;
				}
					
				note = __transpose( root, note, flag_is_absolute );
				note = curr_settings.noteEvent( note );

				if ( flag_enharmonic ) {
					note = enharmonize( note );
				}
				result.push( note );
			}
			return [ result, scale ];
		}

		var result = [];
		var scale = null;
		var flag_enharmonic = false;
		var flag_is_absolute = false;

		/*
		 * Append a block header mark and a root specifier to the input string.
		 *
		 * This enables : 
		 *
		 *  1. If no mark is specified, treat it as the only block.
		 *  2. Otherwise treat the mark as a separator and divide it 
		 *     into blocks then ignore first block.
		 *  3. Let the first block through into the result. This enables
		 *     users to specify some lilypond commands before the notes.
		 *     (Without this specification, the first element is removed
		 *     because the first element is always be taken for the root
		 *     specifier.
		 *
		 * (Wed, 16 May 2018 04:34:51 +0900)
		 */
		if ( ! /@/.exec( value.trim() ) ) {
			value = "@" + value.trim();
		} else if ( ! /^@/.exec( value.trim() ) ) {
			value = "@do " + value;
		}

		var blockList = value.split( /\@/ );

		// Remove the first block and let it go to the result.  Currently this
		// string is always an empty string. Therefore appending it to the result
		// is rather meaningless but this was left for future extension.
		//
		// TEMPORARY REMOVE THIS (Sat, 08 Jun 2019 10:14:27 +0900)
		// result = result.concat( blockList.shift() );

		for ( var i=0; i<blockList.length; i++ ) {
			// DON'T TRIM THIS HERE!!! 
			// '\n' would come into this place.
			//  (Sat, 21 Apr 2018 07:31:13 +0900)
			var block = blockList[i];

			// THEN TRIM IT AND CHECK IF IT IS NULL!!
			// AND LET THE VALUE ITSELF UNTRIMMED!!
			if ( block.trim() === "" ) {
				continue;
			}

			// (Thu, 05 Apr 2018 11:40:14 +0900)
			// This must be ' ' not \s since \n has a special meaning here.
			if ( typeof block === 'string' )
				// block = block.trim().split( /\s+/ );
				// block = block.trim().split( / +/ ); //<<< ??? MODIFIED (Mon, 14 May 2018 04:19:33 +0900)
				block = block.split( / +/ );

			// console.error( block );

			var [ root ,intervals ]  = [ block.shift(), block ] ;

			var [ _result, _scale ] = multi_executeProc( root, intervals, scale ) ;
			scale = _scale;
			result = result.concat( _result )
		}

		return result;
	}


	function relativize( func ) {
		return function( value ) {
			var parsed = parseInterval( value );
			return func( parsed.name ) + parsed.octave + + parsed.notelen;
		}
	}

	var enharmonize = (()=>{
		function enharmonize( note, wrapper ){ 
			if ( ! wrapper ) {
				wrapper = function __wrapper( s ) {
					return s;
				}
			}
			switch ( note ) {
				case 'ta' : return wrapper( 'do' );
				case 'de' : return wrapper( 'ti' );
				case 'ma' : return wrapper( 'fa' );
				case 'fe' : return wrapper( 'mi' );

				case 'daw': return wrapper( 'te' );
				case 'raw': return wrapper( 'do' );
				case 'maw': return wrapper( 're' );
				case 'faw': return wrapper( 'me' );
				case 'saw': return wrapper( 'fa' );
				case 'law': return wrapper( 'sol' );
				case 'taw': return wrapper( 'la' );

				case 'dae': return wrapper( 'la' );
				case 'rae': return wrapper( 'ti' );
				case 'mae': return wrapper( 'ra' );
				case 'fae': return wrapper( 're' );
				case 'sae': return wrapper( 'fa' );
				case 'lae': return wrapper( 'se' );
				case 'tae': return wrapper( 'le' );

				case 'dai': return wrapper( 're' );
				case 'rai': return wrapper( 'mi' );
				case 'mai': return wrapper( 'fi' );
				case 'fai': return wrapper( 'sol' );
				case 'sai': return wrapper( 'la' );
				case 'lai': return wrapper( 'ti' );
				case 'tai': return wrapper( 'di' );

				case 'dao': return wrapper( 'ri'  );
				case 'rao': return wrapper( 'fa'  );
				case 'mao': return wrapper( 'sol' );
				case 'fao': return wrapper( 'si'  );
				case 'sao': return wrapper( 'li'  );
				case 'lao': return wrapper( 'do'  );
				case 'tao': return wrapper( 're'  );

				default :
					return note;
			}
		}

		return relativize( enharmonize );
	})();



	function __enharmonize( notes, wrapper ) {
		if ( Array.isArray( notes ) ) {
			notes = Array.prototype.slice.call( notes );
			for ( var i=0; i<notes.length; i++ ) {
				notes[i] = enharmonize( notes[i], wrapper );
			}
			return notes;
		} else {
			return enharmonize( notes, wrapper );
		}
	}

	function isQuadrupleSharp( note ) {
		return 0<=NOTE_QUADRUPLE_SHARP.indexOf( note );
	}
	function isQuadrupleFlat( note ) {
		return 0<=NOTE_QUADRUPLE_FLAT.indexOf( note );
	}
	function isQuadrupleAccidental( note ) {
		return isQuadrupleFlat( note ) || isQuadrupleSharp( note );
	}

	function isTripleSharp( note ) {
		return 0<=NOTE_TRIPLE_SHARP.indexOf( note );
	}
	function isTripleFlat( note ) {
		return 0<=NOTE_TRIPLE_FLAT.indexOf( note );
	}
	function isTripleAccidental( note ) {
		return isTripleFlat( note ) || isTripleSharp( note );
	}



	function isDoubleSharp( note ) {
		return 0<=NOTE_DOUBLE_SHARP.indexOf( note );
	}
	function isDoubleFlat( note ) {
		return 0<=NOTE_DOUBLE_FLAT.indexOf( note );
	}
	function isDoubleAccidental( note ) {
		return isDoubleFlat( note ) || isDoubleSharp( note );
	}
	function isSharp( note ) {
		return 0<=NOTE_SHARP.indexOf( note );
	}
	function isFlat( note ) {
		return 0<=NOTE_FLAT.indexOf( note );
	}
	function isAccidental( note ) {
		return isFlat( note ) || isSharp( note );
	}
	function isNatural( note ) {
		return 0<=NOTE_NATURAL.indexOf( note );
	}
	function isNote( note ) {
		return 
			isNatural( note ) ||
			isAccidental( note ) || 
			isDoubleAccidental( note ) ||
			isTripleAccidental( note ) ||
			isQuadrupleAccidental( note ) ||
			false;
	}

	function isIrregularAccidental( note ) {
		switch ( note  ) {
			case 'de' : 
			case 'ta' : 
			case 'ma' : 
			case 'fe' : 
				return true;
		}
		return false;
	}

	function transparent( n ) {
		return n;
	}
	function putTripleAccidentals( n ) {
		if ( isTripleSharp( n ) ) {
			return '\\sharpdoublesharp ' + n;
		} else if ( isTripleFlat( n ) ) {
			return '\\flatdoubleflat ' + n;
		} else if ( isQuadrupleSharp( n ) ) {
			return '\\doublesharpdoublesharp ' + n;
		} else if ( isQuadrupleFlat( n ) ) {
			return '\\doubleflatdoubleflat ' + n;
		} else {
			return n;
		}
	}



	function respell( note ) {
		switch ( note  ) {
			// sharp to flat
			case 'di' : return 'ra';
			case 'ri' : return 'me';
			case 'ma' : return 'fa';
			case 'fi' : return 'se';
			case 'si' : return 'le';
			case 'li' : return 'te';
			case 'ta' : return 'do';

			// flat to sharp
			case 'de' : return 'ti';
			case 'ra' : return 'di';
			case 'me' : return 'ri';
			case 'fe' : return 'mi';
			case 'se' : return 'fi';
			case 'le' : return 'si';
			case 'te' : return 'li';

			// natural to flat / sharp
			case 'ti' : return 'de';
			case 'mi' : return 'fe';
			case 'fa' : return 'ma';
			case 'do' : return 'ta';

			// double flat
			case 'daw': return 'te';
			case 'raw': return 'do';
			case 'maw': return 're';
			case 'faw': return 'me';
			case 'saw': return 'fa';
			case 'law': return 'sol';
			case 'taw': return 'la';

			// double sharp
			case 'dai': return 're';
			case 'rai': return 'mi';
			case 'mai': return 'fi';
			case 'fai': return 'sol';
			case 'sai': return 'la';
			case 'lai': return 'ti';
			case 'tai': return 'di';
		}
		return note;
	}

	function note2number( note ) {
		return NoteLoc.lookup( note ).getChromaticIndex() / 2;
	}

	function number2note( cval, type ) {
		cval = Number( cval ) *2 ;
		return NoteLoc.lookup_c( cval, type ).getNoteName();
	}

	function enharmonize2( note, type ){
		var cval = NoteLoc.lookup( note ).getChromaticIndex();
		return NoteLoc.lookup_c( cval, type ).getNoteName();
	}
	function __enharmonize2( notes, type ) {
		if ( Array.isArray( notes ) ) {
			notes = Array.prototype.slice.call( notes );
			for ( var i=0; i<notes.length; i++ ) {
				notes[i] = enharmonize2( notes[i], type );
			}
			return notes;
		} else {
			return enharmonize2( notes, type );
		}
	}



	function note2alphabet( note ) {
		switch ( note  ) {
			// sharp to flat
			case 'di' : return 'c♯';
			case 'ri' : return 'd♯';
			case 'ma' : return 'e♯';
			case 'fi' : return 'f♯';
			case 'si' : return 'g♯';
			case 'li' : return 'a♯';
			case 'ta' : return 'b♯';

			// flat to sharp
			case 'de' : return 'c♭';
			case 'ra' : return 'd♭';
			case 'me' : return 'e♭';
			case 'fe' : return 'f♭';
			case 'se' : return 'g♭';
			case 'le' : return 'a♭';
			case 'te' : return 'b♭';

			// flat to sharp
			case 'do'  : return 'c';
			case 're'  : return 'd';
			case 'mi'  : return 'e';
			case 'fa'  : return 'f';
			case 'sol' : return 'g';
			case 'la'  : return 'a';
			case 'ti'  : return 'b';


			// double flat
			case 'daw': return 'c𝄪';
			case 'raw': return 'd𝄪';
			case 'maw': return 'e𝄪';
			case 'faw': return 'f𝄪';
			case 'saw': return 'g𝄪';
			case 'law': return 'a𝄪';
			case 'taw': return 'b𝄪';

			// double sharp
			case 'dai': return 'c𝄫';
			case 'rai': return 'd𝄫';
			case 'mai': return 'e𝄫';
			case 'fai': return 'f𝄫';
			case 'sai': return 'g𝄫';
			case 'lai': return 'a𝄫';
			case 'tai': return 'b𝄫';

			// triple flat
			case 'dae': return 'c♯𝄪';
			case 'rae': return 'd♯𝄪';
			case 'mae': return 'e♯𝄪';
			case 'fae': return 'f♯𝄪';
			case 'sae': return 'g♯𝄪';
			case 'lae': return 'a♯𝄪';
			case 'tae': return 'b♯𝄪';

			// triple sharp
			case 'dao': return 'c♭𝄫';
			case 'rao': return 'd♭𝄫';
			case 'mao': return 'e♭𝄫';
			case 'fao': return 'f♭𝄫';
			case 'sao': return 'g♭𝄫';
			case 'lao': return 'a♭𝄫';
			case 'tao': return 'b♭𝄫';

			// quadruple flat
			case 'daes': return 'c𝄪𝄪';
			case 'raes': return 'd𝄪𝄪';
			case 'maes': return 'e𝄪𝄪';
			case 'faes': return 'f𝄪𝄪';
			case 'saes': return 'g𝄪𝄪';
			case 'laes': return 'a𝄪𝄪';
			case 'taes': return 'b𝄪𝄪';

			// quadruple sharp
			case 'daos': return 'c𝄫𝄫';
			case 'raos': return 'd𝄫𝄫';
			case 'maos': return 'e𝄫𝄫';
			case 'faos': return 'f𝄫𝄫';
			case 'saos': return 'g𝄫𝄫';
			case 'laos': return 'a𝄫𝄫';
			case 'taos': return 'b𝄫𝄫';
		}
		return note;
	}

	function note2alphabet_tex( note ) {
		return utf2tex( note2alphabet( note ).toUpperCase() );
	}

	function utf2tex( note ) {
		note = note.replace( /𝄫/g, '\\flatflat ' );
		note = note.replace( /𝄪/g, '\\doublesharp ' );
		note = note.replace( /♯/g, '\\sharp ' );
		note = note.replace( /♭/g, '\\flat ' );
		return note;
	}

	function wrapSingleConvFunc( theSingleConvFunc ) {
		return function __wrapper( arr ) {
			var result = [];
			for ( var i=0; i<arr.length; i++ ) {
				result[i] = theSingleConvFunc( arr[i] );
			}
			return result;
		};
	}

	function wrapSingleConvFunc2( theSingleConvFunc ) {
		return function __wrapper( arr ) {
			var type = arr.shift();
			var result = [];
			for ( var i=0; i<arr.length; i++ ) {
				result[i] = theSingleConvFunc( arr[i], type );
			}
			return result;
		};
	}
	function wrapDoubleConvFunc( theDoubleConvFunc ) {
		return function __wrapper( arr ) {
			var result = [];
			while ( 0<arr.length ) {
				var root = arr.shift();
				var interval  = arr.shift();
				if ( root && interval )
					result.push( theDoubleConvFunc( root, interval ) );
			}
			return result;
		};
	}


	function commandInterfaceProc( __theFunc, argv ) {
		if ( argv[0] === '-' ) {
			var readline = require('readline');
			var rl = readline.createInterface({
			  input: process.stdin,
			  output: process.stdout,
			  terminal: false
			});

			rl.on( 'line', function( line ) {
				var arr = line.trim().split( / +/ );
				process.stdout.write( __theFunc( arr ).join( ' ' ) + '\n' );

			});
		} else {
			process.stdout.write( __theFunc( argv ).join( ' ' ) + '\n' );
		}
	}

	function normalizeArguments( args ) {
		var result = [];
		for ( var i=0; i<args.length; i++ ) {
			result = result.concat( args[i].trim().split(  / +/ ) );
		}
		return result;
	}

	function commandInterface( argv ) {
		// argv = normalizeArguments( argv );

		if ( argv.length == 0 ) {
			console.error( '=== Chromatic Solfege Command Line Interface ===' );
		} else {
			var type = argv.shift();
			switch ( type ) {
				case 'ch' :
					commandInterfaceProc( transposeScript, argv.join() ); 
					break;
				case 'abs' :
					commandInterfaceProc( wrapDoubleConvFunc( (root,interval)=>transpose(root,interval,true) ), normalizeArguments( argv ) ); 
					break;
				case 'rel' :
					commandInterfaceProc( wrapDoubleConvFunc( (root,interval)=>transpose(root,interval,false) ) , normalizeArguments( argv ) ); 
					break;
				case 'respell' :
					commandInterfaceProc( wrapSingleConvFunc( respell ), normalizeArguments( argv ) ); 
					break;
				case 'enharmonize' :
					commandInterfaceProc( wrapSingleConvFunc( enharmonize2 ), normalizeArguments( argv ) ); 
					break;
				case 'note2number' :
					commandInterfaceProc( wrapSingleConvFunc( note2number ), normalizeArguments( argv ) ); 
					break;
				case 'number2note' :
					commandInterfaceProc( wrapSingleConvFunc2( number2note ), normalizeArguments( argv ) ); 
					break;
				case 'note2alphabet' :
					commandInterfaceProc( wrapSingleConvFunc( note2alphabet ), normalizeArguments( argv ) ); 
					break;
				case 'note2alphabet_tex' :
					commandInterfaceProc( wrapSingleConvFunc( note2alphabet_tex ), normalizeArguments( argv ) ); 
					break;
				default : 
					console.error( "Unknown command " + type );
					break;
			}
		}
	}

	if ( ! __object ) {
		__object = {};
	}

	Object.defineProperties( __object, 
		{
			transpose              : { value : transpose },
			transposeScript        : { value : transposeScript },
			enharmonize            : { value : __enharmonize },
			enharmonize2           : { value : __enharmonize2 },

			isQuadrupleSharp       : { value : isQuadrupleSharp },
			isQuadrupleFlat        : { value : isQuadrupleFlat },
			isQuadrupleAccidental  : { value : isQuadrupleAccidental },

			isTripleSharp          : { value : isTripleSharp },
			isTripleFlat           : { value : isTripleFlat },
			isTripleAccidental     : { value : isTripleAccidental },

			isDoubleSharp          : { value : isDoubleSharp },
			isDoubleFlat           : { value : isDoubleFlat },
			isDoubleAccidental     : { value : isDoubleAccidental },

			isSharp                : { value : isSharp },
			isFlat                 : { value : isFlat },
			isNatural              : { value : isNatural },
			isNote                 : { value : isNote },
			isAccidental           : { value : isAccidental },
			isIrregularAccidental  : { value : isIrregularAccidental },
			putTripleAccidentals   : { value : putTripleAccidentals },

			respell                : { value : respell },
			note2number            : { value : note2number },
			number2note            : { value : number2note },
			note2alphabet          : { value : note2alphabet },
			note2alphabet_tex      : { value : note2alphabet_tex },
			commandInterface       : { value : commandInterface },
			dumpTable              : { value : __dumpTable },
		}
	);


	return __object;
}

chromatic( {}, chromatic );
// console.error( chromatic.transpose );

if ( module && module.exports ) {
	module.exports = chromatic;
}

if ( require && module && require.main === module )  {
	commandInterface( Array.prototype.slice.call( process.argv, 2) );
}

// vim: filetype=javascript :
