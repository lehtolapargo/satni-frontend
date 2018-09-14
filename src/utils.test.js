import {
  removeDuplicates,
  toJson,
  translationStems,
  translationExamples,
  normaliseDict,
  normaliseTermWiki,
  normaliseSDTerm,
  normaliseParadigm
} from './utils';

describe('Massage data from eXist', () => {
  it('Turn text in to JSON', () => {
    const gotQuery = '{{ "term" : "juolahtaa mieleen", "dict" : "finsmn", "lang" : "fin", "langs" : "smn" }}';
    const wantQuery = [{ 'term': 'juolahtaa mieleen', 'dict': 'finsmn', 'lang': 'fin', 'langs': 'smn' }];

    expect(toJson(gotQuery)).toEqual(wantQuery);
  });

  it('Peels the duplicate term away', () => {
    const gotAndro = [
      {
        'tg': [
          {
            'xml:lang': 'en',
            't': {
              '#text': 'androgyne',
              'pos': 'A'
            }
          }
        ],
        'dict': 'termwiki',
        'termwikiref': 'Servodatdieđa:androgyna'
      },
      {
        'tg': [
          {
            'xml:lang': 'en',
            't': {
              '#text': 'androgyne',
              'pos': 'A'
            }
          }
        ],
        'dict': 'termwiki',
        'termwikiref': 'Servodatdieđa:androgyna'
      }
    ];

    const halfAndro = [
      {
        'tg': [
          {
            'xml:lang': 'en',
            't': {
              '#text': 'androgyne',
              'pos': 'A'
            }
          }
        ],
        'dict': 'termwiki',
        'termwikiref': 'Servodatdieđa:androgyna'
      }
    ];

    expect(removeDuplicates(gotAndro)).toEqual(halfAndro);
  });

  it('Turns dict tg where t is an object into an array of stems', () => {
    const tgElement = {
      't': {
        'pos': 'N',
        '#text': 'jalka'
      },
      'xml:lang': 'fin',
      '#text': [
        '\n            ',
        '\n         '
      ]
    };

    expect(translationStems(tgElement))
  .toEqual([{'lemma': 'jalka', 'lang': 'fin', 'pos': 'N'}]);
  });

  it('Turns dict tg where t is an array into an array of stems', () => {
    const tgElement = {
      't': [
        {
          'pos': 'N',
          '#text': 'fot'
        },
        {
          'pos': 'N',
          '#text': 'bein'
        }
      ],
      'xml:lang': 'nob',
      '#text': [
        '\n            ',
        '\n            ',
        '\n         '
      ]
    };

    expect(translationStems(tgElement))
  .toEqual([{'lemma': 'fot', 'lang': 'nob', 'pos': 'N'},
            {'lemma': 'bein', 'lang': 'nob', 'pos': 'N'}]);
  });

  it('Turns dict xg where xg is an object into an array of examples', () => {
    const xgElement = {
      'x': 'original',
      'xt': 'translation'
    };

    expect(translationExamples(xgElement))
  .toEqual([{'x': 'original', 'xt': 'translation'}]);
  });

  it('Turns dict xg where xg is an array into an array of examples', () => {
    const xgElement = [
      {
        'x': 'orig1',
        'xt': 'trans1'
      },
      {
        'x': 'orig2',
        'xt': 'trans2'
      }
    ];

    expect(translationExamples(xgElement))
  .toEqual([{'x': 'orig1', 'xt': 'trans1'},
            {'x': 'orig2', 'xt': 'trans2'}]);
  });

  it('Normalise a dict article with examples into an object', () => {
    const existDict = {
      'expl': null,
      'term': 'oainnáhus',
      'def': null,
      'pos': 'N',
      'status': null,
      'termwikiref': '-1',
      'dict': 'smenob',
      'tg': {
        't': {
          '#text': 'syn',
          'pos': 'N'
        },
        'xg': [
          {
            'xt': 'Jeg prøver å vaske vekk det triste synet fra øynene mine, men det følger med likevel.',
            'x': 'Iskkan sihkkut váivves oainnáhusa iežan čalmmiin, muhto dat liikká čuovvu mu.',
            '#text': [
              '\n               ',
              '\n               ',
              '\n            '
            ]
          },
          {
            'xt': 'Jeg er det eneste hvite mennesket og selvfølgelig et syn.',
            'x': 'Lean áidna vilges olmmoš ja dieđusge oainnáhus.',
            '#text': [
              '\n               ',
              '\n               ',
              '\n            '
            ]
          }
        ],
        '#text': [
          '\n            ',
          '\n            ',
          '\n            ',
          '\n         '
        ],
        'xml:lang': 'nob'
      },
      'lang': 'sme'
    };
    const resultDict = {
      'translations': [
        {
          'pos': 'N',
          'lang': 'sme',
          'lemma': 'oainnáhus'
        },
        {
          'pos': 'N',
          'lang': 'nob',
          'lemma': 'syn'
        }
      ],
      'examples': [
        {
          'x': 'Iskkan sihkkut váivves oainnáhusa iežan čalmmiin, muhto dat liikká čuovvu mu.',
          'xt': 'Jeg prøver å vaske vekk det triste synet fra øynene mine, men det følger med likevel.'
        },
        {
          'x': 'Lean áidna vilges olmmoš ja dieđusge oainnáhus.',
          'xt': 'Jeg er det eneste hvite mennesket og selvfølgelig et syn.'
        }
      ]
    };

    expect(normaliseDict(existDict)).toEqual(resultDict);
  });

  it('Normalise a dict article without examples into an object', () => {
    const existDict = {
      'status': null,
      'pos': 'N',
      'dict': 'smefin',
      'tg': {
        't': {
          'pos': 'N',
          '#text': 'kalvoin verkonkudonnassa'
        },
        'xml:lang': 'fin',
        '#text': [
          '\n            ',
          '\n         '
        ]
      },
      'termwikiref': '-1',
      'expl': null,
      'term': 'guolladat',
      'lang': 'sme',
      'def': null
    };

    const resultDict = {
      'examples': [],
      'translations': [
        {
          'pos': 'N',
          'lang': 'sme',
          'lemma': 'guolladat'
        },
        {
          'pos': 'N',
          'lang': 'fin',
          'lemma': 'kalvoin verkonkudonnassa'
        }
      ]
    };

    expect(normaliseDict(existDict)).toEqual(resultDict);
  });

  it('Normalise a termwiki article into an object', () => {
    const termWiki = {
      'termwikiref': 'Servodatdieđa:androgyna',
      'expl': null,
      'pos': 'N',
      'category': 'Servodatdieđa',
      'def': null,
      'tg': [
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'en',
          't': {
            '#text': '\n        androgyne\n\n      ',
            'pos': 'N'
          }
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'smn',
          't': {
            '#text': '\n        androgynlâšvuotâ\n\n      ',
            'pos': 'A'
          }
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'smn',
          't': '\n        androgynvuotâ\n\n      '
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'se',
          't': {
            '#text': '\n        androgyna\n\n      ',
            'pos': 'N'
          }
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'fi',
          't': {
            '#text': '\n        androgyyni\n\n      ',
            'pos': 'N'
          }
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'smn',
          't': {
            '#text': '\n        androgyn\n\n      ',
            'pos': 'N'
          }
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'nb',
          't': {
            '#text': '\n        \n\n      ',
            'pos': 'N'
          }
        },
        {
          '#text': [
            '\n      ',
            '\n    '
          ],
          'xml:lang': 'sv',
          't': {
            '#text': '\n        \n\n      ',
            'pos': 'N'
          }
        }
      ],
      'term': 'androgyn',
      'status': null,
      'dict': 'termwiki'
    };

    const result = [
      {
        'lemma': 'androgyn',
        'lang': 'smn',
        'pos': 'N'
      },
      {
        'lemma': 'androgyne',
        'lang': 'eng',
        'pos': 'N'
      },
      {
        'lemma': 'androgynlâšvuotâ',
        'lang': 'smn',
        'pos': 'A'
      },
      {
        'lemma': 'androgynvuotâ',
        'lang': 'smn',
        'pos': undefined
      },
      {
        'lemma': 'androgyna',
        'lang': 'sme',
        'pos': 'N'
      },
      {
        'lemma': 'androgyyni',
        'lang': 'fin',
        'pos': 'N'
      }
    ];

    expect(normaliseTermWiki(termWiki)).toEqual(result);
  });

  it('Normalise a SDTerm article into an object', () => {
    const SDTerm = {
      'status': null,
      'pos': 'S',
      'dict': 'SD-terms',
      'tg': [
        {
          't': [
            'gođđinmuorra',
            'guolládat',
            'guolla'
          ],
          'xml:lang': 'sme',
          '#text': [
            '\n            ',
            '\n        '
          ]
        },
        {
          't': 'målepinne',
          'xml:lang': 'nor',
          '#text': [
            '\n            ',
            '\n        '
          ]
        }
      ],
      'termwikiref': '6035',
      'expl': null,
      'term': 'guolladat',
      'lang': 'sme',
      'def': null
    };
    const result = [
      {
        'lemma': 'gođđinmuorra',
        'pos': 'S',
        'lang': 'sme'
      },
      {
        'lemma': 'guolládat',
        'pos': 'S',
        'lang': 'sme'
      },
      {
        'lemma': 'guolla',
        'pos': 'S',
        'lang': 'sme'
      },
      {
        'lemma': 'målepinne',
        'pos': 'S',
        'lang': 'nob'
      }
    ];

    expect(normaliseSDTerm(SDTerm)).toEqual(result);
  });
});

