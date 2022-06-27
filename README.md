# Deep_sea_game
The link to play game https://nailgy.github.io/Deep_sea_game/
> **_NOTE:_** You should run the game on PC browser in fullscreen 

Deep Sea is a board game about sea divers that are hunting for the treasures.
In the begging of the game there is 25 oxygen for both players. Both of them start at submarine at the top, and as they play they sink deeper and deeper.

During your turn you can have following options:
- change the direction of your movement to up instead going down from start (can be done only once per game, and you can't later swap back to going down);
- roll the dices and move for the same amount of tiles. After this the oxygen is reduced by amount of treasures that you are holding right now;
- take the treasure that you are standing on (if it's not empty) and give turn to another player;
- or you can just pass your turn and give it to another player without taking treasure.

To perform such actions there are 4 buttons on the page: 'Move up', 'Roll Dices', 'Take Treasure' and 'Skip'. They are not active all the time - their clickability depends on game situation.

There 4 levels of treasures in the game - 1st, 2nd, 3rd and 4th. If you get a treasure of certain level and get back to the submarine with it, you get points based on how many treasure you have got and which level they was. 
You can get randomly
1 level: from 0 to 3 points;
2 level: from 4 to 7 points;
3 level: from 8 to 11 points;
4 level: from 12 to 15 points.

You will get this point ONLY if you will get back to the submarine with some treasures. 
Meanwhile, each turn the amount of oxygen will reduce during your's or your opponet's turn by amount of holded treasure. So think carefully before taking treasure.
If the oxygen reaches 0 or less, you can end your turn, and after ending all players that are not on submarine are getting drowned, therefore they obtain 0 points.

GOAL of the game - get the higher level treasures and save it by getting on submarine before oxygen is gone. Player who has more point wins the game. If the score is the same then there is no winner and the game is count as tie.

Some usefull information:
1. Indexing is going like a snake - first row from the left to right, second vice-versa, the next one again from left to right, and the last one again viceversa. So that the deepest tile is left bottom tile.
2. When you get some treasure, it helps you to go deeper but makes harder to get up. It means that when your direction is down, you move for (dices_value + number_of_treasures), and when your direction is up - bad news - you move for (dices_value - number_of_treasures). This value cannot be negative so you can't get backward to the direction you are going. In the worst scenario you will stay on the same tile.

During the game development I was trying to use OOP as much as possible to learn how it works on practice. There are 3 classes in script.js with EventListener on all buttons to make game respond to different actions.
