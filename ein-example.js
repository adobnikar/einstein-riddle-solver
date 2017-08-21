'use strict';

const EinLib = require('./ein-lib');

// the Brit lives in the red house
// the Swede keeps dogs as pets
// the Dane drinks tea
// the green house is on the left of the white house
// the green house's owner drinks coffee
// the person who smokes Pall Mall rears birds
// the owner of the yellow house smokes Dunhill
// the man living in the center house drinks milk
// the Norwegian lives in the first house
// the man who smokes Blends lives next to the one who keeps cats
// the man who keeps horses lives next to the man who smokes Dunhill
// the owner who smokes BlueMaster drinks beer
// the German smokes Prince
// the Norwegian lives next to the blue house
// the man who smokes blend has a neighbour who drinks water

let data = {
	positions: 5,
	cigarettes: ['Pall Mall', 'Dunhill', 'Blends', 'Prince', 'BlueMaster'],
	nations: ['Brit', 'Swede', 'Dane', 'Norwegian', 'German'],
	colors: ['red', 'green', 'white', 'yellow', 'blue'],
	pets: ['dogs', 'birds', 'cats', 'horses', 'fish'],
	drinks: ['tea', 'coffee', 'milk', 'beer', 'water'],
};

let ein = new EinLib.einConstructor();
ein.analyze(data);

// the Brit lives in the red house
ein.same('Brit', 'red');
// the Swede keeps dogs as pets
ein.same('Swede', 'dogs');
// the Dane drinks tea
ein.same('Dane', 'tea');
// the green house is on the left of the white house
ein.neighbours('green', 'white', true);
// the green house's owner drinks coffee
ein.same('green', 'coffee');
// the person who smokes Pall Mall rears birds
ein.same('Pall Mall', 'birds');
// the owner of the yellow house smokes Dunhill
ein.same('yellow', 'Dunhill');
// the man living in the center house drinks milk
ein.same(3, 'milk');
// the Norwegian lives in the first house
ein.same(1, 'Norwegian');
// the man who smokes Blends lives next to the one who keeps cats
ein.neighbours('Blends', 'cats');
// the man who keeps horses lives next to the man who smokes Dunhill
ein.neighbours('horses', 'Dunhill');
// the owner who smokes BlueMaster drinks beer
ein.same('BlueMaster', 'beer');
// the German smokes Prince
ein.same('German', 'Prince');
// the Norwegian lives next to the blue house
ein.neighbours('Norwegian', 'blue');
// the man who smokes Blends has a neighbour who drinks water
ein.neighbours('Blends', 'water');

ein.solve();

process.exit(0);