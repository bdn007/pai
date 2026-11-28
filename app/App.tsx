import {useEffect, useMemo, useRef} from 'react';
import katex from 'katex';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
type BoardSpace = {
  name: string;
  purchasable: boolean;
};

const board: BoardSpace[] = [
  {name: 'Go', purchasable: false},
  {name: 'Mediterranean Avenue', purchasable: true},
  {name: 'Community Chest', purchasable: false},
  {name: 'Baltic Avenue', purchasable: true},
  {name: 'Income Tax', purchasable: false},
  {name: 'Reading Railroad', purchasable: true},
  {name: 'Oriental Avenue', purchasable: true},
  {name: 'Chance', purchasable: false},
  {name: 'Vermont Avenue', purchasable: true},
  {name: 'Connecticut Avenue', purchasable: true},
  {name: 'Jail / Just Visiting', purchasable: false},
  {name: 'St. Charles Place', purchasable: true},
  {name: 'Electric Company', purchasable: true},
  {name: 'States Avenue', purchasable: true},
  {name: 'Virginia Avenue', purchasable: true},
  {name: 'Pennsylvania Railroad', purchasable: true},
  {name: 'St. James Place', purchasable: true},
  {name: 'Community Chest', purchasable: false},
  {name: 'Tennessee Avenue', purchasable: true},
  {name: 'New York Avenue', purchasable: true},
  {name: 'Free Parking', purchasable: false},
  {name: 'Kentucky Avenue', purchasable: true},
  {name: 'Chance', purchasable: false},
  {name: 'Indiana Avenue', purchasable: true},
  {name: 'Illinois Avenue', purchasable: true},
  {name: 'B. & O. Railroad', purchasable: true},
  {name: 'Atlantic Avenue', purchasable: true},
  {name: 'Ventnor Avenue', purchasable: true},
  {name: 'Water Works', purchasable: true},
  {name: 'Marvin Gardens', purchasable: true},
  {name: 'Go to Jail', purchasable: false},
  {name: 'Pacific Avenue', purchasable: true},
  {name: 'North Carolina Avenue', purchasable: true},
  {name: 'Community Chest', purchasable: false},
  {name: 'Pennsylvania Avenue', purchasable: true},
  {name: 'Short Line Railroad', purchasable: true},
  {name: 'Chance', purchasable: false},
  {name: 'Park Place', purchasable: true},
  {name: 'Luxury Tax', purchasable: false},
  {name: 'Boardwalk', purchasable: true},
];

const properties = board
  .map((space, index) => ({...space, index}))
  .filter(space => space.purchasable);
const propertyBandColors: Record<number, string> = {
  1: '#8d5b3e',
  3: '#8d5b3e',
  6: '#8dc4dc',
  8: '#8dc4dc',
  9: '#8dc4dc',
  11: '#d77baf',
  13: '#d77baf',
  14: '#d77baf',
  16: '#ed9b42',
  18: '#ed9b42',
  19: '#ed9b42',
  21: '#cc5651',
  23: '#cc5651',
  24: '#cc5651',
  26: '#dfc34d',
  27: '#dfc34d',
  29: '#dfc34d',
  31: '#5f9e75',
  32: '#5f9e75',
  34: '#5f9e75',
  37: '#477bb5',
  39: '#477bb5',
};
const averageRuns = [
  {number: 3, seed: 2028},
  {number: 4, seed: 2029},
  {number: 6, seed: 2031},
  {number: 7, seed: 2032},
  {number: 8, seed: 2033},
  {number: 9, seed: 2034},
  {number: 10, seed: 2035},
  {number: 11, seed: 2036},
  {number: 12, seed: 2037},
  {number: 13, seed: 2038},
  {number: 14, seed: 2039},
  {number: 15, seed: 2040},
] as const;

function boardPosition(index: number) {
  if (index === 0) return {gridRow: '12 / 14', gridColumn: '12 / 14'};
  if (index === 10) return {gridRow: '12 / 14', gridColumn: '1 / 3'};
  if (index === 20) return {gridRow: '1 / 3', gridColumn: '1 / 3'};
  if (index === 30) return {gridRow: '1 / 3', gridColumn: '12 / 14'};
  if (index < 10) {
    const column = 12 - index;
    return {gridRow: '12 / 14', gridColumn: `${column} / ${column + 1}`};
  }
  if (index < 20) {
    const row = 22 - index;
    return {gridRow: `${row} / ${row + 1}`, gridColumn: '1 / 3'};
  }
  if (index < 30) {
    const column = index - 18;
    return {gridRow: '1 / 3', gridColumn: `${column} / ${column + 1}`};
  }
  const row = index - 28;
  return {gridRow: `${row} / ${row + 1}`, gridColumn: '12 / 14'};
}

