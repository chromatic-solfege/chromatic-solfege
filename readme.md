
Chromatic-Solfege for JavaScript
==================================

# Overview
A Node modue `chromatic-solfege` is a library to operate the notes and the intervals
which are defined in Chromatic-Solfege. In this module, it defines all notes of
Chromatic-Solfege and offers functions to transpose specified note names.

# Usage

```javascript
var chromatic = require( 'chromatic-solfege' );
var r = chromatic.transpose( "re", "mi" )
console.log( r ); // "fi"
```

If you want to try following example, you could do it in your terminal  as 
following:

```bash
> nodejs -e 'console.log( require("chromatic-solfege").transposeScript( "\\enh @do raw maw faw" ) )' 
```

# Methods
## Converters
__transpose( root : string, intervals: string, is_absolute : boolean ) : string__

This function transposes a single note.

- `root`
	Specifies the root note.
- `intervals`
	Specifies the interval from the root note.
- `is_absolute`
    TODO
- `returns`
	transposed note name as a string value.

```javascript
console.log( chromatic.transpose( "do", "do" ) ); // "do"
console.log( chromatic.transpose( "do", "re" ) ); // "re"
console.log( chromatic.transpose( "do", "mi" ) ); // "mi"
console.log( chromatic.transpose( "fa", "do" ) ); // "fa"
console.log( chromatic.transpose( "fa", "re" ) ); // "sol"
console.log( chromatic.transpose( "fa", "mi" ) ); // "la"
```

__transposeScript( macro : string, preference : Object )__

