Family Tree Generator
=====================

This version of the Family Tree Generator is by M. C. DeMarco.  In addition to generating reproducible random medieval family trees of descendants of a matriarch/patriarch pair (incrementally), it also supports the generation of non-human and otherwise non-medieval family trees, editing of any aspect of a generated tree, display of the output as an actual tree in addition to an indented list or a CSV file, generation of full trees up to a specified date, various improved methods of name generation, a name list viewer, optional clan generation, and the display of detailed instructions for use.

This is an entirely client-side JavaScript program; it will run in a web browser without a web server.  However, jQuery and the fonts are loaded from Google, so an internet connection is required.  A demo version is available at http://mcdemarco.net/tools/family-tree-generator/



making changes
--------------

To make your own changes to the family tree generator, you will need a copy of the code.  Click on [releases](https://github.com/mcdemarco/family-tree-generator/releases) and download the latest one.  Unzip it if necessary and open lineage.html in your web browser.  (Please note that no crappy or old browsers have been tested.)

If you do not know JavaScript, it should still be fairly simple to edit the names list or the demographic variables in one of the human/fantasy race files in the js/ directory to make your desired changes.  Please note that some name lists are just a basis for the random name generator, while others are used directly.  (See the sausage section below for details.)

If you do know JavaScript, I would recommend making a new race along the lines of an existing one such as dwarf.js (but not homo.js).  You will need to load the file in lineage.html (with charset="utf-8" if your names use any non-ascii characters); if it is formatted correctly, it will be added to the human type/fantasy race list automatically.


credits
-------

Based on Random Family Tree Generator v.1.3  by Todd Stumpf:
http://code.google.com/p/random-family-tree-generator/
which in turn was based on an older version of Random Family Tree Generator
by Jeff Partridge, updated since to v2.0: http://partridgez.com/japartridge/lineage2.html

Tree style adapted from http://thecodeplayer.com/walkthrough/css3-family-tree, 
http://thecodeplayer.com/experiments/css3-family-tree-multiple-parents.html.

Name generation by markov chain adapted from: http://donjon.bin.sh/site/code/name/

Name lists from Kate Monk's Onomastikon:  http://tekeli.li/onomastikon/



licensing
---------

The original version of the Family Tree Generator was under a Creative Commons Attribution-Noncommercial-Share Alike-3.0 United States License.
The google code version (on which this code was based) mentions the CC license as the "content license" and the GNU GPL v3 as the "code license."

The name generation markov chain code I used was in the public domain.
No licensing information was available for the tree style; I will inquire.

No additional license restrictions are added in this version, except for copyright on the various name lists and naming languages.

Myers-Briggs Type Indicator, Myers-Briggs, and MBTI are trademarks or registered trademarks of the MBTI® Trust, Inc., in the United States and other countries.





sausage
-------

I made quite a few changes to the underlying code.  Most significantly, I stored the family tree in a data structure rather than in the html, which greatly simplified several chunks of code.

I threw out the existing name generation and added three methods of my own:  random selection from a name list (Modern names, Scottish names and clan names), generation by markov chain from a name list (Medieval names, Egyptian names, and dwarf names), and generation from a syllable list (dwerrow names).

I also abstracted more of the demographic statistics into variables or functions, which allowed me to change demographics when changing human type/fantasy race.  I removed the debugging code and simplified the UI code.

I added editing of the tree and automatic generation of descendants up to a certain date, as well as some complicated naming code (in dwerrow.js), for my own needs in writing fiction.

