\version "2.18.2"
\include "lilypond-book-preamble.ly"
\include "guitar-scale-diagram.ly"
\include "aaron.ly"

\layout {
    \context {
        \Score
        \override TextSpanner.style = #'line
        \override TextSpanner.thickness = #5
        \override TextSpanner.bound-details.right.padding = #-1
        \override TextSpanner.bound-details.left.padding = #0
        \override TextSpanner.color = #red
      }
}

textSpanColorA = {
  \once \override TextSpanner.style = #'line
  \once \override TextSpanner.thickness = #5
  \once \override TextSpanner.bound-details.right.padding = #-1
  \once \override TextSpanner.bound-details.left.padding = #0
  \once \override TextSpanner.color = #red
}
textSpanColorB = {
  \once \override TextSpanner.style = #'zigzag
  \once \override TextSpanner.thickness = #4
  \once \override TextSpanner.bound-details.right.padding = #-1
  \once \override TextSpanner.bound-details.left.padding = #0
  \once \override TextSpanner.color = #red
}
uin = \startTextSpan
uout = \stopTextSpan

\layout {
      indent = #0
      ragged-right = ##f
      \context {
        \Score
        \override SpacingSpanner.base-shortest-duration = #(ly:make-moment 1/2)
      }
}
\paper  {
    #(set! paper-alist (cons '("a4inside" . (cons (* 8 in) (* 3 in))) paper-alist))
    #(set-paper-size "a4inside")
    #(define fonts
     (make-pango-font-tree "Times New Roman"
                           "Nimbus Sans"
                           "Luxi Mono"
                           (/ staff-height pt 20)))
}

% >>> Added (Fri, 30 Mar 2018 15:29:33 +0900)
  #(use-modules (ice-9 popen))
  #(use-modules (ice-9 readline))
  #(use-modules (ice-9 rdelim))
  #(use-modules (ice-9 regex))
  #(define (ch:transpose str )
      (let* (
               (port (open-input-pipe
                        (string-append
                                       "solfege "
                                       "\""
                                       str
                                       "\""
                        )
                     )
               )
               (str  (read-line port))
            )
          (close-pipe port)
          str
      ))
% <<< Added (Fri, 30 Mar 2018 15:29:33 +0900)

%#(warn (regexp-substitute/global #f "\\|" "abcde|abcde" 'pre "\\\\|" 'post ))
%#(warn (ch:transpose "se do re mi | do re mi | < do mi sol >" ))
%asc=#(ch:transpose "se do re mi \\| do ti la" )
%#(warn asc)

makescore = #(define-scheme-function (parser location notes) ( ly:music? )
   (define source-filename (car (ly:input-both-locations location) ) )
   (write 'makescore )
   (write " " )
   (write source-filename )
   (newline)
  #{
    \score {
      <<
        \music-to-festival #notes #(string-append source-filename ".xml" ) #180 #"voice_us1_mbrola"
        \new Staff \relative do' {
          \clef "G"
          %\time 16/4
          \omit Score.TimeSignature
          \omit Score.BarNumber
          % \omit Score.BarLine
          \stemUp
          \new Voice = "myRhythm" {
              \accidentalStyle neo-modern
              %\override Beam.breakable = ##t
              %\set Timing.beatStructure  = #'( 1 1 1 1 1 1 1 1 1 1 1 1 1 1  )
              %\hide Stem
              \textSpannerDown
              \cadenzaOn
              #notes
          }
        }
        \new Lyrics {
          \lyricsto "myRhythm" {
            \override Lyrics.LyricText.font-shape = #'italic
            \override Lyrics.LyricText.font-series = #'bold
            \music-to-aaron #notes
          }
        }

      >>
      \midi { \tempo 4 = 180 }
      \layout {}
    }
  #}
)


% (Mon, 23 Apr 2018 21:30:23 +0900)
% function makescore-for-guitar
% Moved from "chromatic-solfage-for-guitar.ly" . This is implementation is not
% completed yet.
makescore-for-guitar =
#(define-scheme-function (parser location noteValues noteNames fingeringPattern ) (ly:music? ly:music? list?)
     (put-fretdiagram-on-music! noteValues
         (create-fretdiagram-definition
             (put-string-number-on-music! noteValues fingeringPattern)))
     #{ 
       
         \score {
             <<
                 \new Staff \relative do' {
                     \clef "G_8" 
                     %\time 16/4
                     \omit Score.TimeSignature
                     \omit Score.BarNumber
                     % \omit Score.BarLine
                     \stemUp
                     \new Voice = "myRhythm" {
                         \accidentalStyle neo-modern
                         %\override Beam.breakable = ##t
                         %\set Timing.beatStructure  = #'( 1 1 1 1 1 1 1 1 1 1 1 1 1 1  )
                         %\hide Stem
                         \textSpannerDown        
                         \cadenzaOn
                         #noteValues
                     }
                 }
                 \new Lyrics {
                     \lyricsto "myRhythm" {
                         \override Lyrics.LyricText.font-shape = #'italic
                         \override Lyrics.LyricText.font-series = #'bold
                         #noteNames
                     }
                 }
                 \new TabStaff {
                     #noteValues
                 }
             >>
         \layout {
             \context {
                 \Score {
                     \override TextScript.fret-diagram-details.finger-code = #'in-dot
                     \override TextScript.fret-diagram-details.dot-color   = #'white
                     \override TextScript.fret-diagram-details.number-type = #'arabic
                     \override TextScript.fret-diagram-details.orientation = #'landscape
                     \omit Voice.StringNumber
                     \set TabStaff.minimumFret = #6
                     \set TabStaff.restrainOpenStrings = ##t
                 }
             }
         }
             
         }
     #}
     )