This function transposes multiple notes at once. This function accepts an 
argument as a simple macro language which is called Chromatic-Solfege Abstraction 
Layer Language. See [Chromatic-Solfege Abstraction Layer Language](#chromatic-solfege-abstraction-layer-language) 
for further information.

- `macro`
	Takes a simple macro program.
- `preference`
	Takes an object to override the current preference. This module takes
	multilevel preference object system. See below.
- `returns`
	an array that contains transposed note names.

__enharmonize(note)__

This function returns an enharmonized note name of the given note.

- note
	A note name to enharmonize or an array contains note names to enharmonize.


```javascript
console.log( c.enharmonize( "raw" ) ); // "do"
console.log( c.enharmonize( "de"  ) ); // "ti"
```

__enharmonize2__

This function returns an enharmonic note name of the given note. The note will
be selected by an internally defined priority. This function is left for
backward compatibility and new applications should not use this function.

- note name
	A note name to convert.
- type
	Specifies the algorithm of convertion. 
	This should be one of following strings: 'ds', 's', 'n', 'f', 'df'.


__putTripleAccidentals__

This is a lilypond helper function. This function puts a triple accidental tag
before the note name if the specified is with a triple accidental.


__respell__

This function converts note names with flat into sharp and vice a versa.


__note2number__

Returns an integer value which denotes a specific note. We call the integer
numbers as note index. The note indices start from zero. And the number will
increase one with every half note.


```javascript
console.log( c.note2number( "do" ) ); // 0
console.log( c.note2number( "re" ) ); // 2
console.log( c.note2number( "do'" ) ); // 12
console.log( c.note2number( "do," ) ); // -12
```

__number2note__

Returns a note name of the specified note index.


```javascript
console.log( c.number2note( 12 ) );  // do'
console.log( c.number2note( -12 ) ); // do,
```

__note2alphabet__

Returns an alphabetical note name of the specified note name as unicode string.

```javascript
console.log( c.note2alphabet( 'rai' ) ); // d𝄫
console.log( c.note2alphabet( 'di' ) );  // c♯
```

__note2alphabet_tex__

Returns an alphabetical note name of the specified note name as tex command
string.

```javascript
console.log( c.note2alphabet_tex( 'rai' ) ); // "d \flatflat"
console.log( c.note2alphabet_tex( 'di' ) );  // "c \sharp"
```

### Predicates
__isQuadrupleSharp__
Returns true if the specified value is a quadruple sharp.

__isQuadrupleFlat__
Returns true if the specified value is a quadruple flat.

__isQuadrupleAccidental__
Returns true if the specified value is with a quadruple accidental.

__isTripleSharp__
Returns true if the specified value is with a triple sharp.

__isTripleFlat__
Returns true if the specified value is with a triple flat.

__isTripleAccidental__
Returns true if the specified value is with a triple accidental.

__isDoubleSharp__
Returns true if the specified value is with a double sharp.

__isDoubleFlat__
Returns true if the specified value is with a double flat.

__isDoubleAccidental__
Returns true if the specified value is with a double accidental.

__isSharp__
Returns true if the specified value is with a sharp.

__isFlat__
Returns true if the specified value is with a flat.

__isAccidental__
Returns true if the specified value is with an accidental.

__isNatural__
Returns true if the specified value is natural and without any accidentals.

__isNote__
Returns true if the specified value is a note name.

__isIrregularAccidental__
Returns true if the specified value is one of 'de', 'ta' , 'ma', 'fe'.

## Command Interface

### commandInterface
This function implements a simple commandline interface.

```javascript
commandInterface( Array.prototype.slice.call( process.argv, 2) );
```

# Csall - Chromatic-Solfege Abstraction Layer Language
## Syntax

As mentioned above, the function `transposeScript()` function accepts an 
argument as a simple macro language which is called _Csall_. Csall stands 
for Chromatic-Solfege Abstraction Layer Language. 

The main purpose of this small language is dynamically transposing series of 
note names. This language also accepts some modifiers which can be specified by 
tags. 

Note that the format of its output data is designed to be sent to lilypond 
afterwards in mind.

## Basic 

- A sequence of note specifiers are separated by one or more space characters.  
- The first note specifier is treated as a key specifier.  

```javascript
console.log( c.transposeScript( "do do re mi" ) );  // "do re mi"
```

```javascript
console.log( c.transposeScript( "re do re mi" ) );  // "re mi fi"
```

```javascript
console.log( c.transposeScript( "fa do re mi" ) );  // "fa sol la"
```

- A macro string can contain two or more sequences of note specifiers. In that 
  case, each sequence should be preceded by an at-mark '@'.

```javascript
console.log( c.transposeScript( "@do do re mi" ) );  // "do re mi"
```

```javascript
console.log( c.transposeScript( "@do do re mi @re do re mi" ) );  // "do re mi re mi fi"
```

## Octave Specifiers
`'` and `,` are octave specifiers. It is transparently passed to the output. It 
should come right after the note name.

```javascript
console.log( c.transposeScript( "@do do, re, mi," ) );  // "do, re, mi' 
```

## Note Value Specifiers
Any of `0 1 2 3 4 5 6 7 8 9 0` are note value specifiers. It is transparently 
passed to the output. It should come after the note name. In case there are any 
octave specifier after the note name, the note value specifiers should come 
after the octave specifier.

## Mode Specifiers
You can put any number of mode specifiers before the all note sequence.

- `\har`
- `\enh`
- `\rel` 
- `\abs`

__\\enh__
When `\enh` is specified, every note in the output is converted to the 
enharmonically equivalent note.

_Currently this directive is not working correctly. This will be fixed in near 
future. Every application should not use this directive until it is properly fixed._

```javascript
console.log( c.transposeScript( "\\enh @do raw maw faw" ) );  // " do re me"
```

__\\har__
This is default 

```javascript
console.log( c.transposeScript( "\\har @do raw maw faw" ) );  // "raw maw faw"
```

```javascript
// This returns same " raw maw faw" since \\har is default.
console.log( c.transposeScript( "@do raw maw faw" ) );  
```

__\\rel__
It output notes with relative octave specifier.  \\rel is default.  **TODO**
 
```javascript
console.log( c.transposeScript( "\\rel @do, do, re, mi,) );  // "do, re, mi,"
```

_Currently this directive is under the beta state and not working correctly. 
This will be fixed in near future. Every application should not use this 
directive until it is properly fixed._

__\\abs__
It output notes with absolute octave specifier. **TODO**

```javascript
console.log( c.transposeScript( "\\abs @do, do, re, mi,) );  // "do,, re,, mi,,"
```

_Currently this directive is under the beta state and not working correctly. 
This will be fixed in near future. Every application should not use this 
directive until it is properly fixed._


## Special Note Specifiers
### The Rest Note Specifier

`s` is used as a rest note. In this module, it is treated as a special note.

```javascript
console.log( c.transposeScript( "@do do4 re8 mi8 s4" ) );  // "do4 re8 mi8 s4"
```

### Transparent Note Specifiers
- A note specifier which starts with either `#` `\\` is ignored and 
  transparently sent to the output.

```javascript
console.log( c.transposeScript( "@do do re mi #FOO @re do re #BAR mi" ) );  // "do re mi #FOO re mi #BAR fi"
```

- A note specifier which is surrounded with '"' (double-quotation) is ignored 
  and transparently sent to the output.

```javascript
console.log( c.transposeScript( 'do do re mi "hello!" sol la' ) ); // 'do re mi "hello!" sol la'
```

These characters are ignored and transparently sent to the output.

- Any of these string literals `!  = .  ..  = [ ] < > s { } |` as a note 
  specifier is ignored and transparently sent to the output.
 
```javascript
console.log( c.transposeScript( 'do do [ re mi ] { sol la }' ) ); // 'do [ re mi ] { sol la }'
```

These characters are used to pass command sequences to Lilypond after the processing.


# Chromatic-Solfege Note Name Identifier Specification
The available note name specifiers are following :

| Origin           |    do    |    re    |    mi    |    fa    |    sol   |    la    |    ti    |
|------------------|----------|----------|----------|----------|----------|----------|----------|
| Quadruple-Flat   |  `daes`  |  `raes`  |  `maes`  |  `faes`  |  `saes`  |  `laes`  |  `taes`  |
| Triple-Flat      |  `dae`   |  `rae`   |  `mae`   |  `fae`   |  `sae`   |  `lae`   |  `tae`   |
| Double-Flat      |  `daw`   |  `raw`   |  `maw`   |  `faw`   |  `saw`   |  `law`   |  `taw`   |
| Flat             |  `de`    |  `ra`    |  `me`    |  `fe`    |  `se`    |  `le`    |  `te`    |
| Natural          |  `do`    |  `re`    |  `mi`    |  `fa`    |  `sol`   |  `la`    |  `ti`    |
| Sharp            |  `di`    |  `ri`    |  `ma`    |  `fi`    |  `si`    |  `li`    |  `ta`    |
| Double-Sharp     |  `dai`   |  `rai`   |  `mai`   |  `fai`   |  `sai`   |  `lai`   |  `tai`   |
| Triple-Sharp     |  `dao`   |  `rao`   |  `mao`   |  `fao`   |  `sao`   |  `lao`   |  `tao`   |
| Quadruple-Sharp  |  `daos`  |  `raos`  |  `maos`  |  `faos`  |  `saos`  |  `laos`  |  `taos`  |


In this library, quater sharps and quater flats are also defined. The following 
table is a complete identifier table which includes quater notes.

| Origin           |    do    |    re    |    mi    |    fa    |    sol   |    la    |    ti    |
|------------------|----------|----------|----------|----------|----------|----------|----------|
| Quadruple-Flat   |  `daes`  |  `raes`  |  `maes`  |  `faes`  |  `saes`  |  `laes`  |  `taes`  |
| 7 Quarter-Flat   |  `dawm`  |  `rawm`  |  `mawm`  |  `fawm`  |  `sawm`  |  `lawm`  |  `tawm`  |
| Triple-Flat      |  `dae`   |  `rae`   |  `mae`   |  `fae`   |  `sae`   |  `lae`   |  `tae`   |
| 5 Quarter-Flat   |  `dawn`  |  `rawn`  |  `mawn`  |  `fawn`  |  `sawn`  |  `lawn`  |  `tawn`  |
| Double-Flat      |  `daw`   |  `raw`   |  `maw`   |  `faw`   |  `saw`   |  `law`   |  `taw`   |
| 3 Quarter-Flat   |  `dem`   |  `ram`   |  `mem`   |  `fem`   |  `sem`   |  `lem`   |  `tem`   |
| Flat             |  `de`    |  `ra`    |  `me`    |  `fe`    |  `se`    |  `le`    |  `te`    |
| 1 Quarter-Flat   |  `dew`   |  `rew`   |  `mew`   |  `few`   |  `sew`   |  `lew`   |  `tew`   |
| Natural          |  `do`    |  `re`    |  `mi`    |  `fa`    |  `sol`   |  `la`    |  `ti`    |
| 1 Quarter-Sharp  |  `dia`   |  `ria`   |  `mia`   |  `fia`   |  `sia`   |  `lia`   |  `tia`   |
| Sharp            |  `di`    |  `ri`    |  `ma`    |  `fi`    |  `si`    |  `li`    |  `ta`    |
| 3 Quarter-Sharp  |  `dim`   |  `rim`   |  `mam`   |  `fim`   |  `sim`   |  `lim`   |  `tam`   |
| Double-Sharp     |  `dai`   |  `rai`   |  `mai`   |  `fai`   |  `sai`   |  `lai`   |  `tai`   |
| 5 Quarter-Sharp  |  `dain`  |  `rain`  |  `main`  |  `fain`  |  `sain`  |  `lain`  |  `tain`  |
| Triple-Sharp     |  `dao`   |  `rao`   |  `mao`   |  `fao`   |  `sao`   |  `lao`   |  `tao`   |
| 7 Quarter-Sharp  |  `daim`  |  `raim`  |  `maim`  |  `faim`  |  `saim`  |  `laim`  |  `taim`  |
| Quadruple-Sharp  |  `daos`  |  `raos`  |  `maos`  |  `faos`  |  `saos`  |  `laos`  |  `taos`  |


<style>
</style>

