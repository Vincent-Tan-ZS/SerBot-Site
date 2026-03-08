## v2.7.3.2
- Fixed Recipe page overflowing in mobile
- Fixed Recipe page not filtering in mobile

## v2.7.3.1
- Reworked What's New section in homepage

## v2.7.3
- Reworked Copy Command modal

## v2.7.2.1
- Reduced debounce time
- Search bar in Commands page now full width

## v2.7.2
- Added debounce to search input

## v2.7.1
- Revamped Mobile Commands page

## v2.7
- Revamped Commands page

## v2.6.4.4
- Fixed useCallback dependenceis 
- Fixed missing key prop

## v2.6.4.3
- Pressing 'Enter' on Ingredients/Steps text field should now save and move to the next item 
- Fixed various issues with deleting items

## v2.6.4.2
- Added Mobile view (Only read)
- Fixed Recipe List Items not checking/unchecking when clicked in empty space

## v2.6.4.1
- Removed unused npm package

## v2.6.4
- Allow updating of recipes
- Allow viewing of recipes
- Added chip to ingredients and steps to display how many there are
- Added frontend validation when saving recipe
- Fixed issue where adding recipes cannot be done
- Fixed issue where cancelling ingredients/steps will still show the new user input
- Fixed issue where deleting ingredients/steps will delete the wrong one
- Fixed issue where long text for ingredients/steps would overflow

## v2.6.3.4
- Allow deletion of recipes

## v2.6.3.3
- ModalContext now only sends in 2 methods to Open and Close Modals while still providing control over modal details

## v2.6.3.2
- Moved paginations into a usePagination hook
- Changed loading
- Added Table and pagination to recipe page (WIP)

## v2.6.3.1
- Fix search input border color inconsistency

## v2.6.3
- Filter recipe list by name or ingredients
- Changed search field design
- Added border to main container

## v2.6.2
- CSS backgrounds to make pages look less bland

## v2.6.1
- Removed 'axios' package, replaced with Fetch API
- Added a few more Util methods to simplify API calls
- Removed dev mode flow for local builds

## v2.6
- Added page to view and add recipes

## v2.5.2
- Fix issue with countdown descriptions going too far
- Made countdown cards for desktop a bit clearer

## v2.5.1
- Updated mobile navigation bar

## v2.5
- Added SerBot Icon to site
- Added custom Loading images

## v2.4.8
- Added Apple Music Playlist Import

## v2.4.7
- Fix crash with private playlists

## v2.4.6
- Cleanup files
- Added feature to import playlist from Spotify or Youtube

## v2.4.5
- Added cancel for update song
- Disable Delete All if no songs

## v2.4.4
- Added Delete All button for Song List
- Added Edit button for Song List
- Hitting 'Enter' while typing for Song List will add/update accordingly
- Fix issue where empty songs can be added
- Show Loading when list is not yet loaded

## v2.4.3
- Fix song list not showing username
- Fix Error when new user adds a song

## v2.4.2
- Refactor url check

## v2.4.1
- Show ID of song

## v2.4
- Added Song List page

## v2.3
- Added Sort by Release Date in Countdowns

## v2.2.1 
- Updated favicon

## v2.2
- Added favicon (ugly af though)
- Added title to pages

## v2.1.1
- Fix build issue

## v2.1
- Updated Countdowns page for mobile (and some animation)
- Updated homepage to show what's new with the bot and the site!

## v2.0
- Added Countdowns List page

## v1.1
- Disable Revalidation

## v1.0
- Added Commands List page