function MonopolyBoard({
  averageProbabilities,
  mostVisited,
}: {
  averageProbabilities: number[];
  mostVisited: {name: string; probability: number};
}) {
  return (
    <section aria-labelledby="board-title" style={{marginTop: 24}}>
      <h2 id="board-title" style={{fontSize: 24}}>The 40-space board</h2>
      <p>
        Each square shows its average share of turns ending there in the 12 simulated runs. The
        colored bands identify property groups.
      </p>
      <div style={{overflowX: 'auto', padding: '4px 0'}}>
        <div
          role="group"
          aria-label="Monopoly board with the average simulated end-of-turn position share shown on each of its 40 spaces"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(13, minmax(0, 1fr))',
            gap: 2,
            width: '100%',
            minWidth: 832,
            aspectRatio: '1 / 1',
            padding: 2,
            boxSizing: 'border-box',
            background: '#17233b',
            border: '2px solid #17233b',
            borderRadius: 12,
          }}
        >
          <div
            style={{
              gridRow: '3 / 12',
              gridColumn: '3 / 12',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              padding: 20,
              textAlign: 'center',
              background: '#f5f2e8',
              borderRadius: 4,
            }}
          >
            <div style={{fontSize: 16, fontWeight: 700, letterSpacing: 2, color: '#355c8a'}}>
              12 SIMULATED RUNS
            </div>
            <div style={{fontSize: 32, fontWeight: 800, letterSpacing: 2}}>MONOPOLY</div>
            <p style={{fontSize: 16, margin: 0}}>
              Average end-of-turn position share across 480,000 training turns
            </p>
            <div
              style={{
                border: '2px solid #355c8a',
                borderRadius: 10,
                padding: '12px 20px',
                background: '#fff',
              }}
            >
              <div style={{fontSize: 16, fontWeight: 700, color: '#355c8a'}}>
                TOP PURCHASABLE PROPERTY
              </div>
              <div style={{fontSize: 20, fontWeight: 700, marginTop: 4}}>
                {mostVisited.name} — {(mostVisited.probability * 100).toFixed(2)}%
              </div>
            </div>
            <p style={{fontSize: 16, margin: 0}}>
              Pale squares are special spaces; colored bands mark property groups.
            </p>
          </div>
          {board.map((space, index) => {
            const isCorner = [0, 10, 20, 30].includes(index);
            const isHorizontal = index <= 10 || (index >= 20 && index <= 30);
            const bandColor = propertyBandColors[index];
            const probability = averageProbabilities[index];

            return (
              <div
                key={`${index}-${space.name}`}
                role="group"
                aria-label={`${space.name}: ${(probability * 100).toFixed(2)}% average simulated end-of-turn share`}
                style={{
                  ...boardPosition(index),
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  minWidth: 0,
                  minHeight: 0,
                  overflow: 'hidden',
                  padding: isCorner ? 8 : 4,
                  boxSizing: 'border-box',
                  background: isCorner ? '#e9edf3' : '#fff',
                  color: '#17233b',
                  textAlign: 'center',
                  lineHeight: 1.1,
                  borderRadius: 2,
                  ...(bandColor
                    ? {
                        [isHorizontal ? 'borderTop' : 'borderLeft']: `10px solid ${bandColor}`,
                      }
                    : {}),
                }}
              >
                <span style={{fontSize: 16, fontWeight: isCorner ? 700 : 600}}>
                  {space.name}
                </span>
                <span style={{fontSize: 16}}>{(probability * 100).toFixed(2)}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <p style={{fontSize: 16}}>
        Board layout reference:{' '}
        <a href="https://en.wikipedia.org/wiki/Template:Monopoly_board_detail">
          Wikipedia’s Monopoly board detail template
        </a>
        , adapted under CC BY-SA 4.0. The board graphic is text and color; no official board artwork is used.
      </p>
    </section>
  );
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function rollDie(random: () => number) {
  return 1 + Math.floor(random() * 6);
}

function nextRailroad(position: number) {
  return [5, 15, 25, 35].find(square => square > position) ?? 5;
}

function nextUtility(position: number) {
  return [12, 28].find(square => square > position) ?? 12;
}

function drawCard(
  position: number,
  random: () => number,
  kind: 'chance' | 'community',
): number {
  const card = Math.floor(random() * 16);

  if (kind === 'community') {
    if (card === 0) return 0;
    if (card === 1) return 10;
    return position;
  }

  if (card === 0) return 0;
  if (card === 1) return 24;
  if (card === 2) return 11;
  if (card === 3) return 10;
  if (card === 4) return 5;
  if (card === 5) return 39;
  if (card === 6 || card === 7) return nextRailroad(position);
  if (card === 8) return (position + 37) % 40;
  if (card === 9) return nextUtility(position);
  return position;
}

function resolveLanding(position: number, random: () => number) {
  if (position === 30) return {position: 10, inJail: true};

  if (position === 7 || position === 22 || position === 36) {
    const destination = drawCard(position, random, 'chance');
    if (destination === 10) return {position: 10, inJail: true};
    if (destination === 33) return resolveLanding(destination, random);
    return {position: destination, inJail: false};
  }

  if (position === 2 || position === 17 || position === 33) {
    const destination = drawCard(position, random, 'community');
    if (destination === 10) return {position: 10, inJail: true};
    return {position: destination, inJail: false};
  }

  return {position, inJail: false};
}

/** Log10 likelihood of observing this binomial count with probability p. */
function binomialScore(count: number, rolls: number, p: number) {
  if (p <= 0) return count === 0 ? 0 : -Infinity;
  if (p >= 1) return count === rolls ? 0 : -Infinity;
  return count * Math.log10(p) + (rolls - count) * Math.log10(1 - p);
}

function simulateRun(seed: number) {
  const totalRolls = 50000;
  const trainingRolls = 40000;
  const testRolls = totalRolls - trainingRolls;
  const random = seededRandom(seed);
  const trainingCounts = new Array(board.length).fill(0);
  const testCounts = new Array(board.length).fill(0);
  let position = 0;
  let consecutiveDoubles = 0;
  let inJail = false;
  let jailTurns = 0;

  for (let roll = 0; roll < totalRolls; roll += 1) {
    const dieOne = rollDie(random);
    const dieTwo = rollDie(random);
    const isDouble = dieOne === dieTwo;

    if (inJail) {
      jailTurns += 1;
      if (isDouble || jailTurns === 3) {
        inJail = false;
        jailTurns = 0;
        consecutiveDoubles = 0;
        const landing = resolveLanding((position + dieOne + dieTwo) % 40, random);
        position = landing.position;
        inJail = landing.inJail;
      }
    } else {
      if (isDouble) consecutiveDoubles += 1;
      else consecutiveDoubles = 0;

      if (consecutiveDoubles === 3) {
        position = 10;
        inJail = true;
        jailTurns = 0;
        consecutiveDoubles = 0;
      } else {
        const landing = resolveLanding((position + dieOne + dieTwo) % 40, random);
        position = landing.position;
        if (landing.inJail) {
          inJail = true;
          jailTurns = 0;
          consecutiveDoubles = 0;
        }
      }
    }

    if (roll < trainingRolls) trainingCounts[position] += 1;
    else testCounts[position] += 1;
  }

  const ranked = properties
    .map(property => {
      const count = trainingCounts[property.index];
      const testCount = testCounts[property.index];
      const probability = count / trainingRolls;
      return {
        name: property.name,
        probability,
        trainingCount: count,
        testCount,
        testScore: binomialScore(testCount, testRolls, probability),
      };
    })
    .sort((a, b) => b.probability - a.probability);
  const testScore = ranked.reduce((sum, property) => sum + property.testScore, 0);

  return {seed, ranked, testScore, trainingCounts, trainingRolls, testRolls};
}

function MathFormula({tex, label}: {tex: string; label: string}) {
  const formulaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = formulaRef.current;
    if (!element) return;

    katex.render(tex, element, {
      displayMode: true,
      output: 'mathml',
      throwOnError: false,
    });

    return () => element.replaceChildren();
  }, [tex]);

  return (
    <div
      role="math"
      aria-label={label}
      style={{fontSize: 24, overflowX: 'auto', padding: '8px 0', textAlign: 'center'}}
    >
      <span ref={formulaRef} />
    </div>
  );
}

export default function App() {
  const result = useMemo(() => {
    const runs = averageRuns.map(({number, seed}) => ({
      ...simulateRun(seed),
      number,
    }));
    const totalTrainingRolls = runs.reduce((sum, run) => sum + run.trainingRolls, 0);
    const averageProbabilities = board.map((_, index) =>
      runs.reduce((sum, run) => sum + run.trainingCounts[index], 0) / totalTrainingRolls,
    );
    const averageRanked = properties
      .map(property => {
        const count = runs.reduce((sum, run) => sum + run.trainingCounts[property.index], 0);
        return {name: property.name, probability: count / totalTrainingRolls};
      })
      .sort((a, b) => b.probability - a.probability);

    return {
      averageProbabilities,
      averageRanked,
      runs,
      run3: runs[0],
      run4: runs[1],
    };
  }, []);

  const top = result.averageRanked.slice(0, 10).map(property => ({
    name: property.name.replace(' Avenue', '').replace(' Place', ''),
    probability: Number((property.probability * 100).toFixed(2)),
  }));

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 18,
        maxWidth: 900,
        margin: '24px auto',
        padding: 16,
        color: '#17233b',
      }}
    >
      <h1 style={{fontSize: 32, marginBottom: 0}}>
        Which Monopoly properties are landed on most often?
      </h1>
      <p style={{fontSize: 16, fontStyle: 'italic', margin: '0 0 1em'}}>
        Old Camel's Final Project for the Probability for AI course
      </p>
      <p style={{fontSize: 16, margin: '0 0 1em'}}>November 2026</p>
      <p>
        Before the first run, my guess was <strong>Go</strong>, but Go is not purchasable and was
        excluded. After seeing that run's results, my revised guess for the second run was{' '}
        <strong>Connecticut Avenue</strong>. When <strong>B. &amp; O. Railroad</strong> ranked first
        again, I asked AI to review the simulation. The review found movement bugs, and I chose to
        exclude runs 1 and 2.
      </p>

      <MonopolyBoard
        averageProbabilities={result.averageProbabilities}
        mostVisited={result.averageRanked[0]}
      />

      <section style={{border: '2px solid #355c8a', borderRadius: 12, padding: 16, marginTop: 20}}>
        <h2 style={{fontSize: 24}}>Model story</h2>
        <p>
          For each purchasable property j, each training roll is a binomial trial: it lands on that
          property or it does not. The graph shows the average of each property's estimated
          probability across 12 simulations.
        </p>
        <MathFormula
          tex={String.raw`X_{jr} \sim \operatorname{Binomial}(n, p_j), \qquad \widehat{p}_{jr} = \frac{X_{jr}}{n}, \qquad \overline{p}_j = \frac{1}{12}\sum_{r=1}^{12}\widehat{p}_{jr}`}
          label="For property j in run r, X follows a binomial distribution with n rolls and probability p sub j; the run estimate is X divided by n; the graph shows the average of 12 run estimates."
        />
        <p>
          Here, n is the 40,000 training rolls in each simulation and X<sub>jr</sub> counts how
          many landed on property j in run r. The graph averages these 12 training estimates only.
        </p>
        <p>
          This binomial model is a simplification: consecutive Monopoly positions are related, so
          the model does not capture all dependence between rolls.
        </p>
        <p>
          It uses two dice, extra rolls for doubles, Jail after three consecutive doubles, and up to
          three rolls to leave Jail. Movement cards are selected uniformly from each 16-card pile,
          with replacement. Property ownership and rent do not affect movement, so they are not modeled.
        </p>
      </section>

      <section style={{marginTop: 24}}>
        <h2 style={{fontSize: 24}}>Top 10 average properties — 12 corrected runs</h2>
        <div
          role="img"
          aria-label="Bar chart of the ten purchasable properties with the highest average landing probability across 12 corrected simulation runs"
          style={{width: '100%', height: 380, display: 'flex', alignItems: 'stretch'}}
        >
          <div
            aria-hidden="true"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 16,
              padding: '0 2px',
              marginBottom: 72,
              whiteSpace: 'nowrap',
            }}
          >
            Average landing probability (%)
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top} margin={{top: 12, right: 16, bottom: 85, left: 0}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={90}
                  padding={{left: 40, right: 4}}
                  tick={{fontSize: 16}}
                />
                <YAxis width={40} tick={{fontSize: 16}} />
                <Tooltip
                  contentStyle={{fontSize: 16}}
                  itemStyle={{fontSize: 16}}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="probability" fill="#355c8a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p>
          The highest average is <strong>{result.averageRanked[0].name}</strong>, at{' '}
          <strong>{(result.averageRanked[0].probability * 100).toFixed(2)}%</strong>.
        </p>
      </section>

      <section style={{marginTop: 24}}>
        <h2 style={{fontSize: 24}}>Corrected run results</h2>
        <p>
          AI's review found errors in Chance and Jail movement. I chose to exclude runs 1 and 2.
          This table shows the top property in each of the 12 runs included in the average; each
          estimate uses 40,000 training rolls. Seed 2030 remains reference-only. These are simulated
          results, not real-game observations, and the 12-run average was chosen after earlier
          results had been seen. The separate table below shows held-out results from runs 3 and 4.
        </p>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', minWidth: 680, borderCollapse: 'collapse', fontSize: 16}}>
            <caption style={{textAlign: 'left', padding: '8px 0'}}>
              Held-out results from corrected runs 3 and 4 (not used in the average)
            </caption>
            <thead>
              <tr>
                <th scope="col" style={{textAlign: 'left', padding: 8, borderBottom: '2px solid #355c8a'}}>Run</th>
                <th scope="col" style={{textAlign: 'left', padding: 8, borderBottom: '2px solid #355c8a'}}>Top property</th>
                <th scope="col" style={{textAlign: 'right', padding: 8, borderBottom: '2px solid #355c8a'}}>Estimated probability</th>
                <th scope="col" style={{textAlign: 'right', padding: 8, borderBottom: '2px solid #355c8a'}}>Test count</th>
                <th scope="col" style={{textAlign: 'right', padding: 8, borderBottom: '2px solid #355c8a'}}>Test score (log10)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={{textAlign: 'left', padding: 8, borderBottom: '1px solid #b8c5d6'}}>
                  3 (seed {result.run3.seed})
                </th>
                <td style={{padding: 8, borderBottom: '1px solid #b8c5d6'}}>{result.run3.ranked[0].name}</td>
                <td style={{textAlign: 'right', padding: 8, borderBottom: '1px solid #b8c5d6'}}>
                  {(result.run3.ranked[0].probability * 100).toFixed(2)}%
                </td>
                <td style={{textAlign: 'right', padding: 8, borderBottom: '1px solid #b8c5d6'}}>
                  {result.run3.ranked[0].testCount} / {result.run3.testRolls.toLocaleString()}
                </td>
                <td style={{textAlign: 'right', padding: 8, borderBottom: '1px solid #b8c5d6'}}>
                  {result.run3.testScore.toFixed(2)}
                </td>
              </tr>
              <tr>
                <th scope="row" style={{textAlign: 'left', padding: 8}}>
                  4 (seed {result.run4.seed})
                </th>
                <td style={{padding: 8}}>{result.run4.ranked[0].name}</td>
                <td style={{textAlign: 'right', padding: 8}}>
                  {(result.run4.ranked[0].probability * 100).toFixed(2)}%
                </td>
                <td style={{textAlign: 'right', padding: 8}}>
                  {result.run4.ranked[0].testCount} / {result.run4.testRolls.toLocaleString()}
                </td>
                <td style={{textAlign: 'right', padding: 8}}>{result.run4.testScore.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{fontSize: 16}}>
          Higher test scores are better. The test counts were not used to estimate the training
          probabilities.
        </p>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 16}}>
            <caption style={{textAlign: 'left', padding: '8px 0'}}>
              Top property and training estimate for each run included in the average
            </caption>
            <thead>
              <tr>
                <th scope="col" style={{textAlign: 'left', padding: 8, borderBottom: '2px solid #355c8a'}}>Run</th>
                <th scope="col" style={{textAlign: 'right', padding: 8, borderBottom: '2px solid #355c8a'}}>Seed</th>
                <th scope="col" style={{textAlign: 'left', padding: 8, borderBottom: '2px solid #355c8a'}}>Top property</th>
                <th scope="col" style={{textAlign: 'right', padding: 8, borderBottom: '2px solid #355c8a'}}>Training estimate</th>
              </tr>
            </thead>
            <tbody>
              {result.runs.map(run => (
                <tr key={run.seed}>
                  <th scope="row" style={{textAlign: 'left', padding: 8, borderBottom: '1px solid #b8c5d6'}}>
                    {run.number}
                  </th>
                  <td style={{textAlign: 'right', padding: 8, borderBottom: '1px solid #b8c5d6'}}>{run.seed}</td>
                  <td style={{padding: 8, borderBottom: '1px solid #b8c5d6'}}>{run.ranked[0].name}</td>
                  <td style={{textAlign: 'right', padding: 8, borderBottom: '1px solid #b8c5d6'}}>
                    {(run.ranked[0].probability * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p style={{fontSize: 16, marginTop: 24}}>
        Data: 12 simulated runs of 50,000 dice rolls each; the graph uses their 480,000 training rolls
        only (seeds 2028, 2029, 2031–2040). No real players or network data were used.
      </p>
    </main>
  );
}
