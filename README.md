# Einstein’s riddle solver
Einstein’s riddle solver in Node.js.
For example see `ein-example.js` file.
Tested with **node v7.6.0**.

```bash
# Alternatively you can run `npm install`
yarn
node ein-example.js
```
## Einstein's riddle instructions

**The situation**

There are 5 houses in five different colors.
In each house lives a person with a different nationality.
These five owners drink a certain type of beverage, smoke a certain brand of cigar and keep a certain pet.
No owners have the same pet, smoke the same brand of cigar or drink the same beverage.
The question is: Who owns the fish?

**Hints**

- the Brit lives in the red house,
- the Swede keeps dogs as pets,
- the Dane drinks tea,
- the green house is on the left of the white house,
- the green house's owner drinks coffee,
- the person who smokes Pall Mall rears birds,
- the owner of the yellow house smokes Dunhill,
- the man living in the center house drinks milk,
- the Norwegian lives in the first house,
- the man who smokes blends lives next to the one who keeps cats,
- the man who keeps horses lives next to the man who smokes Dunhill,
- the owner who smokes BlueMaster drinks beer,
- the German smokes Prince,
- the Norwegian lives next to the blue house,
- the man who smokes blend has a neighbor who drinks water.

Einstein wrote this riddle this century. He said that 98% of the world could not solve it :)

## ** SPOILER ALERT! **

## Example output

```bash
positions  cigarettes  nations    colors  pets    drinks
---------  ----------  ---------  ------  ------  ------
1          Dunhill     Norwegian  yellow  cats    water 
2          Blends      Dane       blue    horses  tea   
3          Pall Mall   Brit       red     birds   milk  
4          Prince      German     green   fish    coffee
5          BlueMaster  Swede      white   dogs    beer  
```