import { default as Solitare } from 'Src/Solitare';

describe('Solitare', function() {

  beforeAll(function() {
    document.body.style.margin = 0;
  });

  describe('Winning', function description() {
    it('should be defined as each of the piles having 13 cards', function should() {
      const game = new Solitare();
      const piles = [
        { childNodes: { length: 13 } },
        { childNodes: { length: 13 } },
        { childNodes: { length: 13 } },
        { childNodes: { length: 13 } }
      ];

      expect(game.rules.win(piles)).toBeTruthy();

    });
  })

});
