
Chromatic-Solfege for JavaScript
==================================

## Overview
A Node modue `chromatic-solfege` is a library to operate the notes and the intervals
which are defined in Chromatic-Solfege. In this module, it defines all notes of
Chromatic-Solfege and offers functions to transpose specified note names.

## Usage

```javascript
	var chromatic = require( 'chromatic-solfege' );
	var r = chromatic.transpose( "re", "mi" )
	console.log( r ); // "fi"
```

## Methods
- [transpose](#transpose)
- [transposeScript](#transposescript)
- [enharmonize](#enharmonize)
- [enharmonize2](#enharmonize2)
- [isQuadrupleSharp](#isquadruplesharp)
- [isQuadrupleFlat](#isquadrupleflat)
- [isQuadrupleAccidental](#isquadrupleaccidental)
- [isTripleSharp](#istriplesharp)
- [isTripleFlat](#istripleflat)
- [isTripleAccidental](#istripleaccidental)
- [isDoubleSharp](#isdoublesharp)
- [isDoubleFlat](#isdoubleflat)
- [isDoubleAccidental](#isdoubleaccidental)
- [isSharp](#issharp)
- [isFlat](#isflat)
- [isNatural](#isnatural)
- [isNote](#isnote)
- [isAccidental](#isaccidental)
- [isIrregularAccidental](#isirregularaccidental)
- [putTripleAccidentals](#puttripleaccidentals)
- [respell](#respell)
- [note2number](#note2number)
- [number2note](#number2note)
- [note2alphabet](#note2alphabet)
- [note2alphabet_tex](#note2alphabet_tex)
- [commandInterface](#commandinterface)

### transpose

`transpose( root : string, intervals: string, is_absolute : boolean ) : string`

This function transposes a single note.

- root
	Specifies the root note.

- intervals
	Specifies the interval from the root note.

- is_absolute
TODO

- returns 
	transposed note name as a string value.

```javascript
	console.log( chromatic.transpose( "do", "do" ) ); // "do"
	console.log( chromatic.transpose( "do", "re" ) ); // "re"
	console.log( chromatic.transpose( "do", "mi" ) ); // "mi"
	console.log( chromatic.transpose( "fa", "do" ) ); // "fa"
	console.log( chromatic.transpose( "fa", "re" ) ); // "sol"
	console.log( chromatic.transpose( "fa", "mi" ) ); // "la"
```

### transposeScript

`transposeScript( macro : string, preference : Object )`

This function transposes multiple notes at once. This function accepts an 
argument as a simple macro language which is called Chromatic-Solfege Abstraction 
Layer Language. See [Chromatic-Solfege Abstraction Layer Language](#chromaticsolfegeabstractionlayerlanguage) 
for further information.

- macro
	Takes a simple macro program.

- preference
	Takes an object to override the current preference. This module takes
	multilevel preference object system. See below.

- returns
	an array that contains transposed note names.

### enharmonize

This function returns an enharmonized note name of the given note.

- note
	A note name to enharmonize or an array contains note names to enharmonize.


```javascript
console.log( c.enharmonize( "raw" ) ); // "do"
console.log( c.enharmonize( "de"  ) ); // "ti"
```


### enharmonize2

This function returns an enharmonic note name of the given note. The note will
be selected by an internally defined priority. This function is left for
backward compatibility and new applications should not use this function.

- note name
	A note name to convert.

- type
	Specifies the algorithm of convertion. 
	This should be one of following strings: 'ds', 's', 'n', 'f', 'df'.


### isQuadrupleSharp( note )
Returns true if the specified value is a quadruple sharp.

### isQuadrupleFlat( note )
Returns true if the specified value is a quadruple flat.

### isQuadrupleAccidental( note )
Returns true if the specified value is with a quadruple accidental.

### isTripleSharp( note )
Returns true if the specified value is with a triple sharp.

### isTripleFlat( note )
Returns true if the specified value is with a triple flat.

### isTripleAccidental( note )
Returns true if the specified value is with a triple accidental.


### isDoubleSharp( note )
Returns true if the specified value is with a double sharp.

### isDoubleFlat( note )
Returns true if the specified value is with a double flat.

### isDoubleAccidental( note )
Returns true if the specified value is with a double accidental.

### isSharp( note )
Returns true if the specified value is with a sharp.

### isFlat( note )
Returns true if the specified value is with a flat.

### isAccidental( note )
Returns true if the specified value is with an accidental.

### isNatural( note )
Returns true if the specified value is natural and without any accidentals.

### isNote( note )
Returns true if the specified value is a note name.

### isIrregularAccidental( note )
Returns true if the specified value is one of 'de', 'ta' , 'ma', 'fe'.

### putTripleAccidentals
This is a lilypond helper function. This function puts a triple accidental tag
before the note name if the specified is with a triple accidental.

### respell
This function converts note names with flat into sharp and vice a versa.

### note2number
Returns an integer value which denotes a specific note. We call the integer
numbers as note index. The note indices start from zero. And the number will
increase one with every half note.

```javascript
console.log( c.note2number( "do" ) ); // 0
console.log( c.note2number( "re" ) ); // 2
console.log( c.note2number( "do'" ) ); // 12
console.log( c.note2number( "do," ) ); // -12
```


### number2note
Returns a note name of the specified note index.

```javascript
console.log( c.number2note( 12 ) );  // do'
console.log( c.number2note( -12 ) ); // do,
```

### note2alphabet
Returns an alphabetical note name of the specified note name as unicode string.

```javascript
console.log( c.note2alphabet( 'rai' ) ); // d𝄫
console.log( c.note2alphabet( 'di' ) );  // c♯
```

### note2alphabet_tex
Returns an alphabetical note name of the specified note name as tex command
string.

```javascript
console.log( c.note2alphabet_tex( 'rai' ) ); // "d \flatflat"
console.log( c.note2alphabet_tex( 'di' ) );  // "c \sharp"
```


### commandInterface
This function implements a simple commandline interface.

```javascript
commandInterface( Array.prototype.slice.call( process.argv, 2) );
```

## _Chromall_ Chromatic-Solfege Abstraction Layer Language

As mentioned above, the function `transposeScript()` function accepts an 
argument as a simple macro language which is called _Chromall_. Chromall stands 
for Chromatic-Solfege Abstraction Layer Language. 

The main purpose of this small language is dynamically transposing series of 
note names. This language also accepts some modifiers which can be specified by 
tags. 

Note that the format of its output data is designed to be sent to lilypond 
afterwards in mind.

### Basic of Chromall

Notes should separated by one or more spaces.

```javascript
console.log( c.transposeScript( "do re  mi" ) ); // "do re mi"
```

Notes should separated by one or more spaces.

```javascript
console.log( c.transposeScript( "do re mi" ) ); // "do re mi"
```


### Chromatic-Solfege Note Name Identifier Specification

The available note name specifiers are following :

| Origin           |    do    |    re    |    mi    |    fa    |    sol   |    la    |    ti    |
|------------------|----------|----------|----------|----------|----------|----------|----------|
| Quadruple Flats  |  `daes`  |  `raes`  |  `maes`  |  `faes`  |  `saes`  |  `laes`  |  `taes`  |
| Triple Flats     |  `dae`   |  `rae`   |  `mae`   |  `fae`   |  `sae`   |  `lae`   |  `tae`   |
| Double Flats     |  `daw`   |  `raw`   |  `maw`   |  `faw`   |  `saw`   |  `law`   |  `taw`   |
| Flats            |  `de`    |  `ra`    |  `me`    |  `fe`    |  `se`    |  `le`    |  `te`    |
| Natural          |  `do`    |  `re`    |  `mi`    |  `fa`    |  `sol`   |  `la`    |  `ti`    |
| Sharps           |  `di`    |  `ri`    |  `ma`    |  `fi`    |  `si`    |  `li`    |  `ta`    |
| Double Sharps    |  `dai`   |  `rai`   |  `mai`   |  `fai`   |  `sai`   |  `lai`   |  `tai`   |
| Triple Sharps    |  `dao`   |  `rao`   |  `mao`   |  `fao`   |  `sao`   |  `lao`   |  `tao`   |
| Quadruple Sharps |  `daos`  |  `raos`  |  `maos`  |  `faos`  |  `saos`  |  `laos`  |  `taos`  |


In this library, quater sharps and quater flats are also defined. The following 
table is a complete identifier table which includes quater notes.

| Origin           |    do    |    re    |    mi    |    fa    |    sol   |    la    |    ti    |
|------------------|----------|----------|----------|----------|----------|----------|----------|
| Quadruple Flats  |  `daes`  |  `raes`  |  `maes`  |  `faes`  |  `saes`  |  `laes`  |  `taes`  |
| 7 Quarter Flats  |  `dawm`  |  `rawm`  |  `mawm`  |  `fawm`  |  `sawm`  |  `lawm`  |  `tawm`  |
| Triple Flats     |  `dae`   |  `rae`   |  `mae`   |  `fae`   |  `sae`   |  `lae`   |  `tae`   |
| 5 Quarter Flats  |  `dawn`  |  `rawn`  |  `mawn`  |  `fawn`  |  `sawn`  |  `lawn`  |  `tawn`  |
| Double Flats     |  `daw`   |  `raw`   |  `maw`   |  `faw`   |  `saw`   |  `law`   |  `taw`   |
| 3 Quarter Flats  |  `dem`   |  `ram`   |  `mem`   |  `fem`   |  `sem`   |  `lem`   |  `tem`   |
| Flats            |  `de`    |  `ra`    |  `me`    |  `fe`    |  `se`    |  `le`    |  `te`    |
| 1 Quarter Flats  |  `dew`   |  `rew`   |  `mew`   |  `few`   |  `sew`   |  `lew`   |  `tew`   |
| Natural          |  `do`    |  `re`    |  `mi`    |  `fa`    |  `sol`   |  `la`    |  `ti`    |
| 1 Quarter Sharps |  `dia`   |  `ria`   |  `mia`   |  `fia`   |  `sia`   |  `lia`   |  `tia`   |
| Sharps           |  `di`    |  `ri`    |  `ma`    |  `fi`    |  `si`    |  `li`    |  `ta`    |
| 3 Quarter Sharps |  `dim`   |  `rim`   |  `mam`   |  `fim`   |  `sim`   |  `lim`   |  `tam`   |
| Double Sharps    |  `dai`   |  `rai`   |  `mai`   |  `fai`   |  `sai`   |  `lai`   |  `tai`   |
| 5 Quarter Sharps |  `dain`  |  `rain`  |  `main`  |  `fain`  |  `sain`  |  `lain`  |  `tain`  |
| Triple Sharps    |  `dao`   |  `rao`   |  `mao`   |  `fao`   |  `sao`   |  `lao`   |  `tao`   |
| 7 Quarter Sharps |  `daim`  |  `raim`  |  `maim`  |  `faim`  |  `saim`  |  `laim`  |  `taim`  |
| Quadruple Sharps |  `daos`  |  `raos`  |  `maos`  |  `faos`  |  `saos`  |  `laos`  |  `taos`  |



### Bar lines






## Multilevel Preference Object
TODO


