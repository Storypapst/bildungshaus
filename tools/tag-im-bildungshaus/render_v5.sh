#!/bin/bash
# v5 render batch (Kita page v5, see CONTRACT_v5.md). Resumable: skips files that exist.
# Usage:  OUT=/path/to/renders setsid nohup ./render_v5.sh > render_v5.log 2>&1 &
# Writes $OUT/V5_DONE when finished. The washroom is unchanged from v3: copy waschraum_* from the v3 renders.
cd "$(dirname "$0")"
export PYTHONHASHSEED=0
OUT=${OUT:-renders}
LOG=$OUT/logs_v5
mkdir -p "$OUT" "$LOG"
rm -f "$OUT/V5_DONE"
skip(){ [ -f "$OUT/$1" ]; }
run(){ echo "$(date +%T) start $*" >> "$OUT/v5_status.txt"
       python3 rooms.py "$@" --out "$OUT" > "$LOG/$(echo $* | tr ' -' '__').txt" 2>&1
       echo "$(date +%T) done $? $*" >> "$OUT/v5_status.txt"; }
ROOMS=("aussen" "piazza 745" "piazza 800" "vorraum 800" "kaufladen" "kaufladen umbau" "kaufladen kochen"
       "vorraum 1400" "abholung" "piazza 1615")
# rooms (beauty)
for sv in "${ROOMS[@]}"; do
  set -- $sv; n=$1${2:+_$2}; skip $n.png || run --scene $1 --variant "$2" --res 1600 --samples 40
done
# close-ups: scene variant shot [output name]
for sv in "piazza 745z fenster" "piazza 745 fenster" "piazza 800 hubel" "piazza 800 schrank" "piazza 800 offen schrank_offen" \
          "kaufladen - kasse" "kaufladen umbau offen schrankwand_offen" "vorraum nacht licht vorraum_nacht" \
          "abholung - faecher" "abholung - wunsch"; do
  set -- $sv; v=$2; [ "$v" = "-" ] && v=""
  n=${4:-$1${v:+_$v}_$3}; skip $n.png || run --scene $1 --variant "$v" --shot $3 --res 1400 --samples 24
done
# hover masks
for sv in "${ROOMS[@]}"; do
  set -- $sv; n=$1${2:+_$2}; skip ${n}_id.png || run --scene $1 --variant "$2" --res 800 --pass id
done
touch "$OUT/V5_DONE"
