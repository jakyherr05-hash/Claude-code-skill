#!/bin/sh
# Cut-line screening (TEST_PLAN 3.5 order = ANIMATION 9): one run each of A touch-slow, A wheel-fast, B wheel-fast, B wheel-slow per span per variant.
# Any failure = that variant FAILS (all 3 runs x all configs must hold). The first variant that survives gets the full protocol.
cd "$(dirname "$0")"
for spec in "cut1 cut=1" "cut2 cut=2" "cut3 cut=3" "cut4 cut=4" "cut5 cut=5" "cut6 cut=6" "cutonly6 cutonly=6"; do
  set -- $spec; v=$1; q=$2
  for s in t45 t67; do
    node $s.mjs --variant $v --query "$q" --configs A --runs 1 --only touch-slow
    node $s.mjs --variant $v --query "$q" --configs A --runs 1 --only wheel-fast
    node $s.mjs --variant $v --query "$q" --configs B --runs 1 --only wheel-slow
    node $s.mjs --variant $v --query "$q" --configs B --runs 1 --only wheel-fast
  done
done
