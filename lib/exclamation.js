const bad =
[ 'Bad show'
, 'Buggerations'
, 'That\'s not cricket'
, 'Crum-a-gackle'
];

const good =
[ 'Jolly good show'
, 'Huzzah'
, 'Spiffing'
, 'Splendid'
];

module.exports =
{ bad: () =>
  { return bad
    [ Math.floor
      ( Math.random() * bad.length
      )
    ];
  }
, good: () =>
  { return good
    [ Math.floor
      ( Math.random() * good.length
      )
    ];   
  }
}