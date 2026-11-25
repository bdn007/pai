# Your 60-second video

## Script (about 140 spoken words)

**0 to 15 seconds — Question**

Which purchasable Monopoly property is landed on most? I first guessed Go, which is not purchasable, then Connecticut Avenue for run two. After B. & O. ranked first again, I asked AI to review the simulation. AI found movement bugs; I chose to exclude runs one and two.

**15 to 40 seconds — Model**

The model treats each roll as a binomial trial per property. I average training estimates from 12 corrected runs: seeds 2028, 2029, and 2031 through 2040. Seed 2030 is reference-only. Each run has 40,000 training and 10,000 locked test rolls. Cards are sampled uniformly from their 16-card piles.

Show the average top-ten chart while explaining the model.

**40 to 60 seconds — Results and test**

Illinois Avenue ranks first in the average, at 3.01 percent. It also led runs three and four at 3.00 and 3.08 percent, appearing 286 and 294 times in their test sets. Their scores were minus 14,179.82 and minus 14,153.25 log10. These are simulations; I chose the average after seeing earlier results.

Show the app chart and the separate held-out results while reading the result. Add captions if possible.