describe('Massage data from the cgi-bin paradigm generator', () => {
  it('Turn smn nouns html into something usable', () => {
    const html = `<html>
                    <head>
                    <meta http-equiv="Content-type" content="text/html; charset=UTF-8">
    <title>Generating Inari Saami inflectional paradigms</title></head>
    <body>
      <a href="http://uit.no/">The University of Troms&oslash; ></a>
      <a href="http://giellatekno.uit.no/">Giellatekno ></a>
      <br></br>
      <p></p>
      <form action="http://gtweb.uit.no/cgi-bin/smi/smi.cgi" method="get" name="form3" target="_self">
        <table border="0" cellpadding="2" cellspacing="1">
          <tr>
            <td>
              <input name="text" size="50" type="text"></input>
              <select name="pos">
                <option value="Any">Any</option>
                <option value="N">Noun</option>
                <option value="V">Verb</option>
                <option value="Pron">Pronoun</option>
                <option value="A">Adjective</option>
                <option value="Adv">Adverb</option>
                <option value="Num">Numeral</option>
              </select>
            </td>
            <td>
              <a href="http://giellatekno.uit.no/">
                <img src="http://giellatekno.uit.no/images/project.png" style="border: none;" title="Giellatekno"></img>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <input name="mode" type="radio" value="minimal">Give minimal paradigm</input>
              <br></br>
              <input checked="1" name="mode" type="radio" value="standard">Standard</input>
              <br></br>
              <input name="mode" type="radio" value="full">Full paradigm</input>
              <br></br>
              <input name="lang" type="hidden" value="smn"></input>
              <input name="plang" type="hidden" value="eng"></input>
              <input name="action" type="hidden" value="paradigm"></input>
            </td>
          </tr>
          <tr>
            <td>
              <input type="submit" value="Send form"></input>
              <input type="reset" value="Reset form"></input>
            </td>
          </tr>
        </table>
      </form>
      <p>
        <b>kyeli: Noun (N)</b>
      </p>
      <table>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Nom</td>
          <td>
            <font color="red">kyeli</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Gen</td>
          <td>
            <font color="red">kyele</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Acc</td>
          <td>
            <font color="red">kyele</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Ill</td>
          <td>
            <font color="red">kuálán</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Loc</td>
          <td>
            <font color="red">kyeleest</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Com</td>
          <td>
            <font color="red">kuolijn</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Sg Abe</td>
          <td>
            <font color="red">kyelettáá</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Nom</td>
          <td>
            <font color="red">kyeleh</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Gen</td>
          <td>
            <font color="red">kuolij</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Acc</td>
          <td>
            <font color="red">kuolijd</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Ill</td>
          <td>
            <font color="red">kuolijd</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Loc</td>
          <td>
            <font color="red">kuolijn</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Com</td>
          <td>
            <font color="red">kuolijguin</font>
          </td>
          <td>
            <font color="red">kuolijgijn</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Pl Abe</td>
          <td>
            <font color="red">kuolijttáá</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Par</td>
          <td>
            <font color="red">kyellid</font>
          </td>
        </tr>
        <tr>
          <td>
            <font color="white">kyeli</font>
          </td>
          <td>N Ess</td>
          <td>
            <font color="red">kyellin</font>
          </td>
        </tr>
      </table>
      <hr></hr>
      <p>
        <br></br>
        <a href="http://giellatekno.uit.no/doc/lang/sme/docu-mini-smi-grammartags.html">Morphological tags</a></p>
    </body>
    </html>
    `;

    const want = {
      'Nom': {
        'Sg': ['kyeli'],
        'Pl': ['kyeleh']
      },
      'Gen': {
        'Sg': ['kyele'],
        'Pl': ['kuolij']
      },
      'Acc': {
        'Sg': ['kyele'],
        'Pl': ['kuolijd']
      },
      'Ill': {
        'Sg': ['kuálán'],
        'Pl': ['kuolijd']
      },
      'Loc': {
        'Sg': ['kyeleest'],
        'Pl': ['kuolijn']
      },
      'Com': {
        'Sg': ['kuolijn'],
        'Pl': ['kuolijguin', 'kuolijgijn']
      },
      'Abe': {
        'Sg': ['kyelettáá'],
        'Pl': ['kuolijttáá']
      },
      'Par': ['kyellid'],
      'Ess': ['kyellin']
    };

    expect(normaliseParadigm(html)).toEqual(want);
  });
});