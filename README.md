# SerBotJS-Discord

## v.1.7.6.1
- Fix issue with 'chef meal random' command returning undefined for some values

## v.1.7.6
- Temporarily disabled all music commands
- Added 'chef' command

## v.1.7.5.4
- Fixed issue where bot wouldn't leave voice channel after the final song in queue is skipped

## v1.7.5.3
- Added new model to keep count of how many people misclick a specific vc

## v1.7.5.2
- Updated packages (alongside all necessary adjustments)
- Slight refactor of 'help' command logic
- Due to Youtube's API changes, Youtube will not be available to use for now. Soundcloud is used instead
- For Youtube links, the title will be retrieved and attempted to search via Soundcloud
- Added a utility method for returning a message when a feature is being fixed

## v1.7.5.1
- Fixed Dayjs Parsing

## v1.7.5
- Added 'cap' command

## v.1.7.4.3
- Updated Dockerfile so that only necessary files are moved
- Removed global const variables in Events.js
- Refactored modals so that it's a function that creates them rather than a pre-built modal
- Limit DiscordJS message cache to 50 and GuildMember cache to 10

## v1.7.4.2
- Removed unnecessary packages
- Removed 'wikihow' command
- Removed song workaround where it would end randomly (memory limit exceeded)

## v1.7.4.1
- Swapped Moment with DayJS (lowered overall memory usage)

## v1.7.4
- Fix issues with ffmpeg
- Fix issues with Commands

## v1.7.3
- Updated packages
- Updated Commands file

## v1.7.2
- Removed some unnecessary static variables/methods

## v1.7.1
- Made 'ser' prefix case-insensitive
- 'psycho' command uses server profile now instead of user profile

## v1.7
- Removed 'covid' command
- 'rhombus' command fixed so that it doesn't create a NaN Rhombus
- Allow SerBot to be used in multiple servers
- Added a 'report' command to inform me about any issues regarding the bot
- Added a 'feature' command to add new Feature Updates with the bot (Owner only)
- Changed 'Administrators Only' to 'Owner Only'

## v1.6.3
- Added 'auth' command
- Added 'plist' command

## v1.6.2
- Removed TierLists
- Fixed Countdown Ids in list
- Fixed crashes when updating Countdowns with long descriptions
- Removed leftover code for R6 command
- Fixed persistent data from modals

## v1.6.1
- Removed R6 command due to the API change for Ranked 2.0

## v1.6
- Implemented Id for Countdowns

## v1.5.4.4
- Fixed 'coin' command 

## v1.5.4.3
- Updated Reminder Command List

## v1.5.4.2
- Fixed 'Delete Reminder' deleting the wrong reminder

## v1.5.4.1
- Fixed recurring reminders being sent multiple times
- Added log for debugging 'Delete Reminder'

## v1.5.4
- Added 'Delete Reminder' for recurring reminders

## v1.5.3
- Fixed reminder not deleting single reminders
- Fixed skip not removing workaround

## v1.5.2
- Fix countdown issue

## v1.5.1
- Fix reminder

## v1.5
- Added remind command

## v1.4.9
- Fix Modal Title too long
- Fix Workaround not reset after skipping

## v1.4.8
- Temporary workaround to '1 minute voice reconnect' bug

## v1.4.7
- Added Debug Logs
- Fixed song replaying after it finishes normally

## v1.4.6
- Fixed Tic-Tac-Toe crashing
- Added 'update' subcommand for 'countdown'

## v1.4.5
- Possible fix for workaround song spamming

## v1.4.4
- Remove spam when song is on loop

## v1.4.3
- Deadass forgot to change some variable names

## v1.4.2
- Workaround for song not playing when hosted

## v1.4.1
- Fixed 'replay' command not detecting previous song
- Fixed queue taking in every song in a YT playlist

## v1.4
- Fixed 'sex' command message not showing
- Fixed 'tree' command' not working during Summer
- Added 'replay' command

## v1.3.5
- 'sex' command is now inclusive of 1
- Added 'track' command

## v.1.3.4
- As requested, added a 'sex' commmand

## v1.3.3
- Refactored 'Wisdom Llama' reduce logic

## v1.3.2
-  Fix 'Wisdom Llama' text split

## v1.3.1
- Improved 'Wisdom Llama' text split

## v1.3
- Added 'Wisdom Llama' command

## v1.2.1
- Fix DiscordJS Modal

## v1.2
- Updated and cleaned up node packages
- Refactor code to deal with updated packages
- Updated gitignore

## v1.1.4
- Fixed undefined response

## v1.1.3
- Added more things to console log
- Fixed disconnect command?

## v1.1.2
- Migrate from Heroku

## v1.1.1
- Update 'help' command

## v1.1.0
- Save Command List into DB
- Removed Local Music

## v1.0.9.3
- Refactoring for optimization (WIP)

## v1.0.9.2
- Cannot view countdowns with one word names - FIXED
- Create Countdown crashes after save - FIXED

## v1.0.9.1
- Logs not showing UTC offset - FIXED

## v1.0.9
- Wheel continuing with only one option - FIXED
- Set reminder for Heroku Free not being available
- Logging

## v1.0.8.2
- Queue finish timeout - FIXED
- Force "DD/MM/YYYY" format for Release Date in countdown

## v1.0.8.1
- Removed AC15 dates and scheduler
- Added clear timeout on song add

## v.1.0.8
- Removed some AC15 dates
- Update queue finish event
- Countdown command

## v1.0.7
- Removed some AC15 dates
- Added "gg" to 8ball
- Possible fix for bot leaving voice channel after queue is empty

## v1.0.6
- Removed sunbreak command
- Removed some AC15 dates
- Updated AC15 message time to 6pm
- Integration with MongoDB
- Added Tier List (create, view, delete)

## v1.0.5.1
- Updated Psycho command for images

## v1.0.5
- Psycho command :)

## v1.0.4
- Removed filter command
- Tree command :)
- Re-added #enrollment reaction-roles
- Set Distube to leave after 5 minutes when queue ends

## v1.0.3
- Fixed TicTacToe tied messsage
- Fixed TicTacToe any user being able to click on buttons

## v1.0.2
- Updated TicTacToe

## v1.0.1
- Added coinflip
- Added wheel

## v1.0
- SerBot greeting
- Music activities (Play, pause, resume, stop, skip)
- Retrieve and display R6 statistics for a given username
- Retrieve Covid statistics for a given country
- Creates a rhombus
- WikiHow article searching
- Play Tic-Tac-Toe with another user in the server
- 8-Ball
- Monster Hunter Rise: Sunbreak countdown